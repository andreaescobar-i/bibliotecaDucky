import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import request from 'supertest';
import { randomUUID } from 'node:crypto';

process.env.NODE_ENV = 'test';
const { app, DbPool, iniciarSesion } = await import('./ayudantes.mjs');
const base = '/api/gestion-biblioteca';
const fecha = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Monterrey' });

after(() => DbPool.end());

test('aplica suspensiones, conserva el corte y controla los permisos de reportes', async () => {
  const administrador = await iniciarSesion('N000001');
  const bibliotecario = await iniciarSesion('N000104');
  const alumno = await iniciarSesion('A01999000');
  let idCorte;
  const matricula = 'A01999000';
  const motivo = 'Prueba de gestión ' + randomUUID();
  try {
    assert.equal((await alumno.get(base + '/suspendidos')).status, 403);
    assert.equal((await bibliotecario.get(base + '/inventario?periodo=2026-10')).status, 403);
    const reporte = await administrador.get(base + '/inventario?periodo=2026-10');
    assert.equal(reporte.status, 200, JSON.stringify(reporte.body));
    assert.ok(reporte.body.existencia > 0);
    assert.ok(reporte.body.ejemplares.length >= reporte.body.existencia);
    const limitado = await administrador.get(base + '/inventario?periodo=2026-10&estante=LIT');
    assert.equal(limitado.status, 200, JSON.stringify(limitado.body));
    assert.ok(
      limitado.body.ejemplares.length > 0 &&
        limitado.body.ejemplares.every((e) => e.librero === 'LIT'),
    );

    const suspension = await bibliotecario.post(base + '/suspendidos', {
      identificador: matricula,
      motivo,
      levantar: false,
    });
    assert.equal(suspension.status, 204, JSON.stringify(suspension.body));
    const prestamos = await bibliotecario.post('/api/circulacion/prestamos', {
      identificador: matricula,
      ejemplar: 'COM-005.1-COR-E03',
    });
    assert.equal(prestamos.status, 409, JSON.stringify(prestamos.body));
    assert.match(prestamos.body.error.mensaje, /suspensión/);

    const corte = await bibliotecario.post(base + '/cortes', { periodo: 'Pruebas de exámenes' });
    idCorte = corte.body.reporte_deudores_id;
    assert.equal(corte.status, 201, JSON.stringify(corte.body));
    assert.ok(corte.body.detalle.some((r) => r.identificador === matricula && r.suspendido));
    const levantar = await bibliotecario.post(base + '/suspendidos', {
      identificador: matricula,
      levantar: true,
    });
    assert.equal(levantar.status, 204, JSON.stringify(levantar.body));
    const aviso = await bibliotecario.post(base + '/cortes/' + idCorte + '/aviso');
    assert.equal(aviso.status, 200, JSON.stringify(aviso.body));
    assert.equal(aviso.body.modo_envio, 'SIMULADO');
    assert.ok(aviso.body.detalle.some((r) => r.identificador === matricula && r.suspendido));
  } finally {
    if (idCorte) {
      await DbPool.query('DELETE FROM reporte_deudores WHERE reporte_deudores_id=$1', [idCorte]);
    }
    await DbPool.query('DELETE FROM suspension WHERE motivo=$1', [motivo]);
  }
});

test('un extravío da de baja el ejemplar, genera reposición y acepta un comprobante único', async () => {
  const operador = await iniciarSesion('N000104');
  const lector = await iniciarSesion('N000402');
  let folio;
  const clave = 'COM-005.1-COR-E03';
  try {
    const alta = await operador.post('/api/circulacion/prestamos', {
      identificador: 'N000402',
      ejemplar: clave,
    });
    folio = alta.body.folio;
    assert.equal(alta.status, 201, JSON.stringify(alta.body));
    const perdida = await operador.post(base + '/perdidas', {
      folio,
      cambio: '18.50',
      fecha,
      fuente: 'Tipo de cambio de prueba',
    });
    assert.equal(perdida.status, 201, JSON.stringify(perdida.body));
    assert.equal(perdida.body.avisosPendientes, false);
    const id = perdida.body.adeudo_id;
    const lista = await operador.get(base + '/adeudos?busqueda=' + folio);
    assert.equal(lista.status, 200, JSON.stringify(lista.body));
    assert.equal(lista.body[0].modo_envio_tesoreria, 'SIMULADO');
    assert.equal(lista.body[0].modo_envio_escolares, 'SIMULADO');
    const p = await operador.get('/api/circulacion/prestamos/' + folio);
    assert.equal(p.body.estado, 'PERDIDO');
    const copia = await operador.get('/api/ejemplares/' + clave);
    assert.equal(copia.body.ejemplar.estado, 'Dado de baja');
    const pago = { folio: 'P-' + randomUUID(), monto: perdida.body.monto_mxn, fecha };
    assert.equal((await lector.post(base + '/adeudos/' + id + '/pago', pago)).status, 403);
    assert.equal(
      (await operador.post(base + '/adeudos/' + id + '/pago', { ...pago, monto: '0.01' })).status,
      400,
    );
    const liquidacion = await operador.post(base + '/adeudos/' + id + '/pago', pago);
    assert.equal(liquidacion.status, 201, JSON.stringify(liquidacion.body));
    assert.equal(liquidacion.body.estado, 'PAGADO');
    assert.equal((await operador.post(base + '/adeudos/' + id + '/pago', pago)).status, 409);
    const cuenta = await lector.get('/api/circulacion/mi-cuenta');
    assert.ok(cuenta.body.adeudos.some((r) => r.adeudo_id === id && r.estado === 'PAGADO'));
  } finally {
    if (folio) {
      await DbPool.query(
        'DELETE FROM pago WHERE adeudo_id IN(SELECT adeudo_id FROM adeudo JOIN prestamo USING(prestamo_id) WHERE folio=$1)',
        [folio],
      );
      await DbPool.query(
        'DELETE FROM adeudo WHERE prestamo_id IN(SELECT prestamo_id FROM prestamo WHERE folio=$1)',
        [folio],
      );
      await DbPool.query('DELETE FROM prestamo WHERE folio=$1', [folio]);
      await DbPool.query('DELETE FROM movimiento_ejemplar WHERE motivo=$1 OR observaciones=$1', [
        folio,
      ]);
      await DbPool.query(
        "UPDATE ejemplar SET estado='DISPONIBLE',fecha_baja=NULL,motivo_baja=NULL,baja_por_usuario_id=NULL,detalle_baja=NULL WHERE codigo_ejemplar=$1",
        [clave],
      );
    }
  }
});

