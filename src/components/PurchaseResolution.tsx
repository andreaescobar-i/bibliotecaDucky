import { useState } from 'react';
import { api } from '../api';

export function PurchaseResolution({
  folio,
  onSaved,
}: {
  folio: string;
  onSaved: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  return (
    <form
      className="purchase-dialog circulation"
      data-circulation
      onSubmit={async (e) => {
        e.preventDefault();
        if (busy) return;
        const data = new FormData(e.currentTarget);
        const decision = data.get('decision');
        if (decision !== 'Autorizar' && decision !== 'Rechazar') return;
        setBusy(true);
        setError('');
        try {
          await api.resolvePurchase(folio, decision, String(data.get('referencia') || ''));
          await onSaved();
        } catch (err) {
          setError(err instanceof Error ? err.message : 'No se pudo registrar la decisión.');
        } finally {
          setBusy(false);
        }
      }}
    >
      <h3>Registrar resolución de Tesorería</h3>
      <label>
        Decisión
        <select name="decision" defaultValue="" required>
          <option value="" disabled>
            Selecciona la decisión recibida
          </option>
          <option value="Autorizar">Autorizada</option>
          <option value="Rechazar">Rechazada</option>
        </select>
      </label>
      <label>
        Folio de la resolución
        <input name="referencia" required maxLength={100} />
      </label>
      <button className="action" type="submit" disabled={busy}>
        Guardar resolución
      </button>
      {error && (
        <p className="circ-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
