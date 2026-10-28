/*----
 * Programa: authVista.js
 * Objetivo: Dar formato JSON a la sesión del usuario autenticado
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

/**
 * Objetivo: Construir los datos de sesión que necesita el front para mostrar solo las funciones
 *   permitidas. El rol usa los mismos nombres que el front (src/model.ts).
 * @param {Object} usuario - Registro de usuarioModelo.obtenerUsuarioAcceso().
 * @returns {Object} Cuerpo JSON de la respuesta.
 * Limitaciones: Nunca incluye la contraseña, su hash ni ids internos de la BD.
 */
function formatearSesion(usuario) {
  const nombre = [usuario.primer_nombre, usuario.primer_apellido, usuario.segundo_apellido]
    .filter(Boolean)
    .join(' ');
  return {
    usuario: {
      identificador: usuario.identificador,
      tipoIdentificador: usuario.tipo_identificador,
      nombre,
      correo: usuario.correo,
      rol: usuario.rol_nombre,
      perfil: { clave: usuario.perfil_clave, nombre: usuario.perfil_nombre },
      permisos: usuario.permisos,
      debeCambiarContrasena: usuario.debe_cambiar_contrasena,
    },
  };
}

/**
 * Objetivo: Formatear la respuesta del cambio de contraseña con la sesión renovada.
 * @param {Object} usuario - Registro de usuarioModelo.obtenerUsuarioAcceso().
 * @returns {Object} Mensaje y sesión.
 */
function formatearCambioContrasena(usuario) {
  return { mensaje: 'Contraseña actualizada', ...formatearSesion(usuario) };
}

export { formatearSesion, formatearCambioContrasena };
