/*----
 * Programa: api.ts
 * Objetivo: Implementación del módulo api
 */

import type { Book, Copy, Data } from './model';
import type { Purchase } from './purchases';

export type Session = {
  identificador: string;
  tipoIdentificador: string;
  nombre: string;
  correo: string;
  rol: string;
  perfil: { clave: string; nombre: string };
  permisos: string[];
  debeCambiarContrasena: boolean;
};

// Error de la API con el detalle que manda (campos, cuentas asignadas, área a contactar).
export class ApiError extends Error {
  status: number;
  detail: any;
  constructor(message: string, status: number, detail: any) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

const SIN_API =
  'No hay conexión con la API. Inicia la aplicación con "npm run inicio" y espera a que diga "API SIGB escuchando".';

// Llama a la API y devuelve el JSON; si responde un error lanza su mensaje para mostrarlo.
export async function request<T = any>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method,
    credentials: 'same-origin',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  }).catch(() => {
    throw new Error(SIN_API);
  });
  if (response.status === 204) return undefined as T;
  const json = await response.json().catch(() => null);
  if (!response.ok) {
    const error = json?.error;
    const fields: string[] = error?.detalle?.campos || [];
    // Sin cuerpo JSON la respuesta viene del proxy de Vite: la API no está encendida.
    const message = error?.mensaje || SIN_API;
    throw new ApiError(
      fields.length ? `${message}: ${fields.join(', ')}` : message,
      response.status,
      error?.detalle,
    );
  }
  return json as T;
}

const path = encodeURIComponent;

export const login = (identificador: string, contrasena: string) =>
  request<{ usuario: Session }>('/auth/login', 'POST', { identificador, contrasena });
export const logout = () => request('/auth/logout', 'POST');
export const currentSession = () => request<{ usuario: Session }>('/auth/sesion');
export const changePassword = (contrasenaActual: string, contrasenaNueva: string) =>
  request('/auth/contrasena', 'PUT', { contrasenaActual, contrasenaNueva });

function toBook(detail: any): Book {
  const { libro, ejemplares } = detail;
  const active: Copy[] = ejemplares.filter((e: Copy) => e.estado !== 'Dado de baja');
  const state =
    libro.ejemplares.disponibles > 0
      ? 'Disponible'
      : libro.ejemplares.prestados > 0
        ? 'Prestado'
        : 'No disponible';
  return {
    id: libro.clave,
    title: libro.titulo,
    author: libro.autor,
    publisher: libro.editorial,
    code: libro.clave,
    state,
    use: active[0]?.tipoUso || 'Sin ejemplares',
    copies: active.length,
    location: active.find((e) => e.ubicacion)?.ubicacion || 'Ubicación incompleta',
    isbn: libro.isbn || '',
    description: libro.descripcion || '',
    topic: libro.tema,
    edition: [libro.edicion, libro.anio].filter(Boolean).join(' · ') || 'No registrada',
    price: libro.precioCompraUsd,
    copyList: active,
  };
}

function toPurchase(s: any): Purchase {
  return {
    id: s.folio,
    title: s.titulo,
    requester: s.solicitante,
    cost: s.costoEstimado ?? 0,
    quantity: s.cantidad,
    received: s.recibido,
    state: s.estado,
    createdAt: s.fechaSolicitud,
    sentAt: s.envio.fecha || undefined,
    resolvedAt: s.fechaResolucion || undefined,
    deliveredAt: s.fechaEntregaCatalogo || undefined,
    lines: s.partidas.map((p: any) => ({
      id: String(p.numero),
      title: p.titulo,
      author: p.autor,
      publisher: p.editorial,
      isbn: p.isbn || '',
      quantity: p.cantidadSolicitada,
      received: p.cantidadRecibida,
    })),
    receipts: [],
  };
}

