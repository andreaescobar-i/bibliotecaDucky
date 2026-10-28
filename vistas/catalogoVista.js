/*----
 * Programa: catalogoVista.js
 * Objetivo: Dar formato JSON a los catálogos que usan los formularios del front: temas, tipos
 *           de uso, editoriales y motivos de baja
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

/**
 * Objetivo: Formatear los catálogos registrados.
 * @param {{ temas: string[], tiposUso: Object[], editoriales: string[] }} catalogos - Resultado
 *   de catalogoModelo.listarCatalogos().
 * @param {string[]} motivosBaja - Motivos de baja que acepta la API.
 * @returns {Object} Catálogos listos para el front.
 */
function formatearCatalogos({ temas, tiposUso, editoriales }, motivosBaja) {
  return {
    temas,
    tiposUso: tiposUso.map((tipo) => ({
      nombre: tipo.nombre,
      permitePrestamo: tipo.permite_prestamo,
    })),
    editoriales,
    motivosBaja,
  };
}

export { formatearCatalogos };
