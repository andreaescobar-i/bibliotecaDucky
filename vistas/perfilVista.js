/*----
 * Programa: perfilVista.js
 * Objetivo: Dar formato JSON a perfiles y roles (HUPRF01)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

/**
 * Objetivo: Formatear un perfil con su rol, permisos y política de préstamo.
 * @param {Object} perfil - Registro de perfilModelo.
 * @param {Object[]} [cuentas] - Cuentas activas asignadas (solo en el detalle).
 * @returns {Object} Perfil listo para el front.
 */
function formatearPerfil(perfil, cuentas = undefined) {
  const respuesta = {
    clave: perfil.clave,
    nombre: perfil.nombre,
    descripcion: perfil.descripcion,
    rol: perfil.rol_nombre,
    permisos: perfil.permisos,
    estado: perfil.activo ? 'Activo' : 'Inactivo',
    politicaPrestamo: perfil.politica_nombre
      ? {
          nombre: perfil.politica_nombre,
          diasHabiles: perfil.dias_habiles,
          maxRenovaciones: perfil.max_renovaciones,
        }
      : null,
    cuentasActivas: perfil.cuentas_activas,
    creadoPor: perfil.creado_por_identificador,
    fechaCreacion: perfil.fecha_creacion,
    fechaModificacion: perfil.fecha_modificacion,
  };
  if (cuentas) {
    respuesta.cuentas = formatearCuentasAsignadas(cuentas);
  }
  return respuesta;
}

/**
 * Objetivo: Formatear las cuentas activas asignadas a un perfil, identificadas por matrícula o
 *   nómina.
 * @param {Object[]} cuentas - Registros de perfilModelo.obtenerCuentasActivasDePerfil().
 * @returns {Object[]} Tipo, identificador y nombre de cada cuenta.
 */
function formatearCuentasAsignadas(cuentas) {
  return cuentas.map((cuenta) => ({
    tipoIdentificador: cuenta.tipo_identificador,
    identificador: cuenta.identificador,
    nombre: cuenta.nombre,
  }));
}

/**
 * Objetivo: Formatear la respuesta de una operación sobre un perfil.
 * @param {string} mensaje - Mensaje de confirmación de la historia de usuario.
 * @param {Object} perfil - Perfil resultante.
 * @returns {Object} Mensaje y perfil.
 */
function formatearOperacion(mensaje, perfil) {
  return { mensaje, perfil: formatearPerfil(perfil) };
}

/**
 * Objetivo: Formatear los roles con los permisos que su matriz permite.
 * @param {Object[]} roles - Registros de rolModelo.listarRolesConMatriz().
 * @returns {Object} Lista de roles.
 */
function formatearRoles(roles) {
  return {
    roles: roles.map((rol) => ({
      nombre: rol.nombre,
      descripcion: rol.descripcion,
      estado: rol.activo ? 'Activo' : 'Inactivo',
      permisosPermitidos: rol.permisos_permitidos,
    })),
  };
}

/**
 * Objetivo: Formatear la lista de perfiles.
 * @param {Object[]} perfiles - Registros de perfilModelo.
 * @returns {Object} Total y perfiles.
 */
function formatearLista(perfiles) {
  return { total: perfiles.length, perfiles: perfiles.map((perfil) => formatearPerfil(perfil)) };
}

/**
 * Objetivo: Formatear la consulta de un perfil con sus cuentas activas asignadas.
 * @param {Object} perfil - Registro de perfilModelo.
 * @param {Object[]} cuentas - Cuentas activas del perfil.
 * @returns {Object} Perfil con sus cuentas.
 */
function formatearDetalle(perfil, cuentas) {
  return { perfil: formatearPerfil(perfil, cuentas) };
}

export {
  formatearPerfil,
  formatearCuentasAsignadas,
  formatearOperacion,
  formatearRoles,
  formatearLista,
  formatearDetalle,
};
