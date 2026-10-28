/*----
 * Programa: cuentas.test.mjs
 * Objetivo: Probar sin base de datos las reglas de cuentas y perfiles (HUGUS02-04, HUPRF01)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

process.env.NODE_ENV = 'test';
const { default: app } = await import('../app.js');
const {
  PERMISOS_GESTION,
  esPerfilGestor,
  esRolCompatible,
  esCorreoInstitucional,
  esTelefonoValido,
  separarNombre,
  generarContrasenaTemporal,
} = await import('../utilidades/reglasCuentas.js');
const { crearPatronContiene } = await import('../utilidades/validacion.js');

describe('Reglas de cuentas', () => {
  test('separa el nombre completo: las dos últimas palabras son los apellidos', () => {
    assert.deepEqual(separarNombre('Ana María Torres Ruiz'), {
      primerNombre: 'Ana María',
      primerApellido: 'Torres',
      segundoApellido: 'Ruiz',
    });
    assert.deepEqual(separarNombre('Mariana López'), {
      primerNombre: 'Mariana',
      primerApellido: 'López',
      segundoApellido: null,
    });
    assert.equal(separarNombre('Mariana'), null);
    assert.equal(separarNombre(''), null);
  });

  test('solo un Administrador con todos los permisos de gestión cuenta como gestor', () => {
    assert.equal(esPerfilGestor('Administrador', [...PERMISOS_GESTION, 'ALTA_LIBROS'], true), true);
    assert.equal(esPerfilGestor('Administrador', PERMISOS_GESTION.slice(1), true), false);
    assert.equal(esPerfilGestor('Bibliotecario', PERMISOS_GESTION, true), false);
    assert.equal(esPerfilGestor('Administrador', PERMISOS_GESTION, false), false);
  });

  test('las matrículas usan perfiles Alumno y las nóminas los demás roles', () => {
    assert.equal(esRolCompatible('MATRICULA', 'Alumno'), true);
    assert.equal(esRolCompatible('MATRICULA', 'Colaborador'), false);
    assert.equal(esRolCompatible('NOMINA', 'Maestro'), true);
    assert.equal(esRolCompatible('NOMINA', 'Alumno'), false);
  });

  test('el correo debe tener formato válido y dominio institucional', () => {
    assert.equal(esCorreoInstitucional('ana.torres@ducky.edu.mx'), true);
    assert.equal(esCorreoInstitucional('ana@gmail.com'), false);
    assert.equal(esCorreoInstitucional('ana torres@ducky.edu.mx'), false);
  });

  test('el teléfono debe tener exactamente 10 dígitos', () => {
    assert.equal(esTelefonoValido('8112345678'), true);
    assert.equal(esTelefonoValido('81-1234-5678'), false);
    assert.equal(esTelefonoValido('811234567'), false);
  });

  test('cada contraseña temporal es distinta y tiene 12 caracteres', () => {
    const primera = generarContrasenaTemporal();
    assert.equal(primera.length, 12);
    assert.notEqual(primera, generarContrasenaTemporal());
  });

  test('los comodines de LIKE capturados se buscan como texto', () => {
    assert.equal(crearPatronContiene('50%_a'), '%50\\%\\_a%');
  });
});

describe('Rutas de cuentas y perfiles sin sesión', () => {
  for (const [metodo, ruta] of [
    ['get', '/api/usuarios'],
    ['post', '/api/usuarios'],
    ['put', '/api/usuarios/A01234567'],
    ['post', '/api/usuarios/A01234567/baja'],
    ['get', '/api/perfiles'],
    ['get', '/api/roles'],
  ]) {
    test(`${metodo.toUpperCase()} ${ruta} pide iniciar sesión`, async () => {
      const respuesta = await request(app)[metodo](ruta);
      assert.equal(respuesta.status, 401);
      assert.equal(respuesta.body.error.mensaje, 'Inicie sesión para continuar');
    });
  }
});
