/*----
 * Programa: usuarioControlador.js
 * Objetivo: Gestionar cuentas de usuario: consulta (HUGUS05), alta (HUGUS02), cambio de
 *           contacto y perfil (HUGUS04), asignación de perfil (HUPRF01), baja lógica (HUGUS03)
 *           y reactivación (pantalla Usuarios del front)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import bcrypt from 'bcrypt';
import { ejecutarTransaccion } from '../config/db.js';
import * as usuarioModelo from '../modelos/usuarioModelo.js';
import * as perfilModelo from '../modelos/perfilModelo.js';
import * as rolModelo from '../modelos/rolModelo.js';
import * as prestamoModelo from '../modelos/prestamoModelo.js';
import * as adeudoModelo from '../modelos/adeudoModelo.js';
import * as bitacoraModelo from '../modelos/bitacoraModelo.js';
import * as identidadInstitucionalServicio from '../servicios/identidadInstitucionalServicio.js';
import * as correoServicio from '../servicios/correoServicio.js';
import * as usuarioVista from '../vistas/usuarioVista.js';
import ErrorAplicacion from '../utilidades/errorAplicacion.js';
import { limpiarTexto, tieneCampo } from '../utilidades/validacion.js';
import {
  normalizarIdentificador,
  normalizarTipo,
  inferirTipo,
  esFormatoValido,
} from '../utilidades/identificadores.js';
import {
  PERMISOS_GESTION,
  MENSAJES_CUENTAS,
  esPerfilGestor,
  esRolCompatible,
  esCorreoInstitucional,
  esTelefonoValido,
  separarNombre,
  generarContrasenaTemporal,
} from '../utilidades/reglasCuentas.js';

const RONDAS_BCRYPT = 10; // Costo del hash de contraseñas
const VALOR_SIN_FILTRO = 'TODOS'; // Opción "Todos" de las listas del front
const VIOLA_UNICIDAD = '23505'; // Código de PostgreSQL
const ESTADOS_CUENTA = ['ACTIVO', 'INACTIVO'];

/**
 * Objetivo: Registrar en la bitácora un rechazo de seguridad. Usa su propia conexión para que
 *   quede guardado aunque la transacción de la operación se revierta.
 * @param {Object} req - Petición HTTP (operador e IP).
 * @param {string} accion - Acción rechazada, por ejemplo 'BAJA_CUENTA'.
 * @param {string} claveRegistro - Cuenta o perfil solicitado.
 * @param {string} causa - Motivo del rechazo.
 * @returns {Promise<void>}
 */
async function registrarRechazo(req, accion, claveRegistro, causa) {
  await bitacoraModelo.registrarEvento({
    actorUsuarioId: req.usuario.usuario_id,
    accion,
    entidad: 'usuario',
    claveRegistro,
    detalle: { causa },
    ip: req.ip,
    resultado: bitacoraModelo.RESULTADOS.RECHAZO,
  });
}

/**
 * Objetivo: Leer Tipo e Identificador de un texto capturado. El tipo es opcional porque el front
 *   solo captura "ID o matrícula"; si falta se deduce del formato.
 * @param {unknown} identificadorCapturado - Identificador recibido.
 * @param {unknown} [tipoCapturado] - Tipo de identificador recibido.
 * @returns {{ tipo: string, identificador: string }} Valores normalizados.
 * Limitaciones: Lanza ErrorAplicacion 400 si el tipo no existe o el formato no corresponde.
 */
function leerIdentificador(identificadorCapturado, tipoCapturado = undefined) {
  const identificador = normalizarIdentificador(identificadorCapturado);
  const tipoNormalizado = normalizarTipo(tipoCapturado);
  if (tipoNormalizado === null) {
    throw new ErrorAplicacion(400, MENSAJES_CUENTAS.CAMPOS_OBLIGATORIOS, {
      campos: ['Tipo de identificador'],
    });
  }
  const tipo = tipoNormalizado || inferirTipo(identificador);
  if (!tipo || !esFormatoValido(tipo, identificador)) {
    throw new ErrorAplicacion(400, 'Revise el formato del identificador institucional', {
      campos: ['Identificador'],
    });
  }
  return { tipo, identificador };
}

