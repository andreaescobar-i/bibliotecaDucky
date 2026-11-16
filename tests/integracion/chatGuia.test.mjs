/*----
 * Programa: chatGuia.test.mjs
 * Objetivo: Comprobar contra la API y PostgreSQL reales que la guía del asistente Ducky dice la
 *           verdad: lo que afirma que cada cuenta puede o no puede hacer coincide con lo que la
 *           API le permite. Las peticiones de sondeo no modifican datos.
 *           Requiere npm run db:reset. Uso: npm run test:bd
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 15 de Noviembre de 2026
 */

import { describe, test, before, after } from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';
const { DbPool, iniciarSesion } = await import('./ayudantes.mjs');
const { ACCIONES, clasificarAcciones } = await import('../../servicios/chat/guiaApp.js');

const SIN_PERMISO = 403;

// Una petición por acción de la guía. Van vacías o sobre registros inexistentes: si la cuenta
// tiene permiso la API responde 200, 400 o 404; si no lo tiene, 403. Ninguna cambia datos.
const SONDAS = Object.freeze({
  CONSULTAR_CATALOGO: ['get', '/api/libros'],
  CONSULTAR_UBICACION: ['get', '/api/ubicaciones?titulo=Pedro'],
  CONSULTAR_LISTADO: ['get', '/api/listado-libros'],
  ALTA_LIBROS: ['post', '/api/libros'],
  EDITAR_LIBROS: ['put', '/api/libros/XXX-000'],
  CLASIFICAR_EJEMPLARES: ['put', '/api/ejemplares/XXX-000-E01'],
  ETIQUETAS: ['get', '/api/libros/XXX-000/etiquetas'],
  BAJA_LIBROS: ['post', '/api/libros/XXX-000/baja'],
  CONSULTAR_CUENTAS: ['get', '/api/usuarios'],
  ALTA_CUENTAS: ['post', '/api/usuarios'],
  EDITAR_CUENTAS: ['put', '/api/usuarios/A00000000'],
  ASIGNAR_PERFILES: ['put', '/api/usuarios/A00000000/perfil'],
  BAJA_CUENTAS: ['post', '/api/usuarios/A00000000/baja'],
  CONSULTAR_PERFILES: ['get', '/api/perfiles'],
  CREAR_PERFILES: ['post', '/api/perfiles'],
  MODIFICAR_PERFILES: ['put', '/api/perfiles/PRF-XXX'],
  DESACTIVAR_PERFILES: ['post', '/api/perfiles/PRF-XXX/desactivar'],
  CONSULTAR_COMPRAS: ['get', '/api/solicitudes'],
  GESTIONAR_COMPRAS: ['post', '/api/solicitudes'],
  REGISTRAR_RECEPCIONES: ['post', '/api/solicitudes/SOL-0000/recepciones'],
});

// Una cuenta de prueba por cada perfil activo
const CUENTAS = [
  ['A01234567', 'Alumno', 'Alumno'],
  ['N000305', 'Maestro', 'Maestro'],
  ['N000402', 'Colaborador', 'Colaborador'],
  ['N000104', 'Bibliotecario', 'Bibliotecario de ventanilla'],
  ['N000105', 'Bibliotecario', 'Bibliotecario de consulta'],
  ['N000001', 'Administrador', 'Administrador general'],
  ['N000210', 'Comprador de libros', 'Comprador de libros'],
];

const CONTEO_DATOS = `SELECT
  (SELECT COUNT(*) FROM usuario) || '/' || (SELECT COUNT(*) FROM libro) || '/' ||
  (SELECT COUNT(*) FROM ejemplar) || '/' || (SELECT COUNT(*) FROM perfil) || '/' ||
  (SELECT COUNT(*) FROM solicitud_adquisicion) || '/' || (SELECT COUNT(*) FROM recepcion) AS conteo`;

let conteoInicial;

before(async () => {
  conteoInicial = (await DbPool.query(CONTEO_DATOS)).rows[0].conteo;
});

after(() => DbPool.end());

describe('Guía del asistente frente a la API real', () => {
  test('cada acción de la guía tiene su petición de sondeo', () => {
    assert.deepEqual(Object.keys(SONDAS).sort(), ACCIONES.map((accion) => accion.clave).sort());
  });

  for (const [identificador, rol, perfil] of CUENTAS) {
    test(`${perfil}: lo que la guía dice que puede hacer es lo que la API le permite`, async () => {
      const sesion = await iniciarSesion(identificador);
      const cuenta = (await sesion.get('/api/auth/sesion')).body.usuario;
      assert.equal(cuenta.rol, rol);
      assert.equal(cuenta.perfil.nombre, perfil);

      const segunGuia = clasificarAcciones(cuenta.permisos).permitidas.map(
        (accion) => accion.clave,
      );
      const segunApi = [];
      for (const accion of ACCIONES) {
        const [metodo, ruta] = SONDAS[accion.clave];
        const respuesta = await sesion[metodo](ruta);
        assert.notEqual(respuesta.status, 500, `${metodo.toUpperCase()} ${ruta} falló`);
        if (respuesta.status !== SIN_PERMISO) {
          segunApi.push(accion.clave);
        }
      }

      assert.deepEqual(segunGuia, segunApi);
    });
  }

  test('las peticiones de sondeo no modificaron datos', async () => {
    assert.equal((await DbPool.query(CONTEO_DATOS)).rows[0].conteo, conteoInicial);
  });
});
