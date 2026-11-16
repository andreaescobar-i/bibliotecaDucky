import db, { ejecutarTransaccion } from '../config/db.js';
import ErrorAplicacion from '../utilidades/errorAplicacion.js';
import { avisarEscolares } from '../servicios/avisoInstitucional.js';

const zone = 'America/Monterrey';
const one = async (q, sql, args) => (await q.query(sql, args)).rows[0];

const INVENTARIO = `WITH seleccion AS (
  SELECT e.ejemplar_id,e.codigo_ejemplar,e.estado,e.librero,e.fila,l.titulo,c.nombre AS tema
  FROM ejemplar e JOIN libro l USING(libro_id) JOIN categoria c USING(categoria_id)
  WHERE ($2='' OR c.nombre=$2) AND ($3='' OR e.librero=$3)
), limites AS (
  SELECT ($1::date::timestamp AT TIME ZONE '${zone}') AS inicio,
    (($1::date + INTERVAL '1 month') AT TIME ZONE '${zone}') AS fin
)`;

export async function inventario(periodo, tema, estante) {
  const args = [periodo + '-01', tema, estante];
  return one(
    db,
    INVENTARIO +
      `,
  operaciones AS (
    SELECT p.* FROM prestamo p JOIN seleccion s USING(ejemplar_id) CROSS JOIN limites lm
    WHERE p.fecha_prestamo>=lm.inicio AND p.fecha_prestamo<lm.fin
  ), vencidos AS (
    SELECT p.folio,s.titulo,s.codigo_ejemplar,u.identificador,p.fecha_vencimiento
    FROM prestamo p JOIN seleccion s USING(ejemplar_id) JOIN usuario u USING(usuario_id)
    WHERE p.estado='ACTIVO' AND p.fecha_vencimiento<now()
  )
  SELECT (SELECT count(*)::int FROM seleccion WHERE estado<>'DADO_DE_BAJA') AS existencia,
    (SELECT count(*)::int FROM seleccion WHERE estado='PRESTADO') AS prestados,
    (SELECT count(*)::int FROM operaciones) AS prestamos_periodo,
    (SELECT count(*)::int FROM vencidos) AS vencidos,
    (SELECT count(*)::int FROM adeudo a JOIN prestamo p USING(prestamo_id)
      JOIN seleccion s USING(ejemplar_id) CROSS JOIN limites lm
      WHERE a.tipo='MULTA' AND a.fecha_emision>=lm.inicio AND a.fecha_emision<lm.fin) AS multas_periodo,
    ARRAY(SELECT nombre FROM categoria ORDER BY nombre) AS temas,
    ARRAY(SELECT DISTINCT librero FROM ejemplar WHERE librero IS NOT NULL ORDER BY librero) AS estantes,
    COALESCE((SELECT json_agg(g) FROM (SELECT estado,count(*)::int AS cantidad FROM seleccion GROUP BY estado ORDER BY estado) g),'[]') AS por_estado,
    COALESCE((SELECT json_agg(g) FROM (SELECT tema,count(*)::int AS cantidad FROM seleccion
      WHERE estado<>'DADO_DE_BAJA' GROUP BY tema ORDER BY tema) g),'[]') AS por_tema,
    COALESCE((SELECT json_agg(g) FROM (SELECT * FROM vencidos ORDER BY fecha_vencimiento,folio) g),'[]') AS detalle_vencidos,
    COALESCE((SELECT json_agg(g) FROM (SELECT * FROM seleccion ORDER BY codigo_ejemplar) g),'[]') AS ejemplares`,
    args,
  );
}

