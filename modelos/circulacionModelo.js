import { randomUUID } from 'node:crypto';
import db, { ejecutarTransaccion } from '../config/db.js';
import ErrorAplicacion from '../utilidades/errorAplicacion.js';
import { consultarVigencia } from '../servicios/identidadInstitucionalServicio.js';
import { enviarSolicitud } from '../servicios/tesoreriaServicio.js';

const ZONA = 'America/Monterrey';
const TARIFA = 10;
const MAX_PRESTAMOS = 2;
const SELECT = `SELECT p.folio, p.estado, p.fecha_prestamo, p.fecha_vencimiento,
  e.codigo_ejemplar, l.titulo, l.clave_libro, u.identificador, u.correo, u.telefono,
  concat_ws(' ',u.primer_nombre,u.primer_apellido,u.segundo_apellido) AS nombre,
  d.fecha_devolucion
  FROM prestamo p JOIN ejemplar e USING(ejemplar_id) JOIN libro l USING(libro_id)
  JOIN usuario u ON u.usuario_id=p.usuario_id LEFT JOIN devolucion d USING(prestamo_id)`;

const one = async (q, sql, args) => (await q.query(sql, args)).rows[0];
function exigir(condicion, mensaje, estado = 409) {
  if (!condicion) {
    throw new ErrorAplicacion(estado, mensaje);
  }
}

async function cuenta(q, identificador) {
  const u = await one(
    q,
    `SELECT u.*, pp.dias_habiles, pp.politica_prestamo_id
    FROM usuario u JOIN perfil f USING(perfil_id) JOIN rol r USING(rol_id)
    JOIN politica_prestamo pp ON pp.politica_prestamo_id=f.politica_prestamo_id
    WHERE u.identificador=$1 AND u.estado_cuenta='ACTIVO' AND f.activo AND r.activo
      AND pp.activo AND pp.vigente_desde<=CURRENT_DATE FOR UPDATE OF u`,
    [identificador],
  );
  exigir(u, 'La cuenta no está activa o no tiene política de préstamo.', 404);
  exigir(
    await consultarVigencia(u.tipo_identificador, u.identificador, q),
    'La cuenta no tiene vigencia institucional.',
  );
  return u;
}

async function restricciones(q, usuarioId) {
  const r = await one(
    q,
    `SELECT
    (SELECT count(*)::int FROM prestamo WHERE usuario_id=$1 AND estado='ACTIVO') AS activos,
    EXISTS (SELECT 1 FROM prestamo WHERE usuario_id=$1 AND estado='ACTIVO' AND fecha_vencimiento<now()) AS vencido,
    EXISTS (SELECT 1 FROM prestamo p JOIN adeudo a USING(prestamo_id)
      WHERE p.usuario_id=$1 AND a.estado='PENDIENTE' AND NOT EXISTS (SELECT 1 FROM pago WHERE adeudo_id=a.adeudo_id)) AS adeudo,
    EXISTS (SELECT 1 FROM suspension WHERE usuario_id=$1 AND fecha_inicio<=now()
      AND (fecha_fin IS NULL OR fecha_fin>now())) AS suspendido`,
    [usuarioId],
  );
  exigir(
    !r.vencido && !r.adeudo && !r.suspendido,
    'La cuenta tiene préstamos vencidos, adeudos o una suspensión vigente.',
  );
  return r.activos;
}

const fechaHabil = `(SELECT ((dia::date + TIME '23:59:59') AT TIME ZONE '${ZONA}')
  FROM generate_series(($1::timestamptz AT TIME ZONE '${ZONA}')::date + 1,
      ($1::timestamptz AT TIME ZONE '${ZONA}')::date + ($2::int * 2 + 7), INTERVAL '1 day') AS dia
  WHERE extract(isodow FROM dia)<6 ORDER BY dia OFFSET ($2::int - 1) LIMIT 1)`;

const lockLibro = (q, id) =>
  one(q, 'SELECT libro_id,estado FROM libro WHERE libro_id=$1 FOR UPDATE', [id]);
const primero = (q, id) =>
  one(
    q,
    `SELECT * FROM lista_espera WHERE libro_id=$1 AND estatus='PENDIENTE'
  ORDER BY posicion_cola, espera_id LIMIT 1`,
    [id],
  );

