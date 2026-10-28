/*----
 * Programa: authControlador.js
 * Objetivo: Manejar inicio y cierre de sesión y la consulta de la sesión actual (HUGUS01)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import bcrypt from 'bcrypt';
import * as usuarioModelo from '../modelos/usuarioModelo.js';
import * as bitacoraModelo from '../modelos/bitacoraModelo.js';
import * as identidadInstitucionalServicio from '../servicios/identidadInstitucionalServicio.js';
import * as authVista from '../vistas/authVista.js';
import ErrorAplicacion from '../utilidades/errorAplicacion.js';
import { MENSAJE_ACCESO_NO_HABILITADO, evaluarAcceso } from '../utilidades/reglasAcceso.js';
import {
  normalizarIdentificador,
  normalizarTipo,
  inferirTipo,
  esFormatoValido,
} from '../utilidades/identificadores.js';
import {
  NOMBRE_COOKIE_SESION,
  crearTokenSesion,
  verificarTokenSesion,
  opcionesCookieSesion,
  borrarCookieSesion,
} from '../utilidades/sesion.js';

const MENSAJE_CAMPOS_OBLIGATORIOS = 'Complete los campos obligatorios señalados';
const MENSAJE_FORMATO_IDENTIFICADOR = 'Revise el formato del identificador institucional';
const MENSAJE_CREDENCIALES_INVALIDAS =
  'Credenciales inválidas. Verifique su Usuario y contraseña e intente nuevamente';

const RONDAS_BCRYPT = 10; // Costo del hash de contraseñas
// Al menos 8 caracteres con letras y números
const FORMATO_CONTRASENA = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

// Hash con el que se compara cuando el identificador no existe, para que la respuesta tarde lo
// mismo y no revele si la cuenta está registrada
const HASH_SIMULADO = bcrypt.hashSync('cuenta-inexistente', RONDAS_BCRYPT);

/**
 * Objetivo: Validar los campos del formulario de acceso (HUGUS01 escenario 4).
 * @param {Object} cuerpo - Cuerpo de la petición: { tipoIdentificador?, identificador,
 *   contrasena }. El tipo es opcional porque el front solo captura "Usuario"; si falta se
 *   deduce del formato.
 * @returns {{ tipo: string, identificador: string, contrasena: string }} Datos normalizados.
 * Limitaciones: Lanza ErrorAplicacion 400 con los campos señalados por nombre.
 */
function validarCamposAcceso(cuerpo = {}) {
  const identificador = normalizarIdentificador(cuerpo.identificador);
  const contrasena = typeof cuerpo.contrasena === 'string' ? cuerpo.contrasena : '';
  const tipoCapturado = normalizarTipo(cuerpo.tipoIdentificador);

  const camposFaltantes = [];
  if (tipoCapturado === null) {
    camposFaltantes.push('Tipo de identificador');
  }
  if (identificador === '') {
    camposFaltantes.push('Identificador');
  }
  if (contrasena === '') {
    camposFaltantes.push('Contraseña');
  }
  if (camposFaltantes.length > 0) {
    throw new ErrorAplicacion(400, MENSAJE_CAMPOS_OBLIGATORIOS, { campos: camposFaltantes });
  }

  const tipo = tipoCapturado || inferirTipo(identificador);
  if (!tipo || !esFormatoValido(tipo, identificador)) {
    throw new ErrorAplicacion(400, MENSAJE_FORMATO_IDENTIFICADOR, { campos: ['Identificador'] });
  }
  return { tipo, identificador, contrasena };
}

