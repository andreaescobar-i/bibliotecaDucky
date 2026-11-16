/*----
 * Programa: guiaApp.js
 * Objetivo: Describir al asistente Ducky quién le habla y qué puede o no puede hacer esa persona
 *           en el sistema, a partir de los permisos reales de su perfil, y de forma más breve
 *           qué pueden hacer los demás roles. Es una guía general: no indica botones ni pasos
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 16 de Noviembre de 2026
 *
 * De dónde sale cada dato (comprobado el 15 de noviembre de 2026 con la aplicación abierta y
 * una cuenta de cada rol):
 *   - Acciones y permisos: los que exige cada ruta de la API (rutas/*.js). La prueba
 *     tests/integracion/chatGuia.test.mjs comprueba contra la API que la guía dice la verdad.
 *   - Los demás roles: los perfiles activos de la base con sus permisos (se leen en cada
 *     pregunta), así que un perfil nuevo o modificado se refleja sin tocar este archivo.
 *   - Secciones por rol: el menú que muestra el front (src/components/SessionNavigation.tsx).
 *   - Funciones pendientes: las pantallas que muestran "se entrega en el Sprint N"
 *     (LATER_SPRINTS en src/App.tsx).
 * Si cambia cualquiera de los tres, las pruebas de la guía fallan y hay que actualizarla.
 */

// Acciones del sistema. Cada una se puede hacer si el perfil tiene TODOS los permisos de
// "todos" y, cuando existe, AL MENOS UNO de "alguno" (igual que en las rutas de la API).
const ACCIONES = Object.freeze([
  {
    clave: 'OPERAR_CIRCULACION',
    descripcion:
      'Registrar préstamos y boletas, renovaciones, devoluciones, inscripciones en lista de espera y remitir multas con Tesorería simulada',
    todos: ['OPERAR_CIRCULACION'],
  },
  {
    clave: 'CONSULTAR_CATALOGO',
    descripcion: 'Buscar libros en el catálogo y ver su ficha y la disponibilidad de ejemplares',
    todos: ['CONSULTAR_LIBROS'],
  },
  {
    clave: 'CONSULTAR_UBICACION',
    descripcion: 'Consultar la ubicación (librero y fila) de los ejemplares',
    todos: ['CONSULTAR_UBICACION'],
  },
  {
    clave: 'CONSULTAR_LISTADO',
    descripcion: 'Consultar el listado de libros y obtenerlo en PDF o para imprimir',
    todos: ['CONSULTAR_LISTADO'],
  },
  {
    clave: 'ALTA_LIBROS',
    descripcion: 'Dar de alta libros y ejemplares nuevos',
    todos: ['ALTA_LIBROS', 'CLASIFICAR_EJEMPLARES', 'ETIQUETAR_EJEMPLARES'],
  },
  {
    clave: 'EDITAR_LIBROS',
    descripcion: 'Editar los datos de un libro y consultar el historial de sus ejemplares',
    todos: ['CAMBIO_LIBROS'],
  },
  {
    clave: 'CLASIFICAR_EJEMPLARES',
    descripcion: 'Cambiar la clasificación, la ubicación o el tipo de uso de un ejemplar',
    todos: ['CAMBIO_LIBROS', 'CLASIFICAR_EJEMPLARES', 'ETIQUETAR_EJEMPLARES'],
  },
  {
    clave: 'ETIQUETAS',
    descripcion: 'Generar las etiquetas de los ejemplares',
    todos: ['ETIQUETAR_EJEMPLARES'],
  },
  {
    clave: 'BAJA_LIBROS',
    descripcion: 'Dar de baja libros o ejemplares (se conserva su historial)',
    todos: ['BAJA_LIBROS'],
  },
  {
    clave: 'CONSULTAR_CUENTAS',
    descripcion: 'Buscar y consultar las cuentas de usuario',
    todos: ['CONSULTA_CUENTAS'],
  },
  {
    clave: 'ALTA_CUENTAS',
    descripcion: 'Dar de alta cuentas de usuario',
    todos: ['ALTA_CUENTAS'],
  },
  {
    clave: 'EDITAR_CUENTAS',
    descripcion: 'Editar los datos de contacto de una cuenta',
    todos: ['CAMBIO_CUENTAS'],
  },
  {
    clave: 'ASIGNAR_PERFILES',
    descripcion: 'Asignar o cambiar el perfil (y con ello el rol) de una cuenta',
    todos: ['ASIGNAR_PERFILES'],
  },
  {
    clave: 'BAJA_CUENTAS',
    descripcion: 'Dar de baja y reactivar cuentas de usuario',
    todos: ['BAJA_CUENTAS'],
  },
  {
    clave: 'CONSULTAR_PERFILES',
    descripcion: 'Consultar los roles, los perfiles y sus permisos',
    todos: ['CONSULTAR_PERFILES'],
  },
  {
    clave: 'CREAR_PERFILES',
    descripcion: 'Crear perfiles',
    todos: ['CREAR_PERFILES'],
  },
  {
    clave: 'MODIFICAR_PERFILES',
    descripcion: 'Modificar el nombre, el rol o los permisos de un perfil',
    todos: ['CONSULTAR_PERFILES', 'MODIFICAR_PERFILES'],
  },
  {
    clave: 'DESACTIVAR_PERFILES',
    descripcion: 'Desactivar perfiles que no tengan cuentas activas',
    todos: ['DESACTIVAR_PERFILES'],
  },
  {
    clave: 'CONSULTAR_COMPRAS',
    descripcion: 'Consultar las solicitudes de compra de libros y el presupuesto del mes',
    todos: [],
    alguno: ['GESTIONAR_SOLICITUDES', 'REGISTRAR_RECEPCIONES'],
  },
  {
    clave: 'GESTIONAR_COMPRAS',
    descripcion: 'Preparar solicitudes de compra de libros y enviarlas a Tesorería',
    todos: ['GESTIONAR_SOLICITUDES'],
  },
  {
    clave: 'REGISTRAR_RECEPCIONES',
    descripcion: 'Registrar la recepción de los libros comprados y entregarlos al catálogo',
    todos: ['REGISTRAR_RECEPCIONES'],
  },
]);

