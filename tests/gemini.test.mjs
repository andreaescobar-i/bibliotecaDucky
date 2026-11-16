/*----
 * Programa: gemini.test.mjs
 * Objetivo: Probar el servicio de Gemini sin llamar a Google: formato de la respuesta, consultas
 *           que pide el modelo, reintento por saturación, tiempo máximo y clasificación de errores
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 15 de Noviembre de 2026
 */

import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';

// Se fijan antes de cargar el servicio: las pruebas no dependen del .env ni gastan créditos
const KEY_PRUEBA = 'key-solo-para-pruebas-automaticas';
process.env.NODE_ENV = 'test';
process.env.CHAT_HABILITADO = 'true';
process.env.GEMINI_API_KEY = KEY_PRUEBA;
process.env.GEMINI_MODELO = 'modelo-de-prueba';
const { CODIGOS_ERROR, ErrorGemini, establecerTransporte, estaDisponible, generarRespuesta } =
  await import('../servicios/geminiServicio.js');

const PREGUNTA = [{ role: 'user', parts: [{ text: '¿Tienen Pedro Páramo?' }] }];
const SIN_PAUSA = { esperaReintentoMs: 1 };

/**
 * Objetivo: Armar una respuesta con el formato del SDK de Google.
 * @param {Object[]} partes - Partes del contenido (texto o llamadas a consultas).
 * @param {Object} [extra] - Campos adicionales de la respuesta.
 * @returns {Object} Respuesta simulada.
 */
function crearRespuesta(partes, extra = {}) {
  return {
    candidates: [{ content: { role: 'model', parts: partes }, finishReason: 'STOP' }],
    usageMetadata: { promptTokenCount: 30, candidatesTokenCount: 12 },
    modelVersion: 'modelo-de-prueba-001',
    ...extra,
  };
}

/**
 * Objetivo: Crear un error como los que lanza el SDK ante una respuesta HTTP de error.
 * @param {number} status - Código HTTP.
 * @param {string} [mensaje] - Mensaje del error.
 * @returns {Error} Error con la propiedad status.
 */
function crearErrorHttp(status, mensaje = `HTTP ${status}`) {
  return Object.assign(new Error(mensaje), { status });
}

afterEach(() => establecerTransporte(null));

test('el asistente está disponible cuando hay key y no se apagó', () => {
  assert.equal(estaDisponible(), true);
});

test('sin simulación, las pruebas nunca llaman a Google', async () => {
  await assert.rejects(generarRespuesta({ contenidos: PREGUNTA }), {
    name: 'ErrorGemini',
    codigo: CODIGOS_ERROR.FALLA,
    message: /Las pruebas no llaman a Gemini/,
  });
});

test('envía modelo, conversación, instrucciones y consultas con el formato del SDK', async () => {
  let recibida;
  establecerTransporte(async (solicitud) => {
    recibida = solicitud;
    return crearRespuesta([{ text: 'Sí.' }]);
  });
  const herramientas = [{ name: 'buscar_libros', description: 'Busca libros' }];

  await generarRespuesta({
    contenidos: PREGUNTA,
    instrucciones: 'Responde de manera formal.',
    herramientas,
    maxTokensSalida: 100,
  });

  assert.equal(recibida.model, 'modelo-de-prueba');
  assert.deepEqual(recibida.contents, PREGUNTA);
  assert.equal(recibida.config.systemInstruction, 'Responde de manera formal.');
  assert.deepEqual(recibida.config.tools, [{ functionDeclarations: herramientas }]);
  assert.equal(recibida.config.maxOutputTokens, 100);
  assert.ok(recibida.config.temperature <= 0.3);
  assert.ok(recibida.config.abortSignal instanceof AbortSignal);
});

test('sin instrucciones ni consultas no envía esos campos', async () => {
  let recibida;
  establecerTransporte(async (solicitud) => {
    recibida = solicitud;
    return crearRespuesta([{ text: 'Sí.' }]);
  });

  await generarRespuesta({ contenidos: PREGUNTA });

  assert.ok(!('systemInstruction' in recibida.config));
  assert.ok(!('tools' in recibida.config));
});

test('devuelve el texto sin el razonamiento interno y suma los tokens que se cobran', async () => {
  establecerTransporte(async () =>
    crearRespuesta(
      [
        { text: 'Debo revisar el catálogo.', thought: true },
        { text: 'Sí, hay dos ejemplares ' },
        { text: 'disponibles.' },
      ],
      { usageMetadata: { promptTokenCount: 30, candidatesTokenCount: 12, thoughtsTokenCount: 8 } },
    ),
  );

  const respuesta = await generarRespuesta({ contenidos: PREGUNTA });

  assert.equal(respuesta.texto, 'Sí, hay dos ejemplares disponibles.');
  assert.deepEqual(respuesta.llamadas, []);
  assert.deepEqual(respuesta.uso, { tokensEntrada: 30, tokensSalida: 20 });
  assert.equal(respuesta.modelo, 'modelo-de-prueba-001');
  assert.equal(respuesta.motivoFin, 'STOP');
});

