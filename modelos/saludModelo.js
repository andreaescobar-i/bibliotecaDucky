/*----
 * Programa: saludModelo.js
 * Objetivo: Consultar el estado de la conexión con PostgreSQL
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import DbPool from '../config/db.js';

/**
 * Objetivo: Obtener la hora y versión del servidor de base de datos.
 * @returns {Promise<{ fecha: Date, version: string }>} Datos del servidor PostgreSQL.
 * Limitaciones: Lanza el error de pg si no hay conexión.
 */
async function obtenerEstadoBaseDatos() {
  const resultado = await DbPool.query('SELECT NOW() AS fecha, VERSION() AS version');
  return resultado.rows[0];
}

export { obtenerEstadoBaseDatos };