// Secciones del menú que la aplicación muestra a cada rol y, de forma general, qué hay en ellas
const SECCIONES_LECTOR = Object.freeze([
  { nombre: 'Catálogo', contenido: 'buscar libros y ver su detalle' },
  { nombre: 'Mi cuenta', contenido: 'préstamos, adeudos y lista de espera' },
]);
const OPERACIONES = Object.freeze({
  nombre: 'Operaciones',
  contenido:
    'préstamos y boletas, devolución, renovación, lista de espera y multas; pagos y suspendidos siguen pendientes',
});
const SECCIONES_POR_ROL = Object.freeze({
  Alumno: SECCIONES_LECTOR,
  Maestro: SECCIONES_LECTOR,
  Colaborador: SECCIONES_LECTOR,
  Bibliotecario: [
    { nombre: 'Catálogo', contenido: 'buscar libros y ver su detalle' },
    { nombre: 'Libros', contenido: 'el catálogo y la gestión de libros y de sus ejemplares' },
    OPERACIONES,
  ],
  Administrador: [
    { nombre: 'Reportes', contenido: 'reportes e inventario; aún no habilitada' },
    { nombre: 'Usuarios', contenido: 'gestión de las cuentas de usuario' },
    { nombre: 'Libros', contenido: 'el catálogo, la gestión de catálogo y la gestión de libros' },
    { nombre: 'Administración', contenido: 'usuarios, perfiles y solicitudes de libros' },
    OPERACIONES,
  ],
  'Comprador de libros': [
    {
      nombre: 'Compras',
      contenido: 'solicitudes de compra, presupuesto del mes, recepciones y entrega al catálogo',
    },
  ],
});

// Aclaraciones comprobadas en la aplicación para un rol en particular
const NOTAS_POR_ROL = Object.freeze({
  'Comprador de libros':
    'Su menú no incluye el catálogo: para saber de un libro o de su ubicación puede preguntárselo al asistente.',
  Administrador:
    'Las compras de libros las consulta y gestiona en "Solicitudes de libros", dentro de Administración.',
});

