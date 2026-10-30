/*----
 * Programa: libros.test.mjs
 * Objetivo: Probar contra la BD real el mantenimiento del catálogo: alta de libro y ejemplar
 *           (HULIB01), baja de ejemplar (HULIB02), cambios (HULIB03), baja del libro completo,
 *           etiquetas e historial. Usa libros con clave PRB- y los elimina al terminar.
 *           Uso: npm run test:bd
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import { describe, test, before, after } from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';
const { DbPool, iniciarSesion, obtenerUltimoEvento } = await import('./ayudantes.mjs');

const FICHA_PRUEBA = {
  clave: 'prb-001',
  titulo: 'Libro de pruebas',
  autor: 'Ana María Pruebas; Luis Ejemplo',
  tema: 'computación',
  editorial: 'Editorial Prueba',
  isbn: '978-0-13-468599-1',
  descripcion: 'Ficha creada por las pruebas automáticas',
  precioCompra: '25.50',
  ubicacion: 'Estante COM · B3',
  tipoUso: 'Préstamo externo',
};

let bibliotecario; // N000104, perfil PRF-BIB

/**
 * Objetivo: Contar los ejemplares de una ficha directamente en la BD.
 * @param {string} claveLibro - Clave de la ficha.
 * @returns {Promise<number>} Ejemplares registrados.
 */
async function contarEjemplares(claveLibro) {
  const resultado = await DbPool.query(
    `SELECT COUNT(*)::INT AS total FROM ejemplar e JOIN libro l USING (libro_id)
     WHERE l.clave_libro = $1`,
    [claveLibro],
  );
  return resultado.rows[0].total;
}

before(async () => {
  bibliotecario = await iniciarSesion('N000104');
});

after(async () => {
  const LIBROS_PRUEBA = `SELECT libro_id FROM libro WHERE clave_libro LIKE 'PRB-%'`;
  await DbPool.query(
    `DELETE FROM movimiento_ejemplar
     WHERE ejemplar_id IN (SELECT ejemplar_id FROM ejemplar WHERE libro_id IN (${LIBROS_PRUEBA}))`,
  );
  await DbPool.query(`DELETE FROM ejemplar WHERE libro_id IN (${LIBROS_PRUEBA})`);
  await DbPool.query(`DELETE FROM libro WHERE clave_libro LIKE 'PRB-%'`);
  await DbPool.query(
    `DELETE FROM autor a WHERE NOT EXISTS (SELECT 1 FROM autoria_ficha af WHERE af.autor_id = a.autor_id)`,
  );
  await DbPool.query(
    `DELETE FROM editorial e
     WHERE nombre LIKE 'Editorial Prueba%'
       AND NOT EXISTS (SELECT 1 FROM libro l WHERE l.editorial_id = e.id_editorial)`,
  );
  await DbPool.end();
});

