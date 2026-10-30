/*----
 * Programa: ejemplarModelo.js
 * Objetivo: Consultas de ejemplares físicos: alta, clasificación y ubicación, baja sin borrar
 *           e historial de movimientos (HULIB01-03)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import DbPool from '../config/db.js';

// Ejemplar con los datos de su ficha que lleva la etiqueta
const SELECCION_EJEMPLAR = `
  SELECT ej.ejemplar_id, ej.codigo_ejemplar, ej.clave_clasificacion, ej.librero, ej.fila,
         ej.estado, ej.fecha_alta, ej.fecha_baja, ej.motivo_baja, ej.detalle_baja,
         ub.identificador AS baja_por_identificador,
         tu.tipo_uso_id, tu.nombre AS tipo_uso, tu.permite_prestamo,
         l.libro_id, l.clave_libro, l.titulo, l.estado AS estado_libro,
         COALESCE(
           (SELECT ARRAY_AGG(CONCAT_WS(' ', a.primer_nombre, a.primer_apellido) ORDER BY af.orden)
            FROM autoria_ficha af JOIN autor a ON a.autor_id = af.autor_id
            WHERE af.libro_id = l.libro_id),
           '{}'
         ) AS autores
  FROM ejemplar ej
  JOIN libro l ON l.libro_id = ej.libro_id
  JOIN tipo_uso tu ON tu.tipo_uso_id = ej.tipo_uso_id
  LEFT JOIN usuario ub ON ub.usuario_id = ej.baja_por_usuario_id`;

/**
 * Objetivo: Obtener un ejemplar por su Clave de ejemplar.
 * @param {string} clave - Clave de ejemplar normalizada.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<Object|null>} Ejemplar, o null si no existe.
 */
async function obtenerEjemplarPorClave(clave, cliente = DbPool) {
  const resultado = await cliente.query(`${SELECCION_EJEMPLAR} WHERE ej.codigo_ejemplar = $1`, [
    clave,
  ]);
  return resultado.rows[0] || null;
}

/**
 * Objetivo: Listar los ejemplares de una ficha en orden de clave.
 * @param {string} libroId - Id de la ficha.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<Object[]>} Ejemplares con estado y ubicación.
 */
async function listarEjemplaresDeLibro(libroId, cliente = DbPool) {
  const resultado = await cliente.query(
    `${SELECCION_EJEMPLAR} WHERE ej.libro_id = $1 ORDER BY ej.codigo_ejemplar`,
    [libroId],
  );
  return resultado.rows;
}

/**
 * Objetivo: Obtener las claves de ejemplar que ya existen entre las indicadas.
 * @param {string[]} claves - Claves a revisar.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<string[]>} Claves ya registradas.
 */
async function obtenerClavesExistentes(claves, cliente = DbPool) {
  const resultado = await cliente.query(
    'SELECT codigo_ejemplar FROM ejemplar WHERE codigo_ejemplar = ANY($1::TEXT[])',
    [claves],
  );
  return resultado.rows.map((fila) => fila.codigo_ejemplar);
}

/**
 * Objetivo: Obtener las claves de ejemplar de una ficha con el formato "<clave>-E<número>",
 *   para continuar la numeración automática.
 * @param {string} libroId - Id de la ficha.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<string[]>} Claves de ejemplar de la ficha.
 */
async function listarClavesDeLibro(libroId, cliente = DbPool) {
  const resultado = await cliente.query(
    'SELECT codigo_ejemplar FROM ejemplar WHERE libro_id = $1',
    [libroId],
  );
  return resultado.rows.map((fila) => fila.codigo_ejemplar);
}

/**
 * Objetivo: Registrar un ejemplar disponible con su clasificación y ubicación.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {Object} datos - libroId, tipoUsoId, clave, clasificacion, librero y fila.
 * @returns {Promise<string>} Id del ejemplar.
 */
async function crearEjemplar(cliente, datos) {
  const resultado = await cliente.query(
    `INSERT INTO ejemplar
       (libro_id, tipo_uso_id, codigo_ejemplar, clave_clasificacion, librero, fila, estado)
     VALUES ($1, $2, $3, $4, $5, $6, 'DISPONIBLE')
     RETURNING ejemplar_id`,
    [datos.libroId, datos.tipoUsoId, datos.clave, datos.clasificacion, datos.librero, datos.fila],
  );
  return resultado.rows[0].ejemplar_id;
}

