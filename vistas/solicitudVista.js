/*----
 * Programa: solicitudVista.js
 * Objetivo: Dar formato JSON a solicitudes de compra, partidas, recepciones y presupuesto
 *           (HUCOM01)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import { TEXTO_ESTADO_SOLICITUD, calcularEstadoRecepcion } from '../utilidades/reglasCompras.js';

const NOMBRES_MES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

/**
 * Objetivo: Formatear una partida con lo solicitado, recibido y pendiente.
 * @param {Object} partida - Partida de solicitudModelo (JSON).
 * @returns {Object} Partida lista para el front.
 */
function formatearPartida(partida) {
  return {
    numero: partida.numero,
    titulo: partida.titulo,
    autor: partida.autor,
    editorial: partida.editorial,
    isbn: partida.isbn,
    cantidadSolicitada: partida.cantidad_solicitada,
    cantidadRecibida: partida.cantidad_recibida,
    cantidadPendiente: partida.cantidad_solicitada - partida.cantidad_recibida,
    estadoRecepcion: calcularEstadoRecepcion(
      partida.cantidad_solicitada,
      partida.cantidad_recibida,
    ),
  };
}

/**
 * Objetivo: Formatear el presupuesto del periodo. Si no está registrado se indica "Presupuesto
 *   no informado", sin afirmar que hay fondos.
 * @param {Object|null} presupuesto - Registro de presupuestoModelo.
 * @returns {Object} Presupuesto del periodo.
 */
function formatearPresupuesto(presupuesto) {
  if (!presupuesto) {
    return { informado: false, mensaje: 'Presupuesto no informado' };
  }
  const autorizado = Number(presupuesto.monto_autorizado_mxn);
  const comprometido = Number(presupuesto.comprometido_mxn);
  return {
    informado: true,
    periodo: `${NOMBRES_MES[presupuesto.mes - 1]} ${presupuesto.anio}`,
    montoAutorizado: autorizado,
    comprometido,
    disponible: Math.round((autorizado - comprometido) * 100) / 100,
  };
}

/**
 * Objetivo: Formatear una solicitud. El detalle agrega recepciones, historial y presupuesto.
 * @param {Object} solicitud - Registro de solicitudModelo.
 * @param {Object} [extra] - recepciones, historial y presupuesto (solo en el detalle).
 * @returns {Object} Solicitud lista para el front.
 */
function formatearSolicitud(solicitud, extra = {}) {
  const partidas = solicitud.partidas.map(formatearPartida);
  const solicitado = partidas.reduce((total, partida) => total + partida.cantidadSolicitada, 0);
  const recibido = partidas.reduce((total, partida) => total + partida.cantidadRecibida, 0);
  const respuesta = {
    folio: solicitud.folio,
    titulo: solicitud.titulo_solicitado,
    solicitante: solicitud.area_solicitante,
    registradaPor: solicitud.solicitante_identificador,
    fechaSolicitud: solicitud.fecha_solicitud,
    destino: 'Tesorería',
    estado: TEXTO_ESTADO_SOLICITUD[solicitud.estado],
    cantidad: solicitud.cantidad,
    costoEstimado:
      solicitud.costo_total_estimado_mxn === null
        ? null
        : Number(solicitud.costo_total_estimado_mxn),
    prioridad: solicitud.prioridad,
    justificacion: solicitud.justificacion,
    envio: { confirmado: Boolean(solicitud.fecha_envio), fecha: solicitud.fecha_envio },
    fechaResolucion: solicitud.fecha_resolucion,
    fechaEntregaCatalogo: solicitud.fecha_entrega_catalogo,
    recibido,
    estadoRecepcion:
      partidas.length > 0 ? calcularEstadoRecepcion(solicitado, recibido) : 'Pendiente',
    partidas,
  };
  if (extra.recepciones) {
    respuesta.recepciones = extra.recepciones.map((recepcion) => ({
      folio: recepcion.folio,
      fecha: recepcion.fecha_recepcion,
      cantidad: recepcion.cantidad,
      recibio: recepcion.recibio,
      partidas: recepcion.partidas,
    }));
  }
  if (extra.historial) {
    respuesta.historial = extra.historial.map((evento) => ({
      fecha: evento.fecha_evento,
      accion: evento.accion,
      resultado: evento.resultado,
      operador: evento.operador,
      detalle: evento.detalle,
    }));
  }
  if (Object.hasOwn(extra, 'presupuesto')) {
    // HUCOM01 escenario 4: si no hay presupuesto registrado se indica, sin afirmar que hay fondos
    respuesta.presupuesto = formatearPresupuesto(extra.presupuesto);
  }
  return respuesta;
}

/**
 * Objetivo: Formatear una lista de solicitudes.
 * @param {Object[]} solicitudes - Registros de solicitudModelo.
 * @returns {Object} Total y solicitudes.
 */
function formatearLista(solicitudes) {
  return {
    total: solicitudes.length,
    solicitudes: solicitudes.map((solicitud) => formatearSolicitud(solicitud)),
  };
}

/**
 * Objetivo: Formatear la consulta de una solicitud con recepciones, historial y presupuesto.
 * @param {Object} solicitud - Registro de solicitudModelo.
 * @param {Object} extra - recepciones, historial y presupuesto.
 * @returns {Object} Solicitud.
 */
function formatearDetalle(solicitud, extra) {
  return { solicitud: formatearSolicitud(solicitud, extra) };
}

/**
 * Objetivo: Formatear el presupuesto del mes en curso.
 * @param {Object|null} presupuesto - Registro de presupuestoModelo, o null si no se informó.
 * @returns {Object} Presupuesto.
 */
function formatearPresupuestoActual(presupuesto) {
  return { presupuesto: formatearPresupuesto(presupuesto) };
}

/**
 * Objetivo: Formatear la respuesta de una operación sobre una solicitud.
 * @param {string} mensaje - Mensaje de la operación.
 * @param {Object} solicitud - Registro de solicitudModelo.
 * @param {Object} [extra] - folio?, presupuesto? (registro), folioRecepcion? y
 *   materialRecibido? (material que se entrega al encargado del catálogo).
 * @returns {Object} Mensaje, datos extra y solicitud.
 */
function formatearOperacion(mensaje, solicitud, extra = {}) {
  const { presupuesto, ...resto } = extra;
  return {
    mensaje,
    ...resto,
    ...(Object.hasOwn(extra, 'presupuesto') && {
      presupuesto: formatearPresupuesto(presupuesto),
    }),
    solicitud: formatearSolicitud(solicitud),
  };
}

export {
  formatearPartida,
  formatearPresupuesto,
  formatearSolicitud,
  formatearLista,
  formatearDetalle,
  formatearPresupuestoActual,
  formatearOperacion,
};
