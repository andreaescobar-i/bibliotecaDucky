/*----
 * Programa: ejemplarRutas.js
 * Objetivo: Definir las rutas de ejemplares físicos; todas exigen sesión y sus permisos
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import express from 'express';
import * as ejemplarControlador from '../controladores/ejemplarControlador.js';
import { requiereSesion, requierePermiso } from '../middlewares/autenticacion.js';

const router = express.Router();

router.use(requiereSesion);

router.get('/:clave', requierePermiso('CONSULTAR_LIBROS'), ejemplarControlador.getEjemplar);
router.get(
  '/:clave/etiqueta',
  requierePermiso('ETIQUETAR_EJEMPLARES'),
  ejemplarControlador.getEtiqueta,
);
// HULIB03 escenario 2: "Cambio de libros", "Clasificar ejemplares" y "Etiquetar ejemplares"
router.put(
  '/:clave',
  requierePermiso('CAMBIO_LIBROS'),
  requierePermiso('CLASIFICAR_EJEMPLARES'),
  requierePermiso('ETIQUETAR_EJEMPLARES'),
  ejemplarControlador.putEjemplar,
);
router.post('/:clave/baja', requierePermiso('BAJA_LIBROS'), ejemplarControlador.postBajaEjemplar);

export default router;
