/*----
 * Programa: libroModelo.js
 * Objetivo: Consultas de fichas bibliográficas: detalle, alta, cambio de datos y baja del libro
 *           completo (HULIB01, HULIB03 y pantalla de libros del front)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import DbPool from '../config/db.js';

// Ficha con autores en orden, tema, editorial y conteo de ejemplares por estado
const SELECCION_LIBRO = `
  SELECT l.libro_id, l.clave_libro, l.titulo, l.isbn, l.edicion, l."año" AS anio,
         l.descripcion, l.precio_compra, l.estado, l.fecha_alta, l.fecha_baja, l.motivo_baja,
         c.categoria_id, c.nombre AS tema, e.id_editorial, e.nombre AS editorial,
         COALESCE(
           (SELECT ARRAY_AGG(CONCAT_WS(' ', a.primer_nombre, a.primer_apellido) ORDER BY af.orden)
            FROM autoria_ficha af JOIN autor a ON a.autor_id = af.autor_id
            WHERE af.libro_id = l.libro_id),
           '{}'
         ) AS autores,
         (SELECT COUNT(*)::INT FROM ejemplar ej WHERE ej.libro_id = l.libro_id) AS ejemplares_total,
         (SELECT COUNT(*)::INT FROM ejemplar ej
          WHERE ej.libro_id = l.libro_id AND ej.estado = 'DISPONIBLE') AS ejemplares_disponibles,
         (SELECT COUNT(*)::INT FROM ejemplar ej
          WHERE ej.libro_id = l.libro_id AND ej.estado = 'PRESTADO') AS ejemplares_prestados,
         (SELECT COUNT(*)::INT FROM ejemplar ej
          WHERE ej.libro_id = l.libro_id AND ej.estado = 'DADO_DE_BAJA') AS ejemplares_baja
  FROM libro l
  JOIN categoria c ON c.categoria_id = l.categoria_id
  JOIN editorial e ON e.id_editorial = l.editorial_id`;

/**
 * Objetivo: Obtener una ficha por su Clave de libro (coincidencia exacta).
 * @param {string} clave - Clave de libro normalizada.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<Object|null>} Ficha, o null si no existe.
 */
async function obtenerLibroPorClave(clave, cliente = DbPool) {
  const resultado = await cliente.query(`${SELECCION_LIBRO} WHERE l.clave_libro = $1`, [clave]);
  return resultado.rows[0] || null;
}

/**
 * Objetivo: Saber si un ISBN ya pertenece a otra ficha.
 * @param {string} isbn - ISBN normalizado.
 * @param {string|null} [excluirLibroId] - Ficha que se está editando.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<string|null>} Clave de la ficha que lo usa, o null.
 */
async function obtenerClavePorIsbn(isbn, excluirLibroId = null, cliente = DbPool) {
  const resultado = await cliente.query(
    `SELECT clave_libro FROM libro
     WHERE isbn = $1 AND ($2::BIGINT IS NULL OR libro_id <> $2)`,
    [isbn, excluirLibroId],
  );
  return resultado.rows[0]?.clave_libro ?? null;
}

/**
 * Objetivo: Registrar una ficha bibliográfica nueva.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {Object} datos - clave, titulo, isbn, edicion, anio, descripcion, precioCompra,
 *   categoriaId y editorialId.
 * @returns {Promise<string>} Id de la ficha.
 */
async function crearLibro(cliente, datos) {
  const resultado = await cliente.query(
    `INSERT INTO libro
       (editorial_id, categoria_id, clave_libro, titulo, isbn, edicion, "año", descripcion,
        precio_compra)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING libro_id`,
    [
      datos.editorialId,
      datos.categoriaId,
      datos.clave,
      datos.titulo,
      datos.isbn,
      datos.edicion,
      datos.anio,
      datos.descripcion,
      datos.precioCompra,
    ],
  );
  return resultado.rows[0].libro_id;
}

/**
 * Objetivo: Guardar los datos bibliográficos de una ficha. La clave no se modifica.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string} libroId - Id de la ficha.
 * @param {Object} datos - Valores finales (titulo, isbn, edicion, anio, descripcion,
 *   precioCompra, categoriaId, editorialId).
 * @returns {Promise<void>}
 */
async function actualizarLibro(cliente, libroId, datos) {
  await cliente.query(
    `UPDATE libro
     SET titulo = $2, isbn = $3, edicion = $4, "año" = $5, descripcion = $6, precio_compra = $7,
         categoria_id = $8, editorial_id = $9
     WHERE libro_id = $1`,
    [
      libroId,
      datos.titulo,
      datos.isbn,
      datos.edicion,
      datos.anio,
      datos.descripcion,
      datos.precioCompra,
      datos.categoriaId,
      datos.editorialId,
    ],
  );
}

/**
 * Objetivo: Reemplazar los autores de una ficha conservando el orden capturado.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string} libroId - Id de la ficha.
 * @param {string[]} autorIds - Ids de autores en orden (sin repetidos).
 * @returns {Promise<void>}
 */
async function reemplazarAutores(cliente, libroId, autorIds) {
  await cliente.query('DELETE FROM autoria_ficha WHERE libro_id = $1', [libroId]);
  await cliente.query(
    `INSERT INTO autoria_ficha (libro_id, autor_id, orden)
     SELECT $1, autor_id, orden
     FROM UNNEST($2::BIGINT[]) WITH ORDINALITY AS t (autor_id, orden)`,
    [libroId, autorIds],
  );
}

/**
 * Objetivo: Marcar la ficha como dada de baja. No se borra: conserva ejemplares e historial.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string} libroId - Id de la ficha.
 * @param {string} motivo - Motivo de la baja.
 * @returns {Promise<void>}
 */
async function darDeBajaLibro(cliente, libroId, motivo) {
  await cliente.query(
    `UPDATE libro SET estado = 'DADO_DE_BAJA', fecha_baja = NOW(), motivo_baja = $2
     WHERE libro_id = $1`,
    [libroId, motivo],
  );
}

/**
 * Objetivo: Bloquear la ficha hasta terminar la transacción.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string} libroId - Id de la ficha.
 * @returns {Promise<void>}
 */
async function bloquearLibro(cliente, libroId) {
  await cliente.query('SELECT 1 FROM libro WHERE libro_id = $1 FOR NO KEY UPDATE', [libroId]);
}

export {
  obtenerLibroPorClave,
  obtenerClavePorIsbn,
  crearLibro,
  actualizarLibro,
  reemplazarAutores,
  darDeBajaLibro,
  bloquearLibro,
};