describe('HULIB01: alta de libro y ejemplar', () => {
  test('registra ficha, ejemplar disponible, ubicación y etiqueta', async () => {
    const respuesta = await bibliotecario.post('/api/libros', FICHA_PRUEBA);

    assert.equal(respuesta.status, 201);
    assert.equal(respuesta.body.mensaje, 'Libro y ejemplar registrados exitosamente');
    assert.equal(respuesta.body.libro.clave, 'PRB-001');
    assert.deepEqual(respuesta.body.libro.autores, ['Ana María Pruebas', 'Luis Ejemplo']);
    assert.equal(respuesta.body.libro.tema, 'Computación');
    assert.equal(respuesta.body.libro.isbn, '9780134685991');
    assert.equal(respuesta.body.libro.precioCompraUsd, 25.5);
    assert.deepEqual(respuesta.body.libro.ejemplares, {
      total: 1,
      disponibles: 1,
      prestados: 0,
      dadosDeBaja: 0,
    });
    const [ejemplar] = respuesta.body.ejemplares;
    assert.equal(ejemplar.clave, 'PRB-001-E01');
    assert.equal(ejemplar.estado, 'Disponible');
    assert.equal(ejemplar.ubicacion, 'Estante COM · B3');
    assert.deepEqual(respuesta.body.etiquetas[0], {
      claveEjemplar: 'PRB-001-E01',
      titulo: 'Libro de pruebas',
      clasificacion: 'PRB-001',
      autor: 'Ana María Pruebas; Luis Ejemplo',
      tipoUso: 'Préstamo externo',
      ubicacion: 'Estante COM · B3',
      institucion: 'Biblioteca Universidad Ducky',
    });
    const evento = await obtenerUltimoEvento('ALTA_LIBRO', 'PRB-001');
    assert.deepEqual(evento.detalle.ejemplares, ['PRB-001-E01']);
  });

  test('con "Ejemplares que se reciben" registra varias copias numeradas', async () => {
    const respuesta = await bibliotecario.post('/api/libros', {
      ...FICHA_PRUEBA,
      clave: 'PRB-002',
      isbn: '',
      ubicacion: undefined,
      librero: 'lit',
      fila: 'a9',
      cantidad: 3,
    });

    assert.equal(respuesta.status, 201);
    assert.equal(respuesta.body.mensaje, 'Libro y 3 ejemplares registrados exitosamente');
    assert.deepEqual(
      respuesta.body.ejemplares.map((ejemplar) => ejemplar.clave),
      ['PRB-002-E01', 'PRB-002-E02', 'PRB-002-E03'],
    );
  });

  test('una Clave de libro registrada no crea ni sobrescribe y muestra la ficha existente', async () => {
    const respuesta = await bibliotecario.post('/api/libros', {
      ...FICHA_PRUEBA,
      clave: 'LIT-863-RUL',
      isbn: '',
    });

    assert.equal(respuesta.status, 409);
    assert.equal(
      respuesta.body.error.mensaje,
      'La Clave de libro ya existe; seleccione la ficha para agregar un ejemplar',
    );
    assert.equal(respuesta.body.error.detalle.ficha.titulo, 'Pedro Páramo');
    assert.equal(await contarEjemplares('LIT-863-RUL'), 3);
  });

  const RECHAZOS = [
    [
      'ISBN de otra ficha',
      { ...FICHA_PRUEBA, clave: 'PRB-003', isbn: '9780307474728' },
      409,
      'El ISBN ya está registrado en la ficha LIT-863.64-GAR',
    ],
    [
      'tema que no está en el catálogo',
      { ...FICHA_PRUEBA, clave: 'PRB-003', isbn: '', tema: 'Astrología' },
      400,
      'Tema no registrado',
    ],
    [
      'Clave de ejemplar ya usada',
      { ...FICHA_PRUEBA, clave: 'PRB-003', isbn: '', claveEjemplar: 'LIT-863-RUL-E01' },
      409,
      'La Clave de ejemplar ya está registrada',
    ],
  ];
  for (const [descripcion, cuerpo, estadoHttp, mensaje] of RECHAZOS) {
    test(`rechaza: ${descripcion}`, async () => {
      const respuesta = await bibliotecario.post('/api/libros', cuerpo);
      assert.equal(respuesta.status, estadoHttp);
      assert.equal(respuesta.body.error.mensaje, mensaje);
    });
  }

  test('un rechazo dentro de la transacción no deja una ficha a medias', async () => {
    const respuesta = await bibliotecario.get('/api/libros/PRB-003');
    assert.equal(respuesta.status, 404);
  });

  test('señala por nombre todos los campos obligatorios vacíos', async () => {
    const respuesta = await bibliotecario.post('/api/libros', { titulo: '   ' });
    assert.equal(respuesta.status, 400);
    assert.deepEqual(respuesta.body.error.detalle.campos, [
      'Clave',
      'Título',
      'Autor',
      'Tema',
      'Editorial',
      'Librero',
      'Fila',
    ]);
  });

  test('agrega un ejemplar a una ficha existente sin duplicarla (escenario 2)', async () => {
    const automatica = await bibliotecario.post('/api/libros/PRB-001/ejemplares', {
      librero: 'COM',
      fila: 'B4',
    });
    const capturada = await bibliotecario.post('/api/libros/prb-001/ejemplares', {
      claveEjemplar: 'PRB-001-X1',
      ubicacion: 'COM · B4',
    });

    assert.equal(automatica.status, 201);
    assert.equal(automatica.body.mensaje, 'Ejemplar registrado exitosamente');
    assert.equal(automatica.body.ejemplares[0].clave, 'PRB-001-E02');
    assert.equal(capturada.body.ejemplares[0].clave, 'PRB-001-X1');
    assert.equal(capturada.body.libro.ejemplares.total, 3);
    assert.equal(capturada.body.libro.titulo, 'Libro de pruebas');
  });

  test('con una Clave de libro inexistente responde "Ficha bibliográfica no encontrada"', async () => {
    const respuesta = await bibliotecario.post('/api/libros/NO-EXISTE/ejemplares', {
      librero: 'COM',
      fila: 'B4',
    });
    assert.equal(respuesta.status, 404);
    assert.equal(respuesta.body.error.mensaje, 'Ficha bibliográfica no encontrada');
  });

  test('sin los permisos de alta no se registra nada', async () => {
    const consulta = await iniciarSesion('N000105');
    const alumna = await iniciarSesion('A01234567');
    for (const cliente of [consulta, alumna]) {
      const respuesta = await cliente.post('/api/libros', { ...FICHA_PRUEBA, clave: 'PRB-004' });
      assert.equal(respuesta.status, 403);
    }
  });
});

