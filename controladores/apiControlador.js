/*----
 * Programa: apiControlador.js
 * Objetivo: Presentar la API y las rutas que tiene disponibles
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import * as apiVista from '../vistas/apiVista.js';

const VERSION_API = '0.1.0';

// Se agrega una entrada por cada ruta nueva de las siguientes fases
const RUTAS_DISPONIBLES = [
  { metodo: 'GET', ruta: '/', descripcion: 'Información de la API y rutas disponibles' },
  { metodo: 'GET', ruta: '/salud', descripcion: 'Estado de la API y de la base de datos' },
  { metodo: 'POST', ruta: '/auth/login', descripcion: 'Iniciar sesión (HUGUS01)' },
  { metodo: 'POST', ruta: '/auth/logout', descripcion: 'Cerrar sesión' },
  { metodo: 'GET', ruta: '/auth/sesion', descripcion: 'Cuenta y permisos de la sesión actual' },
  { metodo: 'PUT', ruta: '/auth/contrasena', descripcion: 'Cambiar la contraseña (temporal)' },
  { metodo: 'GET', ruta: '/usuarios', descripcion: 'Buscar cuentas con filtros (HUGUS05)' },
  { metodo: 'GET', ruta: '/usuarios/:identificador', descripcion: 'Detalle de una cuenta' },
  { metodo: 'POST', ruta: '/usuarios', descripcion: 'Alta de cuenta (HUGUS02)' },
  {
    metodo: 'PUT',
    ruta: '/usuarios/:identificador',
    descripcion: 'Cambiar contacto y/o perfil (HUGUS04)',
  },
  {
    metodo: 'PUT',
    ruta: '/usuarios/:identificador/perfil',
    descripcion: 'Asignar perfil a una cuenta (HUPRF01)',
  },
  { metodo: 'POST', ruta: '/usuarios/:identificador/baja', descripcion: 'Baja lógica (HUGUS03)' },
  { metodo: 'POST', ruta: '/usuarios/:identificador/reactivar', descripcion: 'Reactivar cuenta' },
  { metodo: 'GET', ruta: '/perfiles', descripcion: 'Listar perfiles (HUPRF01)' },
  { metodo: 'GET', ruta: '/perfiles/:clave', descripcion: 'Detalle de perfil y cuentas activas' },
  { metodo: 'POST', ruta: '/perfiles', descripcion: 'Crear perfil (HUPRF01)' },
  { metodo: 'PUT', ruta: '/perfiles/:clave', descripcion: 'Modificar perfil (HUPRF01)' },
  { metodo: 'POST', ruta: '/perfiles/:clave/desactivar', descripcion: 'Desactivar perfil' },
  { metodo: 'GET', ruta: '/roles', descripcion: 'Roles y permisos que permite cada uno' },
  { metodo: 'GET', ruta: '/libros', descripcion: 'Buscar libros con disponibilidad (HULIB04)' },
  { metodo: 'POST', ruta: '/libros', descripcion: 'Alta de libro y ejemplar (HULIB01)' },
  { metodo: 'GET', ruta: '/libros/:clave', descripcion: 'Ficha con sus ejemplares' },
  {
    metodo: 'PUT',
    ruta: '/libros/:clave',
    descripcion: 'Cambio de datos bibliográficos (HULIB03)',
  },
  {
    metodo: 'POST',
    ruta: '/libros/:clave/ejemplares',
    descripcion: 'Ejemplar nuevo de un libro existente (HULIB01)',
  },
  { metodo: 'GET', ruta: '/libros/:clave/etiquetas', descripcion: 'Etiquetas de los ejemplares' },
  { metodo: 'GET', ruta: '/libros/:clave/historial', descripcion: 'Historial de movimientos' },
  { metodo: 'POST', ruta: '/libros/:clave/baja', descripcion: 'Baja del libro completo' },
  { metodo: 'GET', ruta: '/ejemplares/:clave', descripcion: 'Detalle de un ejemplar' },
  { metodo: 'GET', ruta: '/ejemplares/:clave/etiqueta', descripcion: 'Etiqueta del ejemplar' },
  {
    metodo: 'PUT',
    ruta: '/ejemplares/:clave',
    descripcion: 'Clasificación y ubicación (HULIB03)',
  },
  { metodo: 'POST', ruta: '/ejemplares/:clave/baja', descripcion: 'Baja de ejemplar (HULIB02)' },
  { metodo: 'GET', ruta: '/catalogos', descripcion: 'Temas, tipos de uso, editoriales y motivos' },
  { metodo: 'GET', ruta: '/listado-libros', descripcion: 'Listado filtrado (HULIS01)' },
  { metodo: 'GET', ruta: '/listado-libros/pdf', descripcion: 'Exportar listado a PDF' },
  { metodo: 'GET', ruta: '/listado-libros/impresion', descripcion: 'Vista para imprimir' },
  { metodo: 'GET', ruta: '/ubicaciones', descripcion: 'Ubicación de ejemplares (HUUBI01)' },
  { metodo: 'GET', ruta: '/solicitudes', descripcion: 'Solicitudes de compra (HUCOM01)' },
  { metodo: 'GET', ruta: '/solicitudes/presupuesto', descripcion: 'Presupuesto del mes en curso' },
  { metodo: 'GET', ruta: '/solicitudes/entregadas', descripcion: 'Lotes entregados al catálogo' },
  { metodo: 'GET', ruta: '/solicitudes/:folio', descripcion: 'Consultar solicitud por folio' },
  { metodo: 'POST', ruta: '/solicitudes', descripcion: 'Nueva petición o solicitud con partidas' },
  { metodo: 'PUT', ruta: '/solicitudes/:folio/partidas', descripcion: 'Preparar partidas' },
  { metodo: 'POST', ruta: '/solicitudes/:folio/envio', descripcion: 'Enviar a Tesorería' },
  {
    metodo: 'POST',
    ruta: '/solicitudes/:folio/autorizacion',
    descripcion: 'Respuesta de Tesorería (simulada)',
  },
  { metodo: 'POST', ruta: '/solicitudes/:folio/recepciones', descripcion: 'Registrar recepción' },
  {
    metodo: 'POST',
    ruta: '/solicitudes/:folio/entrega-catalogo',
    descripcion: 'Entregar lote al catálogo',
  },
];

/**
 * Objetivo: Responder con el nombre, la versión y las rutas disponibles de la API.
 * @param {Object} _req - Petición HTTP (no se usa).
 * @param {Object} res - Respuesta HTTP.
 * @returns {void}
 */
function getIndice(_req, res) {
  res.json(apiVista.formatearIndice(VERSION_API, RUTAS_DISPONIBLES));
}

export { getIndice };
