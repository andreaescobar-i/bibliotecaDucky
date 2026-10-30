/*----
 * Programa: libroControlador.js
 * Objetivo: Gestionar fichas bibliográficas: alta de libro y ejemplar (HULIB01 esc. 1, 3),
 *           ejemplar nuevo de una ficha existente (HULIB01 esc. 2, 4), cambio de datos
 *           bibliográficos (HULIB03 esc. 1, 3), baja del libro completo, detalle, etiquetas e
 *           historial (pantallas de libros del front)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import { ejecutarTransaccion } from '../config/db.js';
import * as libroModelo from '../modelos/libroModelo.js';
import * as ejemplarModelo from '../modelos/ejemplarModelo.js';
import * as catalogoModelo from '../modelos/catalogoModelo.js';
import * as prestamoModelo from '../modelos/prestamoModelo.js';
import * as bitacoraModelo from '../modelos/bitacoraModelo.js';
import * as libroVista from '../vistas/libroVista.js';
import ErrorAplicacion from '../utilidades/errorAplicacion.js';
import { limpiarTexto, tieneCampo } from '../utilidades/validacion.js';
import {
  MOTIVOS_BAJA,
  TIPO_USO_POR_OMISION,
  normalizarClave,
  esClaveValida,
  normalizarIsbn,
  esIsbnValido,
  separarAutores,
  unirAutores,
  leerUbicacion,
  normalizarMotivoBaja,
} from '../utilidades/reglasCatalogo.js';

const MENSAJE_CAMPOS_OBLIGATORIOS = 'Complete los campos obligatorios señalados';
const MENSAJE_FICHA_NO_ENCONTRADA = 'Ficha bibliográfica no encontrada';
const MAX_EJEMPLARES_POR_ALTA = 50; // Ejemplares que se pueden registrar en una sola operación
const ANIO_MINIMO = 1450; // Años anteriores a la imprenta se consideran captura incorrecta
const VIOLA_UNICIDAD = '23505'; // Código de PostgreSQL

/**
 * Objetivo: Validar y normalizar los datos bibliográficos de una ficha.
 * @param {Object} datos - Campos capturados (titulo, autor, tema, editorial, isbn,
 *   descripcion, edicion, anio, precioCompra).
 * @param {string[]} camposFaltantes - Lista donde se agregan los obligatorios vacíos.
 * @returns {Object} Datos limpios; isbn, edicion, anio y precio pueden ser null.
 * Limitaciones: Lanza ErrorAplicacion 400 si un campo opcional tiene formato inválido.
 */
function leerDatosBibliograficos(datos, camposFaltantes) {
  const titulo = limpiarTexto(datos.titulo);
  const autores = separarAutores(datos.autores ?? datos.autor);
  const tema = limpiarTexto(datos.tema);
  const editorial = limpiarTexto(datos.editorial);
  for (const [nombre, valor] of [
    ['Título', titulo],
    ['Autor', autores.length > 0],
    ['Tema', tema],
    ['Editorial', editorial],
  ]) {
    if (!valor) {
      camposFaltantes.push(nombre);
    }
  }

  const isbn = normalizarIsbn(datos.isbn);
  if (isbn && !esIsbnValido(isbn)) {
    throw new ErrorAplicacion(400, 'El ISBN debe tener 10 o 13 dígitos', { campos: ['ISBN'] });
  }
  const textoPrecio = limpiarTexto(String(datos.precioCompra ?? ''));
  const precioCompra = textoPrecio === '' ? null : Number(textoPrecio);
  if (precioCompra !== null && (!Number.isFinite(precioCompra) || precioCompra < 0)) {
    throw new ErrorAplicacion(400, 'El precio de compra debe ser un número mayor o igual a cero', {
      campos: ['Precio de compra (USD)'],
    });
  }
  const textoAnio = limpiarTexto(String(datos.anio ?? ''));
  const anio = textoAnio === '' ? null : Number(textoAnio);
  const anioMaximo = new Date().getFullYear() + 1;
  if (anio !== null && (!Number.isInteger(anio) || anio < ANIO_MINIMO || anio > anioMaximo)) {
    throw new ErrorAplicacion(400, `El año debe estar entre ${ANIO_MINIMO} y ${anioMaximo}`, {
      campos: ['Año'],
    });
  }

  return {
    titulo,
    autores,
    tema,
    editorial,
    isbn: isbn || null,
    descripcion: limpiarTexto(datos.descripcion) || null,
    edicion: limpiarTexto(datos.edicion) || null,
    anio,
    precioCompra,
  };
}

