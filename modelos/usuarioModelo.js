/*----
 * Programa: usuarioModelo.js
 * Objetivo: Consultas de cuentas de usuario: autenticación, búsqueda, alta, cambios y baja
 *           lógica (HUGUS01-05, HUPRF01)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import DbPool from '../config/db.js';
import { crearPatronContiene } from '../utilidades/validacion.js';

// Llave del candado que serializa los cambios que pueden dejar al sistema sin administrador
const CANDADO_CAMBIOS_ACCESO = 710_001;

// Cuenta con su perfil, rol y permisos vigentes. Nunca incluye el hash de la contraseña.
const SELECCION_USUARIO = `
  SELECT u.usuario_id, u.tipo_identificador, u.identificador, u.primer_nombre,
         u.primer_apellido, u.segundo_apellido, u.correo, u.telefono, u.estado_cuenta,
         u.version_sesion, u.debe_cambiar_contrasena, u.fecha_alta, u.ultimo_acceso,
         u.fecha_baja, u.motivo_baja, ub.identificador AS baja_por_identificador,
         pf.perfil_id, pf.clave AS perfil_clave, pf.nombre AS perfil_nombre,
         pf.activo AS perfil_activo,
         r.rol_id, r.nombre AS rol_nombre, r.activo AS rol_activo,
         COALESCE(
           ARRAY_AGG(p.clave ORDER BY p.clave) FILTER (WHERE p.clave IS NOT NULL),
           '{}'
         ) AS permisos
  FROM usuario u
  LEFT JOIN usuario ub ON ub.usuario_id = u.baja_por_usuario_id
  JOIN perfil pf ON pf.perfil_id = u.perfil_id
  JOIN rol r ON r.rol_id = pf.rol_id
  LEFT JOIN perfil_permiso pp ON pp.perfil_id = pf.perfil_id
  LEFT JOIN permiso p ON p.permiso_id = pp.permiso_id`;

const AGRUPACION_USUARIO = 'GROUP BY u.usuario_id, ub.usuario_id, pf.perfil_id, r.rol_id';

/**
 * Objetivo: Obtener el id y el hash de contraseña de una cuenta para verificar el acceso.
 * @param {string} tipo - 'MATRICULA' o 'NOMINA'.
 * @param {string} identificador - Identificador normalizado.
 * @returns {Promise<{ usuario_id: string, contrasena_hash: string }|null>} Credenciales, o null
 *   si no hay cuenta con ese identificador.
 */
async function obtenerCredenciales(tipo, identificador) {
  const resultado = await DbPool.query(
    `SELECT usuario_id, "contraseña_hash" AS contrasena_hash
     FROM usuario
     WHERE tipo_identificador = $1 AND identificador = $2`,
    [tipo, identificador],
  );
  return resultado.rows[0] || null;
}

/**
 * Objetivo: Obtener una cuenta por su id con perfil, rol y lista de permisos.
 * @param {string} usuarioId - Id de la cuenta (BIGINT llega como texto desde pg).
 * @returns {Promise<Object|null>} Cuenta con permisos, o null si no existe.
 */
async function obtenerUsuarioAcceso(usuarioId) {
  const resultado = await DbPool.query(
    `${SELECCION_USUARIO} WHERE u.usuario_id = $1 ${AGRUPACION_USUARIO}`,
    [usuarioId],
  );
  return resultado.rows[0] || null;
}

/**
 * Objetivo: Obtener una cuenta por Tipo e Identificador institucional.
 * @param {string} tipo - 'MATRICULA' o 'NOMINA'.
 * @param {string} identificador - Identificador normalizado.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<Object|null>} Cuenta con permisos, o null si no existe.
 */
async function obtenerUsuarioPorIdentificador(tipo, identificador, cliente = DbPool) {
  const resultado = await cliente.query(
    `${SELECCION_USUARIO}
     WHERE u.tipo_identificador = $1 AND u.identificador = $2
     ${AGRUPACION_USUARIO}`,
    [tipo, identificador],
  );
  return resultado.rows[0] || null;
}

/**
 * Objetivo: Buscar cuentas aplicando todos los filtros recibidos a la vez (HUGUS05).
 * @param {Object} filtros - Filtros ya validados; los ausentes no se aplican.
 * @param {string} [filtros.tipo] - Tipo de identificador (va junto con identificador).
 * @param {string} [filtros.identificador] - Coincidencia exacta.
 * @param {string} [filtros.nombre] - Coincidencia parcial sin mayúsculas ni acentos.
 * @param {string} [filtros.perfil] - Clave de perfil.
 * @param {string} [filtros.rol] - Nombre del rol.
 * @param {string} [filtros.estado] - 'ACTIVO' o 'INACTIVO'.
 * @returns {Promise<Object[]>} Cuentas ordenadas por apellido y nombre.
 */