const DEUDORES = `WITH vencidos AS (
  SELECT usuario_id,count(*)::int AS vencidos FROM prestamo
  WHERE estado='ACTIVO' AND fecha_vencimiento<now() GROUP BY usuario_id
), montos AS (
  SELECT p.usuario_id,coalesce(sum(monto_mxn) FILTER (WHERE tipo='MULTA'),0) AS multas,
    coalesce(sum(monto_mxn) FILTER (WHERE tipo='REPOSICION'),0) AS reposicion
  FROM adeudo a JOIN prestamo p USING(prestamo_id)
  WHERE a.estado='PENDIENTE' AND NOT EXISTS(SELECT 1 FROM pago pg WHERE pg.adeudo_id=a.adeudo_id)
  GROUP BY p.usuario_id
), alumnos AS (
  SELECT u.usuario_id,u.identificador,concat_ws(' ',u.primer_nombre,u.primer_apellido,u.segundo_apellido) AS nombre,
    COALESCE(g.nombre,'Sin programa') AS programa,u.estatus_escolar,coalesce(v.vencidos,0) AS vencidos,
    coalesce(m.multas,0) AS multas,coalesce(m.reposicion,0) AS reposicion,
    s.suspension_id,s.motivo,s.fecha_inicio,
    (SELECT max(rr.fecha_notificacion) FROM detalle_reporte dd JOIN reporte_deudores rr USING(reporte_deudores_id)
      WHERE dd.usuario_id=u.usuario_id AND rr.modo_envio='REAL') AS ultimo_aviso
  FROM usuario u JOIN perfil f USING(perfil_id) JOIN rol r USING(rol_id)
  LEFT JOIN programa_academico g USING(programa_id) LEFT JOIN vencidos v USING(usuario_id) LEFT JOIN montos m USING(usuario_id)
  LEFT JOIN LATERAL (SELECT suspension_id,motivo,fecha_inicio FROM suspension
     WHERE usuario_id=u.usuario_id AND fecha_inicio<=now() AND (fecha_fin IS NULL OR fecha_fin>now())
     ORDER BY fecha_inicio DESC,suspension_id DESC LIMIT 1) s ON true
  WHERE r.nombre='Alumno' AND (u.estado_cuenta='ACTIVO' OR s.suspension_id IS NOT NULL)
) SELECT * FROM alumnos WHERE vencidos>0 OR multas>0 OR reposicion>0 OR suspension_id IS NOT NULL`;

export async function deudores() {
  return (await db.query(DEUDORES + ' ORDER BY programa,nombre,identificador')).rows;
}

async function obtenerCorte(q, id) {
  const corte = await one(
    q,
    `SELECT reporte_deudores_id,periodo,fecha_corte,fecha_notificacion,acuse_escolares,modo_envio
    FROM reporte_deudores WHERE reporte_deudores_id=$1`,
    [id],
  );
  if (!corte) {
    throw new ErrorAplicacion(404, 'Corte no encontrado.');
  }
  const detalle = (
    await q.query(
      `SELECT identificador_snapshot AS identificador,nombre_snapshot AS nombre,
    programa_snapshot AS programa,multas_mxn_snapshot AS multas,reposicion_mxn_snapshot AS reposicion,
    prestamos_vencidos_snapshots AS vencidos,suspendido_snapshot AS suspendido
    FROM detalle_reporte WHERE reporte_deudores_id=$1 ORDER BY programa,nombre,identificador`,
      [id],
    )
  ).rows;
  return { ...corte, detalle };
}

export async function ultimoCorte() {
  const row = await one(
    db,
    'SELECT reporte_deudores_id FROM reporte_deudores ORDER BY fecha_corte DESC,reporte_deudores_id DESC LIMIT 1',
  );
  return row ? obtenerCorte(db, row.reporte_deudores_id) : null;
}