/**
 * Objetivo: Obtener la cuenta indicada en la URL (/usuarios/:identificador).
 * @param {Object} req - Petición HTTP.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<Object>} Cuenta encontrada.
 * Limitaciones: Lanza ErrorAplicacion 404 si no existe.
 */
async function obtenerCuentaDeRuta(req, cliente = undefined) {
  const { tipo, identificador } = leerIdentificador(req.params.identificador);
  const cuenta = await usuarioModelo.obtenerUsuarioPorIdentificador(tipo, identificador, cliente);
  if (!cuenta) {
    throw new ErrorAplicacion(404, MENSAJES_CUENTAS.CUENTA_NO_ENCONTRADA);
  }
  return cuenta;
}

/**
 * Objetivo: Obtener el perfil elegido, por clave ("perfil") o por rol ("rol", como lo envía el
 *   front en "Rol asignado"; se usa el perfil base de ese rol).
 * @param {Object} cuerpo - Cuerpo de la petición.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<Object|null|undefined>} Perfil; null si no existe; undefined si no se
 *   capturó perfil ni rol.
 */
async function resolverPerfil(cuerpo, cliente = undefined) {
  const clave = limpiarTexto(cuerpo?.perfil).toUpperCase();
  const rol = limpiarTexto(cuerpo?.rol);
  if (!clave && !rol) {
    return undefined;
  }
  const clavePerfil = clave || (await perfilModelo.obtenerClavePerfilBaseDeRol(rol, cliente));
  return clavePerfil ? perfilModelo.obtenerPerfilPorClave(clavePerfil, cliente) : null;
}

/**
 * Objetivo: Comprobar que un perfil se puede asignar a una identidad: existe, está activo y su
 *   rol corresponde a la identidad (alumnos de CIAA solo perfiles Alumno).
 * @param {Object|null} perfil - Perfil elegido.
 * @param {string} tipoIdentificador - 'MATRICULA' o 'NOMINA'.
 * @returns {void}
 * Limitaciones: Lanza ErrorAplicacion 400 con el motivo.
 */
function validarPerfilParaIdentidad(perfil, tipoIdentificador) {
  if (!perfil || !perfil.activo || !perfil.rol_activo) {
    throw new ErrorAplicacion(400, MENSAJES_CUENTAS.PERFIL_INVALIDO, { campos: ['Perfil'] });
  }
  if (!esRolCompatible(tipoIdentificador, perfil.rol_nombre)) {
    throw new ErrorAplicacion(400, MENSAJES_CUENTAS.ROL_INCOMPATIBLE, { campos: ['Perfil'] });
  }
}

/**
 * Objetivo: Validar el cambio de perfil de una cuenta existente (HUPRF01 escenario 4 y HUGUS04):
 *   cuenta activa, no es la del operador, perfil compatible, identidad vigente y no deja al
 *   sistema sin Administrador con permisos de gestión.
 * @param {Object} req - Petición HTTP (req.usuario es el operador).
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción (con candado tomado).
 * @param {Object} cuenta - Cuenta que cambia de perfil.
 * @param {Object|null} perfilNuevo - Perfil que se asignará.
 * @returns {Promise<void>}
 */
async function validarCambioDePerfil(req, cliente, cuenta, perfilNuevo) {
  if (cuenta.estado_cuenta !== 'ACTIVO') {
    throw new ErrorAplicacion(409, MENSAJES_CUENTAS.CUENTA_INACTIVA);
  }
  if (cuenta.usuario_id === req.usuario.usuario_id) {
    await registrarRechazo(req, 'ASIGNACION_PERFIL', cuenta.identificador, 'PROPIO_ACCESO');
    throw new ErrorAplicacion(403, MENSAJES_CUENTAS.PROPIO_ACCESO);
  }
  validarPerfilParaIdentidad(perfilNuevo, cuenta.tipo_identificador);

  const esVigente = await identidadInstitucionalServicio.consultarVigencia(
    cuenta.tipo_identificador,
    cuenta.identificador,
  );
  if (!esVigente) {
    throw new ErrorAplicacion(400, MENSAJES_CUENTAS.IDENTIDAD_NO_VIGENTE);
  }

  const eraGestor = esPerfilGestor(cuenta.rol_nombre, cuenta.permisos, cuenta.perfil_activo);
  const seraGestor = esPerfilGestor(perfilNuevo.rol_nombre, perfilNuevo.permisos, true);
  if (eraGestor && !seraGestor) {
    const gestoresRestantes = await usuarioModelo.contarGestores(cliente, PERMISOS_GESTION, {
      usuarioId: cuenta.usuario_id,
    });
    if (gestoresRestantes === 0) {
      await registrarRechazo(
        req,
        'ASIGNACION_PERFIL',
        cuenta.identificador,
        'ULTIMO_ADMINISTRADOR',
      );
      throw new ErrorAplicacion(409, MENSAJES_CUENTAS.ULTIMO_ADMINISTRADOR);
    }
  }
}

