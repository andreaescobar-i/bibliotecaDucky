/*----
 * Programa: compras.test.mjs
 * Objetivo: Probar contra la BD real los escenarios de HUCOM01: solicitud y envío a Tesorería
 *           con presupuesto, solicitudes vacías o incompletas, consulta por folio, recepciones
 *           completas y parciales, y la autorización y entrega al catálogo del front. Las
 *           solicitudes creadas se eliminan al terminar. Uso: npm run test:bd
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import { describe, test, before, after, mock } from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';
const { DbPool, iniciarSesion, obtenerUltimoEvento } = await import('./ayudantes.mjs');
const { reloj } = await import('../../utilidades/reloj.js');
const { establecerTransporte } = await import('../../servicios/tesoreriaServicio.js');

const MARCA_PRUEBA = 'Prueba automática'; // Justificación que identifica lo creado aquí
const OCTUBRE_2026 = new Date('2026-10-20T12:00:00-06:00');
const DICIEMBRE_2026 = new Date('2026-12-05T12:00:00-06:00');

const PARTIDAS = [
  { titulo: 'Clean Code', autor: 'Robert C. Martin', editorial: 'Pearson', cantidad: 2 },
  {
    titulo: 'Refactoring',
    autor: 'Martin Fowler',
    editorial: 'Addison-Wesley',
    isbn: '',
    cantidad: 1,
  },
];

let comprador; // N000210, perfil PRF-COM
let folioEnviado; // Solicitud con 2 partidas enviada en el escenario 1
let folioPeticion; // Petición registrada sin partidas

/**
 * Objetivo: Contar registros con una consulta COUNT(*).
 * @param {string} sql - Consulta que devuelve "total".
 * @returns {Promise<number>} Total.
 */
async function contar(sql) {
  return (await DbPool.query(sql)).rows[0].total;
}

before(async () => {
  mock.method(reloj, 'ahora', () => OCTUBRE_2026);
  comprador = await iniciarSesion('N000210');
});

after(async () => {
  mock.restoreAll();
  establecerTransporte(null);
  const DE_PRUEBA = `SELECT solicitud_adquisicion_id FROM solicitud_adquisicion
                     WHERE justificacion = '${MARCA_PRUEBA}'`;
  await DbPool.query(`DELETE FROM recepcion WHERE solicitud_adquisicion_id IN (${DE_PRUEBA})`);
  await DbPool.query(`DELETE FROM solicitud_adquisicion WHERE justificacion = '${MARCA_PRUEBA}'`);
  await DbPool.end();
});

