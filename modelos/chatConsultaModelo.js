/*----
 * Programa: chatConsultaModelo.js
 * Objetivo: Consultas de solo lectura del asistente Ducky sobre el catálogo. Usan el usuario de
 *           PostgreSQL de solo lectura y únicamente las vistas del esquema chat
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 15 de Noviembre de 2026
 */

import DbPoolLectura from '../config/dbLectura.js';
import { crearPatronContiene } from '../utilidades/validacion.js';

const COLUMNAS_LIBRO = `clave_libro, titulo, autores, tema, editorial, isbn, edicion, anio,
  descripcion, ejemplares_disponibles, ejemplares_registrados`;

// Filtros de texto contenido, sin mayúsculas ni acentos, y la columna de la vista que revisan
const COLUMNAS_TEXTO = Object.freeze({
  titulo: 'titulo',
  autor: 'autores',
  tema: 'tema',
  editorial: 'editorial',
});
// Columnas en las que se busca cada palabra del texto libre
const COLUMNAS_TEXTO_LIBRE = ['titulo', 'autores', 'tema', 'editorial', 'descripcion'];
const ORDEN_TITULO = 'unaccent(LOWER(titulo)), clave_libro';

/**
 * Objetivo: Indicar si el .env define el usuario de solo lectura.
 * @returns {boolean} true si se pueden hacer consultas.
 */
function estaConfigurado() {
  return DbPoolLectura !== null;
}

/**
 * Objetivo: Armar las condiciones WHERE de la búsqueda; todos los filtros se combinan con AND.
 * @param {Object} filtros - titulo, autor, tema, editorial, clave, palabras (texto libre ya
 *   separado: [{ original, raiz }]) y soloDisponibles.
 * @param {any[]} parametros - Lista de parámetros ($1, $2...) que se va llenando.
 * @returns {string} Condiciones unidas con AND, o 'TRUE' si no hay filtros.
 */
function armarCondiciones(filtros, parametros) {
  const condiciones = [];
  const parametro = (valor) => {
    parametros.push(valor);
    return `$${parametros.length}`;
  };

  for (const [campo, columna] of Object.entries(COLUMNAS_TEXTO)) {
    if (filtros[campo]) {
      condiciones.push(
        `unaccent(${columna}) ILIKE unaccent(${parametro(crearPatronContiene(filtros[campo]))})`,
      );
    }
  }
  if (filtros.clave) {
    condiciones.push(`clave_libro = ${parametro(filtros.clave)}`);
  }
  // Cada palabra debe aparecer en alguna columna de texto, o ser la Clave de libro exacta
  for (const palabra of filtros.palabras ?? []) {
    const patron = parametro(crearPatronContiene(palabra.raiz));
    const clave = parametro(palabra.original.toUpperCase());
    const coincidencias = COLUMNAS_TEXTO_LIBRE.map(
      (columna) => `unaccent(COALESCE(${columna}, '')) ILIKE unaccent(${patron})`,
    );
    condiciones.push(`(${coincidencias.join(' OR ')} OR clave_libro = ${clave})`);
  }
  if (filtros.soloDisponibles) {
    condiciones.push('ejemplares_disponibles > 0');
  }
  return condiciones.length > 0 ? condiciones.join(' AND ') : 'TRUE';
}

/**
 * Objetivo: Buscar fichas activas del catálogo con su disponibilidad.
 * @param {Object} filtros - Filtros ya validados (ver armarCondiciones).
 * @param {number} limite - Máximo de fichas a devolver.
 * @returns {Promise<{ total: number, libros: Object[] }>} Total de coincidencias y las primeras
 *   fichas ordenadas por Título.
 */
async function buscarLibros(filtros, limite) {
  const parametros = [];
  const donde = armarCondiciones(filtros, parametros);
  parametros.push(limite);
  const resultado = await DbPoolLectura.query(
    `SELECT ${COLUMNAS_LIBRO}, COUNT(*) OVER ()::INT AS total
     FROM chat.libro
     WHERE ${donde}
     ORDER BY ${ORDEN_TITULO}
     LIMIT $${parametros.length}`,
    parametros,
  );
  return { total: resultado.rows[0]?.total ?? 0, libros: resultado.rows };
}

/**
 * Objetivo: Obtener una ficha activa por su Clave de libro exacta.
 * @param {string} clave - Clave de libro en mayúsculas.
 * @returns {Promise<Object|null>} Ficha, o null si no existe o está dada de baja.
 */
async function obtenerLibro(clave) {
  const resultado = await DbPoolLectura.query(
    `SELECT ${COLUMNAS_LIBRO} FROM chat.libro WHERE clave_libro = $1`,
    [clave],
  );
  return resultado.rows[0] || null;
}

/**
 * Objetivo: Listar los ejemplares en circulación de una ficha.
 * @param {string} clave - Clave de libro en mayúsculas.
 * @returns {Promise<Object[]>} Ejemplares ordenados por su código.
 */
async function listarEjemplaresDeLibro(clave) {
  const resultado = await DbPoolLectura.query(
    `SELECT codigo_ejemplar, clave_clasificacion, librero, fila, estado, tipo_uso,
            permite_prestamo
     FROM chat.ejemplar
     WHERE clave_libro = $1
     ORDER BY codigo_ejemplar`,
    [clave],
  );
  return resultado.rows;
}

/**
 * Objetivo: Obtener un ejemplar en circulación por su código exacto.
 * @param {string} codigo - Código del ejemplar en mayúsculas.
 * @returns {Promise<Object|null>} Ejemplar con el título de su ficha, o null si no existe o
 *   está dado de baja.
 */
async function obtenerEjemplar(codigo) {
  const resultado = await DbPoolLectura.query(
    `SELECT clave_libro, titulo, codigo_ejemplar, clave_clasificacion, librero, fila, estado,
            tipo_uso, permite_prestamo
     FROM chat.ejemplar
     WHERE codigo_ejemplar = $1`,
    [codigo],
  );
  return resultado.rows[0] || null;
}

/**
 * Objetivo: Listar los temas del catálogo con el número de fichas activas de cada uno.
 * @returns {Promise<Object[]>} Temas ordenados por nombre.
 */
async function listarTemas() {
  const resultado = await DbPoolLectura.query(
    'SELECT nombre, descripcion, libros FROM chat.tema ORDER BY nombre',
  );
  return resultado.rows;
}

/**
 * Objetivo: Listar los tipos de uso de los ejemplares.
 * @returns {Promise<Object[]>} Tipos de uso ordenados por nombre.
 */
async function listarTiposUso() {
  const resultado = await DbPoolLectura.query(
    'SELECT nombre, permite_prestamo, descripcion FROM chat.tipo_uso ORDER BY nombre',
  );
  return resultado.rows;
}

/**
 * Objetivo: Listar las reglas de préstamo vigentes y los roles a los que aplican.
 * @returns {Promise<Object[]>} Días hábiles y renovaciones máximas por regla.
 */
async function listarReglasPrestamo() {
  const resultado = await DbPoolLectura.query(
    `SELECT nombre, dias_habiles, max_renovaciones, roles
     FROM chat.regla_prestamo ORDER BY nombre`,
  );
  return resultado.rows;
}

export {
  estaConfigurado,
  buscarLibros,
  obtenerLibro,
  listarEjemplaresDeLibro,
  obtenerEjemplar,
  listarTemas,
  listarTiposUso,
  listarReglasPrestamo,
};