export function prestar({ identificador, ejemplar }, operador) {
  return ejecutarTransaccion(async (q) => {
    const ref = await one(q, 'SELECT libro_id FROM ejemplar WHERE codigo_ejemplar=$1', [ejemplar]);
    exigir(ref, 'Ejemplar no encontrado.', 404);
    const libro = await lockLibro(q, ref.libro_id);
    exigir(libro?.estado === 'ACTIVO', 'La ficha del ejemplar no está activa.');
    const e = await one(
      q,
      `SELECT e.*, t.permite_prestamo FROM ejemplar e JOIN tipo_uso t USING(tipo_uso_id)
      WHERE e.codigo_ejemplar=$1 FOR UPDATE OF e`,
      [ejemplar],
    );
    exigir(
      e.estado === 'DISPONIBLE' && e.permite_prestamo,
      'El ejemplar no está disponible para préstamo externo.',
    );
    const u = await cuenta(q, identificador);
    exigir(
      (await restricciones(q, u.usuario_id)) < MAX_PRESTAMOS,
      'La cuenta ya alcanzó el límite de dos préstamos.',
    );
    const turno = await primero(q, e.libro_id);
    exigir(
      !turno || turno.usuario_id === u.usuario_id,
      'Hay otro usuario primero en la lista de espera.',
    );
    const folio = 'PRE-' + randomUUID().toUpperCase();
    const { vencimiento } = await one(q, `SELECT ${fechaHabil} AS vencimiento`, [
      new Date(),
      u.dias_habiles,
    ]);
    await q.query(
      `INSERT INTO prestamo (usuario_id, ejemplar_id, bibliotecario_usuario_id,
      politica_prestamo_id, folio, fecha_vencimiento, estado) VALUES ($1,$2,$3,$4,$5,$6,'ACTIVO')`,
      [u.usuario_id, e.ejemplar_id, operador, u.politica_prestamo_id, folio, vencimiento],
    );
    await q.query("UPDATE ejemplar SET estado='PRESTADO' WHERE ejemplar_id=$1", [e.ejemplar_id]);
    await q.query(
      "INSERT INTO movimiento_ejemplar (ejemplar_id,operador_usuario_id,tipo,motivo) VALUES ($1,$2,'PRESTAMO',$3)",
      [e.ejemplar_id, operador, folio],
    );
    if (turno) {
      await q.query("UPDATE lista_espera SET estatus='ATENDIDA' WHERE espera_id=$1", [
        turno.espera_id,
      ]);
    }
    return one(q, SELECT + ' WHERE p.folio=$1', [folio]);
  });
}

export function esperar(clave, identificador) {
  return ejecutarTransaccion(async (q) => {
    const l = await one(
      q,
      "SELECT libro_id FROM libro WHERE clave_libro=$1 AND estado='ACTIVO' FOR UPDATE",
      [clave],
    );
    exigir(l, 'Libro no encontrado.', 404);
    const u = await cuenta(q, identificador);
    const { prestados, disponibles } = await one(
      q,
      `SELECT
      count(*) FILTER (WHERE e.estado='PRESTADO')::int AS prestados,
      count(*) FILTER (WHERE e.estado='DISPONIBLE')::int AS disponibles
      FROM ejemplar e JOIN tipo_uso t USING(tipo_uso_id) WHERE libro_id=$1 AND t.permite_prestamo`,
      [l.libro_id],
    );
    const inscrito = await one(
      q,
      "SELECT espera_id FROM lista_espera WHERE libro_id=$1 AND usuario_id=$2 AND estatus='PENDIENTE'",
      [l.libro_id, u.usuario_id],
    );
    exigir(!inscrito, 'El usuario ya está en la lista de espera de este libro.');
    const propio = await one(
      q,
      `SELECT 1 FROM prestamo p JOIN ejemplar e USING(ejemplar_id)
      WHERE p.usuario_id=$1 AND e.libro_id=$2 AND p.estado='ACTIVO'`,
      [u.usuario_id, l.libro_id],
    );
    exigir(!propio, 'El usuario ya tiene un ejemplar de este libro en préstamo.');
    const turno = await primero(q, l.libro_id);
    exigir(
      turno || (prestados > 0 && disponibles === 0),
      'La lista procede cuando los ejemplares de préstamo externo están ocupados.',
    );
    await q.query(
      `INSERT INTO lista_espera (usuario_id,libro_id,posicion_cola,estatus)
      SELECT $1,$2,COALESCE(max(posicion_cola),0)+1,'PENDIENTE' FROM lista_espera WHERE libro_id=$2`,
      [u.usuario_id, l.libro_id],
    );
    const { posicion } = await one(
      q,
      "SELECT count(*)::int AS posicion FROM lista_espera WHERE libro_id=$1 AND estatus='PENDIENTE'",
      [l.libro_id],
    );
    return { posicion };
  });
}

