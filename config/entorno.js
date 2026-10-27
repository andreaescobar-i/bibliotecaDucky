/*----
 * Programa: entorno.js
 * Objetivo: Cargar y validar las variables de entorno (.env) que usa la API
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const VARIABLES_OBLIGATORIAS = ['PGHOST', 'PGPORT', 'PGDATABASE', 'PGUSER', 'PGPASSWORD'];

/**
 * Objetivo: Detener el arranque si falta alguna variable obligatoria del .env.
 * @param {NodeJS.ProcessEnv} variables - Variables de entorno disponibles.
 * @returns {void}
 * Limitaciones: Solo comprueba que existan, no que sus valores sean correctos.
 */
function validarEntorno(variables) {
  const faltantes = VARIABLES_OBLIGATORIAS.filter((nombre) => !variables[nombre]);
  if (faltantes.length > 0) {
    throw new Error(`Faltan variables en .env: ${faltantes.join(', ')}`);
  }
}

// En las pruebas de la API la BD se simula, por eso no se exige el .env completo
const ES_PRUEBA = process.env.NODE_ENV === 'test';
if (!ES_PRUEBA) {
  validarEntorno(process.env);
}

const ENTORNO = Object.freeze({
  PUERTO: Number(process.env.PUERTO) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  ES_PRODUCCION: process.env.NODE_ENV === 'production',
  ES_PRUEBA,
  ORIGEN_FRONT: process.env.ORIGEN_FRONT || 'http://127.0.0.1:5173',
  BD: Object.freeze({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT) || 5432,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  }),
});

export default ENTORNO;
