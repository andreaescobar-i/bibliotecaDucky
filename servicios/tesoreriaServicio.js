/*----
 * Programa: tesoreriaServicio.js
 * Objetivo: Remitir solicitudes de compra a Tesorería (HUCOM01). Tesorería es un sistema
 *           externo; mientras no exista la integración, el envío se simula y siempre se
 *           confirma. Al integrarla solo cambia el transporte de este archivo.
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

/**
 * Objetivo: Transporte simulado: Tesorería confirma la recepción con un acuse.
 * @param {{ folio: string }} solicitud - Solicitud remitida.
 * @returns {Promise<{ confirmado: boolean, acuse: string }>} Confirmación de Tesorería.
 */
async function transporteSimulado(solicitud) {
  return { confirmado: true, acuse: `TES-${solicitud.folio}` };
}

let transporteActual = transporteSimulado; // Se reemplaza en pruebas para simular fallas

/**
 * Objetivo: Cambiar el transporte (pruebas automáticas o integración real).
 * @param {Function|null} transporte - Función async que recibe la solicitud; null restaura la
 *   simulación.
 * @returns {void}
 */
function establecerTransporte(transporte) {
  transporteActual = transporte ?? transporteSimulado;
}

/**
 * Objetivo: Enviar una solicitud a Tesorería y esperar su confirmación.
 * @param {Object} solicitud - folio, solicitante, partidas y costo estimado.
 * @returns {Promise<{ confirmado: boolean, acuse: string|null }>} Resultado del envío; si
 *   Tesorería no responde, confirmado es false.
 */
async function enviarSolicitud(solicitud) {
  try {
    const respuesta = await transporteActual(solicitud);
    return { confirmado: Boolean(respuesta?.confirmado), acuse: respuesta?.acuse ?? null };
  } catch {
    return { confirmado: false, acuse: null };
  }
}

export { establecerTransporte, enviarSolicitud };
