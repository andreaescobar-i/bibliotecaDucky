/*----
 * Programa: auth.test.mjs
 * Objetivo: Probar contra la BD real los escenarios de HUGUS01 (inicio de sesión) y la
 *           revalidación de cuenta y permisos antes de cada operación protegida.
 *           Requiere haber ejecutado npm run db:reset. Uso: npm run test:bd
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import { describe, test, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';

// En modo prueba el límite de intentos se desactiva; la BD sigue siendo la del .env
process.env.NODE_ENV = 'test';
const { default: app } = await import('../../app.js');
const { default: DbPool } = await import('../../config/db.js');
const { requiereSesion, requierePermiso } = await import('../../middlewares/autenticacion.js');
const { manejarErrores } = await import('../../middlewares/manejoErrores.js');

const CONTRASENA_PRUEBA = 'Ducky2026';
const MENSAJE_CREDENCIALES =
  'Credenciales inválidas. Verifique su Usuario y contraseña e intente nuevamente';
const MENSAJE_NO_HABILITADO = 'Acceso no habilitado; solicite la revisión de su cuenta';

// App mínima con una ruta protegida por permiso, para probar los middlewares
const appProtegida = express();
appProtegida.use(cookieParser());
appProtegida.get('/protegida', requiereSesion, requierePermiso('ALTA_LIBROS'), (_req, res) =>
  res.json({ ok: true }),
);
appProtegida.use(manejarErrores);

/**
 * Objetivo: Iniciar sesión y devolver la cookie para usarla en las siguientes peticiones.
 * @param {string} identificador - Matrícula o nómina.
 * @returns {Promise<string>} Encabezado Cookie "sigb_sesion=...".
 */
async function iniciarSesion(identificador) {
  const respuesta = await request(app)
    .post('/api/auth/login')
    .send({ identificador, contrasena: CONTRASENA_PRUEBA });
  assert.equal(respuesta.status, 200, `No se pudo iniciar sesión con ${identificador}`);
  return respuesta.headers['set-cookie'][0].split(';')[0];
}

/**
 * Objetivo: Obtener el último evento de la bitácora de una acción y un identificador.
 * @param {string} accion - Acción registrada.
 * @param {string} clave - Clave del registro objetivo.
 * @returns {Promise<Object|undefined>} Evento más reciente.
 */
async function obtenerUltimoEvento(accion, clave) {
  const resultado = await DbPool.query(
    `SELECT accion, resultado, detalle, ip, fecha_evento
     FROM registro_auditoria
     WHERE accion = $1 AND clave_registro_objetivo = $2
     ORDER BY registro_auditoria_id DESC
     LIMIT 1`,
    [accion, clave],
  );
  return resultado.rows[0];
}

after(() => DbPool.end());

describe('HUGUS01 escenario 1: autenticación exitosa', () => {
  test('crea una sesión httpOnly y devuelve rol y permisos del perfil', async () => {
    const respuesta = await request(app)
      .post('/api/auth/login')
      .send({ identificador: 'N000104', contrasena: CONTRASENA_PRUEBA });

    assert.equal(respuesta.status, 200);
    assert.match(respuesta.headers['set-cookie'][0], /^sigb_sesion=.+; .*HttpOnly/);
    assert.equal(respuesta.body.usuario.nombre, 'Ernesto Díaz');
    assert.equal(respuesta.body.usuario.rol, 'Bibliotecario');
    assert.equal(respuesta.body.usuario.perfil.clave, 'PRF-BIB');
    assert.ok(respuesta.body.usuario.permisos.includes('ALTA_LIBROS'));
    assert.ok(!respuesta.body.usuario.permisos.includes('GESTIONAR_SOLICITUDES'));
    // Ni la contraseña ni su hash bcrypt viajan en la respuesta
    assert.equal(respuesta.body.usuario.contrasena, undefined);
    assert.doesNotMatch(JSON.stringify(respuesta.body), /\$2[aby]\$|hash|Ducky2026/i);
  });

  test('registra identificador, fecha, hora e IP del acceso', async () => {
    await iniciarSesion('N000210');
    const evento = await obtenerUltimoEvento('INICIO_SESION', 'N000210');

    assert.equal(evento.resultado, 'EXITO');
    assert.ok(evento.ip);
    assert.ok(Date.now() - evento.fecha_evento.getTime() < 60_000);
  });

  test('acepta el Tipo de identificador explícito y el identificador en minúsculas', async () => {
    const respuesta = await request(app).post('/api/auth/login').send({
      tipoIdentificador: 'Matrícula',
      identificador: 'a01234567',
      contrasena: 'Ducky2026',
    });

    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.usuario.identificador, 'A01234567');
    assert.deepEqual(respuesta.body.usuario.permisos, [
      'CONSULTAR_LIBROS',
      'CONSULTAR_LISTADO',
      'CONSULTAR_UBICACION',
    ]);
  });

  test('GET /api/auth/sesion devuelve la cuenta de la sesión abierta', async () => {
    const cookie = await iniciarSesion('N000305');
    const respuesta = await request(app).get('/api/auth/sesion').set('Cookie', cookie);

    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.usuario.rol, 'Maestro');
  });
});

