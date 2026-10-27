/*----
 * Programa: baseDatos.test.mjs
 * Objetivo: Comprobar contra PostgreSQL real que la migración y las semillas del Sprint 1
 *           quedaron completas y que la BD rechaza datos que violan las historias de usuario.
 *           Requiere haber ejecutado npm run db:reset. Uso: npm run test:bd
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import { describe, test, after } from 'node:test';
import assert from 'node:assert/strict';
import DbPool from '../../config/db.js';

// Códigos de error de PostgreSQL
const VIOLA_LLAVE_FORANEA = { code: '23503' };
const VIOLA_UNICIDAD = { code: '23505' };
const VIOLA_CHECK = { code: '23514' };

/**
 * Objetivo: Ejecutar una consulta dentro de una transacción que siempre se revierte, para que
 *   las pruebas no modifiquen los datos de prueba.
 * @param {string} sql - Consulta a ejecutar.
 * @param {any[]} [parametros] - Valores para $1, $2...
 * @returns {Promise<import('pg').QueryResult>} Resultado de la consulta.
 */
async function consultarSinGuardar(sql, parametros = []) {
  const cliente = await DbPool.connect();
  try {
    await cliente.query('BEGIN');
    return await cliente.query(sql, parametros);
  } finally {
    await cliente.query('ROLLBACK');
    cliente.release();
  }
}

/**
 * Objetivo: Contar los registros de una consulta COUNT(*).
 * @param {string} sql - Consulta que devuelve una columna "total".
 * @param {any[]} [parametros] - Valores para $1, $2...
 * @returns {Promise<number>} Total obtenido.
 */
async function contar(sql, parametros = []) {
  const resultado = await DbPool.query(sql, parametros);
  return Number(resultado.rows[0].total);
}

after(() => DbPool.end());

describe('Semillas cargadas', () => {
  const TOTALES_ESPERADOS = [
    ['rol', 6],
    ['permiso', 19],
    ['perfil', 8],
    ['usuario', 12],
    ['libro', 8],
    ['ejemplar', 21],
    ['solicitud_adquisicion', 4],
    ['externo.ciaa_alumno', 8],
    ['externo.capital_humano_empleado', 8],
  ];
  for (const [tabla, esperado] of TOTALES_ESPERADOS) {
    test(`la tabla ${tabla} tiene ${esperado} registros`, async () => {
      assert.equal(await contar(`SELECT COUNT(*) AS total FROM ${tabla}`), esperado);
    });
  }

  test('los roles son los seis del front', async () => {
    const resultado = await DbPool.query('SELECT nombre FROM rol ORDER BY rol_id');
    assert.deepEqual(
      resultado.rows.map((fila) => fila.nombre),
      ['Alumno', 'Maestro', 'Colaborador', 'Bibliotecario', 'Administrador', 'Comprador de libros'],
    );
  });

  test('la contraseña de prueba coincide con el hash bcrypt guardado', async () => {
    const resultado = await DbPool.query(
      `SELECT "contraseña_hash" = crypt($1, "contraseña_hash") AS coincide,
              "contraseña_hash" LIKE '$2a$10$%' AS es_bcrypt
       FROM usuario WHERE identificador = $2`,
      ['Ducky2026', 'N000001'],
    );
    assert.deepEqual(resultado.rows[0], { coincide: true, es_bcrypt: true });
  });

  test('solo hay un Administrador activo con permiso de gestionar cuentas', async () => {
    const total = await contar(
      `SELECT COUNT(*) AS total
       FROM usuario u
       JOIN perfil pf ON pf.perfil_id = u.perfil_id
       JOIN perfil_permiso pp ON pp.perfil_id = pf.perfil_id
       JOIN permiso p ON p.permiso_id = pp.permiso_id
       WHERE u.estado_cuenta = 'ACTIVO' AND pf.activo AND p.clave = 'BAJA_CUENTAS'`,
    );
    assert.equal(total, 1);
  });
});

describe('Matriz de permisos (HUPRF01)', () => {
  const PERMISOS_POR_PERFIL = [
    ['PRF-ADM', 19],
    ['PRF-BIB', 8],
    ['PRF-BIB-CON', 3],
    ['PRF-COM', 5],
    ['PRF-ALU', 3],
  ];
  for (const [clavePerfil, esperado] of PERMISOS_POR_PERFIL) {
    test(`el perfil ${clavePerfil} tiene ${esperado} permisos`, async () => {
      const total = await contar(
        `SELECT COUNT(*) AS total
         FROM perfil_permiso pp JOIN perfil pf ON pf.perfil_id = pp.perfil_id
         WHERE pf.clave = $1`,
        [clavePerfil],
      );
      assert.equal(total, esperado);
    });
  }

  test('un perfil no puede recibir un permiso que su rol no permite', async () => {
    const promesa = consultarSinGuardar(
      `INSERT INTO perfil_permiso (perfil_id, rol_id, permiso_id)
       SELECT pf.perfil_id, pf.rol_id, p.permiso_id
       FROM perfil pf, permiso p
       WHERE pf.clave = 'PRF-ALU' AND p.clave = 'ALTA_LIBROS'`,
    );
    await assert.rejects(promesa, VIOLA_LLAVE_FORANEA);
  });

  test('cambiar el rol de un perfil se rechaza si sus permisos no son compatibles', async () => {
    const promesa = consultarSinGuardar(
      `UPDATE perfil SET rol_id = (SELECT rol_id FROM rol WHERE nombre = 'Alumno')
       WHERE clave = 'PRF-BIB'`,
    );
    await assert.rejects(promesa, VIOLA_LLAVE_FORANEA);
  });
});