async function buscarUsuarios(filtros) {
  const condiciones = [];
  const parametros = [];
  // Agrega una condición con su parámetro numerado ($1, $2...)
  const agregar = (plantilla, valor) => {
    parametros.push(valor);
    condiciones.push(plantilla.replace('?', `$${parametros.length}`));
  };

  if (filtros.identificador) {
    agregar('u.tipo_identificador = ?', filtros.tipo);
    agregar('u.identificador = ?', filtros.identificador);
  }
  if (filtros.nombre) {
    agregar(
      "unaccent(CONCAT_WS(' ', u.primer_nombre, u.primer_apellido, u.segundo_apellido)) ILIKE unaccent(?)",
      crearPatronContiene(filtros.nombre),
    );
  }
  if (filtros.perfil) {
    agregar('pf.clave = ?', filtros.perfil);
  }
  if (filtros.rol) {
    agregar('r.nombre = ?', filtros.rol);
  }
  if (filtros.estado) {
    agregar('u.estado_cuenta = ?', filtros.estado);
  }

  const donde = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';
  const resultado = await DbPool.query(
    `${SELECCION_USUARIO} ${donde} ${AGRUPACION_USUARIO}
     ORDER BY u.primer_apellido, u.primer_nombre, u.identificador`,
    parametros,
  );
  return resultado.rows;
}

/**
 * Objetivo: Saber si un correo ya pertenece a otra cuenta, sin importar mayúsculas.
 * @param {string} correo - Correo a revisar.
 * @param {string|null} [excluirUsuarioId] - Cuenta que se está editando.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<boolean>} true si el correo ya está registrado.
 */
async function existeCorreo(correo, excluirUsuarioId = null, cliente = DbPool) {
  const resultado = await cliente.query(
    `SELECT 1 FROM usuario
     WHERE LOWER(correo) = LOWER($1) AND ($2::BIGINT IS NULL OR usuario_id <> $2)`,
    [correo, excluirUsuarioId],
  );
  return resultado.rowCount > 0;
}

/**
 * Objetivo: Registrar una cuenta nueva activa con contraseña temporal (HUGUS02).
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {Object} datos - Datos de la cuenta; nombre y programa vienen de CIAA/Capital Humano.
 * @returns {Promise<string>} Id de la cuenta creada.
 */
async function crearUsuario(cliente, datos) {
  const resultado = await cliente.query(
    `INSERT INTO usuario
       (perfil_id, programa_id, tipo_identificador, identificador, nombre_usuario, matricula,
        primer_nombre, primer_apellido, segundo_apellido, correo, telefono, "contraseña_hash",
        estado_cuenta, debe_cambiar_contrasena, alta_por_usuario_id)
     VALUES ($1, (SELECT programa_id FROM programa_academico WHERE clave = $2), $3::TEXT,
             $4::TEXT, $4::TEXT, CASE WHEN $3::TEXT = 'MATRICULA' THEN $4::TEXT END,
             $5, $6, $7, $8, $9, $10,
             'ACTIVO', TRUE, $11)
     RETURNING usuario_id`,
    [
      datos.perfilId,
      datos.programaClave,
      datos.tipo,
      datos.identificador,
      datos.primerNombre,
      datos.primerApellido,
      datos.segundoApellido,
      datos.correo,
      datos.telefono,
      datos.contrasenaHash,
      datos.altaPorUsuarioId,
    ],
  );
  return resultado.rows[0].usuario_id;
}

/**
 * Objetivo: Bloquear la fila de una cuenta hasta terminar la transacción, para que dos
 *   operadores no la modifiquen al mismo tiempo. Se usa FOR NO KEY UPDATE para no bloquear
 *   las llaves foráneas: la bitácora puede seguir registrando eventos de esta cuenta.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string} usuarioId - Id de la cuenta.
 * @returns {Promise<void>}
 */
async function bloquearUsuario(cliente, usuarioId) {
  await cliente.query('SELECT 1 FROM usuario WHERE usuario_id = $1 FOR NO KEY UPDATE', [usuarioId]);
}

/**
 * Objetivo: Serializar las operaciones que pueden retirar acceso a un administrador (bajas,
 *   cambios y asignaciones de perfil), para no quedarse sin administrador por concurrencia.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @returns {Promise<void>}
 */
async function bloquearCambiosDeAcceso(cliente) {
  await cliente.query('SELECT pg_advisory_xact_lock($1)', [CANDADO_CAMBIOS_ACCESO]);
}

/**
 * Objetivo: Contar administradores activos con todos los permisos de gestión.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string[]} permisosGestion - Claves que debe tener el perfil.
 * @param {Object} [excluir] - Cuentas que no se cuentan porque la operación las cambiará.
 * @param {string} [excluir.usuarioId] - Cuenta que se da de baja o cambia de perfil.
 * @param {string} [excluir.perfilId] - Perfil que se modifica (todas sus cuentas).
 * @returns {Promise<number>} Total de administradores con gestión que quedarían.
 */
