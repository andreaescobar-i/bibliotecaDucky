/*----
 * Programa: listadoRutas.js
 * Objetivo: Definir las rutas del listado de libros, su PDF y su vista de impresión (HULIS01).
 *           Se comprueba sesión y permiso antes de recuperar datos, incluso con acceso directo.
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import express from 'express';
import * as consultaControlador from '../controladores/consultaControlador.js';
import { requiereSesion, requierePermiso } from '../middlewares/autenticacion.js';

const router = express.Router();

router.use(
  requiereSesion,
  requierePermiso('CONSULTAR_LISTADO', 'No tiene permiso para consultar el listado de libros'),
);

router.get('/', consultaControlador.getListado);
router.get('/pdf', consultaControlador.getListadoPdf);
router.get('/impresion', consultaControlador.getListadoImpresion);

export default router;
