/*----
 * Programa: geminiServicio.js
 * Objetivo: Enviar preguntas al modelo Gemini por Gemini Enterprise Agent Platform de Google
 *           Cloud (antes Vertex AI) y devolver su respuesta en un formato propio. Es el único
 *           archivo que conoce la key; nunca se usa la Gemini API de Google AI Studio.
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 15 de Noviembre de 2026
 */

import { GoogleGenAI } from '@google/genai';
import ENTORNO from '../config/entorno.js';

const ESPERA_RESPUESTA_MS = 20000; // Tiempo máximo de una respuesta del modelo
const ESPERA_REINTENTO_MS = 800; // Pausa antes del único reintento
const MAX_TOKENS_SALIDA = 600; // Largo máximo de una respuesta (los tokens son lo que se cobra)
const TEMPERATURA = 0.2; // Baja: respuestas sobrias y repetibles
const ESTADOS_SATURACION = [429, 503]; // Demasiadas peticiones o servicio no disponible
const ESTADOS_CREDENCIAL = [401, 403];
const ESTADO_NO_ENCONTRADO = 404;
// Motivos con los que Google corta una respuesta por sus filtros de contenido
const MOTIVOS_BLOQUEO = ['SAFETY', 'BLOCKLIST', 'PROHIBITED_CONTENT', 'SPII', 'RECITATION'];

// Causas por las que el asistente no pudo responder; el controlador elige el mensaje al usuario
const CODIGOS_ERROR = Object.freeze({
  NO_DISPONIBLE: 'NO_DISPONIBLE', // Asistente apagado o sin key
  SATURADO: 'SATURADO', // Google rechazó por exceso de peticiones, incluso tras reintentar
  TIEMPO: 'TIEMPO', // No respondió a tiempo
  BLOQUEADO: 'BLOQUEADO', // Los filtros de contenido de Google cortaron la respuesta
  CREDENCIAL: 'CREDENCIAL', // Key inválida o sin permiso
  MODELO: 'MODELO', // El modelo configurado no existe o el proyecto no tiene acceso
  FALLA: 'FALLA', // Cualquier otro error
});

/**
 * Error del asistente con una causa conocida (CODIGOS_ERROR).
 */
class ErrorGemini extends Error {
  /**
   * @param {string} codigo - Una de las causas de CODIGOS_ERROR.
   * @param {string} mensaje - Detalle técnico para la consola del servidor; no es para el usuario.
   */
  constructor(codigo, mensaje) {
    super(mensaje);
    this.name = 'ErrorGemini';
    this.codigo = codigo;
  }
}

let clienteGemini = null; // Se crea en la primera llamada

/**
 * Objetivo: Crear una sola vez el cliente del SDK apuntando a Agent Platform.
 * @returns {GoogleGenAI} Cliente listo para usarse.
 * Limitaciones: Requiere ENTORNO.GEMINI.apiKey.
 */
function obtenerCliente() {
  if (!clienteGemini) {
    clienteGemini = new GoogleGenAI({
      enterprise: true, // Agent Platform (aiplatform.googleapis.com), no AI Studio
      // El SDK busca GOOGLE_API_KEY por omisión; la del proyecto se llama GEMINI_API_KEY
      apiKey: ENTORNO.GEMINI.apiKey,
    });
    if (!clienteGemini.vertexai) {
      clienteGemini = null;
      throw new ErrorGemini(CODIGOS_ERROR.FALLA, 'El cliente no quedó en Agent Platform');
    }
  }
  return clienteGemini;
}

/**
 * Objetivo: Transporte real: una llamada a Gemini por Agent Platform.
 * @param {Object} solicitud - model, contents y config, con el formato del SDK.
 * @returns {Promise<Object>} Respuesta del SDK.
 */
async function transporteAgentPlatform(solicitud) {
  return obtenerCliente().models.generateContent(solicitud);
}

/**
 * Objetivo: Transporte de las pruebas automáticas: impide gastar créditos por accidente.
 * @returns {Promise<never>} Siempre falla.
 */
async function transporteBloqueadoEnPruebas() {
  throw new Error('Las pruebas no llaman a Gemini: usa establecerTransporte() con una simulación');
}

