/*----
 * Programa: chatRutas.js
 * Objetivo: Definir las rutas del asistente Ducky (ChatBot, Sprint 3)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 15 de Noviembre de 2026
 */

import express from 'express';
import ENTORNO from '../config/entorno.js';
import * as chatControlador from '../controladores/chatControlador.js';
import { requiereSesion } from '../middlewares/autenticacion.js';
import { crearLimitadorChat } from '../middlewares/limiteChat.js';

const router = express.Router();

const limitadorChat = crearLimitadorChat({
  limite: ENTORNO.CHAT.LIMITE_POR_MINUTO,
  omitir: ENTORNO.ES_PRUEBA,
});

// Todos los roles usan el asistente; lo que puede consultar depende de los permisos del perfil
router.use(requiereSesion);

router.get('/conversacion', chatControlador.getConversacion);
router.post('/mensajes', limitadorChat, chatControlador.postMensaje);
router.post('/reinicio', chatControlador.postReinicio);

export default router;
