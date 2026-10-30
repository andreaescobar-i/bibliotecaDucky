/*----
 * Programa: usuarioVista.js
 * Objetivo: Dar formato JSON a las cuentas de usuario (HUGUS02-05)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

// Estados en el mismo texto que usa el front ("Activo" / "Inactivo")
const TEXTO_ESTADO = Object.freeze({ ACTIVO: 'Activo', INACTIVO: 'Inactivo' });

/**
 * Objetivo: Formatear una cuenta. Nunca incluye contraseñas, hashes ni ids internos.
 * @param {Object} usuario - Registro de usuarioModelo.
 * @param {Object} [opciones] - Opciones de formato.
 * @param {boolean} [opciones.incluirPermisos] - true para el detalle de la cuenta.
 * @returns {Object} Cuenta lista para el front.
 */
function formatearUsuario(usuario, { incluirPermisos = false } = {}) {
  const cuenta = {
    tipoIdentificador: usuario.tipo_identificador,
    identificador: usuario.identificador,
    nombre: [usuario.primer_nombre, usuario.primer_apellido, usuario.segundo_apellido]
      .filter(Boolean)
      .join(' '),
    correo: usuario.correo,
    telefono: usuario.telefono,
    rol: usuario.rol_nombre,
    perfil: {
      clave: usuario.perfil_clave,
      nombre: usuario.perfil_nombre,
      estado: usuario.perfil_activo ? TEXTO_ESTADO.ACTIVO : TEXTO_ESTADO.INACTIVO,
    },
    estadoCuenta: TEXTO_ESTADO[usuario.estado_cuenta],
    fechaAlta: usuario.fecha_alta,
    baja: usuario.fecha_baja
      ? {
          fecha: usuario.fecha_baja,
          motivo: usuario.motivo_baja,
          operador: usuario.baja_por_identificador,
        }
      : null,
  };
  if (incluirPermisos) {
    cuenta.permisos = usuario.permisos;
    cuenta.ultimoAcceso = usuario.ultimo_acceso;
  }
  return cuenta;
}

/**
 * Objetivo: Construir el mensaje con el número de cuentas encontradas (HUGUS05).
 * @param {number} total - Cuentas encontradas.
 * @returns {string} Mensaje para el usuario.
 */
function crearMensajeBusqueda(total) {
  if (total === 0) {
    return 'No se encontraron usuarios con los criterios seleccionados';
  }
  return total === 1 ? 'Se encontró 1 usuario' : `Se encontraron ${total} usuarios`;
}

/**
 * Objetivo: Formatear el resultado de una búsqueda de cuentas (HUGUS05).
 * @param {Object[]} usuarios - Cuentas encontradas.
 * @param {{ puedeEditar: boolean, puedeAsignarPerfil: boolean }} acciones - Acciones que el
 *   operador puede ofrecer según sus permisos.
 * @returns {Object} Total, mensaje, acciones permitidas y cuentas.
 */
function formatearBusqueda(usuarios, acciones) {
  const total = usuarios.length;
  return {
    total,
    mensaje: crearMensajeBusqueda(total),
    acciones,
    usuarios: usuarios.map((usuario) => formatearUsuario(usuario)),
  };
}

/**
 * Objetivo: Formatear la consulta de una cuenta con sus permisos.
 * @param {Object} usuario - Registro de usuarioModelo.
 * @returns {Object} Cuenta.
 */
function formatearDetalle(usuario) {
  return { usuario: formatearUsuario(usuario, { incluirPermisos: true }) };
}

/**
 * Objetivo: Formatear la respuesta de una operación sobre una cuenta.
 * @param {string} mensaje - Mensaje de la operación.
 * @param {Object} usuario - Registro de usuarioModelo.
 * @param {Object} [extra] - Datos adicionales de la respuesta.
 * @returns {Object} Mensaje, datos extra y cuenta.
 */
function formatearOperacion(mensaje, usuario, extra = {}) {
  return { mensaje, ...extra, usuario: formatearUsuario(usuario, { incluirPermisos: true }) };
}

/**
 * Objetivo: Formatear los préstamos que impiden una baja (HUGUS03 escenario 2).
 * @param {Object[]} prestamos - Registros de prestamoModelo.
 * @returns {Object[]} Clave de libro, Título, Clave de ejemplar y fecha pactada de devolución.
 */
function formatearPrestamosPendientes(prestamos) {
  return prestamos.map((prestamo) => ({
    folio: prestamo.folio,
    claveLibro: prestamo.clave_libro,
    titulo: prestamo.titulo,
    claveEjemplar: prestamo.codigo_ejemplar,
    fechaDevolucion: prestamo.fecha_vencimiento,
  }));
}

/**
 * Objetivo: Formatear los adeudos que impiden una baja (HUGUS03 escenario 3).
 * @param {Object[]} adeudos - Registros de adeudoModelo.
 * @returns {Object[]} Folio, concepto y monto de cada adeudo.
 */
function formatearAdeudosPendientes(adeudos) {
  return adeudos.map((adeudo) => ({
    folio: adeudo.folio,
    concepto: adeudo.concepto ?? adeudo.tipo,
    monto: Number(adeudo.monto_mxn),
  }));
}

export {
  formatearDetalle,
  formatearUsuario,
  formatearBusqueda,
  formatearOperacion,
  formatearPrestamosPendientes,
  formatearAdeudosPendientes,
};