// Funciones que la aplicación muestra pero aún no están habilitadas, con el sprint en que se
// entregan y los roles que las ven en su menú
const ROLES_OPERACION = ['Bibliotecario', 'Administrador'];
const FUNCIONES_PENDIENTES = Object.freeze([
  { nombre: 'Alumnos suspendidos', sprint: 'Sprint 3', roles: ROLES_OPERACION },
  { nombre: 'Reportes e inventario', sprint: 'Sprint 5', roles: ['Administrador'] },
]);

/**
 * Objetivo: Saber si un perfil puede realizar una acción con los permisos que tiene.
 * @param {{ todos: string[], alguno?: string[] }} accion - Acción de ACCIONES.
 * @param {string[]} permisos - Claves de permiso del perfil de la cuenta.
 * @returns {boolean} true si la API le permitiría la acción.
 */
function puedeRealizar(accion, permisos) {
  const tieneTodos = accion.todos.every((permiso) => permisos.includes(permiso));
  const tieneAlguno = !accion.alguno || accion.alguno.some((permiso) => permisos.includes(permiso));
  return tieneTodos && tieneAlguno;
}

/**
 * Objetivo: Separar las acciones del sistema en las que la cuenta puede hacer y las que no.
 * @param {string[]} permisos - Claves de permiso del perfil de la cuenta.
 * @returns {{ permitidas: Object[], noPermitidas: Object[] }} Acciones de cada grupo.
 */
function clasificarAcciones(permisos) {
  return {
    permitidas: ACCIONES.filter((accion) => puedeRealizar(accion, permisos)),
    noPermitidas: ACCIONES.filter((accion) => !puedeRealizar(accion, permisos)),
  };
}

/**
 * Objetivo: Listar renglones con guion, o un texto alterno si la lista está vacía.
 * @param {string[]} renglones - Textos a listar.
 * @param {string} vacio - Texto cuando no hay renglones.
 * @returns {string} Lista en texto simple.
 */
function listar(renglones, vacio) {
  return renglones.length > 0
    ? renglones.map((renglon) => `- ${renglon}`).join('\n')
    : `- ${vacio}`;
}

/**
 * Objetivo: Resumir en un renglón qué puede hacer un perfil que no es el de quien pregunta.
 * @param {{ nombre: string, rol_nombre: string, permisos: string[] }} perfil - Perfil activo.
 * @returns {string} Por ejemplo 'Alumno: Buscar libros...; ... Menú: Catálogo y Mi cuenta.'
 */
function resumirPerfil(perfil) {
  const { permitidas, noPermitidas } = clasificarAcciones(perfil.permisos ?? []);
  const titulo =
    perfil.nombre === perfil.rol_nombre
      ? perfil.rol_nombre
      : `${perfil.rol_nombre}, perfil "${perfil.nombre}"`;
  let acciones = permitidas.map((accion) => accion.descripcion).join('; ');
  if (permitidas.length === 0) {
    acciones = 'ninguna acción de gestión o consulta';
  } else if (noPermitidas.length === 0) {
    acciones = 'todas las acciones del sistema (las de las listas "sí puede" y "no puede" juntas)';
  }
  const secciones = (SECCIONES_POR_ROL[perfil.rol_nombre] ?? []).map((seccion) => seccion.nombre);
  const menu = secciones.length > 0 ? ` Menú: ${secciones.join(', ')}.` : '';
  return `${titulo}: ${acciones}.${menu}`;
}

/**
 * Objetivo: Resumir qué pueden hacer los demás perfiles activos, para responder preguntas
 *   generales sobre otros roles.
 * @param {Object[]} perfiles - Perfiles activos con nombre, rol_nombre, rol_activo y permisos.
 * @param {string} perfilPropio - Nombre del perfil de quien pregunta (ya se detalla aparte).
 * @returns {string[]} Un renglón por perfil.
 * Limitaciones: Solo describe perfiles; no incluye personas ni cuántas cuentas tiene cada uno.
 */
function resumirOtrosPerfiles(perfiles, perfilPropio) {
  return perfiles
    .filter((perfil) => perfil.rol_activo !== false && perfil.nombre !== perfilPropio)
    .map(resumirPerfil);
}