async function contarGestores(
  cliente,
  permisosGestion,
  { usuarioId = null, perfilId = null } = {},
) {
  const resultado = await cliente.query(
    `SELECT COUNT(*)::INT AS total
     FROM usuario u
     JOIN perfil pf ON pf.perfil_id = u.perfil_id
     JOIN rol r ON r.rol_id = pf.rol_id
     WHERE u.estado_cuenta = 'ACTIVO' AND pf.activo AND r.activo AND r.nombre = 'Administrador'
       AND ($1::BIGINT IS NULL OR u.usuario_id <> $1)
       AND ($2::BIGINT IS NULL OR pf.perfil_id <> $2)
       AND (SELECT COUNT(*) FROM perfil_permiso pp JOIN permiso p USING (permiso_id)
            WHERE pp.perfil_id = pf.perfil_id AND p.clave = ANY($3::TEXT[]))
           = CARDINALITY($3::TEXT[])`,
    [usuarioId, perfilId, permisosGestion],
  );
  return resultado.rows[0].total;
}

/**
 * Objetivo: Guardar correo, teléfono y perfil de una cuenta en una sola operación (HUGUS04).
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string} usuarioId - Id de la cuenta.
 * @param {{ correo: string, telefono: string|null, perfilId: string }} datos - Valores finales.
 * @returns {Promise<void>}
 */
async function actualizarUsuario(cliente, usuarioId, { correo, telefono, perfilId }) {
  await cliente.query(
    `UPDATE usuario
     SET correo = $2, telefono = $3, perfil_id = $4, fecha_modificacion = NOW()
     WHERE usuario_id = $1`,
    [usuarioId, correo, telefono, perfilId],
  );
}

/**
 * Objetivo: Cambiar el nombre y los apellidos de una cuenta.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string} usuarioId - Id de la cuenta.
 * @param {{ primerNombre: string, primerApellido: string, segundoApellido: string|null }} nombre
 *   - Partes del nombre.
 * @returns {Promise<void>}
 */
async function actualizarNombre(cliente, usuarioId, nombre) {
  await cliente.query(
    `UPDATE usuario
     SET primer_nombre = $2, primer_apellido = $3, segundo_apellido = $4,
         fecha_modificacion = NOW()
     WHERE usuario_id = $1`,
    [usuarioId, nombre.primerNombre, nombre.primerApellido, nombre.segundoApellido],
  );
}

/**
 * Objetivo: Baja lógica: marca la cuenta como inactiva sin borrar datos e invalida todas sus
 *   sesiones abiertas (HUGUS03).
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string} usuarioId - Id de la cuenta.
 * @param {string} motivo - Motivo de la baja.
 * @param {string} operadorId - Id del Administrador que la tramita.
 * @returns {Promise<void>}
 */
async function darDeBajaUsuario(cliente, usuarioId, motivo, operadorId) {
  await cliente.query(
    `UPDATE usuario
     SET estado_cuenta = 'INACTIVO', fecha_baja = NOW(), motivo_baja = $2,
         baja_por_usuario_id = $3, version_sesion = version_sesion + 1,
         fecha_modificacion = NOW()
     WHERE usuario_id = $1`,
    [usuarioId, motivo, operadorId],
  );
}

/**
 * Objetivo: Reactivar una cuenta dada de baja. La baja anterior queda en la bitácora.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string} usuarioId - Id de la cuenta.
 * @returns {Promise<void>}
 */
async function reactivarUsuario(cliente, usuarioId) {
  await cliente.query(
    `UPDATE usuario
     SET estado_cuenta = 'ACTIVO', fecha_baja = NULL, motivo_baja = NULL,
         baja_por_usuario_id = NULL, fecha_modificacion = NOW()
     WHERE usuario_id = $1`,
    [usuarioId],
  );
}

/**
 * Objetivo: Guardar la fecha y hora del último inicio de sesión exitoso.
 * @param {string} usuarioId - Id de la cuenta.
 * @returns {Promise<void>}
 */
async function registrarUltimoAcceso(usuarioId) {
  await DbPool.query('UPDATE usuario SET ultimo_acceso = NOW() WHERE usuario_id = $1', [usuarioId]);
}

/**
 * Objetivo: Guardar una contraseña nueva, quitar la marca de contraseña temporal e invalidar
 *   las sesiones abiertas con la contraseña anterior.
 * @param {string} usuarioId - Id de la cuenta.
 * @param {string} contrasenaHash - Hash bcrypt de la contraseña nueva.
 * @returns {Promise<number>} Versión de sesión nueva, para emitir la cookie actualizada.
 */
async function actualizarContrasena(usuarioId, contrasenaHash) {
  const resultado = await DbPool.query(
    `UPDATE usuario
     SET "contraseña_hash" = $2, debe_cambiar_contrasena = FALSE,
         version_sesion = version_sesion + 1, fecha_modificacion = NOW()
     WHERE usuario_id = $1
     RETURNING version_sesion`,
    [usuarioId, contrasenaHash],
  );
  return resultado.rows[0].version_sesion;
}

export {
  actualizarContrasena,
  obtenerCredenciales,
  obtenerUsuarioAcceso,
  obtenerUsuarioPorIdentificador,
  buscarUsuarios,
  existeCorreo,
  crearUsuario,
  bloquearUsuario,
  bloquearCambiosDeAcceso,
  contarGestores,
  actualizarUsuario,
  actualizarNombre,
  darDeBajaUsuario,
  reactivarUsuario,
  registrarUltimoAcceso,
};
