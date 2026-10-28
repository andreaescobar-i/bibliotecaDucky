/*----
 * Programa: solicitudControlador.js
 * Objetivo: Tramitar solicitudes de compra de libros: peticiones, partidas, envío a Tesorería
 *           con presupuesto mensual, consulta por folio, recepciones completas o parciales
 *           (HUCOM01), autorización simulada de Tesorería y entrega al catálogo (front)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import { ejecutarTransaccion } from '../config/db.js';
import * as solicitudModelo from '../modelos/solicitudModelo.js';
import * as recepcionModelo from '../modelos/recepcionModelo.js';
import * as presupuestoModelo from '../modelos/presupuestoModelo.js';
import * as bitacoraModelo from '../modelos/bitacoraModelo.js';
import * as tesoreriaServicio from '../servicios/tesoreriaServicio.js';
import * as solicitudVista from '../vistas/solicitudVista.js';
import ErrorAplicacion from '../utilidades/errorAplicacion.js';
import { limpiarTexto, tieneCampo } from '../utilidades/validacion.js';
import { normalizarComparacion } from '../utilidades/reglasCatalogo.js';
import { reloj, formatearFechaLocal } from '../utilidades/reloj.js';
import {
  TEXTO_ESTADO_SOLICITUD,
  ESTADOS_RECEPCION,
  validarPartidas,
  leerFechaIso,
} from '../utilidades/reglasCompras.js';

// Mensajes de HUCOM01 y del front (src/purchases.ts)
const MENSAJES = Object.freeze({
  CAMPOS_OBLIGATORIOS: 'Complete los campos obligatorios señalados',
  SIN_LIBROS: 'Selecciona al menos un libro para solicitar su compra',
  DATOS_INCOMPLETOS: 'Completa los datos de los libros señalados',
  NO_ENCONTRADA: 'Solicitud no encontrada',
  REMITIDA: 'Solicitud remitida a Tesorería',
  ENVIO_NO_CONFIRMADO:
    'No se pudo confirmar el envío a Tesorería; la solicitud no se marcó como enviada',
  NO_RECIBIBLE: 'La solicitud debe estar enviada y tener material pendiente.',
  FECHA_INVALIDA: 'Captura una fecha de recepción válida.',
  PARTIDA_AJENA: 'La partida no pertenece a la solicitud.',
  CANTIDAD_INVALIDA: 'Cada cantidad debe ser entera, no negativa y no superar lo pendiente.',
  SIN_RECEPCION: 'Recibe al menos un ejemplar.',
  RECEPCION_COMPLETA: 'Recepción completa registrada',
  RECEPCION_PARCIAL: 'Recepción parcial registrada',
});

/**
 * Objetivo: Obtener la solicitud indicada en la URL (/solicitudes/:folio).
 * @param {Object} req - Petición HTTP.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<Object>} Solicitud encontrada.
 * Limitaciones: Lanza ErrorAplicacion 404 sin mostrar datos de otra solicitud (escenario 5).
 */
async function obtenerSolicitudDeRuta(req, cliente = undefined) {
  const solicitud = await solicitudModelo.obtenerSolicitudPorFolio(
    limpiarTexto(req.params.folio),
    cliente,
  );
  if (!solicitud) {
    throw new ErrorAplicacion(404, MENSAJES.NO_ENCONTRADA);
  }
  return solicitud;
}

/**
 * Objetivo: Validar y normalizar las partidas recibidas.
 * @param {unknown} partidasCapturadas - Lista de partidas.
 * @returns {Object[]} Partidas válidas numeradas desde 1.
 * Limitaciones: Lanza ErrorAplicacion 400 indicando la partida y el campo incompleto.
 */
function leerPartidas(partidasCapturadas) {
  const { partidas, errores } = validarPartidas(partidasCapturadas);
  if (errores.length > 0) {
    throw new ErrorAplicacion(400, MENSAJES.DATOS_INCOMPLETOS, { partidas: errores });
  }
  return partidas;
}