const transportePorOmision = ENTORNO.ES_PRUEBA
  ? transporteBloqueadoEnPruebas
  : transporteAgentPlatform;
let transporteActual = transportePorOmision; // Se reemplaza en pruebas para simular respuestas

/**
 * Objetivo: Cambiar el transporte (pruebas automáticas).
 * @param {Function|null} transporte - Función async que recibe la solicitud; null restaura el
 *   transporte por omisión.
 * @returns {void}
 */
function establecerTransporte(transporte) {
  transporteActual = transporte ?? transportePorOmision;
}

/**
 * Objetivo: Indicar si el asistente puede usarse: está habilitado y tiene key.
 * @returns {boolean} true si se puede llamar a Gemini.
 */
function estaDisponible() {
  return ENTORNO.GEMINI.habilitado;
}

/**
 * Objetivo: Quitar la key de un texto antes de registrarlo, por si algún error la incluyera.
 * @param {string} texto - Mensaje de error.
 * @returns {string} Mensaje sin la key.
 */
function ocultarKey(texto) {
  const key = ENTORNO.GEMINI.apiKey;
  return key ? String(texto).split(key).join('<key>') : String(texto);
}

/**
 * Objetivo: Esperar unos milisegundos antes de reintentar.
 * @param {number} ms - Milisegundos de espera.
 * @returns {Promise<void>}
 */
function esperar(ms) {
  return new Promise((resolver) => {
    setTimeout(resolver, ms);
  });
}

/**
 * Objetivo: Ejecutar una llamada con tiempo máximo; al vencerse, la cancela.
 * @param {Object} solicitud - Solicitud con el formato del SDK.
 * @param {number} esperaMs - Tiempo máximo en milisegundos.
 * @returns {Promise<Object>} Respuesta del transporte.
 */
async function llamarConTiempoMaximo(solicitud, esperaMs) {
  const cancelacion = new AbortController();
  let temporizador;
  const vencimiento = new Promise((_resolver, rechazar) => {
    temporizador = setTimeout(() => {
      // Primero se informa el vencimiento: al cancelar, el transporte falla con su propio error
      rechazar(new ErrorGemini(CODIGOS_ERROR.TIEMPO, `Sin respuesta en ${esperaMs} ms`));
      cancelacion.abort();
    }, esperaMs);
  });
  try {
    return await Promise.race([
      transporteActual({
        ...solicitud,
        config: { ...solicitud.config, abortSignal: cancelacion.signal },
      }),
      vencimiento,
    ]);
  } finally {
    clearTimeout(temporizador);
  }
}

/**
 * Objetivo: Convertir un error del SDK en un ErrorGemini con causa conocida.
 * @param {Error} err - Error recibido del transporte.
 * @returns {ErrorGemini} Error clasificado, con el mensaje sin la key.
 */
function clasificarError(err) {
  if (err instanceof ErrorGemini) {
    return err;
  }
  const mensaje = ocultarKey(err?.message ?? err);
  if (ESTADOS_SATURACION.includes(err?.status)) {
    return new ErrorGemini(CODIGOS_ERROR.SATURADO, mensaje);
  }
  if (ESTADOS_CREDENCIAL.includes(err?.status)) {
    return new ErrorGemini(CODIGOS_ERROR.CREDENCIAL, mensaje);
  }
  if (err?.status === ESTADO_NO_ENCONTRADO) {
    return new ErrorGemini(CODIGOS_ERROR.MODELO, mensaje);
  }
  return new ErrorGemini(CODIGOS_ERROR.FALLA, mensaje);
}

/**
 * Objetivo: Pasar la respuesta del SDK a un formato propio y sencillo.
 * @param {Object} respuesta - Respuesta del SDK.
 * @param {string} modelo - Modelo solicitado.
 * @returns {Object} texto, llamadas, contenidoModelo, uso, modelo y motivoFin.
 */
