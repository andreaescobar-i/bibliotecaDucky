/*----
 * Programa: solicitudModelo.js
 * Objetivo: Consultas de solicitudes de compra y sus partidas (HUCOM01)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import DbPool from '../config/db.js';

// Solicitud con su solicitante, presupuesto del periodo y partidas en orden
const SELECCION_SOLICITUD = `
  SELECT s.solicitud_adquisicion_id, s.folio, s.titulo_solicitado, s.autor_solicitado,
         s.area_solicitante, s.cantidad, s.costo_total_estimado_mxn, s.prioridad,
         s.justificacion, s.estado, s.destino, s.fecha_solicitud, s.fecha_envio,
         s.fecha_resolucion, s.fecha_entrega_catalogo, s.presupuesto_mensual_id,
         u.identificador AS solicitante_identificador,
         CONCAT_WS(' ', u.primer_nombre, u.primer_apellido) AS solicitante_nombre,
         COALESCE(
           (SELECT JSON_AGG(JSON_BUILD_OBJECT(
                     'partida_id', sp.partida_id, 'numero', sp.numero, 'titulo', sp.titulo,
                     'autor', sp.autor, 'editorial', sp.editorial, 'isbn', sp.isbn,
                     'cantidad_solicitada', sp.cantidad_solicitada,
                     'cantidad_recibida', sp.cantidad_recibida)
                   ORDER BY sp.numero)
            FROM solicitud_partida sp
            WHERE sp.solicitud_adquisicion_id = s.solicitud_adquisicion_id),
           '[]'
         ) AS partidas
  FROM solicitud_adquisicion s
  JOIN usuario u ON u.usuario_id = s.solicitante_usuario_id`;

/**
 * Objetivo: Listar solicitudes, opcionalmente de un solo estado, de la más reciente a la más
 *   antigua.
 * @param {string|null} [estado] - Estado (ej. 'EN_TESORERIA'); null para todos.
 * @returns {Promise<Object[]>} Solicitudes con partidas.
 */
async function listarSolicitudes(estado = null) {
  const resultado = await DbPool.query(
    `${SELECCION_SOLICITUD}
     WHERE $1::TEXT IS NULL OR s.estado = $1
     ORDER BY s.fecha_solicitud DESC, s.folio DESC`,
    [estado],
  );
  return resultado.rows;
}

/**
 * Objetivo: Obtener una solicitud por folio sin importar mayúsculas (como findPurchase del
 *   front).
 * @param {string} folio - Folio capturado.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<Object|null>} Solicitud, o null si el folio no existe.
 */
async function obtenerSolicitudPorFolio(folio, cliente = DbPool) {
  const resultado = await cliente.query(`${SELECCION_SOLICITUD} WHERE UPPER(s.folio) = UPPER($1)`, [
    folio,
  ]);
  return resultado.rows[0] || null;
}

/**
 * Objetivo: Registrar una solicitud "Por autorizar" con folio consecutivo (SOL-2500...).
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {Object} datos - titulo, autor, area, cantidad, costo, prioridad, justificacion y
 *   solicitanteId.
 * @returns {Promise<{ solicitud_adquisicion_id: string, folio: string }>} Id y folio.
 */
async function crearSolicitud(cliente, datos) {
  const resultado = await cliente.query(
    `INSERT INTO solicitud_adquisicion
       (solicitante_usuario_id, folio, titulo_solicitado, autor_solicitado, area_solicitante,
        cantidad, costo_total_estimado_mxn, prioridad, justificacion, estado)
     VALUES ($1, 'SOL-' || nextval('seq_folio_solicitud'), $2, $3, $4, $5, $6, $7, $8,
             'POR_AUTORIZAR')
     RETURNING solicitud_adquisicion_id, folio`,
    [
      datos.solicitanteId,
      datos.titulo,
      datos.autor,
      datos.area,
      datos.cantidad,
      datos.costo,
      datos.prioridad,
      datos.justificacion,
    ],
  );
  return resultado.rows[0];
}

