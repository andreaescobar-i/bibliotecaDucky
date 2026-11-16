/*----
 * Programa: chatBaseDatos.test.mjs
 * Objetivo: Comprobar contra PostgreSQL real que la base quedó lista para el asistente Ducky:
 *           control de migraciones, historial de conversaciones, vistas de solo consulta y
 *           límites del usuario de solo lectura.
 *           Requiere npm run db:reset o npm run db:migrar. Uso: npm run test:bd
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 15 de Noviembre de 2026
 */

import { describe, test, after } from 'node:test';
import assert from 'node:assert/strict';
import DbPool from '../../config/db.js';
import DbPoolLectura from '../../config/dbLectura.js';
import ENTORNO from '../../config/entorno.js';
import { listarMigraciones } from '../../db/utilidadesMigracion.js';

// Códigos de error de PostgreSQL
const VIOLA_CHECK = { code: '23514' };
const SIN_PERMISO = { code: '42501' };
const SOLO_LECTURA = '25006';
const SIN_USUARIO_LECTURA =
  'Faltan CHAT_PGUSER y CHAT_PGPASSWORD en .env (o falta ejecutar npm run db:migrar)';

/**
 * Objetivo: Ejecutar varias consultas en una transacción que siempre se revierte, para que las
 *   pruebas no dejen conversaciones guardadas.
 * @param {(cliente: import('pg').PoolClient) => Promise<any>} operacion - Consultas a ejecutar.
 * @returns {Promise<any>} Lo que devuelva la operación.
 */
async function ejecutarSinGuardar(operacion) {
  const cliente = await DbPool.connect();
  try {
    await cliente.query('BEGIN');
    return await operacion(cliente);
  } finally {
    await cliente.query('ROLLBACK');
    cliente.release();
  }
}

/**
 * Objetivo: Abrir una conversación de prueba para la alumna Mariana López.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción en curso.
 * @returns {Promise<string>} id_sesion de la conversación creada.
 */
async function abrirConversacion(cliente) {
  const resultado = await cliente.query(
    `INSERT INTO sesion_chat (id_usuario, canal, estatus)
     SELECT usuario_id, 'WEB', 'ABIERTA' FROM usuario WHERE identificador = 'A01234567'
     RETURNING id_sesion`,
  );
  return resultado.rows[0].id_sesion;
}

after(async () => {
  await DbPool.end();
  await DbPoolLectura?.end();
});

describe('Control de migraciones', () => {
  test('todas las migraciones del proyecto están aplicadas y registradas', async () => {
    const resultado = await DbPool.query('SELECT archivo FROM migracion_aplicada');
    const registradas = resultado.rows.map((fila) => fila.archivo);

    for (const migracion of listarMigraciones()) {
      assert.ok(
        registradas.includes(migracion.nombre),
        `Falta aplicar ${migracion.nombre}: ejecuta npm run db:migrar`,
      );
    }
  });
});

describe('Historial de conversaciones', () => {
  test('un mensaje guarda modelo, tokens y consultas, con resultado EXITO por omisión', async () => {
    await ejecutarSinGuardar(async (cliente) => {
      const sesion = await abrirConversacion(cliente);
      const resultado = await cliente.query(
        `INSERT INTO mensaje_chat
           (id_sesion, emisor, contenido, modelo, tokens_entrada, tokens_salida, herramientas)
         VALUES ($1, 'ASISTENTE', 'Hay dos ejemplares disponibles.', 'modelo-de-prueba', 120, 18,
                 '[{"nombre": "buscar_libros"}]')
         RETURNING resultado, herramientas`,
        [sesion],
      );

      assert.equal(resultado.rows[0].resultado, 'EXITO');
      assert.deepEqual(resultado.rows[0].herramientas, [{ nombre: 'buscar_libros' }]);
    });
  });

  const MENSAJES_INVALIDOS = [
    ['un emisor desconocido', `'SISTEMA', 'Hola', 'EXITO', 10`],
    ['un mensaje vacío', `'USUARIO', '   ', 'EXITO', 10`],
    ['un resultado desconocido', `'USUARIO', 'Hola', 'OTRO', 10`],
    ['tokens negativos', `'USUARIO', 'Hola', 'EXITO', -1`],
  ];
  for (const [caso, valores] of MENSAJES_INVALIDOS) {
    test(`rechaza ${caso}`, async () => {
      await ejecutarSinGuardar(async (cliente) => {
        const sesion = await abrirConversacion(cliente);
        await assert.rejects(
          cliente.query(
            `INSERT INTO mensaje_chat (id_sesion, emisor, contenido, resultado, tokens_entrada)
             VALUES ($1, ${valores})`,
            [sesion],
          ),
          VIOLA_CHECK,
        );
      });
    });
  }

  test('rechaza un canal o un estatus de conversación desconocido', async () => {
    for (const [canal, estatus] of [
      ['SMS', 'ABIERTA'],
      ['WEB', 'PAUSADA'],
    ]) {
      await ejecutarSinGuardar(async (cliente) => {
        await assert.rejects(
          cliente.query(
            `INSERT INTO sesion_chat (id_usuario, canal, estatus)
             SELECT usuario_id, $1, $2 FROM usuario WHERE identificador = 'A01234567'`,
            [canal, estatus],
          ),
          VIOLA_CHECK,
        );
      });
    }
  });

  test('una conversación cerrada exige fecha de fin y una abierta no la admite', async () => {
    await ejecutarSinGuardar(async (cliente) => {
      const sesion = await abrirConversacion(cliente);
      await assert.rejects(
        cliente.query("UPDATE sesion_chat SET estatus = 'CERRADA' WHERE id_sesion = $1", [sesion]),
        VIOLA_CHECK,
      );
    });
    await ejecutarSinGuardar(async (cliente) => {
      const sesion = await abrirConversacion(cliente);
      const resultado = await cliente.query(
        `UPDATE sesion_chat SET estatus = 'CERRADA', fecha_fin = now() + INTERVAL '1 minute'
         WHERE id_sesion = $1 RETURNING estatus`,
        [sesion],
      );
      assert.equal(resultado.rows[0].estatus, 'CERRADA');
    });
  });
});

