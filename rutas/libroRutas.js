/*----
 * Programa: libroRutas.js
 * Objetivo: Definir las rutas de fichas bibliográficas; todas exigen sesión y sus permisos
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import express from 'express';
import * as libroControlador from '../controladores/libroControlador.js';
import * as consultaControlador from '../controladores/consultaControlador.js';
import { requiereSesion, requierePermiso } from '../middlewares/autenticacion.js';

// HULIB01 exige "Alta de libros", "Clasificar ejemplares" y "Etiquetar ejemplares"
const PERMISOS_ALTA = [
  requierePermiso('ALTA_LIBROS'),
  requierePermiso('CLASIFICAR_EJEMPLARES'),
  requierePermiso('ETIQUETAR_EJEMPLARES'),
];

const router = express.Router();

router.use(requiereSesion);

// Búsqueda del catálogo con disponibilidad (HULIB04)
router.get('/', requierePermiso('CONSULTAR_LIBROS'), consultaControlador.getLibros);
router.post('/', ...PERMISOS_ALTA, libroControlador.postLibro);
router.get('/:clave', requierePermiso('CONSULTAR_LIBROS'), libroControlador.getLibro);
router.put('/:clave', requierePermiso('CAMBIO_LIBROS'), libroControlador.putLibro);
router.post('/:clave/ejemplares', ...PERMISOS_ALTA, libroControlador.postEjemplar);
router.get(
  '/:clave/etiquetas',
  requierePermiso('ETIQUETAR_EJEMPLARES'),
  libroControlador.getEtiquetasDeLibro,
);
router.get('/:clave/historial', requierePermiso('CAMBIO_LIBROS'), libroControlador.getHistorial);
router.post('/:clave/baja', requierePermiso('BAJA_LIBROS'), libroControlador.postBajaLibro);

export default router;