/**
 * Objetivo: Leer y validar los filtros de búsqueda de cuentas (HUGUS05 escenario 2).
 * @param {Object} consulta - Parámetros de la URL.
 * @returns {Promise<Object>} Filtros listos para usuarioModelo.buscarUsuarios().
 * Limitaciones: Lanza ErrorAplicacion 400 indicando cada filtro inválido.
 */
async function leerFiltrosBusqueda(consulta) {
  // "Todos" en las listas del front equivale a no filtrar
  const leer = (nombre) => {
    const valor = limpiarTexto(consulta[nombre]);
    return valor.toUpperCase() === VALOR_SIN_FILTRO ? '' : valor;
  };
  const filtros = {};
  const camposInvalidos = [];

  // "buscar" es el campo único del front: matrícula/nómina exacta o parte del nombre
  const buscar = leer('buscar');
  const tipoDeBuscar = inferirTipo(normalizarIdentificador(buscar));
  if (tipoDeBuscar) {
    filtros.tipo = tipoDeBuscar;
    filtros.identificador = normalizarIdentificador(buscar);
  } else if (buscar) {
    filtros.nombre = buscar;
  }

  const identificador = leer('identificador');
  const tipoCapturado = leer('tipoIdentificador');
  if (identificador) {
    try {
      Object.assign(filtros, leerIdentificador(identificador, tipoCapturado || undefined));
    } catch {
      camposInvalidos.push('Identificador');
    }
  } else if (tipoCapturado) {
    camposInvalidos.push('Identificador'); // Tipo sin Identificador
  }

  const nombre = leer('nombre');
  if (nombre) {
    filtros.nombre = nombre;
  }

  const rol = leer('rol');
  if (rol) {
    const rolRegistrado = await rolModelo.obtenerRolPorNombre(rol);
    if (rolRegistrado) {
      filtros.rol = rolRegistrado.nombre;
    } else {
      camposInvalidos.push('Rol');
    }
  }

  const perfil = leer('perfil').toUpperCase();
  if (perfil) {
    if (await perfilModelo.obtenerPerfilPorClave(perfil)) {
      filtros.perfil = perfil;
    } else {
      camposInvalidos.push('Perfil');
    }
  }

  const estado = leer('estado').toUpperCase();
  if (estado) {
    if (ESTADOS_CUENTA.includes(estado)) {
      filtros.estado = estado;
    } else {
      camposInvalidos.push('Estado');
    }
  }

  if (camposInvalidos.length > 0) {
    throw new ErrorAplicacion(
      400,
      'Revise los filtros señalados: el identificador debe ir completo con su tipo y el rol, ' +
        'perfil o estado deben estar registrados',
      { campos: camposInvalidos },
    );
  }
  return filtros;
}

