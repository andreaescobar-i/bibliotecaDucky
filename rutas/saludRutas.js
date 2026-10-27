/*----
 * Programa: saludRutas.js
 * Objetivo: Definir la ruta pública de estado de la API
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import express from 'express';
import * as saludControlador from '../controladores/saludControlador.js';

const router = express.Router();

router.get('/', saludControlador.getSalud);

export default router;
