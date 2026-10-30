/*----
 * Programa: usuarios.test.mjs
 * Objetivo: Probar contra la BD real la gestión de cuentas: consulta (HUGUS05), alta (HUGUS02),
 *           cambio (HUGUS04), asignación de perfil (HUPRF01 esc. 4) y baja lógica (HUGUS03).
 *           Deja la BD como estaba. Uso: npm run test:bd
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import { describe, test, before, after, mock } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

process.env.NODE_ENV = 'test';
const { app, DbPool, iniciarSesion, obtenerUltimoEvento, asignarPerfilDirecto } =
  await import('./ayudantes.mjs');
const { establecerTransporte } = await import('../../servicios/correoServicio.js');

const CUENTAS_CREADAS = ['A01777111', 'N000500', 'N000777']; // Se eliminan al terminar

let administradora; // N000001, perfil PRF-ADM
let correosEnviados = []; // Correos capturados por el transporte de prueba

before(async () => {
  // Perfiles de prueba de rol Administrador sin todos los permisos de gestión
  await DbPool.query(
    `INSERT INTO perfil (rol_id, clave, nombre, descripcion)
     SELECT rol_id, v.clave, v.nombre, 'Perfil temporal de pruebas'
     FROM rol, (VALUES ('PRF-T-SOP', 'Prueba soporte de cuentas'),
                       ('PRF-T-ASIG', 'Prueba asignador de perfiles')) AS v (clave, nombre)
     WHERE rol.nombre = 'Administrador'`,
  );
  await DbPool.query(
    `INSERT INTO perfil_permiso (perfil_id, rol_id, permiso_id)
     SELECT pf.perfil_id, pf.rol_id, p.permiso_id
     FROM perfil pf JOIN permiso p ON
       (pf.clave = 'PRF-T-SOP' AND p.clave IN ('CONSULTA_CUENTAS', 'CAMBIO_CUENTAS'))
       OR (pf.clave = 'PRF-T-ASIG'
           AND p.clave IN ('CONSULTA_CUENTAS', 'CAMBIO_CUENTAS', 'ASIGNAR_PERFILES', 'BAJA_CUENTAS'))`,
  );
  await asignarPerfilDirecto('N000105', 'PRF-T-SOP');
  await asignarPerfilDirecto('N000104', 'PRF-T-ASIG');
  administradora = await iniciarSesion('N000001');
  establecerTransporte(async (mensaje) => {
    correosEnviados.push(mensaje);
  });
});

after(async () => {
  establecerTransporte(null);
  await asignarPerfilDirecto('N000105', 'PRF-BIB-CON');
  await asignarPerfilDirecto('N000104', 'PRF-BIB');
  await DbPool.query(`DELETE FROM perfil WHERE clave IN ('PRF-T-SOP', 'PRF-T-ASIG')`);
  await DbPool.query(
    `DELETE FROM registro_auditoria
     WHERE actor_usuario_id IN (SELECT usuario_id FROM usuario WHERE identificador = ANY($1))`,
    [CUENTAS_CREADAS],
  );
  await DbPool.query('DELETE FROM usuario WHERE identificador = ANY($1)', [CUENTAS_CREADAS]);
  await DbPool.query(`DELETE FROM externo.capital_humano_empleado WHERE nomina = 'N000777'`);
  await DbPool.query(
    `UPDATE usuario SET correo = 'carlos.perez@ducky.edu.mx', telefono = '8119990000',
       primer_nombre = 'Carlos', primer_apellido = 'Pérez', segundo_apellido = 'Soto',
       estado_cuenta = 'ACTIVO', fecha_baja = NULL, motivo_baja = NULL, baja_por_usuario_id = NULL
     WHERE identificador = 'A01999000'`,
  );
  await DbPool.end();
});

describe('HUGUS05: consulta y búsqueda de usuarios', () => {
  test('filtra por rol y ofrece las acciones según los permisos del operador', async () => {
    const respuesta = await administradora.get('/api/usuarios?rol=Alumno');

    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.mensaje, 'Se encontraron 6 usuarios');
    assert.deepEqual(respuesta.body.acciones, { puedeEditar: true, puedeAsignarPerfil: true });
    assert.doesNotMatch(JSON.stringify(respuesta.body), /\$2[aby]\$|contrasena|hash/i);
  });

  test('el campo "buscar" del front busca el nombre sin acentos ni mayúsculas', async () => {
    const respuesta = await administradora.get('/api/usuarios?buscar=DIAZ');
    const identificadores = respuesta.body.usuarios.map((usuario) => usuario.identificador);
    assert.deepEqual(identificadores.sort(), ['A01555888', 'N000104']);
  });

  test('una matrícula completa en "buscar" se busca con coincidencia exacta', async () => {
    const respuesta = await administradora.get('/api/usuarios?buscar=a01234567');
    assert.equal(respuesta.body.total, 1);
    assert.equal(respuesta.body.usuarios[0].nombre, 'Mariana López');
  });

  test('aplica los filtros en conjunto y "Todos" no filtra', async () => {
    const respuesta = await administradora.get(
      '/api/usuarios?rol=Alumno&estado=Inactivo&perfil=Todos',
    );
    assert.deepEqual(
      respuesta.body.usuarios.map((usuario) => usuario.identificador),
      ['A01678234'],
    );
  });

  test('sin coincidencias responde total cero con el mensaje de la historia', async () => {
    const respuesta = await administradora.get('/api/usuarios?nombre=zzzz');
    assert.equal(respuesta.body.total, 0);
    assert.equal(
      respuesta.body.mensaje,
      'No se encontraron usuarios con los criterios seleccionados',
    );
  });

  test('marca los filtros inválidos sin ejecutar la consulta', async () => {
    const respuesta = await administradora.get(
      '/api/usuarios?rol=Astronauta&tipoIdentificador=NOMINA&estado=Suspendido',
    );
    assert.equal(respuesta.status, 400);
    assert.deepEqual(respuesta.body.error.detalle.campos, ['Identificador', 'Rol', 'Estado']);
  });

  test('el detalle de una cuenta inactiva muestra su baja', async () => {
    const respuesta = await administradora.get('/api/usuarios/A01678234');
    assert.equal(respuesta.body.usuario.estadoCuenta, 'Inactivo');
    assert.equal(respuesta.body.usuario.baja.operador, 'N000001');
  });

  test('un alumno no puede consultar cuentas', async () => {
    const alumna = await iniciarSesion('A01234567');
    const respuesta = await alumna.get('/api/usuarios');
    assert.equal(respuesta.status, 403);
  });
});

describe('HUGUS02: alta de usuarios', () => {
  const RECHAZOS = [
    [
      'identificador ya registrado, aunque la cuenta esté inactiva',
      { identificador: 'A01678234', correo: 'otro@ducky.edu.mx', rol: 'Alumno' },
      409,
      'El identificador institucional ya está registrado',
    ],
    [
      'correo que ya pertenece a otra cuenta',
      { identificador: 'A01777111', correo: 'MARIANA.LOPEZ@ducky.edu.mx', rol: 'Alumno' },
      409,
      'El correo institucional ya está registrado',
    ],
    [
      'alumno no vigente en CIAA',
      { identificador: 'A01000999', correo: 'jorge.ruiz@ducky.edu.mx', rol: 'Alumno' },
      400,
      'Identidad no vigente o no validada',
    ],
    [
      'alumno con un perfil de otro rol',
      { identificador: 'A01777111', correo: 'valeria.gomez@ducky.edu.mx', rol: 'Maestro' },
      400,
      'Rol incompatible con identidad institucional',
    ],
    [
      'perfil inactivo',
      { identificador: 'A01777111', correo: 'valeria.gomez@ducky.edu.mx', perfil: 'PRF-ALU-2020' },
      400,
      'Perfil inexistente o inactivo',
    ],
    [
      'perfil inexistente',
      { identificador: 'A01777111', correo: 'valeria.gomez@ducky.edu.mx', perfil: 'PRF-NO-EXISTE' },
      400,
      'Perfil inexistente o inactivo',
    ],
    [
      'correo fuera del dominio institucional',
      { identificador: 'A01777111', correo: 'valeria@gmail.com', rol: 'Alumno' },
      400,
      'Revise el formato y dominio del correo institucional',
    ],
    [
      'teléfono que no tiene 10 dígitos',
      {
        identificador: 'A01777111',
        correo: 'valeria.gomez@ducky.edu.mx',
        telefono: '81-17',
        rol: 'Alumno',
      },
      400,
      'Teléfono inválido',
    ],
  ];
  for (const [descripcion, cuerpo, estadoHttp, mensaje] of RECHAZOS) {
    test(`rechaza: ${descripcion}`, async () => {
      const respuesta = await administradora.post('/api/usuarios', cuerpo);
      assert.equal(respuesta.status, estadoHttp);
      assert.equal(respuesta.body.error.mensaje, mensaje);
    });
  }

  test('una persona que no está en Capital Humano se registra ahí con el nombre capturado', async () => {
    const sinNombre = await administradora.post('/api/usuarios', {
      identificador: 'N000777',
      correo: 'jose.martinez@ducky.edu.mx',
      rol: 'Maestro',
    });
    assert.equal(sinNombre.status, 400);
    assert.deepEqual(sinNombre.body.error.detalle.campos, ['Nombre completo']);

    const respuesta = await administradora.post('/api/usuarios', {
      identificador: 'N000777',
      nombre: 'José Martínez',
      correo: 'jose.martinez@ducky.edu.mx',
      rol: 'Maestro',
    });
    assert.equal(respuesta.status, 201);
    assert.equal(respuesta.body.usuario.nombre, 'José Martínez');
    const { rows } = await DbPool.query(
      `SELECT vigente, puesto FROM externo.capital_humano_empleado WHERE nomina = 'N000777'`,
    );
    assert.deepEqual(rows, [{ vigente: true, puesto: 'Maestro' }]);
  });

  test('un identificador duplicado informa el estado de la cuenta existente', async () => {
    const respuesta = await administradora.post('/api/usuarios', {
      identificador: 'A01678234',
      correo: 'otro@ducky.edu.mx',
      rol: 'Alumno',
    });
    assert.equal(respuesta.body.error.detalle.estadoCuenta, 'Inactivo');
  });

  test('los campos faltantes se señalan por nombre', async () => {
    const respuesta = await administradora.post('/api/usuarios', { identificador: '  ' });
    assert.equal(respuesta.body.error.mensaje, 'Complete los campos obligatorios señalados');
    assert.deepEqual(respuesta.body.error.detalle.campos, [
      'Identificador',
      'Correo institucional',
      'Perfil',
    ]);
  });

  test('si CIAA no responde no crea la cuenta y permite reintentar (escenario 4)', async () => {
    const consultaOriginal = DbPool.query.bind(DbPool);
    mock.method(DbPool, 'query', (sql, ...resto) => {
      if (typeof sql === 'string' && sql.includes('externo.ciaa_alumno')) {
        return Promise.reject(new Error('CIAA sin conexión'));
      }
      return consultaOriginal(sql, ...resto);
    });
    try {
      const respuesta = await administradora.post('/api/usuarios', {
        identificador: 'A01777111',
        correo: 'valeria.gomez@ducky.edu.mx',
        rol: 'Alumno',
      });
      assert.equal(respuesta.status, 503);
      assert.equal(
        respuesta.body.error.mensaje,
        'No fue posible validar la identidad; intente nuevamente',
      );
    } finally {
      mock.restoreAll();
    }
    // Antes de reintentar se consulta Tipo e Identificador: la cuenta no quedó registrada
    assert.equal((await administradora.get('/api/usuarios/A01777111')).status, 404);
  });

  test('crea la cuenta con datos de CIAA y envía una contraseña temporal que funciona', async () => {
    correosEnviados = [];
    const respuesta = await administradora.post('/api/usuarios', {
      identificador: 'A01777111',
      correo: 'Valeria.Gomez@ducky.edu.mx',
      telefono: '8117771110',
      rol: 'Alumno',
      nombre: 'Nombre que se ignora',
    });

    assert.equal(respuesta.status, 201);
    assert.equal(respuesta.body.mensaje, 'Usuario creado y perfil asignado');
    assert.equal(respuesta.body.usuario.nombre, 'Valeria Gómez Ríos');
    assert.equal(respuesta.body.usuario.perfil.clave, 'PRF-ALU');
    assert.equal(respuesta.body.usuario.correo, 'valeria.gomez@ducky.edu.mx');

    const lineaContrasena = correosEnviados[0].texto
      .split('\n')
      .find((linea) => linea.startsWith('Contraseña temporal: '));
    const contrasenaTemporal = lineaContrasena.replace('Contraseña temporal: ', '');
    const nuevaCuenta = await request(app)
      .post('/api/auth/login')
      .send({ identificador: 'A01777111', contrasena: contrasenaTemporal });
    assert.equal(nuevaCuenta.status, 200);
    assert.equal(nuevaCuenta.body.usuario.debeCambiarContrasena, true);

    // La contraseña temporal nunca llega a la bitácora
    const evento = await obtenerUltimoEvento('ALTA_CUENTA', 'A01777111');
    assert.ok(!JSON.stringify(evento.detalle).includes(contrasenaTemporal));
  });

  test('si el correo falla, la cuenta queda creada con envío pendiente', async () => {
    establecerTransporte(async () => {
      throw new Error('Servidor de correo caído');
    });
    try {
      const respuesta = await administradora.post('/api/usuarios', {
        identificador: 'N000500',
        correo: 'daniel.flores@ducky.edu.mx',
        perfil: 'PRF-MAE',
      });
      assert.equal(respuesta.status, 201);
      assert.equal(respuesta.body.mensaje, 'Cuenta creada; envío de credenciales pendiente');
      assert.equal(respuesta.body.credencialesEnviadas, false);
      const evento = await obtenerUltimoEvento('ENVIO_CREDENCIALES', 'N000500');
      assert.equal(evento.resultado, 'ERROR');
    } finally {
      establecerTransporte(async (mensaje) => {
        correosEnviados.push(mensaje);
      });
    }
  });
});

describe('HUGUS04 y HUPRF01: cambio de contacto y de perfil', () => {
  test('guarda correo y teléfono y registra valores anteriores y nuevos', async () => {
    const respuesta = await administradora.put('/api/usuarios/A01999000', {
      correo: 'carlos.perez.soto@ducky.edu.mx',
      telefono: '8110001111',
    });

    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.mensaje, 'Datos de la cuenta actualizados');
    const evento = await obtenerUltimoEvento('CAMBIO_CUENTA', 'A01999000');
    assert.deepEqual(evento.detalle.anterior, {
      correo: 'carlos.perez@ducky.edu.mx',
      telefono: '8119990000',
    });
  });

  test('corrige el nombre y registra el anterior en la bitácora', async () => {
    const respuesta = await administradora.put('/api/usuarios/A01999000', {
      nombre: '  Carlos   Alberto Pérez Soto ',
    });

    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.usuario.nombre, 'Carlos Alberto Pérez Soto');
    const evento = await obtenerUltimoEvento('CAMBIO_CUENTA', 'A01999000');
    assert.deepEqual(evento.detalle, {
      anterior: { nombre: 'Carlos Pérez Soto' },
      nuevo: { nombre: 'Carlos Alberto Pérez Soto' },
    });
    const sinCambios = await administradora.put('/api/usuarios/A01999000', {
      nombre: 'Carlos Alberto Pérez Soto',
    });
    assert.equal(sinCambios.body.mensaje, 'No hay cambios por guardar');
  });

  const RECHAZOS = [
    [
      'correo duplicado',
      '/api/usuarios/A01999000',
      { correo: 'ana.torres@ducky.edu.mx' },
      400,
      'Correo duplicado o inválido',
    ],
    [
      'nombre sin apellido',
      '/api/usuarios/A01999000',
      { nombre: 'Carlos' },
      400,
      'Escriba el nombre con al menos un apellido',
    ],
    [
      'teléfono inválido',
      '/api/usuarios/A01999000',
      { telefono: '12345' },
      400,
      'Teléfono inválido',
    ],
    [
      'cuenta inactiva',
      '/api/usuarios/A01678234',
      { telefono: '8111111111' },
      409,
      'Cuenta inactiva',
    ],
    [
      'perfil de otro rol',
      '/api/usuarios/A01999000',
      { perfil: 'PRF-MAE' },
      400,
      'Rol incompatible con identidad institucional',
    ],
    [
      'perfil inactivo',
      '/api/usuarios/A01999000',
      { perfil: 'PRF-ALU-2020' },
      400,
      'Perfil inexistente o inactivo',
    ],
    [
      'su propio perfil',
      '/api/usuarios/N000001',
      { perfil: 'PRF-BIB' },
      403,
      'No puede modificar su propio acceso',
    ],
  ];
  for (const [descripcion, ruta, cuerpo, estadoHttp, mensaje] of RECHAZOS) {
    test(`rechaza: ${descripcion}`, async () => {
      const respuesta = await administradora.put(ruta, cuerpo);
      assert.equal(respuesta.status, estadoHttp);
      assert.equal(respuesta.body.error.mensaje, mensaje);
    });
  }

  test('sin permiso "Asignar perfiles" se puede editar el contacto pero no el perfil', async () => {
    const soporte = await iniciarSesion('N000105');
    const contacto = await soporte.put('/api/usuarios/A01333444', { telefono: '8113334440' });
    const perfil = await soporte.put('/api/usuarios/A01333444', { perfil: 'PRF-ALU' });

    assert.equal(contacto.status, 200);
    assert.equal(perfil.status, 403);
    assert.equal(perfil.body.error.mensaje, 'Sin permiso para asignar perfiles');
    await DbPool.query(`UPDATE usuario SET telefono = NULL WHERE identificador = 'A01333444'`);
  });

  test('asigna un perfil compatible a una cuenta (HUPRF01 escenario 4)', async () => {
    try {
      const respuesta = await administradora.put('/api/usuarios/A01333444/perfil', {
        perfil: 'PRF-ALU',
      });
      assert.equal(respuesta.status, 200);
      assert.equal(respuesta.body.mensaje, 'Perfil asignado a la cuenta');
      assert.equal(respuesta.body.usuario.perfil.clave, 'PRF-ALU');
      const evento = await obtenerUltimoEvento('ASIGNACION_PERFIL', 'A01333444');
      assert.deepEqual(evento.detalle, { anterior: 'PRF-ALU-2020', nuevo: 'PRF-ALU' });
    } finally {
      await asignarPerfilDirecto('A01333444', 'PRF-ALU-2020');
    }
  });

  test('no permite retirar el acceso al último Administrador con gestión', async () => {
    const asignador = await iniciarSesion('N000104');
    const respuesta = await asignador.put('/api/usuarios/N000001/perfil', { perfil: 'PRF-COM' });

    assert.equal(respuesta.status, 409);
    assert.equal(
      respuesta.body.error.mensaje,
      'Debe conservar un Administrador activo con permisos de gestión',
    );
    const evento = await obtenerUltimoEvento('ASIGNACION_PERFIL', 'N000001');
    assert.equal(evento.resultado, 'RECHAZO');
  });
});

describe('HUGUS03: baja lógica de usuarios', () => {
  test('rechaza la baja con préstamos activos y lista los libros pendientes', async () => {
    const respuesta = await administradora.post('/api/usuarios/A01234567/baja', {
      motivo: 'Egreso',
    });

    assert.equal(respuesta.status, 409);
    assert.match(respuesta.body.error.mensaje, /cuenta con 2 libro\(s\) en préstamo activo/);
    assert.deepEqual(
      respuesta.body.error.detalle.prestamos.map((prestamo) => prestamo.claveEjemplar),
      ['COM-005.1-COR-E01', 'LIT-863-RUL-E01'],
    );
  });

  test('rechaza la baja con adeudos pendientes con Tesorería', async () => {
    const respuesta = await administradora.post('/api/usuarios/A01555888/baja', {
      motivo: 'Egreso',
    });

    assert.equal(respuesta.status, 409);
    assert.equal(
      respuesta.body.error.mensaje,
      'Baja rechazada: existen adeudos pendientes con Tesorería',
    );
    assert.deepEqual(respuesta.body.error.detalle.adeudos, [
      { folio: 'PRE-2026-0004', concepto: '5 días de retraso', monto: 50 },
    ]);
  });

  test('no permite dar de baja la propia cuenta y registra el rechazo', async () => {
    const respuesta = await administradora.post('/api/usuarios/N000001/baja', { motivo: 'X' });
    assert.equal(respuesta.status, 403);
    assert.equal(respuesta.body.error.mensaje, 'No puede dar de baja su propia cuenta');
    assert.equal((await obtenerUltimoEvento('BAJA_CUENTA', 'N000001')).resultado, 'RECHAZO');
  });

  test('no permite dejar al sistema sin Administrador con gestión', async () => {
    const asignador = await iniciarSesion('N000104');
    const respuesta = await asignador.post('/api/usuarios/N000001/baja', { motivo: 'Prueba' });
    assert.equal(respuesta.status, 409);
    assert.equal(
      respuesta.body.error.mensaje,
      'Debe conservar un Administrador activo con permisos de gestión',
    );
  });

  test('una cuenta ya inactiva muestra la baja anterior sin registrar otra', async () => {
    const respuesta = await administradora.post('/api/usuarios/A01678234/baja', { motivo: 'X' });
    assert.equal(respuesta.status, 409);
    assert.equal(
      respuesta.body.error.mensaje,
      'El usuario ya está inactivo; no se requiere otra baja',
    );
    assert.equal(
      respuesta.body.error.detalle.bajaAnterior.motivo,
      'Baja temporal solicitada por Servicios Escolares',
    );
  });

  test('una cuenta inexistente responde "Cuenta no encontrada"', async () => {
    const respuesta = await administradora.post('/api/usuarios/A09999999/baja', { motivo: 'X' });
    assert.equal(respuesta.status, 404);
    assert.equal(respuesta.body.error.mensaje, 'Cuenta no encontrada');
  });

  test('exige el motivo de la baja', async () => {
    const respuesta = await administradora.post('/api/usuarios/A01999000/baja', { motivo: '  ' });
    assert.equal(respuesta.status, 400);
    assert.deepEqual(respuesta.body.error.detalle.campos, ['Motivo de baja']);
  });

  test('da de baja sin borrar datos, bloquea el acceso y permite reactivar', async () => {
    const carlos = await iniciarSesion('A01999000');
    const respuesta = await administradora.post('/api/usuarios/A01999000/baja', {
      motivo: 'Egreso de la universidad',
    });

    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.mensaje, 'Usuario dado de baja; registros históricos conservados');
    assert.equal(respuesta.body.usuario.estadoCuenta, 'Inactivo');
    assert.equal(respuesta.body.usuario.baja.motivo, 'Egreso de la universidad');
    // La sesión que Carlos tenía abierta deja de servir
    assert.equal((await carlos.get('/api/auth/sesion')).status, 401);

    const reactivacion = await administradora.post('/api/usuarios/A01999000/reactivar');
    assert.equal(reactivacion.status, 200);
    assert.equal(reactivacion.body.usuario.estadoCuenta, 'Activo');
    await iniciarSesion('A01999000');
  });

  test('reactiva una cuenta con perfil inactivo usando el perfil activo del mismo rol', async () => {
    await DbPool.query(
      `UPDATE usuario SET estado_cuenta = 'INACTIVO', fecha_baja = NOW(),
         motivo_baja = 'Prueba de reactivación' WHERE identificador = 'A01333444'`,
    );
    try {
      const respuesta = await administradora.post('/api/usuarios/A01333444/reactivar');
      assert.equal(respuesta.status, 200);
      assert.equal(respuesta.body.usuario.estadoCuenta, 'Activo');
      assert.equal(respuesta.body.usuario.perfil.clave, 'PRF-ALU');
      await iniciarSesion('A01333444');

      const perfilAnterior = await DbPool.query(
        `SELECT activo FROM perfil WHERE clave = 'PRF-ALU-2020'`,
      );
      assert.equal(perfilAnterior.rows[0].activo, false);
      const evento = await obtenerUltimoEvento('REACTIVACION_CUENTA', 'A01333444');
      assert.equal(evento.detalle.perfilAnterior, 'PRF-ALU-2020');
      assert.equal(evento.detalle.perfilNuevo, 'PRF-ALU');
    } finally {
      await asignarPerfilDirecto('A01333444', 'PRF-ALU-2020');
      await DbPool.query(
        `UPDATE usuario SET estado_cuenta = 'ACTIVO', fecha_baja = NULL, motivo_baja = NULL
         WHERE identificador = 'A01333444'`,
      );
    }
  });
});
