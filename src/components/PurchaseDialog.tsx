import { useState } from 'react';
import { type Data, money } from '../model';
import { type Purchase, type PurchaseLine, validateLines, receivePurchase } from '../purchases';
const newLine = (): PurchaseLine => ({
  id: crypto.randomUUID(),
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  quantity: 1,
  received: 0,
});
export function PurchaseDialog({
  mode,
  request,
  data,
  commit,
  close,
  canEdit,
}: {
  mode: string;
  request?: Purchase;
  data: Data;
  commit: (p: Purchase, event: string) => void;
  close: () => void;
  canEdit: boolean;
}) {
  const [lines, setLines] = useState<PurchaseLine[]>([newLine()]);
  const [requester, setRequester] = useState('');
  const [cost, setCost] = useState('');
  const [date, setDate] = useState('');
  const [receipt] = useState(() => `REC-${crypto.randomUUID()}`);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  const run = (fn: () => void) => {
    try {
      if (!canEdit) throw new Error('Se requiere una sesión de Comprador de libros.');
      fn();
      setError('');
    } catch (e) {
      setError((e as Error).message);
    }
  };
  const requestLines =
    request?.lines ||
    (request
      ? [
          {
            ...newLine(),
            id: request.id,
            title: request.title,
            quantity: request.quantity,
            received: request.received,
          },
        ]
      : []);
  return (
    <section
      className="purchase-dialog"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <h2>
        {mode === '211-1204'
          ? 'Preparar solicitud de compra'
          : mode === '211-1260'
            ? 'Registrar recepción'
            : 'Seguimiento de solicitud'}
      </h2>
      {error && <p role="alert">{error}</p>}
      <p>
        Presupuesto mensual informado (demostración): {money(120000)} · Disponible informado:{' '}
        {money(78450)}. Tesorería determina la autorización final.
      </p>
      {mode === '211-1204' ? (
        <>
          <p>Destino: Tesorería. No se requiere una ficha del catálogo. El ISBN es opcional.</p>
          <label>
            Solicitante o facultad
            <input value={requester} onChange={(e) => setRequester(e.target.value)} />
          </label>
          <label>
            Costo total estimado del lote (MXN)
            <input
              type="number"
              min="0"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </label>
          {lines.map((l, i) => (
            <fieldset key={l.id}>
              <legend>Partida {i + 1}</legend>
              {(['title', 'author', 'publisher', 'isbn', 'quantity'] as const).map((key, j) => (
                <label key={key}>
                  {['Título', 'Autor', 'Editorial', 'ISBN (opcional)', 'Cantidad solicitada'][j]}
                  <input
                    type={key === 'quantity' ? 'number' : 'text'}
                    value={l[key]}
                    onChange={(e) =>
                      setLines(
                        lines.map((item) =>
                          item.id === l.id
                            ? {
                                ...item,
                                [key]: key === 'quantity' ? Number(e.target.value) : e.target.value,
                              }
                            : item,
                        ),
                      )
                    }
                  />
                </label>
              ))}
              <button
                className="action"
                onClick={() => setLines(lines.filter((item) => item.id !== l.id))}
              >
                Eliminar partida {i + 1}
              </button>
            </fieldset>
          ))}
          <button className="action" onClick={() => setLines([...lines, newLine()])}>
            Agregar partida
          </button>
          <button
            className="action primary"
            onClick={() =>
              run(() => {
                validateLines(lines);
                if (!requester.trim() || !Number.isFinite(Number(cost)) || Number(cost) <= 0)
                  throw new Error('Completa solicitante y costo estimado mayor que cero.');
                const cleaned = lines.map((l) => ({
                  ...l,
                  title: l.title.trim(),
                  author: l.author.trim(),
                  publisher: l.publisher.trim(),
                  isbn: l.isbn.trim(),
                }));
                commit(
                  {
                    id: `SOL-${crypto.randomUUID()}`,
                    title: cleaned.map((l) => l.title).join(' / '),
                    requester: requester.trim(),
                    cost: Number(cost),
                    quantity: cleaned.reduce((n, l) => n + l.quantity, 0),
                    received: 0,
                    state: 'En Tesorería',
                    lines: cleaned,
                    sentAt: new Date().toISOString(),
                    receipts: [],
                  },
                  'Solicitud enviada a Tesorería',
                );
                close();
              })
            }
          >
            Enviar a Tesorería
          </button>
        </>
      ) : mode === '2081-2208' && !request ? (
        <div>
          <h3>Historial de adquisiciones</h3>
          {data.history
            .filter((h) => /solicitud|recepción|catálogo/i.test(h.action))
            .map((h, i) => (
              <p key={i}>
                {new Date(h.at).toLocaleString('es-MX')} · {h.action} · {h.detail}
              </p>
            ))}
        </div>
      ) : !request ? (
        <p role="alert">No se encontró una solicitud con ese folio.</p>
      ) : (
        <>
          <p>
            {request.id} · {request.state}
          </p>
          <p>{request.title}</p>
          <p>Costo estimado: {money(request.cost)} · Destino: Tesorería</p>
          <p>
            {request.sentAt
              ? `Envío confirmado: ${new Date(request.sentAt).toLocaleString('es-MX')}`
              : 'Registro anterior sin fecha de envío.'}
          </p>
          {mode === '211-1260' && (
            <>
              <p>Folio de recepción: {receipt}</p>
              <label>
                Fecha de recepción
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
            </>
          )}
          {requestLines.map((l) => (
            <fieldset key={l.id}>
              <legend>{l.title}</legend>
              <p>
                Autor: {l.author || 'Sin registrar'} · Editorial: {l.publisher || 'Sin registrar'} ·
                ISBN: {l.isbn || 'No informado'}
              </p>
              <p>
                Solicitados: {l.quantity} · Recibidos: {l.received} · Pendientes:{' '}
                {l.quantity - l.received}
              </p>
              {mode === '211-1260' && (
                <label>
                  Cantidad recibida — {l.title}
                  <input
                    type="number"
                    min="0"
                    max={l.quantity - l.received}
                    step="1"
                    value={quantities[l.id] ?? 0}
                    onChange={(e) =>
                      setQuantities({ ...quantities, [l.id]: Number(e.target.value) })
                    }
                  />
                </label>
              )}
            </fieldset>
          ))}
          {mode === '211-1260' && (
            <button
              className="action primary"
              onClick={() =>
                run(() => {
                  commit(
                    receivePurchase(request, date, quantities, receipt),
                    'Recepción registrada',
                  );
                  close();
                })
              }
            >
              Registrar recepción
            </button>
          )}
          <h3>Historial</h3>
          {request.receipts?.map((r) => (
            <div key={r.id}>
              <p>
                {r.id} · {r.date}
              </p>
              {r.lines.map((l) => (
                <p key={l.id}>
                  {requestLines.find((item) => item.id === l.id)?.title}: {l.quantity} ejemplares
                </p>
              ))}
            </div>
          ))}
          {data.history
            .filter((h) => h.detail.includes(request.id))
            .map((h, i) => (
              <p key={i}>
                {new Date(h.at).toLocaleString('es-MX')} · {h.action}
              </p>
            ))}
          {!request.receipts?.length && <p>Sin recepciones registradas.</p>}
        </>
      )}
      <button className="action" onClick={close}>
        Cerrar
      </button>
    </section>
  );
}