describe('Vistas de solo consulta del asistente', () => {
  test('chat.libro muestra autores y cuenta ejemplares sin los dados de baja', async () => {
    const resultado = await DbPool.query(
      `SELECT clave_libro, autores, tema, ejemplares_disponibles, ejemplares_registrados
       FROM chat.libro
       WHERE clave_libro IN ('LIT-863-RUL', 'COM-005.1-COR', 'CIE-530-HEW', 'HIS-972-ESC')
       ORDER BY clave_libro`,
    );

    assert.deepEqual(resultado.rows, [
      // Sin ejemplares registrados
      {
        clave_libro: 'CIE-530-HEW',
        autores: 'Paul G. Hewitt',
        tema: 'Ciencias',
        ejemplares_disponibles: 0,
        ejemplares_registrados: 0,
      },
      // Dos autores en orden; un ejemplar prestado
      {
        clave_libro: 'COM-005.1-COR',
        autores: 'Thomas H. Cormen; Charles E. Leiserson',
        tema: 'Computación',
        ejemplares_disponibles: 2,
        ejemplares_registrados: 3,
      },
      // Un ejemplar dado de baja que ya no cuenta
      {
        clave_libro: 'HIS-972-ESC',
        autores: 'Pablo Escalante Gonzalbo',
        tema: 'Historia',
        ejemplares_disponibles: 1,
        ejemplares_registrados: 1,
      },
      {
        clave_libro: 'LIT-863-RUL',
        autores: 'Juan Rulfo',
        tema: 'Literatura',
        ejemplares_disponibles: 2,
        ejemplares_registrados: 3,
      },
    ]);
  });

  test('chat.ejemplar omite los dados de baja y conserva la ubicación incompleta', async () => {
    const resultado = await DbPool.query(
      `SELECT codigo_ejemplar, librero, fila, estado, tipo_uso, permite_prestamo
       FROM chat.ejemplar
       WHERE codigo_ejemplar IN ('HIS-972-ESC-E01', 'HIS-972-ESC-E02', 'MAT-515-STE-E05',
                                 'LIT-863-RUL-E01')
       ORDER BY codigo_ejemplar`,
    );

    assert.deepEqual(resultado.rows, [
      {
        codigo_ejemplar: 'HIS-972-ESC-E01',
        librero: 'HIS',
        fila: 'C1',
        estado: 'DISPONIBLE',
        tipo_uso: 'Consulta interna',
        permite_prestamo: false,
      },
      {
        codigo_ejemplar: 'LIT-863-RUL-E01',
        librero: 'LIT',
        fila: 'A2',
        estado: 'PRESTADO',
        tipo_uso: 'Préstamo externo',
        permite_prestamo: true,
      },
      {
        codigo_ejemplar: 'MAT-515-STE-E05',
        librero: null,
        fila: null,
        estado: 'DISPONIBLE',
        tipo_uso: 'Reservado',
        permite_prestamo: false,
      },
    ]);
  });

  test('las reglas de préstamo indican a qué roles aplican', async () => {
    const resultado = await DbPool.query(
      'SELECT nombre, dias_habiles, max_renovaciones, roles FROM chat.regla_prestamo ORDER BY 1',
    );

    assert.deepEqual(resultado.rows, [
      { nombre: 'Alumnos', dias_habiles: 5, max_renovaciones: 2, roles: 'Alumno, Colaborador' },
      { nombre: 'Maestros', dias_habiles: 10, max_renovaciones: 3, roles: 'Maestro' },
    ]);
  });

  test('las vistas no exponen cuentas, precios ni datos internos', async () => {
    const resultado = await DbPool.query(
      `SELECT table_name, column_name FROM information_schema.columns
       WHERE table_schema = 'chat' ORDER BY table_name, ordinal_position`,
    );
    const columnas = {};
    for (const fila of resultado.rows) {
      (columnas[fila.table_name] ??= []).push(fila.column_name);
    }

    assert.deepEqual(columnas, {
      ejemplar: [
        'clave_libro',
        'titulo',
        'codigo_ejemplar',
        'clave_clasificacion',
        'librero',
        'fila',
        'estado',
        'tipo_uso',
        'permite_prestamo',
      ],
      libro: [
        'clave_libro',
        'titulo',
        'autores',
        'tema',
        'editorial',
        'isbn',
        'edicion',
        'anio',
        'descripcion',
        'ejemplares_disponibles',
        'ejemplares_registrados',
      ],
      regla_prestamo: ['nombre', 'dias_habiles', 'max_renovaciones', 'vigente_desde', 'roles'],
      tema: ['nombre', 'descripcion', 'libros'],
      tipo_uso: ['nombre', 'permite_prestamo', 'descripcion'],
    });
  });
});

