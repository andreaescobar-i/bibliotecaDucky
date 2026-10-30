/*----
 * Programa: consultaControlador.js
 * Objetivo: Consultar el catálogo sin modificarlo: búsqueda con disponibilidad (HULIB04),
 *           listado filtrado con PDF e impresión (HULIS01) y ubicación de ejemplares (HUUBI01)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import crypto from 'node:crypto';
import * as consultaModelo from '../modelos/consultaModelo.js';
import * as catalogoModelo from '../modelos/catalogoModelo.js';
import * as consultaVista from '../vistas/consultaVista.js';
import { generadorListado } from '../vistas/listadoVista.js';
import ErrorAplicacion from '../utilidades/errorAplicacion.js';
import { limpiarTexto } from '../utilidades/validacion.js';
import { normalizarComparacion, normalizarClave } from '../utilidades/reglasCatalogo.js';

const POR_PAGINA_FRONT = 5; // El catálogo del front muestra 5 libros por página
const MAX_POR_PAGINA = 100;
const MENSAJE_SIN_COINCIDENCIAS_LISTADO =
  'No hay libros que coincidan con los filtros seleccionados';
const MENSAJE_ERROR_LISTADO = 'No fue posible recuperar el listado; intenta nuevamente';
const MENSAJE_ERROR_CATALOGO = 'No fue posible recuperar el catálogo; intenta nuevamente';

// Valores de las listas del front que equivalen a no filtrar
const VALORES_SIN_FILTRO = ['TODOS', 'TODOS LOS TEMAS', 'TODOS LOS ESTANTES'];

// Criterios del campo de búsqueda del front ("Todos", "Título", "Autor", "Editorial", "Clave")
const CRITERIOS = Object.freeze({
  TODOS: 'texto',
  TITULO: 'titulo',
  AUTOR: 'autor',
  EDITORIAL: 'editorial',
  TEMA: 'tema',
  CLAVE: 'clave',
});

// Órdenes del menú "Ordenar" del front y sus equivalentes en la API
const ORDENES = Object.freeze({
  RELEVANCIA: 'RELEVANCIA',
  'RELEVANCIA ORIGINAL': 'RELEVANCIA',
  'TITULO A-Z': 'TITULO_ASC',
  'TITULO-ASC': 'TITULO_ASC',
  'TITULO Z-A': 'TITULO_DESC',
  'TITULO-DESC': 'TITULO_DESC',
  'AUTOR A-Z': 'AUTOR_ASC',
  'AUTOR-ASC': 'AUTOR_ASC',
});

/**
 * Objetivo: Leer un parámetro de la URL; las opciones "Todos" del front cuentan como vacías.
 * @param {Object} consulta - Parámetros de la URL.
 * @param {string} nombre - Nombre del parámetro.
 * @returns {string} Valor sin espacios al inicio y al final.
 */
function leerParametro(consulta, nombre) {
  const valor = limpiarTexto(consulta[nombre]);
  return VALORES_SIN_FILTRO.includes(normalizarComparacion(valor)) ? '' : valor;
}

/**
 * Objetivo: Leer y validar los filtros del catálogo. Acepta los filtros por campo de las
 *   historias (titulo, autor, tema, editorial, clave) y el campo único del front (buscar +
 *   criterio).
 * @param {Object} consulta - Parámetros de la URL.
 * @returns {Promise<Object>} Filtros no vacíos.
 * Limitaciones: Lanza ErrorAplicacion 400 si el criterio o el tipo de uso no existen.
 */
