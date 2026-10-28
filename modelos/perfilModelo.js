/*----
 * Programa: perfilModelo.js
 * Objetivo: Consultas de perfiles: consulta, alta, modificación, desactivación y cuentas
 *           asignadas (HUPRF01)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import DbPool from '../config/db.js';

// Perfil con su rol, política de préstamo, permisos y número de cuentas activas
const SELECCION_PERFIL = `
  SELECT pf.perfil_id, pf.clave, pf.nombre, pf.descripcion, pf.activo, pf.fecha_creacion,
         pf.fecha_modificacion, r.rol_id, r.nombre AS rol_nombre, r.activo AS rol_activo,
         pol.nombre AS politica_nombre, pol.dias_habiles, pol.max_renovaciones,
         uc.identificador AS creado_por_identificador,
         COALESCE(
           ARRAY_AGG(p.clave ORDER BY p.clave) FILTER (WHERE p.clave IS NOT NULL),
           '{}'
         ) AS permisos,
         (SELECT COUNT(*)::INT FROM usuario u
          WHERE u.perfil_id = pf.perfil_id AND u.estado_cuenta = 'ACTIVO') AS cuentas_activas
  FROM perfil pf
  JOIN rol r ON r.rol_id = pf.rol_id
  LEFT JOIN politica_prestamo pol ON pol.politica_prestamo_id = pf.politica_prestamo_id
  LEFT JOIN usuario uc ON uc.usuario_id = pf.creado_por_usuario_id
  LEFT JOIN perfil_permiso pp ON pp.perfil_id = pf.perfil_id
  LEFT JOIN permiso p ON p.permiso_id = pp.permiso_id`;

const AGRUPACION_PERFIL =
  'GROUP BY pf.perfil_id, r.rol_id, pol.politica_prestamo_id, uc.usuario_id';

/**
 * Objetivo: Listar los perfiles, opcionalmente solo activos o solo inactivos.
 * @param {boolean|null} [activo] - Filtro de estado; null para todos.
 * @returns {Promise<Object[]>} Perfiles ordenados por clave.
 */
async function listarPerfiles(activo = null) {
  const resultado = await DbPool.query(
    `${SELECCION_PERFIL}
     WHERE ($1::BOOLEAN IS NULL OR pf.activo = $1)
     ${AGRUPACION_PERFIL}
     ORDER BY pf.clave`,
    [activo],
  );
  return resultado.rows;
}

/**
 * Objetivo: Obtener un perfil por su clave.
 * @param {string} clave - Clave del perfil (ej. PRF-ALU).
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<Object|null>} Perfil con permisos, o null si no existe.
 */
async function obtenerPerfilPorClave(clave, cliente = DbPool) {
  const resultado = await cliente.query(
    `${SELECCION_PERFIL} WHERE pf.clave = $1 ${AGRUPACION_PERFIL}`,
    [clave],
  );
  return resultado.rows[0] || null;
}

/**
 * Objetivo: Obtener el perfil base de un rol, para cuando el front solo indica "Rol asignado".
 *   Es el primer perfil activo registrado para ese rol.
 * @param {string} rolNombre - Nombre del rol tal como lo muestra el front.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<string|null>} Clave del perfil, o null si el rol no tiene perfiles activos.
 */
async function obtenerClavePerfilBaseDeRol(rolNombre, cliente = DbPool) {
  const resultado = await cliente.query(
    `SELECT pf.clave
     FROM perfil pf JOIN rol r ON r.rol_id = pf.rol_id
     WHERE r.nombre = $1 AND pf.activo
     ORDER BY pf.perfil_id
     LIMIT 1`,
    [rolNombre],
  );
  return resultado.rows[0]?.clave ?? null;
}

/**
 * Objetivo: Obtener las cuentas activas que tienen asignado un perfil.
 * @param {string} perfilId - Id del perfil.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<Object[]>} Tipo, identificador y nombre de cada cuenta.
 */
async function obtenerCuentasActivasDePerfil(perfilId, cliente = DbPool) {
  const resultado = await cliente.query(
    `SELECT usuario_id, tipo_identificador, identificador,
            CONCAT_WS(' ', primer_nombre, primer_apellido, segundo_apellido) AS nombre
     FROM usuario
     WHERE perfil_id = $1 AND estado_cuenta = 'ACTIVO'
     ORDER BY identificador`,
    [perfilId],
  );
  return resultado.rows;
}

