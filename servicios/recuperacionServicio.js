import { createHash, randomBytes, randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import db, { ejecutarTransaccion } from '../config/db.js';
import ENTORNO from '../config/entorno.js';
import ErrorAplicacion from '../utilidades/errorAplicacion.js';
import { normalizarIdentificador, inferirTipo } from '../utilidades/identificadores.js';
import { entregarAviso } from './avisoInstitucional.js';
import { consultarVigencia } from './identidadInstitucionalServicio.js';

const hash = (value) => createHash('sha256').update(value).digest('hex');

export async function solicitarAcceso(value) {
  const identificador = normalizarIdentificador(value);
  const tipo = inferirTipo(identificador);
  if (!tipo || (!process.env.CORREO_WEBHOOK_URL && ENTORNO.ES_PRODUCCION)) {
    return;
  }
  const {
    rows: [usuario],
  } = await db.query(
    `SELECT u.usuario_id,u.correo,u.version_sesion
    FROM usuario u JOIN perfil f USING(perfil_id) JOIN rol r USING(rol_id)
    WHERE u.identificador=$1 AND u.tipo_identificador=$2 AND u.estado_cuenta='ACTIVO' AND f.activo AND r.activo`,
    [identificador, tipo],
  );
  if (!usuario || !(await consultarVigencia(tipo, identificador))) {
    return;
  }
  const token = randomBytes(32).toString('base64url');
  const huella = hash(token);
  await ejecutarTransaccion(async (q) => {
    await q.query('DELETE FROM recuperacion_acceso WHERE usuario_id=$1 AND vence<=now()', [
      usuario.usuario_id,
    ]);
    await q.query(
      `INSERT INTO recuperacion_acceso(huella,usuario_id,version_sesion,vence)
      VALUES($1,$2,$3,now()+interval '30 minutes')`,
      [huella, usuario.usuario_id, usuario.version_sesion],
    );
  });
  const enlace = new URL('/', ENTORNO.ORIGEN_FRONT);
  enlace.hash = 'recuperar/' + token;
  const mensaje = {
    tipo: 'CORREO',
    folio: randomUUID(),
    para: usuario.correo,
    asunto: 'Restablece tu acceso a Biblioteca Ducky',
    texto: `Abre este enlace en los próximos 30 minutos para elegir una contraseña nueva: ${enlace}. Si no solicitaste el cambio, ignora este mensaje.`,
  };
  try {
    if (process.env.CORREO_WEBHOOK_URL) {
      await entregarAviso(
        process.env.CORREO_WEBHOOK_URL,
        process.env.CORREO_WEBHOOK_TOKEN,
        mensaje,
      );
    } else if (!ENTORNO.ES_PRUEBA) {
      console.log('[Correo de recuperación simulado]', mensaje.para, enlace.href);
    }
  } catch {
    await db.query('DELETE FROM recuperacion_acceso WHERE huella=$1', [huella]);
    // La respuesta pública es igual para todas las cuentas.
  }
}

export async function recuperarAcceso(token, contrasena) {
  if (typeof token !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(token)) {
    throw new ErrorAplicacion(400, 'El enlace no es válido. Solicita uno nuevo.');
  }
  if (
    typeof contrasena !== 'string' ||
    contrasena.length < 8 ||
    Buffer.byteLength(contrasena) > 72 ||
    contrasena !== contrasena.trim()
  ) {
    throw new ErrorAplicacion(
      400,
      'Usa una contraseña de 8 a 72 bytes, sin espacios al inicio ni al final.',
    );
  }
  const huella = hash(token);
  const {
    rows: [solicitud],
  } = await db.query(
    'SELECT usuario_id FROM recuperacion_acceso WHERE huella=$1 AND usada_en IS NULL AND vence>now()',
    [huella],
  );
  if (!solicitud) {
    throw new ErrorAplicacion(400, 'El enlace expiró o ya fue utilizado. Solicita uno nuevo.');
  }
  const contrasenaHash = await bcrypt.hash(contrasena, 10);
  await ejecutarTransaccion(async (q) => {
    const {
      rows: [usuario],
    } = await q.query(
      `SELECT u.usuario_id,u.identificador,u.tipo_identificador,u.version_sesion
      FROM usuario u JOIN perfil f USING(perfil_id) JOIN rol r USING(rol_id)
      WHERE u.usuario_id=$1 AND u.estado_cuenta='ACTIVO' AND f.activo AND r.activo FOR UPDATE OF u`,
      [solicitud.usuario_id],
    );
    const {
      rows: [codigo],
    } = await q.query(
      'SELECT version_sesion FROM recuperacion_acceso WHERE huella=$1 AND usada_en IS NULL AND vence>now()',
      [huella],
    );
    if (
      !usuario ||
      !codigo ||
      Number(usuario.version_sesion) !== Number(codigo.version_sesion) ||
      !(await consultarVigencia(usuario.tipo_identificador, usuario.identificador, q))
    ) {
      throw new ErrorAplicacion(400, 'El enlace expiró o ya fue utilizado. Solicita uno nuevo.');
    }
    await q.query(
      `UPDATE usuario SET "contraseña_hash"=$2, debe_cambiar_contrasena=false,
      version_sesion=version_sesion+1 WHERE usuario_id=$1`,
      [usuario.usuario_id, contrasenaHash],
    );
    await q.query('UPDATE recuperacion_acceso SET usada_en=now() WHERE huella=$1', [huella]);
  });
}