/**
 * Objetivo: Iniciar sesión con identificador institucional y contraseña. Verifica la contraseña
 *   contra el hash, la cuenta, el perfil y la vigencia en CIAA o Capital Humano; crea la sesión
 *   y registra el acceso en la bitácora.
 * @param {Object} req - Petición HTTP.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function postLogin(req, res, next) {
  try {
    const { tipo, identificador, contrasena } = validarCamposAcceso(req.body);

    const credenciales = await usuarioModelo.obtenerCredenciales(tipo, identificador);
    const esContrasenaCorrecta = await bcrypt.compare(
      contrasena,
      credenciales?.contrasena_hash ?? HASH_SIMULADO,
    );
    // Escenario 2: el mensaje no revela si falló el usuario o la contraseña
    if (!credenciales || !esContrasenaCorrecta) {
      await bitacoraModelo.registrarEvento({
        actorUsuarioId: credenciales?.usuario_id ?? null,
        accion: 'INICIO_SESION_FALLIDO',
        entidad: 'usuario',
        claveRegistro: identificador,
        detalle: { causa: credenciales ? 'CONTRASENA_INCORRECTA' : 'CUENTA_NO_REGISTRADA' },
        ip: req.ip,
        resultado: bitacoraModelo.RESULTADOS.RECHAZO,
      });
      throw new ErrorAplicacion(401, MENSAJE_CREDENCIALES_INVALIDAS);
    }

    // Escenario 3: credenciales correctas, pero la cuenta no puede acceder
    const usuario = await usuarioModelo.obtenerUsuarioAcceso(credenciales.usuario_id);
    const esVigente = await identidadInstitucionalServicio.consultarVigencia(tipo, identificador);
    const rechazo = evaluarAcceso(usuario, esVigente);
    if (rechazo) {
      await bitacoraModelo.registrarEvento({
        actorUsuarioId: usuario.usuario_id,
        accion: 'ACCESO_NO_HABILITADO',
        entidad: 'usuario',
        claveRegistro: identificador,
        detalle: { causa: rechazo.causa },
        ip: req.ip,
        resultado: bitacoraModelo.RESULTADOS.RECHAZO,
      });
      throw new ErrorAplicacion(403, MENSAJE_ACCESO_NO_HABILITADO, { area: rechazo.area });
    }

    // Escenario 1: sesión creada sin guardar la contraseña
    res.cookie(NOMBRE_COOKIE_SESION, crearTokenSesion(usuario), opcionesCookieSesion());
    await usuarioModelo.registrarUltimoAcceso(usuario.usuario_id);
    await bitacoraModelo.registrarEvento({
      actorUsuarioId: usuario.usuario_id,
      accion: 'INICIO_SESION',
      entidad: 'usuario',
      claveRegistro: identificador,
      detalle: { perfil: usuario.perfil_clave },
      ip: req.ip,
    });
    res.json(authVista.formatearSesion(usuario));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Cerrar la sesión borrando la cookie. Responde 204 aunque ya no hubiera sesión.
 * @param {Object} req - Petición HTTP.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function postLogout(req, res, next) {
  try {
    const contenido = verificarTokenSesion(req.cookies?.[NOMBRE_COOKIE_SESION] ?? '');
    if (contenido) {
      await bitacoraModelo.registrarEvento({
        actorUsuarioId: contenido.sub,
        accion: 'CIERRE_SESION',
        entidad: 'usuario',
        ip: req.ip,
      });
    }
    borrarCookieSesion(res);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Cambiar la contraseña de la cuenta en sesión, por ejemplo la temporal que se envía
 *   al dar de alta la cuenta (HUGUS02). Las demás sesiones abiertas dejan de valer y esta se
 *   renueva con la versión nueva.
 * @param {Object} req - Petición HTTP. Cuerpo: contrasenaActual, contrasenaNueva.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function putContrasena(req, res, next) {
  try {
    const actual = typeof req.body?.contrasenaActual === 'string' ? req.body.contrasenaActual : '';
    const nueva = typeof req.body?.contrasenaNueva === 'string' ? req.body.contrasenaNueva : '';
    const camposFaltantes = [
      ['Contraseña actual', actual],
      ['Nueva contraseña', nueva],
    ]
      .filter(([, valor]) => valor === '')
      .map(([nombre]) => nombre);
    if (camposFaltantes.length > 0) {
      throw new ErrorAplicacion(400, MENSAJE_CAMPOS_OBLIGATORIOS, { campos: camposFaltantes });
    }
    if (!FORMATO_CONTRASENA.test(nueva) || nueva === actual) {
      throw new ErrorAplicacion(
        400,
        'La nueva contraseña debe tener al menos 8 caracteres, letras y números, y ser distinta de la actual',
        { campos: ['Nueva contraseña'] },
      );
    }

    const credenciales = await usuarioModelo.obtenerCredenciales(
      req.usuario.tipo_identificador,
      req.usuario.identificador,
    );
    if (!(await bcrypt.compare(actual, credenciales.contrasena_hash))) {
      await bitacoraModelo.registrarEvento({
        actorUsuarioId: req.usuario.usuario_id,
        accion: 'CAMBIO_CONTRASENA',
        entidad: 'usuario',
        claveRegistro: req.usuario.identificador,
        detalle: { causa: 'CONTRASENA_ACTUAL_INCORRECTA' },
        ip: req.ip,
        resultado: bitacoraModelo.RESULTADOS.RECHAZO,
      });
      throw new ErrorAplicacion(400, 'La contraseña actual no es correcta', {
        campos: ['Contraseña actual'],
      });
    }

    const versionSesion = await usuarioModelo.actualizarContrasena(
      req.usuario.usuario_id,
      await bcrypt.hash(nueva, RONDAS_BCRYPT),
    );
    await bitacoraModelo.registrarEvento({
      actorUsuarioId: req.usuario.usuario_id,
      accion: 'CAMBIO_CONTRASENA',
      entidad: 'usuario',
      claveRegistro: req.usuario.identificador,
      ip: req.ip,
    });
    const usuario = await usuarioModelo.obtenerUsuarioAcceso(req.usuario.usuario_id);
    res.cookie(
      NOMBRE_COOKIE_SESION,
      crearTokenSesion({ usuario_id: usuario.usuario_id, version_sesion: versionSesion }),
      opcionesCookieSesion(),
    );
    res.json(authVista.formatearCambioContrasena(usuario));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Devolver la cuenta de la sesión actual con sus permisos vigentes. Lo usa el front
 *   al recargar la página para saber qué funciones mostrar.
 * @param {Object} req - Petición HTTP (req.usuario lo coloca requiereSesion).
 * @param {Object} res - Respuesta HTTP.
 * @returns {void}
 */
function getSesion(req, res) {
  res.json(authVista.formatearSesion(req.usuario));
}

export { postLogin, postLogout, putContrasena, getSesion };
