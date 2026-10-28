/*----
 * Programa: indexRutas.js
 * Objetivo: Reunir en un solo router todas las rutas de la API bajo el prefijo /api
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import express from 'express';
import * as apiControlador from '../controladores/apiControlador.js';
import saludRutas from './saludRutas.js';
import authRutas from './authRutas.js';
import usuarioRutas from './usuarioRutas.js';
import perfilRutas from './perfilRutas.js';
import rolRutas from './rolRutas.js';
import libroRutas from './libroRutas.js';
import ejemplarRutas from './ejemplarRutas.js';
import catalogoRutas from './catalogoRutas.js';
import listadoRutas from './listadoRutas.js';
import ubicacionRutas from './ubicacionRutas.js';
import solicitudRutas from './solicitudRutas.js';

const router = express.Router();

router.get('/', apiControlador.getIndice);

// Las rutas de cada fase se agregan aquí
router.use('/salud', saludRutas);
router.use('/auth', authRutas);
router.use('/usuarios', usuarioRutas);
router.use('/perfiles', perfilRutas);
router.use('/roles', rolRutas);
router.use('/libros', libroRutas);
router.use('/ejemplares', ejemplarRutas);
router.use('/catalogos', catalogoRutas);
router.use('/listado-libros', listadoRutas);
router.use('/ubicaciones', ubicacionRutas);
router.use('/solicitudes', solicitudRutas);

export default router;
