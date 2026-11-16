/*----
 * Programa: chat.test.mjs
 * Objetivo: Probar contra PostgreSQL real las rutas del asistente Ducky: sesión obligatoria,
 *           consultas con el usuario de solo lectura, historial, reinicio, duración de las
 *           conversaciones, validaciones y fallas del modelo. Gemini se simula: no se llama a Google ni se gastan créditos.
 *           Requiere npm run db:reset o npm run db:migrar. Uso: npm run test:bd
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 15 de Noviembre de 2026
 */

import { describe, test, before, after, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

process.env.NODE_ENV = 'test';
process.env.CHAT_HABILITADO = 'true';
process.env.GEMINI_API_KEY = 'key-solo-para-pruebas-automaticas';
const { app, DbPool, iniciarSesion } = await import('./ayudantes.mjs');
const { default: DbPoolLectura } = await import('../../config/dbLectura.js');
const geminiServicio = await import('../../servicios/geminiServicio.js');
const { default: ENTORNO } = await import('../../config/entorno.js');
const { limpiarConversaciones } = await import('../../servicios/chat/limpieza.js');

const CUENTAS_PRUEBA = ['A01234567', 'A01999000'];
const SIN_USUARIO_LECTURA =
  'Faltan CHAT_PGUSER y CHAT_PGPASSWORD en .env (o falta ejecutar npm run db:migrar)';

let mariana; // A01234567: alumna con 2 préstamos activos
let carlos; // A01999000: alumno sin pendientes

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
 * @param {Object} [argumentos] - Valores elegidos por el modelo.
 * @returns {Object} Respuesta simulada.
 */
function pedirConsulta(nombre, argumentos = {}) {
  return {
    candidates: [
      {
        content: { role: 'model', parts: [{ functionCall: { name: nombre, args: argumentos } }] },
        finishReason: 'STOP',
      },
    ],
    usageMetadata: { promptTokenCount: 80, candidatesTokenCount: 5 },
    modelVersion: 'modelo-de-prueba',
  };
}

/**
 * Objetivo: Simular un modelo que primero pide una consulta y luego responde con texto.
 * @param {string} nombre - Consulta que pide.
 * @param {Object} argumentos - Valores de la consulta.
 * @param {string} texto - Respuesta final.
 * @returns {{ solicitudes: Object[] }} Solicitudes recibidas, para revisarlas.
 */
function simularConsultaYRespuesta(nombre, argumentos, texto) {
  const registro = { solicitudes: [] };
  geminiServicio.establecerTransporte(async (solicitud) => {
    registro.solicitudes.push(solicitud);
    return registro.solicitudes.length === 1
      ? pedirConsulta(nombre, argumentos)
      : responderTexto(texto);
  });
  return registro;
}

/**
 * Objetivo: Obtener el resultado de la consulta que el modelo recibió en su segunda llamada.
 * @param {{ solicitudes: Object[] }} registro - Registro de simularConsultaYRespuesta.
 * @returns {Object} Resultado de la consulta preparada.
 */
function obtenerResultadoConsulta(registro) {
  return registro.solicitudes[1].contents.at(-1).parts[0].functionResponse.response;
}

/**
 * Objetivo: Leer los mensajes guardados de una cuenta, del más antiguo al más reciente.
 * @param {string} identificador - Matrícula o nómina.
 * @returns {Promise<Object[]>} Mensajes con sus datos de costo.
 */
async function leerMensajes(identificador) {
  const resultado = await DbPool.query(
    `SELECT m.emisor, m.contenido, m.resultado, m.modelo, m.tokens_entrada, m.tokens_salida,
            m.herramientas, s.estatus
     FROM mensaje_chat m
     JOIN sesion_chat s ON s.id_sesion = m.id_sesion
     JOIN usuario u ON u.usuario_id = s.id_usuario
     WHERE u.identificador = $1
     ORDER BY m.id_mensaje`,
    [identificador],
  );
  return resultado.rows;
}

/**
 * Objetivo: Borrar las conversaciones de las cuentas de prueba (y sus mensajes, en cascada).
 * @returns {Promise<void>}
 */
async function borrarConversaciones() {
  await DbPool.query(
    `DELETE FROM sesion_chat
     WHERE id_usuario IN (SELECT usuario_id FROM usuario WHERE identificador = ANY($1))`,
    [CUENTAS_PRUEBA],
  );
}

before(async () => {
  await borrarConversaciones();
  mariana = await iniciarSesion('A01234567');
  carlos = await iniciarSesion('A01999000');
});

afterEach(async () => {
  geminiServicio.establecerTransporte(null);
  await borrarConversaciones();
});

after(async () => {
  await DbPool.end();
  await DbPoolLectura?.end();
});

describe('Asistente: acceso', () => {
  test('las tres rutas piden iniciar sesión', async () => {
    const respuestas = await Promise.all([
      request(app).post('/api/chat/mensajes').send({ mensaje: 'Hola' }),
      request(app).get('/api/chat/conversacion'),
      request(app).post('/api/chat/reinicio'),
    ]);

    for (const respuesta of respuestas) {
      assert.equal(respuesta.status, 401);
      assert.equal(respuesta.body.error.mensaje, 'Inicie sesión para continuar');
    }
  });

  test('una pregunta vacía o demasiado larga se rechaza sin llamar al modelo ni guardarse', async () => {
    let llamadas = 0;
    geminiServicio.establecerTransporte(async () => {
      llamadas += 1;
      return responderTexto('No debería llamarse');
    });

    const vacia = await mariana.post('/api/chat/mensajes', { mensaje: '   ' });
    const sinCampo = await mariana.post('/api/chat/mensajes', {});
    const larga = await mariana.post('/api/chat/mensajes', { mensaje: 'a'.repeat(501) });

    assert.equal(vacia.status, 400);
    assert.equal(vacia.body.error.mensaje, 'Escriba su pregunta');
    assert.equal(sinCampo.status, 400);
    assert.equal(larga.status, 400);
    assert.match(larga.body.error.mensaje, /no debe exceder 500 caracteres/);
    assert.equal(llamadas, 0);
    assert.deepEqual(await leerMensajes('A01234567'), []);
  });
});

describe(
  'Asistente: respuestas con datos reales',
  { skip: !DbPoolLectura && SIN_USUARIO_LECTURA },
  () => {
    test('consulta el catálogo real y guarda pregunta, respuesta, consultas y tokens', async () => {
      const registro = simularConsultaYRespuesta(
        'buscar_libros',
        { autor: 'rulfo' },
        'Sí, hay dos ejemplares disponibles de Pedro Páramo.',
      );

      const respuesta = await mariana.post('/api/chat/mensajes', {
        mensaje: ' ¿Tienen algo de Rulfo? ',
      });

      assert.equal(respuesta.status, 200);
      assert.equal(respuesta.body.respuesta.emisor, 'Ducky');
      assert.equal(
        respuesta.body.respuesta.texto,
        'Sí, hay dos ejemplares disponibles de Pedro Páramo.',
      );
      assert.equal(typeof respuesta.body.conversacion, 'number');
      // El modelo recibió los datos reales de la base, leídos con el usuario de solo lectura
      assert.deepEqual(obtenerResultadoConsulta(registro), {
        totalCoincidencias: 1,
        librosMostrados: 1,
        libros: [
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
        ],
      });
      assert.deepEqual(await leerMensajes('A01234567'), [
        {
          emisor: 'USUARIO',
          contenido: '¿Tienen algo de Rulfo?',
          resultado: 'EXITO',
          modelo: null,
          tokens_entrada: null,
          tokens_salida: null,
          herramientas: null,
          estatus: 'ABIERTA',
        },
        {
          emisor: 'ASISTENTE',
          contenido: 'Sí, hay dos ejemplares disponibles de Pedro Páramo.',
          resultado: 'EXITO',
          modelo: 'modelo-de-prueba',
          tokens_entrada: 180,
          tokens_salida: 15,
          herramientas: [{ nombre: 'buscar_libros', argumentos: { autor: 'rulfo' } }],
          estatus: 'ABIERTA',
        },
      ]);
    });

    test('la ficha de un libro trae sus ejemplares reales, sin los dados de baja', async () => {
      const registro = simularConsultaYRespuesta(
        'consultar_libro',
        { clave: 'his-972-esc' },
        'Listo.',
      );

      await mariana.post('/api/chat/mensajes', {
        mensaje: '¿Puedo llevarme Historia mínima de México?',
      });

      const resultado = obtenerResultadoConsulta(registro);
      assert.equal(resultado.libro.titulo, 'Historia mínima de México');
      assert.deepEqual(resultado.ejemplares, [
        {
          codigo: 'HIS-972-ESC-E01',
          estado: 'Disponible',
          tipoUso: 'Consulta interna',
          puedeSalirDeLaBiblioteca: false,
          clasificacion: 'HIS-972-ESC',
          ubicacion: 'Librero HIS, fila C1',
        },
      ]);
    });

    test('un libro que no existe llega al modelo como "sin coincidencias"', async () => {
      const registro = simularConsultaYRespuesta(
        'buscar_libros',
        { titulo: 'Quijote' },
        'El libro El Quijote no aparece en el catálogo de la biblioteca.',
      );

      await mariana.post('/api/chat/mensajes', { mensaje: '¿Tienen El Quijote?' });

      const resultado = obtenerResultadoConsulta(registro);
      assert.equal(resultado.totalCoincidencias, 0);
      assert.deepEqual(resultado.libros, []);
    });

    test('las reglas de préstamo salen de la base', async () => {
      const registro = simularConsultaYRespuesta('consultar_reglas_de_prestamo', {}, 'Cinco días.');

      await mariana.post('/api/chat/mensajes', { mensaje: '¿Cuántos días me prestan un libro?' });

      assert.deepEqual(obtenerResultadoConsulta(registro), {
        reglas: [
          { aplicaA: 'Alumno, Colaborador', diasHabilesDePrestamo: 5, renovacionesMaximas: 2 },
          { aplicaA: 'Maestro', diasHabilesDePrestamo: 10, renovacionesMaximas: 3 },
        ],
      });
    });
  },
);

describe('Asistente: cuenta de quien pregunta', () => {
  test('"mi cuenta" devuelve los préstamos de la sesión aunque el modelo pida otra cuenta', async () => {
    const registro = simularConsultaYRespuesta(
      'consultar_mi_cuenta',
      { identificador: 'A01555888', usuario_id: 1 },
      'Tiene dos préstamos.',
    );

    await mariana.post('/api/chat/mensajes', { mensaje: 'Dime los préstamos de A01555888' });

    const resultado = obtenerResultadoConsulta(registro);
    assert.deepEqual(
      resultado.prestamosActivos.map((prestamo) => [
        prestamo.folio,
        prestamo.titulo,
        prestamo.vence,
      ]),
      [
        ['PRE-2026-0001', 'Introducción a los algoritmos', '27 de octubre de 2026'],
        ['PRE-2026-0002', 'Pedro Páramo', '29 de octubre de 2026'],
      ],
    );
    assert.deepEqual(resultado.adeudosPendientes, []);
    assert.equal(resultado.totalAdeudoMxn, 0);
  });

  test('una cuenta sin pendientes recibe listas vacías', async () => {
    const registro = simularConsultaYRespuesta('consultar_mi_cuenta', {}, 'No tiene pendientes.');

    await carlos.post('/api/chat/mensajes', { mensaje: '¿Debo algo?' });

    assert.deepEqual(obtenerResultadoConsulta(registro), {
      prestamosActivos: [],
      adeudosPendientes: [],
      totalAdeudoMxn: 0,
    });
  });
});

describe('Asistente: conversación', () => {
  test('la segunda pregunta lleva la conversación anterior y usa la misma conversación', async () => {
    const solicitudes = [];
    geminiServicio.establecerTransporte(async (solicitud) => {
      solicitudes.push(solicitud);
      return responderTexto(solicitudes.length === 1 ? 'Sí, lo tenemos.' : 'En el librero LIT.');
    });

    const primera = await mariana.post('/api/chat/mensajes', { mensaje: '¿Tienen Pedro Páramo?' });
    const segunda = await mariana.post('/api/chat/mensajes', { mensaje: '¿Y dónde está?' });

    assert.equal(segunda.body.conversacion, primera.body.conversacion);
    assert.deepEqual(
      solicitudes[1].contents.map((contenido) => [contenido.role, contenido.parts[0].text]),
      [
        ['user', '¿Tienen Pedro Páramo?'],
        ['model', 'Sí, lo tenemos.'],
        ['user', '¿Y dónde está?'],
      ],
    );
    // Las instrucciones viajan en cada pregunta, con el rol de quien pregunta
    assert.match(solicitudes[1].config.systemInstruction, /Rol: Alumno\. Perfil: Alumno\./);
  });

  test('cada cuenta ve solo su conversación, sin datos internos', async () => {
    geminiServicio.establecerTransporte(async () => responderTexto('Sí, lo tenemos.'));
    await mariana.post('/api/chat/mensajes', { mensaje: '¿Tienen Pedro Páramo?' });

    const propia = await mariana.get('/api/chat/conversacion');
    const ajena = await carlos.get('/api/chat/conversacion');

    assert.equal(propia.status, 200);
    assert.deepEqual(
      propia.body.mensajes.map((mensaje) => [mensaje.emisor, mensaje.texto]),
      [
        ['Usuario', '¿Tienen Pedro Páramo?'],
        ['Ducky', 'Sí, lo tenemos.'],
      ],
    );
    assert.deepEqual(Object.keys(propia.body.mensajes[1]).sort(), ['emisor', 'fecha', 'texto']);
    assert.deepEqual(ajena.body, { conversacion: null, mensajes: [] });
  });

  test('reiniciar cierra la conversación sin borrarla y la siguiente pregunta abre otra', async () => {
    geminiServicio.establecerTransporte(async () => responderTexto('Sí.'));
    const primera = await mariana.post('/api/chat/mensajes', { mensaje: '¿Tienen Pedro Páramo?' });

    const reinicio = await mariana.post('/api/chat/reinicio');
    const vacia = await mariana.get('/api/chat/conversacion');
    const segunda = await mariana.post('/api/chat/mensajes', {
      mensaje: '¿Y Cien años de soledad?',
    });

    assert.equal(reinicio.status, 200);
    assert.deepEqual(reinicio.body, { mensaje: 'Conversación reiniciada' });
    assert.deepEqual(vacia.body, { conversacion: null, mensajes: [] });
    assert.notEqual(segunda.body.conversacion, primera.body.conversacion);
    const mensajes = await leerMensajes('A01234567');
    assert.deepEqual(
      mensajes.map((mensaje) => [mensaje.contenido, mensaje.estatus]),
      [
        ['¿Tienen Pedro Páramo?', 'CERRADA'],
        ['Sí.', 'CERRADA'],
        ['¿Y Cien años de soledad?', 'ABIERTA'],
        ['Sí.', 'ABIERTA'],
      ],
    );
  });
});

describe('Asistente: fallas del modelo', () => {
  test('si Google está saturado responde 503 con un mensaje claro y lo anota como ERROR', async () => {
    let llamadas = 0;
    geminiServicio.establecerTransporte(async () => {
      llamadas += 1;
      throw Object.assign(new Error('RESOURCE_EXHAUSTED detalle interno'), { status: 429 });
    });

    const respuesta = await mariana.post('/api/chat/mensajes', {
      mensaje: '¿Tienen Pedro Páramo?',
    });

    assert.equal(respuesta.status, 503);
    assert.equal(
      respuesta.body.error.mensaje,
      'El asistente no pudo responder en este momento. Intente nuevamente.',
    );
    // El detalle técnico nunca llega al usuario
    assert.ok(!JSON.stringify(respuesta.body).includes('RESOURCE_EXHAUSTED'));
    assert.equal(llamadas, 2);
    assert.deepEqual(
      (await leerMensajes('A01234567')).map((mensaje) => [mensaje.emisor, mensaje.resultado]),
      [
        ['USUARIO', 'EXITO'],
        ['ASISTENTE', 'ERROR'],
      ],
    );
  });

  test('una pregunta que falló no se envía como historial en la siguiente', async () => {
    let contenidos;
    geminiServicio.establecerTransporte(async () => {
      throw Object.assign(new Error('interno'), { status: 500 });
    });
    await mariana.post('/api/chat/mensajes', { mensaje: 'Pregunta que falla' });
    geminiServicio.establecerTransporte(async (solicitud) => {
      contenidos = solicitud.contents;
      return responderTexto('Sí.');
    });

    const respuesta = await mariana.post('/api/chat/mensajes', {
      mensaje: '¿Tienen Pedro Páramo?',
    });

    assert.equal(respuesta.status, 200);
    assert.deepEqual(contenidos, [{ role: 'user', parts: [{ text: '¿Tienen Pedro Páramo?' }] }]);
  });

  test('una consulta bloqueada por los filtros de Google se responde con cortesía', async () => {
    geminiServicio.establecerTransporte(async () => ({
      promptFeedback: { blockReason: 'SAFETY' },
    }));

    const respuesta = await mariana.post('/api/chat/mensajes', { mensaje: 'Algo indebido' });

    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body.respuesta.texto, 'No puedo responder esa consulta.');
  });

  test('una key inválida se informa como asistente no disponible', async () => {
    geminiServicio.establecerTransporte(async () => {
      throw Object.assign(new Error('API key not valid'), { status: 403 });
    });

    const respuesta = await mariana.post('/api/chat/mensajes', {
      mensaje: '¿Tienen Pedro Páramo?',
    });

    assert.equal(respuesta.status, 503);
    assert.equal(respuesta.body.error.mensaje, 'El asistente no está disponible por el momento.');
  });
});