/**
 * Objetivo: Validar los datos del ejemplar o ejemplares a registrar: clasificación, Librero,
 *   Fila, tipo de uso, Clave de ejemplar opcional y cantidad ("Ejemplares que se reciben").
 * @param {Object} cuerpo - Cuerpo de la petición.
 * @param {string} claveLibro - Clave de la ficha; es la clasificación si no se captura otra.
 * @param {string[]} camposFaltantes - Lista donde se agregan los obligatorios vacíos.
 * @returns {Object} claveEjemplar ('' para generarla), clasificacion, librero, fila, tipoUso y
 *   cantidad.
 */
function leerDatosEjemplar(cuerpo, claveLibro, camposFaltantes) {
  const claveEjemplar = normalizarClave(cuerpo.claveEjemplar);
  const clasificacion = normalizarClave(cuerpo.clasificacion) || claveLibro;
  const { librero, fila } = leerUbicacion(cuerpo);
  if (!librero) {
    camposFaltantes.push('Librero');
  }
  if (!fila) {
    camposFaltantes.push('Fila');
  }

  const cantidad = Number(cuerpo.cantidad ?? 1);
  if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > MAX_EJEMPLARES_POR_ALTA) {
    throw new ErrorAplicacion(
      400,
      `Los ejemplares que se reciben deben ser de 1 a ${MAX_EJEMPLARES_POR_ALTA}`,
      { campos: ['Ejemplares que se reciben'] },
    );
  }
  if (claveEjemplar && (!esClaveValida(claveEjemplar) || cantidad > 1)) {
    throw new ErrorAplicacion(
      400,
      'La Clave de ejemplar debe ser válida y corresponder a un solo ejemplar',
      { campos: ['Clave de ejemplar'] },
    );
  }
  return {
    claveEjemplar,
    clasificacion,
    librero,
    fila,
    tipoUso: limpiarTexto(cuerpo.tipoUso) || TIPO_USO_POR_OMISION,
    cantidad,
  };
}

/**
 * Objetivo: Obtener los ids de tema y tipo de uso capturados.
 * @param {string|null} tema - Tema de la ficha (null si no se valida).
 * @param {string|null} tipoUso - Tipo de uso del ejemplar (null si no se valida).
 * @returns {Promise<{ tema: Object|null, tipoUso: Object|null }>} Registros encontrados.
 * Limitaciones: Lanza ErrorAplicacion 400 si alguno no está registrado.
 */
async function resolverCatalogos(tema, tipoUso) {
  const [temaRegistrado, tipoUsoRegistrado] = await Promise.all([
    tema ? catalogoModelo.obtenerTema(tema) : null,
    tipoUso ? catalogoModelo.obtenerTipoUso(tipoUso) : null,
  ]);
  if (tema && !temaRegistrado) {
    throw new ErrorAplicacion(400, 'Tema no registrado', { campos: ['Tema'] });
  }
  if (tipoUso && !tipoUsoRegistrado) {
    throw new ErrorAplicacion(400, 'Tipo de uso no registrado', { campos: ['Tipo de uso'] });
  }
  return { tema: temaRegistrado, tipoUso: tipoUsoRegistrado };
}

/**
 * Objetivo: Decidir las claves de los ejemplares nuevos: la capturada, o las siguientes de la
 *   numeración "<Clave de libro>-E01, -E02...".
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string|null} libroId - Ficha existente (null si es nueva).
 * @param {string} claveLibro - Clave de la ficha.
 * @param {Object} datosEjemplar - Resultado de leerDatosEjemplar().
 * @returns {Promise<string[]>} Claves que se registrarán.
 * Limitaciones: Lanza ErrorAplicacion 409 si alguna clave ya está registrada.
 */
