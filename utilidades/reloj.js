/*----
 * Programa: reloj.js
 * Objetivo: Dar la fecha y hora actuales desde un solo lugar, para que las reglas que dependen
 *           del periodo (presupuesto mensual, fechas de recepción) se puedan probar
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

// Se exporta como objeto para que las pruebas puedan fijar la fecha
const reloj = {
  /**
   * Objetivo: Obtener la fecha y hora actuales.
   * @returns {Date} Momento actual.
   */
  ahora: () => new Date(),
};

/**
 * Objetivo: Formar la fecha local (zona del servidor) en formato AAAA-MM-DD.
 * @param {Date} fecha - Fecha a formatear.
 * @returns {string} Fecha como "2026-10-27".
 */
function formatearFechaLocal(fecha) {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

export { reloj, formatearFechaLocal };
