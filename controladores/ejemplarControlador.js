/*----
 * Programa: ejemplarControlador.js
 * Objetivo: Gestionar ejemplares físicos: consulta, etiqueta, cambio de clasificación y
 *           ubicación (HULIB03 esc. 2-4) y baja sin borrar historial (HULIB02)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import { ejecutarTransaccion } from '../config/db.js';
import * as ejemplarModelo from '../modelos/ejemplarModelo.js';
import * as libroModelo from '../modelos/libroModelo.js';
import * as catalogoModelo from '../modelos/catalogoModelo.js';
import * as bitacoraModelo from '../modelos/bitacoraModelo.js';
import * as libroVista from '../vistas/libroVista.js';
import ErrorAplicacion from '../utilidades/errorAplicacion.js';
import { limpiarTexto, tieneCampo } from '../utilidades/validacion.js';
import {
  MOTIVOS_BAJA,
  normalizarClave,
  esClaveValida,
  leerUbicacion,
  normalizarMotivoBaja,
} from '../utilidades/reglasCatalogo.js';

const MENSAJE_EJEMPLAR_NO_ENCONTRADO = 'Ejemplar no encontrado';

/**
 * Objetivo: Obtener el ejemplar indicado en la URL (/ejemplares/:clave).
 * @param {Object} req - Petición HTTP.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<Object>} Ejemplar encontrado.
 * Limitaciones: Lanza ErrorAplicacion 404 si no existe (HULIB02 escenario 3).
 */
async function obtenerEjemplarDeRuta(req, cliente = undefined) {
  const ejemplar = await ejemplarModelo.obtenerEjemplarPorClave(
    normalizarClave(req.params.clave),
    cliente,
  );
  if (!ejemplar) {
    throw new ErrorAplicacion(404, MENSAJE_EJEMPLAR_NO_ENCONTRADO);
  }
  return ejemplar;
}

