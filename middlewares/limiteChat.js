/*----
 * Programa: limiteChat.js
 * Objetivo: Limitar las preguntas al asistente Ducky por cuenta y por minuto, para controlar el
 *           gasto y frenar ráfagas
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 15 de Noviembre de 2026
 */

import { rateLimit } from 'express-rate-limit';
import ErrorAplicacion from '../utilidades/errorAplicacion.js';

const MS_POR_MINUTO = 60 * 1000;
const MENSAJE_LIMITE_CHAT =
  'Ha alcanzado el límite de consultas por minuto. Intente nuevamente en un momento.';

/**
 * Objetivo: Crear el limitador de preguntas al asistente. Debe ir después de requiereSesion.
 * @param {Object} opciones - Configuración del limitador.
 * @param {number} opciones.limite - Preguntas permitidas por cuenta en cada minuto.
 * @param {boolean} [opciones.omitir] - true para desactivarlo (pruebas automáticas).
 * @returns {Function} Middleware de Express.
 * Limitaciones: Los contadores viven en memoria; se reinician al reiniciar el servidor.
 */
function crearLimitadorChat({ limite, omitir = false }) {
  return rateLimit({
    windowMs: MS_POR_MINUTO,
    limit: limite,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    // Se cuenta por cuenta y no por IP: muchos usuarios comparten la red de la universidad
    keyGenerator: (req) => `chat|${req.usuario.usuario_id}`,
    skip: () => omitir,
    handler: (_req, _res, next) => {
      next(new ErrorAplicacion(429, MENSAJE_LIMITE_CHAT));
    },
  });
}

export { MENSAJE_LIMITE_CHAT, crearLimitadorChat };
