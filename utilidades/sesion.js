/*----
 * Programa: sesion.js
 * Objetivo: Crear y verificar el token de sesión (JWT) que viaja en una cookie httpOnly
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import jwt from 'jsonwebtoken';
import ENTORNO from '../config/entorno.js';

const NOMBRE_COOKIE_SESION = 'sigb_sesion';
const ALGORITMO_FIRMA = 'HS256';
const MS_POR_HORA = 60 * 60 * 1000;

/**
 * Objetivo: Firmar un token con el id de la cuenta y su versión de sesión. No guarda la
 *   contraseña ni los permisos: estos se vuelven a leer de la BD en cada petición.
 * @param {{ usuario_id: string, version_sesion: number }} usuario - Cuenta autenticada.
 * @returns {string} Token JWT.
 */
function crearTokenSesion(usuario) {
  return jwt.sign(
    { sub: String(usuario.usuario_id), ver: usuario.version_sesion },
    ENTORNO.JWT_SECRETO,
    {
      algorithm: ALGORITMO_FIRMA,
      expiresIn: `${ENTORNO.DURACION_SESION_HORAS}h`,
    },
  );
}

/**
 * Objetivo: Validar firma y vigencia de un token de sesión.
 * @param {string} token - Token recibido en la cookie.
 * @returns {{ sub: string, ver: number }|null} Contenido del token, o null si no es válido.
 */
function verificarTokenSesion(token) {
  try {
    return jwt.verify(token, ENTORNO.JWT_SECRETO, { algorithms: [ALGORITMO_FIRMA] });
  } catch {
    return null;
  }
}

/**
 * Objetivo: Opciones de la cookie de sesión: inaccesible desde JavaScript del navegador y solo
 *   por HTTPS en producción.
 * @returns {Object} Opciones para res.cookie() y res.clearCookie().
 */
function opcionesCookieSesion() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: ENTORNO.ES_PRODUCCION,
    path: '/',
    maxAge: ENTORNO.DURACION_SESION_HORAS * MS_POR_HORA,
  };
}

/**
 * Objetivo: Borrar la cookie de sesión del navegador.
 * @param {Object} res - Respuesta HTTP.
 * @returns {void}
 */
function borrarCookieSesion(res) {
  // Express 5 ignora maxAge al borrar; se usan las mismas opciones para que coincida la cookie
  res.clearCookie(NOMBRE_COOKIE_SESION, opcionesCookieSesion());
}

export {
  NOMBRE_COOKIE_SESION,
  crearTokenSesion,
  verificarTokenSesion,
  opcionesCookieSesion,
  borrarCookieSesion,
};
