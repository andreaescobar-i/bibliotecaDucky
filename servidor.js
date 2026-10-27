/*----
 * Programa: servidor.js
 * Objetivo: Punto de entrada; levanta la API en el puerto configurado en .env
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import ENTORNO from './config/entorno.js';
import app from './app.js';
import DbPool from './config/db.js';

const servidor = app.listen(ENTORNO.PUERTO, () => {
  console.log(`API SIGB escuchando en http://localhost:${ENTORNO.PUERTO}/api`);
  console.log(`Estado de la BD: http://localhost:${ENTORNO.PUERTO}/api/salud`);
});

/**
 * Objetivo: Cerrar el servidor y las conexiones a la BD antes de salir del proceso.
 * @param {string} senal - Señal del sistema recibida (SIGINT, SIGTERM).
 * @returns {void}
 */
function apagar(senal) {
  console.log(`Señal ${senal} recibida; cerrando la API...`);
  servidor.close(async () => {
    await DbPool.end();
    process.exit(0);
  });
}

process.on('SIGINT', apagar);
process.on('SIGTERM', apagar);
