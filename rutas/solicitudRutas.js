/*----
 * Programa: solicitudRutas.js
 * Objetivo: Definir las rutas de solicitudes de compra y recepciones (HUCOM01); todas exigen
 *           sesión y su permiso
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import express from 'express';
import * as solicitudControlador from '../controladores/solicitudControlador.js';
import {
  requiereSesion,
  requierePermiso,
  requiereAlgunPermiso,
} from '../middlewares/autenticacion.js';

// Consultar lo puede quien gestiona solicitudes o quien registra recepciones
const PERMISO_CONSULTA = requiereAlgunPermiso(['GESTIONAR_SOLICITUDES', 'REGISTRAR_RECEPCIONES']);
const PERMISO_GESTION = requierePermiso('GESTIONAR_SOLICITUDES');
const PERMISO_RECEPCION = requierePermiso('REGISTRAR_RECEPCIONES');

const router = express.Router();

router.use(requiereSesion);

router.get('/', PERMISO_CONSULTA, solicitudControlador.getSolicitudes);
router.get('/presupuesto', PERMISO_CONSULTA, solicitudControlador.getPresupuestoActual);
// Lotes entregados al catálogo: también los consulta quien da de alta libros
router.get(
  '/entregadas',
  requiereAlgunPermiso(['GESTIONAR_SOLICITUDES', 'REGISTRAR_RECEPCIONES', 'ALTA_LIBROS']),
  solicitudControlador.getEntregadasCatalogo,
);
router.get('/:folio', PERMISO_CONSULTA, solicitudControlador.getSolicitud);
router.post('/', PERMISO_GESTION, solicitudControlador.postSolicitud);
router.put('/:folio/partidas', PERMISO_GESTION, solicitudControlador.putPartidas);
router.post('/:folio/envio', PERMISO_GESTION, solicitudControlador.postEnvio);
// Respuesta de Tesorería simulada mientras no exista la integración
router.post('/:folio/autorizacion', PERMISO_GESTION, solicitudControlador.postAutorizacion);
router.post('/:folio/recepciones', PERMISO_RECEPCION, solicitudControlador.postRecepcion);
router.post(
  '/:folio/entrega-catalogo',
  PERMISO_RECEPCION,
  solicitudControlador.postEntregaCatalogo,
);

export default router;
