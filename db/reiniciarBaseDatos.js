/*----
 * Programa: reiniciarBaseDatos.js
 * Objetivo: Crear desde cero la base de datos del .env: la borra si existe, aplica el esquema
 *           base, las migraciones y las semillas, en ese orden. Uso: npm run db:reset
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';
import ENTORNO from '../config/entorno.js';

// Carpetas que se ejecutan en este orden; dentro de cada una, por nombre de archivo
const CARPETAS_SQL = ['esquema', 'migraciones', 'semillas'];
const BD_MANTENIMIENTO = 'postgres'; // BD a la que se conecta para crear o borrar la del proyecto
const FORMATO_NOMBRE_BD = /^[a-z_][a-z0-9_]{0,62}$/; // Evita inyectar SQL en DROP/CREATE DATABASE
const TABLAS_RESUMEN = [
  'rol',
  'permiso',
  'perfil',
  'usuario',
  'libro',
  'ejemplar',
  'solicitud_adquisicion',
];

/**
 * Objetivo: Obtener las rutas de los archivos .sql de una carpeta ordenados por nombre.
 * @param {string} carpeta - Nombre de la carpeta dentro de db/.
 * @returns {string[]} Rutas absolutas de los archivos .sql.
 */
function obtenerArchivosSql(carpeta) {
  const rutaCarpeta = path.join(import.meta.dirname, carpeta);
  return fs
    .readdirSync(rutaCarpeta)
    .filter((archivo) => archivo.endsWith('.sql'))
    .sort()
    .map((archivo) => path.join(rutaCarpeta, archivo));
}

/**
 * Objetivo: Borrar y volver a crear la base de datos del proyecto.
 * @param {string} nombreBd - Nombre validado de la base de datos.
 * @returns {Promise<void>}
 * Limitaciones: DROP ... WITH (FORCE) requiere PostgreSQL 13 o posterior.
 */
async function recrearBaseDatos(nombreBd) {
  const ClienteMantenimiento = new pg.Client({ ...ENTORNO.BD, database: BD_MANTENIMIENTO });
  await ClienteMantenimiento.connect();
  try {
    await ClienteMantenimiento.query(`DROP DATABASE IF EXISTS ${nombreBd} WITH (FORCE)`);
    await ClienteMantenimiento.query(
      `CREATE DATABASE ${nombreBd} WITH ENCODING 'UTF8' TEMPLATE template0`,
    );
  } finally {
    await ClienteMantenimiento.end();
  }
}

/**
 * Objetivo: Ejecutar en orden todos los archivos SQL del proyecto sobre la base recién creada.
 * @param {import('pg').Client} ClienteBd - Cliente conectado a la base del proyecto.
 * @returns {Promise<void>}
 * Limitaciones: Se detiene en el primer archivo que falle e indica cuál fue.
 */
async function ejecutarArchivosSql(ClienteBd) {
  for (const carpeta of CARPETAS_SQL) {
    for (const rutaArchivo of obtenerArchivosSql(carpeta)) {
      const nombreArchivo = `${carpeta}/${path.basename(rutaArchivo)}`;
      // trimStart() también quita el BOM que algunos editores de Windows agregan al inicio
      const sql = fs.readFileSync(rutaArchivo, 'utf8').trimStart();
      try {
        await ClienteBd.query(sql);
        console.log(`  ✓ ${nombreArchivo}`);
      } catch (err) {
        err.message = `Falló ${nombreArchivo}: ${err.message}`;
        throw err;
      }
    }
  }
}

/**
 * Objetivo: Mostrar cuántos registros quedaron en las tablas principales.
 * @param {import('pg').Client} ClienteBd - Cliente conectado a la base del proyecto.
 * @returns {Promise<void>}
 */
async function mostrarResumen(ClienteBd) {
  const partes = [];
  for (const tabla of TABLAS_RESUMEN) {
    // Los nombres de tabla son constantes del programa, no datos del usuario
    const resultado = await ClienteBd.query(`SELECT COUNT(*)::INT AS total FROM ${tabla}`);
    partes.push(`${tabla}: ${resultado.rows[0].total}`);
  }
  console.log(`\nRegistros cargados → ${partes.join(' · ')}`);
}

/**
 * Objetivo: Ejecutar el reinicio completo de la base de datos.
 * @returns {Promise<void>}
 */
async function reiniciarBaseDatos() {
  const nombreBd = ENTORNO.BD.database;
  if (ENTORNO.ES_PRODUCCION) {
    throw new Error('db:reset está bloqueado con NODE_ENV=production');
  }
  if (!FORMATO_NOMBRE_BD.test(nombreBd)) {
    throw new Error(`PGDATABASE debe usar minúsculas, números y guion bajo: "${nombreBd}"`);
  }

  console.log(`Recreando la base "${nombreBd}" en ${ENTORNO.BD.host}:${ENTORNO.BD.port}...`);
  await recrearBaseDatos(nombreBd);

  const ClienteBd = new pg.Client(ENTORNO.BD);
  await ClienteBd.connect();
  try {
    await ejecutarArchivosSql(ClienteBd);
    await mostrarResumen(ClienteBd);
  } finally {
    await ClienteBd.end();
  }
  console.log('Base de datos lista. Contraseña de las cuentas de prueba: Ducky2026');
}

// Sugerencias para los errores de conexión más comunes
const SUGERENCIAS_ERROR = {
  '28P01': 'Revisa PGUSER y PGPASSWORD en el archivo .env',
  ECONNREFUSED: 'PostgreSQL no responde; revisa que el servicio esté iniciado y PGHOST/PGPORT',
  ENOTFOUND: 'No se encontró el servidor; revisa PGHOST en el archivo .env',
};

reiniciarBaseDatos().catch((err) => {
  // Un fallo de conexión llega como AggregateError, sin mensaje propio pero con código
  console.error(`\n✗ ${err.message || err.code || err}`);
  if (SUGERENCIAS_ERROR[err.code]) {
    console.error(`  ${SUGERENCIAS_ERROR[err.code]}`);
  }
  process.exitCode = 1;
});
