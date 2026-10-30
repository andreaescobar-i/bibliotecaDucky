/*----
 * Programa: validacion.js
 * Objetivo: Funciones comunes para limpiar los datos recibidos en las peticiones
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

/**
 * Objetivo: Obtener un texto sin espacios al inicio y al final. Un campo con solo espacios se
 *   considera vacío, como piden las historias de usuario.
 * @param {unknown} valor - Valor recibido.
 * @returns {string} Texto limpio, o '' si no es texto.
 */
function limpiarTexto(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

/**
 * Objetivo: Saber si una propiedad llegó en el cuerpo de la petición (aunque venga vacía).
 * @param {Object} cuerpo - Cuerpo de la petición.
 * @param {string} nombre - Nombre de la propiedad.
 * @returns {boolean} true si la propiedad existe.
 */
function tieneCampo(cuerpo, nombre) {
  return Object.hasOwn(cuerpo ?? {}, nombre);
}

/**
 * Objetivo: Escapar los comodines de LIKE (% y _) para buscar el texto tal como se capturó.
 * @param {string} texto - Texto del usuario.
 * @returns {string} Patrón "%texto%" seguro para ILIKE.
 */
function crearPatronContiene(texto) {
  return `%${texto.replace(/[\\%_]/g, (caracter) => `\\${caracter}`)}%`;
}

export { limpiarTexto, tieneCampo, crearPatronContiene };
