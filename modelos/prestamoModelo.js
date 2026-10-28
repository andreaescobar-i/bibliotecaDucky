/*----
 * Programa: prestamoModelo.js
 * Objetivo: Consultas de préstamos. En el Sprint 1 solo se consultan los préstamos activos para
 *           impedir bajas de cuentas o ejemplares con libros prestados (HUGUS03, HULIB02)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import DbPool from '../config/db.js';

/**
 * Objetivo: Obtener los libros que una cuenta tiene prestados sin devolución registrada.
 * @param {string} usuarioId - Id de la cuenta.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<Object[]>} Folio, Clave de libro, Título, Clave de ejemplar y vencimiento.
 */
async function obtenerPrestamosActivosDeUsuario(usuarioId, cliente = DbPool) {
  const resultado = await cliente.query(
    `SELECT p.folio, l.clave_libro, l.titulo, e.codigo_ejemplar, p.fecha_vencimiento
     FROM prestamo p
     JOIN ejemplar e ON e.ejemplar_id = p.ejemplar_id
     JOIN libro l ON l.libro_id = e.libro_id
     WHERE p.usuario_id = $1 AND p.estado = 'ACTIVO'
     ORDER BY p.fecha_vencimiento`,
    [usuarioId],
  );
  return resultado.rows;
}

/**
 * Objetivo: Obtener los préstamos activos de cualquier ejemplar de una ficha.
 * @param {string} libroId - Id de la ficha.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<Object[]>} Folio, Clave de ejemplar y vencimiento de cada préstamo.
 */
async function obtenerPrestamosActivosDeLibro(libroId, cliente = DbPool) {
  const resultado = await cliente.query(
    `SELECT p.folio, e.codigo_ejemplar, p.fecha_vencimiento
     FROM prestamo p
     JOIN ejemplar e ON e.ejemplar_id = p.ejemplar_id
     WHERE e.libro_id = $1 AND p.estado = 'ACTIVO'
     ORDER BY e.codigo_ejemplar`,
    [libroId],
  );
  return resultado.rows;
}

export { obtenerPrestamosActivosDeUsuario, obtenerPrestamosActivosDeLibro };