describe('HULIB03: cambio de datos, clasificación y ubicación', () => {
  test('actualiza los datos bibliográficos y el Título de las etiquetas', async () => {
    const respuesta = await bibliotecario.put('/api/libros/PRB-001', {
      titulo: 'Libro de pruebas, segunda edición',
      editorial: 'Editorial Prueba Dos',
      tema: 'Ciencias',
    });

    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.mensaje, 'Información bibliográfica actualizada exitosamente');
    assert.equal(respuesta.body.etiquetasActualizadas, 3);
    assert.equal(respuesta.body.libro.clave, 'PRB-001');
    assert.equal(respuesta.body.libro.ejemplares.total, 3);

    const etiqueta = await bibliotecario.get('/api/ejemplares/PRB-001-E01/etiqueta');
    assert.equal(etiqueta.body.etiqueta.titulo, 'Libro de pruebas, segunda edición');
    const evento = await obtenerUltimoEvento('CAMBIO_LIBRO', 'PRB-001');
    assert.deepEqual(evento.detalle.anterior, {
      titulo: 'Libro de pruebas',
      tema: 'Computación',
      editorial: 'Editorial Prueba',
    });
  });

  test('con un dato obligatorio vacío no guarda ningún cambio', async () => {
    const respuesta = await bibliotecario.put('/api/libros/PRB-001', {
      titulo: '  ',
      descripcion: 'Este cambio no debe guardarse',
    });
    assert.equal(respuesta.status, 400);
    assert.deepEqual(respuesta.body.error.detalle.campos, ['Título']);

    const libro = await bibliotecario.get('/api/libros/PRB-001');
    assert.equal(libro.body.libro.descripcion, 'Ficha creada por las pruebas automáticas');
  });

  test('las claves no se editan', async () => {
    const respuesta = await bibliotecario.put('/api/libros/PRB-001', { clave: 'PRB-999' });
    assert.equal(respuesta.status, 400);
    assert.equal(respuesta.body.error.mensaje, 'La Clave de libro no se puede modificar');
  });

  test('sin cambios responde que no hay nada por guardar', async () => {
    const respuesta = await bibliotecario.put('/api/libros/PRB-001', { tema: 'ciencias' });
    assert.equal(respuesta.body.mensaje, 'No hay cambios por guardar');
  });

  test('cambia clasificación, ubicación y tipo de uso de un ejemplar (escenario 2)', async () => {
    const respuesta = await bibliotecario.put('/api/ejemplares/PRB-001-E01', {
      clave: 'com-005-prb',
      ubicacion: 'Estante COM · C1',
      tipoUso: 'Consulta interna',
    });

    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.mensaje, 'Clasificación y ubicación actualizadas');
    assert.equal(respuesta.body.ejemplar.clave, 'PRB-001-E01');
    assert.equal(respuesta.body.ejemplar.estado, 'Disponible');
    assert.equal(respuesta.body.etiqueta.clasificacion, 'COM-005-PRB');
    assert.equal(respuesta.body.etiqueta.ubicacion, 'Estante COM · C1');

    const historial = await bibliotecario.get('/api/libros/PRB-001/historial');
    const tipos = historial.body.movimientos
      .filter((movimiento) => movimiento.claveEjemplar === 'PRB-001-E01')
      .map((movimiento) => movimiento.tipo);
    assert.deepEqual(tipos.slice(0, 3).sort(), [
      'CAMBIO_CLASIFICACION',
      'CAMBIO_UBICACION',
      'CAMBIO_USO',
    ]);
  });

  test('no guarda una clasificación o ubicación incompleta (escenario 3)', async () => {
    const respuesta = await bibliotecario.put('/api/ejemplares/PRB-001-E01', {
      librero: 'COM',
      fila: ' ',
    });
    assert.equal(respuesta.status, 400);
    assert.deepEqual(respuesta.body.error.detalle.campos, ['Fila']);
  });

  test('un ejemplar dado de baja conserva su ubicación histórica (escenario 4)', async () => {
    const respuesta = await bibliotecario.put('/api/ejemplares/HIS-972-ESC-E02', { librero: 'X' });
    assert.equal(respuesta.status, 409);
    assert.equal(
      respuesta.body.error.mensaje,
      'El ejemplar está dado de baja; su ubicación histórica no se modifica',
    );
  });
});

