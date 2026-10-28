/*----
 * Programa: limiteIntentos.js
 * Objetivo: Limitar los intentos de inicio de sesión por IP para frenar ataques que prueban
 *           contraseñas una tras otra
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import ErrorAplicacion from '../utilidades/errorAplicacion.js';
import { normalizarIdentificador } from '../utilidades/identificadores.js';

const MS_POR_MINUTO = 60 * 1000;
const MENSAJE_DEMASIADOS_INTENTOS =
  'Demasiados intentos de inicio de sesión; espere unos minutos e intente nuevamente';

/**
 * Objetivo: Formar la llave del contador con la IP y el identificador intentado. Así, muchos
 *   alumnos detrás de la misma red de la universidad no se bloquean entre sí.
 * @param {Object} req - Petición HTTP (el cuerpo JSON ya fue leído).
 * @returns {string} Llave del contador.
 */
function obtenerLlaveIntento(req) {
  return `${ipKeyGenerator(req.ip)}|${normalizarIdentificador(req.body?.identificador)}`;
}

/**
 * Objetivo: Crear el limitador de intentos fallidos de inicio de sesión.
 * @param {Object} opciones - Configuración del limitador.
 * @param {number} opciones.limite - Intentos fallidos permitidos por IP e identificador dentro
 *   de la ventana.
 * @param {number} opciones.ventanaMinutos - Duración de la ventana en minutos.
 * @param {boolean} [opciones.omitir] - true para desactivarlo (pruebas automáticas).
 * @returns {Function} Middleware de Express.
 * Limitaciones: Los contadores viven en memoria; se reinician al reiniciar el servidor.
 */
function crearLimitadorLogin({ limite, ventanaMinutos, omitir = false }) {
  return rateLimit({
    windowMs: ventanaMinutos * MS_POR_MINUTO,
    limit: limite,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    keyGenerator: obtenerLlaveIntento,
    skipSuccessfulRequests: true, // Solo cuentan los intentos que fallan
    skip: () => omitir,
    handler: (_req, _res, next) => {
      next(new ErrorAplicacion(429, MENSAJE_DEMASIADOS_INTENTOS));
    },
  });
}

export { MENSAJE_DEMASIADOS_INTENTOS, crearLimitadorLogin };
