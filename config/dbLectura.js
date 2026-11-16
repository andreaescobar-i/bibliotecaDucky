/*----
 * Programa: dbLectura.js
 * Objetivo: Configurar las conexiones a PostgreSQL del asistente Ducky con un usuario de solo
 *           lectura (CHAT_PGUSER), que únicamente puede consultar las vistas del esquema chat
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 15 de Noviembre de 2026
 */

import pg from 'pg';
import ENTORNO from './entorno.js';

const MAX_CONEXIONES = 3; // El usuario de solo lectura admite 5 en total en el servidor
const ESPERA_CONEXION_MS = 5000; // Tiempo máximo para obtener una conexión
const ESPERA_CONSULTA_MS = 3000; // Tiempo máximo de una consulta del asistente

/**
 * Objetivo: Crear el manejador de conexiones de solo lectura.
 * @returns {import('pg').Pool|null} El manejador, o null si el .env no define CHAT_PGUSER y
 *   CHAT_PGPASSWORD (el resto de la API funciona igual sin él).
 * Limitaciones: No abre ninguna conexión hasta la primera consulta.
 */
function crearPoolLectura() {
  if (!ENTORNO.CHAT_BD) {
    return null;
  }
  const pool = new pg.Pool({
    ...ENTORNO.BD,
    ...ENTORNO.CHAT_BD,
    max: MAX_CONEXIONES,
    connectionTimeoutMillis: ESPERA_CONEXION_MS,
    statement_timeout: ESPERA_CONSULTA_MS,
    client_encoding: 'UTF8',
    // Se repite lo que ya fija la base para este usuario, por si alguien cambia esa configuración
    options: '-c default_transaction_read_only=on',
  });
  // Un error en una conexión inactiva no debe tumbar el servidor; solo se registra
  pool.on('error', (err) => {
    console.error('[DbPoolLectura] Error en conexión inactiva:', err.message);
  });
  return pool;
}

const DbPoolLectura = crearPoolLectura();

export default DbPoolLectura;
