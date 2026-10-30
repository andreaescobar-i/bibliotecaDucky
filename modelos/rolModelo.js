/*----
 * Programa: rolModelo.js
 * Objetivo: Consultas de roles y de la matriz rol-permiso (HUPRF01)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import DbPool from '../config/db.js';

/**
 * Objetivo: Listar los roles con los permisos que la matriz permite a sus perfiles. Lo usa el
 *   formulario de perfiles para ofrecer solo permisos compatibles.
 * @returns {Promise<Object[]>} Roles con permisos permitidos [{ clave, nombre, modulo }].
 */
async function listarRolesConMatriz() {
  const resultado = await DbPool.query(
    `SELECT r.nombre, r.descripcion, r.activo,
            COALESCE(
              JSON_AGG(JSON_BUILD_OBJECT('clave', p.clave, 'nombre', p.nombre, 'modulo', p.modulo)
                       ORDER BY p.modulo, p.clave)
                FILTER (WHERE p.clave IS NOT NULL),
              '[]'
            ) AS permisos_permitidos
     FROM rol r
     LEFT JOIN rol_permiso rp ON rp.rol_id = r.rol_id
     LEFT JOIN permiso p ON p.permiso_id = rp.permiso_id
     GROUP BY r.rol_id
     ORDER BY r.rol_id`,
  );
  return resultado.rows;
}

/**
 * Objetivo: Obtener un rol por nombre con las claves de permisos que permite su matriz.
 * @param {string} nombre - Nombre del rol.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<{ rol_id: string, nombre: string, activo: boolean,
 *   permisos_permitidos: string[] }|null>} Rol, o null si no existe.
 */
async function obtenerRolPorNombre(nombre, cliente = DbPool) {
  const resultado = await cliente.query(
    `SELECT r.rol_id, r.nombre, r.activo,
            COALESCE(ARRAY_AGG(p.clave) FILTER (WHERE p.clave IS NOT NULL), '{}')
              AS permisos_permitidos
     FROM rol r
     LEFT JOIN rol_permiso rp ON rp.rol_id = r.rol_id
     LEFT JOIN permiso p ON p.permiso_id = rp.permiso_id
     WHERE r.nombre = $1
     GROUP BY r.rol_id`,
    [nombre],
  );
  return resultado.rows[0] || null;
}

/**
 * Objetivo: Obtener los ids de permisos a partir de sus claves.
 * @param {string[]} claves - Claves de permisos.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<{ permiso_id: string, clave: string }[]>} Permisos encontrados.
 */
async function obtenerPermisosPorClaves(claves, cliente = DbPool) {
  const resultado = await cliente.query(
    'SELECT permiso_id, clave FROM permiso WHERE clave = ANY($1::TEXT[])',
    [claves],
  );
  return resultado.rows;
}

export { listarRolesConMatriz, obtenerRolPorNombre, obtenerPermisosPorClaves };