async function leerFiltros(consulta) {
  const filtros = {};
  for (const campo of ['titulo', 'autor', 'tema', 'editorial']) {
    const valor = leerParametro(consulta, campo);
    if (valor) {
      filtros[campo] = valor;
    }
  }
  // La Clave de libro es coincidencia exacta; una Clave de ejemplar no se toma como de libro
  const clave = normalizarClave(leerParametro(consulta, 'clave'));
  if (clave) {
    filtros.clave = clave;
  }

  const buscar = leerParametro(consulta, 'buscar');
  if (buscar) {
    const criterio = normalizarComparacion(limpiarTexto(consulta.criterio) || 'Todos');
    const campo = CRITERIOS[criterio];
    if (!campo) {
      throw new ErrorAplicacion(
        400,
        'El criterio debe ser Todos, Título, Autor, Editorial o Clave',
        {
          campos: ['Criterio'],
        },
      );
    }
    filtros[campo] = campo === 'clave' ? normalizarClave(buscar) : buscar;
  }

  const tipoUso = leerParametro(consulta, 'tipoUso');
  if (tipoUso) {
    const registrado = await catalogoModelo.obtenerTipoUso(tipoUso);
    if (!registrado) {
      throw new ErrorAplicacion(400, 'Tipo de uso no registrado', { campos: ['Tipo de uso'] });
    }
    filtros.tipoUso = registrado.nombre;
  }
  return filtros;
}

/**
 * Objetivo: Leer un número entero positivo de la URL.
 * @param {unknown} valor - Valor recibido.
 * @param {number} porOmision - Valor si no se recibió.
 * @param {number} maximo - Valor máximo permitido.
 * @param {string} nombre - Nombre del parámetro para el mensaje de error.
 * @returns {number} Entero entre 1 y el máximo.
 */
function leerEnteroPositivo(valor, porOmision, maximo, nombre) {
  if (limpiarTexto(valor) === '') {
    return porOmision;
  }
  const numero = Number(valor);
  if (!Number.isInteger(numero) || numero < 1 || numero > maximo) {
    throw new ErrorAplicacion(400, `${nombre} debe ser un entero entre 1 y ${maximo}`, {
      campos: [nombre],
    });
  }
  return numero;
}

/**
 * Objetivo: Ejecutar una consulta a la BD y convertir una falla de conexión en un mensaje
 *   claro, distinto de "sin coincidencias" (HULIS01 escenario 9).
 * @param {Function} consulta - Función async que consulta la BD.
 * @param {string} mensaje - Mensaje para el usuario si falla.
 * @returns {Promise<any>} Resultado de la consulta.
 */
async function consultarBd(consulta, mensaje) {
  try {
    return await consulta();
  } catch (err) {
    const errorConsulta = new ErrorAplicacion(503, mensaje);
    errorConsulta.cause = err;
    throw errorConsulta;
  }
}

/**
 * Objetivo: Obtener el listado completo (todas las coincidencias, no solo una página),
 *   ordenado por Título y Clave (HULIS01).
 * @param {Object} req - Petición HTTP.
 * @returns {Promise<{ filtros: Object, listado: Object }>} Filtros y listado formateado.
 */
async function obtenerListado(req) {
  const filtros = await leerFiltros(req.query);
  const resultado = await consultarBd(
    () => consultaModelo.buscarFichas({ filtros, orden: 'TITULO_ASC' }),
    MENSAJE_ERROR_LISTADO,
  );
  return { filtros, listado: consultaVista.formatearListado(resultado, filtros) };
}

