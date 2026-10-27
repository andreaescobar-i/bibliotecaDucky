import type { HTMLAttributes } from 'react';
import { useDesign } from '../context/DesignContext';

export function DesignText({ children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  const s = useDesign();
  let text = typeof children === 'string' ? children.trim() : children;
  const old = text;
  const id = String(props['data-node-id'] || '');
  if (typeof text === 'string') {
    if (id === '312:1703')
      text =
        (s.role === 'Administrador'
          ? 'Alfonso Chapa'
          : s.role === 'Bibliotecario'
            ? 'Ernesto Díaz'
            : s.role === 'Comprador de libros'
              ? 'Luisa Palacios'
              : 'Mariana López') +
        ' · ' +
        s.role;
    if (
      [
        '6-26',
        '211-1135',
        '247-3645',
        '2196-2026',
        '2196-2044',
        '2196-2076',
        '247-3458',
        '2114-2308',
      ].includes(s.overlay || s.route)
    ) {
      const b = s.book;
      if (s.route === '6-26' && !s.overlay) {
        if (['2136:2275', '6:191'].includes(id)) text = String(b.copies);
        if (id === '6:165') text = b.description;
        if (id === '6:194') text = b.location;
      }
      const map = {
        'Introducción a los algoritmos': b.title,
        'Thomas H. Cormen': b.author,
        'Cien años de soledad': b.title,
        'Gabriel García Márquez': b.author,
        'MIT Press': b.publisher,
        'LIT-863.64-GAR': b.code,
        'COM-005.1-COR': b.code,
        'No registrado': b.isbn,
      };
      text = map[String(text)] ?? text;
    }
    if (['174-3080', '182-571', '207-712'].includes(s.route) && !s.overlay && !id.includes(';')) {
      const loan = s.data.loans.find((l) => l.id === s.selected);
      const u = s.data.users.find((u) => u.id === (loan?.userId || s.userId));
      const selectedBook = s.data.books.find((b) => b.id === loan?.bookId) || s.book;
      const map = {
        'Mariana López Hernández': u?.name || 'Mariana López',
        A01234567: u?.id || s.userId,
        'Pedro Páramo': selectedBook.title,
        'EJ-01082': selectedBook.code + ' / EJ-001',
        'PRE-2026-1843': loan?.id || 'PRE-2026-1843',
        '8 oct 2026': loan?.start || new Date().toISOString().slice(0, 10),
        '15 oct 2026': loan?.due || new Date().toISOString().slice(0, 10),
      };
      text = map[String(text)] ?? text;
    }
    if (s.overlay === '211-962') {
      const f = s.data.fines.find((f) => f.id === s.selected);
      if (f && text === 'Ana Torres Ruiz') text = f.user;
    }
    if (
      id.includes(';') &&
      ['Mariana López', 'Alfonso Chapa', 'Luisa Palacios'].includes(String(text))
    )
      text =
        s.role === 'Administrador'
          ? 'Alfonso Chapa'
          : s.role === 'Bibliotecario'
            ? 'Ernesto Díaz'
            : s.role === 'Comprador de libros'
              ? 'Luisa Palacios'
              : 'Mariana López';
    if (
      id.includes(';') &&
      ['Alumno', 'Admin', 'Comprador de libros'].includes(String(text)) &&
      /62:591|247:3347|207:710|62:651/.test(id)
    )
      text = s.role;
    if (/resultados$/.test(String(text)) && ['1-336', '272-2449'].includes(s.route))
      text = `${s.data.books.filter((b) => b.title.toLowerCase().includes(s.query.toLowerCase()) || b.author.toLowerCase().includes(s.query.toLowerCase())).length} resultados`;
    if (text === 'Mostrando 1–5 de 10') {
      const books = s.data.books.filter((b) =>
        [b.title, b.author, b.code, b.publisher]
          .join(' ')
          .toLowerCase()
          .includes(s.query.toLowerCase()),
      );
      text = `Mostrando ${books.length ? (s.page - 1) * 5 + 1 : 0}–${Math.min(s.page * 5, books.length)} de ${books.length}`;
    }
    if (text === '3 usuarios registrados') text = `${s.data.users.length} usuarios registrados`;
    if (text === 'Página 1 · 10 libros') text = `Página ${s.page} · ${s.data.books.length} libros`;
    if (text === 'Relevancia') text = s.sort;
    if (text === 'Ordenados por relevancia') text = `Ordenados por ${s.sort.toLowerCase()}`;
    if (['2081-2172', '2081-2189', '2081-2208', '211-1245', '211-1260'].includes(s.overlay)) {
      const r = s.data.requests.find((r) => r.id === s.selected);
      if (r) {
        const map = {
          'Diseño de sistemas interactivos': r.title,
          'SOL-2418': r.id,
          'Facultad de Diseño': r.requester,
          '2340.00': r.cost.toFixed(2),
          Preparación: r.state,
        };
        text = map[String(text)] ?? text;
      }
    }
    if (text === 'Página 1 de 2')
      text = `Página ${s.page} de ${Math.max(1, Math.ceil(s.data.books.filter((b) => [b.title, b.author, b.code].join(' ').toLowerCase().includes(s.query.toLowerCase())).length / 5))}`;
    if (
      (s.overlay === '247-3679' || s.overlay === '2081-2208') &&
      (!text || text === 'SOL-2418 · Solicitud preparada · Facultad de Diseño')
    )
      text =
        s.data.history
          .slice(-8)
          .map((h) => `${new Date(h.at).toLocaleString('es-MX')} · ${h.action} · ${h.detail}`)
          .join('\n') || 'Aún no hay movimientos registrados.';
  }
  return (
    <p {...props} data-original-text={typeof old === 'string' ? old : undefined}>
      {text}
    </p>
  );
}
