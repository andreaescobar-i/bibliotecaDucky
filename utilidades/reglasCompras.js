/*----
 * Programa: reglasCompras.js
 * Objetivo: Reglas de solicitudes de compra y recepciones (HUCOM01): validación de partidas,
 *           estados del front y estado de recepción por partida
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import { limpiarTexto } from './validacion.js';
import { normalizarIsbn, esIsbnValido } from './reglasCatalogo.js';

// Estados con el mismo texto que muestra el front
const TEXTO_ESTADO_SOLICITUD = Object.freeze({
  POR_AUTORIZAR: 'Por autorizar',
  EN_TESORERIA: 'En Tesorería',
  AUTORIZADO: 'Autorizado',
  RECHAZADO: 'Rechazado',
  RECIBIDO_PARCIAL: 'Recibido parcialmente',
  RECIBIDO: 'Recibido',
  ENTREGADO_CATALOGO: 'Entregado al catálogo',
});

// Estados en los que se puede registrar una recepción (igual que receivePurchase del front)
const ESTADOS_RECEPCION = Object.freeze(['EN_TESORERIA', 'AUTORIZADO', 'RECIBIDO_PARCIAL']);

/**
 * Objetivo: Validar las partidas de una solicitud. Un campo con solo espacios es vacío y el ISBN
 *   puede faltar (HUCOM01 escenario 3).
 * @param {unknown} partidasCapturadas - Lista de partidas.
 * @returns {{ partidas: Object[], errores: { partida: number, campos: string[] }[] }} Partidas
 *   limpias numeradas desde 1 y errores por partida.
 */
function validarPartidas(partidasCapturadas) {
  const lista = Array.isArray(partidasCapturadas) ? partidasCapturadas : [];
  const errores = [];
  const partidas = lista.map((capturada, indice) => {
    const numero = indice + 1;
    const partida = {
      numero,
      titulo: limpiarTexto(capturada?.titulo),
      autor: limpiarTexto(capturada?.autor),
      editorial: limpiarTexto(capturada?.editorial),
      isbn: normalizarIsbn(capturada?.isbn) || null,
      cantidad: Number(capturada?.cantidad),
    };
    const campos = [];
    if (!partida.titulo) {
      campos.push('Título');
    }
    if (!partida.autor) {
      campos.push('Autor');
    }
    if (!partida.editorial) {
      campos.push('Editorial');
    }
    if (!Number.isSafeInteger(partida.cantidad) || partida.cantidad <= 0) {
      campos.push('Cantidad');
    }
    if (partida.isbn && !esIsbnValido(partida.isbn)) {
      campos.push('ISBN');
    }
    if (campos.length > 0) {
      errores.push({ partida: numero, campos });
    }
    return partida;
  });
  return { partidas, errores };
}

/**
 * Objetivo: Calcular el estado de recepción de una partida o de una solicitud completa.
 * @param {number} solicitado - Cantidad solicitada.
 * @param {number} recibido - Cantidad recibida acumulada.
 * @returns {string} "Pendiente", "Parcial" o "Completa".
 */
function calcularEstadoRecepcion(solicitado, recibido) {
  if (recibido === 0) {
    return 'Pendiente';
  }
  return recibido >= solicitado ? 'Completa' : 'Parcial';
}

/**
 * Objetivo: Validar una fecha capturada en formato AAAA-MM-DD.
 * @param {unknown} valor - Fecha capturada.
 * @returns {string|null} Fecha válida, o null.
 */
function leerFechaIso(valor) {
  const texto = limpiarTexto(valor);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    return null;
  }
  const fecha = new Date(`${texto}T00:00:00Z`);
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === texto
    ? texto
    : null;
}

export {
  TEXTO_ESTADO_SOLICITUD,
  ESTADOS_RECEPCION,
  validarPartidas,
  calcularEstadoRecepcion,
  leerFechaIso,
};
