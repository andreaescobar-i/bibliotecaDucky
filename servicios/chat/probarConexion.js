/*----
 * Programa: probarConexion.js
 * Objetivo: Comprobar con una sola pregunta que la API puede hablar con Gemini por Gemini
 *           Enterprise Agent Platform usando la key del .env. Uso: npm run chat:probar
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 15 de Noviembre de 2026
 *
 * Hace una llamada real: consume unos cuantos tokens (fracciones de centavo).
 */

import ENTORNO from '../../config/entorno.js';
import { CODIGOS_ERROR, estaDisponible, generarRespuesta } from '../geminiServicio.js';

const PREGUNTA_PRUEBA = 'Responde únicamente con la palabra: listo';
const MAX_TOKENS_PRUEBA = 40;

// Qué revisar según la causa del fallo
const SUGERENCIAS_ERROR = {
  [CODIGOS_ERROR.NO_DISPONIBLE]: 'Revisa GEMINI_API_KEY y CHAT_HABILITADO en el archivo .env',
  [CODIGOS_ERROR.CREDENCIAL]:
    'La key no es válida o no tiene permiso: revisa que sea de Agent Platform (Google Cloud), ' +
    'no de AI Studio, y que la API esté habilitada en el proyecto',
  [CODIGOS_ERROR.MODELO]: 'El modelo no existe o el proyecto no tiene acceso: revisa GEMINI_MODELO',
  [CODIGOS_ERROR.SATURADO]: 'Google rechazó por exceso de peticiones; intenta en unos minutos',
  [CODIGOS_ERROR.TIEMPO]: 'No hubo respuesta a tiempo; revisa la conexión a internet',
};

/**
 * Objetivo: Enviar una pregunta mínima y mostrar el modelo, la respuesta y el consumo.
 * @returns {Promise<void>}
 */
async function probarConexion() {
  console.log('Plataforma: Gemini Enterprise Agent Platform (aiplatform.googleapis.com)');
  console.log(`Modelo configurado: ${ENTORNO.GEMINI.modelo}`);
  console.log(`Asistente habilitado: ${estaDisponible() ? 'sí' : 'no'}`);

  const inicio = Date.now();
  const respuesta = await generarRespuesta({
    contenidos: [{ role: 'user', parts: [{ text: PREGUNTA_PRUEBA }] }],
    maxTokensSalida: MAX_TOKENS_PRUEBA,
  });

  console.log(`Respuesta: "${respuesta.texto}"`);
  console.log(`Modelo que respondió: ${respuesta.modelo}`);
  console.log(
    `Consumo: ${respuesta.uso.tokensEntrada} tokens de entrada, ` +
      `${respuesta.uso.tokensSalida} de salida · ${Date.now() - inicio} ms`,
  );
  console.log('Conexión con Gemini correcta.');
}

probarConexion().catch((err) => {
  console.error(`\n✗ ${err.codigo ?? 'ERROR'}: ${err.message}`);
  if (SUGERENCIAS_ERROR[err.codigo]) {
    console.error(`  ${SUGERENCIAS_ERROR[err.codigo]}`);
  }
  process.exitCode = 1;
});
