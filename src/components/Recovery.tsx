import { useState } from 'react';
import { request } from '../api';
import './circulation.css';

export function Recovery({ token }: { token?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  return (
    <section className="purchase-dialog circulation" data-circulation>
      <h2>{token ? 'Elige una contraseña nueva' : 'Recuperar acceso'}</h2>
      {!message && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (busy) return;
            const datos = new FormData(e.currentTarget);
            setBusy(true);
            setError('');
            try {
              if (token) {
                if (datos.get('contrasena') !== datos.get('confirmacion'))
                  throw new Error('Las contraseñas no coinciden.');
                await request('/auth/recuperacion/confirmar', 'POST', {
                  token,
                  contrasena: datos.get('contrasena'),
                });
                setMessage('Contraseña actualizada. Ya puedes iniciar sesión.');
              } else {
                const result = await request<{ mensaje: string }>('/auth/recuperacion', 'POST', {
                  identificador: datos.get('identificador'),
                });
                setMessage(result.mensaje);
              }
            } catch (e) {
              setError(e instanceof Error ? e.message : 'No se pudo completar la solicitud.');
            } finally {
              setBusy(false);
            }
          }}
        >
          {token ? (
            <>
              <label>
                Contraseña nueva
                <input
                  name="contrasena"
                  type="password"
                  required
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                />
              </label>
              <label>
                Confirmar contraseña
                <input
                  name="confirmacion"
                  type="password"
                  required
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                />
              </label>
            </>
          ) : (
            <label>
              Matrícula o nómina institucional
              <input name="identificador" autoComplete="username" maxLength={32} required />
            </label>
          )}
          <button className="action" disabled={busy}>
            {busy ? 'Procesando…' : token ? 'Restablecer contraseña' : 'Solicitar enlace'}
          </button>
        </form>
      )}
      {message && (
        <p className="circ-status" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="circ-error" role="alert">
          {error}
        </p>
      )}
      {token && (
        <a
          className="action"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            history.replaceState(null, '', location.pathname);
            location.reload();
          }}
        >
          Volver al inicio de sesión
        </a>
      )}
    </section>
  );
}
