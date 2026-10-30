/*----
 * Programa: adeudoModelo.js
 * Objetivo: Consultas de adeudos (multas y reposiciones). En el Sprint 1 solo se consultan los
 *           pendientes para impedir la baja de cuentas con saldo en Tesorería (HUGUS03)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import DbPool from '../config/db.js';

/**
 * Objetivo: Obtener los adeudos de una cuenta que no tienen pago confirmado.
 * @param {string} usuarioId - Id de la cuenta.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<Object[]>} Folio del préstamo, concepto y monto de cada adeudo.
 */
async function obtenerAdeudosPendientesDeUsuario(usuarioId, cliente = DbPool) {
  const resultado = await cliente.query(
    `SELECT p.folio, a.tipo, a.concepto, a.monto_mxn
     FROM adeudo a
     JOIN prestamo p ON p.prestamo_id = a.prestamo_id
     WHERE p.usuario_id = $1 AND a.estado = 'PENDIENTE'
       AND NOT EXISTS (SELECT 1 FROM pago pg WHERE pg.adeudo_id = a.adeudo_id)
     ORDER BY a.fecha_emision`,
    [usuarioId],
  );
  return resultado.rows;
}

export { obtenerAdeudosPendientesDeUsuario };
