import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { request } from '../api';
import './circulation.css';

const base = '/gestion-biblioteca';
const get = <T,>(path: string) => request<T>(base + path);
const post = <T,>(path: string, body: unknown = {}) => request<T>(base + path, 'POST', body);
const currency = (amount: string | number) =>
  Number(amount).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
const date = (value?: string) =>
  value ? new Date(value).toLocaleDateString('es-MX', { timeZone: 'America/Monterrey' }) : '—';
const today = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Monterrey' });
const errorText = (e: unknown) => (e instanceof Error ? e.message : 'Ocurrió un error.');
const toBody = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  return Object.fromEntries(new FormData(event.currentTarget));
};
function useOperation() {
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  async function run(work: () => Promise<string | void>) {
    if (busy) return;
    setBusy(true);
    setError('');
    setFeedback('');
    try {
      setFeedback((await work()) || '');
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  return {
    busy,
    run,
    message: (
      <>
        {busy && <p role="status">Procesando…</p>}
        {feedback && (
          <p className="circ-status" role="status">
            {feedback}
          </p>
        )}
        {error && (
          <p className="circ-error" role="alert">
            {error}
          </p>
        )}
      </>
    ),
  };
}
function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: { key: string; cols: ReactNode[] }[];
}) {
  if (!rows.length) return <p>No hay registros que coincidan.</p>;
  return (
    <div className="live-table-wrap">
      <table className="live-table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th scope="col" key={h}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ key, cols }) => (
            <tr key={key}>
              {cols.map((c, index) => (
                <td key={index}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function downloadCsv(filename: string, rows: unknown[][]) {
  const value = (x: unknown) => {
    let s = String(x ?? '');
    if (/^[\s]*[=+@-]|^[\t\r\n]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  };
  const blob = new Blob(['\ufeff' + rows.map((row) => row.map(value).join(',')).join('\r\n')], {
    type: 'text/csv;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = filename;
  a.href = url;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

type Debt = {
  adeudo_id: string;
  tipo: string;
  concepto: string;
  monto_mxn: string;
  estado: string;
  acuse_tesoreria?: string;
  modo_envio_tesoreria?: string;
  folio_tesoreria?: string;
  fecha_pago?: string;
  folio: string;
  titulo: string;
  nombre: string;
  identificador: string;
  acuse_escolares?: string;
  modo_envio_escolares?: string;
};
type LoanLookup = {
  folio: string;
  estado: string;
  titulo: string;
  nombre: string;
  codigo_ejemplar: string;
};
type DebtMode = 'adeudos' | 'pago' | 'perdida';

function Acknowledgment({ receipt, mode }: { receipt?: string; mode?: string }) {
  return <>{receipt ? (mode === 'REAL' ? 'Confirmado: ' : 'Simulado: ') + receipt : 'Sin acuse'}</>;
}

export function DebtManagement({ start = 'adeudos' }: { start?: DebtMode }) {
  const op = useOperation();
  const [rows, setRows] = useState<Debt[]>([]);
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [mode, setMode] = useState<DebtMode>(start);
  const [selected, setSelected] = useState('');
  const [lossFolio, setLossFolio] = useState('');
  const [loan, setLoan] = useState<LoanLookup | null>(null);
  const [ready, setReady] = useState(false);
  const debt = rows.find((row) => row.adeudo_id === selected);
  async function load(search: string) {
    const list = await get<Debt[]>('/adeudos?busqueda=' + encodeURIComponent(search));
    setRows(list);
    setReady(true);
  }
  useEffect(() => {
    void op.run(() => load(''));
  }, []);
  return (
    <section className="purchase-dialog circulation management-screen" data-circulation>
      <h1>Multas, reposiciones y pagos</h1>
      <p>
        Consulta adeudos, registra comprobantes pagados en Tesorería y reporta material extraviado.
      </p>
      <div className="circ-actions">
        <button
          type="button"
          disabled={op.busy}
          className="action"
          onClick={() => setMode('adeudos')}
        >
          Consultar adeudos
        </button>
        <button
          type="button"
          disabled={op.busy}
          className="action"
          onClick={() => {
            setSelected('');
            setMode('pago');
          }}
        >
          Registrar pago
        </button>
        <button
          type="button"
          disabled={op.busy}
          className="action"
          onClick={() => setMode('perdida')}
        >
          Reportar libro perdido
        </button>
      </div>
      {mode !== 'perdida' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void op.run(async () => {
              await load(query.trim());
              setSubmitted(query.trim());
              setSelected('');
            });
          }}
        >
          <label>
            Matrícula, nómina o folio (opcional)
            <input value={query} onChange={(e) => setQuery(e.target.value)} maxLength={64} />
          </label>
          <button className="action" disabled={op.busy}>
            Buscar adeudos
          </button>
        </form>
      )}
      {mode === 'pago' && (
        <form
          className="circ-result"
          onSubmit={(e) => {
            const body = toBody(e);
            if (!debt) return;
            void op.run(async () => {
              const pago = await post<Partial<Debt>>('/adeudos/' + debt.adeudo_id + '/pago', body);
              setRows((old) =>
                old.map((r) => (r.adeudo_id === debt.adeudo_id ? { ...r, ...pago } : r)),
              );
              setSelected('');
              setMode('adeudos');
              return 'Pago registrado. Comprobante: ' + pago.folio_tesoreria;
            });
          }}
        >
          <h2>Registrar comprobante</h2>
          <label>
            Adeudo
            <select value={selected} required onChange={(e) => setSelected(e.target.value)}>
              <option value="">Selecciona un adeudo pendiente</option>
              {rows
                .filter((row) => row.estado === 'PENDIENTE')
                .map((row) => (
                  <option value={row.adeudo_id} key={row.adeudo_id}>
                    {row.identificador} · {row.folio} · {row.tipo} · {currency(row.monto_mxn)}
                  </option>
                ))}
            </select>
          </label>
          {debt && (
            <p>
              {debt.nombre} · {debt.titulo} · Saldo: {currency(debt.monto_mxn)}
            </p>
          )}
          <label>
            Monto pagado (MXN)
            <input
              name="monto"
              type="number"
              step="0.01"
              min="0.01"
              key={selected}
              defaultValue={debt?.monto_mxn}
              required
            />
          </label>
          <label>
            Folio del comprobante
            <input name="folio" maxLength={64} required />
          </label>
          <label>
            Fecha del pago
            <input name="fecha" type="date" max={today()} defaultValue={today()} required />
          </label>
          <button className="action" disabled={!debt || op.busy}>
            Confirmar pago
          </button>
        </form>
      )}
      {mode === 'perdida' && (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void op.run(async () => {
                setLoan(null);
                setLoan(
                  await request('/circulacion/prestamos/' + encodeURIComponent(lossFolio.trim())),
                );
              });
            }}
          >
            <label>
              Folio de préstamo
              <input
                value={lossFolio}
                maxLength={64}
                onChange={(e) => {
                  setLossFolio(e.target.value);
                  setLoan(null);
                }}
                required
              />
            </label>
            <button className="action" disabled={op.busy}>
              Buscar préstamo
            </button>
          </form>
          {loan && (
            <section className="circ-result">
              <p>
                {loan.nombre} · {loan.titulo} · {loan.codigo_ejemplar}
              </p>
              {loan.estado !== 'ACTIVO' ? (
                <p>El préstamo ya está cerrado.</p>
              ) : (
                <form
                  onSubmit={(e) => {
                    const body = toBody(e);
                    void op.run(async () => {
                      const result = await post<Debt & { avisosPendientes: boolean }>('/perdidas', {
                        ...body,
                        folio: loan.folio,
                      });
                      setLoan(null);
                      setLossFolio('');
                      setMode('adeudos');
                      setQuery(loan.folio);
                      setSubmitted(loan.folio);
                      try {
                        await load(loan.folio);
                      } catch {
                        return 'Reposición registrada. Vuelve a consultar el folio para revisar los avisos.';
                      }
                      return (
                        'Reposición registrada por ' +
                        currency(result.monto_mxn) +
                        (result.avisosPendientes
                          ? '. Hay avisos pendientes de reintento.'
                          : '. Revisa los acuses en el listado.')
                      );
                    });
                  }}
                >
                  <p>
                    Se cerrará el préstamo, se dará de baja el ejemplar y se calculará la reposición
                    con el precio de compra registrado en la ficha.
                  </p>
                  <label>
                    Tipo de cambio (MXN por USD)
                    <input
                      name="cambio"
                      type="number"
                      step="0.000001"
                      min="0.000001"
                      max="9999"
                      required
                    />
                  </label>
                  <label>
                    Fecha del tipo de cambio
                    <input name="fecha" type="date" max={today()} defaultValue={today()} required />
                  </label>
                  <label>
                    Fuente del tipo de cambio
                    <input name="fuente" maxLength={200} required />
                  </label>
                  <button className="action" disabled={op.busy}>
                    Confirmar extravío y reposición
                  </button>
                </form>
              )}
            </section>
          )}
        </>
      )}
      {mode === 'adeudos' && ready && (
        <Table
          headers={['Usuario y préstamo', 'Adeudo', 'Saldo y comprobante', 'Avisos', 'Acciones']}
          rows={rows.map((a) => ({
            key: a.adeudo_id,
            cols: [
              <>
                {a.nombre} · {a.identificador}
                <br />
                {a.titulo}
                <br />
                {a.folio}
              </>,
              a.concepto,
              <>
                {currency(a.monto_mxn)} · {a.estado === 'PAGADO' ? 'Pagado' : 'Pendiente'}
                {a.folio_tesoreria && (
                  <>
                    <br />
                    {a.folio_tesoreria} · {date(a.fecha_pago)}
                  </>
                )}
              </>,
              <>
                Tesorería:{' '}
                <Acknowledgment receipt={a.acuse_tesoreria} mode={a.modo_envio_tesoreria} />
                {a.tipo === 'REPOSICION' && (
                  <>
                    <br />
                    Escolares:{' '}
                    <Acknowledgment receipt={a.acuse_escolares} mode={a.modo_envio_escolares} />
                  </>
                )}
              </>,
              <div className="circ-actions">
                {a.estado === 'PENDIENTE' && (
                  <button
                    className="action"
                    disabled={op.busy}
                    onClick={() => {
                      setSelected(a.adeudo_id);
                      setMode('pago');
                    }}
                  >
                    Registrar pago
                  </button>
                )}
                {a.estado === 'PENDIENTE' && a.modo_envio_tesoreria !== 'REAL' && (
                  <button
                    className="action"
                    disabled={op.busy}
                    onClick={() =>
                      void op.run(async () => {
                        const r = await post<Partial<Debt>>(
                          '/adeudos/' + a.adeudo_id + '/tesoreria',
                        );
                        setRows((old) =>
                          old.map((item) =>
                            item.adeudo_id === a.adeudo_id ? { ...item, ...r } : item,
                          ),
                        );
                        return 'Acuse de Tesorería actualizado.';
                      })
                    }
                  >
                    Remitir a Tesorería
                  </button>
                )}
                {a.tipo === 'REPOSICION' && a.modo_envio_escolares !== 'REAL' && (
                  <button
                    className="action"
                    disabled={op.busy}
                    onClick={() =>
                      void op.run(async () => {
                        await post('/adeudos/' + a.adeudo_id + '/escolares');
                        await load(submitted);
                        return 'Acuse de Servicios Escolares actualizado.';
                      })
                    }
                  >
                    Notificar a Escolares
                  </button>
                )}
              </div>,
            ],
          }))}
        />
      )}
      {op.message}
    </section>
  );
}

type Debtor = {
  identificador: string;
  nombre: string;
  programa: string;
  vencidos: number;
  multas: string;
  reposicion: string;
  suspension_id?: string;
  suspendido?: boolean;
  motivo?: string;
  ultimo_aviso?: string;
};
type Cut = {
  reporte_deudores_id: string;
  periodo: string;
  fecha_corte: string;
  acuse_escolares?: string;
  modo_envio?: string;
  detalle: Debtor[];
};
const debtHeader = [
  'Matrícula',
  'Nombre',
  'Programa',
  'Préstamos vencidos',
  'Multas MXN',
  'Reposición MXN',
  'Suspensión',
];
const debtorData = (r: Debtor) => [
  r.identificador,
  r.nombre,
  r.programa,
  r.vencidos,
  r.multas,
  r.reposicion,
  r.suspendido || r.suspension_id ? 'Vigente' : 'Sin suspensión',
];

export function Suspensions({ showCut = false }: { showCut?: boolean }) {
  const op = useOperation();
  const [debts, setDebts] = useState<Debtor[]>([]);
  const [cut, setCut] = useState<Cut | null>(null);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState('');
  const [program, setProgram] = useState('');
  const [filter, setFilter] = useState('');
  const [mat, setMat] = useState('');
  const [lifting, setLifting] = useState(false);
  async function load() {
    setDebts(await get('/suspendidos'));
    setCut(await get('/cortes'));
    setReady(true);
  }
  useEffect(() => {
    void op.run(load);
  }, []);
  const shown = debts.filter(
    (r) =>
      (!program || r.programa === program) &&
      (!query ||
        (r.nombre + ' ' + r.identificador)
          .toLocaleLowerCase()
          .includes(query.trim().toLocaleLowerCase())) &&
      (!filter ||
        (filter === 'vencidos' && r.vencidos > 0) ||
        (filter === 'multas' && Number(r.multas) > 0) ||
        (filter === 'reposicion' && Number(r.reposicion) > 0) ||
        (filter === 'suspension' && r.suspension_id)),
  );
  return (
    <section className="purchase-dialog circulation management-screen" data-circulation>
      <h1>{showCut ? 'Lista de suspendidos: último corte' : 'Alumnos suspendidos y deudores'}</h1>
      <p>
        Consulta suspensiones vigentes, libros vencidos y adeudos. Genera un corte de la lista
        completa para el periodo de exámenes.
      </p>
      {!showCut && (
        <>
          <div className="management-filters">
            <label>
              Buscar alumno
              <input value={query} onChange={(e) => setQuery(e.target.value)} />
            </label>
            <label>
              Programa
              <select value={program} onChange={(e) => setProgram(e.target.value)}>
                <option value="">Todos</option>
                {[...new Set(debts.map((r) => r.programa))].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
            <label>
              Tipo de adeudo o estatus
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="">Todos</option>
                <option value="vencidos">Préstamos vencidos</option>
                <option value="multas">Multas</option>
                <option value="reposicion">Reposición</option>
                <option value="suspension">Suspensión vigente</option>
              </select>
            </label>
          </div>
          {ready && (
            <Table
              headers={[
                'Alumno',
                'Programa',
                'Libros vencidos',
                'Multas',
                'Reposición',
                'Último aviso real',
                'Estatus',
              ]}
              rows={shown.map((r) => ({
                key: r.identificador,
                cols: [
                  r.nombre + ' · ' + r.identificador,
                  r.programa,
                  r.vencidos,
                  currency(r.multas),
                  currency(r.reposicion),
                  date(r.ultimo_aviso),
                  r.suspension_id ? 'Suspendido: ' + r.motivo : 'Con pendientes',
                ],
              }))}
            />
          )}
          <form
            onSubmit={(e) => {
              const body = toBody(e);
              void op.run(async () => {
                await post('/suspendidos', { ...body, levantar: lifting });
                setMat('');
                setDebts(await get('/suspendidos'));
                return lifting
                  ? 'Suspensión levantada. Los adeudos vigentes conservan sus restricciones.'
                  : 'Suspensión registrada.';
              });
            }}
          >
            <h2>Gestionar suspensión</h2>
            <label>
              Acción
              <select
                value={lifting ? 'levantar' : 'registrar'}
                onChange={(e) => setLifting(e.target.value === 'levantar')}
              >
                <option value="registrar">Registrar suspensión</option>
                <option value="levantar">Levantar suspensión</option>
              </select>
            </label>
            <label>
              Matrícula
              <input
                name="identificador"
                value={mat}
                onChange={(e) => setMat(e.target.value)}
                maxLength={32}
                required
              />
            </label>
            {!lifting && (
              <label>
                Motivo
                <input name="motivo" maxLength={200} required />
              </label>
            )}
            <button className="action" disabled={op.busy}>
              {lifting ? 'Levantar suspensión' : 'Registrar suspensión'}
            </button>
          </form>
          <form
            onSubmit={(e) => {
              const body = toBody(e);
              void op.run(async () => {
                setCut(await post('/cortes', body));
                return 'Corte guardado.';
              });
            }}
          >
            <h2>Generar lista para exámenes</h2>
            <label>
              Periodo de exámenes
              <input
                name="periodo"
                placeholder="Ej. Finales noviembre 2026"
                maxLength={64}
                required
              />
            </label>
            <button className="action" disabled={op.busy}>
              Generar lista
            </button>
          </form>
        </>
      )}
      {cut && (
        <section className="circ-result">
          <h2>
            Corte: {cut.periodo} · {date(cut.fecha_corte)}
          </h2>
          <p>
            Servicios Escolares:{' '}
            <Acknowledgment receipt={cut.acuse_escolares} mode={cut.modo_envio} />
          </p>
          <div className="circ-actions">
            <button
              className="action"
              type="button"
              onClick={() =>
                downloadCsv('deudores-' + cut.reporte_deudores_id + '.csv', [
                  debtHeader,
                  ...cut.detalle.map(debtorData),
                ])
              }
            >
              Descargar lista CSV
            </button>
            <button
              className="action"
              type="button"
              disabled={op.busy || !cut.detalle.length || cut.modo_envio === 'REAL'}
              onClick={() =>
                void op.run(async () => {
                  const result = await post<Cut>('/cortes/' + cut.reporte_deudores_id + '/aviso');
                  setCut(result);
                  setDebts(await get('/suspendidos'));
                  return result.modo_envio === 'REAL'
                    ? 'Servicios Escolares confirmó el envío.'
                    : 'Se generó un acuse de prueba. Puedes descargar el corte para remitirlo por el canal institucional.';
                })
              }
            >
              Notificar a Servicios Escolares
            </button>
          </div>
          <Table
            headers={debtHeader}
            rows={cut.detalle.map((r) => ({ key: r.identificador, cols: debtorData(r) }))}
          />
        </section>
      )}
      {ready && !cut && <p>No hay cortes guardados.</p>}
      {op.message}
    </section>
  );
}

type Report = {
  existencia: number;
  prestados: number;
  prestamos_periodo: number;
  vencidos: number;
  multas_periodo: number;
  temas: string[];
  estantes: string[];
  por_estado: { estado: string; cantidad: number }[];
  por_tema: { tema: string; cantidad: number }[];
  detalle_vencidos: {
    folio: string;
    titulo: string;
    codigo_ejemplar: string;
    identificador: string;
    fecha_vencimiento: string;
  }[];
  ejemplares: {
    codigo_ejemplar: string;
    titulo: string;
    tema: string;
    estado: string;
    librero?: string;
    fila?: string;
  }[];
};
const estado = (s: string) =>
  ({
    DISPONIBLE: 'Disponible',
    PRESTADO: 'Prestado',
    DADO_DE_BAJA: 'Dado de baja',
    EN_REVISION: 'En revisión',
  })[s] || s;

export function Reports() {
  const op = useOperation();
  const [period, setPeriod] = useState(today().slice(0, 7));
  const [theme, setTheme] = useState('');
  const [shelf, setShelf] = useState('');
  const [applied, setApplied] = useState(period);
  const [report, setReport] = useState<Report | null>(null);
  const [details, setDetails] = useState(false);
  async function load() {
    const params = new URLSearchParams({ periodo: period, tema: theme, estante: shelf });
    setReport(await get('/inventario?' + params));
    setApplied(period);
  }
  useEffect(() => {
    void op.run(load);
  }, []);
  const itemHeader = ['Clave de ejemplar', 'Título', 'Tema', 'Estante', 'Fila', 'Estado'];
  const dueHeader = ['Folio', 'Título', 'Ejemplar', 'Matrícula o nómina', 'Vencimiento'];
  const items =
    report?.ejemplares.map((r) => ({
      key: r.codigo_ejemplar,
      cols: [
        r.codigo_ejemplar,
        r.titulo,
        r.tema,
        r.librero ?? '—',
        r.fila ?? '—',
        estado(r.estado),
      ],
    })) ?? [];
  const due =
    report?.detalle_vencidos.map((r) => ({
      key: r.folio,
      cols: [r.folio, r.titulo, r.codigo_ejemplar, r.identificador, date(r.fecha_vencimiento)],
    })) ?? [];
  return (
    <section className="purchase-dialog circulation management-screen" data-circulation>
      <h1>Reportes e inventario</h1>
      <p>
        La existencia y los vencimientos muestran el estado actual. El mes filtra los préstamos
        registrados y las multas generadas.
      </p>
      <form
        className="management-filters"
        onSubmit={(e) => {
          e.preventDefault();
          void op.run(load);
        }}
      >
        <label>
          Mes
          <input type="month" required value={period} onChange={(e) => setPeriod(e.target.value)} />
        </label>
        <label>
          Tema
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="">Todos</option>
            {report?.temas.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          Estante
          <select value={shelf} onChange={(e) => setShelf(e.target.value)}>
            <option value="">Todos</option>
            {report?.estantes.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <button className="action" disabled={op.busy}>
          Aplicar filtros
        </button>
      </form>
      {report && (
        <>
          <h2>Resumen · {applied}</h2>
          <dl className="management-metrics">
            {[
              ['Existencia total', report.existencia],
              ['Ejemplares prestados', report.prestados],
              ['Préstamos vencidos', report.vencidos],
              ['Préstamos del mes', report.prestamos_periodo],
              ['Multas del mes', report.multas_periodo],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <div className="circ-actions">
            <button
              className="action"
              type="button"
              onClick={() =>
                downloadCsv('inventario-' + applied + '.csv', [
                  itemHeader,
                  ...items.map((r) => r.cols),
                ])
              }
            >
              Exportar inventario CSV
            </button>
            <button
              className="action"
              type="button"
              onClick={() =>
                downloadCsv('prestamos-vencidos-' + applied + '.csv', [
                  dueHeader,
                  ...due.map((r) => r.cols),
                ])
              }
            >
              Exportar préstamos vencidos CSV
            </button>
          </div>
          <div className="management-filters">
            <section>
              <h2>Existencia por tema</h2>
              <Table
                headers={['Tema', 'Ejemplares']}
                rows={report.por_tema.map((r) => ({ key: r.tema, cols: [r.tema, r.cantidad] }))}
              />
            </section>
            <section>
              <h2>Estado del inventario</h2>
              <Table
                headers={['Estado', 'Ejemplares']}
                rows={report.por_estado.map((r) => ({
                  key: r.estado,
                  cols: [estado(r.estado), r.cantidad],
                }))}
              />
            </section>
          </div>
          <h2>Préstamos vencidos</h2>
          <Table headers={dueHeader} rows={due} />
          <button
            className="action"
            type="button"
            aria-expanded={details}
            onClick={() => setDetails(!details)}
          >
            {details ? 'Ocultar detalle de inventario' : 'Ver reporte completo de inventario'}
          </button>
          {details && <Table headers={itemHeader} rows={items} />}
        </>
      )}
      {op.message}
    </section>
  );
}
