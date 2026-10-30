/*----
 * Programa: consulta.test.mjs
 * Objetivo: Probar contra la BD real la consulta del catálogo: búsqueda y detalle (HULIB04),
 *           ubicación de ejemplares (HUUBI01) y listado con PDF e impresión (HULIS01).
 *           Uso: npm run test:bd
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import { describe, test, before, after, mock } from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';
const { DbPool, iniciarSesion, asignarPerfilDirecto } = await import('./ayudantes.mjs');
const { generadorListado } = await import('../../vistas/listadoVista.js');

let alumna; // A01234567: consulta, ubicación y listado

/**
 * Objetivo: Obtener los títulos de una respuesta de búsqueda o listado.
 * @param {Object} respuesta - Respuesta de supertest.
 * @returns {string[]} Títulos en el orden recibido.
 */
const titulos = (respuesta) => respuesta.body.libros.map((libro) => libro.titulo);

/**
 * Objetivo: Juntar en un Buffer una respuesta binaria (el PDF) para revisarla.
 * @param {import('node:http').IncomingMessage} respuesta - Respuesta HTTP.
 * @param {Function} terminar - Callback (error, cuerpo).
 * @returns {void}
 */
function leerBinario(respuesta, terminar) {
  const partes = [];
  respuesta.on('data', (parte) => partes.push(parte));
  respuesta.on('end', () => terminar(null, Buffer.concat(partes)));
}

before(async () => {
  alumna = await iniciarSesion('A01234567');
});

after(async () => {
  mock.restoreAll();
  await asignarPerfilDirecto('A01333444', 'PRF-ALU-2020');
  await DbPool.query(`DELETE FROM perfil WHERE clave = 'PRF-T-SINLIS'`);
  await DbPool.end();
});