describe('HUCOM01 escenario 1: solicitud válida enviada a Tesorería', () => {
  test('crea folio, guarda partidas, envía y muestra el presupuesto del mes', async () => {
    const respuesta = await comprador.post('/api/solicitudes', {
      solicitante: 'Ing. Computación',
      costoEstimado: 3000,
      justificacion: MARCA_PRUEBA,
      partidas: PARTIDAS,
      enviar: true,
    });

    assert.equal(respuesta.status, 201);
    assert.equal(respuesta.body.mensaje, 'Solicitud remitida a Tesorería');
    assert.match(respuesta.body.folio, /^SOL-\d+$/);
    const { solicitud, presupuesto } = respuesta.body;
    assert.equal(solicitud.estado, 'En Tesorería');
    assert.equal(solicitud.envio.confirmado, true);
    assert.equal(solicitud.titulo, 'Clean Code / Refactoring');
    assert.equal(solicitud.cantidad, 3);
    assert.equal(solicitud.registradaPor, 'N000210');
    assert.equal(presupuesto.periodo, 'Octubre 2026');
    assert.equal(presupuesto.montoAutorizado, 50000);
    assert.ok(presupuesto.comprometido >= 3000, 'Lo comprometido incluye esta solicitud');
    assert.equal(presupuesto.disponible, presupuesto.montoAutorizado - presupuesto.comprometido);

    folioEnviado = respuesta.body.folio;
    const evento = await obtenerUltimoEvento('ENVIO_SOLICITUD', folioEnviado);
    assert.equal(evento.resultado, 'EXITO');
  });

  test('sin presupuesto registrado indica "Presupuesto no informado"', async () => {
    mock.method(reloj, 'ahora', () => DICIEMBRE_2026);
    try {
      const respuesta = await comprador.post('/api/solicitudes', {
        solicitante: 'Humanidades',
        justificacion: MARCA_PRUEBA,
        partidas: [PARTIDAS[0]],
        enviar: true,
      });
      assert.equal(respuesta.status, 201);
      assert.deepEqual(respuesta.body.presupuesto, {
        informado: false,
        mensaje: 'Presupuesto no informado',
      });
    } finally {
      mock.method(reloj, 'ahora', () => OCTUBRE_2026);
    }
  });

  test('registra una "Nueva petición" del front y la envía después de preparar partidas', async () => {
    const peticion = await comprador.post('/api/solicitudes', {
      titulo: 'Diseño de interfaces',
      solicitante: 'Facultad de Diseño',
      cantidad: 2,
      costoEstimado: '800',
      justificacion: MARCA_PRUEBA,
    });
    assert.equal(peticion.status, 201);
    assert.equal(peticion.body.mensaje, 'Petición registrada');
    assert.equal(peticion.body.solicitud.estado, 'Por autorizar');
    folioPeticion = peticion.body.folio;

    const partidas = await comprador.put(`/api/solicitudes/${folioPeticion}/partidas`, {
      partidas: [
        {
          titulo: 'Don’t Make Me Think',
          autor: 'Steve Krug',
          editorial: 'New Riders',
          cantidad: 2,
        },
      ],
    });
    assert.equal(partidas.body.mensaje, 'Partidas guardadas');

    const envio = await comprador.post(`/api/solicitudes/${folioPeticion.toLowerCase()}/envio`);
    assert.equal(envio.status, 200);
    assert.equal(envio.body.solicitud.estado, 'En Tesorería');

    const otraVez = await comprador.post(`/api/solicitudes/${folioPeticion}/envio`);
    assert.equal(otraVez.status, 409);
  });

  test('si Tesorería no confirma, la solicitud no se marca como enviada', async () => {
    const peticion = await comprador.post('/api/solicitudes', {
      solicitante: 'Arquitectura',
      justificacion: MARCA_PRUEBA,
      partidas: [PARTIDAS[1]],
    });
    establecerTransporte(async () => {
      throw new Error('Tesorería no responde');
    });
    try {
      const envio = await comprador.post(`/api/solicitudes/${peticion.body.folio}/envio`);
      assert.equal(envio.status, 503);
      assert.equal(
        envio.body.error.mensaje,
        'No se pudo confirmar el envío a Tesorería; la solicitud no se marcó como enviada',
      );
    } finally {
      establecerTransporte(null);
    }
    const consulta = await comprador.get(`/api/solicitudes/${peticion.body.folio}`);
    assert.equal(consulta.body.solicitud.estado, 'Por autorizar');
    assert.equal(consulta.body.solicitud.envio.confirmado, false);
  });
});

