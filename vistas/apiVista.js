/*----
 * Programa: apiVista.js
 * Objetivo: Dar formato JSON a la presentación de la API (nombre, versión y rutas disponibles)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

/**
 * Objetivo: Construir la respuesta de GET /api.
 * @param {string} version - Versión de la API.
 * @param {{ metodo: string, ruta: string, descripcion: string }[]} rutas - Rutas disponibles.
 * @returns {Object} Cuerpo JSON de la respuesta.
 */
function formatearIndice(version, rutas) {
  return {
    nombre: 'API SIGB · Biblioteca Ducky',
    version,
    rutas: rutas.map(({ metodo, ruta, descripcion }) => ({
      metodo,
      ruta: `/api${ruta}`,
      descripcion,
    })),
  };
}

export { formatearIndice };