async function decidirClavesEjemplar(cliente, libroId, claveLibro, datosEjemplar) {
  let claves = [datosEjemplar.claveEjemplar];
  if (!datosEjemplar.claveEjemplar) {
    const prefijo = `${claveLibro}-E`;
    const existentes = libroId ? await ejemplarModelo.listarClavesDeLibro(libroId, cliente) : [];
    const ultimoNumero = existentes
      .filter((clave) => clave.startsWith(prefijo))
      .map((clave) => Number(clave.slice(prefijo.length)))
      .filter(Number.isInteger)
      .reduce((mayor, numero) => Math.max(mayor, numero), 0);
    claves = Array.from(
      { length: datosEjemplar.cantidad },
      (_valor, indice) => `${prefijo}${String(ultimoNumero + indice + 1).padStart(2, '0')}`,
    );
  }
  const repetidas = await ejemplarModelo.obtenerClavesExistentes(claves, cliente);
  if (repetidas.length > 0) {
    throw new ErrorAplicacion(409, 'La Clave de ejemplar ya está registrada', {
      campos: ['Clave de ejemplar'],
      claves: repetidas,
    });
  }
  return claves;
}

/**
 * Objetivo: Registrar ejemplares disponibles con su movimiento de alta en el historial.
 * @param {import('pg').PoolClient} cliente - Cliente de la transacción.
 * @param {string} operadorId - Cuenta que registra.
 * @param {string} libroId - Ficha a la que se vinculan.
 * @param {Object} datosEjemplar - Resultado de leerDatosEjemplar().
 * @param {string} tipoUsoId - Id del tipo de uso.
 * @param {string[]} claves - Claves de los ejemplares.
 * @returns {Promise<void>}
 */
async function registrarEjemplares(cliente, operadorId, libroId, datosEjemplar, tipoUsoId, claves) {
  for (const clave of claves) {
    const ejemplarId = await ejemplarModelo.crearEjemplar(cliente, {
      libroId,
      tipoUsoId,
      clave,
      clasificacion: datosEjemplar.clasificacion,
      librero: datosEjemplar.librero,
      fila: datosEjemplar.fila,
    });
    await ejemplarModelo.registrarMovimiento(cliente, {
      ejemplarId,
      operadorId,
      tipo: 'ALTA',
      nuevo: {
        clasificacion: datosEjemplar.clasificacion,
        librero: datosEjemplar.librero,
        fila: datosEjemplar.fila,
        tipoUso: datosEjemplar.tipoUso,
        estado: 'DISPONIBLE',
      },
    });
  }
}

/**
 * Objetivo: Armar la respuesta de un alta con la ficha, los ejemplares nuevos y sus etiquetas.
 * @param {string} mensaje - Mensaje de la historia.
 * @param {string} claveLibro - Ficha.
 * @param {string[]} claves - Claves de los ejemplares nuevos.
 * @returns {Promise<Object>} Cuerpo JSON de la respuesta.
 */
async function construirRespuestaAlta(mensaje, claveLibro, claves) {
  const libro = await libroModelo.obtenerLibroPorClave(claveLibro);
  const ejemplares = (await ejemplarModelo.listarEjemplaresDeLibro(libro.libro_id)).filter(
    (ejemplar) => claves.includes(ejemplar.codigo_ejemplar),
  );
  return libroVista.formatearAlta(mensaje, libro, ejemplares);
}

/**
 * Objetivo: Obtener la ficha indicada en la URL (/libros/:clave).
 * @param {Object} req - Petición HTTP.
 * @param {import('pg').PoolClient} [cliente] - Cliente de una transacción en curso.
 * @returns {Promise<Object>} Ficha encontrada.
 * Limitaciones: Lanza ErrorAplicacion 404 si no existe.
 */
async function obtenerLibroDeRuta(req, cliente = undefined) {
  const libro = await libroModelo.obtenerLibroPorClave(normalizarClave(req.params.clave), cliente);
  if (!libro) {
    throw new ErrorAplicacion(404, MENSAJE_FICHA_NO_ENCONTRADA);
  }
  return libro;
}