export function generarCorte(periodo, actor) {
  return ejecutarTransaccion(async (q) => {
    const { reporte_deudores_id: id } = await one(
      q,
      `INSERT INTO reporte_deudores(fecha_corte,periodo,operador_usuario_id)
      VALUES(now(),$1,$2) RETURNING reporte_deudores_id`,
      [periodo, actor],
    );
    await q.query(
      `INSERT INTO detalle_reporte(reporte_deudores_id,usuario_id,nombre_snapshot,identificador_snapshot,programa_snapshot,
      multas_mxn_snapshot,reposicion_mxn_snapshot,prestamos_vencidos_snapshots,suspendido_snapshot,estado_notificacion)
      SELECT $1,usuario_id,nombre,identificador,programa,multas,reposicion,vencidos,suspension_id IS NOT NULL,'PENDIENTE'
      FROM (${DEUDORES}) AS alumnos`,
      [id],
    );
    return obtenerCorte(q, id);
  });
}

export function enviarCorte(id) {
  return ejecutarTransaccion(async (q) => {
    await q.query(
      'SELECT reporte_deudores_id FROM reporte_deudores WHERE reporte_deudores_id=$1 FOR UPDATE',
      [id],
    );
    const corte = await obtenerCorte(q, id);
    if (
      corte.acuse_escolares &&
      !(corte.modo_envio === 'SIMULADO' && process.env.ESCOLARES_WEBHOOK_URL)
    ) {
      return corte;
    }
    if (!corte.detalle.length) {
      throw new ErrorAplicacion(409, 'El corte está vacío.');
    }
    let envio;
    try {
      envio = await avisarEscolares({
        tipo: 'REPORTE_DEUDORES',
        folio: 'DEUDORES-' + id,
        periodo: corte.periodo,
        fechaCorte: corte.fecha_corte,
        detalle: corte.detalle,
      });
    } catch {
      throw new ErrorAplicacion(
        502,
        'Servicios Escolares no confirmó el aviso. El corte sigue disponible para reintentar.',
      );
    }
    await q.query(
      'UPDATE reporte_deudores SET fecha_notificacion=now(),acuse_escolares=$2,modo_envio=$3 WHERE reporte_deudores_id=$1',
      [id, envio.acuse, envio.modo],
    );
    await q.query(
      'UPDATE detalle_reporte SET estado_notificacion=$2 WHERE reporte_deudores_id=$1',
      [id, envio.modo === 'REAL' ? 'ENVIADO' : 'SIMULADO'],
    );
    return obtenerCorte(q, id);
  });
}

export function cambiarSuspension(identificador, motivo, actor) {
  return ejecutarTransaccion(async (q) => {
    const u = await one(
      q,
      `SELECT u.usuario_id FROM usuario u JOIN perfil f USING(perfil_id) JOIN rol r USING(rol_id)
      WHERE u.identificador=$1 AND r.nombre='Alumno' AND (u.estado_cuenta='ACTIVO' OR $2::text IS NULL) FOR UPDATE OF u`,
      [identificador, motivo],
    );
    if (!u) {
      throw new ErrorAplicacion(
        404,
        'No se encontró una cuenta de alumno habilitada para esta operación.',
      );
    }
    const activas = await q.query(
      `SELECT suspension_id FROM suspension WHERE usuario_id=$1 AND fecha_inicio<=now()
      AND (fecha_fin IS NULL OR fecha_fin>now()) AND area='BIBLIOTECA' FOR UPDATE`,
      [u.usuario_id],
    );
    if (motivo === null && activas.rowCount === 0) {
      throw new ErrorAplicacion(409, 'El alumno no tiene una suspensión vigente.');
    }
    if (motivo !== null && activas.rowCount > 0) {
      throw new ErrorAplicacion(409, 'El alumno ya tiene una suspensión vigente.');
    }
    if (motivo === null) {
      await q.query(
        "UPDATE suspension SET fecha_fin=GREATEST(now(),fecha_inicio+interval '1 microsecond'),levantada_por=$2 WHERE suspension_id=ANY($1::bigint[])",
        [activas.rows.map((s) => s.suspension_id), actor],
      );
    } else {
      await q.query(
        "INSERT INTO suspension(usuario_id,area,motivo,creada_por) VALUES($1,'BIBLIOTECA',$2,$3)",
        [u.usuario_id, motivo, actor],
      );
    }
  });
}