/**
 * Objetivo: Redactar para el modelo quién pregunta, qué puede o no puede hacer en el sistema y,
 *   de forma general, qué pueden hacer los demás roles.
 * @param {Object} usuario - Cuenta de la sesión (req.usuario): primer_nombre, rol_nombre,
 *   perfil_nombre y permisos.
 * @param {Object[]} [perfiles] - Perfiles activos de la base (perfilModelo.listarPerfiles).
 * @returns {string} Guía en texto simple para incluir en las instrucciones.
 * Limitaciones: Lo que puede hacer sale de los permisos del perfil, no del nombre del rol: un
 *   perfil puede tener menos permisos que otros del mismo rol.
 */
function crearGuia(usuario, perfiles = []) {
  const rol = usuario.rol_nombre;
  const { permitidas, noPermitidas } = clasificarAcciones(usuario.permisos ?? []);
  const secciones = SECCIONES_POR_ROL[rol] ?? [];
  const pendientes = FUNCIONES_PENDIENTES.filter((funcion) => funcion.roles.includes(rol));

  return `QUIÉN PREGUNTA
- Nombre: ${usuario.primer_nombre}. Rol: ${rol}. Perfil: ${usuario.perfil_nombre}.
- Secciones del menú de la aplicación para su rol:
${listar(
  secciones.map((seccion) => `${seccion.nombre}: ${seccion.contenido}`),
  'No definidas para este rol.',
)}${NOTAS_POR_ROL[rol] ? `\n- ${NOTAS_POR_ROL[rol]}` : ''}

LO QUE ESTA PERSONA SÍ PUEDE HACER EN EL SISTEMA (según los permisos de su perfil)
${listar(
  permitidas.map((accion) => accion.descripcion),
  'Ninguna de las acciones de gestión o consulta del sistema.',
)}

LO QUE ESTA PERSONA NO PUEDE HACER (su perfil no tiene el permiso)
${listar(
  noPermitidas.map((accion) => accion.descripcion),
  'No hay acciones restringidas para este perfil.',
)}

FUNCIONES QUE SU MENÚ MUESTRA PERO AÚN NO ESTÁN HABILITADAS EN EL SISTEMA
${listar(
  pendientes.map((funcion) => `${funcion.nombre} (se entrega en el ${funcion.sprint})`),
  'Ninguna.',
)}
- Las operaciones de circulación y la consulta de multas ya están disponibles con el permiso correspondiente. El envío a Tesorería es simulado; el registro de pagos y los reportes siguen pendientes.

LO QUE PUEDEN HACER LOS DEMÁS ROLES Y PERFILES (de forma general, según los perfiles activos)
${listar(
  resumirOtrosPerfiles(perfiles, usuario.perfil_nombre),
  'No hay información de otros perfiles.',
)}

CÓMO USAR ESTA INFORMACIÓN
- Si pregunta qué puede hacer, cuál es su rol o sus permisos, responde con las listas anteriores.
- Si pregunta por una acción de la lista "sí puede", confirma que su perfil lo permite e indica en qué sección del menú se encuentra de forma general. No des pasos detallados ni nombres de botones.
- Si pregunta por una acción de la lista "no puede", dile con claridad que su perfil no tiene ese permiso. Las cuentas y los perfiles los gestiona el Administrador; el alta, cambio y baja de libros corresponden a perfiles de Bibliotecario o Administrador; las compras, a perfiles de Comprador de libros o Administrador.
- Lo que una persona puede hacer lo decide el permiso de su perfil, no su menú: si la aplicación le muestra una opción que su perfil no permite, el sistema rechazará la operación. Quien puede cambiar un perfil es el Administrador.
- Si pregunta por una función aún no habilitada, dile que todavía no está disponible en el sistema y en qué sprint se entrega. Sus préstamos y adeudos sí puedes consultarlos tú con la herramienta de su cuenta.
- Si pregunta qué puede hacer otro rol o perfil (por ejemplo "¿y un alumno?" o "¿qué hace el bibliotecario?"), responde de forma general con la lista de los demás roles y perfiles; si ese rol tiene más de un perfil, acláralo. Nunca digas qué personas tienen ese rol ni des datos de sus cuentas.
- Si pregunta por una acción o un rol que no aparece en ninguna lista, responde que no cuentas con esa información.`;
}

export {
  ACCIONES,
  SECCIONES_POR_ROL,
  FUNCIONES_PENDIENTES,
  puedeRealizar,
  clasificarAcciones,
  resumirOtrosPerfiles,
  crearGuia,
};
