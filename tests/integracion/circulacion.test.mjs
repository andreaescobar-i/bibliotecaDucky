import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { randomUUID } from 'node:crypto';

process.env.NODE_ENV = 'test';
const { DbPool, iniciarSesion } = await import('./ayudantes.mjs');
const ruta = '/api/circulacion';
const clave = 'CIR-' + randomUUID().slice(0, 8).toUpperCase();
const folios = [];

after(async () => {
  try {
    await DbPool.query(
      'DELETE FROM lista_espera WHERE libro_id=(SELECT libro_id FROM libro WHERE clave_libro=$1)',
      [clave],
    );
    await DbPool.query(
      'DELETE FROM adeudo WHERE prestamo_id IN (SELECT prestamo_id FROM prestamo WHERE folio=ANY($1))',
      [folios],
    );
    await DbPool.query(
      'DELETE FROM renovacion WHERE prestamo_id IN (SELECT prestamo_id FROM prestamo WHERE folio=ANY($1))',
      [folios],
    );
    await DbPool.query(
      'DELETE FROM devolucion WHERE prestamo_id IN (SELECT prestamo_id FROM prestamo WHERE folio=ANY($1))',
      [folios],
    );
    await DbPool.query('DELETE FROM prestamo WHERE folio=ANY($1)', [folios]);
    await DbPool.query(
      'DELETE FROM movimiento_ejemplar WHERE ejemplar_id=(SELECT ejemplar_id FROM ejemplar WHERE codigo_ejemplar=$1)',
      [clave + '-E01'],
    );
    await DbPool.query('DELETE FROM ejemplar WHERE codigo_ejemplar=$1', [clave + '-E01']);
    await DbPool.query('DELETE FROM libro WHERE clave_libro=$1', [clave]);
  } finally {
    await DbPool.end();
  }
});

test('registra circulación, protege datos personales y respeta la fila y el acuse', async () => {
  const staff = await iniciarSesion('N000104');
  const lector = await iniciarSesion('N000402');
  const otro = await iniciarSesion('A01234567');
  const {
    rows: [libro],
  } = await DbPool.query(
    `INSERT INTO libro (clave_libro, titulo, categoria_id, editorial_id, estado)
     SELECT $1,'Prueba de circulación',categoria_id,editorial_id,'ACTIVO'
     FROM libro LIMIT 1 RETURNING libro_id`,
    [clave],
  );
  const ejemplar = clave + '-E01';
  await DbPool.query(
    `INSERT INTO ejemplar (libro_id,tipo_uso_id,codigo_ejemplar,clave_clasificacion,estado)
     SELECT $1,tipo_uso_id,$2,'PRUEBA','DISPONIBLE' FROM tipo_uso WHERE permite_prestamo LIMIT 1`,
    [libro.libro_id, ejemplar],
  );
  const alta = { identificador: 'N000402', ejemplar };
  assert.equal((await lector.post(ruta + '/prestamos', alta)).status, 403);
  const registro = await staff.post(ruta + '/prestamos', alta);
  if (registro.body.folio) {
    folios.push(registro.body.folio);
  }
  assert.equal(registro.status, 201, JSON.stringify(registro.body));
  const p = registro.body;
  const recurso = ruta + '/prestamos/' + p.folio;
  assert.equal((await otro.get(recurso)).status, 403);
  assert.equal((await staff.post(ruta + '/prestamos', alta)).status, 409);
  const renovado = await staff.post(recurso + '/renovacion');
  assert.equal(renovado.status, 200, JSON.stringify(renovado.body));
  assert.ok(new Date(renovado.body.fecha_vencimiento) > new Date(p.fecha_vencimiento));
  const espera = await otro.post(ruta + '/mi-espera', { claveLibro: clave });
  assert.equal(espera.status, 201, JSON.stringify(espera.body));
  assert.equal(espera.body.posicion, 1);
  assert.equal((await otro.post(ruta + '/mi-espera', { claveLibro: clave })).status, 409);
  assert.equal((await staff.post(recurso + '/renovacion')).status, 409);
  await DbPool.query(
    "UPDATE prestamo SET fecha_prestamo=now()-interval '20 days', fecha_vencimiento=now()-interval '10 days' WHERE folio=$1",
    [p.folio],
  );
  const devolucion = await staff.post(recurso + '/devolucion', { condicion: 'Buen estado' });
  assert.equal(devolucion.status, 201, JSON.stringify(devolucion.body));
  assert.equal(devolucion.body.prestamo.estado, 'DEVUELTO');
  assert.equal(devolucion.body.hayEspera, true);
  const multa = devolucion.body.multa;
  assert.ok(Number(multa.monto_mxn) >= 50);
  assert.ok(multa.acuse_tesoreria);
  const reenvio = await staff.post(ruta + '/multas/' + multa.adeudo_id + '/envio');
  assert.equal(reenvio.body.acuse_tesoreria, multa.acuse_tesoreria);
  assert.equal(
    (await staff.post(recurso + '/devolucion', { condicion: 'Buen estado' })).status,
    409,
  );
  const cuenta = await lector.get(ruta + '/mi-cuenta');
  assert.ok(cuenta.body.adeudos.some((a) => a.adeudo_id === multa.adeudo_id));
  const cuentaAjena = await otro.get(ruta + '/mi-cuenta');
  assert.ok(!cuentaAjena.body.prestamos.some((a) => a.folio === p.folio));
});

test('Ducky explica el objetivo y el alcance sin depender de Gemini', async () => {
  const lector = await iniciarSesion('N000402');
  try {
    for (const [mensaje, patron] of [
      ['¿Cuál es el objetivo de Biblioteca Ducky?', /centraliza la gestión/],
      ['¿Qué incluye el sistema?', /lista de espera/],
      ['¿En qué plataforma puedo usarlo?', /aplicación web/],
    ]) {
      const respuesta = await lector.post('/api/chat/mensajes', { mensaje });
      assert.equal(respuesta.status, 200, JSON.stringify(respuesta.body));
      assert.match(respuesta.body.respuesta.texto, patron);
    }
  } finally {
    await lector.post('/api/chat/reinicio');
  }
});