describe('HULIB02: baja de ejemplares', () => {
  test('da de baja sin borrar y lo excluye de los disponibles', async () => {
    const respuesta = await bibliotecario.post('/api/ejemplares/PRB-001-E02/baja', {
      motivo: 'Dañado',
      observaciones: 'Se mojó en la sala de lectura',
    });

    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.mensaje, 'Ejemplar dado de baja exitosamente');
    assert.equal(respuesta.body.ejemplar.estado, 'Dado de baja');
    assert.equal(respuesta.body.ejemplar.baja.motivo, 'Dañado');
    assert.equal(respuesta.body.ejemplar.baja.operador, 'N000104');
    assert.deepEqual(respuesta.body.libro.ejemplares, {
      total: 3,
      disponibles: 2,
      prestados: 0,
      dadosDeBaja: 1,
    });
    const evento = await obtenerUltimoEvento('BAJA_EJEMPLAR', 'PRB-001-E02');
    assert.equal(evento.detalle.motivo, 'DANADO');
  });

  test('con préstamo activo no cambia el estado ni registra la baja', async () => {
    const respuesta = await bibliotecario.post('/api/ejemplares/COM-005.1-COR-E01/baja', {
      motivo: 'Perdido',
    });
    assert.equal(respuesta.status, 409);
    assert.equal(
      respuesta.body.error.mensaje,
      'No se puede dar de baja: el ejemplar tiene un préstamo activo',
    );
    const ejemplar = await bibliotecario.get('/api/ejemplares/COM-005.1-COR-E01');
    assert.equal(ejemplar.body.ejemplar.estado, 'Prestado');
  });

  test('un ejemplar inexistente responde "Ejemplar no encontrado"', async () => {
    const respuesta = await bibliotecario.post('/api/ejemplares/NO-EXISTE-E01/baja', {
      motivo: 'Perdido',
    });
    assert.equal(respuesta.status, 404);
    assert.equal(respuesta.body.error.mensaje, 'Ejemplar no encontrado');
  });

  test('un ejemplar ya dado de baja muestra la baja original', async () => {
    const respuesta = await bibliotecario.post('/api/ejemplares/HIS-972-ESC-E02/baja', {
      motivo: 'Perdido',
    });
    assert.equal(respuesta.status, 409);
    assert.equal(respuesta.body.error.mensaje, 'El ejemplar ya está dado de baja');
    assert.equal(respuesta.body.error.detalle.bajaAnterior.motivo, 'Dañado');
  });

  const MOTIVOS_INVALIDOS = [
    ['sin motivo', {}, 'Complete los campos obligatorios señalados'],
    [
      'motivo desconocido',
      { motivo: 'Quemado' },
      'El motivo debe ser Perdido, Robado, Dañado, Obsoleto u Otro',
    ],
    ['"Otro" sin descripción', { motivo: 'Otro' }, 'Describa el motivo en Observaciones'],
  ];
  for (const [descripcion, cuerpo, mensaje] of MOTIVOS_INVALIDOS) {
    test(`rechaza: ${descripcion}`, async () => {
      const respuesta = await bibliotecario.post('/api/ejemplares/PRB-001-X1/baja', cuerpo);
      assert.equal(respuesta.status, 400);
      assert.equal(respuesta.body.error.mensaje, mensaje);
    });
  }
});