/**
 * Objetivo: Buscar libros con filtros, orden y paginación, mostrando su disponibilidad. No
 *   modifica datos ni registra préstamos (HULIB04 escenarios 1 y 2).
 * @param {Object} req - Petición HTTP. Query: buscar, criterio, titulo, autor, tema, editorial,
 *   clave, tipoUso, orden, pagina, porPagina.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function getLibros(req, res, next) {
  try {
    const filtros = await leerFiltros(req.query);
    const textoOrden = normalizarComparacion(limpiarTexto(req.query.orden)).replace(/[–—]/g, '-');
    const orden = textoOrden ? ORDENES[textoOrden] : filtros.texto ? 'RELEVANCIA' : 'TITULO_ASC';
    if (!orden) {
      throw new ErrorAplicacion(
        400,
        'El orden debe ser Relevancia, Título A–Z, Autor A–Z o Título Z–A',
        { campos: ['Orden'] },
      );
    }
    const pagina = leerEnteroPositivo(req.query.pagina, 1, Number.MAX_SAFE_INTEGER, 'Página');
    const porPagina = leerEnteroPositivo(
      req.query.porPagina,
      POR_PAGINA_FRONT,
      MAX_POR_PAGINA,
      'Libros por página',
    );

    const resultado = await consultarBd(
      () =>
        consultaModelo.buscarFichas({
          filtros,
          orden,
          limite: porPagina,
          desplazamiento: (pagina - 1) * porPagina,
        }),
      MENSAJE_ERROR_CATALOGO,
    );
    res.json(consultaVista.formatearBusqueda(resultado, { filtros, orden, pagina, porPagina }));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Listado de libros con o sin filtros, una fila por ficha (HULIS01 escenarios 1-5).
 * @param {Object} req - Petición HTTP. Query: titulo, autor, tema, editorial, clave.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function getListado(req, res, next) {
  try {
    const { listado } = await obtenerListado(req);
    res.json(listado);
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Exportar el listado a PDF con todas las coincidencias, filtros, encabezados y total
 *   (HULIS01 escenarios 6 y 7). Si falla, no se entrega un archivo incompleto.
 * @param {Object} req - Petición HTTP. Query: los mismos filtros del listado y vista=1 para
 *   mostrarlo en el navegador.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function getListadoPdf(req, res, next) {
  try {
    const { listado } = await obtenerListado(req);
    if (listado.total === 0) {
      throw new ErrorAplicacion(404, MENSAJE_SIN_COINCIDENCIAS_LISTADO);
    }
    const fecha = new Date();
    let pdf;
    try {
      pdf = await generadorListado.crearPdf(listado, fecha);
    } catch (err) {
      const errorPdf = new ErrorAplicacion(500, 'No se pudo generar el PDF');
      errorPdf.cause = err;
      throw errorPdf;
    }
    const nombreArchivo = `listado-libros-${fecha.toISOString().slice(0, 10)}.pdf`;
    // Con vista=1 el navegador lo muestra en el visor PDF del front en lugar de descargarlo
    const disposicion = req.query.vista === '1' ? 'inline' : 'attachment';
    res
      .set('Content-Type', 'application/pdf')
      .set('Content-Disposition', `${disposicion}; filename="${nombreArchivo}"`)
      .send(pdf);
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Preparar una vista legible del listado que abre el diálogo de impresión con el
 *   mismo listado (HULIS01 escenarios 6 y 7). Preparar la impresión no confirma que la
 *   impresora produjo hojas.
 * @param {Object} req - Petición HTTP. Query: los mismos filtros del listado.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function getListadoImpresion(req, res, next) {
  try {
    const { listado } = await obtenerListado(req);
    if (listado.total === 0) {
      throw new ErrorAplicacion(404, MENSAJE_SIN_COINCIDENCIAS_LISTADO);
    }
    // El nonce autoriza solo el script de impresión de esta página
    const nonce = crypto.randomBytes(16).toString('base64');
    let html;
    try {
      html = generadorListado.crearHtml(listado, new Date(), nonce);
    } catch (err) {
      const errorImpresion = new ErrorAplicacion(500, 'No se pudo preparar la impresión');
      errorImpresion.cause = err;
      throw errorImpresion;
    }
    res
      .set(
        'Content-Security-Policy',
        `default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}'`,
      )
      .type('html')
      .send(html);
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Consultar dónde está cada ejemplar físico de los libros que cumplen los criterios,
 *   sin inventar ubicaciones ni modificar registros (HUUBI01).
 * @param {Object} req - Petición HTTP. Query: titulo, autor, tema, clave, editorial (al menos
 *   uno), o buscar + criterio.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function getUbicaciones(req, res, next) {
  try {
    const filtros = await leerFiltros(req.query);
    const tieneCriterio = ['titulo', 'autor', 'tema', 'editorial', 'clave', 'texto'].some(
      (campo) => filtros[campo],
    );
    if (!tieneCriterio) {
      throw new ErrorAplicacion(
        400,
        'Capture al menos un criterio: Título, Autor, Tema, Clave de libro o Editorial',
        { campos: ['Título', 'Autor', 'Tema', 'Clave de libro', 'Editorial'] },
      );
    }
    const ejemplares = await consultarBd(
      () => consultaModelo.buscarUbicaciones(filtros),
      MENSAJE_ERROR_CATALOGO,
    );
    res.json(consultaVista.formatearUbicaciones(ejemplares, filtros));
  } catch (err) {
    next(err);
  }
}

export { getLibros, getListado, getListadoPdf, getListadoImpresion, getUbicaciones };
