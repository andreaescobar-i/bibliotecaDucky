/*----
 * Programa: rolRutas.js
 * Objetivo: Definir la ruta de consulta de roles y su matriz de permisos (HUPRF01)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import express from 'express';
import * as perfilControlador from '../controladores/perfilControlador.js';
import { requiereSesion, requierePermiso } from '../middlewares/autenticacion.js';

const router = express.Router();

router.get(
  '/',
  requiereSesion,
  requierePermiso('CONSULTAR_PERFILES', 'No tiene permiso para esta operación de perfiles'),
  perfilControlador.getRoles,
);

export default router;
