/*----
 * Programa: saludControlador.js
 * Objetivo: Informar si la API está en línea y si tiene conexión con la base de datos
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import * as saludModelo from '../modelos/saludModelo.js';
import * as saludVista from '../vistas/saludVista.js';

/**
 * Objetivo: Responder 200 si la BD contesta y 503 si no hay conexión.
 * @param {Object} _req - Petición HTTP (no se usa).
 * @param {Object} res - Respuesta HTTP.
 * @returns {Promise<void>}
 * Limitaciones: No usa next(err) porque la falta de conexión es una respuesta esperada.
 */
async function getSalud(_req, res) {
  try {
    const estadoBd = await saludModelo.obtenerEstadoBaseDatos();
    res.json(saludVista.formatearSalud(true, estadoBd));
  } catch {
    res.status(503).json(saludVista.formatearSalud(false));
  }
}

export { getSalud };
