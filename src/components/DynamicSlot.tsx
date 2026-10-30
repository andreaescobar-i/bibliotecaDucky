/*----
 * Programa: DynamicSlot.tsx
 * Objetivo: Implementación del módulo DynamicSlot
 */

import type { HTMLAttributes, ReactNode } from 'react';
import { dateText } from '../model';
import { useDesign } from '../context/DesignContext';
import { Action } from './Action';
import { bookPdfUrl } from '../api';
import { PAGE_SIZE, catalogBooks, filteredRequests, filteredUsers, managedBooks } from '../listas';

function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="live-table-wrap">
      <table className="live-table">
        {headers.length > 0 && (
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
const Empty = ({ columns, text }: { columns: number; text: string }) => (
  <tr>
    <td colSpan={columns} className="muted">
      {text}
    </td>
  </tr>
);
export function DynamicSlot({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const s = useDesign();
  const id = String(props['data-node-id']);
  const name = String(props['data-name']);
  let content: ReactNode = null;
  const badge = (v: string) => (
    <span
      className={'badge ' + (v === 'Prestado' ? 'dark' : v === 'No disponible' ? 'dashed' : '')}
    >
      {v}
    </span>
  );
  const page = (list: any[]) => list.slice((s.page - 1) * PAGE_SIZE, s.page * PAGE_SIZE);
  if (name === 'catalog_results') {
    const books = catalogBooks(s);
    content = (
      <div className="catalog-rows">
        {page(books).map((b) => (
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
    const users = filteredUsers(s);
    content = (
      <Table
        headers={['ID / matrícula', 'Nombre', 'Correo institucional', 'Rol', 'Estado', 'Acciones']}
      >
        {users.map((u) => (
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
        {!users.length && <Empty columns={6} text="No hay usuarios que coincidan." />}
      </Table>
    );
  } else if (['247:2890', '247:3115', '207:1276'].includes(id)) {
    const books = managedBooks(s);
    content = (
      <Table
        headers={['Clave', 'Título y autor', 'Ejemplares', 'Tipo de uso', 'Estado', 'Acciones']}
      >
        {page(books).map((b) => (
          <tr key={b.id}>
            <td>{b.code}</td>
            <td>
              {b.title}
              <p className="muted">{b.author}</p>
            </td>
            <td>{b.copies}</td>
            <td>{badge(b.use)}</td>
            <td>{b.copies > 0 ? 'Activo' : 'Sin ejemplares'}</td>
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
        {!books.length && <Empty columns={6} text="No hay libros que coincidan." />}
      </Table>
    );
  } else if (['207:1727', '2081:3458'].includes(id)) {
    const requests = filteredRequests(s);
    content = (
      <Table
        headers={['Folio', 'Libro solicitado', 'Solicitante', 'Costo estimado', 'Estado', 'Acción']}
      >
        {requests.map((r) => (
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
        {!requests.length && <Empty columns={6} text="No hay solicitudes que coincidan." />}
      </Table>
    );
  } else if (id === '2148:2159') {
    // Roles registrados con los permisos que admiten y los perfiles que los usan
    content = (
      <Table headers={['Perfil / rol', 'Ámbito de acceso', 'Permisos y acciones', 'Perfiles']}>
        {(s.data.roles || []).map((r) => (
          <tr key={r.name}>
            <td>{r.name}</td>
            <td>{r.description}</td>
            <td>{r.permissions.join(', ')}</td>
            <td>
              {(s.data.profiles || [])
                .filter((p) => p.role === r.name)
                .map((p) => `${p.name} (${p.active ? 'activo' : 'inactivo'})`)
                .join(', ') || 'Sin perfiles'}
            </td>
          </tr>
        ))}
      </Table>
    );
  } else if (id === '247:3511' || id === '6:172') {
    const copies = s.book.copyList || [];
    const manage = id === '247:3511';
    content = (
      <Table
        headers={
          manage
            ? ['Ejemplar', 'Clasificación', 'Ubicación', 'Estado', 'Acciones']
            : ['Ejemplar', 'Ubicación en biblioteca', 'Tipo de uso', 'Estado']
        }
      >
        {copies.map((c) => (
          <tr key={c.clave}>
            <td>{c.clave}</td>
            {manage && <td>{c.clasificacion || 'Sin clasificar'}</td>}
            <td>{c.ubicacion || 'Ubicación incompleta'}</td>
            {!manage && <td>{c.tipoUso}</td>}
            <td>{badge(c.estado)}</td>
            {manage && (
              <td>
                <Action record={c.clave}>Clasificar</Action>
                <Action record={c.clave}>Etiqueta</Action>
                <Action record={c.clave}>Baja</Action>
              </td>
            )}
          </tr>
        ))}
        {!copies.length && <Empty columns={manage ? 5 : 4} text="Sin ejemplares registrados." />}
      </Table>
    );
  } else if (id === '373:1915') {
    const accounts: any[] = s.extra.cuentas || [];
    content = (
      <div className="search-result">
        <p>
          {accounts.length} cuenta{accounts.length === 1 ? '' : 's'} activa
          {accounts.length === 1 ? '' : 's'} asignada{accounts.length === 1 ? '' : 's'}:
        </p>
        {accounts.map((c) => (
          <p key={c.identificador}>
            {c.identificador} — {c.nombre}
          </p>
        ))}
        <p>Reasigne las cuentas activas antes de desactivar el perfil.</p>
      </div>
    );
  } else if (id === '342:1842') {
    content = (
      <div className="search-result">
        <p>{s.extra.mensaje}</p>
        {s.extra.area && <p>Área a la que debes acudir: {s.extra.area}.</p>}
      </div>
    );
  } else if (id === '2189:2126') {
    const delivered = s.data.requests.filter((r) => r.state === 'Entregado al catálogo');
    content = delivered.length ? (
      // Los encabezados ya están en el diseño de la ventana
      <Table headers={[]}>
        {delivered.map((r) => (
          <tr key={r.id}>
            <td>
              {r.title}
              <p className="muted">{r.id}</p>
            </td>
            <td>{r.received} ejemplar(es)</td>
            <td>Entregado el {dateText(r.deliveredAt)}</td>
          </tr>
        ))}
      </Table>
    ) : (
      <p className="muted">
        Aún no hay libros entregados al encargado del catálogo. Las entregas confirmadas aparecerán
        aquí.
      </p>
    );
  } else if (id === '2196:2031') {
    content = s.book.code ? (
      <iframe
        className="pdf-frame"
        title={`PDF de ${s.book.title}`}
        src={bookPdfUrl(s.book.code)}
      />
    ) : null;
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
