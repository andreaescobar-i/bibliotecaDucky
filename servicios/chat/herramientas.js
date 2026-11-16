/*----
 * Programa: herramientas.js
 * Objetivo: Consultas preparadas que el asistente Ducky puede pedir para responder. Gemini solo
 *           elige cuál usar y con qué valores; el SQL está escrito en los modelos y nunca lo
 *           redacta la IA
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 15 de Noviembre de 2026
 */

import * as chatConsultaModelo from '../../modelos/chatConsultaModelo.js';
import * as prestamoModelo from '../../modelos/prestamoModelo.js';
import * as adeudoModelo from '../../modelos/adeudoModelo.js';
import { limpiarTexto } from '../../utilidades/validacion.js';
import { reloj } from '../../utilidades/reloj.js';

const MAX_LIBROS = 10; // Fichas que se devuelven por búsqueda
const MAX_CARACTERES_FILTRO = 100; // Largo máximo de cada valor que envía el modelo
const MAX_PALABRAS = 6; // Palabras del texto libre que se toman en cuenta
const LARGO_MINIMO_PALABRA = 3; // Se ignoran "de", "la", "el"...
const LARGO_MINIMO_RAIZ = 4; // Las palabras cortas se buscan completas
// Palabras que no ayudan a encontrar un libro y que harían fallar la búsqueda
const PALABRAS_IGNORADAS = new Set([
  'los',
  'las',
  'del',
  'una',
  'uno',
  'unos',
  'unas',
  'que',
  'con',
  'por',
  'para',
  'sobre',
  'algo',
  'algun',
  'alguna',
  'libro',
  'libros',
  'tema',
  'temas',
  'acerca',
]);
const ZONA_HORARIA = 'America/Mexico_City';

const PERMISO_LIBROS = 'CONSULTAR_LIBROS';
const PERMISO_UBICACION = 'CONSULTAR_UBICACION';
const SIN_PERMISO_LIBROS = 'El perfil de este usuario no tiene permiso para consultar libros.';
const SIN_PERMISO_UBICACION = 'No disponible: el perfil no tiene permiso de consultar ubicación';
const ESTADOS_EJEMPLAR = Object.freeze({ DISPONIBLE: 'Disponible', PRESTADO: 'Prestado' });

/**
 * Error al consultar la base de datos. El controlador responde que no fue posible consultar,
 * en lugar de dejar que el modelo conteste sin datos.
 */
class ErrorConsulta extends Error {
  /**
   * @param {string} mensaje - Detalle técnico para la consola del servidor.
   */
  constructor(mensaje) {
    super(mensaje);
    this.name = 'ErrorConsulta';
  }
}

