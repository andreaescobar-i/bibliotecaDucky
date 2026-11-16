import express from 'express';
import ErrorAplicacion from '../utilidades/errorAplicacion.js';
import { requiereSesion, requierePermiso } from '../middlewares/autenticacion.js';
import * as adeudos from '../modelos/adeudosGestionModelo.js';
import * as reportes from '../modelos/reportesModelo.js';
import { remitirMulta } from '../modelos/circulacionModelo.js';

const router = express.Router();
const operar = requierePermiso('OPERAR_CIRCULACION');
const invalido = (nombre) => new ErrorAplicacion(400, 'Revisa el campo «' + nombre + '».');
function texto(value, nombre, max = 64) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) {
    throw invalido(nombre);
  }
  return value.trim();
}
function opcional(value, nombre, max) {
  return value === undefined || value === '' ? '' : texto(value, nombre, max);
}
function fecha(value, nombre) {
  if (typeof value !== 'string' || !/^[2-9]\d{3}-\d{2}-\d{2}$/.test(value)) {
    throw invalido(nombre);
  }
  const date = new Date(value + 'T00:00:00Z');
  if (!Number.isFinite(+date) || date.toISOString().slice(0, 10) !== value) {
    throw invalido(nombre);
  }
  return value;
}
function decimal(value, nombre, regex) {
  if (typeof value !== 'string' || !regex.test(value) || Number(value) <= 0) {
    throw invalido(nombre);
  }
  return value;
}
function id(value) {
  if (!/^[1-9]\d{0,17}$/.test(value)) {
    throw invalido('Identificador');
  }
  return value;
}

router.use(requiereSesion);
router.get('/adeudos', operar, async (req, res) => {
  res.json(
    await adeudos.listadoAdeudos(opcional(req.query.busqueda, 'Búsqueda', 64).toUpperCase()),
  );
});
router.post('/adeudos/:id/pago', operar, async (req, res) => {
  const { body, usuario } = req;
  res.status(201).json(
    await adeudos.pago(
      id(req.params.id),
      {
        folio: texto(body?.folio, 'Folio del comprobante').toUpperCase(),
        fecha: fecha(body?.fecha, 'Fecha del pago'),
        monto: decimal(body?.monto, 'Monto pagado', /^\d{1,12}(\.\d{1,2})?$/),
      },
      usuario.usuario_id,
    ),
  );
});
router.post('/perdidas', operar, async (req, res) => {
  const { body, usuario } = req;
  const a = await adeudos.reportarPerdida(
    texto(body?.folio, 'Folio de préstamo').toUpperCase(),
    {
      fecha: fecha(body?.fecha, 'Fecha del tipo de cambio'),
      cambio: decimal(body?.cambio, 'Tipo de cambio', /^\d{1,4}(\.\d{1,6})?$/),
      fuente: texto(body?.fuente, 'Fuente del tipo de cambio', 200),
    },
    usuario.usuario_id,
  );
  const envios = await Promise.allSettled([
    remitirMulta(a.adeudo_id),
    adeudos.avisarReposicion(a.adeudo_id),
  ]);
  res.status(201).json({ ...a, avisosPendientes: envios.some((r) => r.status === 'rejected') });
});
router.post('/adeudos/:id/tesoreria', operar, async (req, res) => {
  res.json(await remitirMulta(id(req.params.id)));
});
router.post('/adeudos/:id/escolares', operar, async (req, res) => {
  res.json(await adeudos.avisarReposicion(id(req.params.id)));
});
router.get('/suspendidos', operar, async (_req, res) => {
  res.json(await reportes.deudores());
});
router.post('/suspendidos', operar, async (req, res) => {
  if (typeof req.body?.levantar !== 'boolean') {
    throw invalido('Acción');
  }
  const identificador = texto(req.body.identificador, 'Matrícula', 32).toUpperCase();
  await reportes.cambiarSuspension(
    identificador,
    req.body.levantar ? null : texto(req.body.motivo, 'Motivo', 200),
    req.usuario.usuario_id,
  );
  res.sendStatus(204);
});
router.get('/cortes', operar, async (_req, res) => {
  res.json(await reportes.ultimoCorte());
});
router.post('/cortes', operar, async (req, res) => {
  res
    .status(201)
    .json(
      await reportes.generarCorte(
        texto(req.body?.periodo, 'Periodo de exámenes', 64),
        req.usuario.usuario_id,
      ),
    );
});
router.post('/cortes/:id/aviso', operar, async (req, res) => {
  res.json(await reportes.enviarCorte(id(req.params.id)));
});
router.get('/inventario', requierePermiso('CONSULTAR_REPORTES'), async (req, res) => {
  const periodo = texto(req.query.periodo, 'Periodo', 7);
  fecha(periodo + '-01', 'Periodo');
  res.json(
    await reportes.inventario(
      periodo,
      opcional(req.query.tema, 'Tema', 150),
      opcional(req.query.estante, 'Estante', 16),
    ),
  );
});

export default router;
