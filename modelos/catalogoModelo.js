/*----
 * Programa: catalogoModelo.js
 * Objetivo: Consultas de los catálogos auxiliares de las fichas: temas, tipos de uso,
 *           editoriales y autores
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import DbPool from '../config/db.js';

/**
 * Objetivo: Listar temas, tipos de uso y editoriales para las listas del front.
 * @returns {Promise<{ temas: string[], tiposUso: Object[], editoriales: string[] }>} Catálogos.
 */
async function listarCatalogos() {
  const [temas, tiposUso, editoriales] = await Promise.all([
    DbPool.query('SELECT nombre FROM categoria ORDER BY nombre'),
    DbPool.query('SELECT nombre, permite_prestamo FROM tipo_uso ORDER BY tipo_uso_id'),
    DbPool.query('SELECT nombre FROM editorial WHERE activo ORDER BY nombre'),
  ]);
  return {
    temas: temas.rows.map((fila) => fila.nombre),
    tiposUso: tiposUso.rows,
    editoriales: editoriales.rows.map((fila) => fila.nombre),
  };
}

/**
 * Objetivo: Obtener un tema (categoría) por nombre, sin importar mayúsculas ni acentos.
 * @param {string} nombre - Tema capturado.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<{ categoria_id: string, nombre: string }|null>} Tema, o null si no existe.
 */
async function obtenerTema(nombre, cliente = DbPool) {
  const resultado = await cliente.query(
    `SELECT categoria_id, nombre FROM categoria
     WHERE LOWER(unaccent(nombre)) = LOWER(unaccent($1))`,
    [nombre],
  );
  return resultado.rows[0] || null;
}

/**
 * Objetivo: Obtener un tipo de uso por nombre, sin importar mayúsculas ni acentos.
 * @param {string} nombre - Tipo de uso capturado (ej. "Préstamo externo").
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<{ tipo_uso_id: string, nombre: string }|null>} Tipo de uso, o null.
 */
async function obtenerTipoUso(nombre, cliente = DbPool) {
  const resultado = await cliente.query(
    `SELECT tipo_uso_id, nombre FROM tipo_uso
     WHERE LOWER(unaccent(nombre)) = LOWER(unaccent($1))`,
    [nombre],
  );
  return resultado.rows[0] || null;
}

/**
 * Objetivo: Obtener el id de una editorial; la registra si todavía no existe.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string} nombre - Nombre de la editorial.
 * @returns {Promise<string>} Id de la editorial.
 */
async function obtenerOCrearEditorial(cliente, nombre) {
  const existente = await cliente.query(
    'SELECT id_editorial FROM editorial WHERE LOWER(nombre) = LOWER($1)',
    [nombre],
  );
  if (existente.rows[0]) {
    return existente.rows[0].id_editorial;
  }
  const creada = await cliente.query(
    'INSERT INTO editorial (nombre) VALUES ($1) RETURNING id_editorial',
    [nombre],
  );
  return creada.rows[0].id_editorial;
}

/**
 * Objetivo: Obtener el id de un autor; lo registra si todavía no existe.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {{ primerNombre: string, primerApellido: string|null }} autor - Nombre separado.
 * @returns {Promise<string>} Id del autor.
 */
async function obtenerOCrearAutor(cliente, { primerNombre, primerApellido }) {
  const existente = await cliente.query(
    `SELECT autor_id FROM autor
     WHERE LOWER(primer_nombre) = LOWER($1)
       AND LOWER(COALESCE(primer_apellido, '')) = LOWER(COALESCE($2, ''))`,
    [primerNombre, primerApellido],
  );
  if (existente.rows[0]) {
    return existente.rows[0].autor_id;
  }
  const creado = await cliente.query(
    'INSERT INTO autor (primer_nombre, primer_apellido) VALUES ($1, $2) RETURNING autor_id',
    [primerNombre, primerApellido],
  );
  return creado.rows[0].autor_id;
}

export { listarCatalogos, obtenerTema, obtenerTipoUso, obtenerOCrearEditorial, obtenerOCrearAutor };
