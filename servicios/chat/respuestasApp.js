// Respuestas de ayuda disponibles también cuando el servicio de IA no está configurado.
const GUIA = new Map([
  [
    'cual es el objetivo de biblioteca ducky',
    'Biblioteca Ducky centraliza la gestión de la biblioteca para agilizar sus operaciones y facilitar la búsqueda y localización del material.',
  ],
  [
    'que incluye el sistema',
    'El sistema abarca el catálogo y los ejemplares, usuarios y permisos, préstamos y boletas, renovaciones, lista de espera, devoluciones, multas por atraso, reposiciones, comprobantes de pago, suspensiones, reportes de inventario y adquisiciones. Las funciones dependen de su perfil. Los avisos sin canal institucional configurado son de prueba.',
  ],
  [
    'en que plataforma puedo usarlo',
    'Biblioteca Ducky es una aplicación web. Puede abrirla en un navegador desde su computadora, tableta o celular e iniciar sesión con su matrícula o nómina y contraseña.',
  ],
  [
    'como funciona la lista de espera',
    'Si los ejemplares de préstamo externo están ocupados, puede inscribirse desde el detalle del libro o Mi cuenta. Allí puede consultar su posición. El personal de ventanilla atiende los turnos en orden.',
  ],
]);

export function respuestaApp(pregunta) {
  const clave = pregunta
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[¿?!.]/g, '')
    .trim();
  return GUIA.get(clave);
}