// Lo que Gemini conoce de cada consulta: nombre, cuándo usarla y qué valores acepta
const DECLARACIONES = Object.freeze([
  {
    name: 'buscar_libros',
    description:
      'Busca libros del catálogo de la biblioteca y devuelve, por cada uno, cuántos ejemplares ' +
      `hay disponibles y registrados. Devuelve como máximo ${MAX_LIBROS} libros. Úsala para ` +
      'saber si la biblioteca tiene un libro, qué libros hay de un autor, tema o editorial, y ' +
      'si hay ejemplares disponibles. Los filtros ignoran mayúsculas y acentos y se combinan: ' +
      'un libro debe cumplir todos. Sin filtros lista los primeros libros del catálogo.',
    parametersJsonSchema: {
      type: 'object',
      properties: {
        texto: {
          type: 'string',
          description:
            'Palabras clave que se buscan en título, autor, tema, editorial y descripción. ' +
            'Usa pocas palabras significativas, sin artículos.',
        },
        titulo: { type: 'string', description: 'Parte del título.' },
        autor: { type: 'string', description: 'Nombre o apellido del autor.' },
        tema: { type: 'string', description: 'Tema del catálogo, por ejemplo Literatura.' },
        editorial: { type: 'string', description: 'Nombre de la editorial.' },
        solo_disponibles: {
          type: 'boolean',
          description: 'true para listar solo libros con al menos un ejemplar disponible.',
        },
      },
    },
  },
  {
    name: 'consultar_libro',
    description:
      'Devuelve la ficha completa de un libro a partir de su Clave de libro exacta (por ' +
      'ejemplo LIT-863-RUL) y la lista de sus ejemplares con estado, tipo de uso y ubicación. ' +
      'Úsala después de buscar_libros para dar detalles, ubicación o saber si se puede sacar ' +
      'de la biblioteca.',
    parametersJsonSchema: {
      type: 'object',
      properties: { clave: { type: 'string', description: 'Clave de libro exacta.' } },
      required: ['clave'],
    },
  },
  {
    name: 'consultar_ejemplar',
    description:
      'Devuelve un ejemplar (copia física) a partir de su código exacto (por ejemplo ' +
      'LIT-863-RUL-E01): estado, tipo de uso y ubicación.',
    parametersJsonSchema: {
      type: 'object',
      properties: { codigo: { type: 'string', description: 'Código exacto del ejemplar.' } },
      required: ['codigo'],
    },
  },
  {
    name: 'listar_temas_y_tipos_de_uso',
    description:
      'Devuelve los temas del catálogo con el número de libros de cada uno y los tipos de uso ' +
      'de los ejemplares (cuáles pueden salir de la biblioteca).',
    parametersJsonSchema: { type: 'object', properties: {} },
  },
  {
    name: 'consultar_reglas_de_prestamo',
    description:
      'Devuelve, por tipo de usuario, cuántos días hábiles dura un préstamo y cuántas ' +
      'renovaciones se permiten.',
    parametersJsonSchema: { type: 'object', properties: {} },
  },
  {
    name: 'consultar_mi_cuenta',
    description:
      'Devuelve los préstamos activos (con fecha de vencimiento) y los adeudos pendientes de ' +
      'la persona que está preguntando. No recibe parámetros y no puede consultar la cuenta ' +
      'de otra persona.',
    parametersJsonSchema: { type: 'object', properties: {} },
  },
]);

/**
 * Objetivo: Limpiar un valor de texto enviado por el modelo y acotar su largo.
 * @param {unknown} valor - Valor recibido.
 * @returns {string} Texto limpio, o '' si no es texto.
 */
function limpiarFiltro(valor) {
  return limpiarTexto(valor).slice(0, MAX_CARACTERES_FILTRO);
}

/**
 * Objetivo: Reducir una palabra a su raíz quitando plural y género, para que "mexicanos"
 *   encuentre "mexicana" y "algoritmo" encuentre "algoritmos".
 * @param {string} palabra - Palabra del texto libre.
 * @returns {string} Raíz en minúsculas y sin acentos.
 * Limitaciones: Es una regla sencilla del español, no un análisis del idioma.
 */
function obtenerRaiz(palabra) {
  let raiz = palabra
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  if (raiz.length > LARGO_MINIMO_RAIZ + 1 && raiz.endsWith('es')) {
    raiz = raiz.slice(0, -2);
  } else if (raiz.length > LARGO_MINIMO_RAIZ && raiz.endsWith('s')) {
    raiz = raiz.slice(0, -1);
  }
  if (raiz.length > LARGO_MINIMO_RAIZ && /[aeo]$/.test(raiz)) {
    raiz = raiz.slice(0, -1);
  }
  return raiz;
}

/**
 * Objetivo: Separar el texto libre en palabras significativas.
 * @param {unknown} texto - Texto libre enviado por el modelo.
 * @returns {{ original: string, raiz: string }[]} Palabras de al menos tres caracteres, sin
 *   repetir, con la raíz que se busca en los textos.
 */
