/*----
 * Programa: recepcionModelo.js
 * Objetivo: Consultas de recepciones de libros comprados, completas o parciales (HUCOM01)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import DbPool from '../config/db.js';

/**
 * Objetivo: Registrar una recepción con folio consecutivo (REC-0003...).
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {Object} datos - solicitudId, usuarioId (quien recibe), cantidad total y fecha
 *   (AAAA-MM-DD).
 * @returns {Promise<{ recepcion_id: string, folio: string }>} Id y folio de la recepción.
 */
async function crearRecepcion(cliente, { solicitudId, usuarioId, cantidad, fecha }) {
  const resultado = await cliente.query(
    `INSERT INTO recepcion (solicitud_adquisicion_id, recibio_usuario_id, folio, cantidad,
                            fecha_recepcion)
     VALUES ($1, $2, 'REC-' || LPAD(nextval('seq_folio_recepcion')::TEXT, 4, '0'), $3,
             $4::DATE)
     RETURNING recepcion_id, folio`,
    [solicitudId, usuarioId, cantidad, fecha],
  );
  return resultado.rows[0];
}

/**
 * Objetivo: Registrar cuántos libros de una partida llegaron en una recepción.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string} recepcionId - Id de la recepción.
 * @param {string} partidaId - Id de la partida.
 * @param {number} cantidad - Cantidad recibida (mayor que cero).
 * @returns {Promise<void>}
 */
async function agregarPartida(cliente, recepcionId, partidaId, cantidad) {
  await cliente.query(
    'INSERT INTO recepcion_partida (recepcion_id, partida_id, cantidad) VALUES ($1, $2, $3)',
    [recepcionId, partidaId, cantidad],
  );
}

/**
 * Objetivo: Listar las recepciones de una solicitud con las partidas de cada una.
 * @param {string} solicitudId - Id de la solicitud.
 * @returns {Promise<Object[]>} Recepciones de la más antigua a la más reciente.
 */
async function listarRecepcionesDeSolicitud(solicitudId) {
  const resultado = await DbPool.query(
    `SELECT r.folio, r.fecha_recepcion, r.cantidad, u.identificador AS recibio,
            COALESCE(
              JSON_AGG(JSON_BUILD_OBJECT('numero', sp.numero, 'titulo', sp.titulo,
                                         'cantidad', rp.cantidad)
                       ORDER BY sp.numero) FILTER (WHERE rp.partida_id IS NOT NULL),
              '[]'
            ) AS partidas
     FROM recepcion r
     JOIN usuario u ON u.usuario_id = r.recibio_usuario_id
     LEFT JOIN recepcion_partida rp ON rp.recepcion_id = r.recepcion_id
     LEFT JOIN solicitud_partida sp ON sp.partida_id = rp.partida_id
     WHERE r.solicitud_adquisicion_id = $1
     GROUP BY r.recepcion_id, u.usuario_id
     ORDER BY r.fecha_recepcion, r.folio`,
    [solicitudId],
  );
  return resultado.rows;
}

export { crearRecepcion, agregarPartida, listarRecepcionesDeSolicitud };
