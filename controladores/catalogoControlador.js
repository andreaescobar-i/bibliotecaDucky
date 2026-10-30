/*----
 * Programa: catalogoControlador.js
 * Objetivo: Entregar las listas del catálogo que usan los formularios del front: temas, tipos
 *           de uso, editoriales y motivos de baja
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import * as catalogoModelo from '../modelos/catalogoModelo.js';
import * as catalogoVista from '../vistas/catalogoVista.js';
import { MOTIVOS_BAJA } from '../utilidades/reglasCatalogo.js';

/**
 * Objetivo: Responder con los catálogos registrados.
 * @param {Object} _req - Petición HTTP (no se usa).
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function getCatalogos(_req, res, next) {
  try {
    const catalogos = await catalogoModelo.listarCatalogos();
    res.json(catalogoVista.formatearCatalogos(catalogos, Object.values(MOTIVOS_BAJA)));
  } catch (err) {
    next(err);
  }
}

export { getCatalogos };
