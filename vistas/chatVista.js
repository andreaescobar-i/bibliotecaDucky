/*----
 * Programa: chatVista.js
 * Objetivo: Dar formato a las respuestas JSON del asistente Ducky
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 15 de Noviembre de 2026
 */

const EMISORES = Object.freeze({ USUARIO: 'Usuario', ASISTENTE: 'Ducky' });

/**
 * Objetivo: Formatear un mensaje de la conversación.
 * @param {{ emisor: string, contenido: string, fecha: Date }} mensaje - Mensaje guardado.
 * @returns {Object} Emisor, texto y fecha.
 * Limitaciones: No incluye el modelo, los tokens ni las consultas internas del asistente.
 */
function formatearMensaje(mensaje) {
  return {
    emisor: EMISORES[mensaje.emisor] ?? mensaje.emisor,
    texto: mensaje.contenido,
    fecha: mensaje.fecha,
  };
}

/**
 * Objetivo: Formatear la respuesta del asistente a una pregunta.
 * @param {string} idSesion - Conversación a la que pertenece.
 * @param {{ contenido: string, fecha: Date }} respuesta - Respuesta guardada.
 * @returns {Object} Conversación y respuesta.
 */
function formatearRespuesta(idSesion, respuesta) {
  return {
    conversacion: Number(idSesion),
    respuesta: formatearMensaje({ ...respuesta, emisor: 'ASISTENTE' }),
  };
}

/**
 * Objetivo: Formatear la conversación abierta de la cuenta.
 * @param {{ id_sesion: string, fecha_inicio: Date }|null} sesion - Conversación abierta.
 * @param {Object[]} mensajes - Mensajes en orden cronológico.
 * @returns {Object} Conversación (null si no hay una abierta) y sus mensajes.
 */
function formatearConversacion(sesion, mensajes) {
  return {
    conversacion: sesion ? { id: Number(sesion.id_sesion), inicio: sesion.fecha_inicio } : null,
    mensajes: mensajes.map(formatearMensaje),
  };
}

/**
 * Objetivo: Formatear la confirmación de "Reiniciar".
 * @returns {Object} Mensaje de confirmación.
 */
function formatearReinicio() {
  return { mensaje: 'Conversación reiniciada' };
}

export { formatearRespuesta, formatearConversacion, formatearReinicio };
