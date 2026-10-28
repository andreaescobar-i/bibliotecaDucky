/*----
 * Programa: autenticacion.test.mjs
 * Objetivo: Probar sin base de datos las reglas de HUGUS01: formato de identificadores, causas de
 *           acceso no habilitado, campos obligatorios, token de sesión y límite de intentos
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import request from 'supertest';

// Se fija antes de cargar la app para que la configuración no exija el .env completo
process.env.NODE_ENV = 'test';
const { default: app } = await import('../app.js');
const { normalizarIdentificador, normalizarTipo, inferirTipo, esFormatoValido } =
  await import('../utilidades/identificadores.js');
const { evaluarAcceso } = await import('../utilidades/reglasAcceso.js');
const { crearTokenSesion, verificarTokenSesion } = await import('../utilidades/sesion.js');
const { crearLimitadorLogin, MENSAJE_DEMASIADOS_INTENTOS } =
  await import('../middlewares/limiteIntentos.js');
const { manejarErrores } = await import('../middlewares/manejoErrores.js');

const USUARIO_VALIDO = {
  tipo_identificador: 'MATRICULA',
  estado_cuenta: 'ACTIVO',
  perfil_activo: true,
  rol_activo: true,
};

describe('Identificadores institucionales', () => {
  test('se tratan como texto: conservan ceros iniciales y se limpian espacios', () => {
    assert.equal(normalizarIdentificador('  a01234567 '), 'A01234567');
    assert.equal(normalizarIdentificador(1234567), '');
  });

  test('el tipo se acepta con o sin acento y se rechaza si no existe', () => {
    assert.equal(normalizarTipo('Matrícula'), 'MATRICULA');
    assert.equal(normalizarTipo('nómina'), 'NOMINA');
    assert.equal(normalizarTipo(undefined), '');
    assert.equal(normalizarTipo('Pasaporte'), null);
  });

  test('el tipo se deduce del formato cuando el front no lo envía', () => {
    assert.equal(inferirTipo('A01234567'), 'MATRICULA');
    assert.equal(inferirTipo('N000104'), 'NOMINA');
    assert.equal(inferirTipo('B000104'), null);
  });

  test('el formato debe corresponder al tipo elegido', () => {
    assert.equal(esFormatoValido('MATRICULA', 'A01234567'), true);
    assert.equal(esFormatoValido('NOMINA', 'A01234567'), false);
  });
});

describe('Reglas de acceso (HUGUS01 escenario 3)', () => {
  test('una cuenta activa, con perfil activo y vigente puede acceder', () => {
    assert.equal(evaluarAcceso(USUARIO_VALIDO, true), null);
  });

  test('cuenta o perfil inactivos se remiten al Administrador de biblioteca', () => {
    assert.deepEqual(evaluarAcceso({ ...USUARIO_VALIDO, estado_cuenta: 'INACTIVO' }, true), {
      causa: 'CUENTA_INACTIVA',
      area: 'Administrador de biblioteca',
    });
    assert.deepEqual(evaluarAcceso({ ...USUARIO_VALIDO, perfil_activo: false }, true), {
      causa: 'PERFIL_INACTIVO',
      area: 'Administrador de biblioteca',
    });
  });

  test('un alumno no vigente se remite a Servicios Escolares y el personal a Capital Humano', () => {
    assert.equal(evaluarAcceso(USUARIO_VALIDO, false).area, 'Servicios Escolares');
    assert.equal(
      evaluarAcceso({ ...USUARIO_VALIDO, tipo_identificador: 'NOMINA' }, false).area,
      'Capital Humano',
    );
  });
});

describe('POST /api/auth/login con campos vacíos o formato inválido (escenario 4)', () => {
  test('señala por nombre los campos vacíos sin consultar la BD', async () => {
    const respuesta = await request(app)
      .post('/api/auth/login')
      .send({ identificador: '  ', contrasena: '' });

    assert.equal(respuesta.status, 400);
    assert.equal(respuesta.body.error.mensaje, 'Complete los campos obligatorios señalados');
    assert.deepEqual(respuesta.body.error.detalle.campos, ['Identificador', 'Contraseña']);
  });

  test('rechaza un Tipo de identificador que no existe', async () => {
    const respuesta = await request(app)
      .post('/api/auth/login')
      .send({ tipoIdentificador: 'Pasaporte', identificador: 'A01234567', contrasena: 'x' });

    assert.equal(respuesta.status, 400);
    assert.deepEqual(respuesta.body.error.detalle.campos, ['Tipo de identificador']);
  });

  test('rechaza un identificador que no cumple el formato de CIAA o Capital Humano', async () => {
    const respuesta = await request(app)
      .post('/api/auth/login')
      .send({ tipoIdentificador: 'NOMINA', identificador: 'A01234567', contrasena: 'x' });

    assert.equal(respuesta.status, 400);
    assert.equal(respuesta.body.error.mensaje, 'Revise el formato del identificador institucional');
  });
});

describe('Sesión', () => {
  test('el token guarda solo el id y la versión de sesión, nunca la contraseña', () => {
    const token = crearTokenSesion({ usuario_id: '7', version_sesion: 3 });
    const contenido = verificarTokenSesion(token);

    assert.equal(contenido.sub, '7');
    assert.equal(contenido.ver, 3);
    assert.deepEqual(Object.keys(contenido).sort(), ['exp', 'iat', 'sub', 'ver']);
  });

  test('un token alterado no es válido', () => {
    const token = crearTokenSesion({ usuario_id: '7', version_sesion: 0 });
    assert.equal(verificarTokenSesion(token.slice(0, -2) + 'xx'), null);
  });

  test('GET /api/auth/sesion sin cookie pide iniciar sesión', async () => {
    const respuesta = await request(app).get('/api/auth/sesion');

    assert.equal(respuesta.status, 401);
    assert.equal(respuesta.body.error.mensaje, 'Inicie sesión para continuar');
  });

  test('GET /api/auth/sesion con una cookie falsificada se rechaza y borra la cookie', async () => {
    const respuesta = await request(app)
      .get('/api/auth/sesion')
      .set('Cookie', 'sigb_sesion=token.falso.firmado');

    assert.equal(respuesta.status, 401);
    assert.match(respuesta.headers['set-cookie'][0], /^sigb_sesion=;/);
  });

  test('POST /api/auth/logout responde 204 aunque no haya sesión', async () => {
    const respuesta = await request(app).post('/api/auth/logout');
    assert.equal(respuesta.status, 204);
  });
});

describe('Límite de intentos de inicio de sesión', () => {
  /**
   * Objetivo: App mínima cuyo login acepta solo la contraseña "correcta".
   * @returns {import('express').Express} App con el limitador configurado a 2 intentos.
   */
  function crearAppLimitada() {
    const appPrueba = express();
    appPrueba.use(express.json());
    appPrueba.post('/login', crearLimitadorLogin({ limite: 2, ventanaMinutos: 1 }), (req, res) =>
      res.status(req.body.contrasena === 'correcta' ? 200 : 401).end(),
    );
    appPrueba.use(manejarErrores);
    return appPrueba;
  }

  test('después de los intentos fallidos permitidos responde 429 con un mensaje claro', async () => {
    const appPrueba = crearAppLimitada();
    const intento = { identificador: 'A01999000', contrasena: 'mala' };

    await request(appPrueba).post('/login').send(intento).expect(401);
    await request(appPrueba).post('/login').send(intento).expect(401);
    const respuesta = await request(appPrueba).post('/login').send(intento);

    assert.equal(respuesta.status, 429);
    assert.equal(respuesta.body.error.mensaje, MENSAJE_DEMASIADOS_INTENTOS);
  });

  test('los accesos correctos no cuentan y cada identificador tiene su propio contador', async () => {
    const appPrueba = crearAppLimitada();

    for (let i = 0; i < 3; i++) {
      await request(appPrueba)
        .post('/login')
        .send({ identificador: 'N000001', contrasena: 'correcta' })
        .expect(200);
    }
    await request(appPrueba).post('/login').send({ identificador: 'A01999000' }).expect(401);
    await request(appPrueba).post('/login').send({ identificador: 'A01999000' }).expect(401);
    // Otro alumno desde la misma IP no queda bloqueado por los fallos del primero
    await request(appPrueba).post('/login').send({ identificador: 'A01234567' }).expect(401);
  });
});