/**
 * Objetivo: Consultar una ficha con todos sus ejemplares.
 * @param {Object} req - Petición HTTP.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function getLibro(req, res, next) {
  try {
    const libro = await obtenerLibroDeRuta(req);
    const ejemplares = await ejemplarModelo.listarEjemplaresDeLibro(libro.libro_id);
    res.json(libroVista.formatearDetalle(libro, ejemplares));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Obtener las etiquetas de los ejemplares activos de una ficha, para imprimirlas.
 * @param {Object} req - Petición HTTP.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function getEtiquetasDeLibro(req, res, next) {
  try {
    const libro = await obtenerLibroDeRuta(req);
    const ejemplares = await ejemplarModelo.listarEjemplaresDeLibro(libro.libro_id);
    res.json(libroVista.formatearEtiquetasDeLibro(ejemplares));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Consultar el historial de movimientos de los ejemplares de una ficha.
 * @param {Object} req - Petición HTTP.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function getHistorial(req, res, next) {
  try {
    const libro = await obtenerLibroDeRuta(req);
    const movimientos = await ejemplarModelo.listarHistorialDeLibro(libro.libro_id);
    res.json(libroVista.formatearHistorialDeLibro(libro, movimientos));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Dar de alta una ficha nueva con su ejemplar (o los "Ejemplares que se reciben"),
 *   clasificación, ubicación y etiqueta (HULIB01 escenarios 1 y 3).
 * @param {Object} req - Petición HTTP. Cuerpo: clave, titulo, autor, tema, editorial, isbn?,
 *   descripcion?, precioCompra?, edicion?, anio?, claveEjemplar?, clasificacion?,
 *   librero y fila (o ubicacion "Estante LIT · A1"), tipoUso?, cantidad?.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function postLibro(req, res, next) {
  try {
    const cuerpo = req.body ?? {};
    const camposFaltantes = [];
    const clave = normalizarClave(cuerpo.clave);
    if (!clave) {
      camposFaltantes.push('Clave');
    }
    const ficha = leerDatosBibliograficos(cuerpo, camposFaltantes);
    const datosEjemplar = leerDatosEjemplar(cuerpo, clave, camposFaltantes);
    if (camposFaltantes.length > 0) {
      throw new ErrorAplicacion(400, MENSAJE_CAMPOS_OBLIGATORIOS, { campos: camposFaltantes });
    }
    if (!esClaveValida(clave) || !esClaveValida(datosEjemplar.clasificacion)) {
      throw new ErrorAplicacion(
        400,
        'Las claves usan de 2 a 32 letras, números, puntos o guiones',
        {
          campos: ['Clave'],
        },
      );
    }

    // Escenario 3: la Clave de libro ya existe aunque los datos sean distintos
    const existente = await libroModelo.obtenerLibroPorClave(clave);
    if (existente) {
      throw new ErrorAplicacion(
        409,
        'La Clave de libro ya existe; seleccione la ficha para agregar un ejemplar',
        { campos: ['Clave'], ficha: libroVista.formatearFicha(existente) },
      );
    }
    if (ficha.isbn) {
      const claveConIsbn = await libroModelo.obtenerClavePorIsbn(ficha.isbn);
      if (claveConIsbn) {
        throw new ErrorAplicacion(409, `El ISBN ya está registrado en la ficha ${claveConIsbn}`, {
          campos: ['ISBN'],
        });
      }
    }
    const { tema, tipoUso } = await resolverCatalogos(ficha.tema, datosEjemplar.tipoUso);

    let claves;
    try {
      claves = await ejecutarTransaccion(async (cliente) => {
        const clavesEjemplar = await decidirClavesEjemplar(cliente, null, clave, datosEjemplar);
        const editorialId = await catalogoModelo.obtenerOCrearEditorial(cliente, ficha.editorial);
        const autorIds = [];
        for (const autor of ficha.autores) {
          const autorId = await catalogoModelo.obtenerOCrearAutor(cliente, autor);
          if (!autorIds.includes(autorId)) {
            autorIds.push(autorId);
          }
        }
        const libroId = await libroModelo.crearLibro(cliente, {
          ...ficha,
          clave,
          categoriaId: tema.categoria_id,
          editorialId,
        });
        await libroModelo.reemplazarAutores(cliente, libroId, autorIds);
        await registrarEjemplares(
          cliente,
          req.usuario.usuario_id,
          libroId,
          datosEjemplar,
          tipoUso.tipo_uso_id,
          clavesEjemplar,
        );
        await bitacoraModelo.registrarEvento(
          {
            actorUsuarioId: req.usuario.usuario_id,
            accion: 'ALTA_LIBRO',
            entidad: 'libro',
            claveRegistro: clave,
            detalle: { titulo: ficha.titulo, ejemplares: clavesEjemplar },
            ip: req.ip,
          },
          cliente,
        );
        return clavesEjemplar;
      });
    } catch (err) {
      // Otro operador registró la misma clave al mismo tiempo
      if (err.code === VIOLA_UNICIDAD) {
        throw new ErrorAplicacion(
          409,
          'La Clave de libro, el ISBN o la Clave de ejemplar ya existen',
        );
      }
      throw err;
    }

    const mensaje =
      claves.length === 1
        ? 'Libro y ejemplar registrados exitosamente'
        : `Libro y ${claves.length} ejemplares registrados exitosamente`;
    res.status(201).json(await construirRespuestaAlta(mensaje, clave, claves));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Agregar uno o más ejemplares a una ficha registrada, sin duplicar ni sobrescribir
 *   la ficha (HULIB01 escenarios 2 y 4).
 * @param {Object} req - Petición HTTP. Cuerpo: claveEjemplar?, clasificacion?, librero y fila
 *   (o ubicacion), tipoUso?, cantidad?.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function postEjemplar(req, res, next) {
  try {
    const libro = await obtenerLibroDeRuta(req);
    if (libro.estado !== 'ACTIVO') {
      throw new ErrorAplicacion(409, 'La ficha está dada de baja; no admite ejemplares nuevos');
    }
    const camposFaltantes = [];
    const datosEjemplar = leerDatosEjemplar(req.body ?? {}, libro.clave_libro, camposFaltantes);
    if (camposFaltantes.length > 0) {
      throw new ErrorAplicacion(400, MENSAJE_CAMPOS_OBLIGATORIOS, { campos: camposFaltantes });
    }
    if (!esClaveValida(datosEjemplar.clasificacion)) {
      throw new ErrorAplicacion(400, 'Código de clasificación inválido', {
        campos: ['Código de clasificación'],
      });
    }
    const { tipoUso } = await resolverCatalogos(null, datosEjemplar.tipoUso);

    const claves = await ejecutarTransaccion(async (cliente) => {
      await libroModelo.bloquearLibro(cliente, libro.libro_id);
      const clavesEjemplar = await decidirClavesEjemplar(
        cliente,
        libro.libro_id,
        libro.clave_libro,
        datosEjemplar,
      );
      await registrarEjemplares(
        cliente,
        req.usuario.usuario_id,
        libro.libro_id,
        datosEjemplar,
        tipoUso.tipo_uso_id,
        clavesEjemplar,
      );
      await bitacoraModelo.registrarEvento(
        {
          actorUsuarioId: req.usuario.usuario_id,
          accion: 'ALTA_EJEMPLAR',
          entidad: 'ejemplar',
          claveRegistro: libro.clave_libro,
          detalle: { ejemplares: clavesEjemplar },
          ip: req.ip,
        },
        cliente,
      );
      return clavesEjemplar;
    });

    const mensaje =
      claves.length === 1
        ? 'Ejemplar registrado exitosamente'
        : `${claves.length} ejemplares registrados exitosamente`;
    res.status(201).json(await construirRespuestaAlta(mensaje, libro.clave_libro, claves));
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Modificar Título, Autor, Tema, Editorial, ISBN y demás datos bibliográficos sin
 *   cambiar claves, estados, clasificación, ubicación ni historial (HULIB03 escenarios 1 y 3).
 *   Si cambia el Título, se actualiza en las etiquetas de sus ejemplares.
 * @param {Object} req - Petición HTTP. Cuerpo: los campos a cambiar.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function putLibro(req, res, next) {
  try {
    const cuerpo = req.body ?? {};
    const libro = await obtenerLibroDeRuta(req);
    if (libro.estado !== 'ACTIVO') {
      throw new ErrorAplicacion(409, 'El libro está dado de baja; sus datos no se modifican');
    }
    if (tieneCampo(cuerpo, 'clave') && normalizarClave(cuerpo.clave) !== libro.clave_libro) {
      throw new ErrorAplicacion(400, 'La Clave de libro no se puede modificar', {
        campos: ['Clave'],
      });
    }

    // Los campos que no llegan conservan su valor actual
    const actuales = {
      titulo: libro.titulo,
      autor: unirAutores(libro.autores),
      tema: libro.tema,
      editorial: libro.editorial,
      isbn: libro.isbn,
      descripcion: libro.descripcion,
      edicion: libro.edicion,
      anio: libro.anio,
      precioCompra: libro.precio_compra,
    };
    const capturados = { ...actuales };
    for (const campo of [...Object.keys(actuales), 'autores']) {
      if (tieneCampo(cuerpo, campo)) {
        capturados[campo] = cuerpo[campo];
      }
    }
    const camposFaltantes = [];
    const ficha = leerDatosBibliograficos(capturados, camposFaltantes);
    if (camposFaltantes.length > 0) {
      throw new ErrorAplicacion(400, MENSAJE_CAMPOS_OBLIGATORIOS, { campos: camposFaltantes });
    }
    // El tema se compara con su nombre registrado ("literatura" equivale a "Literatura")
    const { tema } = await resolverCatalogos(ficha.tema, null);

    const nuevos = {
      titulo: ficha.titulo,
      autor: unirAutores(
        ficha.autores.map((autor) =>
          [autor.primerNombre, autor.primerApellido].filter(Boolean).join(' '),
        ),
      ),
      tema: tema.nombre,
      editorial: ficha.editorial,
      isbn: ficha.isbn,
      descripcion: ficha.descripcion,
      edicion: ficha.edicion,
      anio: ficha.anio,
      precioCompra: ficha.precioCompra,
    };
    const anterior = {};
    const nuevo = {};
    for (const campo of Object.keys(nuevos)) {
      const valorAnterior =
        campo === 'precioCompra' && actuales[campo] !== null
          ? Number(actuales[campo])
          : actuales[campo];
      if (nuevos[campo] !== valorAnterior) {
        anterior[campo] = valorAnterior;
        nuevo[campo] = nuevos[campo];
      }
    }
    if (Object.keys(nuevo).length === 0) {
      res.json(libroVista.formatearOperacion('No hay cambios por guardar', { libro }));
      return;
    }

    const cambiaTitulo = Object.hasOwn(nuevo, 'titulo');
    if (cambiaTitulo && !req.usuario.permisos.includes('ETIQUETAR_EJEMPLARES')) {
      throw new ErrorAplicacion(
        403,
        'Para cambiar el Título también necesita el permiso "Etiquetar ejemplares"',
      );
    }
    if (ficha.isbn && Object.hasOwn(nuevo, 'isbn')) {
      const claveConIsbn = await libroModelo.obtenerClavePorIsbn(ficha.isbn, libro.libro_id);
      if (claveConIsbn) {
        throw new ErrorAplicacion(409, `El ISBN ya está registrado en la ficha ${claveConIsbn}`, {
          campos: ['ISBN'],
        });
      }
    }
    const etiquetasActualizadas = await ejecutarTransaccion(async (cliente) => {
      await libroModelo.bloquearLibro(cliente, libro.libro_id);
      const editorialId = await catalogoModelo.obtenerOCrearEditorial(cliente, ficha.editorial);
      await libroModelo.actualizarLibro(cliente, libro.libro_id, {
        ...ficha,
        categoriaId: tema.categoria_id,
        editorialId,
      });
      if (Object.hasOwn(nuevo, 'autor')) {
        const autorIds = [];
        for (const autor of ficha.autores) {
          const autorId = await catalogoModelo.obtenerOCrearAutor(cliente, autor);
          if (!autorIds.includes(autorId)) {
            autorIds.push(autorId);
          }
        }
        await libroModelo.reemplazarAutores(cliente, libro.libro_id, autorIds);
      }

      // El Título nuevo se refleja en las etiquetas; queda registrado en cada ejemplar activo
      let totalEtiquetas = 0;
      if (cambiaTitulo) {
        const ejemplares = await ejemplarModelo.listarEjemplaresDeLibro(libro.libro_id, cliente);
        for (const ejemplar of ejemplares.filter((e) => e.estado !== 'DADO_DE_BAJA')) {
          await ejemplarModelo.registrarMovimiento(cliente, {
            ejemplarId: ejemplar.ejemplar_id,
            operadorId: req.usuario.usuario_id,
            tipo: 'ETIQUETA',
            anterior: { titulo: libro.titulo },
            nuevo: { titulo: ficha.titulo },
          });
          totalEtiquetas++;
        }
      }
      await bitacoraModelo.registrarEvento(
        {
          actorUsuarioId: req.usuario.usuario_id,
          accion: 'CAMBIO_LIBRO',
          entidad: 'libro',
          claveRegistro: libro.clave_libro,
          detalle: { anterior, nuevo },
          ip: req.ip,
        },
        cliente,
      );
      return totalEtiquetas;
    });

    const libroActualizado = await libroModelo.obtenerLibroPorClave(libro.clave_libro);
    res.json(
      libroVista.formatearOperacion('Información bibliográfica actualizada exitosamente', {
        etiquetasActualizadas,
        libro: libroActualizado,
      }),
    );
  } catch (err) {
    next(err);
  }
}

/**
 * Objetivo: Dar de baja el libro completo y todos sus ejemplares sin borrar registros ni
 *   historial (botón "Dar de baja libro completo" del front). Se rechaza si algún ejemplar
 *   tiene un préstamo activo.
 * @param {Object} req - Petición HTTP. Cuerpo: motivo, observaciones?.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Envía el error al middleware de errores.
 * @returns {Promise<void>}
 */
