/*----
 * Programa: consultaVista.js
 * Objetivo: Dar formato JSON a la búsqueda de libros (HULIB04), al listado filtrado (HULIS01) y
 *           a la consulta de ubicación (HUUBI01)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import { TEXTO_ESTADO_EJEMPLAR } from '../utilidades/reglasCatalogo.js';

const NO_REGISTRADO = 'No registrado';

// Nombres de los filtros como se muestran al usuario
const NOMBRES_FILTRO = Object.freeze({
  texto: 'Búsqueda',
  titulo: 'Título',
  autor: 'Autor',
  tema: 'Tema',
  editorial: 'Editorial',
  clave: 'Clave de libro',
  tipoUso: 'Tipo de uso',
});

/**
 * Objetivo: Describir los filtros aplicados, para mostrarlos y ponerlos en el PDF.
 * @param {Object} filtros - Filtros validados.
 * @returns {{ campo: string, nombre: string, valor: string }[]} Filtros no vacíos.
 */
function describirFiltros(filtros) {
  return Object.entries(NOMBRES_FILTRO)
    .filter(([campo]) => filtros[campo])
    .map(([campo, nombre]) => ({ campo, nombre, valor: filtros[campo] }));
}

/**
 * Objetivo: Formatear una ficha del resultado con su disponibilidad.
 * @param {Object} ficha - Registro de consultaModelo.buscarFichas().
 * @returns {Object} Ficha resumida.
 */
function formatearFichaResumen(ficha) {
  let disponibilidad = 'Disponible';
  if (ficha.registrados === 0) {
    disponibilidad = 'Sin ejemplares registrados';
  } else if (ficha.disponibles === 0) {
    disponibilidad = 'No disponible';
  }
  return {
    clave: ficha.clave_libro,
    titulo: ficha.titulo,
    autor: ficha.autor,
    tema: ficha.tema,
    editorial: ficha.editorial,
    isbn: ficha.isbn ?? NO_REGISTRADO,
    ejemplaresDisponibles: ficha.disponibles,
    ejemplaresRegistrados: ficha.registrados,
    disponibilidad,
  };
}

/**
 * Objetivo: Formatear una página de la búsqueda de libros (HULIB04).
 * @param {{ total: number, fichas: Object[] }} resultado - Resultado del modelo.
 * @param {Object} opciones - filtros, orden, pagina y porPagina aplicados.
 * @returns {Object} Cuerpo JSON de la respuesta.
 */
function formatearBusqueda(resultado, { filtros, orden, pagina, porPagina }) {
  return {
    total: resultado.total,
    pagina,
    porPagina,
    totalPaginas: Math.max(1, Math.ceil(resultado.total / porPagina)),
    orden,
    filtros: describirFiltros(filtros),
    mensaje:
      resultado.total > 0 ? null : 'No hay libros que coincidan con los criterios de búsqueda',
    libros: resultado.fichas.map(formatearFichaResumen),
  };
}

/**
 * Objetivo: Formatear el listado completo de libros (HULIS01): una fila por ficha, ordenado
 *   por Título y Clave, con el filtro aplicado y el total.
 * @param {{ total: number, fichas: Object[] }} resultado - Resultado del modelo.
 * @param {Object} filtros - Filtros aplicados.
 * @returns {Object} Cuerpo JSON de la respuesta.
 */
function formatearListado(resultado, filtros) {
  return {
    total: resultado.total,
    filtros: describirFiltros(filtros),
    mensaje:
      resultado.total > 0
        ? `${resultado.total} libros encontrados`
        : 'No hay libros que coincidan con los filtros seleccionados',
    libros: resultado.fichas.map(formatearFichaResumen),
  };
}

/**
 * Objetivo: Formatear la ubicación de cada ejemplar encontrado (HUUBI01). Si falta Librero o
 *   Fila se indica "No registrado"; nunca se toma la ubicación de otra copia.
 * @param {Object[]} ejemplares - Registros de consultaModelo.buscarUbicaciones().
 * @param {Object} filtros - Criterios capturados.
 * @returns {Object} Cuerpo JSON de la respuesta.
 */
function formatearUbicaciones(ejemplares, filtros) {
  return {
    total: ejemplares.length,
    filtros: describirFiltros(filtros),
    mensaje:
      ejemplares.length > 0 ? 'Libro encontrado' : 'No hay coincidencias con los datos ingresados',
    ejemplares: ejemplares.map((ejemplar) => ({
      claveLibro: ejemplar.clave_libro,
      titulo: ejemplar.titulo,
      autor: ejemplar.autor,
      claveEjemplar: ejemplar.codigo_ejemplar,
      librero: ejemplar.librero ?? NO_REGISTRADO,
      fila: ejemplar.fila ?? NO_REGISTRADO,
      estado: TEXTO_ESTADO_EJEMPLAR[ejemplar.estado],
      tipoUso: ejemplar.tipo_uso,
    })),
  };
}

export {
  NO_REGISTRADO,
  describirFiltros,
  formatearFichaResumen,
  formatearBusqueda,
  formatearListado,
  formatearUbicaciones,
};