function normalizarRespuesta(respuesta, modelo) {
  const motivoBloqueo = respuesta?.promptFeedback?.blockReason;
  const candidato = respuesta?.candidates?.[0];
  if (motivoBloqueo || MOTIVOS_BLOQUEO.includes(candidato?.finishReason)) {
    throw new ErrorGemini(
      CODIGOS_ERROR.BLOQUEADO,
      `Respuesta bloqueada: ${motivoBloqueo ?? candidato.finishReason}`,
    );
  }

  const partes = candidato?.content?.parts ?? [];
  const uso = respuesta?.usageMetadata ?? {};
  return {
    // Las partes de "pensamiento" del modelo no son respuesta para el usuario
    texto: partes
      .filter((parte) => typeof parte.text === 'string' && !parte.thought)
      .map((parte) => parte.text)
      .join('')
      .trim(),
    // Consultas preparadas que el modelo pide ejecutar antes de responder
    llamadas: partes
      .filter((parte) => parte.functionCall)
      .map((parte) => ({
        id: parte.functionCall.id ?? null,
        nombre: parte.functionCall.name,
        argumentos: parte.functionCall.args ?? {},
      })),
    // Se reenvía tal cual en el siguiente turno; incluye las firmas que el modelo exige
    contenidoModelo: candidato?.content ?? null,
    uso: {
      tokensEntrada: uso.promptTokenCount ?? 0,
      // El "pensamiento" también se cobra como salida
      tokensSalida: (uso.candidatesTokenCount ?? 0) + (uso.thoughtsTokenCount ?? 0),
    },
    modelo: respuesta?.modelVersion ?? modelo,
    motivoFin: candidato?.finishReason ?? null,
  };
}

/**
 * Objetivo: Pedir una respuesta a Gemini. Reintenta una sola vez si Google está saturado.
 * @param {Object} opciones - Datos de la petición.
 * @param {Object[]} opciones.contenidos - Conversación con el formato del SDK
 *   ([{ role: 'user' | 'model', parts: [...] }]).
 * @param {string} [opciones.instrucciones] - Reglas de comportamiento del asistente.
 * @param {Object[]} [opciones.herramientas] - Declaraciones de las consultas preparadas.
 * @param {boolean} [opciones.sinNuevasConsultas] - true para exigir una respuesta en texto: el
 *   modelo conserva las consultas ya hechas pero no puede pedir más.
 * @param {number} [opciones.maxTokensSalida] - Largo máximo de la respuesta.
 * @param {number} [opciones.esperaMs] - Tiempo máximo de espera.
 * @param {number} [opciones.esperaReintentoMs] - Pausa antes del reintento.
 * @returns {Promise<Object>} { texto, llamadas, contenidoModelo, uso, modelo, motivoFin }.
 * Limitaciones: Lanza ErrorGemini con la causa (CODIGOS_ERROR); nunca devuelve la key ni la
 *   incluye en sus mensajes.
 */
async function generarRespuesta({
  contenidos,
  instrucciones,
  herramientas,
  sinNuevasConsultas = false,
  maxTokensSalida = MAX_TOKENS_SALIDA,
  esperaMs = ESPERA_RESPUESTA_MS,
  esperaReintentoMs = ESPERA_REINTENTO_MS,
}) {
  if (!estaDisponible()) {
    throw new ErrorGemini(CODIGOS_ERROR.NO_DISPONIBLE, 'Asistente apagado o sin GEMINI_API_KEY');
  }
  const modelo = ENTORNO.GEMINI.modelo;
  const solicitud = {
    model: modelo,
    contents: contenidos,
    config: {
      temperature: TEMPERATURA,
      maxOutputTokens: maxTokensSalida,
      ...(instrucciones ? { systemInstruction: instrucciones } : {}),
      ...(herramientas?.length ? { tools: [{ functionDeclarations: herramientas }] } : {}),
      ...(herramientas?.length && sinNuevasConsultas
        ? { toolConfig: { functionCallingConfig: { mode: 'NONE' } } }
        : {}),
    },
  };

  let respuesta;
  try {
    respuesta = await llamarConTiempoMaximo(solicitud, esperaMs);
  } catch (err) {
    const error = clasificarError(err);
    if (error.codigo !== CODIGOS_ERROR.SATURADO) {
      throw error;
    }
    await esperar(esperaReintentoMs);
    try {
      respuesta = await llamarConTiempoMaximo(solicitud, esperaMs);
    } catch (errReintento) {
      throw clasificarError(errReintento);
    }
  }
  return normalizarRespuesta(respuesta, modelo);
}

export { CODIGOS_ERROR, ErrorGemini, establecerTransporte, estaDisponible, generarRespuesta };