// Trae de la API los datos del Sprint 1 que la cuenta puede consultar según sus permisos.
export async function loadRemoteData(permisos: string[]): Promise<Partial<Data>> {
  const can = (...keys: string[]) => keys.some((k) => permisos.includes(k));
  const remote: Partial<Data> = {};
  if (can('CONSULTAR_LIBROS')) {
    // Catálogo completo, de 100 en 100, con el detalle de los ejemplares de cada ficha
    const claves: string[] = [];
    for (let pagina = 1, totalPaginas = 1; pagina <= totalPaginas; pagina++) {
      const resultado = await request(`/libros?porPagina=100&pagina=${pagina}`);
      totalPaginas = resultado.totalPaginas;
      claves.push(...resultado.libros.map((l: any) => l.clave));
    }
    const details = await Promise.all(claves.map((clave) => request(`/libros/${path(clave)}`)));
    remote.books = details.map(toBook);
    const catalogos = await request('/catalogos');
    remote.catalogs = {
      temas: catalogos.temas,
      tiposUso: catalogos.tiposUso.map((t: any) => t.nombre),
      motivosBaja: catalogos.motivosBaja,
    };
  }
  if (can('CONSULTA_CUENTAS')) {
    const { usuarios } = await request('/usuarios');
    remote.users = usuarios.map((u: any) => ({
      id: u.identificador,
      name: u.nombre,
      email: u.correo,
      role: u.rol,
      active: u.estadoCuenta === 'Activo',
    }));
  }
  if (can('CONSULTAR_PERFILES')) {
    remote.profiles = (await request('/perfiles')).perfiles.map((p: any) => ({
      key: p.clave,
      name: p.nombre,
      role: p.rol,
      permissions: p.permisos,
      activeAccounts: p.cuentasActivas,
      active: p.estado === 'Activo',
    }));
    remote.roles = (await request('/roles')).roles.map((r: any) => ({
      name: r.nombre,
      description: r.descripcion,
      permissions: r.permisosPermitidos.map((p: any) => p.nombre),
      active: r.estado === 'Activo',
    }));
  }
  if (can('GESTIONAR_SOLICITUDES', 'REGISTRAR_RECEPCIONES')) {
    remote.requests = (await request('/solicitudes')).solicitudes.map(toPurchase);
    remote.budget = (await request('/solicitudes/presupuesto')).presupuesto;
  } else if (can('ALTA_LIBROS')) {
    remote.requests = (await request('/solicitudes/entregadas')).solicitudes.map(toPurchase);
  }
  return remote;
}

// Ejemplares de un libro que siguen en circulación, para bajas y clasificación.
export async function activeCopies(bookId: string): Promise<Copy[]> {
  const { ejemplares } = await request(`/libros/${path(bookId)}`);
  return ejemplares.filter((e: Copy) => e.estado !== 'Dado de baja');
}

// Movimientos de los ejemplares de un libro, del más reciente al más antiguo.
export const bookHistory = async (bookId: string) =>
  (await request(`/libros/${path(bookId)}/historial`)).movimientos;

// Detalle de una solicitud con sus recepciones y su historial.
export const purchaseDetail = async (folio: string) =>
  (await request(`/solicitudes/${path(folio)}`)).solicitud;

// Ficha de un libro en PDF o lista para imprimir, generada por la API (HULIS01).
export const bookPdfUrl = (code: string) => `/api/listado-libros/pdf?clave=${path(code)}&vista=1`;
export const bookPrintUrl = (code: string) => `/api/listado-libros/impresion?clave=${path(code)}`;

export const api = {
  createUser: (body: object) => request('/usuarios', 'POST', body),
  updateUser: (id: string, body: object) => request(`/usuarios/${path(id)}`, 'PUT', body),
  assignRole: (id: string, rol: string) => request(`/usuarios/${path(id)}/perfil`, 'PUT', { rol }),
  removeUser: (id: string, motivo: string) =>
    request(`/usuarios/${path(id)}/baja`, 'POST', { motivo }),
  reactivateUser: (id: string) => request(`/usuarios/${path(id)}/reactivar`, 'POST'),
  createBook: (body: object) => request('/libros', 'POST', body),
  updateBook: (id: string, body: object) => request(`/libros/${path(id)}`, 'PUT', body),
  addCopies: (id: string, body: object) => request(`/libros/${path(id)}/ejemplares`, 'POST', body),
  removeBook: (id: string, body: object) => request(`/libros/${path(id)}/baja`, 'POST', body),
  updateCopy: (id: string, body: object) => request(`/ejemplares/${path(id)}`, 'PUT', body),
  removeCopy: (id: string, body: object) => request(`/ejemplares/${path(id)}/baja`, 'POST', body),
  createPurchase: (body: object) => request('/solicitudes', 'POST', body),
  sendPurchase: (id: string) => request(`/solicitudes/${path(id)}/envio`, 'POST'),
  resolvePurchase: (id: string, decision: 'Autorizar' | 'Rechazar') =>
    request(`/solicitudes/${path(id)}/autorizacion`, 'POST', { decision }),
  receivePurchase: (id: string, body: object) =>
    request(`/solicitudes/${path(id)}/recepciones`, 'POST', body),
  deliverPurchase: (id: string) => request(`/solicitudes/${path(id)}/entrega-catalogo`, 'POST'),
  deactivateProfile: (key: string) => request(`/perfiles/${path(key)}/desactivar`, 'POST'),
};
