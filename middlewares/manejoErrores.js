/*----
 * Programa: manejoErrores.js
 * Objetivo: Responder rutas inexistentes y centralizar las respuestas de error de la API
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import ENTORNO from '../config/entorno.js';
import ErrorAplicacion from '../utilidades/errorAplicacion.js';

const MENSAJE_ERROR_INTERNO = 'Ocurrió un error inesperado; intenta nuevamente';

/**
 * Objetivo: Generar un error 404 para cualquier ruta de la API que no exista.
 * @param {Object} req - Petición HTTP.
 * @param {Object} _res - Respuesta HTTP (no se usa).
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {void}
 */
function rutaNoEncontrada(req, _res, next) {
  next(new ErrorAplicacion(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}

/**
 * Objetivo: Convertir cualquier error recibido con next(err) en una respuesta JSON uniforme:
 *   { error: { mensaje, detalle? } }.
 * @param {Error} err - Error lanzado por un controlador o middleware.
 * @param {Object} req - Petición HTTP.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} _next - Requerido por Express para reconocerlo como manejador de errores.
 * @returns {void}
 * Limitaciones: En errores internos nunca se expone el mensaje original al cliente.
 */
function manejarErrores(err, req, res, _next) {
  const esControlado = err instanceof ErrorAplicacion;
  // JSON mal formado en el cuerpo de la petición
  const esJsonInvalido = err.type === 'entity.parse.failed';

  let estadoHttp = 500;
  if (esControlado) {
    estadoHttp = err.estadoHttp;
  } else if (esJsonInvalido) {
    estadoHttp = 400;
  }

  if (estadoHttp === 500 && !ENTORNO.ES_PRUEBA) {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, err);
  }

  let mensaje = MENSAJE_ERROR_INTERNO;
  if (esControlado) {
    mensaje = err.message;
  } else if (esJsonInvalido) {
    mensaje = 'El cuerpo de la petición no es un JSON válido';
  }

  const cuerpo = { error: { mensaje } };
  if (esControlado && err.detalle !== undefined) {
    cuerpo.error.detalle = err.detalle;
  }
  res.status(estadoHttp).json(cuerpo);
}

export { rutaNoEncontrada, manejarErrores };
