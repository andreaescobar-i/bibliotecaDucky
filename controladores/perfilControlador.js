/*----
 * Programa: perfilControlador.js
 * Objetivo: Crear, consultar, modificar y desactivar perfiles con su Rol y Permisos, y consultar
 *           la matriz de roles (HUPRF01)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import { ejecutarTransaccion } from '../config/db.js';
import * as perfilModelo from '../modelos/perfilModelo.js';
import * as rolModelo from '../modelos/rolModelo.js';
import * as usuarioModelo from '../modelos/usuarioModelo.js';
import * as bitacoraModelo from '../modelos/bitacoraModelo.js';
import * as identidadInstitucionalServicio from '../servicios/identidadInstitucionalServicio.js';
import * as perfilVista from '../vistas/perfilVista.js';
import ErrorAplicacion from '../utilidades/errorAplicacion.js';
import { limpiarTexto, tieneCampo } from '../utilidades/validacion.js';
import {
  PERMISOS_GESTION,
  MENSAJES_CUENTAS,
  esPerfilGestor,
  esRolCompatible,
} from '../utilidades/reglasCuentas.js';

const FORMATO_CLAVE_PERFIL = /^[A-Z0-9-]{2,32}$/; // Ej. PRF-ALU, PRF-BIB-CON
const MENSAJE_PERMISOS_INCOMPATIBLES = 'Rol o permisos incompatibles';
const MENSAJE_PERFIL_NO_ENCONTRADO = 'Perfil no encontrado';

/**
 * Objetivo: Registrar en la bitácora un rechazo de seguridad sobre un perfil, con su propia
 *   conexión para que se guarde aunque la operación se revierta.
 * @param {Object} req - Petición HTTP (operador e IP).
 * @param {string} accion - Acción rechazada.
 * @param {string} clavePerfil - Perfil solicitado.
 * @param {string} causa - Motivo del rechazo.
 * @returns {Promise<void>}
 */
async function registrarRechazo(req, accion, clavePerfil, causa) {
  await bitacoraModelo.registrarEvento({
    actorUsuarioId: req.usuario.usuario_id,
    accion,
    entidad: 'perfil',
    claveRegistro: clavePerfil,
    detalle: { causa },
    ip: req.ip,
    resultado: bitacoraModelo.RESULTADOS.RECHAZO,
  });
}

/**
 * Objetivo: Obtener el perfil indicado en la URL (/perfiles/:clave).
 * @param {Object} req - Petición HTTP.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<Object>} Perfil encontrado.
 * Limitaciones: Lanza ErrorAplicacion 404 si no existe.
 */
async function obtenerPerfilDeRuta(req, cliente = undefined) {
  const perfil = await perfilModelo.obtenerPerfilPorClave(
    limpiarTexto(req.params.clave).toUpperCase(),
    cliente,
  );
  if (!perfil) {
    throw new ErrorAplicacion(404, MENSAJE_PERFIL_NO_ENCONTRADO);
  }
  return perfil;
}

/**
 * Objetivo: Validar el Rol y los Permisos de un perfil contra la matriz: el rol debe existir y
 *   estar activo, y debe haber al menos un permiso, todos permitidos para ese rol.
 * @param {string} nombreRol - Rol capturado.
 * @param {unknown} permisosCapturados - Lista de claves de permisos.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<{ rol: Object, permisos: string[], permisoIds: string[] }>} Datos validados.
 */
async function validarRolYPermisos(nombreRol, permisosCapturados, cliente = undefined) {
  const rol = await rolModelo.obtenerRolPorNombre(nombreRol, cliente);
  if (!rol || !rol.activo) {
    throw new ErrorAplicacion(400, 'Rol no registrado o inactivo', { campos: ['Rol'] });
  }
  const permisos = Array.isArray(permisosCapturados)
    ? [...new Set(permisosCapturados.map((clave) => limpiarTexto(clave).toUpperCase()))].filter(
        Boolean,
      )
    : [];
  if (permisos.length === 0) {
    throw new ErrorAplicacion(400, 'Seleccione al menos un permiso compatible con el rol', {
      campos: ['Permisos'],
    });
  }
  const incompatibles = permisos.filter((clave) => !rol.permisos_permitidos.includes(clave));
  if (incompatibles.length > 0) {
    throw new ErrorAplicacion(400, MENSAJE_PERMISOS_INCOMPATIBLES, {
      campos: ['Permisos'],
      permisosIncompatibles: incompatibles,
    });
  }
  const registros = await rolModelo.obtenerPermisosPorClaves(permisos, cliente);
  return { rol, permisos: permisos.sort(), permisoIds: registros.map((p) => p.permiso_id) };
}

