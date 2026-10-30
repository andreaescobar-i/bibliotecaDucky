/*----
 * Programa: errorAplicacion.js
 * Objetivo: Definir el error controlado que los controladores envían al middleware de errores
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

/**
 * Objetivo: Representar un error esperado (validación, permisos, regla de negocio) con su
 *   código HTTP y el mensaje que verá el usuario, tal como lo piden las historias de usuario.
 * Limitaciones: Los errores que no sean ErrorAplicacion se tratan como errores internos (500).
 */
class ErrorAplicacion extends Error {
  /**
   * @param {number} estadoHttp - Código HTTP de la respuesta (400, 401, 403, 404, 409...).
   * @param {string} mensaje - Mensaje para el usuario final.
   * @param {Object} [detalle] - Datos extra, por ejemplo { campos: ['Título'] }.
   */
  constructor(estadoHttp, mensaje, detalle = undefined) {
    super(mensaje);
    this.name = 'ErrorAplicacion';
    this.estadoHttp = estadoHttp;
    this.detalle = detalle;
  }
}

export default ErrorAplicacion;
