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
  Bibliotecario: '272-2449',
  Administrador: '241-3397',
  'Comprador de libros': '207-1669',
};
export function routeForRole(id: string, role: string) {
  if (id === '27-759') return id;
  const entry = manifest.find((item) => item.module === id && !item.overlay);
  if (!entry) return defaultRoutes[role];
  if (['1-336', '272-2449', '207-1228'].includes(id)) {
    // El Administrador tiene el catálogo de consulta y la Gestión de catálogo
    return role === 'Administrador'
      ? id === '207-1228'
        ? id
        : '1-336'
      : role === 'Bibliotecario'
        ? '272-2449'
        : role === 'Comprador de libros'
          ? defaultRoutes[role]
          : '1-336';
  }
  if (['247-2861', '247-3086'].includes(id)) {
    return role === 'Administrador'
      ? '247-2861'
      : role === 'Bibliotecario'
        ? '247-3086'
        : defaultRoutes[role];
  }
  if (entry.file.startsWith('administrador/') && role !== 'Administrador')
    return defaultRoutes[role];
  if (entry.file.startsWith('bibliotecario/') && !['Administrador', 'Bibliotecario'].includes(role))
    return defaultRoutes[role];
  if (entry.file.startsWith('comprador/') && role !== 'Comprador de libros')
    return defaultRoutes[role];
  if (id === '7-439' && ['Administrador', 'Bibliotecario', 'Comprador de libros'].includes(role))
    return defaultRoutes[role];
  return id;
}
export const normalizeText = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
