/*----
 * Programa: entorno.js
 * Objetivo: Cargar y validar las variables de entorno (.env) que usa la API
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const VARIABLES_OBLIGATORIAS = [
  'PGHOST',
  'PGPORT',
  'PGDATABASE',
  'PGUSER',
  'PGPASSWORD',
  'JWT_SECRETO',
];
const LONGITUD_MINIMA_SECRETO = 32; // Caracteres mínimos de la clave que firma las sesiones
const SECRETO_PRUEBAS = 'secreto-solo-para-pruebas-automaticas-0000'; // Nunca se usa fuera de test

/**
 * Objetivo: Detener el arranque si falta alguna variable obligatoria del .env o si la clave de
 *   sesiones es demasiado corta.
 * @param {NodeJS.ProcessEnv} variables - Variables de entorno disponibles.
 * @returns {void}
 * Limitaciones: No comprueba que la contraseña de la BD sea correcta.
 */
function validarEntorno(variables) {
  const faltantes = VARIABLES_OBLIGATORIAS.filter((nombre) => !variables[nombre]);
  if (faltantes.length > 0) {
    throw new Error(`Faltan variables en .env: ${faltantes.join(', ')}`);
  }
  if (variables.JWT_SECRETO.length < LONGITUD_MINIMA_SECRETO) {
    throw new Error(`JWT_SECRETO debe tener al menos ${LONGITUD_MINIMA_SECRETO} caracteres`);
  }
}

// En las pruebas de la API la BD se simula, por eso no se exige el .env completo
const ES_PRUEBA = process.env.NODE_ENV === 'test';
if (!ES_PRUEBA) {
  validarEntorno(process.env);
}

// Usuario de PostgreSQL de solo lectura del asistente Ducky. Es opcional: sin él la API funciona
// y solo el asistente queda sin consultar el catálogo.
const CHAT_BD =
  process.env.CHAT_PGUSER && process.env.CHAT_PGPASSWORD
    ? Object.freeze({ user: process.env.CHAT_PGUSER, password: process.env.CHAT_PGPASSWORD })
    : null;

// Asistente Ducky: modelo de Gemini en Gemini Enterprise Agent Platform (Google Cloud). También
// es opcional: sin la key, o con CHAT_HABILITADO=false, el asistente queda apagado y el resto
// de la API funciona igual.
const MODELO_GEMINI_POR_OMISION = 'gemini-3.5-flash-lite'; // Modelo ligero: rápido y económico
const GEMINI = Object.freeze({
  habilitado: process.env.CHAT_HABILITADO !== 'false' && Boolean(process.env.GEMINI_API_KEY),
  apiKey: process.env.GEMINI_API_KEY || null,
  modelo: process.env.GEMINI_MODELO || MODELO_GEMINI_POR_OMISION,
});

const ENTORNO = Object.freeze({
  PUERTO: Number(process.env.PUERTO) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  ES_PRODUCCION: process.env.NODE_ENV === 'production',
  ES_PRUEBA,
  ORIGEN_FRONT: process.env.ORIGEN_FRONT || 'http://127.0.0.1:5173',
  JWT_SECRETO: process.env.JWT_SECRETO || SECRETO_PRUEBAS,
  DURACION_SESION_HORAS: Number(process.env.DURACION_SESION_HORAS) || 8,
  LIMITE_INTENTOS_LOGIN: Number(process.env.LIMITE_INTENTOS_LOGIN) || 10,
  VENTANA_INTENTOS_MINUTOS: Number(process.env.VENTANA_INTENTOS_MINUTOS) || 15,
  BD: Object.freeze({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT) || 5432,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  }),
  CHAT_BD,
  GEMINI,
});

export default ENTORNO;