describe('Baja del libro completo (front)', () => {
  test('se rechaza si algún ejemplar tiene préstamo activo', async () => {
    const respuesta = await bibliotecario.post('/api/libros/LIT-863-PAZ/baja', {
      motivo: 'Obsoleto',
    });
    assert.equal(respuesta.status, 409);
    assert.equal(respuesta.body.error.detalle.prestamos[0].claveEjemplar, 'LIT-863-PAZ-E01');
  });

  test('da de baja la ficha y sus ejemplares conservando los registros', async () => {
    const respuesta = await bibliotecario.post('/api/libros/PRB-002/baja', {
      motivo: 'Otro',
      observaciones: 'Edición retirada por la editorial',
    });

    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.libro.estado, 'Dado de baja');
    assert.equal(respuesta.body.libro.baja.motivo, 'Otro: Edición retirada por la editorial');
    assert.deepEqual(respuesta.body.libro.ejemplares, {
      total: 3,
      disponibles: 0,
      prestados: 0,
      dadosDeBaja: 3,
    });

    assert.equal(
      (await bibliotecario.post('/api/libros/PRB-002/baja', { motivo: 'Perdido' })).status,
      409,
    );
    assert.equal((await bibliotecario.put('/api/libros/PRB-002', { titulo: 'X' })).status, 409);
    const nuevoEjemplar = await bibliotecario.post('/api/libros/PRB-002/ejemplares', {
      librero: 'LIT',
      fila: 'A9',
    });
    assert.equal(nuevoEjemplar.status, 409);
  });
});

describe('Consulta, etiquetas, historial y catálogos', () => {
  test('consulta una ficha cuya clave tiene puntos, con sus ejemplares', async () => {
    const respuesta = await bibliotecario.get('/api/libros/LIT-863.64-GAR');
    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.ejemplares.length, 4);
  });

  test('las etiquetas excluyen los ejemplares dados de baja', async () => {
    const respuesta = await bibliotecario.get('/api/libros/PRB-001/etiquetas');
    assert.deepEqual(
      respuesta.body.etiquetas.map((etiqueta) => etiqueta.claveEjemplar),
      ['PRB-001-E01', 'PRB-001-X1'],
    );
  });

  test('el historial registra alta, etiqueta, cambios y baja con su operador', async () => {
    const respuesta = await bibliotecario.get('/api/libros/PRB-001/historial');
    const tipos = new Set(respuesta.body.movimientos.map((movimiento) => movimiento.tipo));
    for (const tipo of ['ALTA', 'ETIQUETA', 'CAMBIO_UBICACION', 'BAJA']) {
      assert.ok(tipos.has(tipo), `Falta el movimiento ${tipo}`);
    }
    assert.ok(respuesta.body.movimientos.every((movimiento) => movimiento.operador === 'N000104'));
  });

  test('los catálogos usan los nombres del front', async () => {
    const respuesta = await bibliotecario.get('/api/catalogos');
    assert.deepEqual(respuesta.body.temas, [
      'Ciencias',
      'Computación',
      'Historia',
      'Literatura',
      'Matemáticas',
    ]);
    assert.deepEqual(respuesta.body.motivosBaja, [
      'Perdido',
      'Robado',
      'Dañado',
      'Obsoleto',
      'Otro',
    ]);
  });
});
