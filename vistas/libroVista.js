/*----
 * Programa: libroVista.js
 * Objetivo: Dar formato JSON a fichas bibliográficas, ejemplares, etiquetas e historial
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import {
  MOTIVOS_BAJA,
  TEXTO_ESTADO_EJEMPLAR,
  formatearUbicacion,
  unirAutores,
} from '../utilidades/reglasCatalogo.js';

const INSTITUCION = 'Biblioteca Universidad Ducky';

/**
 * Objetivo: Formatear una ficha con su disponibilidad.
 * @param {Object} libro - Registro de libroModelo.
 * @returns {Object} Ficha lista para el front.
 */
function formatearFicha(libro) {
  return {
    clave: libro.clave_libro,
    titulo: libro.titulo,
    autor: unirAutores(libro.autores),
    autores: libro.autores,
    tema: libro.tema,
    editorial: libro.editorial,
    isbn: libro.isbn,
    edicion: libro.edicion,
    anio: libro.anio,
    descripcion: libro.descripcion,
    precioCompraUsd: libro.precio_compra === null ? null : Number(libro.precio_compra),
    estado: libro.estado === 'ACTIVO' ? 'Activo' : 'Dado de baja',
    baja: libro.fecha_baja ? { fecha: libro.fecha_baja, motivo: libro.motivo_baja } : null,
    ejemplares: {
      total: libro.ejemplares_total,
      disponibles: libro.ejemplares_disponibles,
      prestados: libro.ejemplares_prestados,
      dadosDeBaja: libro.ejemplares_baja,
    },
  };
}

/**
 * Objetivo: Formatear un ejemplar con su clasificación, ubicación y estado.
 * @param {Object} ejemplar - Registro de ejemplarModelo.
 * @returns {Object} Ejemplar listo para el front.
 */
function formatearEjemplar(ejemplar) {
  // HULIB04 escenario 4: se señala el dato faltante sin inventarlo ni tomarlo de otra copia
  const datosFaltantes = [
    ['Librero', ejemplar.librero],
    ['Fila', ejemplar.fila],
  ]
    .filter(([, valor]) => !valor)
    .map(([nombre]) => nombre);
  return {
    clave: ejemplar.codigo_ejemplar,
    claveLibro: ejemplar.clave_libro,
    titulo: ejemplar.titulo,
    clasificacion: ejemplar.clave_clasificacion,
    librero: ejemplar.librero,
    fila: ejemplar.fila,
    ubicacion: formatearUbicacion(ejemplar.librero, ejemplar.fila),
    ubicacionFaltante: datosFaltantes,
    avisoUbicacion:
      datosFaltantes.length > 0 ? 'Ubicación incompleta: consulte al Bibliotecario' : null,
    tipoUso: ejemplar.tipo_uso,
    permitePrestamo: ejemplar.permite_prestamo,
    estado: TEXTO_ESTADO_EJEMPLAR[ejemplar.estado],
    fechaAlta: ejemplar.fecha_alta,
    baja: ejemplar.fecha_baja
      ? {
          fecha: ejemplar.fecha_baja,
          motivo: MOTIVOS_BAJA[ejemplar.motivo_baja],
          detalle: ejemplar.detalle_baja,
          operador: ejemplar.baja_por_identificador,
        }
      : null,
  };
}

/**
 * Objetivo: Formatear la etiqueta de un ejemplar: Clave de ejemplar, Título y Código de
 *   clasificación (HULIB01), más los datos que imprime el front.
 * @param {Object} ejemplar - Registro de ejemplarModelo.
 * @returns {Object} Datos de la etiqueta.
 */
function formatearEtiqueta(ejemplar) {
  return {
    claveEjemplar: ejemplar.codigo_ejemplar,
    titulo: ejemplar.titulo,
    clasificacion: ejemplar.clave_clasificacion,
    autor: unirAutores(ejemplar.autores),
    tipoUso: ejemplar.tipo_uso,
    ubicacion: formatearUbicacion(ejemplar.librero, ejemplar.fila),
    institucion: INSTITUCION,
  };
}

/**
 * Objetivo: Formatear el historial de movimientos de los ejemplares de una ficha.
 * @param {Object[]} movimientos - Registros de ejemplarModelo.listarHistorialDeLibro().
 * @returns {Object[]} Movimientos con fecha, tipo, ejemplar, operador y valores.
 */
function formatearHistorial(movimientos) {
  return movimientos.map((movimiento) => ({
    fecha: movimiento.fecha_movimiento,
    tipo: movimiento.tipo,
    claveEjemplar: movimiento.codigo_ejemplar,
    operador: movimiento.operador,
    motivo: MOTIVOS_BAJA[movimiento.motivo] ?? movimiento.motivo,
    observaciones: movimiento.observaciones,
    anterior: movimiento.valores_anteriores,
    nuevo: movimiento.valores_nuevos,
  }));
}

