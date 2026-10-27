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

- `src/screens/`: pantallas con nombres cortos, agrupadas por rol; las vistas reutilizadas están en `compartidas/` y los diálogos en la subcarpeta `dialogos/`.
- `src/App.tsx`: coordinación de estado, ventanas y acciones.
- `src/navigation.ts`: carga de pantallas y rutas iniciales por rol.
- `src/components/`: formularios, textos dinámicos, tablas y explorador del prototipo.
- `src/context/DesignContext.ts`: estado y acciones compartidos por las vistas.
- `src/data/demo-data.ts`: registros iniciales de la demostración.
- `src/design-controls.tsx`: exportaciones compartidas para las pantallas del diseño.
- `src/model.ts`: datos de demostración y persistencia.
- `src/design.css`: estilos extraídos y adaptados del diseño, sin dependencia de Tailwind.
- `src/app.css`: interacciones y adaptación a distintos tamaños de pantalla.
- `public/assets/`: imágenes, SVG y tipografía local. No se utilizan URLs temporales de Figma en ejecución.

La tipografía Poppins procede de Google Fonts; los logotipos e iconos proceden del archivo proporcionado. Se incluye la licencia de Poppins en `public/assets/OFL-Poppins.txt`.

## Organización de pantallas

```text
src/screens/
├── administrador/     # Usuarios, Libros, Perfiles, Reportes, Solicitudes y Catálogo
│   └── dialogos/      # Edición de usuarios, roles y perfiles
├── bibliotecario/     # Préstamos, devoluciones, renovaciones, multas y catálogo
│   └── dialogos/      # Pagos, libros perdidos y lista de suspendidos
├── comprador/         # Compras
│   └── dialogos/      # Recepción y entrega al catálogo
└── compartidas/       # Inicio de sesión, catálogo de lectores, detalle y cuenta
    └── dialogos/      # Formularios y ventanas usados por varios roles
```

La carpeta indica el rol, por lo que los archivos se llaman `Usuarios.tsx`,
`Libros.tsx` o `Solicitudes.tsx`. Alumno, Maestro y Colaborador reutilizan
`compartidas/Catalogo.tsx` y `compartidas/Cuenta.tsx`. Las versiones de catálogo y
libros que tienen interfaces distintas para cada rol permanecen en su carpeta correspondiente.
Los diálogos comunes se mantienen en un solo archivo dentro de `compartidas/dialogos/`.

## Formato del código

Todos los archivos fuente usan dos espacios de sangría y formato automático con Prettier.
Después de editar, ejecuta:

```bash
npm run format
```

Para comprobar el formato sin modificar archivos y validar TypeScript y la compilación:

```bash
npm run format:check
npm run build
```

`src/manifest.json` relaciona cada identificador de ruta (`module`) con el archivo
descriptivo (`file`) y el nombre de su pantalla o diálogo. Los identificadores de ruta
y los atributos `data-node-id` conservan la referencia original de Figma.
Los recursos de `public/assets/` y los archivos generados de `dist/` quedan fuera del formateo.

## Backend (API)

La API REST vive en este mismo proyecto, junto al front: Node.js + Express + PostgreSQL con
patrón **MVC**. Usa el mismo `package.json`, módulos ES (`import`/`export`), el mismo Prettier
y las mismas pruebas con `node:test`.

```text
app.js, servidor.js      # Configuración de Express y punto de entrada
config/                  # entorno.js (.env) y db.js (DbPool y transacciones)
modelos/                 # M: consultas SQL parametrizadas ($1, $2...) — recursoModelo.js
vistas/                  # V: formato de las respuestas JSON / PDF — recursoVista.js
controladores/           # C: reglas de cada historia de usuario — recursoControlador.js
rutas/                   # URLs en kebab-case — recursoRutas.js
middlewares/             # Autenticación, permisos, validación y errores
servicios/               # Integraciones simuladas (CIAA, Capital Humano, correo)
utilidades/              # ErrorAplicacion y funciones compartidas
db/                      # reiniciarBaseDatos.js, esquema/, migraciones/, semillas/
tests/                   # Pruebas del front y de la API; tests/integracion/ usa la BD real
```

Flujo de una petición: `rutas → middlewares → controlador → modelo → vista → respuesta`.

### Primera vez

Requiere PostgreSQL 13 o posterior corriendo en tu máquina. Desde esta carpeta:

