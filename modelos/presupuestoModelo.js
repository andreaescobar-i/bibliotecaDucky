/*----
 * Programa: presupuestoModelo.js
 * Objetivo: Consultar el presupuesto mensual para compras y lo ya comprometido (HUCOM01)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import DbPool from '../config/db.js';

/**
 * Objetivo: Obtener el presupuesto autorizado de un mes y cuánto suman las solicitudes ya
 *   enviadas con cargo a él (excluye las que no se enviaron y las rechazadas).
 * @param {number} anio - Año (ej. 2026).
 * @param {number} mes - Mes de 1 a 12.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<Object|null>} Presupuesto con monto comprometido, o null si no está
 *   registrado ("Presupuesto no informado").
 */
async function obtenerPresupuestoDelPeriodo(anio, mes, cliente = DbPool) {
  const resultado = await cliente.query(
    `SELECT pm.presupuesto_mensual_id, pm.anio, pm.mes, pm.monto_autorizado_mxn,
            COALESCE(SUM(s.costo_total_estimado_mxn)
                     FILTER (WHERE s.estado NOT IN ('POR_AUTORIZAR', 'RECHAZADO')), 0)
              AS comprometido_mxn
     FROM presupuesto_mensual pm
     LEFT JOIN solicitud_adquisicion s ON s.presupuesto_mensual_id = pm.presupuesto_mensual_id
     WHERE pm.anio = $1 AND pm.mes = $2
     GROUP BY pm.presupuesto_mensual_id`,
    [anio, mes],
  );
  return resultado.rows[0] || null;
}

/**
 * Objetivo: Obtener un presupuesto por su id con lo comprometido.
 * @param {string} presupuestoId - Id del presupuesto.
 * @returns {Promise<Object|null>} Presupuesto, o null.
 */
async function obtenerPresupuestoPorId(presupuestoId) {
  const resultado = await DbPool.query(
    'SELECT anio, mes FROM presupuesto_mensual WHERE presupuesto_mensual_id = $1',
    [presupuestoId],
  );
  const periodo = resultado.rows[0];
  return periodo ? obtenerPresupuestoDelPeriodo(periodo.anio, periodo.mes) : null;
}

export { obtenerPresupuestoDelPeriodo, obtenerPresupuestoPorId };