/**
 * Objetivo: Formatear la consulta de una ficha con todos sus ejemplares.
 * @param {Object} libro - Registro de libroModelo.
 * @param {Object[]} ejemplares - Registros de ejemplarModelo.listarEjemplaresDeLibro().
 * @returns {Object} Ficha, aviso de disponibilidad y ejemplares.
 */
function formatearDetalle(libro, ejemplares) {
  return {
    libro: formatearFicha(libro),
    // HULIB04 escenario 3: un prestado o dado de baja nunca cuenta como disponible
    mensajeEjemplares:
      ejemplares.length === 0
        ? 'Sin ejemplares registrados'
        : `Ejemplares disponibles: ${libro.ejemplares_disponibles}`,
    ejemplares: ejemplares.map(formatearEjemplar),
  };
}

/**
 * Objetivo: Formatear las etiquetas de los ejemplares que siguen en circulación.
 * @param {Object[]} ejemplares - Registros de ejemplarModelo.listarEjemplaresDeLibro().
 * @returns {Object} Etiquetas para imprimir.
 */
function formatearEtiquetasDeLibro(ejemplares) {
  return {
    etiquetas: ejemplares
      .filter((ejemplar) => ejemplar.estado !== 'DADO_DE_BAJA')
      .map(formatearEtiqueta),
  };
}

/**
 * Objetivo: Formatear el historial de una ficha con la clave y el título del libro.
 * @param {Object} libro - Registro de libroModelo.
 * @param {Object[]} movimientos - Registros de ejemplarModelo.listarHistorialDeLibro().
 * @returns {Object} Libro y movimientos.
 */
function formatearHistorialDeLibro(libro, movimientos) {
  return {
    libro: { clave: libro.clave_libro, titulo: libro.titulo },
    movimientos: formatearHistorial(movimientos),
  };
}

/**
 * Objetivo: Formatear la respuesta del alta de una ficha o de ejemplares nuevos.
 * @param {string} mensaje - Mensaje de la operación.
 * @param {Object} libro - Registro de libroModelo.
 * @param {Object[]} ejemplares - Ejemplares registrados en la operación.
 * @returns {Object} Ficha, ejemplares y sus etiquetas.
 */
function formatearAlta(mensaje, libro, ejemplares) {
  return {
    mensaje,
    libro: formatearFicha(libro),
    ejemplares: ejemplares.map(formatearEjemplar),
    etiquetas: ejemplares.map(formatearEtiqueta),
  };
}

/**
 * Objetivo: Formatear la consulta de un ejemplar.
 * @param {Object} ejemplar - Registro de ejemplarModelo.
 * @returns {Object} Ejemplar.
 */
function formatearConsultaEjemplar(ejemplar) {
  return { ejemplar: formatearEjemplar(ejemplar) };
}

/**
 * Objetivo: Formatear la etiqueta de un ejemplar para imprimirla.
 * @param {Object} ejemplar - Registro de ejemplarModelo.
 * @returns {Object} Etiqueta.
 */
function formatearConsultaEtiqueta(ejemplar) {
  return { etiqueta: formatearEtiqueta(ejemplar) };
}

/**
 * Objetivo: Formatear la respuesta de un cambio o una baja de fichas y ejemplares.
 * @param {string} mensaje - Mensaje de la operación.
 * @param {Object} datos - Registros a incluir: libro?, ejemplar?, etiqueta? (registro del
 *   ejemplar del que se genera la etiqueta) y etiquetasActualizadas? (número).
 * @returns {Object} Mensaje con los datos formateados.
 */
function formatearOperacion(mensaje, { libro, ejemplar, etiqueta, etiquetasActualizadas } = {}) {
  return {
    mensaje,
    ...(etiquetasActualizadas !== undefined && { etiquetasActualizadas }),
    ...(ejemplar && { ejemplar: formatearEjemplar(ejemplar) }),
    ...(etiqueta && { etiqueta: formatearEtiqueta(etiqueta) }),
    ...(libro && { libro: formatearFicha(libro) }),
  };
}

export {
  formatearFicha,
  formatearEjemplar,
  formatearEtiqueta,
  formatearHistorial,
  formatearDetalle,
  formatearEtiquetasDeLibro,
  formatearHistorialDeLibro,
  formatearAlta,
  formatearConsultaEjemplar,
  formatearConsultaEtiqueta,
  formatearOperacion,
};
