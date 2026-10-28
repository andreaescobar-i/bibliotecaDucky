/*----
 * Programa: reglasCuentas.js
 * Objetivo: Reglas de cuentas y perfiles compartidas por HUGUS02-05 y HUPRF01: datos de
 *           contacto, compatibilidad de rol con la identidad y administradores con gestión
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import crypto from 'node:crypto';
import { TIPOS_IDENTIFICADOR } from './identificadores.js';

const ROL_ADMINISTRADOR = 'Administrador';
const ROL_ALUMNO = 'Alumno';
const DOMINIO_CORREO_INSTITUCIONAL = '@ducky.edu.mx';
const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORMATO_TELEFONO = /^[0-9]{10}$/;
const LARGO_MAXIMO_NOMBRE = 100; // Tamaño de las columnas de nombre y apellidos
const BYTES_CONTRASENA_TEMPORAL = 9; // 9 bytes = 12 caracteres en base64url

// Un "Administrador con permisos de gestión" tiene todos los permisos de cuentas y perfiles.
// El sistema nunca puede quedarse sin al menos uno activo.
const PERMISOS_GESTION = Object.freeze([
  'ALTA_CUENTAS',
  'BAJA_CUENTAS',
  'CAMBIO_CUENTAS',
  'CONSULTA_CUENTAS',
  'ASIGNAR_PERFILES',
  'CREAR_PERFILES',
  'CONSULTAR_PERFILES',
  'MODIFICAR_PERFILES',
  'DESACTIVAR_PERFILES',
]);

// Mensajes definidos en las historias de usuario
const MENSAJES_CUENTAS = Object.freeze({
  CAMPOS_OBLIGATORIOS: 'Complete los campos obligatorios señalados',
  CUENTA_NO_ENCONTRADA: 'Cuenta no encontrada',
  CUENTA_INACTIVA: 'Cuenta inactiva',
  IDENTIFICADOR_DUPLICADO: 'El identificador institucional ya está registrado',
  CORREO_DUPLICADO: 'El correo institucional ya está registrado',
  CORREO_INVALIDO: 'Correo duplicado o inválido',
  TELEFONO_INVALIDO: 'Teléfono inválido',
  NOMBRE_INVALIDO: 'Escriba el nombre con al menos un apellido',
  PERFIL_INVALIDO: 'Perfil inexistente o inactivo',
  IDENTIDAD_NO_VIGENTE: 'Identidad no vigente o no validada',
  IDENTIDAD_NO_VALIDADA: 'No fue posible validar la identidad; intente nuevamente',
  ROL_INCOMPATIBLE: 'Rol incompatible con identidad institucional',
  PROPIO_ACCESO: 'No puede modificar su propio acceso',
  PROPIA_BAJA: 'No puede dar de baja su propia cuenta',
  ULTIMO_ADMINISTRADOR: 'Debe conservar un Administrador activo con permisos de gestión',
  SIN_PERMISO_ASIGNAR: 'Sin permiso para asignar perfiles',
});

/**
 * Objetivo: Saber si un perfil da a sus cuentas la gestión completa de cuentas y perfiles.
 * @param {string} rolNombre - Rol del perfil.
 * @param {string[]} permisos - Claves de permisos del perfil.
 * @param {boolean} esActivo - Si el perfil (y su rol) están activos.
 * @returns {boolean} true si el perfil es de un Administrador con permisos de gestión.
 */
function esPerfilGestor(rolNombre, permisos, esActivo) {
  return (
    esActivo &&
    rolNombre === ROL_ADMINISTRADOR &&
    PERMISOS_GESTION.every((clave) => permisos.includes(clave))
  );
}

/**
 * Objetivo: Comprobar que el rol corresponde a la identidad: los alumnos de CIAA solo usan
 *   perfiles de rol Alumno y los demás roles requieren nómina de Capital Humano.
 * @param {string} tipoIdentificador - 'MATRICULA' o 'NOMINA'.
 * @param {string} rolNombre - Rol del perfil.
 * @returns {boolean} true si son compatibles.
 */
function esRolCompatible(tipoIdentificador, rolNombre) {
  const esAlumno = tipoIdentificador === TIPOS_IDENTIFICADOR.MATRICULA;
  return esAlumno === (rolNombre === ROL_ALUMNO);
}

/**
 * Objetivo: Validar formato y dominio institucional de un correo.
 * @param {string} correo - Correo normalizado en minúsculas.
 * @returns {boolean} true si es un correo @ducky.edu.mx bien formado.
 */
function esCorreoInstitucional(correo) {
  return FORMATO_CORREO.test(correo) && correo.endsWith(DOMINIO_CORREO_INSTITUCIONAL);
}

/**
 * Objetivo: Validar un teléfono de 10 dígitos.
 * @param {string} telefono - Teléfono capturado.
 * @returns {boolean} true si tiene exactamente 10 dígitos.
 */
function esTelefonoValido(telefono) {
  return FORMATO_TELEFONO.test(telefono);
}

/**
 * Objetivo: Separar un nombre completo capturado en el front en nombre y apellidos. Con tres o
 *   más palabras, las dos últimas son los apellidos; con dos, la segunda es el primer apellido.
 * @param {string} nombreCompleto - Nombre ya limpio de espacios repetidos.
 * @returns {{ primerNombre: string, primerApellido: string, segundoApellido: string|null }|null}
 *   Partes del nombre, o null si no trae al menos nombre y un apellido.
 */
function separarNombre(nombreCompleto) {
  const palabras = nombreCompleto.split(' ').filter(Boolean);
  if (palabras.length < 2 || palabras.some((palabra) => palabra.length > LARGO_MAXIMO_NOMBRE)) {
    return null;
  }
  if (palabras.length === 2) {
    return { primerNombre: palabras[0], primerApellido: palabras[1], segundoApellido: null };
  }
  return {
    primerNombre: palabras.slice(0, -2).join(' '),
    primerApellido: palabras.at(-2),
    segundoApellido: palabras.at(-1),
  };
}

/**
 * Objetivo: Generar una contraseña temporal aleatoria para una cuenta nueva.
 * @returns {string} Contraseña de 12 caracteres (letras, números, - y _).
 */
function generarContrasenaTemporal() {
  return crypto.randomBytes(BYTES_CONTRASENA_TEMPORAL).toString('base64url');
}

export {
  ROL_ADMINISTRADOR,
  ROL_ALUMNO,
  PERMISOS_GESTION,
  MENSAJES_CUENTAS,
  esPerfilGestor,
  esRolCompatible,
  esCorreoInstitucional,
  esTelefonoValido,
  separarNombre,
  generarContrasenaTemporal,
};
