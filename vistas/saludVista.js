/*----
 * Programa: saludVista.js
 * Objetivo: Dar formato JSON a la respuesta del estado de la API
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

/**
 * Objetivo: Construir la respuesta del estado de la API y su base de datos.
 * @param {boolean} tieneConexion - Indica si PostgreSQL respondió.
 * @param {{ fecha: Date, version: string }} [estadoBd] - Datos devueltos por el modelo.
 * @returns {Object} Cuerpo JSON de la respuesta.
 */
function formatearSalud(tieneConexion, estadoBd) {
  return {
    estado: tieneConexion ? 'ok' : 'degradado',
    baseDatos: tieneConexion ? 'conectada' : 'sin conexión',
    fechaServidorBd: tieneConexion ? estadoBd.fecha : null,
    versionBd: tieneConexion ? estadoBd.version.split(',')[0] : null,
  };
}

export { formatearSalud };