/**
 * Objetivo: Buscar cuentas con filtros combinados (HUGUS05).
 * @param {Object} req - Petición HTTP. Query: buscar, tipoIdentificador, identificador, nombre,
 *   perfil, rol, estado.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function getUsuarios(req, res, next) {
  try {
    const filtros = await leerFiltrosBusqueda(req.query);
    const usuarios = await usuarioModelo.buscarUsuarios(filtros);
    // Solo se ofrecen las acciones que el operador tiene permitidas
    const acciones = {
      puedeEditar: req.usuario.permisos.includes('CAMBIO_CUENTAS'),
      puedeAsignarPerfil: req.usuario.permisos.includes('ASIGNAR_PERFILES'),
    };
    res.json(usuarioVista.formatearBusqueda(usuarios, acciones));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Consultar el detalle de una cuenta con sus permisos.
 * @param {Object} req - Petición HTTP.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function getUsuario(req, res, next) {
  try {
    const cuenta = await obtenerCuentaDeRuta(req);
    res.json(usuarioVista.formatearDetalle(cuenta));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Dar de alta una cuenta validando identidad en CIAA o Capital Humano, con contraseña
 *   temporal enviada al correo (HUGUS02). Si el identificador no existe en esos sistemas
 *   (simulados), se registra ahí con el nombre capturado; si existe y no está vigente, se rechaza.
 * @param {Object} req - Petición HTTP. Cuerpo: tipoIdentificador?, identificador, correo,
 *   telefono?, perfil (clave) o rol, nombre? (obligatorio si la persona no está registrada).
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function postUsuario(req, res, next) {
  try {
    const cuerpo = req.body ?? {};
    const correo = limpiarTexto(cuerpo.correo).toLowerCase();
    const telefono = limpiarTexto(cuerpo.telefono);

    const camposFaltantes = [];
    if (!limpiarTexto(cuerpo.identificador)) {
      camposFaltantes.push('Identificador');
    }
    if (!correo) {
      camposFaltantes.push('Correo institucional');
    }
    if (!limpiarTexto(cuerpo.perfil) && !limpiarTexto(cuerpo.rol)) {
      camposFaltantes.push('Perfil');
    }
    if (camposFaltantes.length > 0) {
      throw new ErrorAplicacion(400, MENSAJES_CUENTAS.CAMPOS_OBLIGATORIOS, {
        campos: camposFaltantes,
      });
    }

    const { tipo, identificador } = leerIdentificador(
      cuerpo.identificador,
      cuerpo.tipoIdentificador,
    );
    if (!esCorreoInstitucional(correo)) {
      throw new ErrorAplicacion(400, 'Revise el formato y dominio del correo institucional', {
        campos: ['Correo institucional'],
      });
    }
    if (telefono && !esTelefonoValido(telefono)) {
      throw new ErrorAplicacion(400, MENSAJES_CUENTAS.TELEFONO_INVALIDO, { campos: ['Teléfono'] });
    }

    // Escenario 4: si CIAA o Capital Humano no responden, no se crea la cuenta
    let identidad;
    try {
      identidad = await identidadInstitucionalServicio.obtenerIdentidad(tipo, identificador);
    } catch {
      throw new ErrorAplicacion(503, MENSAJES_CUENTAS.IDENTIDAD_NO_VALIDADA);
    }
    if (identidad && !identidad.vigente) {
      throw new ErrorAplicacion(400, MENSAJES_CUENTAS.IDENTIDAD_NO_VIGENTE, {
        campos: ['Identificador'],
      });
    }
    // Persona aún no registrada en CIAA o Capital Humano: se toma el nombre capturado
    let nombreNuevo = null;
    if (!identidad) {
      nombreNuevo = separarNombre(limpiarTexto(cuerpo.nombre).replace(/\s+/g, ' '));
      if (!nombreNuevo) {
        throw new ErrorAplicacion(400, MENSAJES_CUENTAS.NOMBRE_INVALIDO, {
          campos: ['Nombre completo'],
        });
      }
    }

    // Escenario 2: datos duplicados, incluso en cuentas inactivas
    const existente = await usuarioModelo.obtenerUsuarioPorIdentificador(tipo, identificador);
    if (existente) {
      throw new ErrorAplicacion(409, MENSAJES_CUENTAS.IDENTIFICADOR_DUPLICADO, {
        campos: ['Identificador'],
        estadoCuenta: existente.estado_cuenta === 'ACTIVO' ? 'Activo' : 'Inactivo',
      });
    }
    if (await usuarioModelo.existeCorreo(correo)) {
      throw new ErrorAplicacion(409, MENSAJES_CUENTAS.CORREO_DUPLICADO, {
        campos: ['Correo institucional'],
      });
    }

    const perfil = await resolverPerfil(cuerpo);
    validarPerfilParaIdentidad(perfil, tipo);
    const datosPersona = nombreNuevo ?? {
      primerNombre: identidad.primer_nombre,
      primerApellido: identidad.primer_apellido,
      segundoApellido: identidad.segundo_apellido,
    };

    const contrasenaTemporal = generarContrasenaTemporal();
    const contrasenaHash = await bcrypt.hash(contrasenaTemporal, RONDAS_BCRYPT);
    let usuarioId;
    try {
      usuarioId = await ejecutarTransaccion(async (cliente) => {
        if (nombreNuevo) {
          await identidadInstitucionalServicio.registrarIdentidad(cliente, {
            tipo,
            identificador,
            nombre: nombreNuevo,
            correo,
            puesto: perfil.rol_nombre,
          });
        }
        const idCreado = await usuarioModelo.crearUsuario(cliente, {
          perfilId: perfil.perfil_id,
          programaClave: identidad?.programa_clave ?? null,
          tipo,
          identificador,
          ...datosPersona,
          correo,
          telefono: telefono || null,
          contrasenaHash,
          altaPorUsuarioId: req.usuario.usuario_id,
        });
        await bitacoraModelo.registrarEvento(
          {
            actorUsuarioId: req.usuario.usuario_id,
            accion: 'ALTA_CUENTA',
            entidad: 'usuario',
            claveRegistro: identificador,
            detalle: { perfil: perfil.clave, correo, identidadRegistrada: Boolean(nombreNuevo) },
            ip: req.ip,
          },
          cliente,
        );
        return idCreado;
      });
    } catch (err) {
      // Otro operador registró los mismos datos al mismo tiempo
      if (err.code === VIOLA_UNICIDAD) {
        throw new ErrorAplicacion(409, MENSAJES_CUENTAS.IDENTIFICADOR_DUPLICADO);
      }
      // Se conserva el error original para el registro del servidor; al usuario no se le muestra
      const errorAlta = new ErrorAplicacion(500, 'No se pudo confirmar el alta');
      errorAlta.cause = err;
      throw errorAlta;
    }

    const cuenta = await usuarioModelo.obtenerUsuarioAcceso(usuarioId);
    const sonCredencialesEnviadas = await correoServicio.enviarCredenciales({
      correo,
      nombre: datosPersona.primerNombre,
      identificador,
      contrasenaTemporal,
    });
    await bitacoraModelo.registrarEvento({
      actorUsuarioId: req.usuario.usuario_id,
      accion: 'ENVIO_CREDENCIALES',
      entidad: 'usuario',
      claveRegistro: identificador,
      ip: req.ip,
      resultado: sonCredencialesEnviadas
        ? bitacoraModelo.RESULTADOS.EXITO
        : bitacoraModelo.RESULTADOS.ERROR,
    });

    const mensaje = sonCredencialesEnviadas
      ? 'Usuario creado y perfil asignado'
      : 'Cuenta creada; envío de credenciales pendiente';
    res.status(201).json(
      usuarioVista.formatearOperacion(mensaje, cuenta, {
        credencialesEnviadas: sonCredencialesEnviadas,
      }),
    );
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Modificar nombre, correo, teléfono y/o perfil de una cuenta en una sola operación
 *   (HUGUS04). Tipo/Identificador es de solo lectura. El nombre se puede corregir por decisión
 *   del equipo, aunque la HU lo marca como dato de CIAA o Capital Humano.
 * @param {Object} req - Petición HTTP. Cuerpo: nombre?, correo?, telefono?, perfil? o rol?.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function putUsuario(req, res, next) {
  try {
    const cuerpo = req.body ?? {};
    const cuentaActualizada = await ejecutarTransaccion(async (cliente) => {
      await usuarioModelo.bloquearCambiosDeAcceso(cliente);
      const cuenta = await obtenerCuentaDeRuta(req, cliente);
      await usuarioModelo.bloquearUsuario(cliente, cuenta.usuario_id);
      if (cuenta.estado_cuenta !== 'ACTIVO') {
        throw new ErrorAplicacion(409, MENSAJES_CUENTAS.CUENTA_INACTIVA);
      }

      const anterior = {};
      const nuevo = {};
      const nombreActual = [cuenta.primer_nombre, cuenta.primer_apellido, cuenta.segundo_apellido]
        .filter(Boolean)
        .join(' ');
      let nombre = null;
      if (tieneCampo(cuerpo, 'nombre')) {
        const nombreCapturado = limpiarTexto(cuerpo.nombre).replace(/\s+/g, ' ');
        nombre = separarNombre(nombreCapturado);
        if (!nombre) {
          throw new ErrorAplicacion(400, MENSAJES_CUENTAS.NOMBRE_INVALIDO, {
            campos: ['Nombre completo'],
          });
        }
        if (nombreCapturado === nombreActual) {
          nombre = null;
        } else {
          anterior.nombre = nombreActual;
          nuevo.nombre = nombreCapturado;
        }
      }

      let correo = cuenta.correo;
      if (tieneCampo(cuerpo, 'correo')) {
        correo = limpiarTexto(cuerpo.correo).toLowerCase();
        if (!correo) {
          throw new ErrorAplicacion(400, 'Dato obligatorio faltante', {
            campos: ['Correo institucional'],
          });
        }
        const esDuplicado = await usuarioModelo.existeCorreo(correo, cuenta.usuario_id, cliente);
        if (!esCorreoInstitucional(correo) || esDuplicado) {
          throw new ErrorAplicacion(400, MENSAJES_CUENTAS.CORREO_INVALIDO, {
            campos: ['Correo institucional'],
          });
        }
      }

      let telefono = cuenta.telefono;
      if (tieneCampo(cuerpo, 'telefono')) {
        telefono = limpiarTexto(cuerpo.telefono) || null;
        if (telefono && !esTelefonoValido(telefono)) {
          throw new ErrorAplicacion(400, MENSAJES_CUENTAS.TELEFONO_INVALIDO, {
            campos: ['Teléfono'],
          });
        }
      }

      let perfilId = cuenta.perfil_id;
      const perfilNuevo = await resolverPerfil(cuerpo, cliente);
      if (perfilNuevo !== undefined && perfilNuevo?.perfil_id !== cuenta.perfil_id) {
        if (!req.usuario.permisos.includes('ASIGNAR_PERFILES')) {
          await registrarRechazo(req, 'CAMBIO_CUENTA', cuenta.identificador, 'SIN_PERMISO_ASIGNAR');
          throw new ErrorAplicacion(403, MENSAJES_CUENTAS.SIN_PERMISO_ASIGNAR);
        }
        await validarCambioDePerfil(req, cliente, cuenta, perfilNuevo);
        perfilId = perfilNuevo.perfil_id;
        anterior.perfil = cuenta.perfil_clave;
        nuevo.perfil = perfilNuevo.clave;
      }

      if (correo !== cuenta.correo) {
        anterior.correo = cuenta.correo;
        nuevo.correo = correo;
      }
      if (telefono !== cuenta.telefono) {
        anterior.telefono = cuenta.telefono;
        nuevo.telefono = telefono;
      }
      if (Object.keys(nuevo).length === 0) {
        return { cuenta, huboCambios: false };
      }

      await usuarioModelo.actualizarUsuario(cliente, cuenta.usuario_id, {
        correo,
        telefono,
        perfilId,
      });
      if (nombre) {
        await usuarioModelo.actualizarNombre(cliente, cuenta.usuario_id, nombre);
      }
      await bitacoraModelo.registrarEvento(
        {
          actorUsuarioId: req.usuario.usuario_id,
          accion: 'CAMBIO_CUENTA',
          entidad: 'usuario',
          claveRegistro: cuenta.identificador,
          detalle: { anterior, nuevo },
          ip: req.ip,
        },
        cliente,
      );
      return { cuenta, huboCambios: true };
    });

    const cuenta = await usuarioModelo.obtenerUsuarioAcceso(cuentaActualizada.cuenta.usuario_id);
    const mensaje = cuentaActualizada.huboCambios
      ? 'Datos de la cuenta actualizados'
      : 'No hay cambios por guardar';
    res.json(usuarioVista.formatearOperacion(mensaje, cuenta));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Asignar o cambiar el perfil de una cuenta (HUPRF01 escenario 4). Solo cambia la
 *   asociación cuenta-perfil; el acceso nuevo aplica desde la siguiente operación protegida.
 * @param {Object} req - Petición HTTP. Cuerpo: perfil (clave) o rol.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function putPerfilUsuario(req, res, next) {
  try {
    const usuarioId = await ejecutarTransaccion(async (cliente) => {
      await usuarioModelo.bloquearCambiosDeAcceso(cliente);
      const cuenta = await obtenerCuentaDeRuta(req, cliente);
      await usuarioModelo.bloquearUsuario(cliente, cuenta.usuario_id);

      const perfilNuevo = await resolverPerfil(req.body, cliente);
      if (perfilNuevo === undefined) {
        throw new ErrorAplicacion(400, MENSAJES_CUENTAS.CAMPOS_OBLIGATORIOS, {
          campos: ['Perfil'],
        });
      }
      if (perfilNuevo?.perfil_id === cuenta.perfil_id) {
        throw new ErrorAplicacion(409, 'La cuenta ya tiene asignado ese perfil');
      }
      await validarCambioDePerfil(req, cliente, cuenta, perfilNuevo);

      await usuarioModelo.actualizarUsuario(cliente, cuenta.usuario_id, {
        correo: cuenta.correo,
        telefono: cuenta.telefono,
        perfilId: perfilNuevo.perfil_id,
      });
      await bitacoraModelo.registrarEvento(
        {
          actorUsuarioId: req.usuario.usuario_id,
          accion: 'ASIGNACION_PERFIL',
          entidad: 'usuario',
          claveRegistro: cuenta.identificador,
          detalle: { anterior: cuenta.perfil_clave, nuevo: perfilNuevo.clave },
          ip: req.ip,
        },
        cliente,
      );
      return cuenta.usuario_id;
    });

    const cuenta = await usuarioModelo.obtenerUsuarioAcceso(usuarioId);
    res.json(usuarioVista.formatearOperacion('Perfil asignado a la cuenta', cuenta));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Baja lógica de una cuenta: la deja inactiva sin borrar datos ni historial e invalida
 *   sus sesiones (HUGUS03). Se rechaza con préstamos activos, adeudos pendientes, si es la
 *   cuenta del operador o si dejaría al sistema sin Administrador con gestión.
 * @param {Object} req - Petición HTTP. Cuerpo: motivo.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function postBajaUsuario(req, res, next) {
  try {
    const motivo = limpiarTexto(req.body?.motivo);
    const usuarioId = await ejecutarTransaccion(async (cliente) => {
      await usuarioModelo.bloquearCambiosDeAcceso(cliente);
      let cuenta;
      try {
        cuenta = await obtenerCuentaDeRuta(req, cliente);
      } catch (err) {
        await registrarRechazo(
          req,
          'BAJA_CUENTA',
          req.params.identificador,
          'CUENTA_NO_ENCONTRADA',
        );
        throw err;
      }
      await usuarioModelo.bloquearUsuario(cliente, cuenta.usuario_id);

      // Escenario 4: cuenta del operador
      if (cuenta.usuario_id === req.usuario.usuario_id) {
        await registrarRechazo(req, 'BAJA_CUENTA', cuenta.identificador, 'PROPIA_CUENTA');
        throw new ErrorAplicacion(403, MENSAJES_CUENTAS.PROPIA_BAJA);
      }
      // Escenario 5: ya estaba inactiva
      if (cuenta.estado_cuenta !== 'ACTIVO') {
        throw new ErrorAplicacion(409, 'El usuario ya está inactivo; no se requiere otra baja', {
          bajaAnterior: {
            fecha: cuenta.fecha_baja,
            motivo: cuenta.motivo_baja,
            operador: cuenta.baja_por_identificador,
          },
        });
      }
      if (!motivo) {
        throw new ErrorAplicacion(400, MENSAJES_CUENTAS.CAMPOS_OBLIGATORIOS, {
          campos: ['Motivo de baja'],
        });
      }

      // Escenario 2: libros físicos en préstamo activo
      const prestamos = await prestamoModelo.obtenerPrestamosActivosDeUsuario(
        cuenta.usuario_id,
        cliente,
      );
      if (prestamos.length > 0) {
        throw new ErrorAplicacion(
          409,
          `No se puede tramitar la baja: El usuario cuenta con ${prestamos.length} libro(s) en ` +
            'préstamo activo. Debe realizarse la entrega física en ventanilla antes de proceder',
          { prestamos: usuarioVista.formatearPrestamosPendientes(prestamos) },
        );
      }
      // Escenario 3: saldo pendiente con Tesorería
      const adeudos = await adeudoModelo.obtenerAdeudosPendientesDeUsuario(
        cuenta.usuario_id,
        cliente,
      );
      if (adeudos.length > 0) {
        throw new ErrorAplicacion(409, 'Baja rechazada: existen adeudos pendientes con Tesorería', {
          adeudos: usuarioVista.formatearAdeudosPendientes(adeudos),
        });
      }
      // Escenario 4: último Administrador con permisos de gestión
      if (esPerfilGestor(cuenta.rol_nombre, cuenta.permisos, cuenta.perfil_activo)) {
        const gestoresRestantes = await usuarioModelo.contarGestores(cliente, PERMISOS_GESTION, {
          usuarioId: cuenta.usuario_id,
        });
        if (gestoresRestantes === 0) {
          await registrarRechazo(req, 'BAJA_CUENTA', cuenta.identificador, 'ULTIMO_ADMINISTRADOR');
          throw new ErrorAplicacion(409, MENSAJES_CUENTAS.ULTIMO_ADMINISTRADOR);
        }
      }

      await usuarioModelo.darDeBajaUsuario(
        cliente,
        cuenta.usuario_id,
        motivo,
        req.usuario.usuario_id,
      );
      await bitacoraModelo.registrarEvento(
        {
          actorUsuarioId: req.usuario.usuario_id,
          accion: 'BAJA_CUENTA',
          entidad: 'usuario',
          claveRegistro: cuenta.identificador,
          detalle: { motivo },
          ip: req.ip,
        },
        cliente,
      );
      return cuenta.usuario_id;
    });

    const cuenta = await usuarioModelo.obtenerUsuarioAcceso(usuarioId);
    res.json(
      usuarioVista.formatearOperacion(
        'Usuario dado de baja; registros históricos conservados',
        cuenta,
      ),
    );
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Reactivar una cuenta dada de baja (botón "Reactivar" del front). Si su perfil está
 *   inactivo, asigna el perfil base activo del mismo rol. Exige identidad vigente; las sesiones
 *   anteriores a la baja siguen invalidadas.
 * @param {Object} req - Petición HTTP.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function postReactivarUsuario(req, res, next) {
  try {
    const usuarioId = await ejecutarTransaccion(async (cliente) => {
      await usuarioModelo.bloquearCambiosDeAcceso(cliente);
      const cuenta = await obtenerCuentaDeRuta(req, cliente);
      await usuarioModelo.bloquearUsuario(cliente, cuenta.usuario_id);
      if (cuenta.estado_cuenta === 'ACTIVO') {
        throw new ErrorAplicacion(409, 'La cuenta ya está activa');
      }
      let perfilNuevo = null;
      if (!cuenta.perfil_activo) {
        const clave = await perfilModelo.obtenerClavePerfilBaseDeRol(cuenta.rol_nombre, cliente);
        perfilNuevo = clave ? await perfilModelo.obtenerPerfilPorClave(clave, cliente) : null;
      }
      validarPerfilParaIdentidad(
        perfilNuevo || {
          activo: cuenta.perfil_activo,
          rol_activo: cuenta.rol_activo,
          rol_nombre: cuenta.rol_nombre,
        },
        cuenta.tipo_identificador,
      );
      const esVigente = await identidadInstitucionalServicio.consultarVigencia(
        cuenta.tipo_identificador,
        cuenta.identificador,
      );
      if (!esVigente) {
        throw new ErrorAplicacion(400, MENSAJES_CUENTAS.IDENTIDAD_NO_VIGENTE);
      }

      await usuarioModelo.reactivarUsuario(cliente, cuenta.usuario_id, perfilNuevo?.perfil_id);
      await bitacoraModelo.registrarEvento(
        {
          actorUsuarioId: req.usuario.usuario_id,
          accion: 'REACTIVACION_CUENTA',
          entidad: 'usuario',
          claveRegistro: cuenta.identificador,
          detalle: {
            bajaAnterior: { fecha: cuenta.fecha_baja, motivo: cuenta.motivo_baja },
            ...(perfilNuevo
              ? { perfilAnterior: cuenta.perfil_clave, perfilNuevo: perfilNuevo.clave }
              : {}),
          },
          ip: req.ip,
        },
        cliente,
      );
      return cuenta.usuario_id;
    });

    const cuenta = await usuarioModelo.obtenerUsuarioAcceso(usuarioId);
    res.json(usuarioVista.formatearOperacion('Usuario reactivado', cuenta));
  } catch (err) {
    next(err);
  }
}

export {
  getUsuarios,
  getUsuario,
  postUsuario,
  putUsuario,
  putPerfilUsuario,
  postBajaUsuario,
  postReactivarUsuario,
};