/**
 * Objetivo: Validar los datos de una petición o solicitud nueva (campos de "Nueva petición" y
 *   de la solicitud con partidas del front).
 * @param {Object} cuerpo - Cuerpo de la petición.
 * @returns {Object} Datos limpios: titulo, area, cantidad, costo, prioridad, justificacion y
 *   partidas (null si no se capturaron).
 */
function leerDatosSolicitud(cuerpo) {
  const partidas = tieneCampo(cuerpo, 'partidas') ? leerPartidas(cuerpo.partidas) : null;
  const tienePartidas = partidas !== null && partidas.length > 0;
  const area = limpiarTexto(cuerpo.solicitante);
  const titulo =
    limpiarTexto(cuerpo.titulo) ||
    (tienePartidas ? partidas.map((partida) => partida.titulo).join(' / ') : '');
  const cantidad = tienePartidas
    ? partidas.reduce((total, partida) => total + partida.cantidad, 0)
    : Number(cuerpo.cantidad);

  const camposFaltantes = [];
  if (!titulo) {
    camposFaltantes.push('Título solicitado');
  }
  if (!area) {
    camposFaltantes.push('Solicitante o facultad');
  }
  if (!Number.isSafeInteger(cantidad) || cantidad <= 0) {
    camposFaltantes.push('Cantidad de ejemplares solicitados');
  }
  if (camposFaltantes.length > 0) {
    throw new ErrorAplicacion(400, MENSAJES.CAMPOS_OBLIGATORIOS, { campos: camposFaltantes });
  }

  const textoCosto = limpiarTexto(String(cuerpo.costoEstimado ?? ''));
  const costo = textoCosto === '' ? null : Number(textoCosto);
  if (costo !== null && (!Number.isFinite(costo) || costo < 0)) {
    throw new ErrorAplicacion(400, 'El costo estimado debe ser un número mayor o igual a cero', {
      campos: ['Costo total estimado del lote (MXN)'],
    });
  }
  return {
    titulo,
    autor: limpiarTexto(cuerpo.autor) || null,
    area,
    cantidad,
    costo,
    prioridad: limpiarTexto(cuerpo.prioridad) || null,
    justificacion: limpiarTexto(cuerpo.justificacion) || null,
    partidas,
  };
}

/**
 * Objetivo: Remitir una solicitud a Tesorería (HUCOM01 escenarios 1 y 2). Solo con la
 *   confirmación de Tesorería se guarda como enviada, con su fecha y el presupuesto del mes.
 * @param {Object} req - Petición HTTP (operador e IP).
 * @param {string} folio - Folio de la solicitud.
 * @returns {Promise<{ solicitud: Object, presupuesto: Object|null }>} Solicitud enviada y
 *   presupuesto del periodo.
 */