/**
 * Objetivo: Listar perfiles. Query "estado": Activo, Inactivo o Todos (por omisión).
 * @param {Object} req - Petición HTTP.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function getPerfiles(req, res, next) {
  try {
    const estado = limpiarTexto(req.query.estado).toUpperCase();
    const ESTADOS = { ACTIVO: true, INACTIVO: false, TODOS: null, '': null };
    if (!(estado in ESTADOS)) {
      throw new ErrorAplicacion(400, 'El estado debe ser Activo, Inactivo o Todos', {
        campos: ['Estado'],
      });
    }
    const perfiles = await perfilModelo.listarPerfiles(ESTADOS[estado]);
    res.json(perfilVista.formatearLista(perfiles));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Consultar un perfil con sus permisos y las cuentas activas asignadas, sin modificar
 *   datos (HUPRF01 escenario 2, punto 1).
 * @param {Object} req - Petición HTTP.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function getPerfil(req, res, next) {
  try {
    const perfil = await obtenerPerfilDeRuta(req);
    const cuentas = await perfilModelo.obtenerCuentasActivasDePerfil(perfil.perfil_id);
    res.json(perfilVista.formatearDetalle(perfil, cuentas));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Listar los roles con los permisos que cada uno puede tener, para el formulario de
 *   perfiles.
 * @param {Object} _req - Petición HTTP (no se usa).
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function getRoles(_req, res, next) {
  try {
    res.json(perfilVista.formatearRoles(await rolModelo.listarRolesConMatriz()));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Crear un perfil activo con Rol y Permisos compatibles, sin asignarlo a ninguna
 *   cuenta (HUPRF01 escenario 1).
 * @param {Object} req - Petición HTTP. Cuerpo: clave, nombre, descripcion?, rol, permisos[].
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function postPerfil(req, res, next) {
  try {
    const cuerpo = req.body ?? {};
    const clave = limpiarTexto(cuerpo.clave).toUpperCase();
    const nombre = limpiarTexto(cuerpo.nombre);
    const descripcion = limpiarTexto(cuerpo.descripcion) || null;
    const nombreRol = limpiarTexto(cuerpo.rol);

    const camposFaltantes = [];
    if (!clave) {
      camposFaltantes.push('Clave');
    }
    if (!nombre) {
      camposFaltantes.push('Nombre');
    }
    if (!nombreRol) {
      camposFaltantes.push('Rol');
    }
    if (camposFaltantes.length > 0) {
      throw new ErrorAplicacion(400, MENSAJES_CUENTAS.CAMPOS_OBLIGATORIOS, {
        campos: camposFaltantes,
      });
    }
    if (!FORMATO_CLAVE_PERFIL.test(clave)) {
      throw new ErrorAplicacion(400, 'La clave usa de 2 a 32 letras, números o guiones', {
        campos: ['Clave'],
      });
    }

    const { rol, permisos, permisoIds } = await validarRolYPermisos(nombreRol, cuerpo.permisos);
    const duplicados = await perfilModelo.buscarDuplicados({ clave, nombre });
    if (duplicados.clave || duplicados.nombre) {
      throw new ErrorAplicacion(409, 'La clave o el nombre del perfil ya están registrados', {
        campos: [duplicados.clave && 'Clave', duplicados.nombre && 'Nombre'].filter(Boolean),
      });
    }

    await ejecutarTransaccion(async (cliente) => {
      const perfilId = await perfilModelo.crearPerfil(cliente, {
        clave,
        nombre,
        descripcion,
        rolId: rol.rol_id,
        creadoPorUsuarioId: req.usuario.usuario_id,
      });
      await perfilModelo.reemplazarRolYPermisos(cliente, perfilId, rol.rol_id, permisoIds);
      await bitacoraModelo.registrarEvento(
        {
          actorUsuarioId: req.usuario.usuario_id,
          accion: 'CREACION_PERFIL',
          entidad: 'perfil',
          claveRegistro: clave,
          detalle: { nombre, rol: rol.nombre, permisos },
          ip: req.ip,
        },
        cliente,
      );
    });

    const perfil = await perfilModelo.obtenerPerfilPorClave(clave);
    res.status(201).json(perfilVista.formatearOperacion('Perfil registrado', perfil));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Modificar Nombre, Descripción, Rol o Permisos de un perfil activo (HUPRF01
 *   escenario 2). La clave, las asignaciones y el historial no cambian. Si cambia el acceso,
 *   se validan todas las cuentas activas asignadas y cualquier incumplimiento rechaza todo.
 * @param {Object} req - Petición HTTP. Cuerpo: nombre?, descripcion?, rol?, permisos?.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function putPerfil(req, res, next) {
  try {
    const cuerpo = req.body ?? {};
    const clave = await ejecutarTransaccion(async (cliente) => {
      await usuarioModelo.bloquearCambiosDeAcceso(cliente);
      const perfil = await obtenerPerfilDeRuta(req, cliente);
      await perfilModelo.bloquearPerfil(cliente, perfil.perfil_id);
      if (!perfil.activo) {
        throw new ErrorAplicacion(409, 'El perfil está inactivo y no se puede modificar');
      }

      const nombre = tieneCampo(cuerpo, 'nombre') ? limpiarTexto(cuerpo.nombre) : perfil.nombre;
      if (!nombre) {
        throw new ErrorAplicacion(400, MENSAJES_CUENTAS.CAMPOS_OBLIGATORIOS, {
          campos: ['Nombre'],
        });
      }
      const descripcion = tieneCampo(cuerpo, 'descripcion')
        ? limpiarTexto(cuerpo.descripcion) || null
        : perfil.descripcion;
      const nombreRol = tieneCampo(cuerpo, 'rol') ? limpiarTexto(cuerpo.rol) : perfil.rol_nombre;
      const { rol, permisos, permisoIds } = await validarRolYPermisos(
        nombreRol,
        tieneCampo(cuerpo, 'permisos') ? cuerpo.permisos : perfil.permisos,
        cliente,
      );
      const duplicados = await perfilModelo.buscarDuplicados({ nombre }, perfil.perfil_id, cliente);
      if (duplicados.nombre) {
        throw new ErrorAplicacion(409, 'El nombre del perfil ya está registrado', {
          campos: ['Nombre'],
        });
      }

      const cambiaAcceso =
        rol.nombre !== perfil.rol_nombre || permisos.join() !== [...perfil.permisos].sort().join();
      if (cambiaAcceso) {
        // No se puede cambiar el Rol/Permisos del perfil con el que opera el propio operador
        if (perfil.perfil_id === req.usuario.perfil_id) {
          await registrarRechazo(req, 'MODIFICACION_PERFIL', perfil.clave, 'PROPIO_ACCESO');
          throw new ErrorAplicacion(403, MENSAJES_CUENTAS.PROPIO_ACCESO);
        }

        const cuentas = await perfilModelo.obtenerCuentasActivasDePerfil(perfil.perfil_id, cliente);
        const incompatibles = cuentas.filter(
          (cuenta) => !esRolCompatible(cuenta.tipo_identificador, rol.nombre),
        );
        if (incompatibles.length > 0) {
          throw new ErrorAplicacion(409, MENSAJES_CUENTAS.ROL_INCOMPATIBLE, {
            cuentas: perfilVista.formatearCuentasAsignadas(incompatibles),
          });
        }
        const vigentes = await identidadInstitucionalServicio.consultarVigencias(cuentas);
        const noVigentes = cuentas.filter((cuenta) => !vigentes.has(cuenta.identificador));
        if (noVigentes.length > 0) {
          throw new ErrorAplicacion(409, MENSAJES_CUENTAS.IDENTIDAD_NO_VIGENTE, {
            cuentas: perfilVista.formatearCuentasAsignadas(noVigentes),
          });
        }

        const eraGestor = esPerfilGestor(perfil.rol_nombre, perfil.permisos, true);
        const seraGestor = esPerfilGestor(rol.nombre, permisos, true);
        if (eraGestor && !seraGestor && cuentas.length > 0) {
          const gestoresRestantes = await usuarioModelo.contarGestores(cliente, PERMISOS_GESTION, {
            perfilId: perfil.perfil_id,
          });
          if (gestoresRestantes === 0) {
            await registrarRechazo(
              req,
              'MODIFICACION_PERFIL',
              perfil.clave,
              'ULTIMO_ADMINISTRADOR',
            );
            throw new ErrorAplicacion(409, MENSAJES_CUENTAS.ULTIMO_ADMINISTRADOR);
          }
        }
        await perfilModelo.reemplazarRolYPermisos(
          cliente,
          perfil.perfil_id,
          rol.rol_id,
          permisoIds,
        );
      }

      await perfilModelo.actualizarDatosPerfil(cliente, perfil.perfil_id, { nombre, descripcion });
      await bitacoraModelo.registrarEvento(
        {
          actorUsuarioId: req.usuario.usuario_id,
          accion: 'MODIFICACION_PERFIL',
          entidad: 'perfil',
          claveRegistro: perfil.clave,
          detalle: {
            anterior: {
              nombre: perfil.nombre,
              descripcion: perfil.descripcion,
              rol: perfil.rol_nombre,
              permisos: perfil.permisos,
            },
            nuevo: { nombre, descripcion, rol: rol.nombre, permisos },
          },
          ip: req.ip,
        },
        cliente,
      );
      return perfil.clave;
    });

    const perfil = await perfilModelo.obtenerPerfilPorClave(clave);
    res.json(perfilVista.formatearOperacion('Perfil actualizado', perfil));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Desactivar un perfil. Se rechaza si tiene cuentas activas asignadas; no las
 *   reasigna automáticamente (HUPRF01 escenario 3).
 * @param {Object} req - Petición HTTP.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function postDesactivarPerfil(req, res, next) {
  try {
    const clave = await ejecutarTransaccion(async (cliente) => {
      await usuarioModelo.bloquearCambiosDeAcceso(cliente);
      const perfil = await obtenerPerfilDeRuta(req, cliente);
      await perfilModelo.bloquearPerfil(cliente, perfil.perfil_id);
      if (!perfil.activo) {
        throw new ErrorAplicacion(409, 'El perfil ya está inactivo');
      }

      const cuentas = await perfilModelo.obtenerCuentasActivasDePerfil(perfil.perfil_id, cliente);
      if (cuentas.length > 0) {
        throw new ErrorAplicacion(
          409,
          'Reasigne las cuentas activas antes de desactivar el perfil',
          {
            cantidad: cuentas.length,
            cuentas: perfilVista.formatearCuentasAsignadas(cuentas),
          },
        );
      }

      await perfilModelo.desactivarPerfil(cliente, perfil.perfil_id);
      await bitacoraModelo.registrarEvento(
        {
          actorUsuarioId: req.usuario.usuario_id,
          accion: 'DESACTIVACION_PERFIL',
          entidad: 'perfil',
          claveRegistro: perfil.clave,
          ip: req.ip,
        },
        cliente,
      );
      return perfil.clave;
    });

    const perfil = await perfilModelo.obtenerPerfilPorClave(clave);
    res.json(perfilVista.formatearOperacion('Perfil desactivado', perfil));
  } catch (err) {
    next(err);
  }
}

export { getPerfiles, getPerfil, getRoles, postPerfil, putPerfil, postDesactivarPerfil };
