/*----
 * Programa: listadoVista.js
 * Objetivo: Generar el listado de libros en PDF y en una página lista para imprimir (HULIS01
 *           escenario 6), con los filtros aplicados, encabezados, filas y total
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import PDFDocument from 'pdfkit';

const TITULO_LISTADO = 'Listado de libros · Biblioteca Universidad Ducky';
const MARGEN = 36; // Puntos (media pulgada)
const TAMANO_LETRA = 8;
const ESPACIO_CELDA = 3;

// Columnas del listado con su ancho en puntos (hoja carta horizontal: 720 útiles)
const COLUMNAS = Object.freeze([
  { titulo: 'Clave', campo: 'clave', ancho: 82 },
  { titulo: 'Título', campo: 'titulo', ancho: 170 },
  { titulo: 'Autor', campo: 'autor', ancho: 130 },
  { titulo: 'Tema', campo: 'tema', ancho: 70 },
  { titulo: 'ISBN', campo: 'isbn', ancho: 80 },
  { titulo: 'Editorial', campo: 'editorial', ancho: 120 },
  { titulo: 'Disp.', campo: 'ejemplaresDisponibles', ancho: 38 },
]);

/**
 * Objetivo: Describir en una línea los filtros aplicados.
 * @param {{ nombre: string, valor: string }[]} filtros - Filtros descritos por consultaVista.
 * @returns {string} Texto de filtros, o "Sin filtros".
 */
function textoFiltros(filtros) {
  return filtros.length > 0
    ? `Filtros: ${filtros.map((filtro) => `${filtro.nombre}: "${filtro.valor}"`).join(' · ')}`
    : 'Sin filtros';
}

/**
 * Objetivo: Dibujar una fila de la tabla y devolver su altura.
 * @param {PDFDocument} documento - Documento PDF.
 * @param {string[]} celdas - Texto de cada columna.
 * @param {number} y - Posición vertical de la fila.
 * @param {boolean} esEncabezado - true para la fila de encabezados.
 * @returns {number} Altura que ocupó la fila.
 */
function dibujarFila(documento, celdas, y, esEncabezado) {
  documento.font(esEncabezado ? 'Helvetica-Bold' : 'Helvetica').fontSize(TAMANO_LETRA);
  const alturas = celdas.map((texto, indice) =>
    documento.heightOfString(texto, { width: COLUMNAS[indice].ancho - ESPACIO_CELDA * 2 }),
  );
  const altura = Math.max(...alturas) + ESPACIO_CELDA * 2;
  let x = MARGEN;
  celdas.forEach((texto, indice) => {
    documento.text(texto, x + ESPACIO_CELDA, y + ESPACIO_CELDA, {
      width: COLUMNAS[indice].ancho - ESPACIO_CELDA * 2,
    });
    x += COLUMNAS[indice].ancho;
  });
  documento
    .moveTo(MARGEN, y + altura)
    .lineTo(x, y + altura)
    .lineWidth(esEncabezado ? 1 : 0.3)
    .stroke();
  return altura;
}

/**
 * Objetivo: Generar el PDF completo en memoria. Si algo falla no se entrega un archivo a medias.
 * @param {Object} listado - Resultado de consultaVista.formatearListado().
 * @param {Date} fecha - Fecha y hora de generación.
 * @returns {Promise<Buffer>} Contenido del PDF.
 */
function crearPdf(listado, fecha) {
  return new Promise((resolve, reject) => {
    const documento = new PDFDocument({
      size: 'LETTER',
      layout: 'landscape',
      margin: MARGEN,
      info: { Title: TITULO_LISTADO, Author: 'Biblioteca Universidad Ducky' },
    });
    const partes = [];
    documento.on('data', (parte) => partes.push(parte));
    documento.on('end', () => resolve(Buffer.concat(partes)));
    documento.on('error', reject);

    documento.font('Helvetica-Bold').fontSize(14).text(TITULO_LISTADO);
    documento
      .font('Helvetica')
      .fontSize(9)
      .text(`Generado: ${fecha.toLocaleString('es-MX')}`)
      .text(textoFiltros(listado.filtros))
      .text(`Total de libros: ${listado.total}`)
      .moveDown(0.8);

    const encabezados = COLUMNAS.map((columna) => columna.titulo);
    const limiteInferior = documento.page.height - MARGEN;
    let y = documento.y;
    y += dibujarFila(documento, encabezados, y, true);
    for (const libro of listado.libros) {
      const celdas = COLUMNAS.map((columna) => String(libro[columna.campo] ?? ''));
      // Si la fila no cabe, se pasa a otra hoja repitiendo los encabezados
      documento.font('Helvetica').fontSize(TAMANO_LETRA);
      const alturaEstimada =
        Math.max(
          ...celdas.map((texto, indice) =>
            documento.heightOfString(texto, { width: COLUMNAS[indice].ancho - ESPACIO_CELDA * 2 }),
          ),
        ) +
        ESPACIO_CELDA * 2;
      if (y + alturaEstimada > limiteInferior) {
        documento.addPage();
        y = MARGEN;
        y += dibujarFila(documento, encabezados, y, true);
      }
      y += dibujarFila(documento, celdas, y, false);
    }
    documento.end();
  });
}

/**
 * Objetivo: Escapar texto para insertarlo en HTML.
 * @param {unknown} valor - Texto a mostrar.
 * @returns {string} Texto seguro para HTML.
 */
function escaparHtml(valor) {
  const ENTIDADES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(valor ?? '').replace(/[&<>"']/g, (caracter) => ENTIDADES[caracter]);
}

/**
 * Objetivo: Generar una página HTML legible del listado que abre el diálogo de impresión.
 * @param {Object} listado - Resultado de consultaVista.formatearListado().
 * @param {Date} fecha - Fecha y hora de generación.
 * @param {string} nonce - Valor que autoriza el script de impresión en la política CSP.
 * @returns {string} Documento HTML completo.
 */
function crearHtml(listado, fecha, nonce) {
  const encabezados = COLUMNAS.map((columna) => `<th>${escaparHtml(columna.titulo)}</th>`).join('');
  const filas = listado.libros
    .map(
      (libro) =>
        `<tr>${COLUMNAS.map((columna) => `<td>${escaparHtml(libro[columna.campo])}</td>`).join('')}</tr>`,
    )
    .join('\n');
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>${escaparHtml(TITULO_LISTADO)}</title>
<style>
  body { font-family: Poppins, Arial, sans-serif; font-size: 12px; margin: 24px; color: #1f1f1f; }
  h1 { font-size: 18px; margin: 0 0 4px; }
  p { margin: 2px 0; color: #4b4b4b; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th, td { border-bottom: 1px solid #d4d4d4; padding: 4px 6px; text-align: left; vertical-align: top; }
  th { border-bottom: 2px solid #1f1f1f; }
  @page { size: letter landscape; margin: 12mm; }
</style>
</head>
<body>
<h1>${escaparHtml(TITULO_LISTADO)}</h1>
<p>Generado: ${escaparHtml(fecha.toLocaleString('es-MX'))}</p>
<p>${escaparHtml(textoFiltros(listado.filtros))}</p>
<p>Total de libros: ${listado.total}</p>
<table><thead><tr>${encabezados}</tr></thead><tbody>
${filas}
</tbody></table>
<script nonce="${nonce}">window.addEventListener('load', () => window.print());</script>
</body>
</html>`;
}

// Se exporta como objeto para que las pruebas puedan simular una falla al generar la salida
const generadorListado = { crearPdf, crearHtml };

export { generadorListado, escaparHtml };