describe('HULIB04: búsqueda de libros', () => {
  test('sin filtros muestra la primera página del catálogo ordenada por Título', async () => {
    const respuesta = await alumna.get('/api/libros');

    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.total, 8);
    assert.equal(respuesta.body.totalPaginas, 2);
    assert.deepEqual(titulos(respuesta), [
      'Cálculo de una variable',
      'Cien años de soledad',
      'El laberinto de la soledad',
      'Física conceptual',
      'Historia mínima de México',
    ]);
  });

  test('muestra la disponibilidad, incluso en cero', async () => {
    const respuesta = await alumna.get('/api/libros?pagina=1&porPagina=8');
    const porClave = Object.fromEntries(respuesta.body.libros.map((libro) => [libro.clave, libro]));

    assert.equal(porClave['CIE-530-HEW'].disponibilidad, 'Sin ejemplares registrados');
    assert.equal(porClave['LIT-863-PAZ'].disponibilidad, 'No disponible');
    assert.equal(porClave['COM-005.1-COR'].ejemplaresDisponibles, 2);
    assert.equal(porClave['HIS-972-ESC'].ejemplaresRegistrados, 1);
  });

  const BUSQUEDAS = [
    ['autor sin acentos ni mayúsculas', '?autor=GARCIA', ['Cien años de soledad']],
    [
      'título con espacios',
      '?titulo=%20%20soledad%20',
      ['Cien años de soledad', 'El laberinto de la soledad'],
    ],
    [
      'filtros combinados (todos se cumplen)',
      '?titulo=soledad&autor=paz',
      ['El laberinto de la soledad'],
    ],
    ['Clave de libro exacta', '?clave=lit-863-rul', ['Pedro Páramo']],
    ['clave parcial no coincide', '?clave=LIT-863', []],
    ['una Clave de ejemplar no es Clave de libro', '?clave=LIT-863-RUL-E01', []],
    [
      'campo único del front por Autor',
      '?buscar=cormen&criterio=Autor',
      ['Introducción a los algoritmos'],
    ],
    [
      'campo único del front por Clave',
      '?buscar=COM-005.1-SOM&criterio=Clave',
      ['Ingeniería de software'],
    ],
    [
      'tema de la lista del front',
      '?tema=Literatura&porPagina=10',
      ['Cien años de soledad', 'El laberinto de la soledad', 'Pedro Páramo'],
    ],
    ['tipo de uso de la lista del front', '?tipoUso=Reservado', ['Cálculo de una variable']],
    ['"Todos los temas" no filtra', '?tema=Todos%20los%20temas&porPagina=10', null],
  ];
  for (const [descripcion, parametros, esperados] of BUSQUEDAS) {
    test(`busca por ${descripcion}`, async () => {
      const respuesta = await alumna.get(`/api/libros${parametros}`);
      assert.equal(respuesta.status, 200);
      if (esperados) {
        assert.deepEqual(titulos(respuesta), esperados);
      } else {
        assert.equal(respuesta.body.total, 8);
      }
    });
  }

  test('por relevancia, la Clave exacta va primero', async () => {
    const respuesta = await alumna.get('/api/libros?buscar=LIT-863-RUL');
    assert.equal(titulos(respuesta)[0], 'Pedro Páramo');
  });

  test('ordena como el menú del front', async () => {
    const zA = await alumna.get(`/api/libros?orden=${encodeURIComponent('Título Z–A')}`);
    const autor = await alumna.get(`/api/libros?orden=${encodeURIComponent('Autor A–Z')}`);
    assert.equal(titulos(zA)[0], 'Pedro Páramo');
    assert.equal(titulos(autor)[0], 'Cien años de soledad'); // Gabriel García Márquez
  });

  test('sin coincidencias conserva los filtros y responde total cero', async () => {
    const respuesta = await alumna.get('/api/libros?autor=borges');
    assert.equal(respuesta.body.total, 0);
    assert.deepEqual(respuesta.body.filtros, [
      { campo: 'autor', nombre: 'Autor', valor: 'borges' },
    ]);
  });

  const PARAMETROS_INVALIDOS = [
    ['?orden=al-azar', 'Orden'],
    ['?buscar=x&criterio=Color', 'Criterio'],
    ['?tipoUso=Préstamo%20a%20domicilio', 'Tipo de uso'],
    ['?pagina=0', 'Página'],
  ];
  for (const [parametros, campo] of PARAMETROS_INVALIDOS) {
    test(`rechaza el parámetro inválido ${campo}`, async () => {
      const respuesta = await alumna.get(`/api/libros${parametros}`);
      assert.equal(respuesta.status, 400);
      assert.deepEqual(respuesta.body.error.detalle.campos, [campo]);
    });
  }
});

describe('HULIB04: detalle de ejemplares', () => {
  test('un libro sin ejemplares muestra "Sin ejemplares registrados"', async () => {
    const respuesta = await alumna.get('/api/libros/CIE-530-HEW');
    assert.equal(respuesta.body.mensajeEjemplares, 'Sin ejemplares registrados');
    assert.deepEqual(respuesta.body.ejemplares, []);
  });

  test('un libro con todas sus copias prestadas muestra cero disponibles y sus estados', async () => {
    const respuesta = await alumna.get('/api/libros/LIT-863-PAZ');
    assert.equal(respuesta.body.mensajeEjemplares, 'Ejemplares disponibles: 0');
    assert.equal(respuesta.body.ejemplares[0].estado, 'Prestado');
  });

  test('un ejemplar con ubicación incompleta identifica el dato faltante', async () => {
    const sinFila = await alumna.get('/api/ejemplares/MAT-515-STE-E06');
    const sinNada = await alumna.get('/api/ejemplares/MAT-515-STE-E05');

    assert.deepEqual(sinFila.body.ejemplar.ubicacionFaltante, ['Fila']);
    assert.equal(sinFila.body.ejemplar.librero, 'MAT');
    assert.equal(
      sinFila.body.ejemplar.avisoUbicacion,
      'Ubicación incompleta: consulte al Bibliotecario',
    );
    assert.deepEqual(sinNada.body.ejemplar.ubicacionFaltante, ['Librero', 'Fila']);
  });
});