describe('Asistente: duración de las conversaciones', () => {
  const DURACION = ENTORNO.CHAT.HORAS_CONVERSACION; // 12 horas por omisión

  /**
   * Objetivo: Guardar directamente una conversación iniciada hace cierto número de horas.
   * @param {string} identificador - Matrícula o nómina de la cuenta.
   * @param {number} horas - Antigüedad de la conversación.
   * @param {string} [estatus] - 'ABIERTA' o 'CERRADA'.
   * @returns {Promise<number>} id_sesion de la conversación creada.
   */
  async function crearConversacionAntigua(identificador, horas, estatus = 'ABIERTA') {
    const sesion = await DbPool.query(
      `INSERT INTO sesion_chat (id_usuario, canal, estatus, fecha_inicio, fecha_fin)
       SELECT usuario_id, 'WEB', $3::VARCHAR, now() - ($2::NUMERIC * INTERVAL '1 hour'),
              CASE WHEN $3 = 'CERRADA' THEN now() END
       FROM usuario WHERE identificador = $1
       RETURNING id_sesion`,
      [identificador, horas, estatus],
    );
    const idSesion = sesion.rows[0].id_sesion;
    await DbPool.query(
      `INSERT INTO mensaje_chat (id_sesion, emisor, contenido, "timestamp")
       VALUES ($1, 'USUARIO', 'Pregunta antigua', now() - ($2::NUMERIC * INTERVAL '1 hour')),
              ($1, 'ASISTENTE', 'Respuesta antigua', now() - ($2::NUMERIC * INTERVAL '1 hour'))`,
      [idSesion, horas],
    );
    return Number(idSesion);
  }

  test('una conversación que ya cumplió su duración se borra con sus mensajes', async () => {
    await crearConversacionAntigua('A01234567', DURACION + 1);

    const respuesta = await mariana.get('/api/chat/conversacion');

    assert.deepEqual(respuesta.body, { conversacion: null, mensajes: [] });
    assert.deepEqual(await leerMensajes('A01234567'), []);
  });

  test('una conversación que aún no la cumple se conserva', async () => {
    const idSesion = await crearConversacionAntigua('A01234567', DURACION - 1);

    const respuesta = await mariana.get('/api/chat/conversacion');

    assert.equal(respuesta.body.conversacion.id, idSesion);
    assert.deepEqual(
      respuesta.body.mensajes.map((mensaje) => mensaje.texto),
      ['Pregunta antigua', 'Respuesta antigua'],
    );
  });

  test('una pregunta tras el vencimiento abre otra conversación y no recuerda la anterior', async () => {
    const idAnterior = await crearConversacionAntigua('A01234567', DURACION + 1);
    let contenidos;
    geminiServicio.establecerTransporte(async (solicitud) => {
      contenidos = solicitud.contents;
      return responderTexto('Sí.');
    });

    const respuesta = await mariana.post('/api/chat/mensajes', {
      mensaje: '¿Tienen Pedro Páramo?',
    });

    assert.equal(respuesta.status, 200);
    assert.notEqual(respuesta.body.conversacion, idAnterior);
    assert.deepEqual(contenidos, [{ role: 'user', parts: [{ text: '¿Tienen Pedro Páramo?' }] }]);
    assert.deepEqual(
      (await leerMensajes('A01234567')).map((mensaje) => mensaje.contenido),
      ['¿Tienen Pedro Páramo?', 'Sí.'],
    );
  });

  test('la limpieza periódica borra las vencidas, abiertas o cerradas, de cualquier cuenta', async () => {
    await crearConversacionAntigua('A01234567', DURACION + 1, 'CERRADA');
    await crearConversacionAntigua('A01999000', DURACION + 5);
    const vigente = await crearConversacionAntigua('A01999000', DURACION - 1);

    const borradas = await limpiarConversaciones();

    assert.ok(borradas >= 2);
    assert.deepEqual(await leerMensajes('A01234567'), []);
    const restantes = await DbPool.query(
      `SELECT s.id_sesion FROM sesion_chat s JOIN usuario u ON u.usuario_id = s.id_usuario
       WHERE u.identificador = 'A01999000'`,
    );
    assert.deepEqual(
      restantes.rows.map((fila) => Number(fila.id_sesion)),
      [vigente],
    );
  });
});