describe('Integridad de cuentas (HUGUS01-04)', () => {
  test('el identificador debe tener el formato de CIAA o Capital Humano', async () => {
    const promesa = consultarSinGuardar(
      `UPDATE usuario SET identificador = '1234567' WHERE identificador = 'A01999000'`,
    );
    await assert.rejects(promesa, VIOLA_CHECK);
  });

  test('el correo no se repite aunque cambien las mayúsculas', async () => {
    const promesa = consultarSinGuardar(
      `UPDATE usuario SET correo = 'MARIANA.LOPEZ@ducky.edu.mx' WHERE identificador = 'A01999000'`,
    );
    await assert.rejects(promesa, VIOLA_UNICIDAD);
  });

  test('una cuenta no puede quedar inactiva sin fecha y motivo de baja', async () => {
    const promesa = consultarSinGuardar(
      `UPDATE usuario SET estado_cuenta = 'INACTIVO' WHERE identificador = 'A01999000'`,
    );
    await assert.rejects(promesa, VIOLA_CHECK);
  });

  test('el teléfono debe tener 10 dígitos', async () => {
    const promesa = consultarSinGuardar(
      `UPDATE usuario SET telefono = '81-1234' WHERE identificador = 'A01999000'`,
    );
    await assert.rejects(promesa, VIOLA_CHECK);
  });
});

describe('Integridad del catálogo (HULIB01-04)', () => {
  test('la Clave de libro no se puede duplicar', async () => {
    const promesa = consultarSinGuardar(
      `INSERT INTO libro (editorial_id, categoria_id, clave_libro, titulo)
       SELECT editorial_id, categoria_id, 'LIT-863-RUL', 'Otro título'
       FROM libro WHERE clave_libro = 'LIT-863.64-GAR'`,
    );
    await assert.rejects(promesa, VIOLA_UNICIDAD);
  });

  test('un ejemplar no puede quedar dado de baja sin motivo', async () => {
    const promesa = consultarSinGuardar(
      `UPDATE ejemplar SET estado = 'DADO_DE_BAJA', fecha_baja = now()
       WHERE codigo_ejemplar = 'LIT-863-RUL-E02'`,
    );
    await assert.rejects(promesa, VIOLA_CHECK);
  });

  test('el motivo "Otro" exige una descripción', async () => {
    const promesa = consultarSinGuardar(
      `UPDATE ejemplar SET estado = 'DADO_DE_BAJA', fecha_baja = now(), motivo_baja = 'OTRO'
       WHERE codigo_ejemplar = 'LIT-863-RUL-E02'`,
    );
    await assert.rejects(promesa, VIOLA_CHECK);
  });

  test('la disponibilidad cuenta solo ejemplares con estado Disponible', async () => {
    const resultado = await DbPool.query(
      `SELECT l.clave_libro,
              COUNT(e.ejemplar_id) FILTER (WHERE e.estado = 'DISPONIBLE')::INT AS disponibles,
              COUNT(e.ejemplar_id)::INT AS registrados
       FROM libro l LEFT JOIN ejemplar e ON e.libro_id = l.libro_id
       GROUP BY l.clave_libro`,
    );
    const porClave = Object.fromEntries(
      resultado.rows.map((fila) => [fila.clave_libro, [fila.disponibles, fila.registrados]]),
    );

    assert.deepEqual(porClave['COM-005.1-COR'], [2, 3]);
    assert.deepEqual(porClave['HIS-972-ESC'], [1, 2]);
    assert.deepEqual(porClave['LIT-863-PAZ'], [0, 1]);
    assert.deepEqual(porClave['CIE-530-HEW'], [0, 0]);
  });

  test('la búsqueda sin acentos encuentra "García Márquez"', async () => {
    const total = await contar(
      `SELECT COUNT(*) AS total FROM autor
       WHERE unaccent(primer_apellido) ILIKE unaccent($1)`,
      ['%garcia marquez%'],
    );
    assert.equal(total, 1);
  });
});

describe('Integridad de compras (HUCOM01)', () => {
  test('lo recibido de una partida no puede superar lo solicitado', async () => {
    const promesa = consultarSinGuardar(
      `UPDATE solicitud_partida SET cantidad_recibida = 4
       WHERE numero = 1 AND solicitud_adquisicion_id =
         (SELECT solicitud_adquisicion_id FROM solicitud_adquisicion WHERE folio = 'SOL-2402')`,
    );
    await assert.rejects(promesa, VIOLA_CHECK);
  });

  test('una solicitud no cambia de "Por autorizar" sin fecha de envío', async () => {
    const promesa = consultarSinGuardar(
      `UPDATE solicitud_adquisicion SET estado = 'EN_TESORERIA' WHERE folio = 'SOL-2418'`,
    );
    await assert.rejects(promesa, VIOLA_CHECK);
  });

  // Se lee la secuencia sin llamar nextval(), porque nextval() no se revierte con ROLLBACK
  test('el siguiente folio de recepción continúa después de los cargados', async () => {
    const resultado = await DbPool.query(
      'SELECT last_value::INT AS ultimo, is_called FROM seq_folio_recepcion',
    );
    assert.deepEqual(resultado.rows[0], { ultimo: 2, is_called: true });
  });
});