/**
 * Objetivo: Reemplazar las partidas de una solicitud que todavía no se envía, y actualizar el
 *   título y la cantidad totales.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string} solicitudId - Id de la solicitud.
 * @param {Object[]} partidas - Partidas validadas (numero, titulo, autor, editorial, isbn,
 *   cantidad).
 * @param {{ titulo: string, cantidad: number }} totales - Resumen de la solicitud.
 * @returns {Promise<void>}
 */
async function reemplazarPartidas(cliente, solicitudId, partidas, totales) {
  await cliente.query('DELETE FROM solicitud_partida WHERE solicitud_adquisicion_id = $1', [
    solicitudId,
  ]);
  for (const partida of partidas) {
    await cliente.query(
      `INSERT INTO solicitud_partida
         (solicitud_adquisicion_id, numero, titulo, autor, editorial, isbn, cantidad_solicitada)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        solicitudId,
        partida.numero,
        partida.titulo,
        partida.autor,
        partida.editorial,
        partida.isbn,
        partida.cantidad,
      ],
    );
  }
  await cliente.query(
    `UPDATE solicitud_adquisicion SET titulo_solicitado = $2, cantidad = $3
     WHERE solicitud_adquisicion_id = $1`,
    [solicitudId, totales.titulo, totales.cantidad],
  );
}

/**
 * Objetivo: Marcar la solicitud como enviada a Tesorería, con fecha y presupuesto del periodo.
 *   Solo se llama cuando Tesorería confirmó el envío.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string} solicitudId - Id de la solicitud.
 * @param {Date} fechaEnvio - Fecha y hora del envío.
 * @param {string|null} presupuestoId - Presupuesto del mes, si está registrado.
 * @returns {Promise<void>}
 */
async function marcarEnviada(cliente, solicitudId, fechaEnvio, presupuestoId) {
  await cliente.query(
    `UPDATE solicitud_adquisicion
     SET estado = 'EN_TESORERIA', fecha_envio = $2, presupuesto_mensual_id = $3,
         destino = 'TESORERIA'
     WHERE solicitud_adquisicion_id = $1`,
    [solicitudId, fechaEnvio, presupuestoId],
  );
}

/**
 * Objetivo: Cambiar el estado de una solicitud y, si corresponde, guardar la fecha del cambio.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string} solicitudId - Id de la solicitud.
 * @param {string} estado - Estado nuevo.
 * @param {Object} [fechas] - fechaResolucion o fechaEntregaCatalogo.
 * @returns {Promise<void>}
 */
async function actualizarEstado(cliente, solicitudId, estado, fechas = {}) {
  await cliente.query(
    `UPDATE solicitud_adquisicion
     SET estado = $2,
         fecha_resolucion = COALESCE($3, fecha_resolucion),
         fecha_entrega_catalogo = COALESCE($4, fecha_entrega_catalogo)
     WHERE solicitud_adquisicion_id = $1`,
    [solicitudId, estado, fechas.fechaResolucion ?? null, fechas.fechaEntregaCatalogo ?? null],
  );
}

/**
 * Objetivo: Sumar lo recibido a una partida. La BD impide superar lo solicitado.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string} partidaId - Id de la partida.
 * @param {number} cantidad - Cantidad recibida en esta entrega.
 * @returns {Promise<void>}
 */
async function sumarRecibido(cliente, partidaId, cantidad) {
  await cliente.query(
    `UPDATE solicitud_partida SET cantidad_recibida = cantidad_recibida + $2
     WHERE partida_id = $1`,
    [partidaId, cantidad],
  );
}

/**
 * Objetivo: Bloquear una solicitud hasta terminar la transacción.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string} solicitudId - Id de la solicitud.
 * @returns {Promise<void>}
 */
async function bloquearSolicitud(cliente, solicitudId) {
  await cliente.query(
    'SELECT 1 FROM solicitud_adquisicion WHERE solicitud_adquisicion_id = $1 FOR NO KEY UPDATE',
    [solicitudId],
  );
}

export {
  listarSolicitudes,
  obtenerSolicitudPorFolio,
  crearSolicitud,
  reemplazarPartidas,
  marcarEnviada,
  actualizarEstado,
  sumarRecibido,
  bloquearSolicitud,
};