/**
 * Objetivo: Consultar un ejemplar con su clasificación, ubicación y estado.
 * @param {Object} req - Petición HTTP.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function getEjemplar(req, res, next) {
  try {
    const ejemplar = await obtenerEjemplarDeRuta(req);
    res.json(libroVista.formatearConsultaEjemplar(ejemplar));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Obtener la etiqueta de un ejemplar para imprimirla.
 * @param {Object} req - Petición HTTP.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function getEtiqueta(req, res, next) {
  try {
    const ejemplar = await obtenerEjemplarDeRuta(req);
    if (ejemplar.estado === 'DADO_DE_BAJA') {
      throw new ErrorAplicacion(409, 'El ejemplar está dado de baja; no se genera etiqueta');
    }
    res.json(libroVista.formatearConsultaEtiqueta(ejemplar));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Cambiar Código de clasificación, Librero, Fila y/o tipo de uso de un ejemplar y
 *   regenerar su etiqueta, conservando clave, estado e historial (HULIB03 escenarios 2-4).
 * @param {Object} req - Petición HTTP. Cuerpo: clasificacion? (o clave, como el campo "Clave"
 *   del front), librero? y fila? (o ubicacion), tipoUso?.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function putEjemplar(req, res, next) {
  try {
    const cuerpo = req.body ?? {};
    const claveEjemplar = await ejecutarTransaccion(async (cliente) => {
      const ejemplar = await obtenerEjemplarDeRuta(req, cliente);
      await ejemplarModelo.bloquearEjemplar(cliente, ejemplar.ejemplar_id);
      // Escenario 4: la ubicación histórica de un ejemplar dado de baja no se modifica
      if (ejemplar.estado === 'DADO_DE_BAJA') {
        throw new ErrorAplicacion(
          409,
          'El ejemplar está dado de baja; su ubicación histórica no se modifica',
        );
      }

      // Los campos que no llegan conservan su valor actual
      const campoClasificacion = tieneCampo(cuerpo, 'clasificacion') ? 'clasificacion' : 'clave';
      const clasificacion = tieneCampo(cuerpo, campoClasificacion)
        ? normalizarClave(cuerpo[campoClasificacion])
        : ejemplar.clave_clasificacion;
      let { librero, fila } = { librero: ejemplar.librero ?? '', fila: ejemplar.fila ?? '' };
      if (
        tieneCampo(cuerpo, 'librero') ||
        tieneCampo(cuerpo, 'fila') ||
        tieneCampo(cuerpo, 'ubicacion')
      ) {
        ({ librero, fila } = leerUbicacion(cuerpo));
      }

      // Escenario 3: los tres datos deben quedar completos
      const camposFaltantes = [
        ['Código de clasificación', clasificacion],
        ['Librero', librero],
        ['Fila', fila],
      ]
        .filter(([, valor]) => !valor)
        .map(([nombre]) => nombre);
      if (camposFaltantes.length > 0) {
        throw new ErrorAplicacion(400, 'Complete los campos obligatorios señalados', {
          campos: camposFaltantes,
        });
      }
      if (!esClaveValida(clasificacion)) {
        throw new ErrorAplicacion(400, 'Código de clasificación inválido', {
          campos: ['Código de clasificación'],
        });
      }

      let tipoUso = { tipo_uso_id: ejemplar.tipo_uso_id, nombre: ejemplar.tipo_uso };
      if (limpiarTexto(cuerpo.tipoUso)) {
        tipoUso = await catalogoModelo.obtenerTipoUso(limpiarTexto(cuerpo.tipoUso), cliente);
        if (!tipoUso) {
          throw new ErrorAplicacion(400, 'Tipo de uso no registrado', { campos: ['Tipo de uso'] });
        }
      }

      // Un movimiento por cada tipo de cambio, con valores anteriores y nuevos
      const cambios = [
        [
          'CAMBIO_CLASIFICACION',
          { clasificacion: ejemplar.clave_clasificacion },
          { clasificacion },
        ],
        ['CAMBIO_UBICACION', { librero: ejemplar.librero, fila: ejemplar.fila }, { librero, fila }],
        ['CAMBIO_USO', { tipoUso: ejemplar.tipo_uso }, { tipoUso: tipoUso.nombre }],
      ].filter(([, anterior, nuevo]) => JSON.stringify(anterior) !== JSON.stringify(nuevo));
      if (cambios.length === 0) {
        return ejemplar.codigo_ejemplar;
      }

      await ejemplarModelo.actualizarEjemplar(cliente, ejemplar.ejemplar_id, {
        clasificacion,
        librero,
        fila,
        tipoUsoId: tipoUso.tipo_uso_id,
      });
      for (const [tipo, anterior, nuevo] of cambios) {
        await ejemplarModelo.registrarMovimiento(cliente, {
          ejemplarId: ejemplar.ejemplar_id,
          operadorId: req.usuario.usuario_id,
          tipo,
          anterior,
          nuevo,
        });
      }
      await bitacoraModelo.registrarEvento(
        {
          actorUsuarioId: req.usuario.usuario_id,
          accion: 'CAMBIO_EJEMPLAR',
          entidad: 'ejemplar',
          claveRegistro: ejemplar.codigo_ejemplar,
          detalle: {
            claveLibro: ejemplar.clave_libro,
            cambios: cambios.map(([tipo, anterior, nuevo]) => ({ tipo, anterior, nuevo })),
          },
          ip: req.ip,
        },
        cliente,
      );
      return ejemplar.codigo_ejemplar;
    });

    const ejemplar = await ejemplarModelo.obtenerEjemplarPorClave(claveEjemplar);
    res.json(
      libroVista.formatearOperacion('Clasificación y ubicación actualizadas', {
        ejemplar,
        etiqueta: ejemplar,
      }),
    );
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Dar de baja un ejemplar indicando el motivo, sin eliminar su ficha ni su historial,
 *   y excluirlo del conteo de disponibles (HULIB02).
 * @param {Object} req - Petición HTTP. Cuerpo: motivo (Perdido, Robado, Dañado, Obsoleto u
 *   Otro), observaciones? (obligatorias con "Otro").
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function postBajaEjemplar(req, res, next) {
  try {
    const motivoCapturado = limpiarTexto(req.body?.motivo);
    const motivo = normalizarMotivoBaja(motivoCapturado);
    const observaciones = limpiarTexto(req.body?.observaciones) || null;

    const claveEjemplar = await ejecutarTransaccion(async (cliente) => {
      const ejemplar = await obtenerEjemplarDeRuta(req, cliente);
      await ejemplarModelo.bloquearEjemplar(cliente, ejemplar.ejemplar_id);
      // Escenario 4: no se registra otra baja ni se sobrescribe la original
      if (ejemplar.estado === 'DADO_DE_BAJA') {
        throw new ErrorAplicacion(409, 'El ejemplar ya está dado de baja', {
          bajaAnterior: {
            fecha: ejemplar.fecha_baja,
            motivo: MOTIVOS_BAJA[ejemplar.motivo_baja],
            detalle: ejemplar.detalle_baja,
          },
        });
      }
      if (!motivo) {
        throw new ErrorAplicacion(
          400,
          motivoCapturado
            ? 'El motivo debe ser Perdido, Robado, Dañado, Obsoleto u Otro'
            : 'Complete los campos obligatorios señalados',
          { campos: ['Motivo de baja'] },
        );
      }
      if (motivo === 'OTRO' && !observaciones) {
        throw new ErrorAplicacion(400, 'Describa el motivo en Observaciones', {
          campos: ['Observaciones'],
        });
      }
      // Escenario 2: con préstamo activo no cambia el estado ni se registra la baja
      if (await ejemplarModelo.obtenerFolioPrestamoActivo(ejemplar.ejemplar_id, cliente)) {
        throw new ErrorAplicacion(
          409,
          'No se puede dar de baja: el ejemplar tiene un préstamo activo',
        );
      }

      await ejemplarModelo.darDeBajaEjemplar(cliente, ejemplar.ejemplar_id, {
        motivo,
        detalle: observaciones,
        operadorId: req.usuario.usuario_id,
      });
      await ejemplarModelo.registrarMovimiento(cliente, {
        ejemplarId: ejemplar.ejemplar_id,
        operadorId: req.usuario.usuario_id,
        tipo: 'BAJA',
        motivo,
        observaciones,
        anterior: { estado: ejemplar.estado },
        nuevo: { estado: 'DADO_DE_BAJA' },
      });
      await bitacoraModelo.registrarEvento(
        {
          actorUsuarioId: req.usuario.usuario_id,
          accion: 'BAJA_EJEMPLAR',
          entidad: 'ejemplar',
          claveRegistro: ejemplar.codigo_ejemplar,
          detalle: { claveLibro: ejemplar.clave_libro, motivo, observaciones },
          ip: req.ip,
        },
        cliente,
      );
      return ejemplar.codigo_ejemplar;
    });

    const ejemplar = await ejemplarModelo.obtenerEjemplarPorClave(claveEjemplar);
    const libro = await libroModelo.obtenerLibroPorClave(ejemplar.clave_libro);
    res.json(
      libroVista.formatearOperacion('Ejemplar dado de baja exitosamente', { ejemplar, libro }),
    );
  } catch (err) {
    next(err);
  }
}

export { getEjemplar, getEtiqueta, putEjemplar, postBajaEjemplar };