async function enviarATesoreria(req, folio) {
  const solicitud = await solicitudModelo.obtenerSolicitudPorFolio(folio);
  if (solicitud.estado !== 'POR_AUTORIZAR') {
    throw new ErrorAplicacion(
      409,
      `La solicitud ya fue enviada a Tesorería (estado: ${TEXTO_ESTADO_SOLICITUD[solicitud.estado]})`,
    );
  }
  if (solicitud.partidas.length === 0) {
    throw new ErrorAplicacion(400, MENSAJES.SIN_LIBROS);
  }

  const fechaEnvio = reloj.ahora();
  const presupuesto = await presupuestoModelo.obtenerPresupuestoDelPeriodo(
    fechaEnvio.getFullYear(),
    fechaEnvio.getMonth() + 1,
  );
  const respuestaTesoreria = await tesoreriaServicio.enviarSolicitud({
    folio: solicitud.folio,
    solicitante: solicitud.area_solicitante,
    costoEstimado: solicitud.costo_total_estimado_mxn,
    partidas: solicitud.partidas,
  });
  if (!respuestaTesoreria.confirmado) {
    await bitacoraModelo.registrarEvento({
      actorUsuarioId: req.usuario.usuario_id,
      accion: 'ENVIO_SOLICITUD',
      entidad: 'solicitud',
      claveRegistro: solicitud.folio,
      ip: req.ip,
      resultado: bitacoraModelo.RESULTADOS.ERROR,
    });
    throw new ErrorAplicacion(503, MENSAJES.ENVIO_NO_CONFIRMADO, { folio: solicitud.folio });
  }

  await ejecutarTransaccion(async (cliente) => {
    await solicitudModelo.bloquearSolicitud(cliente, solicitud.solicitud_adquisicion_id);
    await solicitudModelo.marcarEnviada(
      cliente,
      solicitud.solicitud_adquisicion_id,
      fechaEnvio,
      presupuesto?.presupuesto_mensual_id ?? null,
    );
    await bitacoraModelo.registrarEvento(
      {
        actorUsuarioId: req.usuario.usuario_id,
        accion: 'ENVIO_SOLICITUD',
        entidad: 'solicitud',
        claveRegistro: solicitud.folio,
        detalle: { acuse: respuestaTesoreria.acuse, presupuestoInformado: Boolean(presupuesto) },
        ip: req.ip,
      },
      cliente,
    );
  });

  return {
    solicitud: await solicitudModelo.obtenerSolicitudPorFolio(solicitud.folio),
    // Se vuelve a leer para que lo comprometido ya incluya esta solicitud
    presupuesto: presupuesto
      ? await presupuestoModelo.obtenerPresupuestoPorId(presupuesto.presupuesto_mensual_id)
      : null,
  };
}

