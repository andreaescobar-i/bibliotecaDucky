/*----
 * Programa: ayudantes.mjs
 * Objetivo: Funciones compartidas por las pruebas de integración: iniciar sesión, hacer
 *           peticiones con la cookie de sesión y leer la bitácora. Importar después de fijar
 *           process.env.NODE_ENV = 'test'.
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../../app.js';
import DbPool from '../../config/db.js';

const CONTRASENA_PRUEBA = 'Ducky2026';

/**
 * Objetivo: Iniciar sesión y devolver un cliente que envía la cookie en cada petición.
 * @param {string} identificador - Matrícula o nómina.
 * @param {string} [contrasena] - Contraseña; por omisión la de las cuentas de prueba.
 * @returns {Promise<{ get: Function, post: Function, put: Function }>} Cliente HTTP con sesión.
 */
async function iniciarSesion(identificador, contrasena = CONTRASENA_PRUEBA) {
  const respuesta = await request(app).post('/api/auth/login').send({ identificador, contrasena });
  assert.equal(respuesta.status, 200, `No se pudo iniciar sesión con ${identificador}`);
  const cookie = respuesta.headers['set-cookie'][0].split(';')[0];
  return {
    get: (ruta) => request(app).get(ruta).set('Cookie', cookie),
    post: (ruta, cuerpo = {}) => request(app).post(ruta).set('Cookie', cookie).send(cuerpo),
    put: (ruta, cuerpo = {}) => request(app).put(ruta).set('Cookie', cookie).send(cuerpo),
  };
}

/**
 * Objetivo: Obtener el último evento de la bitácora de una acción y una clave de registro.
 * @param {string} accion - Acción registrada.
 * @param {string} clave - Clave del registro objetivo.
 * @returns {Promise<Object|undefined>} Evento más reciente.
 */
async function obtenerUltimoEvento(accion, clave) {
  const resultado = await DbPool.query(
    `SELECT accion, resultado, detalle, ip, fecha_evento
     FROM registro_auditoria
     WHERE accion = $1 AND clave_registro_objetivo = $2
     ORDER BY registro_auditoria_id DESC
     LIMIT 1`,
    [accion, clave],
  );
  return resultado.rows[0];
}

/**
 * Objetivo: Asignar un perfil a una cuenta directamente en la BD, para preparar escenarios.
 * @param {string} identificador - Cuenta.
 * @param {string} clavePerfil - Perfil a asignar.
 * @returns {Promise<void>}
 */
async function asignarPerfilDirecto(identificador, clavePerfil) {
  await DbPool.query(
    `UPDATE usuario SET perfil_id = (SELECT perfil_id FROM perfil WHERE clave = $2)
     WHERE identificador = $1`,
    [identificador, clavePerfil],
  );
}

export { app, DbPool, CONTRASENA_PRUEBA, iniciarSesion, obtenerUltimoEvento, asignarPerfilDirecto };
