/*----
 * Programa: catalogo.test.mjs
 * Objetivo: Probar sin base de datos las reglas del catálogo (HULIB01-03): claves, ISBN,
 *           autores, ubicación y motivos de baja
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

process.env.NODE_ENV = 'test';
const { default: app } = await import('../app.js');
const {
  normalizarClave,
  esClaveValida,
  normalizarIsbn,
  esIsbnValido,
  separarAutores,
  unirAutores,
  leerUbicacion,
  formatearUbicacion,
  normalizarMotivoBaja,
} = await import('../utilidades/reglasCatalogo.js');

describe('Reglas del catálogo', () => {
  test('las claves se limpian y deben tener un formato válido', () => {
    assert.equal(normalizarClave('  lit-863.64-gar '), 'LIT-863.64-GAR');
    assert.equal(esClaveValida('LIT-863.64-GAR'), true);
    assert.equal(esClaveValida('LIT 863'), false);
    assert.equal(esClaveValida('X'), false);
  });

  test('el ISBN se acepta con guiones y "No registrado" equivale a vacío', () => {
    assert.equal(normalizarIsbn('978-0-13-468599-1'), '9780134685991');
    assert.equal(normalizarIsbn('No registrado'), '');
    assert.equal(esIsbnValido('030640615X'), true);
    assert.equal(esIsbnValido('12345'), false);
  });

  test('varios autores se separan con punto y coma y conservan su orden', () => {
    assert.deepEqual(separarAutores('Thomas H. Cormen;  Charles E. Leiserson '), [
      { primerNombre: 'Thomas', primerApellido: 'H. Cormen' },
      { primerNombre: 'Charles', primerApellido: 'E. Leiserson' },
    ]);
    assert.deepEqual(separarAutores('Homero'), [{ primerNombre: 'Homero', primerApellido: null }]);
    assert.equal(unirAutores(['Juan Rulfo', 'Octavio Paz']), 'Juan Rulfo; Octavio Paz');
  });

  test('la ubicación del front se separa en Librero y Fila', () => {
    assert.deepEqual(leerUbicacion({ ubicacion: 'Estante LIT · A1' }), {
      librero: 'LIT',
      fila: 'A1',
    });
    assert.deepEqual(leerUbicacion({ ubicacion: 'com-b2' }), { librero: 'COM', fila: 'B2' });
    assert.deepEqual(leerUbicacion({ librero: 'his', fila: 'c1' }), { librero: 'HIS', fila: 'C1' });
    assert.deepEqual(leerUbicacion({ ubicacion: 'sin formato' }), { librero: '', fila: '' });
  });

  test('una ubicación incompleta no se inventa', () => {
    assert.equal(formatearUbicacion('LIT', 'A1'), 'Estante LIT · A1');
    assert.equal(formatearUbicacion('LIT', null), null);
  });

  test('los motivos de baja se aceptan como los muestra el front', () => {
    assert.equal(normalizarMotivoBaja('Dañado'), 'DANADO');
    assert.equal(normalizarMotivoBaja('perdido'), 'PERDIDO');
    assert.equal(normalizarMotivoBaja('Robado'), 'ROBADO');
    assert.equal(normalizarMotivoBaja('Quemado'), null);
  });
});

describe('Rutas del catálogo sin sesión', () => {
  for (const [metodo, ruta] of [
    ['post', '/api/libros'],
    ['get', '/api/libros/LIT-863-RUL'],
    ['put', '/api/ejemplares/LIT-863-RUL-E01'],
    ['post', '/api/ejemplares/LIT-863-RUL-E01/baja'],
    ['get', '/api/catalogos'],
  ]) {
    test(`${metodo.toUpperCase()} ${ruta} pide iniciar sesión`, async () => {
      const respuesta = await request(app)[metodo](ruta);
      assert.equal(respuesta.status, 401);
    });
  }
});
