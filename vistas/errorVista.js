/*----
 * Programa: errorVista.js
 * Objetivo: Dar el formato uniforme de las respuestas de error de la API
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

/**
 * Objetivo: Formatear un error como { error: { mensaje, detalle? } }.
 * @param {string} mensaje - Mensaje que se muestra al usuario.
 * @param {unknown} [detalle] - Campos señalados u otros datos del error.
 * @returns {Object} Cuerpo de la respuesta.
 */
function formatearError(mensaje, detalle = undefined) {
  return { error: detalle === undefined ? { mensaje } : { mensaje, detalle } };
}

export { formatearError };