/**
 * Objetivo: Listar solicitudes; query "estado" con los textos del front o "Todos".
 * @param {Object} req - Petición HTTP.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function getSolicitudes(req, res, next) {
  try {
    const textoEstado = normalizarComparacion(limpiarTexto(req.query.estado));
    let estado = null;
    if (textoEstado && textoEstado !== 'TODOS') {
      estado =
        Object.keys(TEXTO_ESTADO_SOLICITUD).find(
          (clave) =>
            clave === textoEstado ||
            normalizarComparacion(TEXTO_ESTADO_SOLICITUD[clave]) === textoEstado,
        ) ?? null;
      if (!estado) {
        throw new ErrorAplicacion(400, 'Estado de solicitud no registrado', { campos: ['Estado'] });
      }
    }
    const solicitudes = await solicitudModelo.listarSolicitudes(estado);
    res.json(solicitudVista.formatearLista(solicitudes));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Consultar el presupuesto de compras del mes en curso: autorizado, comprometido y
 *   disponible, o "Presupuesto no informado" si no está registrado (tarjeta de Compras).
 * @param {Object} _req - Petición HTTP (no se usa).
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function getPresupuestoActual(_req, res, next) {
  try {
    const hoy = reloj.ahora();
    const presupuesto = await presupuestoModelo.obtenerPresupuestoDelPeriodo(
      hoy.getFullYear(),
      hoy.getMonth() + 1,
    );
    res.json(solicitudVista.formatearPresupuestoActual(presupuesto));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Listar los lotes ya entregados al encargado del catálogo (diálogo "Recibidos de
 *   compras" del front). Es de solo lectura para que el personal del catálogo vea lo que debe
 *   registrar sin tener permisos de compras.
 * @param {Object} _req - Petición HTTP (no se usa).
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function getEntregadasCatalogo(_req, res, next) {
  try {
    const solicitudes = await solicitudModelo.listarSolicitudes('ENTREGADO_CATALOGO');
    res.json(solicitudVista.formatearLista(solicitudes));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Consultar una solicitud por folio con partidas, cantidades recibidas y pendientes,
 *   recepciones, historial y presupuesto del periodo (HUCOM01 escenarios 4 y 5). No modifica
 *   la solicitud.
 * @param {Object} req - Petición HTTP.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function getSolicitud(req, res, next) {
  try {
    const solicitud = await obtenerSolicitudDeRuta(req);
    const extra = {
      recepciones: await recepcionModelo.listarRecepcionesDeSolicitud(
        solicitud.solicitud_adquisicion_id,
      ),
      historial: await bitacoraModelo.listarEventosDeRegistro('solicitud', solicitud.folio),
    };
    if (solicitud.fecha_envio) {
      extra.presupuesto = solicitud.presupuesto_mensual_id
        ? await presupuestoModelo.obtenerPresupuestoPorId(solicitud.presupuesto_mensual_id)
        : null;
    }
    res.json(solicitudVista.formatearDetalle(solicitud, extra));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Registrar una petición "Por autorizar" (botón "Nueva petición" del front) o, con
 *   enviar: true y partidas, preparar la solicitud y remitirla a Tesorería en un solo paso.
 * @param {Object} req - Petición HTTP. Cuerpo: titulo, solicitante, cantidad, costoEstimado?,
 *   justificacion?, prioridad?, partidas? [{ titulo, autor, editorial, isbn?, cantidad }],
 *   enviar?.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function postSolicitud(req, res, next) {
  try {
    const cuerpo = req.body ?? {};
    const debeEnviar = cuerpo.enviar === true;
    // Escenario 2: sin libros no se envía; se avisa antes de revisar los demás campos
    if (debeEnviar && !(Array.isArray(cuerpo.partidas) && cuerpo.partidas.length > 0)) {
      throw new ErrorAplicacion(400, MENSAJES.SIN_LIBROS);
    }
    const datos = leerDatosSolicitud(cuerpo);

    const { folio } = await ejecutarTransaccion(async (cliente) => {
      const creada = await solicitudModelo.crearSolicitud(cliente, {
        ...datos,
        solicitanteId: req.usuario.usuario_id,
      });
      if (datos.partidas?.length > 0) {
        await solicitudModelo.reemplazarPartidas(
          cliente,
          creada.solicitud_adquisicion_id,
          datos.partidas,
          {
            titulo: datos.titulo,
            cantidad: datos.cantidad,
          },
        );
      }
      await bitacoraModelo.registrarEvento(
        {
          actorUsuarioId: req.usuario.usuario_id,
          accion: 'CREACION_SOLICITUD',
          entidad: 'solicitud',
          claveRegistro: creada.folio,
          detalle: { titulo: datos.titulo, partidas: datos.partidas?.length ?? 0 },
          ip: req.ip,
        },
        cliente,
      );
      return creada;
    });

    if (!debeEnviar) {
      const solicitud = await solicitudModelo.obtenerSolicitudPorFolio(folio);
      res
        .status(201)
        .json(solicitudVista.formatearOperacion('Petición registrada', solicitud, { folio }));
      return;
    }
    const { solicitud, presupuesto } = await enviarATesoreria(req, folio);
    res
      .status(201)
      .json(
        solicitudVista.formatearOperacion(MENSAJES.REMITIDA, solicitud, { folio, presupuesto }),
      );
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Guardar las partidas de una solicitud "Por autorizar", conservando lo capturado
 *   para seguir agregando partidas antes de enviarla.
 * @param {Object} req - Petición HTTP. Cuerpo: partidas [{ titulo, autor, editorial, isbn?,
 *   cantidad }].
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function putPartidas(req, res, next) {
  try {
    const partidas = leerPartidas(req.body?.partidas);
    const folio = await ejecutarTransaccion(async (cliente) => {
      const solicitud = await obtenerSolicitudDeRuta(req, cliente);
      await solicitudModelo.bloquearSolicitud(cliente, solicitud.solicitud_adquisicion_id);
      if (solicitud.estado !== 'POR_AUTORIZAR') {
        throw new ErrorAplicacion(
          409,
          'Solo se pueden modificar las partidas de una solicitud por autorizar',
        );
      }
      const totales =
        partidas.length > 0
          ? {
              titulo: partidas.map((partida) => partida.titulo).join(' / '),
              cantidad: partidas.reduce((total, partida) => total + partida.cantidad, 0),
            }
          : { titulo: solicitud.titulo_solicitado, cantidad: solicitud.cantidad };
      await solicitudModelo.reemplazarPartidas(
        cliente,
        solicitud.solicitud_adquisicion_id,
        partidas,
        totales,
      );
      await bitacoraModelo.registrarEvento(
        {
          actorUsuarioId: req.usuario.usuario_id,
          accion: 'CAMBIO_PARTIDAS',
          entidad: 'solicitud',
          claveRegistro: solicitud.folio,
          detalle: { partidas: partidas.length },
          ip: req.ip,
        },
        cliente,
      );
      return solicitud.folio;
    });
    const solicitud = await solicitudModelo.obtenerSolicitudPorFolio(folio);
    res.json(solicitudVista.formatearOperacion('Partidas guardadas', solicitud));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Enviar a Tesorería una solicitud "Por autorizar" con sus partidas (botón "Enviar a
 *   Tesorería" / "Confirmar revisión" del front).
 * @param {Object} req - Petición HTTP.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function postEnvio(req, res, next) {
  try {
    const { folio } = await obtenerSolicitudDeRuta(req);
    const { solicitud, presupuesto } = await enviarATesoreria(req, folio);
    res.json(
      solicitudVista.formatearOperacion(MENSAJES.REMITIDA, solicitud, { folio, presupuesto }),
    );
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Registrar la respuesta de Tesorería (simulada) a una solicitud enviada: autorizar o
 *   rechazar. Corresponde a los botones "Autorizar" y "Rechazar" del front.
 * @param {Object} req - Petición HTTP. Cuerpo: decision ("Autorizar" o "Rechazar").
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function postAutorizacion(req, res, next) {
  try {
    const decision = normalizarComparacion(limpiarTexto(req.body?.decision));
    const ESTADO_POR_DECISION = { AUTORIZAR: 'AUTORIZADO', RECHAZAR: 'RECHAZADO' };
    const estadoNuevo = ESTADO_POR_DECISION[decision];
    if (!estadoNuevo) {
      throw new ErrorAplicacion(400, 'La decisión debe ser Autorizar o Rechazar', {
        campos: ['Decisión'],
      });
    }
    const folio = await ejecutarTransaccion(async (cliente) => {
      const solicitud = await obtenerSolicitudDeRuta(req, cliente);
      await solicitudModelo.bloquearSolicitud(cliente, solicitud.solicitud_adquisicion_id);
      if (solicitud.estado !== 'EN_TESORERIA') {
        throw new ErrorAplicacion(409, 'Solo se resuelven solicitudes que están en Tesorería');
      }
      await solicitudModelo.actualizarEstado(
        cliente,
        solicitud.solicitud_adquisicion_id,
        estadoNuevo,
        {
          fechaResolucion: reloj.ahora(),
        },
      );
      await bitacoraModelo.registrarEvento(
        {
          actorUsuarioId: req.usuario.usuario_id,
          accion: 'RESOLUCION_TESORERIA',
          entidad: 'solicitud',
          claveRegistro: solicitud.folio,
          detalle: { decision: estadoNuevo, simulada: true },
          ip: req.ip,
        },
        cliente,
      );
      return solicitud.folio;
    });
    const solicitud = await solicitudModelo.obtenerSolicitudPorFolio(folio);
    const mensaje = estadoNuevo === 'AUTORIZADO' ? 'Petición autorizada' : 'Solicitud rechazada';
    res.json(solicitudVista.formatearOperacion(mensaje, solicitud));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Leer las cantidades recibidas por partida, como lista [{ numero, cantidad }] o como
 *   objeto { "1": 2 } (igual que el front).
 * @param {Object} cuerpo - Cuerpo de la petición.
 * @returns {Map<number, number>} Cantidad recibida por número de partida.
 */
