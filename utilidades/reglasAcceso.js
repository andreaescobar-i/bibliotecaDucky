/*----
 * Programa: reglasAcceso.js
 * Objetivo: Decidir si una cuenta puede usar la plataforma (HUGUS01 escenario 3). Se aplica al
 *           iniciar sesión y antes de cada operación protegida.
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import { TIPOS_IDENTIFICADOR } from './identificadores.js';

const MENSAJE_ACCESO_NO_HABILITADO = 'Acceso no habilitado; solicite la revisión de su cuenta';

// Área a la que debe acudir el usuario según la causa del rechazo
const AREAS = Object.freeze({
  ADMINISTRADOR: 'Administrador de biblioteca',
  SERVICIOS_ESCOLARES: 'Servicios Escolares',
  CAPITAL_HUMANO: 'Capital Humano',
});

/**
 * Objetivo: Revisar cuenta, perfil, rol y vigencia institucional de un usuario.
 * @param {Object} usuario - Registro de usuarioModelo.obtenerUsuarioAcceso().
 * @param {boolean} esVigente - Vigencia en CIAA (alumnos) o Capital Humano (personal).
 * @returns {{ causa: string, area: string }|null} Motivo del rechazo, o null si puede acceder.
 * Limitaciones: No valida la contraseña; eso ocurre antes, al iniciar sesión.
 */
function evaluarAcceso(usuario, esVigente) {
  if (usuario.estado_cuenta !== 'ACTIVO') {
    return { causa: 'CUENTA_INACTIVA', area: AREAS.ADMINISTRADOR };
  }
  if (!usuario.perfil_activo || !usuario.rol_activo) {
    return { causa: 'PERFIL_INACTIVO', area: AREAS.ADMINISTRADOR };
  }
  if (!esVigente) {
    const esAlumno = usuario.tipo_identificador === TIPOS_IDENTIFICADOR.MATRICULA;
    return esAlumno
      ? { causa: 'ALUMNO_NO_VIGENTE', area: AREAS.SERVICIOS_ESCOLARES }
      : { causa: 'PERSONAL_NO_VIGENTE', area: AREAS.CAPITAL_HUMANO };
  }
  return null;
}

export { MENSAJE_ACCESO_NO_HABILITADO, AREAS, evaluarAcceso };
