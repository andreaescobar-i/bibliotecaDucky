/*----
 * Programa: SessionNavigation.tsx
 * Objetivo: Implementación del módulo SessionNavigation
 */

import { useDesign } from '../context/DesignContext';

export function SessionNavigation({
  onMenu,
}: {
  onMenu: (label: string, anchor: HTMLElement) => void;
}) {
  const { role, action, overlay, userName } = useDesign();
  const items =
    role === 'Administrador'
      ? ['Reportes', 'Usuarios', 'Libros', 'Administración', 'Operaciones']
      : role === 'Bibliotecario'
        ? ['Catálogo', 'Libros', 'Operaciones']
        : role === 'Comprador de libros'
          ? ['Compras']
          : ['Catálogo', 'Mi cuenta'];
  // Nombre de la cuenta en sesión
  const name = userName || '';
  return (
    <header className="session-header" inert={overlay ? true : undefined}>
      <img src="/assets/e387d.png" alt="Biblioteca Ducky" />
      <nav aria-label="Navegación principal">
        {items.map((item) => {
          const dropdown = ['Libros', 'Administración', 'Operaciones'].includes(item);
          return (
            <button
              key={item}
              aria-haspopup={dropdown ? 'true' : undefined}
              onClick={(event) => (dropdown ? onMenu(item, event.currentTarget) : action(item))}
            >
              {item}
              {dropdown && <span aria-hidden="true"> ▾</span>}
            </button>
          );
        })}
      </nav>
      <button className="session-profile" onClick={() => action('Mi perfil')}>
        <span className="session-avatar">
          {name
            .split(' ')
            .slice(0, 2)
            .map((part) => part[0])
            .join('')}
        </span>
        <span>
          {name}
          <small>{role}</small>
        </span>
      </button>
      <button className="session-logout" onClick={() => action('Cerrar sesión')}>
        Cerrar sesión
      </button>
    </header>
  );
}
