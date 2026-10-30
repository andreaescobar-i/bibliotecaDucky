/*----
 * Programa: perfiles.test.mjs
 * Objetivo: Probar contra la BD real la gestión de perfiles (HUPRF01): consulta, creación,
 *           modificación, desactivación y rechazos por autorización o reglas. Deja la BD como
 *           estaba. Uso: npm run test:bd
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import { describe, test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

process.env.NODE_ENV = 'test';
const { app, DbPool, iniciarSesion, obtenerUltimoEvento } = await import('./ayudantes.mjs');

const PERFIL_PRUEBA = 'PRF-T-CONSULTA'; // Se elimina al terminar

let administradora;

before(async () => {
  administradora = await iniciarSesion('N000001');
});

after(async () => {
  await DbPool.query(`DELETE FROM perfil WHERE clave LIKE 'PRF-T-%'`);
  await DbPool.end();
});

describe('HUPRF01: consulta de perfiles y roles', () => {
  test('lista los perfiles con rol, permisos y cuentas activas', async () => {
    const respuesta = await administradora.get('/api/perfiles');
    const alumno = respuesta.body.perfiles.find((perfil) => perfil.clave === 'PRF-ALU');

    assert.equal(respuesta.status, 200);
    assert.equal(alumno.rol, 'Alumno');
    assert.deepEqual(alumno.permisos, [
      'CONSULTAR_LIBROS',
      'CONSULTAR_LISTADO',
      'CONSULTAR_UBICACION',
    ]);
    assert.equal(alumno.politicaPrestamo.diasHabiles, 5);
    assert.equal(alumno.cuentasActivas, 4); // Mariana, Rodrigo, Carlos y Lucía
  });

  test('filtra por estado', async () => {
    const respuesta = await administradora.get('/api/perfiles?estado=Inactivo');
    assert.deepEqual(
      respuesta.body.perfiles.map((perfil) => perfil.clave),
      ['PRF-ALU-2020'],
    );
  });

  test('el detalle muestra las cuentas activas asignadas por matrícula o nómina', async () => {
    const respuesta = await administradora.get('/api/perfiles/prf-mae');
    assert.equal(respuesta.status, 200);
    assert.deepEqual(respuesta.body.perfil.cuentas, [
      { tipoIdentificador: 'NOMINA', identificador: 'N000305', nombre: 'Sofía Hernández Cruz' },
    ]);
  });

  test('los roles indican qué permisos puede tener cada uno', async () => {
    const respuesta = await administradora.get('/api/roles');
    const alumno = respuesta.body.roles.find((rol) => rol.nombre === 'Alumno');
    const administrador = respuesta.body.roles.find((rol) => rol.nombre === 'Administrador');

    assert.equal(respuesta.body.roles.length, 6);
    assert.equal(alumno.permisosPermitidos.length, 3);
    assert.equal(administrador.permisosPermitidos.length, 19);
  });

  test('un perfil inexistente responde 404', async () => {
    const respuesta = await administradora.get('/api/perfiles/PRF-NADA');
    assert.equal(respuesta.status, 404);
  });
});

describe('HUPRF01 escenario 1: creación de perfil', () => {
  test('registra el perfil activo sin asignarlo a ninguna cuenta', async () => {
    const respuesta = await administradora.post('/api/perfiles', {
      clave: 'prf-t-consulta',
      nombre: 'Prueba consulta de catálogo',
      descripcion: 'Solo búsqueda y ubicación',
      rol: 'Bibliotecario',
      permisos: ['CONSULTAR_UBICACION', 'consultar_libros', 'CONSULTAR_LIBROS'],
    });

    assert.equal(respuesta.status, 201);
    assert.equal(respuesta.body.mensaje, 'Perfil registrado');
    assert.equal(respuesta.body.perfil.clave, PERFIL_PRUEBA);
    assert.equal(respuesta.body.perfil.estado, 'Activo');
    assert.equal(respuesta.body.perfil.cuentasActivas, 0);
    assert.equal(respuesta.body.perfil.creadoPor, 'N000001');
    assert.deepEqual(respuesta.body.perfil.permisos, ['CONSULTAR_LIBROS', 'CONSULTAR_UBICACION']);
  });

  const RECHAZOS = [
    [
      'clave repetida',
      {
        clave: PERFIL_PRUEBA,
        nombre: 'Otro nombre',
        rol: 'Alumno',
        permisos: ['CONSULTAR_LIBROS'],
      },
      409,
      'La clave o el nombre del perfil ya están registrados',
    ],
    [
      'nombre repetido',
      { clave: 'PRF-T-OTRO', nombre: 'ALUMNO', rol: 'Alumno', permisos: ['CONSULTAR_LIBROS'] },
      409,
      'La clave o el nombre del perfil ya están registrados',
    ],
    [
      'un permiso que el rol no permite',
      { clave: 'PRF-T-OTRO', nombre: 'Otro', rol: 'Alumno', permisos: ['ALTA_LIBROS'] },
      400,
      'Rol o permisos incompatibles',
    ],
    [
      'sin permisos',
      { clave: 'PRF-T-OTRO', nombre: 'Otro', rol: 'Alumno', permisos: [] },
      400,
      'Seleccione al menos un permiso compatible con el rol',
    ],
    [
      'rol no registrado',
      { clave: 'PRF-T-OTRO', nombre: 'Otro', rol: 'Astronauta', permisos: ['CONSULTAR_LIBROS'] },
      400,
      'Rol no registrado o inactivo',
    ],
    [
      'campos obligatorios vacíos',
      { clave: ' ', nombre: '', permisos: ['CONSULTAR_LIBROS'] },
      400,
      'Complete los campos obligatorios señalados',
    ],
  ];
  for (const [descripcion, cuerpo, estadoHttp, mensaje] of RECHAZOS) {
    test(`rechaza: ${descripcion}`, async () => {
      const respuesta = await administradora.post('/api/perfiles', cuerpo);
      assert.equal(respuesta.status, estadoHttp);
      assert.equal(respuesta.body.error.mensaje, mensaje);
    });
  }

  test('un permiso incompatible se identifica en la respuesta', async () => {
    const respuesta = await administradora.post('/api/perfiles', {
      clave: 'PRF-T-OTRO',
      nombre: 'Otro',
      rol: 'Comprador de libros',
      permisos: ['CONSULTAR_LIBROS', 'BAJA_CUENTAS'],
    });
    assert.deepEqual(respuesta.body.error.detalle.permisosIncompatibles, ['BAJA_CUENTAS']);
  });
});

describe('HUPRF01 escenario 2: consulta y modificación de perfil', () => {
  test('guarda nombre y permisos sin cambiar la clave y registra valores anteriores', async () => {
    const respuesta = await administradora.put(`/api/perfiles/${PERFIL_PRUEBA}`, {
      clave: 'NO-SE-CAMBIA',
      nombre: 'Prueba consulta y listado',
      permisos: ['CONSULTAR_LIBROS', 'CONSULTAR_UBICACION', 'CONSULTAR_LISTADO'],
    });

    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.mensaje, 'Perfil actualizado');
    assert.equal(respuesta.body.perfil.clave, PERFIL_PRUEBA);
    assert.equal(respuesta.body.perfil.permisos.length, 3);
    const evento = await obtenerUltimoEvento('MODIFICACION_PERFIL', PERFIL_PRUEBA);
    assert.equal(evento.detalle.anterior.nombre, 'Prueba consulta de catálogo');
    assert.equal(evento.detalle.nuevo.nombre, 'Prueba consulta y listado');
  });

  test('cambiar el rol con permisos que el nuevo rol no permite se rechaza completo', async () => {
    const respuesta = await administradora.put(`/api/perfiles/${PERFIL_PRUEBA}`, {
      rol: 'Comprador de libros',
      permisos: ['CONSULTAR_LIBROS', 'ALTA_LIBROS'],
    });
    assert.equal(respuesta.status, 400);
    assert.equal(respuesta.body.error.mensaje, 'Rol o permisos incompatibles');
  });

  test('no permite cambiar los permisos del perfil con el que opera el propio operador', async () => {
    const respuesta = await administradora.put('/api/perfiles/PRF-ADM', {
      permisos: ['CONSULTA_CUENTAS'],
    });
    assert.equal(respuesta.status, 403);
    assert.equal(respuesta.body.error.mensaje, 'No puede modificar su propio acceso');
    assert.equal(
      (await obtenerUltimoEvento('MODIFICACION_PERFIL', 'PRF-ADM')).resultado,
      'RECHAZO',
    );
  });

  test('una cuenta asignada sin vigencia en CIAA impide cambiar el acceso del perfil', async () => {
    const respuesta = await administradora.put('/api/perfiles/PRF-ALU', {
      permisos: ['CONSULTAR_LIBROS', 'CONSULTAR_UBICACION'],
    });
    assert.equal(respuesta.status, 409);
    assert.equal(respuesta.body.error.mensaje, 'Identidad no vigente o no validada');
    assert.deepEqual(
      respuesta.body.error.detalle.cuentas.map((cuenta) => cuenta.identificador),
      ['A01444222'],
    );
  });

  test('un rol incompatible con las identidades de sus cuentas se rechaza', async () => {
    const respuesta = await administradora.put('/api/perfiles/PRF-COL', {
      rol: 'Alumno',
      permisos: ['CONSULTAR_LIBROS'],
    });
    assert.equal(respuesta.status, 409);
    assert.equal(respuesta.body.error.mensaje, 'Rol incompatible con identidad institucional');
  });
});

describe('HUPRF01 escenario 3: desactivación', () => {
  test('con cuentas activas asignadas no se desactiva y se listan las cuentas', async () => {
    const respuesta = await administradora.post('/api/perfiles/PRF-MAE/desactivar');

    assert.equal(respuesta.status, 409);
    assert.equal(
      respuesta.body.error.mensaje,
      'Reasigne las cuentas activas antes de desactivar el perfil',
    );
    assert.equal(respuesta.body.error.detalle.cantidad, 1);
    const perfil = await administradora.get('/api/perfiles/PRF-MAE');
    assert.equal(perfil.body.perfil.estado, 'Activo');
  });

  test('sin cuentas activas se desactiva y ya no se puede modificar', async () => {
    const respuesta = await administradora.post(`/api/perfiles/${PERFIL_PRUEBA}/desactivar`);
    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.mensaje, 'Perfil desactivado');
    assert.equal(respuesta.body.perfil.estado, 'Inactivo');

    const otraVez = await administradora.post(`/api/perfiles/${PERFIL_PRUEBA}/desactivar`);
    assert.equal(otraVez.status, 409);
    const edicion = await administradora.put(`/api/perfiles/${PERFIL_PRUEBA}`, { nombre: 'X' });
    assert.equal(edicion.status, 409);
  });
});

describe('HUPRF01 escenario 5: rechazo por autorización', () => {
  test('sin permiso de perfiles responde con el mensaje de la historia', async () => {
    const bibliotecario = await iniciarSesion('N000104');
    for (const peticion of [
      bibliotecario.get('/api/perfiles'),
      bibliotecario.post('/api/perfiles', { clave: 'PRF-T-X' }),
      bibliotecario.put('/api/perfiles/PRF-ALU', { nombre: 'X' }),
      bibliotecario.post('/api/perfiles/PRF-ALU/desactivar'),
    ]) {
      const respuesta = await peticion;
      assert.equal(respuesta.status, 403);
      assert.equal(
        respuesta.body.error.mensaje,
        'No tiene permiso para esta operación de perfiles',
      );
    }
  });

  test('sin sesión se pide iniciar sesión, incluso con solicitudes directas', async () => {
    const respuesta = await request(app).post('/api/perfiles').send({ clave: 'PRF-T-X' });
    assert.equal(respuesta.status, 401);
  });
});