describe('HUCOM01 escenarios 2 y 3: solicitud vacía o con datos incompletos', () => {
  test('no envía una solicitud sin libros ni la crea', async () => {
    const antes = await contar(`SELECT COUNT(*)::INT AS total FROM solicitud_adquisicion`);
    const respuesta = await comprador.post('/api/solicitudes', {
      solicitante: 'Ing. Industrial',
      justificacion: MARCA_PRUEBA,
      partidas: [],
      enviar: true,
    });
    assert.equal(respuesta.status, 400);
    assert.equal(
      respuesta.body.error.mensaje,
      'Selecciona al menos un libro para solicitar su compra',
    );
    assert.equal(await contar(`SELECT COUNT(*)::INT AS total FROM solicitud_adquisicion`), antes);
  });

  test('una petición sin partidas no se puede enviar y sigue "Por autorizar"', async () => {
    const peticion = await comprador.post('/api/solicitudes', {
      titulo: 'Libro por definir',
      solicitante: 'Ing. Industrial',
      cantidad: 1,
      justificacion: MARCA_PRUEBA,
    });
    const envio = await comprador.post(`/api/solicitudes/${peticion.body.folio}/envio`);
    assert.equal(envio.status, 400);
    assert.equal(envio.body.error.mensaje, 'Selecciona al menos un libro para solicitar su compra');
  });

  test('identifica la partida y el campo incompleto sin crear nada ni fichas del catálogo', async () => {
    const libros = await contar('SELECT COUNT(*)::INT AS total FROM libro');
    const respuesta = await comprador.post('/api/solicitudes', {
      solicitante: 'Ing. Industrial',
      justificacion: MARCA_PRUEBA,
      partidas: [
        { titulo: 'Investigación de operaciones', autor: '  ', editorial: 'Pearson', cantidad: 1 },
        { titulo: '', autor: 'Taha', editorial: 'Pearson', cantidad: 0 },
      ],
      enviar: true,
    });
    assert.equal(respuesta.status, 400);
    assert.equal(respuesta.body.error.mensaje, 'Completa los datos de los libros señalados');
    assert.deepEqual(respuesta.body.error.detalle.partidas, [
      { partida: 1, campos: ['Autor'] },
      { partida: 2, campos: ['Título', 'Cantidad'] },
    ]);
    assert.equal(await contar('SELECT COUNT(*)::INT AS total FROM libro'), libros);
  });
});

describe('HUCOM01 escenarios 4 y 5: consulta por folio', () => {
  test('muestra partidas, recibidos, pendientes, envío y presupuesto de una solicitud enviada', async () => {
    const respuesta = await comprador.get('/api/solicitudes/sol-2402');
    const { solicitud } = respuesta.body;

    assert.equal(respuesta.status, 200);
    assert.equal(solicitud.folio, 'SOL-2402');
    assert.equal(solicitud.destino, 'Tesorería');
    assert.equal(solicitud.envio.confirmado, true);
    assert.equal(solicitud.estadoRecepcion, 'Parcial');
    assert.deepEqual(
      solicitud.partidas.map((p) => [
        p.cantidadSolicitada,
        p.cantidadRecibida,
        p.cantidadPendiente,
        p.estadoRecepcion,
      ]),
      [
        [3, 1, 2, 'Parcial'],
        [2, 0, 2, 'Pendiente'],
      ],
    );
    assert.equal(solicitud.presupuesto.periodo, 'Octubre 2026');
    assert.deepEqual(
      solicitud.recepciones.map((recepcion) => recepcion.folio),
      ['REC-0002'],
    );
  });

  test('una solicitud no enviada no muestra presupuesto', async () => {
    const respuesta = await comprador.get('/api/solicitudes/SOL-2418');
    assert.equal(respuesta.body.solicitud.envio.confirmado, false);
    assert.equal(respuesta.body.solicitud.presupuesto, undefined);
  });

  test('un folio inexistente responde "Solicitud no encontrada"', async () => {
    const consulta = await comprador.get('/api/solicitudes/SOL-0001');
    const recepcion = await comprador.post('/api/solicitudes/SOL-0001/recepciones', {
      fechaRecepcion: '2026-10-20',
      partidas: [{ numero: 1, cantidad: 1 }],
    });
    for (const respuesta of [consulta, recepcion]) {
      assert.equal(respuesta.status, 404);
      assert.equal(respuesta.body.error.mensaje, 'Solicitud no encontrada');
    }
  });

  test('el presupuesto del mes en curso muestra autorizado, comprometido y disponible', async () => {
    const respuesta = await comprador.get('/api/solicitudes/presupuesto');
    const { presupuesto } = respuesta.body;
    assert.equal(respuesta.status, 200);
    assert.equal(presupuesto.periodo, 'Octubre 2026');
    assert.equal(presupuesto.disponible, presupuesto.montoAutorizado - presupuesto.comprometido);
  });

  test('lista por estado con los textos del front', async () => {
    const respuesta = await comprador.get(
      `/api/solicitudes?estado=${encodeURIComponent('Recibido parcialmente')}`,
    );
    assert.ok(respuesta.body.solicitudes.some((solicitud) => solicitud.folio === 'SOL-2402'));
    assert.equal((await comprador.get('/api/solicitudes?estado=Perdida')).status, 400);
  });
});