test('recuperación entrega un enlace temporal, revoca sesiones y no permite reutilizarlo', async () => {
  const mat = 'N000402';
  const lector = await iniciarSesion(mat);
  const {
    rows: [u],
  } = await DbPool.query(
    'SELECT usuario_id,"contraseña_hash" AS hash,version_sesion,debe_cambiar_contrasena FROM usuario WHERE identificador=$1',
    [mat],
  );
  const original = globalThis.fetch;
  const { CORREO_WEBHOOK_URL: url, CORREO_WEBHOOK_TOKEN: secret } = process.env;
  process.env.CORREO_WEBHOOK_URL = 'https://correo.example.invalid/';
  process.env.CORREO_WEBHOOK_TOKEN = 'test';
  let token;
  globalThis.fetch = async (_url, options) => {
    token = /#recuperar\/([\w-]{43})/.exec(JSON.parse(options.body).texto)?.[1];
    return new Response(JSON.stringify({ confirmado: true, acuse: 'CORREO-PRUEBA' }));
  };
  try {
    const publica = request(app);
    const solicitud = await publica.post('/api/auth/recuperacion').send({ identificador: mat });
    assert.equal(solicitud.status, 202, JSON.stringify(solicitud.body));
    const ausente = await publica.post('/api/auth/recuperacion').send({ identificador: 'N123987' });
    assert.deepEqual(ausente.body, solicitud.body);
    assert.ok(token);
    const confirmacion = { token, contrasena: 'NuevaClave-Para-Pruebas' };
    assert.equal(
      (await publica.post('/api/auth/recuperacion/confirmar').send(confirmacion)).status,
      204,
    );
    assert.equal((await lector.get('/api/auth/sesion')).status, 401);
    assert.equal(
      (await publica.post('/api/auth/recuperacion/confirmar').send(confirmacion)).status,
      400,
    );
    await iniciarSesion(mat, confirmacion.contrasena);
  } finally {
    globalThis.fetch = original;
    if (url === undefined) {
      delete process.env.CORREO_WEBHOOK_URL;
    } else {
      process.env.CORREO_WEBHOOK_URL = url;
    }
    if (secret === undefined) {
      delete process.env.CORREO_WEBHOOK_TOKEN;
    } else {
      process.env.CORREO_WEBHOOK_TOKEN = secret;
    }
    await DbPool.query('DELETE FROM recuperacion_acceso WHERE usuario_id=$1', [u.usuario_id]);
    await DbPool.query(
      'UPDATE usuario SET "contraseña_hash"=$2,version_sesion=$3,debe_cambiar_contrasena=$4 WHERE usuario_id=$1',
      [u.usuario_id, u.hash, u.version_sesion, u.debe_cambiar_contrasena],
    );
  }
});

test('los perfiles de lectores creados desde la administración heredan su política de préstamo', async () => {
  const admin = await iniciarSesion('N000001');
  const clave = 'LECTOR-' + randomUUID().slice(0, 8).toUpperCase();
  try {
    const alta = await admin.post('/api/perfiles', {
      clave,
      nombre: clave,
      rol: 'Alumno',
      permisos: ['CONSULTAR_LIBROS'],
    });
    assert.equal(alta.status, 201, JSON.stringify(alta.body));
    assert.equal(alta.body.perfil.politicaPrestamo.diasHabiles, 5);
    assert.equal(alta.body.perfil.politicaPrestamo.maxRenovaciones, 2);
  } finally {
    await DbPool.query(
      'DELETE FROM perfil_permiso WHERE perfil_id IN(SELECT perfil_id FROM perfil WHERE clave=$1)',
      [clave],
    );
    await DbPool.query('DELETE FROM perfil WHERE clave=$1', [clave]);
  }
});