async function prestamoActivo(q, folio) {
  const ref = await one(
    q,
    'SELECT e.libro_id FROM prestamo p JOIN ejemplar e USING(ejemplar_id) WHERE p.folio=$1',
    [folio],
  );
  exigir(ref, 'Préstamo no encontrado.', 404);
  await lockLibro(q, ref.libro_id);
  const p = await one(
    q,
    `SELECT p.*,e.libro_id, u.identificador, pp.dias_habiles, pp.max_renovaciones
    FROM prestamo p JOIN ejemplar e USING(ejemplar_id) JOIN usuario u USING(usuario_id)
    JOIN politica_prestamo pp USING(politica_prestamo_id) WHERE p.folio=$1 FOR UPDATE OF p,e`,
    [folio],
  );
  exigir(p.estado === 'ACTIVO', 'El préstamo ya no está activo.');
  return p;
}

export function renovar(folio, operador) {
  return ejecutarTransaccion(async (q) => {
    const p = await prestamoActivo(q, folio);
    await cuenta(q, p.identificador);
    await restricciones(q, p.usuario_id);
    exigir(!(await primero(q, p.libro_id)), 'No se puede renovar: hay una lista de espera.');
    const { total } = await one(
      q,
      'SELECT count(*)::int AS total FROM renovacion WHERE prestamo_id=$1',
      [p.prestamo_id],
    );
    exigir(total < p.max_renovaciones, 'Se alcanzó el máximo de renovaciones.');
    const { vencimiento } = await one(q, `SELECT ${fechaHabil} AS vencimiento`, [
      p.fecha_vencimiento,
      p.dias_habiles,
    ]);
    await q.query(
      `INSERT INTO renovacion (prestamo_id,autorizador_usuario_id,numero_renovacion,
      vencimiento_anterior,vencimiento_nuevo) VALUES ($1,$2,$3,$4,$5)`,
      [p.prestamo_id, operador, total + 1, p.fecha_vencimiento, vencimiento],
    );
    await q.query('UPDATE prestamo SET fecha_vencimiento=$2 WHERE prestamo_id=$1', [
      p.prestamo_id,
      vencimiento,
    ]);
    return one(q, SELECT + ' WHERE p.folio=$1', [folio]);
  });
}

export function devolver(folio, condicion, observaciones, operador) {
  return ejecutarTransaccion(async (q) => {
    const p = await prestamoActivo(q, folio);
    await q.query('SELECT usuario_id FROM usuario WHERE usuario_id=$1 FOR UPDATE', [p.usuario_id]);
    await q.query(
      `INSERT INTO devolucion (prestamo_id,bibliotecario_usuario_id,condicion,observaciones)
      VALUES ($1,$2,$3,$4)`,
      [p.prestamo_id, operador, condicion, observaciones],
    );
    await q.query("UPDATE prestamo SET estado='DEVUELTO' WHERE prestamo_id=$1", [p.prestamo_id]);
    await q.query('UPDATE ejemplar SET estado=$2 WHERE ejemplar_id=$1', [
      p.ejemplar_id,
      condicion === 'Buen estado' ? 'DISPONIBLE' : 'EN_REVISION',
    ]);
    await q.query(
      "INSERT INTO movimiento_ejemplar (ejemplar_id,operador_usuario_id,tipo,motivo,observaciones) VALUES ($1,$2,'DEVOLUCION',$3,$4)",
      [p.ejemplar_id, operador, folio, observaciones],
    );
    const { dias } = await one(
      q,
      `SELECT count(*)::int AS dias FROM generate_series(
      ($1::timestamptz AT TIME ZONE '${ZONA}')::date + 1,
      (now() AT TIME ZONE '${ZONA}')::date, INTERVAL '1 day') AS dia
      WHERE extract(isodow FROM dia)<6`,
      [p.fecha_vencimiento],
    );
    let multa = null;
    if (dias) {
      multa = await one(
        q,
        `INSERT INTO adeudo(prestamo_id,tipo,concepto,monto_mxn,estado)
        VALUES ($1,'MULTA','Devolución tardía',$2,'PENDIENTE') RETURNING adeudo_id,monto_mxn`,
        [p.prestamo_id, dias * TARIFA],
      );
      await q.query('INSERT INTO multa (adeudo_id,dias_habiles,tarifa_mxn) VALUES ($1,$2,$3)', [
        multa.adeudo_id,
        dias,
        TARIFA,
      ]);
    }
    return {
      prestamo: await one(q, SELECT + ' WHERE p.folio=$1', [folio]),
      multa,
      hayEspera: Boolean(await primero(q, p.libro_id)),
    };
  });
}

