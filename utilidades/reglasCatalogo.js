/*----
 * Programa: reglasCatalogo.js
 * Objetivo: Normalizar y validar los datos del catálogo (HULIB01-03): claves, ISBN, autores,
 *           ubicación (Librero y Fila) y motivos de baja
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import { limpiarTexto } from './validacion.js';

const FORMATO_CLAVE = /^[A-Z0-9][A-Z0-9.-]{1,31}$/; // Ej. LIT-863.64-GAR, LIT-863.64-GAR-E01
const FORMATO_ISBN = /^([0-9]{9}[0-9X]|[0-9]{13})$/; // ISBN-10 o ISBN-13 sin guiones
const SEPARADOR_AUTORES = ';'; // "Thomas H. Cormen; Charles E. Leiserson"
// "Estante LIT · A1", "LIT · A1", "LIT-A1" o "LIT/A1"
const FORMATO_UBICACION = /^(?:estante\s+)?([^\s·/-]+)\s*[·/-]\s*(\S+)$/i;
const TIPO_USO_POR_OMISION = 'Préstamo externo';

// Motivos del front (Perdido, Dañado, Obsoleto, Otro) más "Robado" de HULIB02
const MOTIVOS_BAJA = Object.freeze({
  PERDIDO: 'Perdido',
  ROBADO: 'Robado',
  DANADO: 'Dañado',
  OBSOLETO: 'Obsoleto',
  OTRO: 'Otro',
});

// Estados del ejemplar con el texto que muestra el front
const TEXTO_ESTADO_EJEMPLAR = Object.freeze({
  DISPONIBLE: 'Disponible',
  PRESTADO: 'Prestado',
  DADO_DE_BAJA: 'Dado de baja',
});

/**
 * Objetivo: Quitar acentos y pasar a mayúsculas para comparar textos capturados.
 * @param {string} texto - Texto a normalizar.
 * @returns {string} Texto sin acentos en mayúsculas.
 */
function normalizarComparacion(texto) {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toUpperCase();
}

/**
 * Objetivo: Normalizar una Clave de libro o de ejemplar.
 * @param {unknown} valor - Clave capturada.
 * @returns {string} Clave sin espacios y en mayúsculas.
 */
function normalizarClave(valor) {
  return limpiarTexto(valor).toUpperCase();
}

/**
 * Objetivo: Validar el formato de una clave.
 * @param {string} clave - Clave normalizada.
 * @returns {boolean} true si usa de 2 a 32 letras, números, puntos o guiones.
 */
function esClaveValida(clave) {
  return FORMATO_CLAVE.test(clave);
}

/**
 * Objetivo: Normalizar un ISBN quitando guiones y espacios.
 * @param {unknown} valor - ISBN capturado; "No registrado" equivale a vacío, como en el front.
 * @returns {string} ISBN sin separadores, o '' si no se capturó.
 */
function normalizarIsbn(valor) {
  const texto = limpiarTexto(valor);
  if (normalizarComparacion(texto) === 'NO REGISTRADO') {
    return '';
  }
  return texto.replace(/[\s-]/g, '').toUpperCase();
}

/**
 * Objetivo: Validar un ISBN-10 o ISBN-13.
 * @param {string} isbn - ISBN normalizado.
 * @returns {boolean} true si el formato es válido.
 */
function esIsbnValido(isbn) {
  return FORMATO_ISBN.test(isbn);
}

/**
 * Objetivo: Separar los autores capturados. El front envía un texto ("Gabriel García
 *   Márquez"); varios autores se separan con punto y coma. También se acepta una lista.
 * @param {unknown} valor - Texto o lista de autores.
 * @returns {{ primerNombre: string, primerApellido: string|null }[]} Autores en orden.
 */
function separarAutores(valor) {
  const nombres = Array.isArray(valor) ? valor : limpiarTexto(valor).split(SEPARADOR_AUTORES);
  return nombres
    .map((nombre) => limpiarTexto(nombre).replace(/\s+/g, ' '))
    .filter(Boolean)
    .map((nombre) => {
      const [primerNombre, ...apellidos] = nombre.split(' ');
      return { primerNombre, primerApellido: apellidos.join(' ') || null };
    });
}

/**
 * Objetivo: Unir los autores de una ficha en el texto que muestra el front.
 * @param {string[]} autores - Nombres completos en orden.
 * @returns {string} Autores separados por "; ".
 */
function unirAutores(autores) {
  return autores.join(`${SEPARADOR_AUTORES} `);
}

/**
 * Objetivo: Leer Librero y Fila, capturados por separado (historias) o juntos en "Ubicación"
 *   como lo hace el front ("Estante LIT · A1").
 * @param {Object} cuerpo - Cuerpo de la petición.
 * @returns {{ librero: string, fila: string }} Valores capturados ('' si faltan).
 */
function leerUbicacion(cuerpo) {
  let librero = limpiarTexto(cuerpo.librero).toUpperCase();
  let fila = limpiarTexto(cuerpo.fila).toUpperCase();
  const ubicacion = limpiarTexto(cuerpo.ubicacion);
  if (ubicacion && !librero && !fila) {
    const partes = ubicacion.match(FORMATO_UBICACION);
    if (partes) {
      librero = partes[1].toUpperCase();
      fila = partes[2].toUpperCase();
    }
  }
  return { librero, fila };
}

/**
 * Objetivo: Formar el texto de ubicación que muestra el front.
 * @param {string|null} librero - Librero registrado.
 * @param {string|null} fila - Fila registrada.
 * @returns {string|null} "Estante LIT · A1", o null si falta algún dato.
 */
function formatearUbicacion(librero, fila) {
  return librero && fila ? `Estante ${librero} · ${fila}` : null;
}

/**
 * Objetivo: Convertir el motivo de baja capturado ("Dañado", "dañado"...) a su clave.
 * @param {unknown} valor - Motivo capturado.
 * @returns {string|null} Clave del motivo (ej. 'DANADO'), o null si no existe.
 */
function normalizarMotivoBaja(valor) {
  const texto = normalizarComparacion(limpiarTexto(valor));
  return Object.hasOwn(MOTIVOS_BAJA, texto) ? texto : null;
}

export {
  MOTIVOS_BAJA,
  TEXTO_ESTADO_EJEMPLAR,
  TIPO_USO_POR_OMISION,
  normalizarComparacion,
  normalizarClave,
  esClaveValida,
  normalizarIsbn,
  esIsbnValido,
  separarAutores,
  unirAutores,
  leerUbicacion,
  formatearUbicacion,
  normalizarMotivoBaja,
};
