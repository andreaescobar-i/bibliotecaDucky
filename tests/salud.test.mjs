/*----
 * Programa: salud.test.mjs
 * Objetivo: Probar el esqueleto de la API: ruta de salud, rutas inexistentes y JSON inválido
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import { test, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

// Se fija antes de cargar la app para que la configuración no exija el .env completo
process.env.NODE_ENV = 'test';
const { default: app } = await import('../app.js');
const { default: DbPool } = await import('../config/db.js');

// La BD se simula reemplazando DbPool.query, así la prueba no depende de PostgreSQL
afterEach(() => mock.restoreAll());

test('GET /api/salud responde 200 cuando la base de datos contesta', async () => {
  mock.method(DbPool, 'query', async () => ({
    rows: [
      {
        fecha: new Date('2026-10-27T12:00:00Z'),
        version: 'PostgreSQL 18.0, compiled by Visual C++',
      },
    ],
  }));

  const respuesta = await request(app).get('/api/salud');

  assert.equal(respuesta.status, 200);
  assert.equal(respuesta.body.estado, 'ok');
  assert.equal(respuesta.body.baseDatos, 'conectada');
  assert.equal(respuesta.body.versionBd, 'PostgreSQL 18.0');
});

test('GET /api/salud responde 503 cuando no hay conexión con la base de datos', async () => {
  mock.method(DbPool, 'query', async () => {
    throw new Error('ECONNREFUSED');
  });

  const respuesta = await request(app).get('/api/salud');

  assert.equal(respuesta.status, 503);
  assert.equal(respuesta.body.estado, 'degradado');
  assert.equal(respuesta.body.baseDatos, 'sin conexión');
});

test('GET /api presenta la API y sus rutas disponibles', async () => {
  const respuesta = await request(app).get('/api');

  assert.equal(respuesta.status, 200);
  assert.equal(respuesta.body.nombre, 'API SIGB · Biblioteca Ducky');
  assert.ok(respuesta.body.rutas.some((ruta) => ruta.ruta === '/api/salud'));
});

test('una ruta inexistente responde 404 con formato uniforme', async () => {
  const respuesta = await request(app).get('/api/no-existe');

  assert.equal(respuesta.status, 404);
  assert.equal(respuesta.body.error.mensaje, 'Ruta no encontrada: GET /api/no-existe');
});

test('un cuerpo JSON mal formado responde 400', async () => {
  const respuesta = await request(app)
    .post('/api/salud')
    .set('Content-Type', 'application/json')
    .send('{"usuario": ');

  assert.equal(respuesta.status, 400);
  assert.equal(respuesta.body.error.mensaje, 'El cuerpo de la petición no es un JSON válido');
});