export function remitirMulta(id) {
  return ejecutarTransaccion(async (q) => {
    const a = await one(
      q,
      `SELECT a.*,p.folio,u.identificador FROM adeudo a JOIN prestamo p USING(prestamo_id)
      JOIN usuario u USING(usuario_id) WHERE adeudo_id=$1 AND tipo='MULTA' FOR UPDATE OF a`,
      [id],
    );
    exigir(a, 'Multa no encontrada.', 404);
    if (a.acuse_tesoreria) {
      return a;
    }
    exigir(a.estado === 'PENDIENTE', 'No hay una multa pendiente para remitir.');
    const envio = await enviarSolicitud({
      ...a,
      folio: 'MULTA-' + id,
      tipo: 'MULTA',
      folioPrestamo: a.folio,
    });
    exigir(
      envio.confirmado && envio.acuse,
      'Tesorería no confirmó el envío. Puede reintentarlo desde Multas.',
      502,
    );
    return one(
      q,
      `UPDATE adeudo SET acuse_tesoreria=$2,fecha_envio_tesoreria=now()
      WHERE adeudo_id=$1 RETURNING *`,
      [id, envio.acuse],
    );
  });
}

export async function buscar(folio) {
  const p = await one(db, SELECT + ' WHERE p.folio=$1', [folio]);
  exigir(p, 'Préstamo no encontrado.', 404);
  return p;
}

const MULTAS = `SELECT a.adeudo_id,a.tipo,a.concepto,a.monto_mxn,a.estado,a.acuse_tesoreria,
  a.fecha_envio_tesoreria,p.folio,l.titulo FROM adeudo a JOIN prestamo p USING(prestamo_id)
  JOIN ejemplar e USING(ejemplar_id) JOIN libro l USING(libro_id)`;

export async function multas(folio) {
  return (
    await db.query(
      MULTAS +
        " WHERE a.tipo='MULTA' AND ($1='' OR p.folio=$1) ORDER BY a.adeudo_id DESC LIMIT 100",
      [folio],
    )
  ).rows;
}

export async function miCuenta(id) {
  const [prestamos, adeudos, espera] = await Promise.all([
    db.query(
      `SELECT p.folio,p.estado,p.fecha_prestamo,p.fecha_vencimiento,d.fecha_devolucion,l.titulo,e.codigo_ejemplar
      FROM prestamo p JOIN ejemplar e USING(ejemplar_id) JOIN libro l USING(libro_id)
      LEFT JOIN devolucion d USING(prestamo_id) WHERE p.usuario_id=$1 ORDER BY p.fecha_prestamo DESC`,
      [id],
    ),
    db.query(MULTAS + ' WHERE p.usuario_id=$1 ORDER BY a.adeudo_id DESC', [id]),
    db.query(
      `SELECT l.titulo,w.estatus,(SELECT count(*)::int FROM lista_espera a
      WHERE a.libro_id=w.libro_id AND a.estatus='PENDIENTE' AND a.posicion_cola<=w.posicion_cola) AS posicion
      FROM lista_espera w JOIN libro l USING(libro_id) WHERE w.usuario_id=$1 AND w.estatus='PENDIENTE'
      ORDER BY w.fecha_solicitud`,
      [id],
    ),
  ]);
  return { prestamos: prestamos.rows, adeudos: adeudos.rows, espera: espera.rows };
}
