/*----
 * Programa: consultaModelo.js
 * Objetivo: Consultas de solo lectura del catálogo: búsqueda y listado de fichas con
 *           disponibilidad (HULIB04, HULIS01) y ubicación de ejemplares (HUUBI01)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import DbPool from '../config/db.js';
import { crearPatronContiene } from '../utilidades/validacion.js';

// Fichas activas con autores, tema, editorial y conteo de ejemplares. Los dados de baja no
// cuentan como registrados ni como disponibles.
const FICHAS = `
  WITH fichas AS (
    SELECT l.libro_id, l.clave_libro, l.titulo, l.isbn, c.nombre AS tema,
           e.nombre AS editorial,
           COALESCE(
             (SELECT STRING_AGG(CONCAT_WS(' ', a.primer_nombre, a.primer_apellido), '; '
                                ORDER BY af.orden)
              FROM autoria_ficha af JOIN autor a ON a.autor_id = af.autor_id
              WHERE af.libro_id = l.libro_id),
             ''
           ) AS autor,
           (SELECT COUNT(*)::INT FROM ejemplar ej
            WHERE ej.libro_id = l.libro_id AND ej.estado = 'DISPONIBLE') AS disponibles,
           (SELECT COUNT(*)::INT FROM ejemplar ej
            WHERE ej.libro_id = l.libro_id AND ej.estado <> 'DADO_DE_BAJA') AS registrados
    FROM libro l
    JOIN categoria c ON c.categoria_id = l.categoria_id
    JOIN editorial e ON e.id_editorial = l.editorial_id
    WHERE l.estado = 'ACTIVO'
  )`;

// Columnas en las que se busca texto contenido, sin mayúsculas ni acentos
const COLUMNAS_TEXTO = Object.freeze({
  titulo: 'f.titulo',
  autor: 'f.autor',
  tema: 'f.tema',
  editorial: 'f.editorial',
});

// Órdenes permitidos; nunca se arma un ORDER BY con texto del usuario
const ORDENES = Object.freeze({
  TITULO_ASC: 'unaccent(LOWER(f.titulo)), f.clave_libro',
  TITULO_DESC: 'unaccent(LOWER(f.titulo)) DESC, f.clave_libro',
  AUTOR_ASC: 'unaccent(LOWER(f.autor)), unaccent(LOWER(f.titulo)), f.clave_libro',
});

/**
 * Objetivo: Armar las condiciones WHERE de los filtros. Todos los filtros no vacíos se
 *   aplican a la misma ficha (AND); la Clave de libro es coincidencia exacta.
 * @param {Object} filtros - titulo, autor, tema, editorial, clave, tipoUso y "texto" (campo
 *   único del front, que busca en Título, Autor, Tema, Editorial o Clave exacta).
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
    condiciones.push(`f.clave_libro = ${parametro(filtros.clave)}`);
  }
  if (filtros.texto) {
    const patron = parametro(crearPatronContiene(filtros.texto));
    const claveExacta = parametro(filtros.texto.toUpperCase());
    const coincidencias = Object.values(COLUMNAS_TEXTO).map(
      (columna) => `unaccent(${columna}) ILIKE unaccent(${patron})`,
    );
    condiciones.push(`(${coincidencias.join(' OR ')} OR f.clave_libro = ${claveExacta})`);
  }
  if (filtros.tipoUso) {
    condiciones.push(
      `EXISTS (SELECT 1 FROM ejemplar ej JOIN tipo_uso tu ON tu.tipo_uso_id = ej.tipo_uso_id
               WHERE ej.libro_id = f.libro_id AND ej.estado <> 'DADO_DE_BAJA'
                 AND tu.nombre = ${parametro(filtros.tipoUso)})`,
    );
  }
  return condiciones.length > 0 ? condiciones.join(' AND ') : 'TRUE';
}

/**
 * Objetivo: Buscar fichas con disponibilidad. Devuelve una fila por ficha, sin duplicarla por
 *   cada ejemplar.
 * @param {Object} opciones - Opciones de la consulta.
 * @param {Object} opciones.filtros - Filtros ya validados (ver armarCondiciones).
 * @param {string} opciones.orden - 'RELEVANCIA', 'TITULO_ASC', 'TITULO_DESC' o 'AUTOR_ASC'.
 * @param {number|null} [opciones.limite] - Fichas por página; null para todas.
 * @param {number} [opciones.desplazamiento] - Fichas que se saltan.
 * @returns {Promise<{ total: number, fichas: Object[] }>} Total de coincidencias y página.
 */
async function buscarFichas({ filtros, orden, limite = null, desplazamiento = 0 }) {
  const parametrosFiltro = [];
  const donde = armarCondiciones(filtros, parametrosFiltro);
  const parametros = [...parametrosFiltro];

  // "Relevancia": primero la clave exacta, luego títulos que empiezan con el texto buscado
  let ordenSql = ORDENES[orden] ?? ORDENES.TITULO_ASC;
  if (orden === 'RELEVANCIA' && filtros.texto) {
    parametros.push(filtros.texto.toUpperCase(), `${filtros.texto}%`);
    const clave = `$${parametros.length - 1}`;
    const inicio = `$${parametros.length}`;
    ordenSql = `CASE WHEN f.clave_libro = ${clave} THEN 0
                     WHEN unaccent(f.titulo) ILIKE unaccent(${inicio}) THEN 1 ELSE 2 END,
                ${ORDENES.TITULO_ASC}`;
  }

  parametros.push(limite, desplazamiento);
  const resultado = await DbPool.query(
    `${FICHAS}
     SELECT f.*, COUNT(*) OVER ()::INT AS total
     FROM fichas f
     WHERE ${donde}
     ORDER BY ${ordenSql}
     LIMIT $${parametros.length - 1} OFFSET $${parametros.length}`,
    parametros,
  );
  if (resultado.rows.length > 0 || desplazamiento === 0) {
    return { total: resultado.rows[0]?.total ?? 0, fichas: resultado.rows };
  }
  // Una página fuera de rango no trae filas; el total se cuenta aparte
  const conteo = await DbPool.query(
    `${FICHAS} SELECT COUNT(*)::INT AS total FROM fichas f WHERE ${donde}`,
    parametrosFiltro,
  );
  return { total: conteo.rows[0].total, fichas: [] };
}

/**
 * Objetivo: Buscar los ejemplares físicos de las fichas que cumplen todos los criterios, con su
 *   Librero y Fila tal como están registrados (HUUBI01). Excluye ejemplares dados de baja.
 * @param {Object} filtros - titulo, autor, tema, editorial y/o clave ya validados.
 * @returns {Promise<Object[]>} Un registro por ejemplar, ordenados por Título y clave.
 */
async function buscarUbicaciones(filtros) {
  const parametros = [];
  const donde = armarCondiciones(filtros, parametros);
  const resultado = await DbPool.query(
    `${FICHAS}
     SELECT f.clave_libro, f.titulo, f.autor, ej.codigo_ejemplar, ej.librero, ej.fila,
            ej.estado, tu.nombre AS tipo_uso
     FROM fichas f
     JOIN ejemplar ej ON ej.libro_id = f.libro_id AND ej.estado <> 'DADO_DE_BAJA'
     JOIN tipo_uso tu ON tu.tipo_uso_id = ej.tipo_uso_id
     WHERE ${donde}
     ORDER BY ${ORDENES.TITULO_ASC}, ej.codigo_ejemplar`,
    parametros,
  );
  return resultado.rows;
}

export { buscarFichas, buscarUbicaciones };