function separarPalabras(texto) {
  const palabras = limpiarFiltro(texto)
    .split(/[\s,.;:¿?¡!"()]+/)
    .filter(
      (palabra) =>
        palabra.length >= LARGO_MINIMO_PALABRA && !PALABRAS_IGNORADAS.has(palabra.toLowerCase()),
    );
  return [...new Set(palabras)]
    .slice(0, MAX_PALABRAS)
    .map((palabra) => ({ original: palabra, raiz: obtenerRaiz(palabra) }));
}

/**
 * Objetivo: Describir en una frase la disponibilidad de una ficha.
 * @param {Object} libro - Fila de chat.libro.
 * @returns {string} Disponibilidad.
 */
function describirDisponibilidad(libro) {
  if (libro.ejemplares_registrados === 0) {
    return 'Sin ejemplares registrados';
  }
  return libro.ejemplares_disponibles > 0 ? 'Disponible' : 'Sin ejemplares disponibles';
}

/**
 * Objetivo: Resumir una ficha para una lista de resultados.
 * @param {Object} libro - Fila de chat.libro.
 * @returns {Object} Datos principales de la ficha.
 */
function resumirLibro(libro) {
  return {
    clave: libro.clave_libro,
    titulo: libro.titulo,
    autores: libro.autores,
    tema: libro.tema,
    editorial: libro.editorial,
    ejemplaresDisponibles: libro.ejemplares_disponibles,
    ejemplaresRegistrados: libro.ejemplares_registrados,
    disponibilidad: describirDisponibilidad(libro),
  };
}

/**
 * Objetivo: Describir la ubicación de un ejemplar tal como está registrada; nunca se toma de
 *   otra copia.
 * @param {Object} ejemplar - Fila de chat.ejemplar.
 * @param {boolean} puedeVerUbicacion - true si el perfil tiene "Consultar ubicación".
 * @returns {string} Ubicación.
 */
function describirUbicacion(ejemplar, puedeVerUbicacion) {
  if (!puedeVerUbicacion) {
    return SIN_PERMISO_UBICACION;
  }
  if (!ejemplar.librero && !ejemplar.fila) {
    return 'No registrada';
  }
  return `Librero ${ejemplar.librero ?? 'no registrado'}, fila ${ejemplar.fila ?? 'no registrada'}`;
}

/**
 * Objetivo: Formatear un ejemplar para el modelo.
 * @param {Object} ejemplar - Fila de chat.ejemplar.
 * @param {boolean} puedeVerUbicacion - true si el perfil tiene "Consultar ubicación".
 * @returns {Object} Código, estado, tipo de uso y ubicación.
 */
function formatearEjemplar(ejemplar, puedeVerUbicacion) {
  return {
    codigo: ejemplar.codigo_ejemplar,
    estado: ESTADOS_EJEMPLAR[ejemplar.estado] ?? ejemplar.estado,
    tipoUso: ejemplar.tipo_uso,
    puedeSalirDeLaBiblioteca: ejemplar.permite_prestamo,
    clasificacion: ejemplar.clave_clasificacion,
    ubicacion: describirUbicacion(ejemplar, puedeVerUbicacion),
  };
}

/**
 * Objetivo: Formatear una fecha como la lee una persona, en la hora del centro de México.
 * @param {Date} fecha - Fecha a formatear.
 * @returns {string} Por ejemplo "27 de octubre de 2026".
 */
function formatearFecha(fecha) {
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'long', timeZone: ZONA_HORARIA }).format(
    fecha,
  );
}

/**
 * Objetivo: Buscar libros con los filtros que eligió el modelo.
 * @param {Object} argumentos - texto, titulo, autor, tema, editorial y solo_disponibles.
 * @returns {Promise<Object>} Total de coincidencias y hasta MAX_LIBROS fichas resumidas.
 */
