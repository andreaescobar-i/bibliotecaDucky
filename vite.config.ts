/*----
 * Programa: vite.config.ts
 * Objetivo: Implementación del módulo vite.config
 */

import { defineConfig, loadEnv } from 'vite';

// El front llama a /api y Vite lo reenvía a la API; así la cookie de sesión es del mismo origen.
// El puerto de la API sale de PUERTO (terminal o .env), el mismo que usa servidor.js.
export default defineConfig(({ mode }) => {
  const puerto = process.env.PUERTO || loadEnv(mode, process.cwd(), '').PUERTO || '3000';
  const api = { '/api': { target: `http://localhost:${puerto}`, changeOrigin: true } };
  return { server: { proxy: api }, preview: { proxy: api } };
});
