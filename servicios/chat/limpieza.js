/*----
 * Programa: limpieza.js
 * Objetivo: Borrar cada cierto tiempo las conversaciones del asistente Ducky que ya cumplieron
 *           su duración (CHAT_HORAS_CONVERSACION), aunque nadie esté usando el asistente
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 15 de Noviembre de 2026
 */

import ENTORNO from '../../config/entorno.js';
import * as chatModelo from '../../modelos/chatModelo.js';

const MINUTOS_ENTRE_LIMPIEZAS = 10;
const MS_POR_MINUTO = 60 * 1000;

/**
 * Objetivo: Borrar las conversaciones vencidas y avisar en la consola si falla.
 * @returns {Promise<number>} Conversaciones borradas; 0 si la base no respondió.
 * Limitaciones: Un fallo no detiene la API; se reintenta en la siguiente limpieza.
 */
async function limpiarConversaciones() {
  try {
    return await chatModelo.eliminarSesionesVencidas(ENTORNO.CHAT.HORAS_CONVERSACION);
  } catch (err) {
    console.error('[Asistente] No se pudieron borrar las conversaciones vencidas:', err.message);
    return 0;
  }
}

/**
 * Objetivo: Iniciar la limpieza periódica: una al arrancar y después cada diez minutos.
 * @returns {Function} Función que detiene la limpieza (se usa al apagar la API).
 */
function iniciarLimpiezaConversaciones() {
  void limpiarConversaciones();
  const temporizador = setInterval(
    () => void limpiarConversaciones(),
    MINUTOS_ENTRE_LIMPIEZAS * MS_POR_MINUTO,
  );
  // El temporizador no impide que el proceso termine
  temporizador.unref();
  return () => clearInterval(temporizador);
}

export { limpiarConversaciones, iniciarLimpiezaConversaciones };
