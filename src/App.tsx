import React, { useState, useEffect, useRef, Suspense } from 'react';
import manifest from './manifest.json';
import { DesignContext, type DesignState, Action } from './design-controls';
import { emptyData, EMPTY_BOOK, type Data, roles } from './model';

import { SessionNavigation } from './components/SessionNavigation';
import { screens, defaultRoutes, normalizeText, routeForRole } from './navigation';
import { pageCount, pagedList } from './listas';

import { PurchaseDialog } from './components/PurchaseDialog';
import { validateLines, findPurchase } from './purchases';
import {
  api,
  activeCopies,
  ApiError,
  bookHistory,
  bookPrintUrl,
  changePassword,
  currentSession,
  loadRemoteData,
  login,
  logout,
  purchaseDetail,
  type Session,
} from './api';

// Pantallas y ventanas de sprints posteriores: se muestran sin datos hasta que tengan su API.
const LATER_SPRINTS: Record<string, [string, string]> = {
  '7-439': ['Mi cuenta: préstamos y adeudos', 'Sprint 2'],
  '7-1177': ['Registrar préstamo', 'Sprint 2'],
  '162-2206': ['Registrar préstamo', 'Sprint 2'],
  '174-3080': ['Registrar préstamo', 'Sprint 2'],
  '182-571': ['Comprobante de préstamo', 'Sprint 2'],
  '182-908': ['Devolución', 'Sprint 2'],
  '207-712': ['Renovación', 'Sprint 2'],
  '207-849': ['Multas y pagos', 'Sprint 3'],
  '207-1046': ['Alumnos suspendidos', 'Sprint 3'],
  '211-962': ['Registrar pago', 'Sprint 3'],
  '211-1005': ['Reportar libro perdido', 'Sprint 3'],
  '211-1194': ['Lista de suspendidos', 'Sprint 3'],
  '207-1430': ['Reportes e inventario', 'Sprint 5'],
};
// La API separa la ubicación en estante y fila: "LIT · A1", "LIT-A1" o "LIT/A1"
const LOCATION_FORMAT = /^(estante\s+)?[^\s·/-]+\s*[·/-]\s*\S+$/i;
const LOCATION_HINT = 'Escribe la ubicación como estante y fila, por ejemplo LIT · A1 o LIT-A1.';

// Opción de la baja desde Gestión de catálogo: un ejemplar o la ficha con todos sus ejemplares
const REMOVAL_CHOICE = 'Qué dar de baja';
const WHOLE_BOOK = 'LIBRO_COMPLETO';
function LaterSprint({ id }: { id: string }) {
  const [title, sprint] = LATER_SPRINTS[id];
  return (
    <section className="purchase-dialog later-sprint" aria-label={title}>
      <h2>{title}</h2>
      <p>
        Esta función se entrega en el {sprint}. Aún no está conectada a la base de datos, por eso no
        se muestran datos.
      </p>
    </section>
  );
}

