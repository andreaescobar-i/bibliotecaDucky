/*----
 * Programa: chatGuia.test.mjs
 * Objetivo: Probar la guía del asistente Ducky: qué puede hacer cada perfil según sus permisos,
 *           qué dice de los demás roles, y que la guía sigue de acuerdo con los permisos de la base, con el menú del front y
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
  clasificarAcciones,
  resumirOtrosPerfiles,
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
    assert.deepEqual(permitidas([...CONSULTA, ...CATALOGO, 'OPERAR_CIRCULACION']), [
      'OPERAR_CIRCULACION',
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
    const resultado = clasificarAcciones([
      ...CONSULTA,
      ...CATALOGO,
      ...COMPRAS,
      ...CUENTAS,
      'OPERAR_CIRCULACION',
      'CONSULTAR_REPORTES',
    ]);
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

  test('describe Mi cuenta como disponible para el lector', () => {
    const alumno = crearGuia({
      primer_nombre: 'Mariana',
      rol_nombre: 'Alumno',
      perfil_nombre: 'Alumno',
      permisos: CONSULTA,
    });
    assert.match(alumno, /Mi cuenta: préstamos, adeudos y lista de espera/);
    assert.ok(!alumno.includes('Reportes e inventario (se entrega'));
    assert.ok(!guia.includes('Mi cuenta: préstamos y adeudos (se entrega'));
  });
});

describe('Guía: qué pueden hacer los demás roles', () => {
  // Perfiles activos con la forma que devuelve perfilModelo.listarPerfiles
  const PERFILES = [
    {
      nombre: 'Administrador general',
      rol_nombre: 'Administrador',
      rol_activo: true,
      permisos: [
        ...CONSULTA,
        ...CATALOGO,
        ...COMPRAS,
        ...CUENTAS,
        'OPERAR_CIRCULACION',
        'CONSULTAR_REPORTES',
      ],
    },
    {
      nombre: 'Bibliotecario de ventanilla',
      rol_nombre: 'Bibliotecario',
      rol_activo: true,
      permisos: [...CONSULTA, ...CATALOGO],
    },
    {
      nombre: 'Bibliotecario de consulta',
      rol_nombre: 'Bibliotecario',
      rol_activo: true,
      permisos: CONSULTA,
    },
    { nombre: 'Alumno', rol_nombre: 'Alumno', rol_activo: true, permisos: CONSULTA },
    { nombre: 'Sin permisos', rol_nombre: 'Maestro', rol_activo: true, permisos: [] },
    { nombre: 'De rol inactivo', rol_nombre: 'Visitante', rol_activo: false, permisos: CONSULTA },
  ];
  const renglones = resumirOtrosPerfiles(PERFILES, 'Administrador general');
  const renglon = (inicio) => renglones.find((texto) => texto.startsWith(inicio));

  test('resume cada perfil activo, menos el de quien pregunta y los de roles inactivos', () => {
    assert.equal(renglones.length, 4);
    assert.ok(!renglones.some((texto) => texto.includes('Administrador general')));
    assert.ok(!renglones.some((texto) => texto.includes('De rol inactivo')));
  });

  test('dice lo que el perfil puede hacer según sus permisos y el menú de su rol', () => {
    const alumno = renglon('Alumno:');
    assert.match(alumno, /Buscar libros en el catálogo/);
    assert.ok(!alumno.includes('Dar de alta'));
    assert.match(alumno, /Menú: Catálogo, Mi cuenta\./);
  });

  test('distingue los perfiles de un mismo rol', () => {
    assert.match(
      renglon('Bibliotecario, perfil "Bibliotecario de ventanilla"'),
      /Dar de alta libros/,
    );
    assert.ok(
      !renglon('Bibliotecario, perfil "Bibliotecario de consulta"').includes('Dar de alta'),
    );
  });

  test('abrevia el perfil que puede todo y el que no puede nada', () => {
    const [administrador] = resumirOtrosPerfiles(PERFILES, 'Alumno');
    assert.match(administrador, /todas las acciones del sistema/);
    assert.match(renglon('Maestro, perfil "Sin permisos"'), /ninguna acción de gestión o consulta/);
  });

  test('la guía incluye a los demás roles y pide no dar datos de personas', () => {
    const guia = crearGuia(
      {
        primer_nombre: 'Patricia',
        rol_nombre: 'Administrador',
        perfil_nombre: 'Administrador general',
        permisos: PERFILES[0].permisos,
      },
      PERFILES,
    );
    const [, otros] = guia.split('LO QUE PUEDEN HACER LOS DEMÁS ROLES Y PERFILES');
    assert.match(otros, /- Alumno: Buscar libros/);
    assert.match(guia, /Nunca digas qué personas tienen ese rol/);
  });

  test('sin perfiles, la guía lo dice en lugar de inventar', () => {
    const guia = crearGuia({
      primer_nombre: 'Prueba',
      rol_nombre: 'Alumno',
      perfil_nombre: 'Alumno',
      permisos: CONSULTA,
    });
    assert.match(guia, /No hay información de otros perfiles/);
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

    assert.equal(permisosBase.length, 21);
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

  test('la aplicación no vuelve a mostrar marcadores de sprint', () => {
    assert.doesNotMatch(leer('src/App.tsx'), /LATER_SPRINTS|Esta función se entrega en el/);
  });
});
