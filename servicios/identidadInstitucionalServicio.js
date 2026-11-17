/*----
 * Programa: identidadInstitucionalServicio.js
 * Objetivo: Consultar la identidad y vigencia institucional de una persona en CIAA (alumnos) o
 *           Capital Humano (personal). Decide a qué sistema preguntar según el tipo de
 *           identificador; las consultas están en identidadInstitucionalModelo.js. Las fuentes
 *           institucionales solo se consultan desde la biblioteca.
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import * as identidadInstitucionalModelo from '../modelos/identidadInstitucionalModelo.js';
import { TIPOS_IDENTIFICADOR } from '../utilidades/identificadores.js';

/**
 * Objetivo: Obtener la identidad institucional registrada para un identificador.
 * @param {string} tipo - 'MATRICULA' o 'NOMINA'.
 * @param {string} identificador - Identificador normalizado.
 * @returns {Promise<Object|null>} Datos de la persona, o null si no existe en el sistema.
 */
async function obtenerIdentidad(tipo, identificador, cliente) {
  if (tipo === TIPOS_IDENTIFICADOR.MATRICULA) {
    return identidadInstitucionalModelo.obtenerAlumno(identificador, cliente);
  }
  if (tipo === TIPOS_IDENTIFICADOR.NOMINA) {
    return identidadInstitucionalModelo.obtenerEmpleado(identificador, cliente);
  }
  return null;
}

/**
 * Objetivo: Saber si la persona sigue vigente (alumno inscrito o empleado activo).
 * @param {string} tipo - 'MATRICULA' o 'NOMINA'.
 * @param {string} identificador - Identificador normalizado.
 * @returns {Promise<boolean>} true solo si existe y está vigente.
 */
async function consultarVigencia(tipo, identificador, cliente) {
  const identidad = await obtenerIdentidad(tipo, identificador, cliente);
  return Boolean(identidad?.vigente);
}

/**
 * Objetivo: Consultar en una sola vez la vigencia de varias cuentas (por ejemplo, todas las
 *   cuentas activas de un perfil).
 * @param {{ tipo_identificador: string, identificador: string }[]} cuentas - Cuentas a revisar.
 * @returns {Promise<Set<string>>} Identificadores que están vigentes.
 */
async function consultarVigencias(cuentas) {
  const identificadoresDeTipo = (tipo) =>
    cuentas
      .filter((cuenta) => cuenta.tipo_identificador === tipo)
      .map((cuenta) => cuenta.identificador);
  const vigentes = await identidadInstitucionalModelo.listarVigentes(
    identificadoresDeTipo(TIPOS_IDENTIFICADOR.MATRICULA),
    identificadoresDeTipo(TIPOS_IDENTIFICADOR.NOMINA),
  );
  return new Set(vigentes);
}

export { obtenerIdentidad, consultarVigencia, consultarVigencias };