/**
 * Objetivo: Saber si una clave o un nombre de perfil ya están en uso (sin importar mayúsculas).
 * @param {{ clave?: string, nombre?: string }} valores - Valores a revisar.
 * @param {string|null} [excluirPerfilId] - Perfil que se está editando.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<{ clave: boolean, nombre: boolean }>} Qué valores están duplicados.
 */
async function buscarDuplicados(
  { clave = null, nombre = null },
  excluirPerfilId = null,
  cliente = DbPool,
) {
  const resultado = await cliente.query(
    `SELECT BOOL_OR(UPPER(clave) = UPPER($1)) AS clave,
            BOOL_OR(LOWER(nombre) = LOWER($2)) AS nombre
     FROM perfil
     WHERE $3::BIGINT IS NULL OR perfil_id <> $3`,
    [clave, nombre, excluirPerfilId],
  );
  return { clave: Boolean(resultado.rows[0].clave), nombre: Boolean(resultado.rows[0].nombre) };
}

/**
 * Objetivo: Registrar un perfil activo, sin asignarlo a ninguna cuenta.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {Object} datos - clave, nombre, descripcion, rolId y creadoPorUsuarioId.
 * @returns {Promise<string>} Id del perfil creado.
 */
async function crearPerfil(cliente, { clave, nombre, descripcion, rolId, creadoPorUsuarioId }) {
  const resultado = await cliente.query(
    `INSERT INTO perfil (rol_id, clave, nombre, descripcion, activo, creado_por_usuario_id)
     VALUES ($1, $2, $3, $4, TRUE, $5)
     RETURNING perfil_id`,
    [rolId, clave, nombre, descripcion, creadoPorUsuarioId],
  );
  return resultado.rows[0].perfil_id;
}

/**
 * Objetivo: Reemplazar el rol y los permisos de un perfil. Primero se quitan los permisos para
 *   que el cambio de rol no choque con la matriz del rol anterior.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string} perfilId - Id del perfil.
 * @param {string} rolId - Id del rol nuevo (o el mismo).
 * @param {string[]} permisoIds - Ids de los permisos finales.
 * @returns {Promise<void>}
 * Limitaciones: Si un permiso no está en la matriz del rol, la llave foránea lo rechaza.
 */
async function reemplazarRolYPermisos(cliente, perfilId, rolId, permisoIds) {
  await cliente.query('DELETE FROM perfil_permiso WHERE perfil_id = $1', [perfilId]);
  await cliente.query('UPDATE perfil SET rol_id = $2 WHERE perfil_id = $1', [perfilId, rolId]);
  await cliente.query(
    `INSERT INTO perfil_permiso (perfil_id, rol_id, permiso_id)
     SELECT $1, $2, UNNEST($3::BIGINT[])`,
    [perfilId, rolId, permisoIds],
  );
}

/**
 * Objetivo: Guardar nombre y descripción de un perfil.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string} perfilId - Id del perfil.
 * @param {{ nombre: string, descripcion: string|null }} datos - Valores finales.
 * @returns {Promise<void>}
 */
async function actualizarDatosPerfil(cliente, perfilId, { nombre, descripcion }) {
  await cliente.query(
    `UPDATE perfil SET nombre = $2, descripcion = $3, fecha_modificacion = NOW()
     WHERE perfil_id = $1`,
    [perfilId, nombre, descripcion],
  );
}

/**
 * Objetivo: Desactivar un perfil (ya no se puede asignar). Las asociaciones históricas se
 *   conservan.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string} perfilId - Id del perfil.
 * @returns {Promise<void>}
 */
async function desactivarPerfil(cliente, perfilId) {
  await cliente.query(
    'UPDATE perfil SET activo = FALSE, fecha_modificacion = NOW() WHERE perfil_id = $1',
    [perfilId],
  );
}

/**
 * Objetivo: Bloquear la fila de un perfil hasta terminar la transacción.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string} perfilId - Id del perfil.
 * @returns {Promise<void>}
 */
async function bloquearPerfil(cliente, perfilId) {
  await cliente.query('SELECT 1 FROM perfil WHERE perfil_id = $1 FOR NO KEY UPDATE', [perfilId]);
}

export {
  listarPerfiles,
  obtenerPerfilPorClave,
  obtenerClavePerfilBaseDeRol,
  obtenerCuentasActivasDePerfil,
  buscarDuplicados,
  crearPerfil,
  reemplazarRolYPermisos,
  actualizarDatosPerfil,
  desactivarPerfil,
  bloquearPerfil,
};
