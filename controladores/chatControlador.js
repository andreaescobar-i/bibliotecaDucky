/*----
 * Programa: chatControlador.js
 * Objetivo: Atender las preguntas al asistente Ducky (ChatBot, Sprint 3): validar la pregunta,
 *           guardar la conversación y responder con datos reales de la biblioteca
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 15 de Noviembre de 2026
 */

import ENTORNO from '../config/entorno.js';
import * as chatModelo from '../modelos/chatModelo.js';
import * as chatVista from '../vistas/chatVista.js';
import * as geminiServicio from '../servicios/geminiServicio.js';
import { RESULTADOS, responderPregunta } from '../servicios/chat/conversacion.js';
import { ErrorConsulta } from '../servicios/chat/herramientas.js';
import ErrorAplicacion from '../utilidades/errorAplicacion.js';
import { limpiarTexto } from '../utilidades/validacion.js';

const MAX_MENSAJES_HISTORIAL = 10; // Mensajes anteriores que recuerda el modelo en cada pregunta
const MAX_MENSAJES_CONVERSACION = 50; // Mensajes que se muestran al abrir la conversación
const EMISOR_USUARIO = 'USUARIO';
const EMISOR_ASISTENTE = 'ASISTENTE';
const ESTADO_NO_DISPONIBLE = 503;

const MENSAJE_PREGUNTA_VACIA = 'Escriba su pregunta';
const MENSAJE_NO_DISPONIBLE = 'El asistente no está disponible por el momento.';
const MENSAJE_SIN_RESPUESTA = 'El asistente no pudo responder en este momento. Intente nuevamente.';
const MENSAJE_SIN_CATALOGO =
  'No fue posible consultar el catálogo en este momento. Intente nuevamente.';
const MENSAJE_BLOQUEADO = 'No puedo responder esa consulta.';

// Mensaje para el usuario según la causa del fallo del modelo. El detalle técnico solo se
// registra en la consola del servidor.
const MENSAJES_POR_CAUSA = Object.freeze({
  [geminiServicio.CODIGOS_ERROR.NO_DISPONIBLE]: MENSAJE_NO_DISPONIBLE,
  [geminiServicio.CODIGOS_ERROR.CREDENCIAL]: MENSAJE_NO_DISPONIBLE,
  [geminiServicio.CODIGOS_ERROR.MODELO]: MENSAJE_NO_DISPONIBLE,
  [geminiServicio.CODIGOS_ERROR.SATURADO]: MENSAJE_SIN_RESPUESTA,
  [geminiServicio.CODIGOS_ERROR.TIEMPO]: MENSAJE_SIN_RESPUESTA,
  [geminiServicio.CODIGOS_ERROR.FALLA]: MENSAJE_SIN_RESPUESTA,
  [geminiServicio.CODIGOS_ERROR.BLOQUEADO]: MENSAJE_BLOQUEADO,
});

/**
 * Objetivo: Validar la pregunta recibida.
 * @param {Object} cuerpo - Cuerpo de la petición: { mensaje }.
 * @returns {string} Pregunta sin espacios al inicio y al final.
 * Limitaciones: Lanza ErrorAplicacion 400 si viene vacía o excede el largo permitido; así una
 *   pregunta inválida nunca llega al modelo ni genera costo.
 */
function validarPregunta(cuerpo) {
  const pregunta = limpiarTexto(cuerpo?.mensaje);
  if (!pregunta) {
    throw new ErrorAplicacion(400, MENSAJE_PREGUNTA_VACIA, { campos: ['Mensaje'] });
  }
  if (pregunta.length > ENTORNO.CHAT.MAX_CARACTERES) {
    throw new ErrorAplicacion(
      400,
      `La pregunta no debe exceder ${ENTORNO.CHAT.MAX_CARACTERES} caracteres`,
      { campos: ['Mensaje'] },
    );
  }
  return pregunta;
}

/**
 * Objetivo: Elegir el mensaje para el usuario cuando el asistente no pudo responder.
 * @param {Error} err - Error recibido al pedir la respuesta.
 * @returns {string|null} Mensaje para el usuario, o null si es un error inesperado.
 */