export default function App() {
  // Datos persistidos y sesión.
  const [data, setData] = useState<Data>(emptyData);
  const [role, setRole] = useState(() => sessionStorage.getItem('ducky-role') || 'Alumno');
  const [route, setRoute] = useState(() => {
    const r = location.hash.slice(1);
    return manifest.some((n) => n.module === r && !n.overlay)
      ? routeForRole(r, sessionStorage.getItem('ducky-role') || 'Alumno')
      : '27-759';
  });

  // Selección actual y valores de los formularios.
  const [overlay, setOverlay] = useState('');
  const [selected, setSelected] = useState('');
  // El libro abierto se recuerda al recargar la página del detalle
  const [bookId, setBookId] = useState(() => sessionStorage.getItem('ducky-book') || '');
  const [userId, setUserId] = useState('');
  const [extra, setExtra] = useState<Record<string, any>>({});
  const [fields, setFields] = useState<Record<string, string>>({});
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('Relevancia');
  const [page, setPage] = useState(1);
  // Estado de la interfaz y referencias para foco y avisos.
  const [menu, setMenu] = useState<string[]>([]);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuAnchor = useRef<HTMLElement | null>(null);
  const menuElement = useRef<HTMLDivElement | null>(null);
  const [toast, setToast] = useState('');
  const [chat, setChat] = useState<{ who: string; text: string }[]>([]);
  const [revision, setRevision] = useState(0);
  const [session, setSession] = useState<Session | null>(null);
  const [password, setPassword] = useState({ actual: '', nueva: '', confirmacion: '' });
  const root = useRef<HTMLDivElement>(null);
  const modal = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement>(null);
  const pressedOutside = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(null);
  const book = data.books.find((b) => b.id === bookId) || data.books[0] || EMPTY_BOOK;
  useEffect(() => {
    if (bookId) sessionStorage.setItem('ducky-book', bookId);
  }, [bookId]);
  useEffect(() => {
    const onHash = () => {
      const r = location.hash.slice(1);
      if (manifest.some((n) => n.module === r && !n.overlay)) {
        const next = routeForRole(r, sessionStorage.getItem('ducky-role') || 'Alumno');
        setRoute(next);
        if (next !== r) location.hash = next;
        setOverlay('');
        setFields({});
        setQuery('');
        setFilter('');
        setPage(1);
      }
    };
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  useEffect(() => {
    currentSession()
      .then(({ usuario }) => {
        startSession(usuario);
        // Con la sesión abierta, el inicio de sesión lleva a la pantalla principal del rol
        if (['', '27-759'].includes(location.hash.slice(1))) go(defaultRoutes[usuario.rol]);
      })
      .catch(() => {
        sessionStorage.removeItem('ducky-role');
        if (location.hash.slice(1) !== '27-759') go('27-759');
      });
  }, []);

  // Operaciones compartidas por las acciones de las pantallas.
  function notify(text: string) {
    setToast(text);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 5000);
  }
  // Datos del Sprint 1 desde la API; préstamos y multas siguen con la demostración local.
  async function refresh(permisos = session?.permisos || []) {
    try {
      const remote = await loadRemoteData(permisos);
      setData((prev) => ({ ...prev, ...remote }));
    } catch (error) {
      notify((error as Error).message);
    }
  }
  // Ejecuta una operación de la API, muestra su mensaje, cierra o cambia de ventana y vuelve a
  // cargar los datos. Si falla también recarga, por si la BD alcanzó a guardar una parte.
  async function remote(operation: () => Promise<any>, after?: () => void) {
    try {
      const result = await operation();
      notify(result?.mensaje || 'Operación registrada');
      after?.();
    } catch (error) {
      notify((error as Error).message);
    }
    await refresh();
  }
  function startSession(usuario: Session) {
    setSession(usuario);
    setRole(usuario.rol);
    setUserId(usuario.identificador);
    sessionStorage.setItem('ducky-role', usuario.rol);
    void refresh(usuario.permisos);
  }
  function go(id: string) {
    id = routeForRole(id, sessionStorage.getItem('ducky-role') || role);
    setRoute(id);
    location.hash = id;
    setOverlay('');
    setFields({});
    setQuery('');
    setFilter('');
    setPage(1);
    setMenu([]);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function open(id: string, record?: string, details: Record<string, any> = {}) {
    lastFocus.current = document.activeElement as HTMLElement;
    if (record) setSelected(record);
    setOverlay(id);
    setFields({});
    setQuery('');
    setPage(1);
    setMenu([]);
    setExtra(details);
    setRevision((v) => v + 1);
  }
  // Abre una ventana con datos que pide a la API en ese momento.
  function openWith(id: string, record: string | undefined, load: () => Promise<object>) {
    open(id, record);
    load()
      .then((details) => setExtra(details))
      .catch((error) => notify(error.message));
  }
  function close() {
    setOverlay('');
    setFields({});
    setMenu([]);
    setTimeout(() => lastFocus.current?.focus(), 0);
  }
  const field = (label: string, value: string) => {
    const isSearch =
      !overlay &&
      /buscar|^matrícula o nombre$|^título, ISBN o clave$|^folio, matrícula o clave del ejemplar$/i.test(
        label,
      );
    setFields((f) => ({ ...f, [label]: value, ...(isSearch ? { __searched: '1' } : {}) }));
    if (isSearch) {
      setQuery(value);
      setPage(1);
    }
    if (['207-1669', '2081-3418'].includes(route) && !overlay) {
      if (label === 'Estado') setFilter(value);
    }
  };
  function input(...names: string[]) {
    for (const name of names) {
      if (fields[name] !== undefined) return fields[name];
      const scope = overlay ? modal.current : root.current;
      const element = scope?.querySelector<HTMLInputElement | HTMLSelectElement>(
        '[aria-label="' + CSS.escape(name) + '"]',
      );
      if (element?.value !== undefined) return element.value;
    }
    return '';
  }
  function filterResults() {
    const label = Object.keys(fields).find(
      (k) => /buscar|matrícula o nombre|folio|título|clave|nombre/i.test(k) && !k.startsWith('__'),
    );
    setQuery(label ? fields[label] : '');
    setFilter(input('Estado', 'Tipo de uso', 'Rol', 'Tema', 'Programa'));
    setPage(1);
    setFields((f) => ({ ...f, __searched: '1' }));
    notify('Búsqueda actualizada');
  }
  function action(label: string, record?: string) {
    const actionName = normalizeText(label);
    if (record) {
      setSelected(record);
      if (data.books.some((b) => b.id === record)) setBookId(record);
    }
    const current = record || selected;
    const userRoles = roles.slice(0, 3);
    const isStaff = ['Bibliotecario', 'Administrador'].includes(role);
    const selectedCopy = book.copyList?.find((c) => c.clave === current);

    // Sesión y navegación por rol.
    if (actionName === 'cerrar sesion' || actionName === 'volver al inicio de sesion') {
      void logout().catch(() => undefined);
      setSession(null);
      // Los datos de la cuenta anterior no deben quedar a la vista de la siguiente
      setData(emptyData());
      sessionStorage.removeItem('ducky-role');
      go('27-759');
      return;
    }
    if (actionName === 'ingresar') {
      const user = input('Usuario');
      const password = input('Contraseña');
      if (!user || !password) {
        notify('Escribe tu usuario y contraseña.');
        return;
      }
      // El rol sale del perfil de la cuenta, no de la lista del formulario
      void login(user, password)
        .then(({ usuario }) => {
          startSession(usuario);
          go(defaultRoutes[usuario.rol]);
        })
        .catch((error) => {
          // Cuenta, perfil o vigencia no habilitados: se indica a qué área acudir
          if (error instanceof ApiError && error.status === 403)
            open('342-1840', undefined, { mensaje: error.message, area: error.detail?.area });
          else notify(error.message);
        });
      return;
    }
    if (actionName.includes('olvidaste')) {
      open('211-1295');
      return;
    }
    if (actionName === 'continuar' && overlay === '211-1295') {
      if (!Object.values(fields).some(Boolean)) {
        notify('Escribe tu usuario institucional.');
        return;
      }
      close();
      notify(
        'El sistema aún no restablece contraseñas en línea: pide al Administrador de la biblioteca una contraseña temporal.',
      );
      return;
    }
    if (['cerrar', 'cancelar', 'entendido', 'volver'].includes(actionName)) {
      close();
      return;
    }
    if (actionName === 'ver en catalogo') {
      go('6-26');
      return;
    }
    if (
      actionName === 'catalogo' ||
      actionName === 'buscar libros' ||
      actionName === 'volver al catalogo'
    ) {
      go(role === 'Bibliotecario' ? '272-2449' : '1-336');
      return;
    }
    if (actionName === 'mi cuenta') {
      go('7-439');
      return;
    }
    if (actionName === 'prestamos') {
      if (isStaff) go('7-1177');
      else go('7-439');
      return;
    }
    const routes = {
      devolucion: '182-908',
      renovacion: '207-712',
      renovaciones: '207-712',
      'multas y pagos': '207-849',
      suspendidos: '207-1046',
      'gestion de libros': role === 'Administrador' ? '247-2861' : '247-3086',
      reportes: '207-1430',
      usuarios: '241-3397',
      'gestion de usuarios': '241-3397',
      'gestion de catalogo': '207-1228',
      'catalogo administrativo': '207-1228',
      perfiles: '371-1836',
      'gestion de perfiles': '371-1836',
      'solicitudes de libros': '2081-3418',
      compras: '207-1669',
      'compras y adquisiciones': '207-1669',
    };
    if (routes[actionName]) {
      if (userRoles.includes(role) && !['renovaciones'].includes(actionName)) {
        notify('Esta opción corresponde a un rol de gestión.');
        return;
      }
      go(routes[actionName]);
      return;
    }
    if (actionName.startsWith('libros')) {
      setMenu(['Catálogo', 'Gestión de catálogo', 'Gestión de libros']);
      return;
    }
    if (actionName.startsWith('administracion')) {
      setMenu(['Usuarios', 'Perfiles', 'Solicitudes de libros']);
      return;
    }
    if (actionName.startsWith('operaciones')) {
      setMenu(['Préstamos', 'Devolución', 'Renovación', 'Multas y pagos', 'Suspendidos']);
      return;
    }
    if (
      actionName === 'mi perfil' ||
      /^(mariana lopez|alfonso chapa|ernesto diaz|luisa palacios)$/.test(actionName)
    ) {
      open('312-1701');
      return;
    }
    if (actionName === 'mi rol') {
      notify('Para cambiar de rol, cierra sesión e ingresa con el rol deseado.');
      return;
    }
    if (actionName === 'roles') {
      open('283-1681', current);
      return;
    }
    if (roles.some((r) => normalizeText(r) === actionName)) {
      const chosen = roles.find((r) => normalizeText(r) === actionName)!;
      if (overlay === '283-1681') {
        void remote(() => api.assignRole(current, chosen), close);
      } else {
        notify('Para cambiar de rol, cierra sesión e ingresa con el rol deseado.');
      }
      return;
    }

    // Consulta de libros, impresión y filtros.
    if (actionName === 'ver detalle') {
      setBookId(current);
      go('6-26');
      return;
    }
    if (actionName === 'ver pdf' || actionName.includes('visualizar pdf')) {
      open('2196-2026');
      return;
    }
    if (actionName === 'mandar a imprimir' || actionName === 'imprimir libro') {
      open('2196-2044');
      return;
    }
    if (['1', '2', '3'].includes(actionName) && overlay === '2196-2044') {
      field('Copias', actionName);
      notify(`${actionName} copia(s) seleccionadas`);
      return;
    }
    if (actionName === 'imprimir') {
      // La API arma la ficha para imprimir y abre el cuadro de impresión del navegador
      document.querySelector('iframe.print-frame')?.remove();
      const frame = document.createElement('iframe');
      frame.className = 'print-frame';
      frame.title = 'Impresión de la ficha';
      frame.src = bookPrintUrl(book.code);
      document.body.append(frame);
      open('2196-2076', undefined, {});
      setFields((f) => ({ ...f, Copias: fields.Copias || '1' }));
      return;
    }
    if (actionName.includes('imprimir recibo') || actionName.includes('imprimir etiqueta')) {
      window.print();
      return;
    }
    if (
      actionName === 'buscar' ||
      actionName === 'filtrar' ||
      actionName === 'aplicar filtros' ||
      actionName === 'buscar usuario' ||
      actionName === 'buscar libro' ||
      actionName === 'buscar prestamo'
    ) {
      filterResults();
      return;
    }
    if (actionName === 'limpiar filtros') {
      setFields({});
      setQuery('');
      setFilter('');
      setPage(1);
      setRevision((v) => v + 1);
      return;
    }
    if (actionName === 'relevancia' || actionName === 'ordenar') {
      setMenu(['Relevancia original', 'Título A–Z', 'Autor A–Z', 'Título Z–A']);
      return;
    }
    if (['relevancia original', 'titulo a–z', 'autor a–z', 'titulo z–a'].includes(actionName)) {
      setSort(label === 'Relevancia original' ? 'Relevancia' : label);
      setMenu([]);
      return;
    }
    if (actionName === 'siguiente' || actionName === 'anterior') {
      const max = pageCount(pagedList(ctx)?.length ?? 0);
      setPage((p) => Math.max(1, Math.min(max, p + (actionName === 'siguiente' ? 1 : -1))));
      return;
    }

    // Administración de usuarios.
    if (actionName.includes('alta de usuario')) {
      open('241-3699', 'new');
      return;
    }
    if (actionName === 'editar') {
      open(route === '241-3397' ? '241-3699' : '211-1034', current);
      return;
    }
    if (actionName.includes('agregar libro') || actionName === 'alta de ficha bibliografica') {
      open('211-1034', 'new');
      return;
    }
    if (actionName === 'guardar usuario') {
      const old = data.users.find((u) => u.id === current);
      const name = input('Nombre completo').trim().replace(/\s+/g, ' ');
      const id = current === 'new' ? input('ID o matrícula').trim().toUpperCase() : current;
      const email = input('Correo institucional').trim();
      if (!id || !email) {
        notify('Completa matrícula o nómina y correo institucional.');
        return;
      }
      if (current === 'new' && data.users.some((u) => u.id === id)) {
        notify('Ya existe un usuario con esa matrícula.');
        return;
      }
      const chosenRole = input('Rol asignado').trim() || old?.role || 'Alumno';
      // Solo se mandan los datos que cambiaron
      const changes = {
        ...(name && name !== old?.name ? { nombre: name } : {}),
        ...(email !== old?.email ? { correo: email } : {}),
        ...(chosenRole !== old?.role ? { rol: chosenRole } : {}),
      };
      void remote(async () => {
        if (current !== 'new') return api.updateUser(current, changes);
        // Si la persona ya está en CIAA o Capital Humano, el alta toma ese nombre; si se escribió
        // otro, se corrige después
        const created: any = await api.createUser({
          identificador: id,
          nombre: name,
          correo: email,
          rol: chosenRole,
        });
        if (name && name !== created.usuario?.nombre) await api.updateUser(id, { nombre: name });
        return created;
      }, close);
      return;
    }
    if (actionName === 'reactivar') {
      void remote(() => api.reactivateUser(current));
      return;
    }
    if (actionName === 'baja') {
      open(
        route === '241-3397' ? '241-3795' : overlay === '247-3458' ? '247-3658' : '211-1149',
        current,
      );
      return;
    }
    if (actionName === 'dar de baja libro completo') {
      open('2114-2308');
      return;
    }
    if (actionName === 'confirmar baja') {
      if (overlay === '241-3795') {
        const reason = input('Motivo de baja') || 'Baja tramitada desde Gestión de usuarios';
        void remote(() => api.removeUser(current, reason), close);
        return;
      }
      const baja = {
        motivo: input('Motivo de baja') || 'Perdido',
        observaciones: input('Observaciones'),
      };
      void remote(async () => {
        if (overlay === '2114-2308') return api.removeBook(bookId, baja);
        // Desde Gestión de catálogo se elige un ejemplar disponible o el libro completo
        if (overlay === '211-1149') {
          const choice = input(REMOVAL_CHOICE);
          return choice === WHOLE_BOOK
            ? api.removeBook(bookId, baja)
            : api.removeCopy(choice, baja);
        }
        if (overlay === '247-3658' && selectedCopy) return api.removeCopy(selectedCopy.clave, baja);
        const copy = (await activeCopies(bookId)).find((c) => c.estado === 'Disponible');
        if (!copy) throw new Error('No hay ejemplares disponibles para dar de baja.');
        return api.removeCopy(copy.clave, baja);
      }, close);
      return;
    }

    // Registro y clasificación de libros.
    // Edición de la ficha; ubicación, tipo de uso y ejemplares nuevos se aplican a sus ejemplares
    async function saveBookChanges(record: object) {
      const result: any = await api.updateBook(bookId, record);
      const location = input('Ubicación').trim();
      const use = input('Tipo de uso').trim();
      const copyChanges = {
        ...(location && location !== book.location ? { ubicacion: location } : {}),
        ...(use && use !== book.use ? { tipoUso: use } : {}),
      };
      const copies = book.copyList || [];
      const updatesCopies = Object.keys(copyChanges).length > 0 && copies.length > 0;
      if (updatesCopies) for (const copy of copies) await api.updateCopy(copy.clave, copyChanges);
      const added = Number(input('Ejemplares que se reciben') || 0);
      if (added > 0)
        await api.addCopies(bookId, {
          cantidad: added,
          ubicacion: location || copies[0]?.ubicacion || '',
          tipoUso: use || copies[0]?.tipoUso || 'Préstamo externo',
        });
      const copiesChanged = updatesCopies || added > 0;
      return copiesChanged ? { mensaje: 'Libro y ejemplares actualizados' } : result;
    }
    if (actionName === 'guardar borrador' || actionName === 'guardar y generar etiqueta') {
      const isNew = current === 'new';
      // En la edición, un campo vacío conserva el dato guardado; en una ficha nueva no hay respaldo
      const value = (label: string, saved = '') => input(label).trim() || (isNew ? '' : saved);
      const title = value('Título', book.title);
      const author = value('Autor', book.author);
      const code = value('Clave', book.code);
      const publisher = value('Editorial', book.publisher);
      const topic = value('Tema', book.topic);
      const location = input('Ubicación').trim();
      const missing = [
        ['Título', title],
        ['Autor', author],
        ['Editorial', publisher],
        ['Tema', topic],
        ['Clave', code],
        ...(isNew ? [['Ubicación', location]] : []),
      ]
        .filter(([, v]) => !v)
        .map(([label]) => label);
      if (missing.length) {
        notify(`Completa los campos obligatorios: ${missing.join(', ')}.`);
        return;
      }
      if (location && !LOCATION_FORMAT.test(location)) {
        notify(LOCATION_HINT);
        return;
      }
      const added = Number(input('Ejemplares que se reciben') || 0);
      if (!isNew && added > 0 && !location && !book.copyList?.some((c) => c.ubicacion)) {
        notify('Escribe la Ubicación de los ejemplares nuevos.');
        return;
      }
      const nextId = isNew ? code.toUpperCase() : bookId;
      const record = {
        titulo: title,
        autor: author,
        editorial: publisher,
        isbn: input('ISBN'),
        descripcion: input('Descripción del libro'),
        tema: topic,
        precioCompra: input('Precio de compra (USD)'),
      };
      void remote(
        () =>
          isNew
            ? api.createBook({
                ...record,
                clave: code,
                ubicacion: location,
                cantidad: added || 1,
                tipoUso: input('Tipo de uso'),
              })
            : saveBookChanges(record),
        () => {
          setBookId(nextId);
          close();
          // La etiqueta se abre con los ejemplares recién creados ya cargados
          if (actionName === 'guardar y generar etiqueta')
            void refresh().then(() => open('211-1135'));
        },
      );
      return;
    }
    if (actionName === 'etiqueta') {
      open(overlay === '247-3458' ? '247-3645' : '211-1135');
      return;
    }
    if (actionName === 'ejemplares') {
      open('247-3458', current);
      return;
    }
    if (actionName === 'clasificar') {
      open('247-3593', current);
      return;
    }
    if (actionName === 'guardar clasificacion') {
      const use = input('Tipo de uso');
      const location = input('Ubicación / estante').trim();
      const topic = input('Tema');
      if (location && !LOCATION_FORMAT.test(location)) {
        notify(LOCATION_HINT);
        return;
      }
      const changes = {
        ...(input('Clave') ? { clasificacion: input('Clave') } : {}),
        ...(location ? { ubicacion: location } : {}),
        ...(use ? { tipoUso: use } : {}),
      };
      // Se clasifica el ejemplar elegido en la tabla; si no se eligió, el primero activo
      const copy = selectedCopy || book.copyList?.[0];
      if (!copy) {
        notify('El libro no tiene ejemplares activos para clasificar.');
        return;
      }
      void remote(
        async () => {
          // El tema es de la ficha: se guarda en el libro, no en el ejemplar
          if (topic && topic !== book.topic) await api.updateBook(bookId, { tema: topic });
          return api.updateCopy(copy.clave, changes);
        },
        () => open('247-3458', copy.clave),
      );
      return;
    }
    if (actionName === 'historial') {
      openWith('247-3679', current, async () => ({ movimientos: await bookHistory(bookId) }));
      return;
    }

    // Solicitudes y recepción de adquisiciones.
    if (actionName.includes('nueva peticion') || actionName.includes('solicitar libro')) {
      open('211-1204', 'new');
      return;
    }
    if (actionName === 'registrar peticion') {
      notify('Prepara las partidas y usa Enviar a Tesorería.');
      return;
    }
    if (actionName === 'consultar solicitud') {
      const folio = input('Folio de solicitud').trim();
      const request = findPurchase(data.requests, folio);
      if (!request) {
        notify('No se encontró una solicitud con ese folio.');
        return;
      }
      open('2081-2172', request.id);
      return;
    }
    if (actionName === 'revisar') {
      open('2081-2172', current);
      return;
    }
    if (actionName === 'consultar autorizacion') {
      void remote(() => api.resolvePurchase(current, 'Autorizar'));
      return;
    }
    if (actionName === 'confirmar revision') {
      const request = data.requests.find((r) => r.id === current);
      if (
        role !== 'Comprador de libros' ||
        sessionStorage.getItem('ducky-role') !== role ||
        !request ||
        request.state !== 'Por autorizar'
      ) {
        notify('Solo se pueden enviar solicitudes pendientes con una sesión de comprador.');
        return;
      }
      try {
        validateLines(request.lines || []);
      } catch (error) {
        notify((error as Error).message);
        return;
      }
      void remote(() => api.sendPurchase(current));
      return;
    }
    if (actionName === 'registrar recepcion') {
      if (overlay !== '211-1260') {
        open('211-1260', current);
        return;
      }
      return;
    }
    if (actionName === 'confirmar entrega a catalogo') {
      const r = data.requests.find((r) => r.id === current);
      if (role !== 'Comprador de libros' || !r || r.state !== 'Recibido') {
        notify('Registra la recepción del lote antes de entregarlo.');
        return;
      }
      void remote(() => api.deliverPurchase(current), close);
      return;
    }
    if (actionName === 'enviados al catalogo' || actionName === 'recibidos de compras') {
      open('2189-2119');
      return;
    }
    if (actionName === 'ver historial') {
      open('2081-2208', current);
      return;
    }
    if (actionName === 'historial de adquisiciones') {
      // Lista completa: no debe quedar elegida la última solicitud consultada
      setSelected('');
      open('2081-2208');
      return;
    }
    if (actionName === 'actualizar lista de solicitudes') {
      void refresh().then(() => notify('Lista actualizada'));
      setRevision((v) => v + 1);
      return;
    }
    if (actionName === 'autorizar' || actionName === 'rechazar') {
      const decision = actionName === 'autorizar' ? 'Autorizar' : 'Rechazar';
      void remote(() => api.resolvePurchase(current, decision), close);
      return;
    }
    if (actionName === 'confirmar desactivacion') {
      const profile = extra.perfil;
      api
        .deactivateProfile(profile.key)
        .then((result: any) => {
          notify(result?.mensaje || 'Perfil desactivado');
          close();
          return refresh();
        })
        .catch((error) => {
          if (error instanceof ApiError && error.detail?.cuentas)
            open('373-1912', undefined, { perfil: profile, cuentas: error.detail.cuentas });
          else notify(error.message);
        });
      return;
    }

    // Asistente local de demostración.
    if (actionName === 'enviar') {
      const q = input('Escribe tu pregunta') || Object.values(fields)[0];
      if (!q?.trim()) return;
      const t = normalizeText(q);
      const reply = t.includes('renov')
        ? 'Puedes solicitar hasta 2 renovaciones desde Mi cuenta. El bibliotecario valida la cuenta y el préstamo.'
        : t.includes('multa')
          ? 'Consulta tus adeudos en Mi cuenta. Los comprobantes se pagan en Tesorería y el bibliotecario registra el pago.'
          : t.includes('libro')
            ? 'Busca un título, autor o clave en el catálogo. Ver detalle muestra la ficha y disponibilidad.'
            : 'Puedo orientarte sobre catálogo, préstamos, renovaciones, multas y tu perfil. Este asistente usa respuestas locales de demostración.';
      setChat((c) => [...c, { who: 'Tú', text: q }, { who: 'Ducky', text: reply }]);
      setFields({});
      return;
    }
    if (actionName === 'reiniciar') {
      setChat([]);
      setRevision((v) => v + 1);
      return;
    }
    if (actionName.includes('dias habiles')) {
      notify('Alumno y colaborador: 5 días hábiles. Maestro: 10. Máximo 2 renovaciones.');
      return;
    }
    notify('Selecciona una opción del menú para continuar.');
  }
  useEffect(() => {
    if (!menu.length) return;
    const position = () => {
      const rect = menuAnchor.current?.getBoundingClientRect();
      if (!rect) return;
      const width = menuElement.current?.offsetWidth || 220;
      setMenuPosition({
        top: rect.bottom + 8,
        left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)),
      });
    };
    const dismiss = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menuElement.current?.contains(target) && !menuAnchor.current?.contains(target))
        setMenu([]);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenu([]);
        menuAnchor.current?.focus();
      }
    };
    position();
    window.addEventListener('resize', position);
    window.addEventListener('scroll', position, true);
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('resize', position);
      window.removeEventListener('scroll', position, true);
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', onKey);
    };
  }, [menu]);
  useEffect(() => {
    if (!overlay) return;
    const previous = document.activeElement as HTMLElement;
    const node = modal.current;
    const controls = () =>
      Array.from(
        node?.querySelectorAll<HTMLElement>('button,input,select,textarea,a,[tabindex="0"]') || [],
      ).filter((e) => !e.hasAttribute('disabled'));
    setTimeout(() => controls()[0]?.focus(), 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key === 'Tab') {
        const list = controls(),
          first = list[0],
          last = list.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [overlay, revision]);
  useEffect(() => {
    root.current
      ?.querySelectorAll<HTMLElement>(
        '[id^="node-27_"],[data-name="nav"],a:not([href]),[data-name="Buttons"]',
      )
      .forEach((e) => {
        if (!e.closest('button') && !e.querySelector('button')) {
          e.tabIndex = 0;
          e.setAttribute('role', 'button');
        }
      });
  }, [route, overlay, revision]);
  function delegate(e: React.MouseEvent | React.KeyboardEvent) {
    if (e.type === 'keydown' && !['Enter', ' '].includes((e as React.KeyboardEvent).key)) return;
    const target = e.target as HTMLElement;
    if (
      !target.closest('.screen-canvas,.modal-window') ||
      target.closest('input,select,textarea,.action,.modal-close')
    )
      return;
    const control = target.closest<HTMLElement>(
      '[id^="node-27_"],[data-name="nav"],[data-name="Buttons"],button,a,[data-name="Sort-btn"]',
    );
    if (!control || !root.current?.contains(control)) return;
    const text = control.innerText?.trim();
    if (text && text.length < 150) {
      e.preventDefault();
      if (/^(libros|administracion|operaciones)/.test(normalizeText(text))) {
        menuAnchor.current = control;
      }
      action(text, control.closest<HTMLElement>('[data-record]')?.dataset.record);
    }
  }
  const ctx: DesignState = {
    data,
    role,
    userId,
    userName: session?.nombre,
    session,
    route,
    overlay,
    book,
    selected,
    query,
    filter,
    sort,
    page,
    fields,
    extra,
    action,
    field,
  };
  const Screen = screens[route] || screens['27-759'];
  const Overlay = LATER_SPRINTS[overlay] ? () => <LaterSprint id={overlay} /> : screens[overlay];
  const selectedRequest = data.requests.find((r) => r.id === selected);
  const availableCopies = (book.copyList || []).filter((c) => c.estado === 'Disponible');
  return (
    <DesignContext.Provider value={ctx}>
      <div ref={root} onClick={delegate} onKeyDown={delegate}>
        {route !== '27-759' && (
          <SessionNavigation
            onMenu={(label, anchor) => {
              menuAnchor.current = anchor;
              action(label);
            }}
          />
        )}
        <div
          className="screen-canvas"
          key={route + '-' + revision}
          inert={overlay ? true : undefined}
        >
          <Suspense fallback={<p className="loading">Cargando biblioteca…</p>}>
            {route === '207-1669' && (
              <form
                className="purchase-dialog"
                onSubmit={(e) => {
                  e.preventDefault();
                  action('Consultar solicitud');
                }}
              >
                <label>
                  Folio de solicitud
                  <input
                    aria-label="Folio de solicitud"
                    value={fields['Folio de solicitud'] || ''}
                    onChange={(e) => field('Folio de solicitud', e.target.value)}
                  />
                </label>
                <button className="action" type="submit">
                  Consultar solicitud
                </button>
              </form>
            )}
            {LATER_SPRINTS[route] ? <LaterSprint id={route} /> : <Screen />}
            {route === '371-1836' && (
              <section className="purchase-dialog" aria-label="Perfiles registrados">
                <h3>Perfiles registrados</h3>
                <div className="live-table-wrap">
                  <table className="live-table">
                    <thead>
                      <tr>
                        {[
                          'Clave',
                          'Nombre',
                          'Rol',
                          'Permisos',
                          'Cuentas activas',
                          'Estado',
                          'Acciones',
                        ].map((h) => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(data.profiles || []).map((p) => (
                        <tr key={p.key}>
                          <td>{p.key}</td>
                          <td>{p.name}</td>
                          <td>{p.role}</td>
                          <td title={p.permissions.join(', ')}>{p.permissions.length}</td>
                          <td>{p.activeAccounts}</td>
                          <td>{p.active ? 'Activo' : 'Inactivo'}</td>
                          <td>
                            {p.active && (
                              <button
                                className="action"
                                onClick={() => open('373-1903', undefined, { perfil: p })}
                              >
                                Desactivar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </Suspense>
        </div>
        {menu.length > 0 && (
          <div
            ref={menuElement}
            className="quick-menu"
            style={menuPosition}
            aria-label="Opciones de navegación"
          >
            {menu.map((m) => (
              <button key={m} onClick={() => action(m)}>
                {m}
              </button>
            ))}
            <button onClick={() => setMenu([])}>Cerrar menú</button>
          </div>
        )}
        {Overlay && (
          <div
            className="modal-shade"
            // Solo cierra si el clic empezó y terminó fuera de la ventana: al seleccionar el
            // texto de un campo y soltar el ratón fuera, no se pierde lo capturado
            onMouseDown={(e) => {
              pressedOutside.current = e.target === e.currentTarget;
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget && pressedOutside.current) close();
              pressedOutside.current = false;
            }}
          >
            <div
              ref={modal}
              role="dialog"
              aria-modal="true"
              aria-label={manifest.find((n) => n.module === overlay)?.name}
              className="modal-window"
              style={{ width: (manifest.find((n) => n.module === overlay) as any)?.width || 640 }}
              key={overlay + '-' + revision}
            >
              <button className="modal-close" aria-label="Cerrar ventana" onClick={close}>
                ×
              </button>
              <Suspense fallback={<p>Cargando…</p>}>
                {['211-1204', '211-1260', '2081-2172', '2081-2208'].includes(overlay) ? (
                  <PurchaseDialog
                    mode={overlay}
                    request={selectedRequest}
                    data={data}
                    onRequest={(id) => setSelected(id)}
                    canEdit={Boolean(
                      session?.permisos.includes(
                        overlay === '211-1260' ? 'REGISTRAR_RECEPCIONES' : 'GESTIONAR_SOLICITUDES',
                      ),
                    )}
                    close={close}
                    commit={(purchase) => {
                      if (!data.requests.some((r) => r.id === purchase.id)) {
                        void remote(() =>
                          api.createPurchase({
                            solicitante: purchase.requester,
                            costoEstimado: purchase.cost,
                            enviar: true,
                            partidas: (purchase.lines || []).map((l) => ({
                              titulo: l.title,
                              autor: l.author,
                              editorial: l.publisher,
                              isbn: l.isbn,
                              cantidad: l.quantity,
                            })),
                          }),
                        );
                        return;
                      }
                      const receipt = purchase.receipts?.at(-1);
                      if (receipt)
                        void remote(() =>
                          api.receivePurchase(purchase.id, {
                            fechaRecepcion: receipt.date,
                            cantidades: Object.fromEntries(
                              receipt.lines.map((l) => [l.id, l.quantity]),
                            ),
                          }),
                        );
                    }}
                  />
                ) : (
                  <Overlay />
                )}
              </Suspense>
              {overlay === '2081-2172' && selectedRequest && (
                <div className="modal-extra">
                  <p>
                    {selectedRequest.id} · {selectedRequest.title} · {selectedRequest.state}
                  </p>
                  {selectedRequest.state === 'Por autorizar' && (
                    <Action primary>Confirmar revisión</Action>
                  )}
                  {selectedRequest.state === 'En Tesorería' && (
                    <Action primary>Consultar autorización</Action>
                  )}
                  {['En Tesorería', 'Autorizado', 'Recibido parcialmente'].includes(
                    selectedRequest.state,
                  ) && <Action primary>Registrar recepción</Action>}
                  {selectedRequest.state === 'Recibido' && (
                    <button
                      className="action primary"
                      onClick={() =>
                        openWith('2081-2189', selectedRequest.id, () =>
                          purchaseDetail(selectedRequest.id),
                        )
                      }
                    >
                      Entregar al catálogo
                    </button>
                  )}
                </div>
              )}
              {overlay === '211-1149' && (
                <div className="modal-extra">
                  <label>
                    {REMOVAL_CHOICE}
                    <select
                      aria-label={REMOVAL_CHOICE}
                      value={fields[REMOVAL_CHOICE] || availableCopies[0]?.clave || WHOLE_BOOK}
                      onChange={(e) => field(REMOVAL_CHOICE, e.target.value)}
                    >
                      {availableCopies.map((c) => (
                        <option key={c.clave} value={c.clave}>
                          Ejemplar {c.clave} · {c.ubicacion || 'Ubicación incompleta'}
                        </option>
                      ))}
                      <option value={WHOLE_BOOK}>
                        Libro completo ({book.copies} ejemplar{book.copies === 1 ? '' : 'es'})
                      </option>
                    </select>
                  </label>
                  {!availableCopies.length && (
                    <p>
                      No hay ejemplares disponibles: los que están prestados no se pueden dar de
                      baja hasta su devolución.
                    </p>
                  )}
                </div>
              )}
              {overlay === '321-2162' && chat.length > 0 && (
                <div className="chat-messages" aria-live="polite">
                  {chat.map((m, i) => (
                    <p key={i}>
                      <strong>{m.who}:</strong> {m.text}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="prototype-tools">
          {route !== '27-759' && <button onClick={() => open('321-2162')}>Asistente Ducky</button>}
        </div>

        {session?.debeCambiarContrasena && route !== '27-759' && (
          <div className="modal-shade">
            <form
              className="modal-window purchase-dialog"
              style={{ width: 420 }}
              aria-label="Cambiar contraseña temporal"
              onSubmit={(e) => {
                e.preventDefault();
                if (password.nueva !== password.confirmacion) {
                  notify('Las contraseñas nuevas no coinciden.');
                  return;
                }
                changePassword(password.actual, password.nueva)
                  .then((result: any) => {
                    setSession(result.usuario);
                    setPassword({ actual: '', nueva: '', confirmacion: '' });
                    notify(result.mensaje);
                  })
                  .catch((error) => notify(error.message));
              }}
            >
              <h3>Cambia tu contraseña temporal</h3>
              <p>Por seguridad, elige una contraseña nueva antes de continuar.</p>
              {(
                [
                  ['actual', 'Contraseña actual'],
                  ['nueva', 'Nueva contraseña'],
                  ['confirmacion', 'Confirmar nueva contraseña'],
                ] as const
              ).map(([key, label]) => (
                <label key={key}>
                  {label}
                  <input
                    type="password"
                    aria-label={label}
                    value={password[key]}
                    onChange={(e) => setPassword((p) => ({ ...p, [key]: e.target.value }))}
                  />
                </label>
              ))}
              <button className="action primary" type="submit">
                Guardar contraseña
              </button>
            </form>
          </div>
        )}
        {toast && (
          <div role="status" className="toast">
            {toast}
            <button aria-label="Cerrar aviso" onClick={() => setToast('')}>
              ×
            </button>
          </div>
        )}
      </div>
    </DesignContext.Provider>
  );
}