describe(
  'Usuario de solo lectura del asistente',
  { skip: !DbPoolLectura && SIN_USUARIO_LECTURA },
  () => {
    test('se conecta con CHAT_PGUSER, sin privilegios de administración', async () => {
      const resultado = await DbPoolLectura.query(
        `SELECT current_user AS usuario, rolsuper, rolcreaterole, rolcreatedb
       FROM pg_roles WHERE rolname = current_user`,
      );

      assert.deepEqual(resultado.rows[0], {
        usuario: ENTORNO.CHAT_BD.user,
        rolsuper: false,
        rolcreaterole: false,
        rolcreatedb: false,
      });
    });

    test('consulta el catálogo por las vistas, sin acentos ni mayúsculas', async () => {
      const resultado = await DbPoolLectura.query(
        `SELECT titulo, ejemplares_disponibles FROM chat.libro
       WHERE unaccent(titulo) ILIKE unaccent($1)`,
        ['%pedro paramo%'],
      );

      assert.deepEqual(resultado.rows, [{ titulo: 'Pedro Páramo', ejemplares_disponibles: 2 }]);
    });

    const TABLAS_PROHIBIDAS = [
      'public.usuario',
      'public.registro_auditoria',
      'public.prestamo',
      'public.adeudo',
      'public.libro',
      'public.mensaje_chat',
      'public.migracion_aplicada',
      'externo.ciaa_alumno',
    ];
    for (const tabla of TABLAS_PROHIBIDAS) {
      test(`no puede leer ${tabla}`, async () => {
        await assert.rejects(DbPoolLectura.query(`SELECT * FROM ${tabla} LIMIT 1`), SIN_PERMISO);
      });
    }

    test('no puede modificar nada: la sesión es de solo lectura', async () => {
      const intentos = [
        "UPDATE public.libro SET titulo = 'x'",
        'DELETE FROM public.ejemplar',
        "INSERT INTO public.categoria (nombre) VALUES ('x')",
        'CREATE TABLE public.intruso (id INT)',
      ];
      for (const sql of intentos) {
        await assert.rejects(DbPoolLectura.query(sql), (err) =>
          [SOLO_LECTURA, SIN_PERMISO.code].includes(err.code),
        );
      }
    });

    test('aunque desactive el modo de solo lectura, los permisos lo siguen impidiendo', async () => {
      const cliente = await DbPoolLectura.connect();
      try {
        await cliente.query('SET default_transaction_read_only = off');
        const intentos = [
          "UPDATE public.libro SET titulo = 'x'",
          'DELETE FROM public.ejemplar',
          'CREATE TABLE public.intruso (id INT)',
          'CREATE TABLE chat.intruso (id INT)',
          'DROP VIEW chat.libro',
        ];
        for (const sql of intentos) {
          await assert.rejects(cliente.query(sql), SIN_PERMISO);
        }
      } finally {
        // La conexión no se reutiliza: quedó con el modo de solo lectura desactivado
        cliente.release(true);
      }
    });
  },
);
