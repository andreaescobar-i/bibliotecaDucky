/*----
 * Programa: apiControlador.js
 * Objetivo: Presentar la API y las rutas que tiene disponibles
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import * as apiVista from '../vistas/apiVista.js';

const VERSION_API = '0.1.0';

// Se agrega una entrada por cada ruta nueva de las siguientes fases
const RUTAS_DISPONIBLES = [
  { metodo: 'GET', ruta: '/', descripcion: 'Información de la API y rutas disponibles' },
  { metodo: 'GET', ruta: '/salud', descripcion: 'Estado de la API y de la base de datos' },
];

/**
 * Objetivo: Responder con el nombre, la versión y las rutas disponibles de la API.
 * @param {Object} _req - Petición HTTP (no se usa).
 * @param {Object} res - Respuesta HTTP.
 * @returns {void}
 */
function getIndice(_req, res) {
  res.json(apiVista.formatearIndice(VERSION_API, RUTAS_DISPONIBLES));
}

export { getIndice };