function obtenerMensajeDeFalla(err) {
  if (err instanceof ErrorConsulta) {
    return MENSAJE_SIN_CATALOGO;
  }
  if (err instanceof geminiServicio.ErrorGemini) {
    return MENSAJES_POR_CAUSA[err.codigo] ?? MENSAJE_SIN_RESPUESTA;
  }
  return null;
}

/**
 * Objetivo: Responder una pregunta al asistente y guardar la pregunta y la respuesta.
 * @param {Object} req - Petición HTTP con req.usuario y cuerpo { mensaje }.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 * Limitaciones: La cuenta que pregunta siempre es la de la sesión; nunca llega en el cuerpo.
 *   Las conversaciones duran CHAT_HORAS_CONVERSACION horas; al vencer se borran.
 */
async function postMensaje(req, res, next) {
  try {
    const pregunta = validarPregunta(req.body);
    if (!geminiServicio.estaDisponible()) {
      throw new ErrorAplicacion(ESTADO_NO_DISPONIBLE, MENSAJE_NO_DISPONIBLE);
    }

    // Una conversación vencida no se continúa: se borra y la pregunta abre una nueva
    await chatModelo.eliminarSesionesVencidas(ENTORNO.CHAT.HORAS_CONVERSACION);
    const usuarioId = req.usuario.usuario_id;
    const sesion =
      (await chatModelo.obtenerSesionAbierta(usuarioId)) ??
      (await chatModelo.crearSesion(usuarioId));
    const idSesion = sesion.id_sesion;
    const historial = await chatModelo.obtenerUltimosMensajes(idSesion, MAX_MENSAJES_HISTORIAL);
    await chatModelo.registrarMensaje({ idSesion, emisor: EMISOR_USUARIO, contenido: pregunta });

    let respuesta;
    try {
      respuesta = await responderPregunta({ usuario: req.usuario, historial, pregunta });
    } catch (err) {
      const mensaje = obtenerMensajeDeFalla(err);
      if (!mensaje) {
        throw err;
      }
      if (!ENTORNO.ES_PRUEBA) {
        console.error(`[Asistente] ${err.codigo ?? err.name}: ${err.message}`);
      }
      const guardado = await chatModelo.registrarMensaje({
        idSesion,
        emisor: EMISOR_ASISTENTE,
        contenido: mensaje,
        resultado: RESULTADOS.ERROR,
      });
      // Una consulta bloqueada por contenido es una respuesta, no una falla del servicio
      if (mensaje !== MENSAJE_BLOQUEADO) {
        throw new ErrorAplicacion(ESTADO_NO_DISPONIBLE, mensaje);
      }
      res.json(chatVista.formatearRespuesta(idSesion, { contenido: mensaje, ...guardado }));
      return;
    }

    const guardado = await chatModelo.registrarMensaje({
      idSesion,
      emisor: EMISOR_ASISTENTE,
      contenido: respuesta.texto,
      resultado: respuesta.resultado,
      modelo: respuesta.modelo,
      tokensEntrada: respuesta.uso.tokensEntrada,
      tokensSalida: respuesta.uso.tokensSalida,
      herramientas: respuesta.consultas,
    });
    res.json(chatVista.formatearRespuesta(idSesion, { contenido: respuesta.texto, ...guardado }));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Responder con la conversación abierta de la cuenta y sus mensajes.
 * @param {Object} req - Petición HTTP con req.usuario.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function getConversacion(req, res, next) {
  try {
    await chatModelo.eliminarSesionesVencidas(ENTORNO.CHAT.HORAS_CONVERSACION);
    const sesion = await chatModelo.obtenerSesionAbierta(req.usuario.usuario_id);
    const mensajes = sesion
      ? await chatModelo.obtenerUltimosMensajes(sesion.id_sesion, MAX_MENSAJES_CONVERSACION)
      : [];
    res.json(chatVista.formatearConversacion(sesion, mensajes));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Reiniciar la conversación: cierra la abierta para que la siguiente pregunta empiece
 *   una nueva. Los mensajes anteriores se conservan en la base.
 * @param {Object} req - Petición HTTP con req.usuario.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function postReinicio(req, res, next) {
  try {
    await chatModelo.cerrarSesionesAbiertas(req.usuario.usuario_id);
    res.json(chatVista.formatearReinicio());
  } catch (err) {
    next(err);
  }
}

export { postMensaje, getConversacion, postReinicio };