describe('HUUBI01: consulta de ubicación', () => {
  test('muestra Librero y Fila de cada copia y "No registrado" donde falta', async () => {
    const respuesta = await alumna.get('/api/ubicaciones?titulo=calculo');
    const porClave = Object.fromEntries(
      respuesta.body.ejemplares.map((ejemplar) => [ejemplar.claveEjemplar, ejemplar]),
    );

    assert.equal(respuesta.body.mensaje, 'Libro encontrado');
    assert.equal(respuesta.body.total, 6);
    assert.deepEqual(
      [porClave['MAT-515-STE-E01'].librero, porClave['MAT-515-STE-E01'].fila],
      ['MAT', 'D1'],
    );
    assert.deepEqual(
      [porClave['MAT-515-STE-E06'].librero, porClave['MAT-515-STE-E06'].fila],
      ['MAT', 'No registrado'],
    );
    assert.deepEqual(
      [porClave['MAT-515-STE-E05'].librero, porClave['MAT-515-STE-E05'].fila],
      ['No registrado', 'No registrado'],
    );
  });

  test('no muestra ejemplares dados de baja', async () => {
    const respuesta = await alumna.get('/api/ubicaciones?clave=HIS-972-ESC');
    assert.deepEqual(
      respuesta.body.ejemplares.map((ejemplar) => ejemplar.claveEjemplar),
      ['HIS-972-ESC-E01'],
    );
  });

  test('sin coincidencias lo indica y conserva los criterios', async () => {
    const respuesta = await alumna.get('/api/ubicaciones?autor=borges&tema=historia');
    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.mensaje, 'No hay coincidencias con los datos ingresados');
    assert.equal(respuesta.body.filtros.length, 2);
  });

  test('exige al menos un criterio', async () => {
    const respuesta = await alumna.get('/api/ubicaciones');
    assert.equal(respuesta.status, 400);
  });
});

