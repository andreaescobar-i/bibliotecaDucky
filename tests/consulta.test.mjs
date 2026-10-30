/*----
 * Programa: consulta.test.mjs
 * Objetivo: Probar sin base de datos el formato de la búsqueda, el listado, la ubicación y la
 *           generación del PDF y de la vista de impresión (HULIB04, HUUBI01, HULIS01)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

process.env.NODE_ENV = 'test';
const { default: app } = await import('../app.js');
const { formatearFichaResumen, formatearListado, formatearUbicaciones, describirFiltros } =
  await import('../vistas/consultaVista.js');
const { generadorListado, escaparHtml } = await import('../vistas/listadoVista.js');

const FICHA = {
  clave_libro: 'HIS-972-ESC',
  titulo: 'Historia mínima de México',
  autor: 'Pablo Escalante Gonzalbo',
  tema: 'Historia',
  editorial: 'El Colegio de México',
  isbn: null,
  disponibles: 1,
  registrados: 1,
};

describe('Formato de la consulta', () => {
  test('la disponibilidad distingue libros sin ejemplares y sin copias disponibles', () => {
    assert.equal(formatearFichaResumen(FICHA).disponibilidad, 'Disponible');
    assert.equal(
      formatearFichaResumen({ ...FICHA, disponibles: 0 }).disponibilidad,
      'No disponible',
    );
    assert.equal(
      formatearFichaResumen({ ...FICHA, disponibles: 0, registrados: 0 }).disponibilidad,
      'Sin ejemplares registrados',
    );
  });

  test('un ISBN faltante se muestra como "No registrado"', () => {
    assert.equal(formatearFichaResumen(FICHA).isbn, 'No registrado');
  });

  test('los filtros aplicados se describen por nombre', () => {
    assert.deepEqual(describirFiltros({ titulo: 'soledad', clave: 'LIT-863-RUL' }), [
      { campo: 'titulo', nombre: 'Título', valor: 'soledad' },
      { campo: 'clave', nombre: 'Clave de libro', valor: 'LIT-863-RUL' },
    ]);
  });

  test('una ubicación faltante se indica "No registrado" sin tomarla de otra copia', () => {
    const resultado = formatearUbicaciones(
      [
        {
          clave_libro: 'A',
          titulo: 'T',
          autor: 'X',
          codigo_ejemplar: 'A-E01',
          librero: 'MAT',
          fila: null,
          estado: 'DISPONIBLE',
          tipo_uso: 'Reservado',
        },
        {
          clave_libro: 'A',
          titulo: 'T',
          autor: 'X',
          codigo_ejemplar: 'A-E02',
          librero: 'MAT',
          fila: 'D1',
          estado: 'PRESTADO',
          tipo_uso: 'Reservado',
        },
      ],
      { titulo: 'T' },
    );
    assert.equal(resultado.mensaje, 'Libro encontrado');
    assert.equal(resultado.ejemplares[0].fila, 'No registrado');
    assert.equal(resultado.ejemplares[1].fila, 'D1');
    assert.equal(resultado.ejemplares[1].estado, 'Prestado');
  });
});

describe('Salidas del listado (HULIS01 escenario 6)', () => {
  test('el PDF incluye todas las filas aunque ocupen varias hojas', async () => {
    const libros = Array.from({ length: 120 }, (_valor, indice) =>
      formatearFichaResumen({ ...FICHA, clave_libro: `PRB-${indice}`, titulo: `Libro ${indice}` }),
    );
    const pdf = await generadorListado.crearPdf(
      { total: libros.length, filtros: [], libros },
      new Date('2026-10-27T12:00:00Z'),
    );
    const texto = pdf.toString('latin1');

    assert.equal(texto.slice(0, 5), '%PDF-');
    assert.ok((texto.match(/\/Type \/Page\b/g) ?? []).length > 1, 'Debe ocupar más de una hoja');
  });

  test('la vista de impresión escapa el texto y autoriza solo su propio script', () => {
    const listado = formatearListado(
      { total: 1, fichas: [{ ...FICHA, titulo: '<script>alert(1)</script>' }] },
      { tema: 'Historia' },
    );
    const html = generadorListado.crearHtml(listado, new Date(), 'abc123');

    assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
    assert.ok(html.includes('<script nonce="abc123">'));
    assert.ok(html.includes('Filtros: Tema: &quot;Historia&quot;'));
    assert.ok(html.includes('Total de libros: 1'));
  });

  test('escaparHtml cubre los caracteres especiales', () => {
    assert.equal(
      escaparHtml(`<a href="x">'&'</a>`),
      '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;',
    );
  });
});

describe('Rutas de consulta sin sesión (HULIS01 escenario 8)', () => {
  for (const ruta of [
    '/api/libros',
    '/api/listado-libros',
    '/api/listado-libros/pdf',
    '/api/listado-libros/impresion',
    '/api/ubicaciones?titulo=x',
  ]) {
    test(`${ruta} pide iniciar sesión antes de recuperar datos`, async () => {
      const respuesta = await request(app).get(ruta);
      assert.equal(respuesta.status, 401);
      assert.equal(respuesta.body.error.mensaje, 'Inicie sesión para continuar');
    });
  }
});
