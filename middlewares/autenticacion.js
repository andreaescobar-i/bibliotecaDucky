/*----
 * Programa: autenticacion.js
 * Objetivo: Proteger las rutas de la API: exigir una sesión válida y comprobar permisos antes de
 *           cada operación (HUGUS01 escenario 1, punto 6; HUPRF01 escenario 5)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import * as usuarioModelo from '../modelos/usuarioModelo.js';
import * as bitacoraModelo from '../modelos/bitacoraModelo.js';
import * as identidadInstitucionalServicio from '../servicios/identidadInstitucionalServicio.js';
import ErrorAplicacion from '../utilidades/errorAplicacion.js';
import { MENSAJE_ACCESO_NO_HABILITADO, evaluarAcceso } from '../utilidades/reglasAcceso.js';
import {
  NOMBRE_COOKIE_SESION,
  verificarTokenSesion,
  borrarCookieSesion,
} from '../utilidades/sesion.js';

const MENSAJE_SIN_SESION = 'Inicie sesión para continuar';
const MENSAJE_SESION_INVALIDA = 'Su sesión ya no es válida; inicie sesión nuevamente';
const MENSAJE_SIN_PERMISO = 'No tiene permiso para esta operación';

/**
 * Objetivo: Exigir una sesión válida y volver a comprobar en la BD, en cada petición, que la
 *   cuenta, el perfil, el rol y la vigencia institucional siguen activos. Así una baja o un
 *   cambio de perfil se aplican de inmediato, incluso con la sesión abierta o enlaces directos.
 * @param {Object} req - Petición HTTP. Al pasar, req.usuario contiene la cuenta y sus permisos.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Siguiente middleware o error.
 * @returns {Promise<void>}
 */
async function requiereSesion(req, res, next) {
  try {
    const token = req.cookies?.[NOMBRE_COOKIE_SESION];
    if (!token) {
      throw new ErrorAplicacion(401, MENSAJE_SIN_SESION);
    }

    const contenido = verificarTokenSesion(token);
    const usuario = contenido ? await usuarioModelo.obtenerUsuarioAcceso(contenido.sub) : null;
    // Una versión distinta significa que la cuenta invalidó sus sesiones (baja, nueva contraseña)
    if (!usuario || usuario.version_sesion !== contenido.ver) {
      borrarCookieSesion(res);
      throw new ErrorAplicacion(401, MENSAJE_SESION_INVALIDA);
    }

    const esVigente = await identidadInstitucionalServicio.consultarVigencia(
      usuario.tipo_identificador,
      usuario.identificador,
    );
    const rechazo = evaluarAcceso(usuario, esVigente);
    if (rechazo) {
      borrarCookieSesion(res);
      await bitacoraModelo.registrarEvento({
        actorUsuarioId: usuario.usuario_id,
        accion: 'SESION_REVOCADA',
        entidad: 'usuario',
        claveRegistro: usuario.identificador,
        detalle: { causa: rechazo.causa, ruta: req.originalUrl },
        ip: req.ip,
        resultado: bitacoraModelo.RESULTADOS.RECHAZO,
      });
      throw new ErrorAplicacion(401, MENSAJE_ACCESO_NO_HABILITADO, { area: rechazo.area });
    }

    req.usuario = usuario;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Crear un middleware que exige un permiso del perfil vigente. Debe ir después de
 *   requiereSesion.
 * @param {string} clavePermiso - Clave del permiso, por ejemplo 'ALTA_LIBROS'.
 * @param {string} [mensaje] - Mensaje de rechazo cuando la historia define uno propio.
 * @returns {Function} Middleware de Express.
 */
function requierePermiso(clavePermiso, mensaje = MENSAJE_SIN_PERMISO) {
  return async function verificarPermiso(req, _res, next) {
    try {
      if (req.usuario.permisos.includes(clavePermiso)) {
        next();
        return;
      }
      await bitacoraModelo.registrarEvento({
        actorUsuarioId: req.usuario.usuario_id,
        accion: 'ACCESO_DENEGADO',
        entidad: 'permiso',
        claveRegistro: clavePermiso,
        detalle: { metodo: req.method, ruta: req.originalUrl },
        ip: req.ip,
        resultado: bitacoraModelo.RESULTADOS.RECHAZO,
      });
      throw new ErrorAplicacion(403, mensaje);
    } catch (err) {
      next(err);
    }
  };
}

/**
 * Objetivo: Crear un middleware que exige al menos uno de varios permisos (por ejemplo,
 *   consultar solicitudes lo puede hacer quien las gestiona o quien registra recepciones).
 * @param {string[]} clavesPermiso - Claves aceptadas.
 * @param {string} [mensaje] - Mensaje de rechazo.
 * @returns {Function} Middleware de Express.
 */
function requiereAlgunPermiso(clavesPermiso, mensaje = MENSAJE_SIN_PERMISO) {
  return async function verificarAlgunPermiso(req, _res, next) {
    try {
      if (clavesPermiso.some((clave) => req.usuario.permisos.includes(clave))) {
        next();
        return;
      }
      await bitacoraModelo.registrarEvento({
        actorUsuarioId: req.usuario.usuario_id,
        accion: 'ACCESO_DENEGADO',
        entidad: 'permiso',
        claveRegistro: clavesPermiso.join('|'),
        detalle: { metodo: req.method, ruta: req.originalUrl },
        ip: req.ip,
        resultado: bitacoraModelo.RESULTADOS.RECHAZO,
      });
      throw new ErrorAplicacion(403, mensaje);
    } catch (err) {
      next(err);
    }
  };
}

export { requiereSesion, requierePermiso, requiereAlgunPermiso };
