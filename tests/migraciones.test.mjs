/*----
 * Programa: migraciones.test.mjs
 * Objetivo: Probar sin base de datos las reglas de npm run db:migrar: qué migraciones faltan,
 *           en qué orden se aplican y las validaciones del usuario de solo lectura del asistente
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 15 de Noviembre de 2026
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  listarMigraciones,
  calcularPendientes,
  esIdentificadorValido,
  configurarRolLectura,
} from '../db/utilidadesMigracion.js';

const CHAT_BD = { user: 'sigb_chat_lectura', password: "clave'con comilla" };
const OPCIONES = { chatBd: CHAT_BD, baseDatos: 'sigb_ducky', usuarioPropietario: 'postgres' };

/**
 * Objetivo: Simular un cliente de PostgreSQL que anota las órdenes recibidas.
 * @param {Object|null} rolExistente - Fila de pg_roles del usuario, o null si no existe.
 * @returns {{ ordenes: string[], query: Function }} Cliente simulado.
 */
function crearClienteSimulado(rolExistente = null) {
  const ordenes = [];
  return {
    ordenes,
    async query(sql) {
      ordenes.push(sql);
      if (sql.includes('FROM pg_roles')) {
        return { rows: rolExistente ? [rolExistente] : [] };
      }
      if (sql.includes('format(')) {
        return { rows: [{ sql: 'ALTER ROLE sigb_chat_lectura LOGIN PASSWORD <escapada>' }] };
      }
      return { rows: [] };
    },
  };
}

test('las migraciones se listan en orden: primero el esquema y luego por número', () => {
  const nombres = listarMigraciones().map((migracion) => migracion.nombre);

  assert.deepEqual(nombres.slice(0, 4), [
    'esquema/000_biblioteca_schema.sql',
    'migraciones/001_sprint1.sql',
    'migraciones/002_sesiones.sql',
    'migraciones/003_chatbot.sql',
  ]);
  assert.equal(new Set(nombres).size, nombres.length);
  assert.ok(nombres.every((nombre) => !nombre.startsWith('semillas/')));
});

test('solo quedan pendientes las migraciones que no están registradas', () => {
  const migraciones = [{ nombre: 'a/1.sql' }, { nombre: 'a/2.sql' }, { nombre: 'a/3.sql' }];

  assert.deepEqual(calcularPendientes(migraciones, ['a/1.sql', 'a/3.sql']), [
    { nombre: 'a/2.sql' },
  ]);
  assert.deepEqual(calcularPendientes(migraciones, []), migraciones);
  assert.deepEqual(calcularPendientes(migraciones, ['a/1.sql', 'a/2.sql', 'a/3.sql']), []);
});

test('los nombres de base y de usuario solo admiten minúsculas, números y guion bajo', () => {
  assert.ok(esIdentificadorValido('sigb_chat_lectura'));
  assert.ok(!esIdentificadorValido('Sigb'));
  assert.ok(!esIdentificadorValido('lectura; DROP TABLE usuario'));
  assert.ok(!esIdentificadorValido('1usuario'));
  assert.ok(!esIdentificadorValido(''));
  assert.ok(!esIdentificadorValido(undefined));
});

test('sin CHAT_PGUSER y CHAT_PGPASSWORD no se crea ningún usuario', async () => {
  const cliente = crearClienteSimulado();

  const mensaje = await configurarRolLectura(cliente, { ...OPCIONES, chatBd: null });

  assert.match(mensaje, /no configurado/);
  assert.equal(cliente.ordenes.length, 0);
});

test('crea el usuario solo con permiso de lectura sobre el esquema chat', async () => {
  const cliente = crearClienteSimulado();

  const mensaje = await configurarRolLectura(cliente, OPCIONES);

  assert.match(mensaje, /creado/);
  const ordenes = cliente.ordenes.join('\n');
  assert.match(ordenes, /CREATE ROLE sigb_chat_lectura NOSUPERUSER NOCREATEDB NOCREATEROLE/);
  assert.match(ordenes, /GRANT SELECT ON ALL TABLES IN SCHEMA chat TO sigb_chat_lectura/);
  assert.match(ordenes, /default_transaction_read_only = on/);
  assert.doesNotMatch(ordenes, /GRANT (ALL|INSERT|UPDATE|DELETE)/);
  assert.doesNotMatch(ordenes, /SCHEMA public TO/);
  // La contraseña viaja como parámetro; nunca se concatena en el SQL
  assert.ok(!ordenes.includes(CHAT_BD.password));
});

test('un usuario que ya existe se actualiza sin volver a crearlo', async () => {
  const cliente = crearClienteSimulado({
    rolsuper: false,
    rolcreaterole: false,
    rolcreatedb: false,
  });

  const mensaje = await configurarRolLectura(cliente, OPCIONES);

  assert.match(mensaje, /actualizado/);
  assert.ok(!cliente.ordenes.some((orden) => orden.startsWith('CREATE ROLE')));
});

test('rechaza convertir en solo lectura al usuario dueño de la base', async () => {
  const cliente = crearClienteSimulado();

  await assert.rejects(
    configurarRolLectura(cliente, { ...OPCIONES, chatBd: { user: 'postgres', password: 'x' } }),
    /no puede ser el mismo usuario que PGUSER/,
  );
  assert.equal(cliente.ordenes.length, 0);
});

test('rechaza un usuario existente con privilegios de administración', async () => {
  const cliente = crearClienteSimulado({ rolsuper: true, rolcreaterole: true, rolcreatedb: true });

  await assert.rejects(configurarRolLectura(cliente, OPCIONES), /privilegios de administración/);
  assert.ok(!cliente.ordenes.some((orden) => orden.includes('ALTER ROLE')));
});

test('rechaza nombres de usuario o de base con caracteres no permitidos', async () => {
  const cliente = crearClienteSimulado();

  await assert.rejects(
    configurarRolLectura(cliente, { ...OPCIONES, chatBd: { user: 'x; DROP', password: 'x' } }),
    /CHAT_PGUSER debe usar/,
  );
  await assert.rejects(
    configurarRolLectura(cliente, { ...OPCIONES, baseDatos: 'Mi Base' }),
    /PGDATABASE debe usar/,
  );
  assert.equal(cliente.ordenes.length, 0);
});
