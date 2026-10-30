/*----
 * Programa: db.js
 * Objetivo: Configurar y exportar el manejador de conexiones a PostgreSQL (DbPool)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import pg from 'pg';
import ENTORNO from './entorno.js';

const MAX_CONEXIONES = 10; // Conexiones simultáneas permitidas hacia la BD
const ESPERA_CONEXION_MS = 5000; // Tiempo máximo para obtener una conexión

const DbPool = new pg.Pool({
  ...ENTORNO.BD,
  max: MAX_CONEXIONES,
  connectionTimeoutMillis: ESPERA_CONEXION_MS,
  client_encoding: 'UTF8',
});

// Un error en una conexión inactiva no debe tumbar el servidor; solo se registra
DbPool.on('error', (err) => {
  console.error('[DbPool] Error en conexión inactiva:', err.message);
});

/**
 * Objetivo: Ejecutar varias consultas dentro de una misma transacción (BEGIN/COMMIT).
 * @param {(cliente: import('pg').PoolClient) => Promise<any>} operacion - Función que recibe
 *   el cliente de la transacción y ejecuta sus consultas con él.
 * @returns {Promise<any>} Lo que devuelva la operación.
 * Limitaciones: Si la operación lanza un error se hace ROLLBACK y el error se propaga.
 */
async function ejecutarTransaccion(operacion) {
  const cliente = await DbPool.connect();
  try {
    await cliente.query('BEGIN');
    const resultado = await operacion(cliente);
    await cliente.query('COMMIT');
    return resultado;
  } catch (err) {
    await cliente.query('ROLLBACK');
    throw err;
  } finally {
    cliente.release();
  }
}

export default DbPool;
export { ejecutarTransaccion };
