import express from 'express';
import { requiereSesion, requierePermiso } from '../middlewares/autenticacion.js';
import { normalizarIdentificador, inferirTipo } from '../utilidades/identificadores.js';
import { normalizarClave } from '../utilidades/reglasCatalogo.js';
import ErrorAplicacion from '../utilidades/errorAplicacion.js';
import * as circulacion from '../modelos/circulacionModelo.js';

const router = express.Router();
const operar = requierePermiso('OPERAR_CIRCULACION');
const consultar = requierePermiso('CONSULTAR_LIBROS');
const campo = (valor, nombre, max = 64) => {
  if (typeof valor !== 'string' || !valor.trim() || valor.trim().length > max) {
    throw new ErrorAplicacion(400, `Revisa el campo «${nombre}».`);
  }
  return valor.trim();
};

function leerIdentificador(valor) {
  const id = normalizarIdentificador(valor);
  if (!inferirTipo(id)) {
    throw new ErrorAplicacion(400, 'Usa la matrícula o nómina institucional completa.');
  }
  return id;
}

router.use(requiereSesion);
router.get('/mi-cuenta', consultar, async (req, res) => {
  res.json(await circulacion.miCuenta(req.usuario.usuario_id));
});
router.post('/mi-espera', consultar, async (req, res) => {
  res
    .status(201)
    .json(
      await circulacion.esperar(
        normalizarClave(campo(req.body?.claveLibro, 'Clave de libro')),
        req.usuario.identificador,
      ),
    );
});
router.post('/espera', operar, async (req, res) => {
  res
    .status(201)
    .json(
      await circulacion.esperar(
        normalizarClave(campo(req.body?.claveLibro, 'Clave de libro')),
        leerIdentificador(req.body?.identificador),
      ),
    );
});

router.get('/prestamos/:folio', operar, async (req, res) => {
  res.json(await circulacion.buscar(campo(req.params.folio, 'Folio').toUpperCase()));
});
router.post('/prestamos', operar, async (req, res) => {
  const p = await circulacion.prestar(
    {
      identificador: leerIdentificador(req.body?.identificador),
      ejemplar: normalizarClave(campo(req.body?.ejemplar, 'Clave de ejemplar')),
    },
    req.usuario.usuario_id,
  );
  res.status(201).json(p);
});
router.post('/prestamos/:folio/renovacion', operar, async (req, res) => {
  res.json(
    await circulacion.renovar(
      campo(req.params.folio, 'Folio').toUpperCase(),
      req.usuario.usuario_id,
    ),
  );
});
router.post('/prestamos/:folio/devolucion', operar, async (req, res) => {
  const condicion = req.body?.condicion;
  if (!['Buen estado', 'Dañado'].includes(condicion)) {
    throw new ErrorAplicacion(400, 'Selecciona la condición del ejemplar.');
  }
  const observaciones = req.body?.observaciones
    ? campo(req.body.observaciones, 'Observaciones', 500)
    : null;
  const resultado = await circulacion.devolver(
    campo(req.params.folio, 'Folio').toUpperCase(),
    condicion,
    observaciones,
    req.usuario.usuario_id,
  );
  if (resultado.multa) {
    try {
      resultado.multa = await circulacion.remitirMulta(resultado.multa.adeudo_id);
    } catch {
      resultado.aviso =
        'La devolución y la multa se registraron. El envío quedó pendiente; puedes reintentarlo en Multas.';
    }
  }
  res.status(201).json(resultado);
});

router.get('/multas', operar, async (req, res) => {
  const folio = req.query.folio ? campo(req.query.folio, 'Folio').toUpperCase() : '';
  res.json(await circulacion.multas(folio));
});
router.post('/multas/:id/envio', operar, async (req, res) => {
  if (!/^[1-9]\d{0,17}$/.test(req.params.id)) {
    throw new ErrorAplicacion(400, 'Identificador de multa inválido.');
  }
  res.json(await circulacion.remitirMulta(req.params.id));
});

export default router;