test('entrega las consultas que pide el modelo y su contenido para el siguiente turno', async () => {
  const partes = [
    { functionCall: { id: 'c1', name: 'buscar_libros', args: { autor: 'Rulfo' } } },
    { functionCall: { name: 'listar_temas' } },
  ];
  establecerTransporte(async () => crearRespuesta(partes));

  const respuesta = await generarRespuesta({ contenidos: PREGUNTA });

  assert.equal(respuesta.texto, '');
  assert.deepEqual(respuesta.llamadas, [
    { id: 'c1', nombre: 'buscar_libros', argumentos: { autor: 'Rulfo' } },
    { id: null, nombre: 'listar_temas', argumentos: {} },
  ]);
  assert.deepEqual(respuesta.contenidoModelo, { role: 'model', parts: partes });
});

test('si Google está saturado reintenta una vez y responde', async () => {
  let intentos = 0;
  establecerTransporte(async () => {
    intentos += 1;
    if (intentos === 1) {
      throw crearErrorHttp(429);
    }
    return crearRespuesta([{ text: 'Listo.' }]);
  });

  const respuesta = await generarRespuesta({ contenidos: PREGUNTA, ...SIN_PAUSA });

  assert.equal(intentos, 2);
  assert.equal(respuesta.texto, 'Listo.');
});

test('si sigue saturado tras el reintento informa SATURADO, sin más intentos', async () => {
  let intentos = 0;
  establecerTransporte(async () => {
    intentos += 1;
    throw crearErrorHttp(503);
  });

  await assert.rejects(generarRespuesta({ contenidos: PREGUNTA, ...SIN_PAUSA }), {
    codigo: CODIGOS_ERROR.SATURADO,
  });
  assert.equal(intentos, 2);
});

const ERRORES_SIN_REINTENTO = [
  [401, CODIGOS_ERROR.CREDENCIAL],
  [403, CODIGOS_ERROR.CREDENCIAL],
  [404, CODIGOS_ERROR.MODELO],
  [500, CODIGOS_ERROR.FALLA],
];
for (const [status, codigo] of ERRORES_SIN_REINTENTO) {
  test(`un error ${status} se informa como ${codigo} y no se reintenta`, async () => {
    let intentos = 0;
    establecerTransporte(async () => {
      intentos += 1;
      throw crearErrorHttp(status);
    });

    await assert.rejects(generarRespuesta({ contenidos: PREGUNTA, ...SIN_PAUSA }), { codigo });
    assert.equal(intentos, 1);
  });
}

test('si el modelo no responde a tiempo cancela la llamada e informa TIEMPO', async () => {
  let cancelada = false;
  establecerTransporte(
    (solicitud) =>
      new Promise((_resolver, rechazar) => {
        solicitud.config.abortSignal.addEventListener('abort', () => {
          cancelada = true;
          rechazar(new Error('cancelada'));
        });
      }),
  );

  await assert.rejects(generarRespuesta({ contenidos: PREGUNTA, esperaMs: 20 }), {
    codigo: CODIGOS_ERROR.TIEMPO,
  });
  assert.equal(cancelada, true);
});

test('una respuesta cortada por los filtros de Google se informa como BLOQUEADO', async () => {
  establecerTransporte(async () => ({ promptFeedback: { blockReason: 'SAFETY' } }));
  await assert.rejects(generarRespuesta({ contenidos: PREGUNTA }), {
    codigo: CODIGOS_ERROR.BLOQUEADO,
  });

  establecerTransporte(async () => ({
    candidates: [{ content: { parts: [] }, finishReason: 'PROHIBITED_CONTENT' }],
  }));
  await assert.rejects(generarRespuesta({ contenidos: PREGUNTA }), {
    codigo: CODIGOS_ERROR.BLOQUEADO,
  });
});

test('la key nunca aparece en el mensaje de un error', async () => {
  establecerTransporte(async () => {
    throw crearErrorHttp(500, `Falló la petición con la key ${KEY_PRUEBA} en la cabecera`);
  });

  await assert.rejects(generarRespuesta({ contenidos: PREGUNTA }), (err) => {
    assert.ok(err instanceof ErrorGemini);
    assert.ok(!err.message.includes(KEY_PRUEBA));
    assert.match(err.message, /<key>/);
    return true;
  });
});
