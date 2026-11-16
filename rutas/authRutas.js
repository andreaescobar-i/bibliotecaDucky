/*----
 * Programa: authRutas.js
 * Objetivo: Definir las rutas de inicio de sesión, cierre de sesión y sesión actual
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import express from 'express';
import { solicitarAcceso, recuperarAcceso } from '../servicios/recuperacionServicio.js';
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
const limitarRecuperacion = crearLimitadorLogin({
  limite: 5,
  ventanaMinutos: 15,
  omitir: ENTORNO.ES_PRUEBA,
});
router.post('/recuperacion', limitarRecuperacion, async (req, res) => {
  await solicitarAcceso(req.body?.identificador);
  res.status(202).json({
    mensaje: 'Si la cuenta está habilitada, recibirás un enlace en tu correo institucional.',
  });
});
router.post('/recuperacion/confirmar', limitarRecuperacion, async (req, res) => {
  await recuperarAcceso(req.body?.token, req.body?.contrasena);
  res.sendStatus(204);
});
router.post('/logout', authControlador.postLogout);
router.get('/sesion', requiereSesion, authControlador.getSesion);
router.put('/contrasena', requiereSesion, authControlador.putContrasena);

export default router;