describe('HUGUS01 escenario 2: credenciales incorrectas', () => {
  test('contraseña incorrecta: mensaje genérico y registro del intento fallido', async () => {
    const respuesta = await request(app)
      .post('/api/auth/login')
      .send({ identificador: 'A01999000', contrasena: 'incorrecta' });

    assert.equal(respuesta.status, 401);
    assert.equal(respuesta.body.error.mensaje, MENSAJE_CREDENCIALES);
    assert.equal(respuesta.headers['set-cookie'], undefined);

    const evento = await obtenerUltimoEvento('INICIO_SESION_FALLIDO', 'A01999000');
    assert.equal(evento.resultado, 'RECHAZO');
    assert.deepEqual(evento.detalle, { causa: 'CONTRASENA_INCORRECTA' });
  });

  test('identificador sin cuenta: el mismo mensaje, sin revelar que no existe', async () => {
    const respuesta = await request(app)
      .post('/api/auth/login')
      .send({ identificador: 'A01777111', contrasena: CONTRASENA_PRUEBA });

    assert.equal(respuesta.status, 401);
    assert.equal(respuesta.body.error.mensaje, MENSAJE_CREDENCIALES);
    const evento = await obtenerUltimoEvento('INICIO_SESION_FALLIDO', 'A01777111');
    assert.deepEqual(evento.detalle, { causa: 'CUENTA_NO_REGISTRADA' });
  });

  test('una cuenta inactiva con contraseña incorrecta no revela su estado', async () => {
    const respuesta = await request(app)
      .post('/api/auth/login')
      .send({ identificador: 'A01678234', contrasena: 'incorrecta' });

    assert.equal(respuesta.status, 401);
    assert.equal(respuesta.body.error.mensaje, MENSAJE_CREDENCIALES);
  });
});

describe('HUGUS01 escenario 3: cuenta, vigencia o perfil no activos', () => {
  const CASOS = [
    ['A01678234', 'cuenta inactiva', 'CUENTA_INACTIVA', 'Administrador de biblioteca'],
    ['A01333444', 'perfil inactivo', 'PERFIL_INACTIVO', 'Administrador de biblioteca'],
    ['A01444222', 'alumno no vigente en CIAA', 'ALUMNO_NO_VIGENTE', 'Servicios Escolares'],
  ];
  for (const [identificador, descripcion, causa, area] of CASOS) {
    test(`${descripcion}: no crea sesión e indica acudir a ${area}`, async () => {
      const respuesta = await request(app)
        .post('/api/auth/login')
        .send({ identificador, contrasena: CONTRASENA_PRUEBA });

      assert.equal(respuesta.status, 403);
      assert.equal(respuesta.body.error.mensaje, MENSAJE_NO_HABILITADO);
      assert.equal(respuesta.body.error.detalle.area, area);
      assert.equal(respuesta.headers['set-cookie'], undefined);

      const evento = await obtenerUltimoEvento('ACCESO_NO_HABILITADO', identificador);
      assert.deepEqual(evento.detalle, { causa });
    });
  }
});

