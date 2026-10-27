/*----
 * Programa: eslint.config.js
 * Objetivo: Reglas de ESLint del backend alineadas al Estándar de Codificación del proyecto
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

// Archivos del backend; el front (src/) se valida con TypeScript al compilar
const ARCHIVOS_BACKEND = [
  '*.js',
  'config/**/*.js',
  'controladores/**/*.js',
  'db/**/*.js',
  'middlewares/**/*.js',
  'modelos/**/*.js',
  'rutas/**/*.js',
  'servicios/**/*.js',
  'utilidades/**/*.js',
  'vistas/**/*.js',
  'tests/salud.test.mjs',
  'tests/integracion/**/*.mjs',
];

export default [
  {
    ignores: ['node_modules/', 'dist/', 'src/', 'public/'],
  },
  {
    files: ARCHIVOS_BACKEND,
    ...js.configs.recommended,
  },
  {
    files: ARCHIVOS_BACKEND,
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      'no-var': 'error', // Nunca var
      'prefer-const': 'error', // const por defecto, let solo si se reasigna
      eqeqeq: ['error', 'always'], // Solo === y !==
      camelcase: ['error', { properties: 'never' }], // Las columnas SQL llegan en snake_case
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  // Desactiva las reglas de formato que ya resuelve Prettier (llaves 1TBS, sangría de 2 espacios)
  prettier,
  {
    files: ARCHIVOS_BACKEND,
    rules: {
      curly: ['error', 'all'], // Toda estructura de control lleva llaves
    },
  },
];
