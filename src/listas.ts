/*----
 * Programa: listas.ts
 * Objetivo: Implementación del módulo listas
 */

import type { DesignState } from './context/DesignContext';

// Filtros de las tablas; las tablas y sus contadores usan los mismos para no contradecirse.
export const PAGE_SIZE = 5;
const matches = (s: DesignState, ...values: unknown[]) =>
  values.join(' ').toLowerCase().includes(s.query.toLowerCase());
const all = (filter = '') => !filter || filter.startsWith('Todos') || filter === 'Todas';

export function catalogBooks(s: DesignState) {
  const criterion = s.fields.Criterio;
  const books = s.data.books.filter(
    (b) =>
      matches(
        s,
        criterion === 'Título'
          ? b.title
          : criterion === 'Autor'
            ? b.author
            : criterion === 'Editorial'
              ? b.publisher
              : criterion === 'Clave'
                ? b.code
                : [b.title, b.author, b.code, b.publisher].join(' '),
      ) &&
      (all(s.filter) || [b.use, b.state].includes(s.filter)),
  );
  if (s.sort === 'Autor A–Z') return [...books].sort((a, b) => a.author.localeCompare(b.author));
  if (s.sort === 'Título A–Z') return [...books].sort((a, b) => a.title.localeCompare(b.title));
  if (s.sort === 'Título Z–A') return [...books].sort((a, b) => b.title.localeCompare(a.title));
  return books;
}
export const managedBooks = (s: DesignState) =>
  s.data.books.filter(
    (b) =>
      matches(s, b.code, b.title, b.author) &&
      (all(s.fields['Tipo de uso']) || b.use === s.fields['Tipo de uso']),
  );
export const filteredUsers = (s: DesignState) =>
  s.data.users.filter(
    (u) =>
      matches(s, u.id, u.name, u.email) &&
      (all(s.fields.Rol) || u.role === s.fields.Rol) &&
      (all(s.fields.Estado) || (s.fields.Estado === 'Activo') === u.active),
  );
export const filteredRequests = (s: DesignState) =>
  s.data.requests.filter(
    (r) =>
      matches(s, r.id, r.title, r.requester) &&
      (all(s.fields.Estado) || r.state === s.fields.Estado),
  );

// Lista que pagina la pantalla actual, para "Mostrando…", "Página…" y Siguiente/Anterior.
export function pagedList(s: DesignState): unknown[] | null {
  if (['1-336', '272-2449'].includes(s.route)) return catalogBooks(s);
  if (['207-1228', '247-2861', '247-3086'].includes(s.route)) return managedBooks(s);
  return null;
}
export const pageCount = (total: number) => Math.max(1, Math.ceil(total / PAGE_SIZE));
export function showing(page: number, total: number, size = PAGE_SIZE) {
  return `Mostrando ${total ? (page - 1) * size + 1 : 0}–${Math.min(page * size, total)} de ${total}`;
}