describe('HUCOM01 escenarios 6 y 7: recepción de libros', () => {
  const RECHAZOS = [
    [
      'cantidad mayor que lo pendiente',
      { partidas: [{ numero: 1, cantidad: 3 }] },
      'Cada cantidad debe ser entera, no negativa y no superar lo pendiente.',
    ],
    [
      'partida que no es de la solicitud',
      { partidas: [{ numero: 9, cantidad: 1 }] },
      'La partida no pertenece a la solicitud.',
    ],
    [
      'ninguna cantidad mayor que cero',
      { cantidades: { 1: 0, 2: 0 } },
      'Recibe al menos un ejemplar.',
    ],
    [
      'fecha futura',
      { fechaRecepcion: '2026-10-21', partidas: [{ numero: 1, cantidad: 1 }] },
      'Captura una fecha de recepción válida.',
    ],
    [
      'fecha inexistente',
      { fechaRecepcion: '2026-02-30', partidas: [{ numero: 1, cantidad: 1 }] },
      'Captura una fecha de recepción válida.',
    ],
  ];
  for (const [descripcion, cuerpo, mensaje] of RECHAZOS) {
    test(`rechaza: ${descripcion}`, async () => {
      const respuesta = await comprador.post(`/api/solicitudes/${folioEnviado}/recepciones`, {
        fechaRecepcion: '2026-10-20',
        ...cuerpo,
      });
      assert.equal(respuesta.status, 400);
      assert.equal(respuesta.body.error.mensaje, mensaje);
    });
  }

  test('recepción parcial: acumula, calcula lo pendiente y permite otra entrega', async () => {
    const respuesta = await comprador.post(`/api/solicitudes/${folioEnviado}/recepciones`, {
      fechaRecepcion: '2026-10-20',
      partidas: [{ numero: 1, cantidad: 1 }],
    });

    assert.equal(respuesta.status, 201);
    assert.equal(respuesta.body.mensaje, 'Recepción parcial registrada');
    assert.match(respuesta.body.folioRecepcion, /^REC-\d{4}$/);
    assert.equal(respuesta.body.solicitud.estado, 'Recibido parcialmente');
    assert.deepEqual(
      respuesta.body.solicitud.partidas.map((p) => [
        p.cantidadRecibida,
        p.cantidadPendiente,
        p.estadoRecepcion,
      ]),
      [
        [1, 1, 'Parcial'],
        [0, 1, 'Pendiente'],
      ],
    );
  });

  test('recepción completa: deja pendientes en cero y muestra el material para el catálogo', async () => {
    const libros = await contar('SELECT COUNT(*)::INT AS total FROM libro');
    const respuesta = await comprador.post(`/api/solicitudes/${folioEnviado}/recepciones`, {
      fechaRecepcion: '2026-10-20',
      cantidades: { 1: 1, 2: 1 },
    });

    assert.equal(respuesta.status, 201);
    assert.equal(respuesta.body.mensaje, 'Recepción completa registrada');
    assert.equal(respuesta.body.solicitud.estado, 'Recibido');
    assert.equal(respuesta.body.solicitud.estadoRecepcion, 'Completa');
    assert.deepEqual(
      respuesta.body.materialRecibido.map((libro) => [libro.titulo, libro.cantidad]),
      [
        ['Clean Code', 1],
        ['Refactoring', 1],
      ],
    );
    // Recibir no crea fichas, ejemplares ni etiquetas
    assert.equal(await contar('SELECT COUNT(*)::INT AS total FROM libro'), libros);

    const consulta = await comprador.get(`/api/solicitudes/${folioEnviado}`);
    assert.equal(consulta.body.solicitud.recepciones.length, 2);
  });

  test('no recibe en solicitudes sin enviar o ya recibidas completas', async () => {
    for (const folio of ['SOL-2418', folioEnviado]) {
      const respuesta = await comprador.post(`/api/solicitudes/${folio}/recepciones`, {
        fechaRecepcion: '2026-10-20',
        partidas: [{ numero: 1, cantidad: 1 }],
      });
      assert.equal(respuesta.status, 409);
      assert.equal(
        respuesta.body.error.mensaje,
        'La solicitud debe estar enviada y tener material pendiente.',
      );
    }
  });
});

