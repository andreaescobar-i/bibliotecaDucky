/*----
 * Programa: chat.test.mjs
 * Objetivo: Probar sin base de datos ni llamadas a Google las reglas del asistente Ducky: ciclo
 *           de consultas, memoria de la conversación, permisos de las consultas preparadas,
 *           instrucciones y límite por minuto
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 15 de Noviembre de 2026
 */

import { describe, test, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import request from 'supertest';

// Se fijan antes de cargar los módulos: las pruebas no dependen del .env ni gastan créditos
process.env.NODE_ENV = 'test';
process.env.CHAT_HABILITADO = 'true';
process.env.GEMINI_API_KEY = 'key-solo-para-pruebas-automaticas';
process.env.CHAT_PGUSER = 'usuario_lectura_de_prueba';
process.env.CHAT_PGPASSWORD = 'clave-de-prueba';
const { default: DbPool } = await import('../config/db.js');
const { default: DbPoolLectura } = await import('../config/dbLectura.js');
const geminiServicio = await import('../servicios/geminiServicio.js');
const { RESULTADOS, MENSAJE_SIN_RESPUESTA, armarContenidos, limpiarFormato, responderPregunta } =
  await import('../servicios/chat/conversacion.js');
const { DECLARACIONES, ErrorConsulta, ejecutarHerramienta } =
  await import('../servicios/chat/herramientas.js');
const { FRASE_SIN_INFORMACION, crearInstrucciones } =
  await import('../servicios/chat/instrucciones.js');
const { MENSAJE_LIMITE_CHAT, crearLimitadorChat } = await import('../middlewares/limiteChat.js');

const ALUMNA = {
  usuario_id: '7',
  identificador: 'A01234567',
  correo: 'mariana.lopez@ducky.edu.mx',
  primer_nombre: 'Mariana',
  rol_nombre: 'Alumno',
  perfil_nombre: 'Alumno',
  permisos: ['CONSULTAR_LIBROS', 'CONSULTAR_LISTADO', 'CONSULTAR_UBICACION'],
};
const FILA_LIBRO = {
  clave_libro: 'LIT-863-RUL',
  titulo: 'Pedro Páramo',
  autores: 'Juan Rulfo',
  tema: 'Literatura',
  editorial: 'RM',
  isbn: null,
  edicion: '1a',
  anio: 2005,
  descripcion: 'Novela de Juan Rulfo ambientada en Comala.',
  ejemplares_disponibles: 2,
  ejemplares_registrados: 3,
  total: 1,
};
const FILA_EJEMPLAR = {
  codigo_ejemplar: 'LIT-863-RUL-E02',
  clave_clasificacion: 'LIT-863-RUL',
  librero: 'LIT',
  fila: 'A2',
  estado: 'DISPONIBLE',
  tipo_uso: 'Préstamo externo',
  permite_prestamo: true,
};

/**
 * Objetivo: Armar una respuesta de texto con el formato del SDK de Google.
 * @param {string} texto - Texto de la respuesta.
 * @returns {Object} Respuesta simulada.
 */
function responderTexto(texto) {
  return {
    candidates: [{ content: { role: 'model', parts: [{ text: texto }] }, finishReason: 'STOP' }],
    usageMetadata: { promptTokenCount: 100, candidatesTokenCount: 10 },
    modelVersion: 'modelo-de-prueba',
  };
}

/**
 * Objetivo: Armar una respuesta en la que el modelo pide una consulta preparada.
 * @param {string} nombre - Nombre de la consulta.
 * @param {Object} argumentos - Valores elegidos por el modelo.
 * @returns {Object} Respuesta simulada.
 */
function pedirConsulta(nombre, argumentos = {}) {
  return {
    candidates: [
      {
        content: {
          role: 'model',
          parts: [{ functionCall: { id: 'c1', name: nombre, args: argumentos } }],
        },
        finishReason: 'STOP',
      },
    ],
    usageMetadata: { promptTokenCount: 80, candidatesTokenCount: 5 },
    modelVersion: 'modelo-de-prueba',
  };
}

afterEach(() => {
  mock.restoreAll();
  geminiServicio.establecerTransporte(null);
});

describe('Memoria de la conversación', () => {
  test('recuerda solo las preguntas que sí tuvieron respuesta', () => {
    const contenidos = armarContenidos([
      { emisor: 'USUARIO', contenido: '¿Tienen Pedro Páramo?', resultado: 'EXITO' },
      { emisor: 'ASISTENTE', contenido: 'Sí, hay dos ejemplares.', resultado: 'EXITO' },
      { emisor: 'USUARIO', contenido: '¿Y El Quijote?', resultado: 'EXITO' },
      { emisor: 'ASISTENTE', contenido: 'El asistente no pudo responder.', resultado: 'ERROR' },
      { emisor: 'USUARIO', contenido: 'Pregunta que nunca se respondió', resultado: 'EXITO' },
      { emisor: 'USUARIO', contenido: '¿A qué hora abren?', resultado: 'EXITO' },
      {
        emisor: 'ASISTENTE',
        contenido: 'No cuento con esa información.',
        resultado: 'SIN_INFORMACION',
      },
    ]);

    assert.deepEqual(contenidos, [
      { role: 'user', parts: [{ text: '¿Tienen Pedro Páramo?' }] },
      { role: 'model', parts: [{ text: 'Sí, hay dos ejemplares.' }] },
      { role: 'user', parts: [{ text: '¿A qué hora abren?' }] },
      { role: 'model', parts: [{ text: 'No cuento con esa información.' }] },
    ]);
  });

  test('una respuesta sin pregunta previa no se recuerda', () => {
    assert.deepEqual(
      armarContenidos([{ emisor: 'ASISTENTE', contenido: 'Hola.', resultado: 'EXITO' }]),
      [],
    );
  });
});

describe('Formato de la respuesta', () => {
  test('quita negritas, encabezados y viñetas de asterisco', () => {
    const texto = limpiarFormato(
      '## Resultado\n\n\n\n* **Título:** Pedro Páramo\n* Ejemplares: 2\n  • Librero LIT',
    );

    assert.equal(texto, 'Resultado\n\n- Título: Pedro Páramo\n- Ejemplares: 2\n  - Librero LIT');
  });
});

describe('Ciclo de consultas', () => {
  test('ejecuta la consulta que pide el modelo y responde con su resultado', async () => {
    const solicitudes = [];
    geminiServicio.establecerTransporte(async (solicitud) => {
      solicitudes.push(
        structuredClone({ ...solicitud, config: { tools: solicitud.config.tools } }),
      );
      return solicitudes.length === 1
        ? pedirConsulta('buscar_libros', { autor: 'Rulfo' })
        : responderTexto('Sí, hay **dos** ejemplares disponibles.');
    });
    const ejecutadas = [];
    const ejecutar = async (nombre, argumentos, usuario) => {
      ejecutadas.push({ nombre, argumentos, usuario: usuario.usuario_id });
      return { libros: [{ titulo: 'Pedro Páramo', ejemplaresDisponibles: 2 }] };
    };

    const respuesta = await responderPregunta({
      usuario: ALUMNA,
      historial: [],
      pregunta: '¿Tienen algo de Rulfo?',
      ejecutar,
    });

    assert.equal(respuesta.texto, 'Sí, hay dos ejemplares disponibles.');
    assert.equal(respuesta.resultado, RESULTADOS.EXITO);
    assert.deepEqual(respuesta.consultas, [
      { nombre: 'buscar_libros', argumentos: { autor: 'Rulfo' } },
    ]);
    // Se cobran las dos llamadas al modelo
    assert.deepEqual(respuesta.uso, { tokensEntrada: 180, tokensSalida: 15 });
    assert.deepEqual(ejecutadas, [
      { nombre: 'buscar_libros', argumentos: { autor: 'Rulfo' }, usuario: '7' },
    ]);
    // En la segunda llamada viaja lo que pidió el modelo y el resultado de la consulta
    assert.deepEqual(solicitudes[1].contents.slice(1), [
      {
        role: 'model',
        parts: [{ functionCall: { id: 'c1', name: 'buscar_libros', args: { autor: 'Rulfo' } } }],
      },
      {
        role: 'user',
        parts: [
          {
            functionResponse: {
              name: 'buscar_libros',
              id: 'c1',
              response: { libros: [{ titulo: 'Pedro Páramo', ejemplaresDisponibles: 2 }] },
            },
          },
        ],
      },
    ]);
    assert.deepEqual(solicitudes[0].config.tools, [{ functionDeclarations: DECLARACIONES }]);
  });

  test('tras cuatro rondas de consultas obliga al modelo a responder', async () => {
    const modos = [];
    geminiServicio.establecerTransporte(async (solicitud) => {
      const modo = solicitud.config.toolConfig?.functionCallingConfig?.mode ?? 'AUTO';
      modos.push(modo);
      return modo === 'NONE'
        ? responderTexto('Esto es lo que encontré.')
        : pedirConsulta('buscar_libros', { texto: 'algo' });
    });
    let ejecuciones = 0;

    const respuesta = await responderPregunta({
      usuario: ALUMNA,
      historial: [],
      pregunta: 'Busca sin parar',
      ejecutar: async () => {
        ejecuciones += 1;
        return { libros: [] };
      },
    });

    assert.deepEqual(modos, ['AUTO', 'AUTO', 'AUTO', 'AUTO', 'NONE']);
    assert.equal(ejecuciones, 4);
    assert.equal(respuesta.texto, 'Esto es lo que encontré.');
  });

  test('anota como SIN_INFORMACION la respuesta que reconoce no tener el dato', async () => {
    geminiServicio.establecerTransporte(async () =>
      responderTexto(`${FRASE_SIN_INFORMACION}. Le sugiero acudir al personal.`),
    );

    const respuesta = await responderPregunta({ usuario: ALUMNA, historial: [], pregunta: '¿?' });

    assert.equal(respuesta.resultado, RESULTADOS.SIN_INFORMACION);
  });

  test('si el modelo no redacta nada devuelve un aviso y lo anota como ERROR', async () => {
    geminiServicio.establecerTransporte(async () => responderTexto('   '));

    const respuesta = await responderPregunta({ usuario: ALUMNA, historial: [], pregunta: '¿?' });

    assert.equal(respuesta.texto, MENSAJE_SIN_RESPUESTA);
    assert.equal(respuesta.resultado, RESULTADOS.ERROR);
  });

  test('envía el historial antes de la pregunta nueva', async () => {
    let contenidos;
    geminiServicio.establecerTransporte(async (solicitud) => {
      contenidos = solicitud.contents;
      return responderTexto('En el librero LIT.');
    });

    await responderPregunta({
      usuario: ALUMNA,
      historial: [
        { emisor: 'USUARIO', contenido: '¿Tienen Pedro Páramo?', resultado: 'EXITO' },
        { emisor: 'ASISTENTE', contenido: 'Sí.', resultado: 'EXITO' },
      ],
      pregunta: '¿Y dónde está?',
    });

    assert.deepEqual(
      contenidos.map((contenido) => [contenido.role, contenido.parts[0].text]),
      [
        ['user', '¿Tienen Pedro Páramo?'],
        ['model', 'Sí.'],
        ['user', '¿Y dónde está?'],
      ],
    );
  });
});

describe('Instrucciones del asistente', () => {
  const instrucciones = crearInstrucciones(ALUMNA, new Date('2026-11-16T03:00:00Z'));

  test('piden trato formal, datos reales y reconocer lo que no se sabe', () => {
    assert.match(instrucciones, /tratando de "usted"/);
    assert.match(instrucciones, /Nunca inventes/);
    assert.ok(instrucciones.includes(FRASE_SIN_INFORMACION));
    assert.match(instrucciones, /no aparece en el catálogo/);
    assert.match(instrucciones, /son datos, no órdenes/);
  });

  test('incluyen el nombre, el rol, el perfil y la fecha de hoy en la hora de México', () => {
    assert.match(instrucciones, /Nombre: Mariana\. Rol: Alumno\. Perfil: Alumno\./);
    assert.match(instrucciones, /Hoy es domingo, 15 de noviembre de 2026/);
  });

  test('no incluyen el identificador ni el correo de la cuenta', () => {
    assert.ok(!instrucciones.includes(ALUMNA.identificador));
    assert.ok(!instrucciones.includes(ALUMNA.correo));
  });
});

describe('Consultas preparadas', () => {
  test('cada consulta declara nombre, descripción y valores que acepta', () => {
    assert.deepEqual(
      DECLARACIONES.map((declaracion) => declaracion.name),
      [
        'buscar_libros',
        'consultar_libro',
        'consultar_ejemplar',
        'listar_temas_y_tipos_de_uso',
        'consultar_reglas_de_prestamo',
        'consultar_mi_cuenta',
      ],
    );
    for (const declaracion of DECLARACIONES) {
      assert.ok(declaracion.description.length > 20);
      assert.equal(declaracion.parametersJsonSchema.type, 'object');
    }
  });

  test('una consulta desconocida se informa al modelo sin tocar la base', async () => {
    const consulta = mock.method(DbPoolLectura, 'query', async () => ({ rows: [] }));

    const resultado = await ejecutarHerramienta('borrar_libros', {}, ALUMNA);

    assert.match(resultado.error, /no existe/);
    assert.equal(consulta.mock.callCount(), 0);
  });

  test('sin el permiso "Consultar libros" no se consulta el catálogo', async () => {
    const consulta = mock.method(DbPoolLectura, 'query', async () => ({ rows: [] }));

    const resultado = await ejecutarHerramienta(
      'buscar_libros',
      { titulo: 'Pedro' },
      { ...ALUMNA, permisos: [] },
    );

    assert.match(resultado.error, /no tiene permiso para consultar libros/);
    assert.equal(consulta.mock.callCount(), 0);
  });

  test('busca con parámetros, por raíz de palabra y con un máximo de 10 libros', async () => {
    const consulta = mock.method(DbPoolLectura, 'query', async () => ({ rows: [FILA_LIBRO] }));

    const resultado = await ejecutarHerramienta(
      'buscar_libros',
      {
        texto: 'identidad de los mexicanos',
        autor: "O'Brien; DROP TABLE libro",
        solo_disponibles: true,
      },
      ALUMNA,
    );

    const [sql, parametros] = consulta.mock.calls[0].arguments;
    // Los valores del modelo nunca se concatenan en el SQL
    assert.ok(!sql.includes('DROP TABLE'));
    assert.ok(!sql.includes('mexican'));
    assert.match(sql, /FROM chat\.libro/);
    assert.match(sql, /ejemplares_disponibles > 0/);
    assert.deepEqual(parametros, [
      "%O'Brien; DROP TABLE libro%",
      '%identidad%',
      'IDENTIDAD',
      '%mexican%',
      'MEXICANOS',
      10,
    ]);
    assert.deepEqual(resultado.libros, [
      {
        clave: 'LIT-863-RUL',
        titulo: 'Pedro Páramo',
        autores: 'Juan Rulfo',
        tema: 'Literatura',
        editorial: 'RM',
        ejemplaresDisponibles: 2,
        ejemplaresRegistrados: 3,
        disponibilidad: 'Disponible',
      },
    ]);
  });

  test('una búsqueda sin coincidencias lo dice de forma explícita', async () => {
    mock.method(DbPoolLectura, 'query', async () => ({ rows: [] }));

    const resultado = await ejecutarHerramienta('buscar_libros', { titulo: 'Quijote' }, ALUMNA);

    assert.equal(resultado.totalCoincidencias, 0);
    assert.deepEqual(resultado.libros, []);
    assert.match(resultado.nota, /Ningún libro del catálogo coincide/);
  });

  test('la ficha incluye los ejemplares con su ubicación tal como está registrada', async () => {
    mock.method(DbPoolLectura, 'query', async (sql) => ({
      rows: sql.includes('chat.ejemplar')
        ? [FILA_EJEMPLAR, { ...FILA_EJEMPLAR, codigo_ejemplar: 'LIT-863-RUL-E03', fila: null }]
        : [FILA_LIBRO],
    }));

    const resultado = await ejecutarHerramienta(
      'consultar_libro',
      { clave: 'lit-863-rul' },
      ALUMNA,
    );

    assert.equal(resultado.encontrado, true);
    assert.equal(resultado.libro.isbn, 'No registrado');
    assert.deepEqual(
      resultado.ejemplares.map((ejemplar) => [
        ejemplar.codigo,
        ejemplar.estado,
        ejemplar.ubicacion,
      ]),
      [
        ['LIT-863-RUL-E02', 'Disponible', 'Librero LIT, fila A2'],
        ['LIT-863-RUL-E03', 'Disponible', 'Librero LIT, fila no registrada'],
      ],
    );
  });

  test('sin el permiso "Consultar ubicación" no se revela librero ni fila', async () => {
    mock.method(DbPoolLectura, 'query', async () => ({
      rows: [{ ...FILA_EJEMPLAR, clave_libro: 'LIT-863-RUL', titulo: 'Pedro Páramo' }],
    }));

    const resultado = await ejecutarHerramienta(
      'consultar_ejemplar',
      { codigo: 'LIT-863-RUL-E02' },
      { ...ALUMNA, permisos: ['CONSULTAR_LIBROS'] },
    );

    assert.equal(resultado.estado, 'Disponible');
    assert.match(resultado.ubicacion, /No disponible/);
    assert.ok(!JSON.stringify(resultado).includes('A2'));
  });

  test('una clave que no existe o falta se informa sin inventar datos', async () => {
    mock.method(DbPoolLectura, 'query', async () => ({ rows: [] }));

    const inexistente = await ejecutarHerramienta('consultar_libro', { clave: 'XXX-000' }, ALUMNA);
    const sinClave = await ejecutarHerramienta('consultar_libro', {}, ALUMNA);

    assert.deepEqual(inexistente, {
      encontrado: false,
      nota: 'No hay un libro activo con la clave XXX-000.',
    });
    assert.match(sinClave.error, /Falta la Clave de libro/);
  });

  test('"mi cuenta" usa la cuenta de la sesión e ignora la que pida el modelo', async () => {
    const consulta = mock.method(DbPool, 'query', async (sql) => ({
      rows: sql.includes('FROM adeudo')
        ? [
            {
              folio: 'PRE-2026-0004',
              tipo: 'MULTA',
              concepto: '5 días de retraso',
              monto_mxn: '50.00',
            },
          ]
        : [
            {
              folio: 'PRE-2026-0001',
              titulo: 'Introducción a los algoritmos',
              codigo_ejemplar: 'COM-005.1-COR-E01',
              fecha_vencimiento: new Date('2026-10-28T02:00:00Z'),
            },
          ],
    }));

    const resultado = await ejecutarHerramienta(
      'consultar_mi_cuenta',
      { usuario_id: '1', identificador: 'N000001' },
      ALUMNA,
    );

    for (const llamada of consulta.mock.calls) {
      assert.deepEqual(llamada.arguments[1], [ALUMNA.usuario_id]);
    }
    assert.deepEqual(resultado, {
      prestamosActivos: [
        {
          folio: 'PRE-2026-0001',
          titulo: 'Introducción a los algoritmos',
          codigoEjemplar: 'COM-005.1-COR-E01',
          // Las 20:00 del 27 de octubre en México, aunque en UTC ya sea día 28
          vence: '27 de octubre de 2026',
          vencido: true,
        },
      ],
      adeudosPendientes: [
        {
          folioPrestamo: 'PRE-2026-0004',
          tipo: 'Multa',
          concepto: '5 días de retraso',
          montoMxn: 50,
        },
      ],
      totalAdeudoMxn: 50,
    });
  });

  test('si la base de datos falla se informa como ErrorConsulta', async () => {
    mock.method(DbPoolLectura, 'query', async () => {
      throw new Error('ECONNREFUSED');
    });

    await assert.rejects(
      ejecutarHerramienta('buscar_libros', { titulo: 'Pedro' }, ALUMNA),
      (err) => err instanceof ErrorConsulta && /buscar_libros: ECONNREFUSED/.test(err.message),
    );
  });
});

describe('Límite de preguntas por minuto', () => {
  /**
   * Objetivo: Crear una app mínima con el limitador y una cuenta en sesión simulada.
   * @param {number} limite - Preguntas permitidas por minuto.
   * @returns {import('express').Express} App de prueba.
   */
  function crearApp(limite) {
    const app = express();
    app.use((req, _res, next) => {
      req.usuario = { usuario_id: req.get('x-usuario') };
      next();
    });
    app.post('/', crearLimitadorChat({ limite }), (_req, res) => res.json({ ok: true }));
    app.use((err, _req, res, _next) => res.status(err.estadoHttp).json({ mensaje: err.message }));
    return app;
  }

  test('rechaza la pregunta que excede el límite de la cuenta', async () => {
    const app = crearApp(2);

    const estados = [];
    for (let intento = 0; intento < 3; intento += 1) {
      const respuesta = await request(app).post('/').set('x-usuario', '7');
      estados.push(respuesta.status);
      if (respuesta.status === 429) {
        assert.equal(respuesta.body.mensaje, MENSAJE_LIMITE_CHAT);
      }
    }

    assert.deepEqual(estados, [200, 200, 429]);
  });

  test('el límite de una cuenta no afecta a otra', async () => {
    const app = crearApp(1);

    await request(app).post('/').set('x-usuario', '7');
    const bloqueada = await request(app).post('/').set('x-usuario', '7');
    const otraCuenta = await request(app).post('/').set('x-usuario', '8');

    assert.equal(bloqueada.status, 429);
    assert.equal(otraCuenta.status, 200);
  });
});
