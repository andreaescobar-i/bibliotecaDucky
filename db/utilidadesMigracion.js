/*----
 * Programa: utilidadesMigracion.js
 * Objetivo: Funciones compartidas por npm run db:reset y npm run db:migrar: listar los archivos
 *           de esquema y migración, llevar el control de cuáles ya se aplicaron y preparar el
 *           usuario de solo lectura del asistente
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 15 de Noviembre de 2026
 */

import fs from 'node:fs';
import path from 'node:path';

// Carpetas cuyos archivos cambian la estructura de la base, en orden. Las semillas no entran:
// son datos de prueba y solo las carga db:reset.
const CARPETAS_MIGRACION = ['esquema', 'migraciones'];
// Minúsculas, números y guion bajo: evita inyectar SQL donde no se pueden usar parámetros
const FORMATO_IDENTIFICADOR = /^[a-z_][a-z0-9_]{0,62}$/;
const MAX_CONEXIONES_LECTURA = 5; // Conexiones simultáneas del usuario de solo lectura
const ESPERA_MAXIMA_CONSULTA = '3s'; // Una consulta del asistente nunca tarda más que esto
const ESQUEMA_ASISTENTE = 'chat';

// Bases creadas antes de que existiera el control: cómo reconocer lo que ya tienen aplicado
const MARCADORES_APLICADAS = Object.freeze({
  'esquema/000_biblioteca_schema.sql': "SELECT to_regclass('public.libro') IS NOT NULL AS existe",
  'migraciones/001_sprint1.sql': "SELECT to_regclass('public.permiso') IS NOT NULL AS existe",
  'migraciones/002_sesiones.sql': `SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'usuario'
        AND column_name = 'version_sesion') AS existe`,
});

/**
 * Objetivo: Listar los archivos .sql de esquema y migraciones en el orden en que se aplican.
 * @param {string} [carpetaDb] - Carpeta db/ del proyecto (se cambia solo en pruebas).
 * @returns {{ nombre: string, ruta: string }[]} Nombre (carpeta/archivo.sql) y ruta absoluta.
 */
function listarMigraciones(carpetaDb = import.meta.dirname) {
  return CARPETAS_MIGRACION.flatMap((carpeta) =>
    fs
      .readdirSync(path.join(carpetaDb, carpeta))
      .filter((archivo) => archivo.endsWith('.sql'))
      .sort()
      .map((archivo) => ({
        nombre: `${carpeta}/${archivo}`,
        ruta: path.join(carpetaDb, carpeta, archivo),
      })),
  );
}

/**
 * Objetivo: Obtener las migraciones que aún no se aplican, conservando el orden.
 * @param {{ nombre: string }[]} migraciones - Todas las migraciones del proyecto.
 * @param {string[]} aplicadas - Nombres ya registrados en migracion_aplicada.
 * @returns {{ nombre: string }[]} Migraciones pendientes.
 */
function calcularPendientes(migraciones, aplicadas) {
  const registradas = new Set(aplicadas);
  return migraciones.filter((migracion) => !registradas.has(migracion.nombre));
}

/**
 * Objetivo: Indicar si un texto sirve como nombre de base o de usuario de PostgreSQL sin
 *   comillas ni caracteres especiales.
 * @param {string} nombre - Nombre a revisar.
 * @returns {boolean} true si es válido.
 */
function esIdentificadorValido(nombre) {
  return typeof nombre === 'string' && FORMATO_IDENTIFICADOR.test(nombre);
}

/**
 * Objetivo: Crear, si falta, la tabla que anota qué archivos ya se aplicaron.
 * @param {import('pg').Client} cliente - Cliente conectado a la base del proyecto.
 * @returns {Promise<boolean>} true si la tabla ya existía.
 */
async function asegurarTablaControl(cliente) {
  const previa = await cliente.query(
    "SELECT to_regclass('public.migracion_aplicada') IS NOT NULL AS existe",
  );
  await cliente.query(
    `CREATE TABLE IF NOT EXISTS public.migracion_aplicada (
       archivo           VARCHAR(200) PRIMARY KEY,
       fecha_aplicacion  TIMESTAMPTZ  NOT NULL DEFAULT now()
     )`,
  );
  return previa.rows[0].existe;
}

/**
 * Objetivo: Anotar archivos como aplicados. Repetir un nombre no causa error.
 * @param {import('pg').Client} cliente - Cliente conectado a la base del proyecto.
 * @param {string[]} nombres - Nombres carpeta/archivo.sql.
 * @returns {Promise<void>}
 */
async function registrarMigraciones(cliente, nombres) {
  for (const nombre of nombres) {
    await cliente.query(
      'INSERT INTO public.migracion_aplicada (archivo) VALUES ($1) ON CONFLICT DO NOTHING',
      [nombre],
    );
  }
}

/**
 * Objetivo: Leer los nombres de los archivos ya aplicados.
 * @param {import('pg').Client} cliente - Cliente conectado a la base del proyecto.
 * @returns {Promise<string[]>} Nombres registrados.
 */
async function obtenerAplicadas(cliente) {
  const resultado = await cliente.query('SELECT archivo FROM public.migracion_aplicada');
  return resultado.rows.map((fila) => fila.archivo);
}

/**
 * Objetivo: En una base creada antes de que existiera el control, reconocer por su estructura
 *   qué archivos ya tiene aplicados, para no ejecutarlos dos veces.
 * @param {import('pg').Client} cliente - Cliente conectado a la base del proyecto.
 * @returns {Promise<string[]>} Nombres de los archivos que la base ya refleja.
 */
