/*----
 * Programa: compras.test.mjs
 * Objetivo: Probar sin base de datos las reglas de solicitudes y recepciones (HUCOM01)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

process.env.NODE_ENV = 'test';
const { default: app } = await import('../app.js');
const { validarPartidas, calcularEstadoRecepcion, leerFechaIso } =
  await import('../utilidades/reglasCompras.js');
const { formatearPresupuesto, formatearSolicitud } = await import('../vistas/solicitudVista.js');

describe('Reglas de compras', () => {
  test('una partida con solo espacios cuenta como vacía y el ISBN puede faltar', () => {
    const { partidas, errores } = validarPartidas([
      { titulo: 'Clean Code', autor: '   ', editorial: 'Pearson', cantidad: 2 },
      { titulo: ' ', autor: 'Fowler', editorial: 'Addison-Wesley', cantidad: 0 },
      { titulo: 'SICP', autor: 'Abelson', editorial: 'MIT Press', cantidad: 1, isbn: '' },
    ]);
    assert.deepEqual(errores, [
      { partida: 1, campos: ['Autor'] },
      { partida: 2, campos: ['Título', 'Cantidad'] },
    ]);
    assert.equal(partidas[2].isbn, null);
  });

  test('las cantidades deben ser enteros mayores que cero y el ISBN, si llega, válido', () => {
    const { errores } = validarPartidas([
      { titulo: 'A', autor: 'B', editorial: 'C', cantidad: 1.5 },
      { titulo: 'A', autor: 'B', editorial: 'C', cantidad: 1, isbn: '123' },
    ]);
    assert.deepEqual(errores, [
      { partida: 1, campos: ['Cantidad'] },
      { partida: 2, campos: ['ISBN'] },
    ]);
  });

  test('el estado de recepción es Pendiente, Parcial o Completa', () => {
    assert.equal(calcularEstadoRecepcion(3, 0), 'Pendiente');
    assert.equal(calcularEstadoRecepcion(3, 1), 'Parcial');
    assert.equal(calcularEstadoRecepcion(3, 3), 'Completa');
  });

  test('la fecha de recepción debe ser una fecha real en formato AAAA-MM-DD', () => {
    assert.equal(leerFechaIso('2026-10-20'), '2026-10-20');
    assert.equal(leerFechaIso('2026-02-30'), null);
    assert.equal(leerFechaIso('20/10/2026'), null);
  });
});

describe('Formato de solicitudes', () => {
  test('sin presupuesto registrado se indica "Presupuesto no informado"', () => {
    assert.deepEqual(formatearPresupuesto(null), {
      informado: false,
      mensaje: 'Presupuesto no informado',
    });
  });

  test('con presupuesto se muestra el disponible del periodo', () => {
    assert.deepEqual(
      formatearPresupuesto({
        anio: 2026,
        mes: 10,
        monto_autorizado_mxn: '50000.00',
        comprometido_mxn: '5920.00',
      }),
      {
        informado: true,
        periodo: 'Octubre 2026',
        montoAutorizado: 50000,
        comprometido: 5920,
        disponible: 44080,
      },
    );
  });

  test('cada partida muestra lo recibido, lo pendiente y su estado', () => {
    const solicitud = formatearSolicitud({
      folio: 'SOL-1',
      estado: 'RECIBIDO_PARCIAL',
      costo_total_estimado_mxn: null,
      partidas: [
        { numero: 1, titulo: 'A', cantidad_solicitada: 3, cantidad_recibida: 1 },
        { numero: 2, titulo: 'B', cantidad_solicitada: 2, cantidad_recibida: 0 },
      ],
    });
    assert.equal(solicitud.estado, 'Recibido parcialmente');
    assert.equal(solicitud.destino, 'Tesorería');
    assert.equal(solicitud.estadoRecepcion, 'Parcial');
    assert.deepEqual(
      solicitud.partidas.map((partida) => [partida.cantidadPendiente, partida.estadoRecepcion]),
      [
        [2, 'Parcial'],
        [2, 'Pendiente'],
      ],
    );
  });
});

describe('Rutas de compras sin sesión', () => {
  for (const [metodo, ruta] of [
    ['get', '/api/solicitudes'],
    ['get', '/api/solicitudes/SOL-2402'],
    ['post', '/api/solicitudes'],
    ['post', '/api/solicitudes/SOL-2402/envio'],
    ['post', '/api/solicitudes/SOL-2402/recepciones'],
  ]) {
    test(`${metodo.toUpperCase()} ${ruta} pide iniciar sesión`, async () => {
      const respuesta = await request(app)[metodo](ruta);
      assert.equal(respuesta.status, 401);
    });
  }
});
