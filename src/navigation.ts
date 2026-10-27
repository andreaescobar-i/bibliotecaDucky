import { lazy, type ComponentType } from 'react';
import manifest from './manifest.json';

// Los identificadores de ruta conservan los enlaces existentes; file indica el archivo descriptivo.
const modules = import.meta.glob<{ default: ComponentType }>('./screens/**/*.tsx');
export const screens = Object.fromEntries(
  manifest.map((n) => [n.module, lazy(modules[`./screens/${n.file}`])]),
);
export const defaultRoutes: Record<string, string> = {
  Alumno: '1-336',
  Maestro: '1-336',
  Colaborador: '1-336',
  Bibliotecario: '7-1177',
  Administrador: '207-1430',
  'Comprador de libros': '207-1669',
};
export const normalizeText = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