async function postBajaLibro(req, res, next) {
  try {
    const motivo = normalizarMotivoBaja(req.body?.motivo);
    const observaciones = limpiarTexto(req.body?.observaciones) || null;
    if (!motivo) {
      throw new ErrorAplicacion(400, MENSAJE_CAMPOS_OBLIGATORIOS, { campos: ['Motivo de baja'] });
    }
    if (motivo === 'OTRO' && !observaciones) {
      throw new ErrorAplicacion(400, 'Describa el motivo en Observaciones', {
        campos: ['Observaciones'],
      });
    }

    const libro = await ejecutarTransaccion(async (cliente) => {
      const ficha = await obtenerLibroDeRuta(req, cliente);
      await libroModelo.bloquearLibro(cliente, ficha.libro_id);
      if (ficha.estado !== 'ACTIVO') {
        throw new ErrorAplicacion(409, 'El libro ya está dado de baja', {
          bajaAnterior: { fecha: ficha.fecha_baja, motivo: ficha.motivo_baja },
        });
      }
      const prestamos = await prestamoModelo.obtenerPrestamosActivosDeLibro(
        ficha.libro_id,
        cliente,
      );
      if (prestamos.length > 0) {
        throw new ErrorAplicacion(
          409,
          'No se puede dar de baja: hay ejemplares con préstamo activo',
          {
            prestamos: prestamos.map((prestamo) => ({
              folio: prestamo.folio,
              claveEjemplar: prestamo.codigo_ejemplar,
              fechaDevolucion: prestamo.fecha_vencimiento,
            })),
          },
        );
      }

      const ejemplares = await ejemplarModelo.listarEjemplaresDeLibro(ficha.libro_id, cliente);
      for (const ejemplar of ejemplares.filter((e) => e.estado !== 'DADO_DE_BAJA')) {
        await ejemplarModelo.darDeBajaEjemplar(cliente, ejemplar.ejemplar_id, {
          motivo,
          detalle: observaciones,
          operadorId: req.usuario.usuario_id,
        });
        await ejemplarModelo.registrarMovimiento(cliente, {
          ejemplarId: ejemplar.ejemplar_id,
          operadorId: req.usuario.usuario_id,
          tipo: 'BAJA',
          motivo,
          observaciones,
          anterior: { estado: ejemplar.estado },
          nuevo: { estado: 'DADO_DE_BAJA' },
        });
      }
      const textoMotivo = [MOTIVOS_BAJA[motivo], observaciones].filter(Boolean).join(': ');
      await libroModelo.darDeBajaLibro(cliente, ficha.libro_id, textoMotivo);
      await bitacoraModelo.registrarEvento(
        {
          actorUsuarioId: req.usuario.usuario_id,
          accion: 'BAJA_LIBRO',
          entidad: 'libro',
          claveRegistro: ficha.clave_libro,
          detalle: { motivo, observaciones },
          ip: req.ip,
        },
        cliente,
      );
      return ficha;
    });

    const libroActualizado = await libroModelo.obtenerLibroPorClave(libro.clave_libro);
    res.json(
      libroVista.formatearOperacion(
        'Libro y ejemplares dados de baja; se conservan sus registros e historial',
        { libro: libroActualizado },
      ),
    );
  } catch (err) {
    next(err);
  }
}

export {
  getLibro,
  getEtiquetasDeLibro,
  getHistorial,
  postLibro,
  postEjemplar,
  putLibro,
  postBajaLibro,
};
