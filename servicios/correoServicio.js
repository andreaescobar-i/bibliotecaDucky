/*----
 * Programa: correoServicio.js
 * Objetivo: Enviar las credenciales de las cuentas nuevas al correo institucional (HUGUS02).
 *           En desarrollo el envío se simula mostrando el mensaje en la consola de la API; al
 *           contratar un servidor de correo solo cambia el transporte de este archivo.
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import ENTORNO from '../config/entorno.js';

/**
 * Objetivo: Transporte simulado: imprime el correo en la consola del servidor.
 * @param {{ para: string, asunto: string, texto: string }} mensaje - Correo a enviar.
 * @returns {Promise<void>}
 */
async function transporteConsola(mensaje) {
  if (!ENTORNO.ES_PRUEBA) {
    console.log(
      `\n[Correo simulado] Para: ${mensaje.para}\nAsunto: ${mensaje.asunto}\n${mensaje.texto}\n`,
    );
  }
}

let transporteActual = transporteConsola; // Se reemplaza en pruebas para simular fallas

/**
 * Objetivo: Cambiar el transporte de correo (pruebas automáticas o servidor real).
 * @param {Function|null} transporte - Función async que recibe el mensaje; null restaura la
 *   consola.
 * @returns {void}
 */
function establecerTransporte(transporte) {
  transporteActual = transporte ?? transporteConsola;
}

/**
 * Objetivo: Enviar identificador y contraseña temporal a una cuenta recién creada.
 * @param {Object} datos - Datos del envío.
 * @param {string} datos.correo - Correo institucional registrado.
 * @param {string} datos.nombre - Nombre de la persona.
 * @param {string} datos.identificador - Matrícula o nómina.
 * @param {string} datos.contrasenaTemporal - Contraseña temporal en texto plano (solo viaja en
 *   el correo; nunca se guarda ni se registra en la bitácora).
 * @returns {Promise<boolean>} true si el envío se confirmó; false si falló.
 */
async function enviarCredenciales({ correo, nombre, identificador, contrasenaTemporal }) {
  try {
    await transporteActual({
      para: correo,
      asunto: 'Tu cuenta de la Biblioteca Ducky',
      texto:
        `Hola ${nombre}:\n\nSe creó tu cuenta de la Biblioteca Ducky.\n` +
        `Usuario: ${identificador}\nContraseña temporal: ${contrasenaTemporal}\n\n` +
        'Cambia tu contraseña al ingresar por primera vez.',
    });
    return true;
  } catch {
    return false;
  }
}

export { establecerTransporte, enviarCredenciales };
