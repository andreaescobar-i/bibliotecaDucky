# Biblioteca Ducky · React

Conversión del archivo Figma `ChnBUODzzXq3usFLztez3C` a React + TypeScript + Vite, con CSS local y recursos originales descargados. Incluye 21 pantallas y 33 ventanas de diálogo, con un explorador para acceder a todas.

## Ejecutar

Usa Node.js 22.12 o posterior. Desde esta carpeta:

```bash
npm install
npm run dev
```

Abre la dirección que indica Vite. Para generar y revisar la compilación:

```bash
npm run build
npm run preview
```

La carpeta `dist/` incluida contiene la compilación estática. Debe servirse mediante HTTP; no abrir `index.html` directamente con `file://`.

## Probar los roles

En el formulario de acceso introduce cualquier usuario y contraseña de demostración, elige el rol y pulsa **Ingresar**. No utilices credenciales reales: este acceso es una simulación local. También puedes cambiar de rol desde **Explorar prototipo**, en la esquina inferior izquierda.

Los seis roles son Alumno, Maestro, Colaborador, Bibliotecario, Administrador y Comprador de libros. Alumno, Maestro y Colaborador comparten catálogo y cuenta; los roles de gestión tienen sus propias pantallas y menús.

## Flujos implementados

- Catálogo con búsqueda, criterios, ordenación, paginación, ficha, vista de muestra del documento e impresión del navegador.
- Cuenta con préstamos y solicitudes de renovación.
- Validación de usuario y libro, registro de préstamo y recibo; devolución y autorización de renovaciones.
- Multas, registro de comprobantes y reporte de libros perdidos.
- Alta, edición, asignación de roles, baja y reactivación de usuarios.
- Alta y edición de libros, clasificación, etiquetas, ejemplares, bajas e historial.
- Solicitudes de libros, revisión, autorización simulada de Tesorería, recepción y entrega al catálogo.
- Reportes visuales, exportación CSV y consulta de perfiles.
- Ayuda local de Ducky con respuestas predefinidas.

Los cambios se conservan en `localStorage` bajo `ducky-data-v1`; el rol se conserva en `sessionStorage`. **Restablecer demostración** restaura los registros iniciales.

## Alcance de la entrega

Es un frontend navegable con datos de demostración, sin servidor. La autenticación, los permisos seguros, los pagos, los avisos institucionales, los datos escolares y las autorizaciones reales requieren una API. El visor conserva el documento de muestra del prototipo: el archivo Figma no proporcionó PDFs de libros. Los reportes iniciales conservan los indicadores ilustrativos de Figma.

El conjunto inicial usa los cinco libros que aparecen en las filas del diseño. Los contadores se ajustan a esos registros y a los que se agreguen; la paginación avanza cuando existen más de cinco. Las fechas de muestra originales se conservan en las vistas ilustrativas y los nuevos préstamos calculan días hábiles desde la fecha actual.

## Código

- `src/screens/`: vistas React identificadas por el nodo original de Figma, con sus atributos `data-node-id` para facilitar la trazabilidad.
- `src/App.tsx`: navegación, ventanas y acciones.
- `src/design-controls.tsx`: formularios accesibles, tablas y registros dinámicos.
- `src/model.ts`: datos de demostración y persistencia.
- `src/design.css`: estilos extraídos y adaptados del diseño, sin dependencia de Tailwind.
- `src/app.css`: interacciones y adaptación a distintos tamaños de pantalla.
- `public/assets/`: imágenes, SVG y tipografía local. No se utilizan URLs temporales de Figma en ejecución.

La tipografía Poppins procede de Google Fonts; los logotipos e iconos proceden del archivo proporcionado. Se incluye la licencia de Poppins en `public/assets/OFL-Poppins.txt`.
