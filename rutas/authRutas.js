/*----
 * Programa: authRutas.js
 * Objetivo: Definir las rutas de inicio de sesión, cierre de sesión y sesión actual
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import express from 'express';
import ENTORNO from '../config/entorno.js';
import * as authControlador from '../controladores/authControlador.js';
import { requiereSesion } from '../middlewares/autenticacion.js';
import { crearLimitadorLogin } from '../middlewares/limiteIntentos.js';

const router = express.Router();

const limitadorLogin = crearLimitadorLogin({
  limite: ENTORNO.LIMITE_INTENTOS_LOGIN,
  ventanaMinutos: ENTORNO.VENTANA_INTENTOS_MINUTOS,
  omitir: ENTORNO.ES_PRUEBA,
});

router.post('/login', limitadorLogin, authControlador.postLogin);
router.post('/logout', authControlador.postLogout);
router.get('/sesion', requiereSesion, authControlador.getSesion);
router.put('/contrasena', requiereSesion, authControlador.putContrasena);

export default router;
