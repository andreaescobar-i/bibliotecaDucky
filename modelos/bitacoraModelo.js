/*----
 * Programa: bitacoraModelo.js
 * Objetivo: Registrar en la bitácora (registro_auditoria) los eventos de seguridad y operación,
 *           para la trazabilidad que exige ISO 9001:2015
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import DbPool from '../config/db.js';

const RESULTADOS = Object.freeze({ EXITO: 'EXITO', RECHAZO: 'RECHAZO', ERROR: 'ERROR' });

/**
 * Objetivo: Guardar un evento en la bitácora.
 * @param {Object} evento - Datos del evento.
 * @param {string|null} [evento.actorUsuarioId] - Cuenta que realizó la acción (null si se
 *   desconoce, por ejemplo un intento con un identificador no registrado).
 * @param {string} evento.accion - Acción en MAYÚSCULAS, por ejemplo 'INICIO_SESION'.
 * @param {string} evento.entidad - Tabla o recurso afectado, por ejemplo 'usuario'.
 * @param {string|null} [evento.claveRegistro] - Clave del registro afectado (identificador,
 *   Clave de libro, folio...).
 * @param {Object|null} [evento.detalle] - Datos adicionales. Nunca debe incluir contraseñas.
 * @param {string|null} [evento.ip] - IP desde la que se hizo la petición.
 * @param {string} [evento.resultado] - 'EXITO', 'RECHAZO' o 'ERROR'.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<void>}
 */
async function registrarEvento(
  {
    actorUsuarioId = null,
    accion,
    entidad,
    claveRegistro = null,
    detalle = null,
    ip = null,
    resultado = RESULTADOS.EXITO,
  },
  cliente = DbPool,
) {
  await cliente.query(
    `INSERT INTO registro_auditoria
       (actor_usuario_id, accion, entidad_objetivo, clave_registro_objetivo, detalle, ip,
        resultado)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [actorUsuarioId, accion, entidad, claveRegistro, detalle, ip, resultado],
  );
}

/**
 * Objetivo: Listar los eventos de un registro (por ejemplo, el historial de una solicitud).
 * @param {string} entidad - Entidad objetivo, por ejemplo 'solicitud'.
 * @param {string} claveRegistro - Clave del registro (folio, Clave de libro...).
 * @returns {Promise<Object[]>} Eventos del más antiguo al más reciente.
 */
async function listarEventosDeRegistro(entidad, claveRegistro) {
  const resultado = await DbPool.query(
    `SELECT ra.fecha_evento, ra.accion, ra.resultado, ra.detalle, u.identificador AS operador
     FROM registro_auditoria ra
     LEFT JOIN usuario u ON u.usuario_id = ra.actor_usuario_id
     WHERE ra.entidad_objetivo = $1 AND ra.clave_registro_objetivo = $2
     ORDER BY ra.fecha_evento, ra.registro_auditoria_id`,
    [entidad, claveRegistro],
  );
  return resultado.rows;
}

export { RESULTADOS, registrarEvento, listarEventosDeRegistro };
