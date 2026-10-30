/*----
 * Programa: perfilRutas.js
 * Objetivo: Definir las rutas de perfiles y roles; todas exigen sesión y su permiso (HUPRF01)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import express from 'express';
import * as perfilControlador from '../controladores/perfilControlador.js';
import { requiereSesion, requierePermiso } from '../middlewares/autenticacion.js';

// Mensaje de HUPRF01 escenario 5 para operaciones de perfiles sin permiso
const MENSAJE_SIN_PERMISO_PERFILES = 'No tiene permiso para esta operación de perfiles';

const router = express.Router();

router.use(requiereSesion);

router.get(
  '/',
  requierePermiso('CONSULTAR_PERFILES', MENSAJE_SIN_PERMISO_PERFILES),
  perfilControlador.getPerfiles,
);
router.get(
  '/:clave',
  requierePermiso('CONSULTAR_PERFILES', MENSAJE_SIN_PERMISO_PERFILES),
  perfilControlador.getPerfil,
);
router.post(
  '/',
  requierePermiso('CREAR_PERFILES', MENSAJE_SIN_PERMISO_PERFILES),
  perfilControlador.postPerfil,
);
// Modificar exige también consultar el perfil (HUPRF01 escenario 2)
router.put(
  '/:clave',
  requierePermiso('CONSULTAR_PERFILES', MENSAJE_SIN_PERMISO_PERFILES),
  requierePermiso('MODIFICAR_PERFILES', MENSAJE_SIN_PERMISO_PERFILES),
  perfilControlador.putPerfil,
);
router.post(
  '/:clave/desactivar',
  requierePermiso('DESACTIVAR_PERFILES', MENSAJE_SIN_PERMISO_PERFILES),
  perfilControlador.postDesactivarPerfil,
);

export default router;
