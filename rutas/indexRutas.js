/*----
 * Programa: indexRutas.js
 * Objetivo: Reunir en un solo router todas las rutas de la API bajo el prefijo /api
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import express from 'express';
import * as apiControlador from '../controladores/apiControlador.js';
import saludRutas from './saludRutas.js';

const router = express.Router();

router.get('/', apiControlador.getIndice);

// Las rutas de cada fase (auth, usuarios, perfiles, libros, ejemplares, solicitudes) se agregan aquí
router.use('/salud', saludRutas);

export default router;
