/*----
 * Programa: DesignText.tsx
 * Objetivo: Implementación del módulo DesignText
 */

import type { HTMLAttributes } from 'react';
import { useDesign } from '../context/DesignContext';
import { dateText, money } from '../model';
import { catalogBooks, filteredRequests, pageCount, pagedList, showing } from '../listas';

// Nombres de ejemplo del diseño de Figma que se sustituyen por la cuenta en sesión.
const DESIGN_NAMES = ['Mariana López', 'Alfonso Chapa', 'Luisa Palacios', 'Ernesto Díaz'];
const DESIGN_ROLES = ['Alumno', 'Admin', 'Comprador de libros'];
const MOVEMENTS: Record<string, string> = {
  ALTA: 'Alta',
  BAJA: 'Baja',
  CAMBIO_CLASIFICACION: 'Cambio de clasificación',
  CAMBIO_UBICACION: 'Cambio de ubicación',
  CAMBIO_USO: 'Cambio de tipo de uso',
  ETIQUETA: 'Etiqueta',
};

export function DesignText({ children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  const s = useDesign();
  const old = typeof children === 'string' ? children.trim() : children;
  let text = old;
  const id = String(props['data-node-id'] || '');
  const view = s.overlay || s.route;
  if (typeof old === 'string') {
    let value = old;
    const b = s.book;
    const copy = b.copyList?.find((c) => c.clave === s.selected) || b.copyList?.[0];
    const byId: Record<string, string | undefined> = {};

    // Encabezados del diseño con la cuenta en sesión
    if (id.includes(';') && DESIGN_NAMES.includes(value)) value = s.userName || '';
    if (
      id.includes(';') &&
      DESIGN_ROLES.includes(value) &&
      /62:591|247:3347|207:710|62:651/.test(id)
    )
      value = s.role;
    if (/^[A-Z]{2}$/.test(value) && /62:586|247:3342/.test(id))
      value = (s.userName || '')
        .split(' ')
        .slice(0, 2)
        .map((p) => p[0])
        .join('');

    // Inicio de sesión
    byId['27:791'] =
      'Ingresa tu matrícula o número de nómina y tu contraseña. El rol se toma del perfil de tu cuenta.';

    // Mi perfil: nombre, cuenta y vigencia que la API revisa en cada operación
    if (view === '312-1701') {
      const staff = s.session?.tipoIdentificador !== 'MATRICULA';
      byId['312:1703'] = `${s.userName || ''} · ${s.role}`;
      byId['348:1846'] = staff ? 'Vigencia en Capital Humano' : 'Estatus escolar en CIAA';
      byId['348:1847'] = `Vigente · ${s.session?.identificador || ''} · ${s.session?.correo || ''}`;
    }

    // Cuenta que se va a dar de baja
    if (view === '241-3795') {
      const u = s.data.users.find((u) => u.id === s.selected);
      if (u) byId['241:3801'] = `${u.name} · ${u.id}`;
    }

    // Presupuesto del mes en la pantalla de Compras
    const budget = s.data.budget;
    if (s.route === '207-1669' && budget) {
      const available = budget.informado
        ? Math.round(((budget.disponible ?? 0) / (budget.montoAutorizado || 1)) * 100)
        : 0;
      byId['207:1705'] = budget.informado
        ? `Presupuesto mensual · ${budget.periodo}`
        : 'Presupuesto mensual · Presupuesto no informado';
      byId['207:1707'] = budget.informado ? `${money(budget.disponible ?? 0)} MXN` : '—';
      byId['207:1709'] = budget.informado
        ? `de ${money(budget.montoAutorizado ?? 0)} disponibles`
        : '';
      byId['207:1713'] = budget.informado ? `${available}% disponible` : '';
    }

    // Ficha del libro seleccionado
    if (s.route === '6-26') {
      Object.assign(byId, {
        '6:88': b.title,
        '6:117': b.author,
        '6:125': b.publisher,
        '6:133': b.edition,
        '6:141': b.code,
        '6:149': b.isbn || 'No registrado',
        '6:157': b.topic || 'No registrado',
        '6:165': b.description || 'Sin descripción registrada.',
        '2136:2275': String(b.copies),
        'I143:1319;137:4655': b.state,
        'I143:1322;137:4655': b.use,
      });
    }
    // Ejemplares, etiquetas y bajas usan el ejemplar elegido en la tabla
    Object.assign(byId, {
      '247:3510': b.title,
      '2114:2307': String(b.copies),
      '211:1137': b.title,
      '211:1138': b.author,
      '211:1139': copy?.clasificacion || b.code,
      '211:1140': copy?.tipoUso,
      '211:1141': copy
        ? `Ejemplar: ${copy.clave} · Biblioteca Universidad Ducky`
        : 'Sin ejemplares',
      '247:3647': b.title,
      '247:3648': b.author,
      '247:3649': copy?.clasificacion || 'Sin clasificar',
      '247:3650': copy?.tipoUso,
      '247:3651': copy?.clave,
      '247:3655': copy?.ubicacion || 'Ubicación incompleta',
      '247:3678': copy?.clave,
      '2114:2310': b.title,
      '211:1150': `Dar de baja · ${b.title}`,
      '211:1185':
        'Se conserva el historial. Un ejemplar sale de circulación; el libro completo da de baja la ficha y todos sus ejemplares.',
    });
    if (view === '247-3679')
      byId['247:3681'] =
        (s.extra.movimientos || [])
          .map(
            (m: any) =>
              `${dateText(m.fecha)} · ${MOVEMENTS[m.tipo] || m.tipo} · ${m.claveEjemplar} · ${m.operador}` +
              (m.motivo ? ` · ${m.motivo}` : ''),
          )
          .join('\n') || 'Aún no hay movimientos registrados.';

    // PDF e impresión de la ficha (los genera la API)
    Object.assign(byId, {
      '2196:2030': b.title,
      '2196:2042': `Clave ${b.code}`,
      '2196:2043': 'Ficha generada por el sistema con los datos del catálogo.',
      '2196:2049': b.title,
      '2196:2050': b.author,
      '2196:2054': 'La que elijas en el cuadro de impresión',
      '2196:2061': 'Ficha del libro',
      '2196:2064': s.fields.Copias || '1',
      '2196:2075':
        'Se abrirá el cuadro de impresión del navegador con la ficha generada por el sistema.',
      '2196:2079': b.title,
      '2196:2082': s.fields.Copias || '1',
      '2196:2083': 'Confirma la impresión en el cuadro de diálogo del navegador.',
    });

    // Perfiles
    byId['2148:2158'] =
      `Consulta los ${s.data.roles?.length ?? 0} roles del sistema y las acciones autorizadas para cada uno.`;
    if (s.extra.perfil) {
      byId['373:1904'] = `Desactivar perfil ${s.extra.perfil.name}`;
      byId['373:1913'] = `Perfil ${s.extra.perfil.name} no desactivado`;
    }

    // Entrega al catálogo con la recepción registrada
    const r = s.data.requests.find((r) => r.id === s.selected);
    if (view === '2081-2189' && r) {
      const receipts: any[] = s.extra.recepciones || [];
      Object.assign(byId, {
        '2081:2191': r.id,
        '2176:2060': r.title,
        '2081:2193': receipts.map((x) => x.folio).join(', ') || 'Sin recepciones',
        '2081:2195': `${r.received} / ${r.quantity}`,
        '2081:2197': dateText(receipts.at(-1)?.fecha) || '—',
      });
    }

    // Contadores de las tablas
    const list = pagedList(s);
    if (list) {
      if (/^Mostrando \d+–\d+ de \d+$/.test(value)) value = showing(s.page, list.length);
      if (/^Página \d+ de \d+$/.test(value))
        value = `Página ${s.page} de ${pageCount(list.length)}`;
      if (/^Página \d+ · \d+ libros$/.test(value))
        value = `Página ${s.page} de ${pageCount(list.length)} · ${list.length} libros`;
    }
    if (/^\d+ resultados$/.test(value) && ['1-336', '272-2449'].includes(s.route))
      value = `${catalogBooks(s).length} resultados`;
    if (['207-1669', '2081-3418'].includes(s.route) && /^Mostrando \d+–\d+ de \d+$/.test(value)) {
      const total = filteredRequests(s).length;
      value = showing(1, total, total || 1);
    }
    if (value === '3 usuarios registrados') value = `${s.data.users.length} usuarios registrados`;
    if (value === 'Relevancia') value = s.sort;
    if (value === 'Ordenados por relevancia') value = `Ordenados por ${s.sort.toLowerCase()}`;

    if (byId[id] !== undefined) value = byId[id];
    text = value;
  }
  return (
    <p {...props} data-original-text={typeof old === 'string' ? old : undefined}>
      {text}
    </p>
  );
}
