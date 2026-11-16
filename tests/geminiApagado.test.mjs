/*----
 * Programa: geminiApagado.test.mjs
 * Objetivo: Probar que con CHAT_HABILITADO=false el asistente queda apagado y no se llama a
 *           Google aunque exista la key
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 15 de Noviembre de 2026
 */

import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';

// Se fijan antes de cargar el servicio; la configuración se lee una sola vez
process.env.NODE_ENV = 'test';
process.env.CHAT_HABILITADO = 'false';
process.env.GEMINI_API_KEY = 'key-solo-para-pruebas-automaticas';
const { CODIGOS_ERROR, establecerTransporte, estaDisponible, generarRespuesta } =
  await import('../servicios/geminiServicio.js');
const { default: app } = await import('../app.js');

afterEach(() => establecerTransporte(null));

test('con el interruptor apagado el asistente no está disponible', () => {
  assert.equal(estaDisponible(), false);
});

test('con el interruptor apagado no se llama a Google', async () => {
  let llamadas = 0;
  establecerTransporte(async () => {
    llamadas += 1;
    return {};
  });

  await assert.rejects(
    generarRespuesta({ contenidos: [{ role: 'user', parts: [{ text: 'Hola' }] }] }),
    { codigo: CODIGOS_ERROR.NO_DISPONIBLE },
  );
  assert.equal(llamadas, 0);
});

test('la API carga igual con el asistente apagado', () => {
  assert.equal(typeof app, 'function');
});
