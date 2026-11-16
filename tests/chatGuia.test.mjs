/*----
 * Programa: chatGuia.test.mjs
 * Objetivo: Probar la guía del asistente Ducky: qué puede hacer cada perfil según sus permisos,
 *           y que la guía sigue de acuerdo con los permisos de la base, con el menú del front y
 *           con las pantallas que el front marca como pendientes
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 15 de Noviembre de 2026
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  ACCIONES,
  SECCIONES_POR_ROL,
  FUNCIONES_PENDIENTES,
  clasificarAcciones,
  crearGuia,
} from '../servicios/chat/guiaApp.js';

const RAIZ = path.join(import.meta.dirname, '..');
const leer = (ruta) => fs.readFileSync(path.join(RAIZ, ruta), 'utf8');

const CONSULTA = ['CONSULTAR_LIBROS', 'CONSULTAR_LISTADO', 'CONSULTAR_UBICACION'];
const CATALOGO = [
  'ALTA_LIBROS',
  'BAJA_LIBROS',
  'CAMBIO_LIBROS',
  'CLASIFICAR_EJEMPLARES',
  'ETIQUETAR_EJEMPLARES',
];
const COMPRAS = ['GESTIONAR_SOLICITUDES', 'REGISTRAR_RECEPCIONES'];
const CUENTAS = [
  'ALTA_CUENTAS',
  'BAJA_CUENTAS',
  'CAMBIO_CUENTAS',
  'CONSULTA_CUENTAS',
  'ASIGNAR_PERFILES',
  'CREAR_PERFILES',
  'CONSULTAR_PERFILES',
  'MODIFICAR_PERFILES',
  'DESACTIVAR_PERFILES',
];
const ACCIONES_CONSULTA = ['CONSULTAR_CATALOGO', 'CONSULTAR_UBICACION', 'CONSULTAR_LISTADO'];
const ACCIONES_CATALOGO = [
  'ALTA_LIBROS',
  'EDITAR_LIBROS',
  'CLASIFICAR_EJEMPLARES',
  'ETIQUETAS',
  'BAJA_LIBROS',
];
const ACCIONES_COMPRAS = ['CONSULTAR_COMPRAS', 'GESTIONAR_COMPRAS', 'REGISTRAR_RECEPCIONES'];

/**
 * Objetivo: Obtener las claves de las acciones que un perfil puede realizar.
 * @param {string[]} permisos - Permisos del perfil.
 * @returns {string[]} Claves de las acciones permitidas, en el orden de la guía.
 */
const permitidas = (permisos) =>
  clasificarAcciones(permisos).permitidas.map((accion) => accion.clave);

describe('Guía: qué puede hacer cada perfil', () => {
  test('Alumno, Maestro y Colaborador solo consultan', () => {
    assert.deepEqual(permitidas(CONSULTA), ACCIONES_CONSULTA);
  });

  test('el Bibliotecario de ventanilla además gestiona libros, pero no cuentas ni compras', () => {
    assert.deepEqual(permitidas([...CONSULTA, ...CATALOGO]), [
      ...ACCIONES_CONSULTA,
      ...ACCIONES_CATALOGO,
    ]);
  });

  test('el Bibliotecario de consulta puede lo mismo que un Alumno, aunque su rol sea otro', () => {
    assert.deepEqual(permitidas(CONSULTA), ACCIONES_CONSULTA);
    const guia = crearGuia({
      primer_nombre: 'Gabriela',
      rol_nombre: 'Bibliotecario',
      perfil_nombre: 'Bibliotecario de consulta',
      permisos: CONSULTA,
    });
    const [puede, noPuede] = guia.split('LO QUE ESTA PERSONA NO PUEDE HACER');
    assert.ok(!puede.includes('Dar de alta libros'));
    assert.ok(noPuede.includes('Dar de alta libros y ejemplares nuevos'));
    assert.match(guia, /Rol: Bibliotecario\. Perfil: Bibliotecario de consulta\./);
    assert.match(guia, /lo decide el permiso de su perfil, no su menú/);
  });

  test('el Comprador de libros consulta y gestiona compras', () => {
    assert.deepEqual(permitidas([...CONSULTA, ...COMPRAS]), [
      ...ACCIONES_CONSULTA,
      ...ACCIONES_COMPRAS,
    ]);
  });

  test('el Administrador general puede todo', () => {
    const resultado = clasificarAcciones([...CONSULTA, ...CATALOGO, ...COMPRAS, ...CUENTAS]);
    assert.equal(resultado.permitidas.length, ACCIONES.length);
    assert.deepEqual(resultado.noPermitidas, []);
  });

  test('un permiso suelto no basta cuando la acción exige varios', () => {
    // El alta exige Alta de libros + Clasificar + Etiquetar, igual que la ruta de la API
    assert.ok(!permitidas([...CONSULTA, 'ALTA_LIBROS']).includes('ALTA_LIBROS'));
    // Consultar compras admite cualquiera de los dos permisos de compras
    assert.ok(permitidas(['REGISTRAR_RECEPCIONES']).includes('CONSULTAR_COMPRAS'));
    assert.ok(!permitidas(['REGISTRAR_RECEPCIONES']).includes('GESTIONAR_COMPRAS'));
  });

  test('un perfil sin permisos no puede nada y la guía lo dice', () => {
    assert.deepEqual(permitidas([]), []);
    const guia = crearGuia({
      primer_nombre: 'Prueba',
      rol_nombre: 'Alumno',
      perfil_nombre: 'Sin permisos',
      permisos: [],
    });
    assert.match(guia, /Ninguna de las acciones de gestión o consulta del sistema/);
  });
});

