import type { HTMLAttributes, ReactNode } from 'react';
import { money } from '../model';
import { useDesign } from '../context/DesignContext';
import { Action } from './Action';

function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="live-table-wrap">
      <table className="live-table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
export function DynamicSlot({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const s = useDesign();
  const id = String(props['data-node-id']);
  const name = String(props['data-name']);
  let content: ReactNode = null;
  const query = s.query.toLowerCase();
  const matches = (...v: unknown[]) => v.join(' ').toLowerCase().includes(query);
  const badge = (v: string) => (
    <span
      className={'badge ' + (v === 'Prestado' ? 'dark' : v === 'No disponible' ? 'dashed' : '')}
    >
      {v}
    </span>
  );
  if (name === 'catalog_results') {
    let books = s.data.books.filter(
      (b) =>
        matches(
          s.fields.Criterio === 'Título'
            ? b.title
            : s.fields.Criterio === 'Autor'
              ? b.author
              : s.fields.Criterio === 'Editorial'
                ? b.publisher
                : s.fields.Criterio === 'Clave'
                  ? b.code
                  : [b.title, b.author, b.code, b.publisher].join(' '),
        ) &&
        (!s.filter || s.filter === 'Todos' || [b.use, b.state].includes(s.filter)),
    );
    if (s.sort === 'Autor A–Z') books = [...books].sort((a, b) => a.author.localeCompare(b.author));
    if (s.sort === 'Título A–Z') books = [...books].sort((a, b) => a.title.localeCompare(b.title));
    if (s.sort === 'Título Z–A') books = [...books].sort((a, b) => b.title.localeCompare(a.title));
    content = (
      <div className="catalog-rows">
        {books.slice((s.page - 1) * 5, s.page * 5).map((b) => (
          <article className="book-row" key={b.id} data-record={b.id}>
            <div className="book-cover">LIBRO</div>
            <div className="book-info">
              <button
                className="book-title"
                onClick={(e) => {
                  e.stopPropagation();
                  s.action('Ver detalle', b.id);
                }}
              >
                {b.title}
              </button>
              <p>{b.author}</p>
              <small>
                {b.publisher}
                <span>{b.code}</span>
              </small>
            </div>
            <div className="availability">
              {badge(b.state)}
              <small>{b.use}</small>
            </div>
            <Action primary record={b.id}>
              Ver detalle
            </Action>
          </article>
        ))}
        {!books.length && (
          <div className="empty">
            <h3>No se encontraron libros</h3>
            <p>Prueba con otro título, autor o clave.</p>
            <Action>Limpiar filtros</Action>
          </div>
        )}
      </div>
    );
  } else if (id === '241:3426') {
    content = (
      <Table
        headers={['ID / matrícula', 'Nombre', 'Correo institucional', 'Rol', 'Estado', 'Acciones']}
      >
        {s.data.users
          .filter(
            (u) =>
              matches(u.id, u.name, u.email) &&
              (!s.filter ||
                ['Todos', 'Todos los roles'].includes(s.filter) ||
                u.role === s.filter ||
                (s.filter === 'Activo' ? u.active : s.filter === 'Inactivo' ? !u.active : true)),
          )
          .map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{badge(u.role)}</td>
              <td>{u.active ? 'Activo' : 'Inactivo'}</td>
              <td>
                <Action record={u.id}>Editar</Action>
                <Action record={u.id}>Roles</Action>
                <Action record={u.id}>{u.active ? 'Baja' : 'Reactivar'}</Action>
              </td>
            </tr>
          ))}
      </Table>
    );
  } else if (['247:2890', '247:3115', '207:1276'].includes(id)) {
    content = (
      <Table
        headers={['Clave', 'Título y autor', 'Ejemplares', 'Tipo de uso', 'Estado', 'Acciones']}
      >
        {s.data.books
          .filter(
            (b) =>
              matches(b.code, b.title, b.author) &&
              (!s.filter || s.filter === 'Todos' || b.use === s.filter),
          )
          .slice((s.page - 1) * 5, s.page * 5)
          .map((b) => (
            <tr key={b.id}>
              <td>{b.code}</td>
              <td>
                {b.title}
                <p className="muted">{b.author}</p>
              </td>
              <td>{b.copies}</td>
              <td>{badge(b.use)}</td>
              <td>{b.state === 'No disponible' ? 'Inactivo' : 'Activo'}</td>
              <td>
                <Action record={b.id}>Editar</Action>
                {id === '207:1276' ? (
                  <>
                    <Action record={b.id}>Etiqueta</Action>
                    <Action record={b.id}>Baja</Action>
                  </>
                ) : (
                  <>
                    <Action record={b.id}>Ejemplares</Action>
                    <Action record={b.id}>Historial</Action>
                  </>
                )}
              </td>
            </tr>
          ))}
      </Table>
    );
  } else if (['207:1727', '2081:3458'].includes(id)) {
    content = (
      <Table
        headers={['Folio', 'Libro solicitado', 'Solicitante', 'Costo estimado', 'Estado', 'Acción']}
      >
        {s.data.requests
          .filter(
            (r) =>
              matches(r.id, r.title, r.requester) &&
              (!s.filter || s.filter === 'Todos' || r.state === s.filter),
          )
          .map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.title}</td>
              <td>{r.requester}</td>
              <td>{r.cost.toFixed(2)}</td>
              <td>{badge(r.state)}</td>
              <td>
                <Action record={r.id}>
                  {s.role === 'Comprador de libros' ? 'Revisar' : 'Ver historial'}
                </Action>
              </td>
            </tr>
          ))}
      </Table>
    );
  } else if (id === '207:896') {
    content = (
      <Table headers={['Alumno', 'Concepto', 'Fecha', 'Monto', 'Estado', 'Acción']}>
        {s.data.fines
          .filter(
            (f) =>
              matches(f.user) &&
              (!s.filter ||
                ['Todos', 'Todas'].includes(s.filter) ||
                (s.filter === 'Registrada' ? f.paid : !f.paid)),
          )
          .map((f) => (
            <tr key={f.id}>
              <td>{f.user}</td>
              <td>{f.reason}</td>
              <td>12 oct 2025</td>
              <td>{money(f.amount)}</td>
              <td>{badge(f.paid ? 'Registrada' : 'Pendiente')}</td>
              <td>{!f.paid && <Action record={f.id}>Registrar pago</Action>}</td>
            </tr>
          ))}
      </Table>
    );
  } else if (id === '7:559') {
    content = (
      <Table
        headers={['Libro', 'Fecha de préstamo', 'Vencimiento', 'Renovaciones', 'Estado', 'Acción']}
      >
        {s.data.loans
          .filter((l) => !l.returned && l.userId === 'A01234567')
          .map((l) => (
            <tr key={l.id}>
              <td>{s.data.books.find((b) => b.id === l.bookId)?.title}</td>
              <td>{l.start}</td>
              <td>{l.due}</td>
              <td>{l.renewals} de 2</td>
              <td>{badge('En tiempo')}</td>
              <td>
                <Action record={l.id}>Solicitar renovación</Action>
              </td>
            </tr>
          ))}
      </Table>
    );
  } else if (['144:2196', '174:3022', '192:2732'].includes(id) && s.fields.__searched) {
    if (id === '144:2196') {
      const users = s.data.users.filter((u) => u.active && matches(u.name, u.id));
      content = (
        <div className="search-result">
          {users.length ? (
            users.map((u) => (
              <div key={u.id}>
                <h3>{u.name}</h3>
                <p>
                  {u.id} · {u.role} · Cuenta autorizada
                </p>
                <Action primary record={u.id}>
                  Continuar con este usuario
                </Action>
              </div>
            ))
          ) : (
            <p>No se encontró un usuario activo con esos datos.</p>
          )}
        </div>
      );
    }
    if (id === '174:3022') {
      const books = s.data.books.filter((b) => matches(b.title, b.code));
      content = (
        <div className="search-result">
          {books.length ? (
            books.map((b) => (
              <div key={b.id}>
                <h3>{b.title}</h3>
                <p>
                  {b.code} · {b.state}
                </p>
                {b.state === 'Disponible' && b.use === 'Préstamo externo' ? (
                  <Action primary record={b.id}>
                    Seleccionar ejemplar
                  </Action>
                ) : (
                  <p>Este libro no admite un préstamo externo en este momento.</p>
                )}
              </div>
            ))
          ) : (
            <p>No se encontró el libro.</p>
          )}
        </div>
      );
    }
    if (id === '192:2732') {
      const loans = s.data.loans.filter(
        (l) =>
          !l.returned && matches(l.id, l.userId, s.data.books.find((b) => b.id === l.bookId)?.code),
      );
      content = (
        <div className="search-result">
          {loans.length ? (
            loans.map((l) => (
              <div key={l.id}>
                <h3>{s.data.books.find((b) => b.id === l.bookId)?.title}</h3>
                <p>
                  {l.id} · Vencimiento: {l.due}
                </p>
                <Action primary record={l.id}>
                  Confirmar devolución
                </Action>
              </div>
            ))
          ) : (
            <p>No hay préstamos activos que coincidan.</p>
          )}
        </div>
      );
    }
  }
  return content !== null ? (
    <div
      {...props}
      className="dynamic-slot"
      style={{ width: '100%', minHeight: name === 'catalog_results' ? 647 : undefined }}
    >
      {content}
    </div>
  ) : (
    <div {...props}>{children}</div>
  );
}
