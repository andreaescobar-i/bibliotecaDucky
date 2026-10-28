/*----
 * Programa: identidadInstitucionalModelo.js
 * Objetivo: Consultas a los sistemas institucionales simulados en el esquema "externo" de la BD:
 *           CIAA (alumnos) y Capital Humano (personal)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import DbPool from '../config/db.js';

/**
 * Objetivo: Obtener un alumno registrado en CIAA.
 * @param {string} matricula - Matrícula normalizada.
 * @returns {Promise<Object|null>} Datos del alumno, o null si no existe.
 */
async function obtenerAlumno(matricula) {
  const resultado = await DbPool.query(
    `SELECT matricula AS identificador, primer_nombre, primer_apellido, segundo_apellido,
            correo_institucional, vigente
     FROM externo.ciaa_alumno
     WHERE matricula = $1`,
    [matricula],
  );
  return resultado.rows[0] || null;
}

/**
 * Objetivo: Obtener un empleado registrado en Capital Humano.
 * @param {string} nomina - Número de nómina normalizado.
 * @returns {Promise<Object|null>} Datos del empleado, o null si no existe.
 */
async function obtenerEmpleado(nomina) {
  const resultado = await DbPool.query(
    `SELECT nomina AS identificador, primer_nombre, primer_apellido, segundo_apellido,
            correo_institucional, vigente
     FROM externo.capital_humano_empleado
     WHERE nomina = $1`,
    [nomina],
  );
  return resultado.rows[0] || null;
}

/**
 * Objetivo: Filtrar, en una sola consulta, las matrículas y nóminas que siguen vigentes.
 * @param {string[]} matriculas - Matrículas a revisar.
 * @param {string[]} nominas - Nóminas a revisar.
 * @returns {Promise<string[]>} Identificadores vigentes.
 */
async function listarVigentes(matriculas, nominas) {
  const resultado = await DbPool.query(
    `SELECT matricula AS identificador FROM externo.ciaa_alumno
     WHERE vigente AND matricula = ANY($1::TEXT[])
     UNION ALL
     SELECT nomina FROM externo.capital_humano_empleado
     WHERE vigente AND nomina = ANY($2::TEXT[])`,
    [matriculas, nominas],
  );
  return resultado.rows.map((fila) => fila.identificador);
}

/**
 * Objetivo: Registrar un alumno vigente en CIAA.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción del alta.
 * @param {Object} alumno - matricula, primerNombre, primerApellido, segundoApellido, correo.
 * @returns {Promise<void>}
 */
async function registrarAlumno(cliente, alumno) {
  await cliente.query(
    `INSERT INTO externo.ciaa_alumno
       (matricula, primer_nombre, primer_apellido, segundo_apellido, correo_institucional, vigente)
     VALUES ($1, $2, $3, $4, $5, TRUE)`,
    [
      alumno.matricula,
      alumno.primerNombre,
      alumno.primerApellido,
      alumno.segundoApellido,
      alumno.correo,
    ],
  );
}

/**
 * Objetivo: Registrar un empleado vigente en Capital Humano.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción del alta.
 * @param {Object} empleado - nomina, primerNombre, primerApellido, segundoApellido, correo,
 *   puesto.
 * @returns {Promise<void>}
 */
async function registrarEmpleado(cliente, empleado) {
  await cliente.query(
    `INSERT INTO externo.capital_humano_empleado
       (nomina, primer_nombre, primer_apellido, segundo_apellido, correo_institucional, puesto,
        vigente)
     VALUES ($1, $2, $3, $4, $5, $6, TRUE)`,
    [
      empleado.nomina,
      empleado.primerNombre,
      empleado.primerApellido,
      empleado.segundoApellido,
      empleado.correo,
      empleado.puesto,
    ],
  );
}

export { obtenerAlumno, obtenerEmpleado, listarVigentes, registrarAlumno, registrarEmpleado };
