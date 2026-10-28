/*----
 * Programa: catalogoRutas.js
 * Objetivo: Definir la ruta de listas del catálogo (temas, tipos de uso, editoriales, motivos)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import express from 'express';
import * as catalogoControlador from '../controladores/catalogoControlador.js';
import { requiereSesion, requierePermiso } from '../middlewares/autenticacion.js';

const router = express.Router();

router.get(
  '/',
  requiereSesion,
  requierePermiso('CONSULTAR_LIBROS'),
  catalogoControlador.getCatalogos,
);

export default router;
