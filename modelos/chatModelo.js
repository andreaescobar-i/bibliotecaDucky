/*----
 * Programa: chatModelo.js
 * Objetivo: Guardar y leer el historial de conversaciones del asistente Ducky (sesion_chat y
 *           mensaje_chat)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 15 de Noviembre de 2026
 */

import DbPool from '../config/db.js';

const CANAL_WEB = 'WEB';

/**
 * Objetivo: Obtener la conversación abierta de una cuenta.
 * @param {string} usuarioId - Id de la cuenta.
 * @returns {Promise<Object|null>} id_sesion y fecha_inicio, o null si no tiene una abierta.
 */
async function obtenerSesionAbierta(usuarioId) {
  const resultado = await DbPool.query(
    `SELECT id_sesion, fecha_inicio
     FROM sesion_chat
     WHERE id_usuario = $1 AND estatus = 'ABIERTA'
     ORDER BY id_sesion DESC
     LIMIT 1`,
    [usuarioId],
  );
  return resultado.rows[0] || null;
}

/**
 * Objetivo: Abrir una conversación nueva para una cuenta.
 * @param {string} usuarioId - Id de la cuenta.
 * @returns {Promise<Object>} id_sesion y fecha_inicio de la conversación creada.
 */
async function crearSesion(usuarioId) {
  const resultado = await DbPool.query(
    `INSERT INTO sesion_chat (id_usuario, canal, estatus)
     VALUES ($1, $2, 'ABIERTA')
     RETURNING id_sesion, fecha_inicio`,
    [usuarioId, CANAL_WEB],
  );
  return resultado.rows[0];
}

/**
 * Objetivo: Cerrar todas las conversaciones abiertas de una cuenta ("Reiniciar"). No borra
 *   nada: los mensajes se conservan.
 * @param {string} usuarioId - Id de la cuenta.
 * @returns {Promise<number>} Número de conversaciones cerradas.
 */
async function cerrarSesionesAbiertas(usuarioId) {
  const resultado = await DbPool.query(
    `UPDATE sesion_chat
     SET estatus = 'CERRADA',
         -- La fecha de fin siempre es posterior a la de inicio
         fecha_fin = GREATEST(clock_timestamp(), fecha_inicio + INTERVAL '1 millisecond')
     WHERE id_usuario = $1 AND estatus = 'ABIERTA'`,
    [usuarioId],
  );
  return resultado.rowCount;
}

/**
 * Objetivo: Guardar un mensaje de la conversación.
 * @param {Object} mensaje - Datos del mensaje.
 * @param {string} mensaje.idSesion - Conversación a la que pertenece.
 * @param {string} mensaje.emisor - 'USUARIO' o 'ASISTENTE'.
 * @param {string} mensaje.contenido - Texto del mensaje.
 * @param {string} [mensaje.resultado] - 'EXITO', 'SIN_INFORMACION', 'ERROR' o 'LIMITE'.
 * @param {string} [mensaje.modelo] - Modelo que respondió.
 * @param {number} [mensaje.tokensEntrada] - Tokens enviados al modelo.
 * @param {number} [mensaje.tokensSalida] - Tokens recibidos del modelo.
 * @param {Object[]} [mensaje.herramientas] - Consultas que hizo el asistente para responder.
 * @returns {Promise<Object>} id_mensaje y fecha del mensaje guardado.
 */
async function registrarMensaje({
  idSesion,
  emisor,
  contenido,
  resultado = 'EXITO',
  modelo = null,
  tokensEntrada = null,
  tokensSalida = null,
  herramientas = null,
}) {
  const guardado = await DbPool.query(
    `INSERT INTO mensaje_chat
       (id_sesion, emisor, contenido, resultado, modelo, tokens_entrada, tokens_salida,
        herramientas)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id_mensaje, "timestamp" AS fecha`,
    [
      idSesion,
      emisor,
      contenido,
      resultado,
      modelo,
      tokensEntrada,
      tokensSalida,
      herramientas ? JSON.stringify(herramientas) : null,
    ],
  );
  return guardado.rows[0];
}

/**
 * Objetivo: Obtener los últimos mensajes de una conversación, del más antiguo al más reciente.
 * @param {string} idSesion - Conversación.
 * @param {number} limite - Máximo de mensajes.
 * @returns {Promise<Object[]>} emisor, contenido, resultado y fecha de cada mensaje.
 */
async function obtenerUltimosMensajes(idSesion, limite) {
  const resultado = await DbPool.query(
    `SELECT emisor, contenido, resultado, fecha
     FROM (
       SELECT id_mensaje, emisor, contenido, resultado, "timestamp" AS fecha
       FROM mensaje_chat
       WHERE id_sesion = $1
       ORDER BY id_mensaje DESC
       LIMIT $2
     ) AS recientes
     ORDER BY id_mensaje`,
    [idSesion, limite],
  );
  return resultado.rows;
}

/**
 * Objetivo: Borrar las conversaciones que ya cumplieron su duración, abiertas o cerradas. Sus
 *   mensajes se borran con ellas (ON DELETE CASCADE).
 * @param {number} horas - Horas que vive una conversación desde que se inicia.
 * @returns {Promise<number>} Número de conversaciones borradas.
 */
async function eliminarSesionesVencidas(horas) {
  const resultado = await DbPool.query(
    `DELETE FROM sesion_chat WHERE fecha_inicio < now() - ($1::NUMERIC * INTERVAL '1 hour')`,
    [horas],
  );
  return resultado.rowCount;
}

export {
  obtenerSesionAbierta,
  crearSesion,
  cerrarSesionesAbiertas,
  registrarMensaje,
  obtenerUltimosMensajes,
  eliminarSesionesVencidas,
};
