import { useEffect, useState } from 'react';
import { request } from '../api';
import type { Profile } from '../model';
import './circulation.css';

type RoleOption = {
  nombre: string;
  estado: string;
  permisosPermitidos: { clave: string; nombre: string }[];
};
type ProfileDetail = {
  clave: string;
  nombre: string;
  descripcion?: string;
  rol: string;
  permisos: string[];
  cuentas?: { identificador: string; nombre: string }[];
};
const textOf = (e: unknown) =>
  e instanceof Error ? e.message : 'No se pudo completar la operación.';

export function ProfileEditor({
  profile,
  onSaved,
  onCancel,
}: {
  profile?: string;
  onSaved: () => Promise<void>;
  onCancel: () => void;
}) {
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [original, setOriginal] = useState<ProfileDetail | null>(null);
  const [role, setRole] = useState('');
  const [permissions, setPermissions] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  useEffect(() => {
    let active = true;
    Promise.all([
      request<{ roles: RoleOption[] }>('/roles'),
      profile
        ? request<{ perfil: ProfileDetail }>('/perfiles/' + encodeURIComponent(profile)).then(
            (r) => r.perfil,
          )
        : Promise.resolve(null),
    ])
      .then(([r, p]) => {
        if (!active) return;
        setRoles(r.roles.filter((item) => item.estado === 'Activo'));
        setOriginal(p);
        if (p) {
          setPermissions(p.permisos);
          setRole(p.rol);
        }
        setReady(true);
      })
      .catch((err) => {
        if (active) setError(textOf(err));
      });
    return () => {
      active = false;
    };
  }, [profile]);
  const options = roles.find((r) => r.nombre === role)?.permisosPermitidos ?? [];
  return (
    <section className="purchase-dialog circulation circ-result" data-circulation>
      <h3>{profile ? 'Editar perfil' : 'Crear perfil'}</h3>
      {ready && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (busy) return;
            setError('');
            setSuccess('');
            if (!permissions.length) {
              setError('Selecciona al menos un permiso.');
              return;
            }
            const values = Object.fromEntries(new FormData(e.currentTarget));
            setBusy(true);
            try {
              const result = await request<{ mensaje: string }>(
                profile ? '/perfiles/' + encodeURIComponent(profile) : '/perfiles',
                profile ? 'PUT' : 'POST',
                { ...values, rol: role, permisos: permissions },
              );
              setSuccess(result.mensaje);
              await onSaved();
              onCancel();
            } catch (e) {
              setError(textOf(e));
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            Clave del perfil
            <input
              name="clave"
              defaultValue={original?.clave}
              readOnly={!!profile}
              pattern="[A-Za-z0-9-]{2,32}"
              maxLength={32}
              required
            />
          </label>
          <label>
            Nombre del perfil
            <input name="nombre" defaultValue={original?.nombre} maxLength={100} required />
          </label>
          <label>
            Descripción
            <textarea name="descripcion" defaultValue={original?.descripcion} maxLength={1000} />
          </label>
          <label>
            Rol
            <select
              value={role}
              onChange={(e) => {
                const newRole = e.target.value;
                const allowed = new Set(
                  roles.find((r) => r.nombre === newRole)?.permisosPermitidos.map((p) => p.clave),
                );
                setRole(newRole);
                setPermissions((old) => old.filter((p) => allowed.has(p)));
              }}
              required
            >
              <option value="">Selecciona un rol</option>
              {roles.map((r) => (
                <option key={r.nombre}>{r.nombre}</option>
              ))}
            </select>
          </label>
          {options.length > 0 && (
            <fieldset className="profile-choices">
              <legend>Permisos del perfil</legend>
              {options.map((p) => (
                <label key={p.clave}>
                  <input
                    type="checkbox"
                    checked={permissions.includes(p.clave)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setPermissions((old) =>
                        checked ? [...old, p.clave] : old.filter((item) => item !== p.clave),
                      );
                    }}
                  />{' '}
                  {p.nombre}
                </label>
              ))}
            </fieldset>
          )}
          {original?.cuentas?.length > 0 && (
            <details>
              <summary>{original.cuentas.length} cuentas activas asignadas</summary>
              <ul>
                {original.cuentas.map((u) => (
                  <li key={u.identificador}>
                    {u.nombre} · {u.identificador}
                  </li>
                ))}
              </ul>
            </details>
          )}
          <button className="action" disabled={busy}>
            {busy ? 'Guardando…' : 'Guardar perfil'}
          </button>
        </form>
      )}
      {!ready && !error && <p role="status">Cargando permisos…</p>}
      {success && <p role="status">{success}</p>}
      {error && (
        <p role="alert" className="circ-error">
          {error}
        </p>
      )}
      <button className="action" type="button" disabled={busy} onClick={onCancel}>
        Cerrar editor
      </button>
    </section>
  );
}

export function AssignProfile({
  account,
  profiles,
  onSaved,
}: {
  account: string;
  profiles: Profile[];
  onSaved: () => Promise<void>;
}) {
  const [current, setCurrent] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [selected, setSelected] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const options = profiles.filter(
    (p) => p.active && (account.startsWith('A') ? p.role === 'Alumno' : p.role !== 'Alumno'),
  );
  useEffect(() => {
    let active = true;
    request<{ usuario: { perfil: { clave: string; nombre: string } } }>(
      '/usuarios/' + encodeURIComponent(account),
    )
      .then((r) => {
        if (active) {
          setCurrent(r.usuario.perfil.clave);
          setCurrentName(r.usuario.perfil.nombre);
        }
      })
      .catch((e) => {
        if (active) setError(textOf(e));
      });
    return () => {
      active = false;
    };
  }, [account]);
  return (
    <section className="purchase-dialog circulation" data-circulation>
      <h2>Asignar perfil</h2>
      <p>
        Cuenta: {account}
        {currentName ? ' · Perfil actual: ' + currentName : ''}
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (busy || !selected || selected === current) return;
          setBusy(true);
          setError('');
          try {
            await request('/usuarios/' + encodeURIComponent(account) + '/perfil', 'PUT', {
              perfil: selected,
            });
            await onSaved();
          } catch (e) {
            setError(textOf(e));
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          Perfil nuevo
          <select value={selected} onChange={(e) => setSelected(e.target.value)} required>
            <option value="">Selecciona un perfil</option>
            {options.map((profile) => (
              <option key={profile.key} value={profile.key} disabled={profile.key === current}>
                {profile.name} · {profile.role}
              </option>
            ))}
          </select>
        </label>
        <button className="action" disabled={busy || !selected}>
          {busy ? 'Guardando…' : 'Asignar perfil'}
        </button>
      </form>
      {error && (
        <p role="alert" className="circ-error">
          {error}
        </p>
      )}
    </section>
  );
}