describe('HULIS01: listado de libros', () => {
  test('sin filtros lista todas las fichas por Título con ISBN "No registrado" si falta', async () => {
    const respuesta = await alumna.get('/api/listado-libros');
    const historia = respuesta.body.libros.find((libro) => libro.clave === 'HIS-972-ESC');

    assert.equal(respuesta.body.total, 8);
    assert.equal(respuesta.body.libros.length, 8);
    assert.equal(respuesta.body.mensaje, '8 libros encontrados');
    assert.equal(titulos(respuesta).at(-1), 'Pedro Páramo');
    assert.equal(historia.isbn, 'No registrado');
  });

  test('filtra por un dato bibliográfico y muestra el filtro aplicado', async () => {
    const respuesta = await alumna.get('/api/listado-libros?tema=matem');
    assert.deepEqual(titulos(respuesta), ['Cálculo de una variable']);
    assert.deepEqual(respuesta.body.filtros, [{ campo: 'tema', nombre: 'Tema', valor: 'matem' }]);
  });

  test('combina filtros y solo incluye las fichas que cumplen todos', async () => {
    const respuesta = await alumna.get('/api/listado-libros?tema=Literatura&autor=rulfo');
    assert.deepEqual(titulos(respuesta), ['Pedro Páramo']);
  });

  test('sin coincidencias no permite exportar ni imprimir', async () => {
    const listado = await alumna.get('/api/listado-libros?editorial=planeta');
    const pdf = await alumna.get('/api/listado-libros/pdf?editorial=planeta');
    const impresion = await alumna.get('/api/listado-libros/impresion?editorial=planeta');

    assert.equal(listado.body.total, 0);
    assert.equal(listado.body.mensaje, 'No hay libros que coincidan con los filtros seleccionados');
    assert.equal(pdf.status, 404);
    assert.equal(impresion.status, 404);
  });

  test('exporta a PDF todas las coincidencias, no solo una página', async () => {
    const respuesta = await alumna
      .get('/api/listado-libros/pdf?tema=Literatura')
      .buffer(true)
      .parse(leerBinario);

    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.headers['content-type'], 'application/pdf');
    assert.match(respuesta.headers['content-disposition'], /attachment; filename="listado-libros-/);
    assert.equal(respuesta.body.subarray(0, 5).toString(), '%PDF-');
  });

  test('con vista=1 el PDF de una ficha se muestra en el visor del navegador', async () => {
    const respuesta = await alumna
      .get('/api/listado-libros/pdf?clave=LIT-863.64-GAR&vista=1')
      .buffer(true)
      .parse(leerBinario);

    assert.equal(respuesta.status, 200);
    assert.match(respuesta.headers['content-disposition'], /^inline; filename="listado-libros-/);
    assert.equal(respuesta.body.subarray(0, 5).toString(), '%PDF-');
  });

  test('prepara una vista de impresión con el mismo listado', async () => {
    const respuesta = await alumna.get('/api/listado-libros/impresion?tema=Literatura');
    const nonce = respuesta.headers['content-security-policy'].match(/nonce-([^']+)/)[1];

    assert.equal(respuesta.status, 200);
    assert.match(respuesta.headers['content-type'], /text\/html/);
    assert.ok(respuesta.text.includes('Total de libros: 3'));
    assert.ok(respuesta.text.includes('Pedro Páramo'));
    assert.ok(respuesta.text.includes(`<script nonce="${nonce}">`));
  });

  test('si falla la generación responde el error sin entregar un archivo', async () => {
    mock.method(generadorListado, 'crearPdf', async () => {
      throw new Error('Falla simulada');
    });
    mock.method(generadorListado, 'crearHtml', () => {
      throw new Error('Falla simulada');
    });
    try {
      const pdf = await alumna.get('/api/listado-libros/pdf');
      const impresion = await alumna.get('/api/listado-libros/impresion');
      assert.equal(pdf.status, 500);
      assert.equal(pdf.body.error.mensaje, 'No se pudo generar el PDF');
      assert.equal(impresion.body.error.mensaje, 'No se pudo preparar la impresión');
    } finally {
      mock.restoreAll();
    }
    // El listado en pantalla sigue disponible para reintentar
    assert.equal((await alumna.get('/api/listado-libros')).body.total, 8);
  });

  test('sin permiso para el listado no se muestran filas ni se genera el PDF', async () => {
    await DbPool.query(
      `INSERT INTO perfil (rol_id, clave, nombre)
       SELECT rol_id, 'PRF-T-SINLIS', 'Prueba sin listado' FROM rol WHERE nombre = 'Alumno'`,
    );
    await DbPool.query(
      `INSERT INTO perfil_permiso (perfil_id, rol_id, permiso_id)
       SELECT pf.perfil_id, pf.rol_id, p.permiso_id FROM perfil pf, permiso p
       WHERE pf.clave = 'PRF-T-SINLIS' AND p.clave = 'CONSULTAR_LIBROS'`,
    );
    await asignarPerfilDirecto('A01333444', 'PRF-T-SINLIS');
    const alumno = await iniciarSesion('A01333444');

    for (const ruta of [
      '/api/listado-libros',
      '/api/listado-libros/pdf',
      '/api/listado-libros/impresion',
    ]) {
      const respuesta = await alumno.get(ruta);
      assert.equal(respuesta.status, 403);
      assert.equal(
        respuesta.body.error.mensaje,
        'No tiene permiso para consultar el listado de libros',
      );
    }
    // Con "Consultar libros" sí puede buscar en el catálogo
    assert.equal((await alumno.get('/api/libros')).status, 200);
  });

  test('si se pierde la conexión con la BD no lo presenta como "sin coincidencias"', async () => {
    const consultaOriginal = DbPool.query.bind(DbPool);
    mock.method(DbPool, 'query', (sql, ...resto) => {
      if (typeof sql === 'string' && sql.includes('WITH fichas')) {
        return Promise.reject(new Error('Conexión interrumpida'));
      }
      return consultaOriginal(sql, ...resto);
    });
    try {
      const respuesta = await alumna.get('/api/listado-libros?tema=Literatura');
      assert.equal(respuesta.status, 503);
      assert.equal(
        respuesta.body.error.mensaje,
        'No fue posible recuperar el listado; intenta nuevamente',
      );
      assert.equal(respuesta.body.total, undefined);
    } finally {
      mock.restoreAll();
    }
  });
});
