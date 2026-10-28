/*----
 * Programa: ubicacionRutas.js
 * Objetivo: Definir la ruta de consulta de ubicación de ejemplares (HUUBI01)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import express from 'express';
import * as consultaControlador from '../controladores/consultaControlador.js';
import { requiereSesion, requierePermiso } from '../middlewares/autenticacion.js';

const router = express.Router();

router.get(
  '/',
  requiereSesion,
  requierePermiso('CONSULTAR_UBICACION'),
  consultaControlador.getUbicaciones,
);

export default router;
