/*----
 * Programa: identificadores.js
 * Objetivo: Normalizar y validar identificadores institucionales (Matrícula de CIAA o Nómina de
 *           Capital Humano)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

const TIPOS_IDENTIFICADOR = Object.freeze({ MATRICULA: 'MATRICULA', NOMINA: 'NOMINA' });

// Mismos formatos que la restricción ck_usuario_formato_identificador de la BD
const FORMATOS_IDENTIFICADOR = Object.freeze({
  MATRICULA: /^A[0-9]{8}$/,
  NOMINA: /^N[0-9]{6}$/,
});

/**
 * Objetivo: Limpiar un identificador capturado. Se trata como texto para conservar los ceros
 *   iniciales.
 * @param {unknown} valor - Valor recibido en la petición.
 * @returns {string} Identificador sin espacios y en mayúsculas, o '' si no es texto.
 */
function normalizarIdentificador(valor) {
  return typeof valor === 'string' ? valor.trim().toUpperCase() : '';
}

/**
 * Objetivo: Convertir el Tipo de identificador capturado ("Matrícula", "nomina"...) a su clave.
 * @param {unknown} valor - Valor recibido en la petición.
 * @returns {string|null} 'MATRICULA', 'NOMINA', '' si no se capturó o null si no es válido.
 */
function normalizarTipo(valor) {
  if (valor === undefined || valor === null) {
    return '';
  }
  if (typeof valor !== 'string') {
    return null;
  }
  const texto = valor
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  if (texto === '') {
    return '';
  }
  return Object.values(TIPOS_IDENTIFICADOR).includes(texto) ? texto : null;
}

/**
 * Objetivo: Deducir el tipo a partir del formato, porque el front solo captura "Usuario".
 * @param {string} identificador - Identificador normalizado.
 * @returns {string|null} Tipo que corresponde al formato, o null si no coincide con ninguno.
 */
function inferirTipo(identificador) {
  const tipo = Object.keys(FORMATOS_IDENTIFICADOR).find((clave) =>
    FORMATOS_IDENTIFICADOR[clave].test(identificador),
  );
  return tipo || null;
}

/**
 * Objetivo: Comprobar que un identificador cumple el formato definido para su tipo.
 * @param {string} tipo - 'MATRICULA' o 'NOMINA'.
 * @param {string} identificador - Identificador normalizado.
 * @returns {boolean} true si el formato es válido.
 */
function esFormatoValido(tipo, identificador) {
  return Boolean(FORMATOS_IDENTIFICADOR[tipo]?.test(identificador));
}

export {
  TIPOS_IDENTIFICADOR,
  normalizarIdentificador,
  normalizarTipo,
  inferirTipo,
  esFormatoValido,
};
