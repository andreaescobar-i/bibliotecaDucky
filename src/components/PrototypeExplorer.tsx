import manifest from '../manifest.json';
import { roles } from '../model';

type PrototypeExplorerProps = {
  role: string;
  onClose: () => void;
  onRoleChange: (role: string) => void;
  go: (route: string) => void;
  open: (overlay: string) => void;
  onReset: () => void;
};

export function PrototypeExplorer({
  role,
  onClose,
  onRoleChange,
  go,
  open,
  onReset,
}: PrototypeExplorerProps) {
  return (
    <aside className="explorer" aria-label="Explorador del prototipo">
      <header>
        <strong>Biblioteca Ducky · Prototipo React</strong>
        <button aria-label="Cerrar explorador" onClick={() => onClose()}>
          ×
        </button>
      </header>
      <p>Datos de demostración guardados en este navegador.</p>
      <label>
        Rol de acceso
        <select
          aria-label="Rol de acceso"
          value={role}
          onChange={(e) => {
            onRoleChange(e.target.value);
          }}
        >
          {roles.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </label>
      <div className="explorer-links">
        {manifest
          .filter((n) => !n.overlay)
          .map((n) => (
            <button
              key={n.module}
              onClick={() => {
                go(n.module);
                onClose();
              }}
            >
              {n.name}
            </button>
          ))}
      </div>
      <details>
        <summary>Ventanas del prototipo</summary>
        {manifest
          .filter((n) => n.overlay)
          .map((n) => (
            <button
              key={n.module}
              onClick={() => {
                open(n.module);
                onClose();
              }}
            >
              {n.name}
            </button>
          ))}
      </details>
      <button
        onClick={() => {
          onReset();
        }}
      >
        Restablecer demostración
      </button>
    </aside>
  );
}
