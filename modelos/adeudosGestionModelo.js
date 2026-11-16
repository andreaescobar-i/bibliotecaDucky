import db, { ejecutarTransaccion } from '../config/db.js';
import ErrorAplicacion from '../utilidades/errorAplicacion.js';
import { prestamoActivo } from './circulacionModelo.js';
import { avisarEscolares } from '../servicios/avisoInstitucional.js';

const one = async (q, sql, args) => (await q.query(sql, args)).rows[0];
function exigir(condicion, mensaje, estado = 409) {
  if (!condicion) {
    throw new ErrorAplicacion(estado, mensaje);
  }
}

export async function pago(id, { folio, monto, fecha }, operador) {
  try {
    return await ejecutarTransaccion(async (q) => {
      const a = await one(q, 'SELECT * FROM adeudo WHERE adeudo_id=$1 FOR UPDATE', [id]);
      exigir(a, 'No se encontró el adeudo.', 404);
      exigir(a.estado === 'PENDIENTE', 'El adeudo ya fue liquidado.');
      exigir(
        Number(a.monto_mxn) === Number(monto),
        'El monto debe cubrir exactamente el saldo del adeudo.',
        400,
      );
      exigir(
        fecha <=
          (
            await one(
              q,
              "SELECT to_char(now() AT TIME ZONE 'America/Monterrey','YYYY-MM-DD') AS hoy",
            )
          ).hoy,
        'La fecha de pago no puede estar en el futuro.',
        400,
      );
      const p = await one(
        q,
        `INSERT INTO pago(adeudo_id,folio_tesoreria,monto_mxn,fecha_pago,registrador_usuario_id)
         VALUES ($1,$2,$3,$4::date::timestamp AT TIME ZONE 'America/Monterrey',$5)
         RETURNING folio_tesoreria,fecha_pago`,
        [id, folio, monto, fecha, operador],
      );
      await q.query("UPDATE adeudo SET estado='PAGADO' WHERE adeudo_id=$1", [id]);
      return { ...p, adeudo_id: id, estado: 'PAGADO' };
    });
  } catch (e) {
    if (e.code === '23505') {
      throw new ErrorAplicacion(409, 'Este comprobante ya está registrado.');
    }
    throw e;
  }
}

export function reportarPerdida(folio, { cambio, fecha, fuente }, operador) {
  return ejecutarTransaccion(async (q) => {
    const p = await prestamoActivo(q, folio);
    await q.query('SELECT usuario_id FROM usuario WHERE usuario_id=$1 FOR UPDATE', [p.usuario_id]);
    const l = await one(
      q,
      "SELECT precio_compra, to_char(now() AT TIME ZONE 'America/Monterrey','YYYY-MM-DD') AS hoy FROM libro WHERE libro_id=$1",
      [p.libro_id],
    );
    exigir(
      Number(l.precio_compra) > 0,
      'Registra primero el precio de la última compra en la ficha del libro.',
    );
    exigir(fecha <= l.hoy, 'La fecha del tipo de cambio no puede estar en el futuro.', 400);
    const a = await one(
      q,
      `INSERT INTO adeudo(prestamo_id,tipo,concepto,monto_mxn,estado)
      VALUES($1,'REPOSICION','Reposición de ejemplar extraviado',round($2::numeric*$3::numeric,2),'PENDIENTE')
      RETURNING adeudo_id,monto_mxn,estado,tipo`,
      [p.prestamo_id, l.precio_compra, cambio],
    );
    await q.query(
      `INSERT INTO reposicion(adeudo_id,precio_ultima_compra_usd,tipo_cambio_mxn_usd,fecha_tipo_cambio,fuente_tipo_cambio)
      VALUES($1,$2,$3,$4,$5)`,
      [a.adeudo_id, l.precio_compra, cambio, fecha, fuente],
    );
    await q.query("UPDATE prestamo SET estado='PERDIDO' WHERE prestamo_id=$1", [p.prestamo_id]);
    await q.query(
      `UPDATE ejemplar SET estado='DADO_DE_BAJA',fecha_baja=now(),motivo_baja='PERDIDO',
      baja_por_usuario_id=$2,detalle_baja=$3 WHERE ejemplar_id=$1`,
      [p.ejemplar_id, operador, folio],
    );
    await q.query(
      `INSERT INTO movimiento_ejemplar(ejemplar_id,operador_usuario_id,tipo,motivo,observaciones)
      VALUES($1,$2,'BAJA','PERDIDO',$3)`,
      [p.ejemplar_id, operador, folio],
    );
    return a;
  });
}

export function avisarReposicion(id) {
  return ejecutarTransaccion(async (q) => {
    const registro = await one(
      q,
      `SELECT r.acuse_escolares,r.modo_envio_escolares,u.identificador,
      p.folio,a.monto_mxn FROM reposicion r JOIN adeudo a USING(adeudo_id)
      JOIN prestamo p USING(prestamo_id) JOIN usuario u USING(usuario_id) WHERE r.adeudo_id=$1 FOR UPDATE OF r`,
      [id],
    );
    exigir(registro, 'No hay una reposición para este adeudo.', 404);
    if (
      registro.acuse_escolares &&
      !(registro.modo_envio_escolares === 'SIMULADO' && process.env.ESCOLARES_WEBHOOK_URL)
    ) {
      return registro;
    }
    let envio;
    try {
      envio = await avisarEscolares({
        tipo: 'REPOSICION',
        folio: 'REPOSICION-' + id,
        folioPrestamo: registro.folio,
        identificador: registro.identificador,
        monto_mxn: registro.monto_mxn,
      });
    } catch {
      throw new ErrorAplicacion(
        502,
        'Servicios Escolares no confirmó el aviso. Puedes reintentarlo.',
      );
    }
    return one(
      q,
      'UPDATE reposicion SET acuse_escolares=$2,modo_envio_escolares=$3,fecha_envio_escolares=now() WHERE adeudo_id=$1 RETURNING acuse_escolares,modo_envio_escolares',
      [id, envio.acuse, envio.modo],
    );
  });
}

export async function listadoAdeudos(busqueda) {
  return (
    await db.query(
      `SELECT a.adeudo_id,a.tipo,a.concepto,a.monto_mxn,a.estado,a.acuse_tesoreria,a.modo_envio_tesoreria,
    p.folio,l.titulo,u.identificador,concat_ws(' ',u.primer_nombre,u.primer_apellido,u.segundo_apellido) AS nombre,
    pg.folio_tesoreria,pg.fecha_pago,r.acuse_escolares,r.modo_envio_escolares
    FROM adeudo a JOIN prestamo p USING(prestamo_id) JOIN usuario u USING(usuario_id)
    JOIN ejemplar e USING(ejemplar_id) JOIN libro l USING(libro_id)
    LEFT JOIN pago pg USING(adeudo_id) LEFT JOIN reposicion r USING(adeudo_id)
    WHERE $1='' OR upper(p.folio)=$1 OR upper(u.identificador)=$1 OR upper(pg.folio_tesoreria)=$1
    ORDER BY (a.estado='PENDIENTE') DESC,a.fecha_emision DESC LIMIT 200`,
      [busqueda],
    )
  ).rows;
}