async function buscarLibros(argumentos) {
  const filtros = {
    titulo: limpiarFiltro(argumentos.titulo),
    autor: limpiarFiltro(argumentos.autor),
    tema: limpiarFiltro(argumentos.tema),
    editorial: limpiarFiltro(argumentos.editorial),
    palabras: separarPalabras(argumentos.texto),
    soloDisponibles: argumentos.solo_disponibles === true,
  };
  const { total, libros } = await chatConsultaModelo.buscarLibros(filtros, MAX_LIBROS);
  return {
    totalCoincidencias: total,
    librosMostrados: libros.length,
    libros: libros.map(resumirLibro),
    ...(total === 0 ? { nota: 'Ningún libro del catálogo coincide con esos filtros.' } : {}),
    ...(total > libros.length
      ? { nota: `Solo se muestran los primeros ${libros.length}; conviene afinar la búsqueda.` }
      : {}),
  };
}

/**
 * Objetivo: Obtener la ficha completa de un libro con sus ejemplares.
 * @param {Object} argumentos - clave.
 * @param {boolean} puedeVerUbicacion - true si el perfil tiene "Consultar ubicación".
 * @returns {Promise<Object>} Ficha y ejemplares, o el aviso de que no existe.
 */
async function consultarLibro(argumentos, puedeVerUbicacion) {
  const clave = limpiarFiltro(argumentos.clave).toUpperCase();
  if (!clave) {
    return { error: 'Falta la Clave de libro.' };
  }
  const libro = await chatConsultaModelo.obtenerLibro(clave);
  if (!libro) {
    return { encontrado: false, nota: `No hay un libro activo con la clave ${clave}.` };
  }
  const ejemplares = await chatConsultaModelo.listarEjemplaresDeLibro(clave);
  return {
    encontrado: true,
    libro: {
      ...resumirLibro(libro),
      isbn: libro.isbn ?? 'No registrado',
      edicion: libro.edicion ?? 'No registrada',
      anio: libro.anio ?? 'No registrado',
      descripcion: libro.descripcion ?? 'No registrada',
    },
    ejemplares: ejemplares.map((ejemplar) => formatearEjemplar(ejemplar, puedeVerUbicacion)),
  };
}

/**
 * Objetivo: Obtener un ejemplar por su código.
 * @param {Object} argumentos - codigo.
 * @param {boolean} puedeVerUbicacion - true si el perfil tiene "Consultar ubicación".
 * @returns {Promise<Object>} Ejemplar, o el aviso de que no existe.
 */
async function consultarEjemplar(argumentos, puedeVerUbicacion) {
  const codigo = limpiarFiltro(argumentos.codigo).toUpperCase();
  if (!codigo) {
    return { error: 'Falta el código del ejemplar.' };
  }
  const ejemplar = await chatConsultaModelo.obtenerEjemplar(codigo);
  if (!ejemplar) {
    return {
      encontrado: false,
      nota: `No hay un ejemplar en circulación con el código ${codigo}.`,
    };
  }
  return {
    encontrado: true,
    claveLibro: ejemplar.clave_libro,
    titulo: ejemplar.titulo,
    ...formatearEjemplar(ejemplar, puedeVerUbicacion),
  };
}

/**
 * Objetivo: Listar temas y tipos de uso del catálogo.
 * @returns {Promise<Object>} Temas con su número de libros y tipos de uso.
 */
async function listarTemasYTiposDeUso() {
  const [temas, tiposUso] = await Promise.all([
    chatConsultaModelo.listarTemas(),
    chatConsultaModelo.listarTiposUso(),
  ]);
  return {
    temas: temas.map((tema) => ({ nombre: tema.nombre, libros: tema.libros })),
    tiposDeUso: tiposUso.map((tipo) => ({
      nombre: tipo.nombre,
      puedeSalirDeLaBiblioteca: tipo.permite_prestamo,
      descripcion: tipo.descripcion,
    })),
  };
}

/**
 * Objetivo: Listar las reglas de préstamo por tipo de usuario.
 * @returns {Promise<Object>} Días hábiles y renovaciones máximas.
 */
