/*----
 * Programa: identidadInstitucionalServicio.js
 * Objetivo: Consultar la identidad y vigencia institucional de una persona en CIAA (alumnos) o
 *           Capital Humano (personal). Decide a qué sistema preguntar según el tipo de
 *           identificador; las consultas están en identidadInstitucionalModelo.js. Mientras los
 *           sistemas sean simulados, el alta puede registrar ahí a una persona que no existe.
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
async function obtenerIdentidad(tipo, identificador) {
  if (tipo === TIPOS_IDENTIFICADOR.MATRICULA) {
    return identidadInstitucionalModelo.obtenerAlumno(identificador);
  }
  if (tipo === TIPOS_IDENTIFICADOR.NOMINA) {
    return identidadInstitucionalModelo.obtenerEmpleado(identificador);
  }
  return null;
}

/**
 * Objetivo: Saber si la persona sigue vigente (alumno inscrito o empleado activo).
 * @param {string} tipo - 'MATRICULA' o 'NOMINA'.
 * @param {string} identificador - Identificador normalizado.
 * @returns {Promise<boolean>} true solo si existe y está vigente.
 */
async function consultarVigencia(tipo, identificador) {
  const identidad = await obtenerIdentidad(tipo, identificador);
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

/**
 * Objetivo: Registrar a una persona vigente en el sistema simulado que le corresponde (CIAA si
 *   es matrícula, Capital Humano si es nómina), para que el alta pueda crear su cuenta.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción del alta.
 * @param {Object} persona - Datos de la persona.
 * @param {string} persona.tipo - 'MATRICULA' o 'NOMINA'.
 * @param {string} persona.identificador - Identificador normalizado.
 * @param {{ primerNombre: string, primerApellido: string, segundoApellido: string|null }}
 *   persona.nombre - Nombre separado en partes.
 * @param {string} persona.correo - Correo institucional.
 * @param {string} persona.puesto - Puesto del empleado (solo nómina).
 * @returns {Promise<void>}
 */
async function registrarIdentidad(cliente, { tipo, identificador, nombre, correo, puesto }) {
  if (tipo === TIPOS_IDENTIFICADOR.MATRICULA) {
    await identidadInstitucionalModelo.registrarAlumno(cliente, {
      matricula: identificador,
      ...nombre,
      correo,
    });
    return;
  }
  await identidadInstitucionalModelo.registrarEmpleado(cliente, {
    nomina: identificador,
    ...nombre,
    correo,
    puesto,
  });
}

export { obtenerIdentidad, consultarVigencia, consultarVigencias, registrarIdentidad };