describe('Guía: texto para el asistente', () => {
  const guia = crearGuia({
    usuario_id: '9',
    identificador: 'N000210',
    correo: 'ricardo.vega@ducky.edu.mx',
    primer_nombre: 'Ricardo',
    rol_nombre: 'Comprador de libros',
    perfil_nombre: 'Comprador de libros',
    permisos: [...CONSULTA, ...COMPRAS],
  });

  test('identifica nombre, rol y perfil, sin identificador ni correo', () => {
    assert.match(
      guia,
      /Nombre: Ricardo\. Rol: Comprador de libros\. Perfil: Comprador de libros\./,
    );
    assert.ok(!guia.includes('N000210'));
    assert.ok(!guia.includes('ricardo.vega'));
  });

  test('describe las secciones del rol y aclara que el Comprador no tiene catálogo en su menú', () => {
    assert.match(guia, /- Compras: solicitudes de compra/);
    assert.match(guia, /Su menú no incluye el catálogo/);
  });

  test('pide no dar pasos detallados ni nombres de botones', () => {
    assert.match(guia, /No des pasos detallados ni nombres de botones/);
  });

  test('solo lista como pendientes las funciones que ve ese rol', () => {
    const alumno = crearGuia({
      primer_nombre: 'Mariana',
      rol_nombre: 'Alumno',
      perfil_nombre: 'Alumno',
      permisos: CONSULTA,
    });
    assert.match(alumno, /Mi cuenta: préstamos y adeudos \(se entrega en el Sprint 2\)/);
    assert.ok(!alumno.includes('Reportes e inventario (se entrega'));
    assert.ok(!guia.includes('Mi cuenta: préstamos y adeudos (se entrega'));
  });
});

describe('Guía: sigue de acuerdo con el resto del proyecto', () => {
  test('usa exactamente los permisos que existen en la base y no deja ninguno sin describir', () => {
    const semilla = leer('db/semillas/001_seguridad.sql');
    const bloque = semilla.slice(
      semilla.indexOf('INSERT INTO permiso'),
      semilla.indexOf('-- Matriz rol-permiso'),
    );
    const permisosBase = [...bloque.matchAll(/\('([A-Z_]+)',/g)].map((hallazgo) => hallazgo[1]);
    const permisosGuia = new Set(
      ACCIONES.flatMap((accion) => [...accion.todos, ...(accion.alguno ?? [])]),
    );

    assert.equal(permisosBase.length, 19);
    assert.deepEqual(
      [...permisosGuia].sort(),
      [...permisosBase].sort(),
      'Los permisos de servicios/chat/guiaApp.js no coinciden con db/semillas/001_seguridad.sql',
    );
  });

  test('las secciones por rol son el menú que muestra el front', () => {
    const fuente = leer('src/components/SessionNavigation.tsx');
    const bloque = fuente.slice(fuente.indexOf('const items ='), fuente.indexOf('// Nombre de la'));
    const menus = [...bloque.matchAll(/\[([^\]]+)\]/g)].map((hallazgo) =>
      [...hallazgo[1].matchAll(/'([^']+)'/g)].map((texto) => texto[1]),
    );
    const nombres = (rol) => SECCIONES_POR_ROL[rol].map((seccion) => seccion.nombre);
    const aviso =
      'El menú del front cambió: actualiza SECCIONES_POR_ROL en servicios/chat/guiaApp.js';

    // Orden en el front: Administrador, Bibliotecario, Comprador de libros y los demás roles
    assert.deepEqual(menus[0], nombres('Administrador'), aviso);
    assert.deepEqual(menus[1], nombres('Bibliotecario'), aviso);
    assert.deepEqual(menus[2], nombres('Comprador de libros'), aviso);
    for (const rol of ['Alumno', 'Maestro', 'Colaborador']) {
      assert.deepEqual(menus[3], nombres(rol), aviso);
    }
  });

  test('las funciones pendientes son las que el front marca con su sprint', () => {
    const fuente = leer('src/App.tsx');
    const bloque = fuente.slice(
      fuente.indexOf('const LATER_SPRINTS'),
      fuente.indexOf('function LaterSprint'),
    );
    const delFront = new Set(
      [...bloque.matchAll(/\['([^']+)', '(Sprint \d)'\]/g)].map(
        (hallazgo) => `${hallazgo[1]} · ${hallazgo[2]}`,
      ),
    );

    assert.ok(delFront.size > 0, 'No se encontró LATER_SPRINTS en src/App.tsx');
    for (const funcion of FUNCIONES_PENDIENTES) {
      assert.ok(
        delFront.has(`${funcion.nombre} · ${funcion.sprint}`),
        `"${funcion.nombre}" ya no está pendiente en el front (o cambió de sprint): ` +
          'actualiza FUNCIONES_PENDIENTES en servicios/chat/guiaApp.js',
      );
    }
  });
});