async function consultarReglasDePrestamo() {
  const reglas = await chatConsultaModelo.listarReglasPrestamo();
  return {
    reglas: reglas.map((regla) => ({
      aplicaA: regla.roles || regla.nombre,
      diasHabilesDePrestamo: regla.dias_habiles,
      renovacionesMaximas: regla.max_renovaciones,
    })),
  };
}

/**
 * Objetivo: Obtener los préstamos activos y los adeudos pendientes de quien pregunta.
 * @param {Object} usuario - Cuenta de la sesión (req.usuario); su id nunca lo decide el modelo.
 * @returns {Promise<Object>} Préstamos con vencimiento y adeudos con su monto.
 */
async function consultarMiCuenta(usuario) {
  const [prestamos, adeudos] = await Promise.all([
    prestamoModelo.obtenerPrestamosActivosDeUsuario(usuario.usuario_id),
    adeudoModelo.obtenerAdeudosPendientesDeUsuario(usuario.usuario_id),
  ]);
  const ahora = reloj.ahora();
  return {
    prestamosActivos: prestamos.map((prestamo) => ({
      folio: prestamo.folio,
      titulo: prestamo.titulo,
      codigoEjemplar: prestamo.codigo_ejemplar,
      vence: formatearFecha(prestamo.fecha_vencimiento),
      vencido: prestamo.fecha_vencimiento < ahora,
    })),
    adeudosPendientes: adeudos.map((adeudo) => ({
      folioPrestamo: adeudo.folio,
      tipo: adeudo.tipo === 'MULTA' ? 'Multa' : 'Reposición',
      concepto: adeudo.concepto,
      montoMxn: Number(adeudo.monto_mxn),
    })),
    totalAdeudoMxn: adeudos.reduce((suma, adeudo) => suma + Number(adeudo.monto_mxn), 0),
  };
}

// Consultas del catálogo: exigen el permiso "Consultar libros" y el usuario de solo lectura
const CONSULTAS_CATALOGO = Object.freeze({
  buscar_libros: buscarLibros,
  consultar_libro: consultarLibro,
  consultar_ejemplar: consultarEjemplar,
  listar_temas_y_tipos_de_uso: listarTemasYTiposDeUso,
  consultar_reglas_de_prestamo: consultarReglasDePrestamo,
});

/**
 * Objetivo: Ejecutar la consulta que pidió el modelo, con los permisos de quien pregunta.
 * @param {string} nombre - Nombre de la consulta (una de DECLARACIONES).
 * @param {Object} argumentos - Valores elegidos por el modelo; se validan como datos externos.
 * @param {Object} usuario - Cuenta de la sesión (req.usuario) con usuario_id y permisos.
 * @returns {Promise<Object>} Resultado para el modelo. Un problema esperado (consulta
 *   desconocida, falta de permiso, dato faltante) se devuelve como { error }.
 * Limitaciones: Si la base de datos falla lanza ErrorConsulta.
 */
async function ejecutarHerramienta(nombre, argumentos, usuario) {
  const valores = argumentos && typeof argumentos === 'object' ? argumentos : {};
  try {
    if (nombre === 'consultar_mi_cuenta') {
      return await consultarMiCuenta(usuario);
    }
    const consulta = CONSULTAS_CATALOGO[nombre];
    if (!consulta) {
      return { error: `La consulta "${nombre}" no existe.` };
    }
    if (!usuario.permisos.includes(PERMISO_LIBROS)) {
      return { error: SIN_PERMISO_LIBROS };
    }
    if (!chatConsultaModelo.estaConfigurado()) {
      throw new ErrorConsulta('Falta CHAT_PGUSER o CHAT_PGPASSWORD en .env');
    }
    return await consulta(valores, usuario.permisos.includes(PERMISO_UBICACION));
  } catch (err) {
    if (err instanceof ErrorConsulta) {
      throw err;
    }
    throw new ErrorConsulta(`${nombre}: ${err.message}`);
  }
}

export { DECLARACIONES, ErrorConsulta, ejecutarHerramienta };
