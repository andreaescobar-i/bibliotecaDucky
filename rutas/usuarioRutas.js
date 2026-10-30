/*----
 * Programa: usuarioRutas.js
 * Objetivo: Definir las rutas de cuentas de usuario; todas exigen sesión y su permiso
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import express from 'express';
import * as usuarioControlador from '../controladores/usuarioControlador.js';
import { requiereSesion, requierePermiso } from '../middlewares/autenticacion.js';

const router = express.Router();

router.use(requiereSesion);

router.get('/', requierePermiso('CONSULTA_CUENTAS'), usuarioControlador.getUsuarios);
router.get('/:identificador', requierePermiso('CONSULTA_CUENTAS'), usuarioControlador.getUsuario);
router.post('/', requierePermiso('ALTA_CUENTAS'), usuarioControlador.postUsuario);
router.put('/:identificador', requierePermiso('CAMBIO_CUENTAS'), usuarioControlador.putUsuario);
router.put(
  '/:identificador/perfil',
  requierePermiso('ASIGNAR_PERFILES', 'Sin permiso para asignar perfiles'),
  usuarioControlador.putPerfilUsuario,
);
router.post(
  '/:identificador/baja',
  requierePermiso('BAJA_CUENTAS'),
  usuarioControlador.postBajaUsuario,
);
router.post(
  '/:identificador/reactivar',
  requierePermiso('BAJA_CUENTAS'),
  usuarioControlador.postReactivarUsuario,
);

export default router;