function leerCantidadesRecibidas(cuerpo) {
  const cantidades = new Map();
  if (Array.isArray(cuerpo.partidas)) {
    for (const partida of cuerpo.partidas) {
      cantidades.set(Number(partida?.numero), Number(partida?.cantidad));
    }
  } else if (cuerpo.cantidades && typeof cuerpo.cantidades === 'object') {
    for (const [numero, cantidad] of Object.entries(cuerpo.cantidades)) {
      cantidades.set(Number(numero), Number(cantidad));
    }
  }
  return cantidades;
}

/**
 * Objetivo: Registrar la recepción de libros comprados, completa o parcial (HUCOM01 escenarios
 *   6 y 7). Acumula lo recibido sin exceder lo solicitado y no crea fichas, ejemplares ni
 *   etiquetas.
 * @param {Object} req - Petición HTTP. Cuerpo: fechaRecepcion (AAAA-MM-DD) y partidas
 *   [{ numero, cantidad }] o cantidades { numero: cantidad }.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function postRecepcion(req, res, next) {
  try {
    const cuerpo = req.body ?? {};
    const fecha = leerFechaIso(cuerpo.fechaRecepcion ?? cuerpo.fecha);
    const cantidades = leerCantidadesRecibidas(cuerpo);

    const resultado = await ejecutarTransaccion(async (cliente) => {
      const solicitud = await obtenerSolicitudDeRuta(req, cliente);
      await solicitudModelo.bloquearSolicitud(cliente, solicitud.solicitud_adquisicion_id);
      if (!ESTADOS_RECEPCION.includes(solicitud.estado)) {
        throw new ErrorAplicacion(409, MENSAJES.NO_RECIBIBLE);
      }
      // La fecha no puede ser futura ni anterior al envío a Tesorería
      const hoy = formatearFechaLocal(reloj.ahora());
      const fechaEnvio = formatearFechaLocal(new Date(solicitud.fecha_envio));
      if (!fecha || fecha > hoy || fecha < fechaEnvio) {
        throw new ErrorAplicacion(400, MENSAJES.FECHA_INVALIDA, { campos: ['Fecha de recepción'] });
      }

      const partidasPorNumero = new Map(
        solicitud.partidas.map((partida) => [partida.numero, partida]),
      );
      if ([...cantidades.keys()].some((numero) => !partidasPorNumero.has(numero))) {
        throw new ErrorAplicacion(400, MENSAJES.PARTIDA_AJENA);
      }
      const invalidas = [...cantidades.entries()]
        .filter(([numero, cantidad]) => {
          const partida = partidasPorNumero.get(numero);
          const pendiente = partida.cantidad_solicitada - partida.cantidad_recibida;
          return !Number.isSafeInteger(cantidad) || cantidad < 0 || cantidad > pendiente;
        })
        .map(([numero]) => numero);
      if (invalidas.length > 0) {
        throw new ErrorAplicacion(400, MENSAJES.CANTIDAD_INVALIDA, { partidas: invalidas });
      }
      const recibidas = [...cantidades.entries()].filter(([, cantidad]) => cantidad > 0);
      if (recibidas.length === 0) {
        throw new ErrorAplicacion(400, MENSAJES.SIN_RECEPCION);
      }

      const totalRecibido = recibidas.reduce((total, [, cantidad]) => total + cantidad, 0);
      const recepcion = await recepcionModelo.crearRecepcion(cliente, {
        solicitudId: solicitud.solicitud_adquisicion_id,
        usuarioId: req.usuario.usuario_id,
        cantidad: totalRecibido,
        fecha,
      });
      for (const [numero, cantidad] of recibidas) {
        const partida = partidasPorNumero.get(numero);
        await recepcionModelo.agregarPartida(
          cliente,
          recepcion.recepcion_id,
          partida.partida_id,
          cantidad,
        );
        await solicitudModelo.sumarRecibido(cliente, partida.partida_id, cantidad);
      }

      const quedaPendiente = solicitud.partidas.some(
        (partida) =>
          partida.cantidad_solicitada -
            partida.cantidad_recibida -
            (cantidades.get(partida.numero) ?? 0) >
          0,
      );
      const estadoNuevo = quedaPendiente ? 'RECIBIDO_PARCIAL' : 'RECIBIDO';
      await solicitudModelo.actualizarEstado(
        cliente,
        solicitud.solicitud_adquisicion_id,
        estadoNuevo,
      );
      await bitacoraModelo.registrarEvento(
        {
          actorUsuarioId: req.usuario.usuario_id,
          accion: 'RECEPCION',
          entidad: 'solicitud',
          claveRegistro: solicitud.folio,
          detalle: {
            folioRecepcion: recepcion.folio,
            fecha,
            partidas: recibidas.map(([numero, cantidad]) => ({ numero, cantidad })),
          },
          ip: req.ip,
        },
        cliente,
      );
      return {
        folio: solicitud.folio,
        folioRecepcion: recepcion.folio,
        quedaPendiente,
        material: recibidas.map(([numero, cantidad]) => {
          const partida = partidasPorNumero.get(numero);
          return {
            numero,
            titulo: partida.titulo,
            autor: partida.autor,
            editorial: partida.editorial,
            isbn: partida.isbn,
            cantidad,
          };
        }),
      };
    });

    const solicitud = await solicitudModelo.obtenerSolicitudPorFolio(resultado.folio);
    const mensaje = resultado.quedaPendiente
      ? MENSAJES.RECEPCION_PARCIAL
      : MENSAJES.RECEPCION_COMPLETA;
    res.status(201).json(
      solicitudVista.formatearOperacion(mensaje, solicitud, {
        folioRecepcion: resultado.folioRecepcion,
        materialRecibido: resultado.material,
      }),
    );
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Registrar la entrega al encargado del catálogo de un lote recibido completo (botón
 *   "Confirmar entrega a catálogo" del front). No crea fichas, ejemplares ni etiquetas.
 * @param {Object} req - Petición HTTP.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function postEntregaCatalogo(req, res, next) {
  try {
    const folio = await ejecutarTransaccion(async (cliente) => {
      const solicitud = await obtenerSolicitudDeRuta(req, cliente);
      await solicitudModelo.bloquearSolicitud(cliente, solicitud.solicitud_adquisicion_id);
      if (solicitud.estado !== 'RECIBIDO') {
        throw new ErrorAplicacion(409, 'Registra la recepción del lote antes de entregarlo.');
      }
      await solicitudModelo.actualizarEstado(
        cliente,
        solicitud.solicitud_adquisicion_id,
        'ENTREGADO_CATALOGO',
        {
          fechaEntregaCatalogo: reloj.ahora(),
        },
      );
      await bitacoraModelo.registrarEvento(
        {
          actorUsuarioId: req.usuario.usuario_id,
          accion: 'ENTREGA_CATALOGO',
          entidad: 'solicitud',
          claveRegistro: solicitud.folio,
          ip: req.ip,
        },
        cliente,
      );
      return solicitud.folio;
    });
    const solicitud = await solicitudModelo.obtenerSolicitudPorFolio(folio);
    res.json(solicitudVista.formatearOperacion('Entrega al catálogo registrada', solicitud));
  } catch (err) {
    next(err);
  }
}

export {
  getSolicitudes,
  getEntregadasCatalogo,
  getPresupuestoActual,
  getSolicitud,
  postSolicitud,
  putPartidas,
  postEnvio,
  postAutorizacion,
  postRecepcion,
  postEntregaCatalogo,
};
