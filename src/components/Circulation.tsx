import { useEffect, useState, type FormEvent } from 'react';
import { request } from '../api';
import './circulation.css';

type Loan = {
  folio: string;
  nombre?: string;
  identificador?: string;
  titulo: string;
  codigo_ejemplar: string;
  correo?: string;
  telefono?: string;
  fecha_prestamo: string;
  fecha_vencimiento: string;
  fecha_devolucion?: string;
  estado: string;
};
type Fine = {
  adeudo_id: string;
  monto_mxn: string;
  concepto: string;
  titulo: string;
  folio: string;
  estado: string;
  acuse_tesoreria?: string;
  modo_envio_tesoreria?: string;
};
type Account = {
  prestamos: Loan[];
  adeudos: Fine[];
  espera: { titulo: string; posicion: number }[];
};
const endpoint = '/circulacion';
const fmt = (value: string) =>
  new Date(value).toLocaleDateString('es-MX', {
    dateStyle: 'long',
    timeZone: 'America/Monterrey',
  });
const mxn = (value: string) =>
  Number(value).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
const message = (e: unknown) => (e instanceof Error ? e.message : 'Ocurrió un error.');
const titles = {
  loan: 'Registrar préstamo',
  renew: 'Renovar préstamo',
  return: 'Registrar devolución',
  account: 'Mi cuenta',
  queue: 'Lista de espera',
  receipt: 'Boleta de préstamo',
};
export type CirculationMode = keyof typeof titles;
export const circulationRoutes: Record<string, CirculationMode> = {
  '7-439': 'account',
  '7-1177': 'loan',
  '162-2206': 'loan',
  '174-3080': 'loan',
  '182-571': 'receipt',
  '182-908': 'return',
  '207-712': 'renew',
  'circulacion-espera': 'queue',
};

function LoanSummary({ loan }: { loan: Loan }) {
  return (
    <dl className="circ-details">
      <div>
        <dt>Folio</dt>
        <dd>{loan.folio}</dd>
      </div>
      {loan.nombre && (
        <div>
          <dt>Usuario</dt>
          <dd>
            {loan.nombre} · {loan.identificador}
          </dd>
        </div>
      )}
      <div>
        <dt>Libro</dt>
        <dd>
          {loan.titulo} · {loan.codigo_ejemplar}
        </dd>
      </div>
      <div>
        <dt>Préstamo</dt>
        <dd>{fmt(loan.fecha_prestamo)}</dd>
      </div>
      <div>
        <dt>Vencimiento</dt>
        <dd>{fmt(loan.fecha_vencimiento)}</dd>
      </div>
      {loan.fecha_devolucion && (
        <div>
          <dt>Devuelto</dt>
          <dd>{fmt(loan.fecha_devolucion)}</dd>
        </div>
      )}
    </dl>
  );
}

function Receipt({ loan }: { loan: Loan }) {
  const text = [
    'Biblioteca Ducky — Boleta de préstamo',
    `Folio: ${loan.folio}`,
    `Usuario: ${loan.nombre}`,
    `Libro: ${loan.titulo} (${loan.codigo_ejemplar})`,
    `Fecha de préstamo: ${fmt(loan.fecha_prestamo)}`,
    `Fecha de vencimiento: ${fmt(loan.fecha_vencimiento)}`,
  ].join('\n');
  const number = loan.telefono?.replace(/\D/g, '') || '';
  const recipient = number.length === 10 ? '52' + number : number;
  function print() {
    const frame = document.createElement('iframe');
    frame.className = 'circ-print-frame';
    frame.title = 'Impresión de boleta';
    document.body.append(frame);
    const doc = frame.contentDocument;
    const win = frame.contentWindow;
    if (!doc || !win) {
      frame.remove();
      return;
    }
    doc.title = 'Boleta ' + loan.folio;
    const heading = doc.createElement('h1');
    heading.textContent = 'Biblioteca Ducky';
    const details = doc.createElement('p');
    details.style.whiteSpace = 'pre-wrap';
    details.textContent = text;
    doc.body.append(heading, details);
    win.addEventListener('afterprint', () => frame.remove(), { once: true });
    win.focus();
    win.print();
  }
  return (
    <section className="circ-result" aria-label="Boleta de préstamo">
      <h3>Boleta de préstamo</h3>
      <LoanSummary loan={loan} />
      <div className="circ-actions">
        {loan.correo && (
          <a
            className="action"
            href={`mailto:${encodeURIComponent(loan.correo)}?subject=${encodeURIComponent('Boleta ' + loan.folio)}&body=${encodeURIComponent(text)}`}
          >
            Abrir correo
          </a>
        )}
        <a
          className="action"
          target="_blank"
          rel="noreferrer"
          href={`https://wa.me/${recipient}?text=${encodeURIComponent(text)}`}
        >
          Compartir por WhatsApp
        </a>
        <button type="button" className="action" onClick={print}>
          Imprimir boleta
        </button>
      </div>
      <small>
        Revisa el destinatario y confirma el envío en tu aplicación de correo o WhatsApp.
      </small>
    </section>
  );
}