async function detectarAplicadasSinRegistro(cliente) {
  const detectadas = [];
  for (const [nombre, consulta] of Object.entries(MARCADORES_APLICADAS)) {
    const resultado = await cliente.query(consulta);
    if (resultado.rows[0].existe) {
      detectadas.push(nombre);
    }
  }
  return detectadas;
}

/**
 * Objetivo: Ejecutar un archivo de migración y anotarlo como aplicado.
 * @param {import('pg').Client} cliente - Cliente conectado a la base del proyecto.
 * @param {{ nombre: string, ruta: string }} migracion - Archivo a ejecutar.
 * @returns {Promise<void>}
 * Limitaciones: Cada archivo trae su propio BEGIN/COMMIT; si falla se revierte completo, no se
 *   anota y el error se propaga con el nombre del archivo.
 */
async function aplicarMigracion(cliente, migracion) {
  // trimStart() también quita el BOM que algunos editores de Windows agregan al inicio
  const sql = fs.readFileSync(migracion.ruta, 'utf8').trimStart();
  try {
    await cliente.query(sql);
  } catch (err) {
    await cliente.query('ROLLBACK');
    err.message = `Falló ${migracion.nombre}: ${err.message}`;
    throw err;
  }
  await registrarMigraciones(cliente, [migracion.nombre]);
}

/**
 * Objetivo: Crear o actualizar el usuario de PostgreSQL de solo lectura que usa el asistente:
 *   solo puede leer las vistas del esquema chat de esta base.
 * @param {import('pg').Client} cliente - Cliente conectado a la base del proyecto como dueño.
 * @param {Object} opciones - Datos del usuario.
 * @param {{ user: string, password: string }|null} opciones.chatBd - CHAT_PGUSER y
 *   CHAT_PGPASSWORD del .env; null si no se configuraron.
 * @param {string} opciones.baseDatos - Nombre de la base del proyecto.
 * @param {string} opciones.usuarioPropietario - PGUSER; nunca se convierte en solo lectura.
 * @returns {Promise<string>} Mensaje con lo que se hizo, para mostrarlo en la consola.
 * Limitaciones: Los usuarios pertenecen al servidor, no a una base: el mismo usuario sobrevive a
 *   db:reset y puede conectarse a otras bases del servidor, donde no tiene permisos propios.
 */
async function configurarRolLectura(cliente, { chatBd, baseDatos, usuarioPropietario }) {
  if (!chatBd) {
    return 'Usuario de solo lectura: no configurado (faltan CHAT_PGUSER y CHAT_PGPASSWORD en .env)';
  }
  const usuario = chatBd.user;
  if (!esIdentificadorValido(usuario)) {
    throw new Error(`CHAT_PGUSER debe usar minúsculas, números y guion bajo: "${usuario}"`);
  }
  if (!esIdentificadorValido(baseDatos)) {
    throw new Error(`PGDATABASE debe usar minúsculas, números y guion bajo: "${baseDatos}"`);
  }
  if (usuario === usuarioPropietario) {
    throw new Error('CHAT_PGUSER no puede ser el mismo usuario que PGUSER');
  }

  const existente = await cliente.query(
    'SELECT rolsuper, rolcreaterole, rolcreatedb FROM pg_roles WHERE rolname = $1',
    [usuario],
  );
  const rol = existente.rows[0];
  if (rol && (rol.rolsuper || rol.rolcreaterole || rol.rolcreatedb)) {
    throw new Error(`CHAT_PGUSER "${usuario}" ya existe con privilegios de administración`);
  }
  if (!rol) {
    await cliente.query(`CREATE ROLE ${usuario} NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT`);
  }

  // La contraseña no admite parámetros en ALTER ROLE: format() de PostgreSQL la escapa
  const orden = await cliente.query(
    "SELECT format('ALTER ROLE %I LOGIN PASSWORD %L', $1::TEXT, $2::TEXT) AS sql",
    [usuario, chatBd.password],
  );
  await cliente.query(orden.rows[0].sql);
  await cliente.query(`ALTER ROLE ${usuario} CONNECTION LIMIT ${MAX_CONEXIONES_LECTURA}`);

  await cliente.query(`GRANT CONNECT ON DATABASE ${baseDatos} TO ${usuario}`);
  await cliente.query(`GRANT USAGE ON SCHEMA ${ESQUEMA_ASISTENTE} TO ${usuario}`);
  await cliente.query(`GRANT SELECT ON ALL TABLES IN SCHEMA ${ESQUEMA_ASISTENTE} TO ${usuario}`);
  // Segunda barrera: aunque llegara otra orden, la sesión es de solo lectura y con tiempo límite
  await cliente.query(
    `ALTER ROLE ${usuario} IN DATABASE ${baseDatos} SET default_transaction_read_only = on`,
  );
  await cliente.query(
    `ALTER ROLE ${usuario} IN DATABASE ${baseDatos}
     SET statement_timeout = '${ESPERA_MAXIMA_CONSULTA}'`,
  );
  return `Usuario de solo lectura: "${usuario}" ${rol ? 'actualizado' : 'creado'}`;
}

export {
  listarMigraciones,
  calcularPendientes,
  esIdentificadorValido,
  asegurarTablaControl,
  registrarMigraciones,
  obtenerAplicadas,
  detectarAplicadasSinRegistro,
  aplicarMigracion,
  configurarRolLectura,
};