describe('Autorización simulada y entrega al catálogo (front)', () => {
  test('Tesorería autoriza una solicitud enviada una sola vez', async () => {
    const respuesta = await comprador.post(`/api/solicitudes/${folioPeticion}/autorizacion`, {
      decision: 'Autorizar',
    });
    assert.equal(respuesta.body.mensaje, 'Petición autorizada');
    assert.equal(respuesta.body.solicitud.estado, 'Autorizado');

    const otraVez = await comprador.post(`/api/solicitudes/${folioPeticion}/autorizacion`, {
      decision: 'Rechazar',
    });
    assert.equal(otraVez.status, 409);
    const invalida = await comprador.post(`/api/solicitudes/${folioPeticion}/autorizacion`, {
      decision: 'Tal vez',
    });
    assert.equal(invalida.status, 400);
  });

  test('entrega al catálogo solo un lote recibido completo', async () => {
    const parcial = await comprador.post('/api/solicitudes/SOL-2402/entrega-catalogo');
    assert.equal(parcial.status, 409);
    assert.equal(parcial.body.error.mensaje, 'Registra la recepción del lote antes de entregarlo.');

    const respuesta = await comprador.post(`/api/solicitudes/${folioEnviado}/entrega-catalogo`);
    assert.equal(respuesta.body.mensaje, 'Entrega al catálogo registrada');
    assert.equal(respuesta.body.solicitud.estado, 'Entregado al catálogo');
  });

  test('el historial de la solicitud registra cada paso con su operador', async () => {
    const respuesta = await comprador.get(`/api/solicitudes/${folioEnviado}`);
    assert.deepEqual(
      respuesta.body.solicitud.historial.map((evento) => evento.accion),
      ['CREACION_SOLICITUD', 'ENVIO_SOLICITUD', 'RECEPCION', 'RECEPCION', 'ENTREGA_CATALOGO'],
    );
    assert.ok(respuesta.body.solicitud.historial.every((evento) => evento.operador === 'N000210'));
  });
});

describe('Permisos de compras', () => {
  test('sin permisos de compras no se consulta ni se registra nada', async () => {
    const bibliotecario = await iniciarSesion('N000104');
    assert.equal((await bibliotecario.get('/api/solicitudes')).status, 403);
    assert.equal(
      (await bibliotecario.post('/api/solicitudes', { solicitante: 'X', titulo: 'X', cantidad: 1 }))
        .status,
      403,
    );
  });

  test('quien da de alta libros ve los lotes entregados al catálogo, solo para consultar', async () => {
    const bibliotecario = await iniciarSesion('N000104');
    const respuesta = await bibliotecario.get('/api/solicitudes/entregadas');

    assert.equal(respuesta.status, 200);
    assert.ok(respuesta.body.solicitudes.some((solicitud) => solicitud.folio === folioEnviado));
    assert.ok(respuesta.body.solicitudes.every((s) => s.estado === 'Entregado al catálogo'));
    assert.equal((await bibliotecario.get(`/api/solicitudes/${folioEnviado}`)).status, 403);
  });

  test('el Administrador puede consultar las solicitudes', async () => {
    const administradora = await iniciarSesion('N000001');
    assert.equal((await administradora.get('/api/solicitudes/SOL-2402')).status, 200);
  });
});