export function Circulation({ mode, onChanged }: { mode: CirculationMode; onChanged: () => void }) {
  const [loan, setLoan] = useState<Loan | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [folio, setFolio] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loadVersion, setLoadVersion] = useState(0);
  useEffect(() => {
    let active = true;
    if (mode !== 'account') return;
    request<Account>(endpoint + '/mi-cuenta')
      .then((data) => {
        if (active) setAccount(data);
      })
      .catch((e) => {
        if (active) setError(message(e));
      });
    return () => {
      active = false;
    };
  }, [mode, loadVersion]);

  async function run(work: () => Promise<void>) {
    setBusy(true);
    setError('');
    setStatus('');
    try {
      await work();
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  function submit(e: FormEvent<HTMLFormElement>, work: (fields: FormData) => Promise<void>) {
    e.preventDefault();
    if (!busy) {
      const fields = new FormData(e.currentTarget);
      void run(() => work(fields));
    }
  }
  const loanPath = (id: string) => endpoint + '/prestamos/' + encodeURIComponent(id.trim());
  const searchable = ['receipt', 'renew', 'return'].includes(mode);
  return (
    <section className="purchase-dialog circulation" data-circulation>
      <h1>{titles[mode]}</h1>
      {mode === 'loan' && (
        <>
          <p>
            Identifica al usuario y al ejemplar. La fecha de vencimiento se calcula con la política
            del perfil.
          </p>
          <form
            onSubmit={(e) =>
              submit(e, async (f) => {
                const p = await request<Loan>(
                  endpoint + '/prestamos',
                  'POST',
                  Object.fromEntries(f),
                );
                setLoan(p);
                setStatus('Préstamo registrado.');
                onChanged();
              })
            }
          >
            <label>
              Matrícula o nómina <input name="identificador" required maxLength={32} />
            </label>
            <label>
              Clave de ejemplar <input name="ejemplar" required maxLength={64} />
            </label>
            <button className="action" disabled={busy}>
              Registrar préstamo
            </button>
          </form>
          <a className="action" href="#182-571">
            Consultar boleta por folio
          </a>
        </>
      )}
      {searchable && (
        <form
          onSubmit={(e) =>
            submit(e, async () => {
              setLoan(null);
              setLoan(await request<Loan>(loanPath(folio)));
            })
          }
        >
          <label>
            Folio de préstamo{' '}
            <input
              value={folio}
              onChange={(e) => {
                setFolio(e.target.value);
                setLoan(null);
              }}
              required
              maxLength={64}
              disabled={busy}
            />
          </label>
          <button className="action" disabled={busy}>
            Buscar préstamo
          </button>
        </form>
      )}
      {loan &&
        (mode === 'loan' || mode === 'receipt' ? (
          <Receipt loan={loan} />
        ) : (
          <>
            <LoanSummary loan={loan} />
            {loan.estado === 'ACTIVO' ? (
              <form
                onSubmit={(e) =>
                  submit(e, async (f) => {
                    if (mode === 'renew') {
                      setLoan(
                        await request<Loan>(loanPath(loan.folio) + '/renovacion', 'POST', {}),
                      );
                      setStatus('Renovación registrada. La boleta refleja el nuevo vencimiento.');
                    } else {
                      const result = await request<{
                        prestamo: Loan;
                        multa: Fine | null;
                        hayEspera: boolean;
                        aviso?: string;
                      }>(loanPath(loan.folio) + '/devolucion', 'POST', Object.fromEntries(f));
                      setLoan(result.prestamo);
                      const fine = result.multa;
                      setStatus(
                        'Devolución registrada. ' +
                          (fine
                            ? `Multa de ${mxn(fine.monto_mxn)}. ` +
                              (result.aviso ||
                                `Envío ${fine.modo_envio_tesoreria === 'REAL' ? 'confirmado' : 'simulado'} a Tesorería: ${fine.acuse_tesoreria}.`)
                            : 'Sin multa por retraso.') +
                          (result.hayEspera
                            ? ' Este libro tiene usuarios en lista de espera.'
                            : ''),
                      );
                    }
                    onChanged();
                  })
                }
              >
                {mode === 'return' && (
                  <>
                    <label>
                      Condición del ejemplar{' '}
                      <select name="condicion">
                        <option>Buen estado</option>
                        <option>Dañado</option>
                      </select>
                    </label>
                    <label>
                      Observaciones <textarea name="observaciones" maxLength={500} />
                    </label>
                    <small>
                      Si el ejemplar está dañado quedará en revisión. El atraso se calcula a $10 MXN
                      por día hábil.
                    </small>
                  </>
                )}
                <button className="action" disabled={busy}>
                  {mode === 'return' ? 'Confirmar devolución' : 'Confirmar renovación'}
                </button>
              </form>
            ) : (
              <p>
                {loan.estado === 'PERDIDO'
                  ? 'Préstamo cerrado por extravío.'
                  : 'Préstamo devuelto.'}
              </p>
            )}
            {mode === 'renew' && loan.estado === 'ACTIVO' && <Receipt loan={loan} />}
          </>
        ))}
      {mode === 'queue' && (
        <form
          onSubmit={(e) =>
            submit(e, async (f) => {
              const data = await request<{ posicion: number }>(
                endpoint + '/espera',
                'POST',
                Object.fromEntries(f),
              );
              setStatus(`Usuario inscrito en la posición ${data.posicion}.`);
            })
          }
        >
          <p>
            El turno se asigna por orden de inscripción cuando el libro no tiene ejemplares de
            préstamo externo disponibles o ya hay una fila.
          </p>
          <label>
            Matrícula o nómina <input name="identificador" required maxLength={32} />
          </label>
          <label>
            Clave de libro <input name="claveLibro" required maxLength={64} />
          </label>
          <button className="action" disabled={busy}>
            Registrar en lista de espera
          </button>
        </form>
      )}
      {mode === 'account' && (
        <>
          {!account && !error && <p>Cargando cuenta…</p>}
          {account && (
            <>
              <h2>Préstamos e historial</h2>
              {account.prestamos.length ? (
                account.prestamos.map((p) => (
                  <article className="circ-result" key={p.folio}>
                    <h3>
                      {p.estado === 'ACTIVO'
                        ? new Date(p.fecha_vencimiento) < new Date()
                          ? 'Vencido'
                          : 'Activo'
                        : p.estado === 'PERDIDO'
                          ? 'Extraviado'
                          : 'Devuelto'}
                    </h3>
                    <LoanSummary loan={p} />
                    {p.estado === 'ACTIVO' && new Date(p.fecha_vencimiento) >= new Date() && (
                      <button
                        className="action"
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          void run(async () => {
                            const renewed = await request<
                              Pick<Loan, 'folio' | 'fecha_vencimiento'>
                            >(
                              endpoint +
                                '/mi-cuenta/prestamos/' +
                                encodeURIComponent(p.folio) +
                                '/renovacion',
                              'POST',
                              {},
                            );
                            setAccount((old) =>
                              old
                                ? {
                                    ...old,
                                    prestamos: old.prestamos.map((loan) =>
                                      loan.folio === renewed.folio
                                        ? { ...loan, fecha_vencimiento: renewed.fecha_vencimiento }
                                        : loan,
                                    ),
                                  }
                                : old,
                            );
                            setStatus(
                              'Renovación registrada. Vence el ' +
                                fmt(renewed.fecha_vencimiento) +
                                '.',
                            );
                          })
                        }
                      >
                        Solicitar renovación
                      </button>
                    )}
                  </article>
                ))
              ) : (
                <p>No hay préstamos registrados.</p>
              )}
              <h2>Adeudos</h2>
              <FineList fines={account.adeudos} />
              <h2>Lista de espera</h2>
              {account.espera.length ? (
                <ul>
                  {account.espera.map((w) => (
                    <li key={w.titulo}>
                      {w.titulo} · Posición {w.posicion}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tienes turnos pendientes.</p>
              )}
            </>
          )}
          <WaitButton onJoined={() => setLoadVersion((x) => x + 1)} />
        </>
      )}
      {busy && <p role="status">Procesando…</p>}
      {status && (
        <p role="status" className="circ-status">
          {status}
        </p>
      )}
      {error && (
        <p role="alert" className="circ-error">
          {error}
        </p>
      )}
      {mode === 'account' && (
        <button
          className="action"
          type="button"
          onClick={() => {
            setError('');
            setLoadVersion((x) => x + 1);
          }}
        >
          Actualizar cuenta
        </button>
      )}
    </section>
  );
}

function FineList({ fines }: { fines: Fine[] }) {
  return fines.length ? (
    <ul className="circ-list">
      {fines.map((f) => (
        <li key={f.adeudo_id}>
          <strong>
            {mxn(f.monto_mxn)} · {f.concepto || 'Adeudo'}
          </strong>
          <span>
            {f.titulo} · {f.folio}
          </span>
          <span>
            {f.estado === 'PENDIENTE'
              ? 'Pago pendiente'
              : f.estado === 'PAGADO'
                ? 'Pagado'
                : f.estado}
            {f.acuse_tesoreria
              ? ` · Acuse ${f.modo_envio_tesoreria === 'REAL' ? 'confirmado' : 'simulado'}: ${f.acuse_tesoreria}`
              : ''}
          </span>
        </li>
      ))}
    </ul>
  ) : (
    <p>No hay adeudos para mostrar.</p>
  );
}

export function WaitButton({ book, onJoined }: { book?: string; onJoined?: () => void }) {
  const [busy, setBusy] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  return (
    <form
      className="purchase-dialog circ-wait"
      data-circulation
      onSubmit={async (e) => {
        e.preventDefault();
        if (busy) return;
        const claveLibro = book || new FormData(e.currentTarget).get('claveLibro');
        setBusy(true);
        setError('');
        setConfirmation('');
        try {
          const data = await request<{ posicion: number }>(endpoint + '/mi-espera', 'POST', {
            claveLibro,
          });
          setConfirmation(`Inscripción registrada. Tu posición es ${data.posicion}.`);
          onJoined?.();
        } catch (e) {
          setError(message(e));
        } finally {
          setBusy(false);
        }
      }}
    >
      {!book && (
        <label>
          Clave de libro <input name="claveLibro" required maxLength={64} />
        </label>
      )}
      <button className="action" disabled={busy || Boolean(book && confirmation)}>
        {busy ? 'Registrando…' : 'Inscribirme en lista de espera'}
      </button>
      {confirmation && (
        <p role="status" className="circ-status">
          {confirmation}
        </p>
      )}
      {error && (
        <p role="alert" className="circ-error">
          {error}
        </p>
      )}
    </form>
  );
}