describe('Revalidación antes de cada operación protegida', () => {
  test('un cambio de perfil se aplica en la siguiente operación, con la sesión abierta', async () => {
    const cookie = await iniciarSesion('N000104');
    await request(appProtegida).get('/protegida').set('Cookie', cookie).expect(200);

    try {
      await DbPool.query(
        `UPDATE usuario SET perfil_id = (SELECT perfil_id FROM perfil WHERE clave = 'PRF-BIB-CON')
         WHERE identificador = 'N000104'`,
      );
      const respuesta = await request(appProtegida).get('/protegida').set('Cookie', cookie);

      assert.equal(respuesta.status, 403);
      assert.equal(respuesta.body.error.mensaje, 'No tiene permiso para esta operación');
      const evento = await obtenerUltimoEvento('ACCESO_DENEGADO', 'ALTA_LIBROS');
      assert.equal(evento.resultado, 'RECHAZO');
    } finally {
      await DbPool.query(
        `UPDATE usuario SET perfil_id = (SELECT perfil_id FROM perfil WHERE clave = 'PRF-BIB')
         WHERE identificador = 'N000104'`,
      );
    }
  });

  test('una cuenta dada de baja pierde el acceso de inmediato', async () => {
    const cookie = await iniciarSesion('A01999000');

    try {
      await DbPool.query(
        `UPDATE usuario
         SET estado_cuenta = 'INACTIVO', fecha_baja = NOW(), motivo_baja = 'Prueba automática'
         WHERE identificador = 'A01999000'`,
      );
      const respuesta = await request(app).get('/api/auth/sesion').set('Cookie', cookie);

      assert.equal(respuesta.status, 401);
      assert.equal(respuesta.body.error.mensaje, MENSAJE_NO_HABILITADO);
      assert.match(respuesta.headers['set-cookie'][0], /^sigb_sesion=;/);
    } finally {
      await DbPool.query(
        `UPDATE usuario SET estado_cuenta = 'ACTIVO', fecha_baja = NULL, motivo_baja = NULL
         WHERE identificador = 'A01999000'`,
      );
    }
  });

  test('al incrementar la versión de sesión, las sesiones anteriores dejan de valer', async () => {
    const cookie = await iniciarSesion('N000402');
    await DbPool.query(
      `UPDATE usuario SET version_sesion = version_sesion + 1 WHERE identificador = 'N000402'`,
    );

    const respuesta = await request(app).get('/api/auth/sesion').set('Cookie', cookie);

    assert.equal(respuesta.status, 401);
    assert.equal(
      respuesta.body.error.mensaje,
      'Su sesión ya no es válida; inicie sesión nuevamente',
    );
  });
});

describe('Cambio de contraseña (contraseña temporal de HUGUS02)', () => {
  test('valida la contraseña actual y el formato de la nueva', async () => {
    const cookie = await iniciarSesion('N000402');
    const corta = await request(app)
      .put('/api/auth/contrasena')
      .set('Cookie', cookie)
      .send({ contrasenaActual: CONTRASENA_PRUEBA, contrasenaNueva: 'corta' });
    const incorrecta = await request(app)
      .put('/api/auth/contrasena')
      .set('Cookie', cookie)
      .send({ contrasenaActual: 'otra', contrasenaNueva: 'NuevaClave2026' });

    assert.equal(corta.status, 400);
    assert.deepEqual(corta.body.error.detalle.campos, ['Nueva contraseña']);
    assert.equal(incorrecta.status, 400);
    assert.equal(incorrecta.body.error.mensaje, 'La contraseña actual no es correcta');
  });

  test('guarda la nueva, renueva esta sesión e invalida las demás', async () => {
    const otraSesion = await iniciarSesion('N000402');
    const cookie = await iniciarSesion('N000402');
    try {
      const respuesta = await request(app)
        .put('/api/auth/contrasena')
        .set('Cookie', cookie)
        .send({ contrasenaActual: CONTRASENA_PRUEBA, contrasenaNueva: 'NuevaClave2026' });
      assert.equal(respuesta.status, 200);
      assert.equal(respuesta.body.mensaje, 'Contraseña actualizada');
      assert.equal(respuesta.body.usuario.debeCambiarContrasena, false);

      const cookieNueva = respuesta.headers['set-cookie'][0].split(';')[0];
      assert.equal(
        (await request(app).get('/api/auth/sesion').set('Cookie', cookieNueva)).status,
        200,
      );
      assert.equal(
        (await request(app).get('/api/auth/sesion').set('Cookie', otraSesion)).status,
        401,
      );
      const acceso = await request(app)
        .post('/api/auth/login')
        .send({ identificador: 'N000402', contrasena: 'NuevaClave2026' });
      assert.equal(acceso.status, 200);
    } finally {
      await DbPool.query(
        `UPDATE usuario SET "contraseña_hash" = crypt($1, gen_salt('bf', 10))
         WHERE identificador = 'N000402'`,
        [CONTRASENA_PRUEBA],
      );
    }
  });
});

describe('Cierre de sesión', () => {
  test('borra la cookie y registra el cierre en la bitácora', async () => {
    const cookie = await iniciarSesion('N000001');
    const respuesta = await request(app).post('/api/auth/logout').set('Cookie', cookie);

    assert.equal(respuesta.status, 204);
    assert.match(respuesta.headers['set-cookie'][0], /^sigb_sesion=;/);
    const resultado = await DbPool.query(
      `SELECT COUNT(*)::INT AS total FROM registro_auditoria
       WHERE accion = 'CIERRE_SESION' AND fecha_evento > NOW() - INTERVAL '1 minute'`,
    );
    assert.ok(resultado.rows[0].total >= 1);
  });
});