```bash
npm install
cp .env.example .env   # en Windows también puedes copiarlo a mano
```

En `.env` escribe en `PGPASSWORD` la contraseña de tu usuario `postgres`. Después:

```bash
npm run db:reset   # crea la base sigb_ducky: esquema, migración y datos de prueba
npm run test:bd    # comprueba la base: datos cargados y reglas de integridad
npm run api        # API en http://localhost:3000/api (en otra terminal: npm run dev)
```

Abre `http://localhost:3000/api/salud`: debe decir `"baseDatos": "conectada"`.
`npm run db:reset` **borra y vuelve a crear** la base; úsalo para regresar a los datos de prueba.

### Scripts del backend

| Script              | Uso                                                     |
| ------------------- | ------------------------------------------------------- |
| `npm run api`       | API con recarga automática (nodemon)                    |
| `npm run api:start` | API sin recarga                                         |
| `npm run db:reset`  | Recrea la base: esquema → migraciones → semillas        |
| `npm test`          | Pruebas del front y de la API (no necesitan BD)         |
| `npm run test:bd`   | Pruebas de integración contra la base real              |
| `npm run lint`      | ESLint con las reglas del Estándar de Codificación      |
| `npm run verificar` | Lint + formato + pruebas; ejecutar antes de cada commit |

### Base de datos

| Carpeta           | Contenido                                                               |
| ----------------- | ----------------------------------------------------------------------- |
| `db/esquema/`     | `000_biblioteca_schema.sql`: copia sin cambios del esquema del diagrama |
| `db/migraciones/` | `001_sprint1.sql`: lo que el esquema base no cubría para el Sprint 1    |
| `db/semillas/`    | Roles, permisos, perfiles, CIAA/Capital Humano simulados, catálogo...   |

Cuentas de prueba (contraseña de todas: **`Ducky2026`**):

| Identificador | Nombre           | Rol / perfil                   | Sirve para probar                    |
| ------------- | ---------------- | ------------------------------ | ------------------------------------ |
| `N000001`     | Patricia Morales | Administrador                  | Único administrador activo           |
| `N000104`     | Ernesto Díaz     | Bibliotecario                  | Alta, cambio y baja de libros        |
| `N000105`     | Gabriela Núñez   | Bibliotecario (solo consulta)  | Acceso negado por falta de permiso   |
| `N000210`     | Ricardo Vega     | Comprador de libros            | Solicitudes y recepciones            |
| `N000305`     | Sofía Hernández  | Maestro                        | Tiene 1 préstamo activo              |
| `N000402`     | Luis Ramírez     | Colaborador                    | Consulta del catálogo                |
| `A01234567`   | Mariana López    | Alumno                         | 2 préstamos activos (baja rechazada) |
| `A01555888`   | Rodrigo Díaz     | Alumno                         | Multa pendiente (baja rechazada)     |
| `A01999000`   | Carlos Pérez     | Alumno                         | Sin pendientes (baja procede)        |
| `A01678234`   | Ana Torres       | Alumno, cuenta **inactiva**    | Acceso negado; "ya está inactivo"    |
| `A01333444`   | Diego Castro     | Alumno con perfil **inactivo** | Acceso negado por perfil             |
| `A01444222`   | Lucía Herrera    | Alumno **no vigente** en CIAA  | Acceso negado por vigencia           |

Sin cuenta, para probar el alta: `A01777111` y `N000500`. No vigentes: `A01000999`, `N000999`.
Formatos: Matrícula `A` + 8 dígitos; Nómina `N` + 6 dígitos.

Todas las respuestas de error de la API tienen la forma
`{ "error": { "mensaje": "...", "detalle": { ... } } }`; `detalle` es opcional.

### Avance del Sprint 1

- [x] Fase 0 — Esqueleto del proyecto
- [x] Fase 1 — Base de datos (migración y semillas)
- [ ] Fase 2 — Autenticación y RBAC (HUGUS01)
- [ ] Fase 3 — Perfiles y usuarios (HUPRF01, HUGUS02–05)
- [ ] Fase 4 — Libros y ejemplares (HULIB01–03)
- [ ] Fase 5 — Consulta, ubicación y listado (HULIB04, HUUBI01, HULIS01)
- [ ] Fase 6 — Compras (HUCOM01)
- [ ] Fase 7 — Pruebas y cierre