/**
 * Objetivo: Guardar clasificación, ubicación y tipo de uso de un ejemplar. Clave y estado no
 *   cambian.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string} ejemplarId - Id del ejemplar.
 * @param {Object} datos - clasificacion, librero, fila y tipoUsoId finales.
 * @returns {Promise<void>}
 */
async function actualizarEjemplar(
  cliente,
  ejemplarId,
  { clasificacion, librero, fila, tipoUsoId },
) {
  await cliente.query(
    `UPDATE ejemplar
     SET clave_clasificacion = $2, librero = $3, fila = $4, tipo_uso_id = $5
     WHERE ejemplar_id = $1`,
    [ejemplarId, clasificacion, librero, fila, tipoUsoId],
  );
}

/**
 * Objetivo: Dar de baja un ejemplar sin borrarlo: guarda estado, motivo, fecha y operador.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string} ejemplarId - Id del ejemplar.
 * @param {Object} datos - motivo (clave), detalle y operadorId.
 * @returns {Promise<void>}
 */
async function darDeBajaEjemplar(cliente, ejemplarId, { motivo, detalle, operadorId }) {
  await cliente.query(
    `UPDATE ejemplar
     SET estado = 'DADO_DE_BAJA', fecha_baja = NOW(), motivo_baja = $2, detalle_baja = $3,
         baja_por_usuario_id = $4
     WHERE ejemplar_id = $1`,
    [ejemplarId, motivo, detalle, operadorId],
  );
}

/**
 * Objetivo: Saber si un ejemplar tiene un préstamo abierto.
 * @param {string} ejemplarId - Id del ejemplar.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<string|null>} Folio del préstamo activo, o null.
 */
async function obtenerFolioPrestamoActivo(ejemplarId, cliente = DbPool) {
  const resultado = await cliente.query(
    `SELECT folio FROM prestamo WHERE ejemplar_id = $1 AND estado = 'ACTIVO' LIMIT 1`,
    [ejemplarId],
  );
  return resultado.rows[0]?.folio ?? null;
}

/**
 * Objetivo: Registrar un movimiento en el historial del ejemplar.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {Object} movimiento - ejemplarId, operadorId, tipo, motivo?, observaciones?,
 *   anterior? y nuevo?.
 * @returns {Promise<void>}
 */
async function registrarMovimiento(cliente, movimiento) {
  await cliente.query(
    `INSERT INTO movimiento_ejemplar
       (ejemplar_id, operador_usuario_id, tipo, motivo, observaciones, valores_anteriores,
        valores_nuevos)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      movimiento.ejemplarId,
      movimiento.operadorId,
      movimiento.tipo,
      movimiento.motivo ?? null,
      movimiento.observaciones ?? null,
      movimiento.anterior ?? null,
      movimiento.nuevo ?? null,
    ],
  );
}

/**
 * Objetivo: Obtener el historial de movimientos de todos los ejemplares de una ficha.
 * @param {string} libroId - Id de la ficha.
 * @returns {Promise<Object[]>} Movimientos del más reciente al más antiguo.
 */
async function listarHistorialDeLibro(libroId) {
  const resultado = await DbPool.query(
    `SELECT m.fecha_movimiento, m.tipo, m.motivo, m.observaciones, m.valores_anteriores,
            m.valores_nuevos, ej.codigo_ejemplar, u.identificador AS operador
     FROM movimiento_ejemplar m
     JOIN ejemplar ej ON ej.ejemplar_id = m.ejemplar_id
     JOIN usuario u ON u.usuario_id = m.operador_usuario_id
     WHERE ej.libro_id = $1
     ORDER BY m.fecha_movimiento DESC, m.movimiento_ejemplar_id DESC`,
    [libroId],
  );
  return resultado.rows;
}

/**
 * Objetivo: Bloquear la fila de un ejemplar hasta terminar la transacción.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string} ejemplarId - Id del ejemplar.
 * @returns {Promise<void>}
 */
async function bloquearEjemplar(cliente, ejemplarId) {
  await cliente.query('SELECT 1 FROM ejemplar WHERE ejemplar_id = $1 FOR NO KEY UPDATE', [
    ejemplarId,
  ]);
}

export {
  obtenerEjemplarPorClave,
  listarEjemplaresDeLibro,
  obtenerClavesExistentes,
  listarClavesDeLibro,
  crearEjemplar,
  actualizarEjemplar,
  darDeBajaEjemplar,
  obtenerFolioPrestamoActivo,
  registrarMovimiento,
  listarHistorialDeLibro,
  bloquearEjemplar,
};
