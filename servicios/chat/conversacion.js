/*----
 * Programa: conversacion.js
 * Objetivo: Responder una pregunta al asistente Ducky: enviarla al modelo con el historial,
 *           ejecutar las consultas preparadas que pida y devolver la respuesta final
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 15 de Noviembre de 2026
 */

import * as geminiServicio from '../geminiServicio.js';
import { DECLARACIONES, ejecutarHerramienta } from './herramientas.js';
import { FRASE_SIN_INFORMACION, crearInstrucciones } from './instrucciones.js';
import { reloj } from '../../utilidades/reloj.js';

const MAX_RONDAS_CONSULTA = 4; // Veces que el modelo puede pedir consultas antes de responder
const EMISOR_USUARIO = 'USUARIO';
const RESULTADOS = Object.freeze({
  EXITO: 'EXITO',
  SIN_INFORMACION: 'SIN_INFORMACION',
  ERROR: 'ERROR',
});
// Solo las preguntas que sí se respondieron forman parte de lo que recuerda el modelo
const RESULTADOS_RECORDADOS = [RESULTADOS.EXITO, RESULTADOS.SIN_INFORMACION];
const MENSAJE_SIN_RESPUESTA =
  'No fue posible redactar una respuesta. Intente formular su pregunta de otra manera.';

/**
 * Objetivo: Convertir el historial guardado en la conversación que entiende el modelo. Conserva
 *   solo las preguntas que tuvieron respuesta, para que los turnos siempre se alternen.
 * @param {Object[]} mensajes - Filas de mensaje_chat en orden cronológico.
 * @returns {Object[]} Contenidos con el formato del SDK.
 */
function armarContenidos(mensajes) {
  const contenidos = [];
  let preguntaPendiente = null;
  for (const mensaje of mensajes) {
    if (mensaje.emisor === EMISOR_USUARIO) {
      preguntaPendiente = mensaje;
    } else if (preguntaPendiente && RESULTADOS_RECORDADOS.includes(mensaje.resultado)) {
      contenidos.push(
        { role: 'user', parts: [{ text: preguntaPendiente.contenido }] },
        { role: 'model', parts: [{ text: mensaje.contenido }] },
      );
      preguntaPendiente = null;
    } else {
      preguntaPendiente = null;
    }
  }
  return contenidos;
}

/**
 * Objetivo: Quitar el formato Markdown que el modelo agregue a pesar de las instrucciones, para
 *   que la respuesta se lea bien como texto simple.
 * @param {string} texto - Respuesta del modelo.
 * @returns {string} Texto sin negritas, encabezados ni viñetas de asterisco.
 */
function limpiarFormato(texto) {
  return texto
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^(\s*)[*•]\s+/gm, '$1- ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Objetivo: Pasar un texto a minúsculas y sin acentos para compararlo.
 * @param {string} texto - Texto original.
 * @returns {string} Texto normalizado.
 */
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Objetivo: Clasificar una respuesta: con datos o reconociendo que no tiene la información.
 * @param {string} texto - Respuesta final.
 * @returns {string} RESULTADOS.EXITO o RESULTADOS.SIN_INFORMACION.
 */
function clasificarRespuesta(texto) {
  return normalizarTexto(texto).includes(normalizarTexto(FRASE_SIN_INFORMACION))
    ? RESULTADOS.SIN_INFORMACION
    : RESULTADOS.EXITO;
}

/**
 * Objetivo: Obtener la respuesta del asistente a una pregunta.
 * @param {Object} opciones - Datos de la pregunta.
 * @param {Object} opciones.usuario - Cuenta de la sesión (req.usuario).
 * @param {Object[]} opciones.historial - Mensajes anteriores de la conversación.
 * @param {string} opciones.pregunta - Pregunta ya validada.
 * @param {Function} [opciones.ejecutar] - Ejecutor de consultas (se cambia solo en pruebas).
 * @returns {Promise<Object>} { texto, resultado, consultas, uso, modelo }.
 * Limitaciones: Propaga ErrorGemini (fallo del modelo) y ErrorConsulta (fallo de la base).
 */
async function responderPregunta({ usuario, historial, pregunta, ejecutar = ejecutarHerramienta }) {
  const contenidos = [...armarContenidos(historial), { role: 'user', parts: [{ text: pregunta }] }];
  const instrucciones = crearInstrucciones(usuario, reloj.ahora());
  const consultas = [];
  const uso = { tokensEntrada: 0, tokensSalida: 0 };

  for (let ronda = 0; ; ronda += 1) {
    // Agotadas las rondas, el modelo debe responder con lo que ya consultó
    const sinNuevasConsultas = ronda >= MAX_RONDAS_CONSULTA;
    const respuesta = await geminiServicio.generarRespuesta({
      contenidos,
      instrucciones,
      herramientas: DECLARACIONES,
      sinNuevasConsultas,
    });
    uso.tokensEntrada += respuesta.uso.tokensEntrada;
    uso.tokensSalida += respuesta.uso.tokensSalida;

    if (respuesta.llamadas.length === 0 || sinNuevasConsultas) {
      const texto = limpiarFormato(respuesta.texto);
      return {
        texto: texto || MENSAJE_SIN_RESPUESTA,
        resultado: texto ? clasificarRespuesta(texto) : RESULTADOS.ERROR,
        consultas,
        uso,
        modelo: respuesta.modelo,
      };
    }

    const resultados = [];
    for (const llamada of respuesta.llamadas) {
      const resultado = await ejecutar(llamada.nombre, llamada.argumentos, usuario);
      consultas.push({ nombre: llamada.nombre, argumentos: llamada.argumentos });
      resultados.push({
        functionResponse: {
          name: llamada.nombre,
          ...(llamada.id ? { id: llamada.id } : {}),
          response: resultado,
        },
      });
    }
    contenidos.push(respuesta.contenidoModelo, { role: 'user', parts: resultados });
  }
}

export { RESULTADOS, MENSAJE_SIN_RESPUESTA, armarContenidos, limpiarFormato, responderPregunta };
