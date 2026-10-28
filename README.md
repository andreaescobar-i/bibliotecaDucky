# Biblioteca Ducky · React

Conversión del archivo Figma `ChnBUODzzXq3usFLztez3C` a React + TypeScript + Vite, con CSS local y recursos originales descargados. Incluye 21 pantallas y 33 ventanas de diálogo. Los datos salen de la API y la base de datos PostgreSQL de esta misma carpeta.

## Ejecutar

Usa Node.js 22.12 o posterior y PostgreSQL. La primera vez sigue
[Instalación en otra computadora](#instalación-en-otra-computadora-para-el-equipo) para crear `.env`
y la base de datos. Después, desde esta carpeta:

```bash
npm run inicio
```

Levanta la API y el front juntos; espera a que la terminal diga `API SIGB escuchando` y abre
http://127.0.0.1:5173. `npm run dev` levanta solo el front, y sin la API el login no funciona.

Para generar y revisar la compilación:

```bash
npm run build
npm run preview
```

La carpeta `dist/` incluida contiene la compilación estática. Debe servirse mediante HTTP; no abrir `index.html` directamente con `file://`.

## Probar los roles

Inicia sesión con una de las [cuentas de prueba](#base-de-datos) (contraseña
`Ducky2026`). El rol sale del perfil de la cuenta en la BD, por eso el formulario solo pide
usuario y contraseña.

Los seis roles son Alumno, Maestro, Colaborador, Bibliotecario, Administrador y Comprador de libros. Alumno, Maestro y Colaborador comparten catálogo y cuenta; los roles de gestión tienen sus propias pantallas y menús.

## Qué está conectado

- **Sprint 1, con datos reales de la BD:** inicio de sesión (incluidos los rechazos), catálogo con
  búsqueda, criterio, orden y paginación; ficha del libro con sus ejemplares, PDF e impresión
  generados por la API; usuarios (alta, edición, roles, baja y reactivación); roles y perfiles
  (consulta y desactivación); libros y ejemplares (alta, edición, clasificación, etiquetas, bajas e
  historial); solicitudes de compra, presupuesto, recepciones y entrega al catálogo.
- **Sprints 2 a 5:** préstamos, devolución, renovación, Mi cuenta, multas, suspendidos y reportes
  muestran un aviso con el sprint en que se entregan. No muestran datos inventados.
- **Asistente Ducky:** responde preguntas generales con textos fijos; no consulta la BD.

El front no guarda datos en el navegador: todo se pide a la API. Solo `sessionStorage` recuerda
el rol y el libro abierto para recargar la página.

## Código

- `src/screens/`: pantallas con nombres cortos, agrupadas por rol; las vistas reutilizadas están en `compartidas/` y los diálogos en la subcarpeta `dialogos/`.
- `src/App.tsx`: coordinación de estado, ventanas y acciones.
- `src/navigation.ts`: carga de pantallas y rutas iniciales por rol.
- `src/components/`: formularios, textos dinámicos y tablas con datos de la API.
- `src/context/DesignContext.ts`: estado y acciones compartidos por las vistas.
- `src/api.ts`: llamadas a la API y conversión de sus respuestas.
- `src/listas.ts`: filtros y paginación que comparten las tablas y sus contadores.
- `src/design-controls.tsx`: exportaciones compartidas para las pantallas del diseño.
- `src/model.ts`: tipos de datos del front.
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
servicios/               # Integraciones simuladas (CIAA, Capital Humano, correo); su SQL está en modelos/
utilidades/              # ErrorAplicacion y funciones compartidas
db/                      # reiniciarBaseDatos.js, esquema/, migraciones/, semillas/
tests/                   # Pruebas del front y de la API; tests/integracion/ usa la BD real
```

Flujo de una petición: `rutas → middlewares → controlador → modelo → vista → respuesta`.

- **Modelos:** el único lugar con SQL. Los controladores abren transacciones con
  `ejecutarTransaccion` y pasan el cliente a los modelos, pero no escriben consultas.
- **Vistas:** arman todas las respuestas, incluidas las de error (`vistas/errorVista.js`).
  Los controladores solo eligen el mensaje y le pasan los registros a la vista.
- **Front React (`src/`):** es la capa de presentación que consume esta API.
  `src/api.ts` hace las peticiones y convierte las respuestas.

### Instalación en otra computadora (para el equipo)

Cada integrante tiene **su propia base de datos local**: los datos no se comparten entre
computadoras, y cualquiera puede regresar a los datos de prueba con `npm run db:reset`.

**Requisitos**

- [Node.js](https://nodejs.org) 22.12 o posterior (`node -v` para revisarlo).
- [PostgreSQL](https://www.postgresql.org/download/) 13 o posterior, con el servicio
  iniciado. Durante la instalación se define la contraseña del usuario `postgres`: hay que
  recordarla. No hace falta crear la base a mano; el proyecto la crea.

**Pasos** (PowerShell, desde la carpeta `bibliotecaDucky` del proyecto):

```powershell
npm install
Copy-Item .env.example .env
```

Abre `.env` y cambia dos valores:

1. `PGPASSWORD`: la contraseña de tu usuario `postgres`.
2. `JWT_SECRETO`: una clave propia. Genérala con este comando y pega el resultado:
   ```powershell
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

Después:

```powershell
npm run db:reset   # crea la base sigb_ducky con las tablas y los datos de prueba
npm run test:bd    # comprueba la base y la API: todas las pruebas deben pasar
npm run inicio     # levanta la API y el front
```

Abre **http://127.0.0.1:5173** e inicia sesión con una cuenta de prueba (tabla de abajo).
Para detener la aplicación: `Ctrl + C` en la terminal de `npm run inicio`.

**Si algo falla**

| Mensaje                                         | Qué hacer                                                                 |
| ----------------------------------------------- | ------------------------------------------------------------------------- |
| `Revisa PGUSER y PGPASSWORD en el archivo .env` | La contraseña de `postgres` en `.env` no es la correcta.                  |
| `PostgreSQL no responde`                        | Inicia el servicio de PostgreSQL (Servicios de Windows → `postgresql-…`). |
| `Faltan variables en .env: …`                   | Falta copiar `.env.example` a `.env` o falta alguna línea.                |
| `JWT_SECRETO debe tener al menos 32 caracteres` | Genera la clave con el comando de arriba.                                 |
| `EADDRINUSE` (puerto 3000 o 5173 ocupado)       | Ya hay otra copia corriendo; ciérrala o cambia `PUERTO` en `.env`.        |
| En el navegador: "Ocurrió un error inesperado"  | Revisa que `npm run inicio` siga corriendo y mira la terminal.            |
| En el login: "No hay conexión con la API"       | Se inició con `npm run dev` (solo front). Usa `npm run inicio`.           |

### Scripts del backend

| Script              | Uso                                                     |
| ------------------- | ------------------------------------------------------- |
| `npm run inicio`    | API y front juntos (http://127.0.0.1:5173)              |
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

### Sesión y permisos (HUGUS01)

| Método | Ruta               | Descripción                                                  |
| ------ | ------------------ | ------------------------------------------------------------ |
| POST   | `/api/auth/login`  | `{ identificador, contrasena, tipoIdentificador? }` → sesión |
| POST   | `/api/auth/logout` | Cierra la sesión (204)                                       |
| GET    | `/api/auth/sesion` | Cuenta, rol y permisos de la sesión actual                   |

- La sesión es un JWT en la cookie `httpOnly` `sigb_sesion`; no guarda contraseña ni permisos.
- En **cada** petición protegida se vuelve a comprobar en la BD la cuenta, el perfil, el rol, los
  permisos y la vigencia en CIAA o Capital Humano: una baja o un cambio de perfil se aplican de
  inmediato aunque la sesión siga abierta.
- `tipoIdentificador` es opcional: si no llega (el front solo captura "Usuario") se deduce del
  formato. El rol que elige el front al iniciar sesión se ignora; sale del perfil asignado.
- Tras 10 intentos fallidos con el mismo identificador desde la misma IP, ese identificador se
  bloquea 15 minutos (`LIMITE_INTENTOS_LOGIN`, `VENTANA_INTENTOS_MINUTOS`).
- Cada acceso, intento fallido, cierre y acceso denegado queda en `registro_auditoria` con IP.
- Rutas nuevas: `requiereSesion` y `requierePermiso('CLAVE_PERMISO')` de
  `middlewares/autenticacion.js`.

### Usuarios y perfiles (HUGUS02-05, HUPRF01)

| Método | Ruta                                     | Permiso               | Historia      |
| ------ | ---------------------------------------- | --------------------- | ------------- |
| GET    | `/api/usuarios`                          | `CONSULTA_CUENTAS`    | HUGUS05       |
| GET    | `/api/usuarios/:identificador`           | `CONSULTA_CUENTAS`    | HUGUS05       |
| POST   | `/api/usuarios`                          | `ALTA_CUENTAS`        | HUGUS02       |
| PUT    | `/api/usuarios/:identificador`           | `CAMBIO_CUENTAS`      | HUGUS04       |
| PUT    | `/api/usuarios/:identificador/perfil`    | `ASIGNAR_PERFILES`    | HUPRF01 esc 4 |
| POST   | `/api/usuarios/:identificador/baja`      | `BAJA_CUENTAS`        | HUGUS03       |
| POST   | `/api/usuarios/:identificador/reactivar` | `BAJA_CUENTAS`        | Front         |
| GET    | `/api/perfiles`, `/api/perfiles/:clave`  | `CONSULTAR_PERFILES`  | HUPRF01       |
| POST   | `/api/perfiles`                          | `CREAR_PERFILES`      | HUPRF01 esc 1 |
| PUT    | `/api/perfiles/:clave`                   | `MODIFICAR_PERFILES`  | HUPRF01 esc 2 |
| POST   | `/api/perfiles/:clave/desactivar`        | `DESACTIVAR_PERFILES` | HUPRF01 esc 3 |
| GET    | `/api/roles`                             | `CONSULTAR_PERFILES`  | HUPRF01       |

- **Búsqueda:** `?buscar=` es el campo único del front (matrícula/nómina exacta o parte del
  nombre, sin acentos). También acepta `tipoIdentificador`, `identificador`, `nombre`, `perfil`,
  `rol` y `estado`, combinados. El valor `Todos` no filtra.
- **Alta:** `{ identificador, correo, telefono?, perfil }` o `{ ..., rol }` como lo envía el
  front ("Rol asignado" usa el perfil base de ese rol). Si la persona ya está en CIAA o Capital
  Humano se toma su nombre de ahí; si no está, se registra en ese sistema simulado con el
  `nombre` capturado (obligatorio en ese caso). Si está pero ya no es vigente, se rechaza. La contraseña temporal se "envía" mostrándola en la consola de la API
  (`servicios/correoServicio.js`) hasta que haya servidor de correo. Si en el formulario se
  escribe otro nombre, el front lo corrige justo después del alta.
- **Cambio:** `{ nombre?, correo?, telefono?, perfil? o rol? }`. El nombre completo se separa
  en nombre y apellidos (las dos últimas palabras son los apellidos) y su valor anterior queda en
  la bitácora. Por decisión del equipo se puede corregir, aunque la HU lo marca como dato de
  CIAA o Capital Humano. Tipo e identificador no se editan.
- **Reglas que se validan en la API:** alumnos solo con perfiles Alumno; identidad vigente;
  nadie modifica su propio acceso ni se da de baja; nunca se queda el sistema sin un
  Administrador activo con todos los permisos de cuentas y perfiles; la baja se rechaza con
  préstamos activos o adeudos pendientes y no borra nada.
- Los cambios de perfil aplican desde la siguiente petición, aunque la sesión siga abierta.

### Libros y ejemplares (HULIB01-03)

| Método | Ruta                              | Permisos                                           | Historia     |
| ------ | --------------------------------- | -------------------------------------------------- | ------------ |
| POST   | `/api/libros`                     | Alta de libros + Clasificar + Etiquetar            | HULIB01 1, 3 |
| GET    | `/api/libros/:clave`              | Consultar libros                                   | Ficha        |
| PUT    | `/api/libros/:clave`              | Cambio de libros (+ Etiquetar si cambia el Título) | HULIB03 1, 3 |
| POST   | `/api/libros/:clave/ejemplares`   | Alta de libros + Clasificar + Etiquetar            | HULIB01 2, 4 |
| GET    | `/api/libros/:clave/etiquetas`    | Etiquetar ejemplares                               | Front        |
| GET    | `/api/libros/:clave/historial`    | Cambio de libros                                   | Front        |
| POST   | `/api/libros/:clave/baja`         | Baja de libros                                     | Front        |
| GET    | `/api/ejemplares/:clave`          | Consultar libros                                   | Ejemplar     |
| GET    | `/api/ejemplares/:clave/etiqueta` | Etiquetar ejemplares                               | HULIB01      |
| PUT    | `/api/ejemplares/:clave`          | Cambio de libros + Clasificar + Etiquetar          | HULIB03 2-4  |
| POST   | `/api/ejemplares/:clave/baja`     | Baja de libros                                     | HULIB02      |
| GET    | `/api/catalogos`                  | Consultar libros                                   | Listas       |

- **Alta:** acepta los campos del formulario del front (`clave`, `titulo`, `autor`, `tema`,
  `editorial`, `isbn`, `descripcion`, `precioCompra`, `tipoUso`, `ubicacion` "Estante LIT · A1",
  `cantidad` = "Ejemplares que se reciben") y los de la historia (`claveEjemplar`,
  `clasificacion`, `librero`, `fila`). Sin `claveEjemplar`, las claves se numeran
  `<Clave de libro>-E01, -E02...`; sin `clasificacion`, se usa la Clave de libro.
- Varios autores se separan con `;`. Editoriales y autores nuevos se registran solos; el tema
  debe existir en el catálogo.
- Nada se borra: las bajas cambian el estado, guardan motivo, fecha y operador, y dejan un
  movimiento en el historial del ejemplar. Con préstamo activo no hay baja.
- Las etiquetas se generan a partir de los datos vigentes, así que un cambio de Título se
  refleja de inmediato (y queda un movimiento `ETIQUETA` en cada ejemplar).

### Búsqueda, listado y ubicación (HULIB04, HULIS01, HUUBI01)

| Método | Ruta                            | Permiso             | Historia     |
| ------ | ------------------------------- | ------------------- | ------------ |
| GET    | `/api/libros`                   | Consultar libros    | HULIB04 1, 2 |
| GET    | `/api/libros/:clave`            | Consultar libros    | HULIB04 3    |
| GET    | `/api/ejemplares/:clave`        | Consultar libros    | HULIB04 4    |
| GET    | `/api/ubicaciones`              | Consultar ubicación | HUUBI01      |
| GET    | `/api/listado-libros`           | Consultar listado   | HULIS01 1-5  |
| GET    | `/api/listado-libros/pdf`       | Consultar listado   | HULIS01 6, 7 |
| GET    | `/api/listado-libros/impresion` | Consultar listado   | HULIS01 6, 7 |

- **Filtros** (todos combinados con AND): `titulo`, `autor`, `tema`, `editorial` (texto
  contenido, sin mayúsculas ni acentos) y `clave` (Clave de libro exacta). También el campo
  único del front: `buscar` + `criterio` (Todos, Título, Autor, Editorial, Clave), y
  `tipoUso`. Los valores "Todos" de las listas no filtran.
- **Búsqueda:** `orden` = Relevancia, Título A–Z, Autor A–Z o Título Z–A (como el menú del
  front); `pagina` y `porPagina` (5 por omisión, como el front).
- **Listado:** todas las coincidencias, una fila por ficha, ordenado por Título y Clave, con
  ISBN "No registrado" cuando falta. El PDF y la vista de impresión usan exactamente el mismo
  listado; con cero resultados no se generan.
- Los ejemplares dados de baja no cuentan como registrados ni disponibles, y la ubicación
  faltante se indica como "No registrado" (nunca se toma de otra copia).
- Si la BD no responde, la API dice "No fue posible recuperar el listado; intenta nuevamente"
  en lugar de mostrar cero resultados.

### Compras (HUCOM01)

| Método | Ruta                                       | Permiso                                       | Historia             |
| ------ | ------------------------------------------ | --------------------------------------------- | -------------------- |
| GET    | `/api/solicitudes`                         | Gestionar solicitudes o Registrar recepciones | Lista                |
| GET    | `/api/solicitudes/:folio`                  | Gestionar solicitudes o Registrar recepciones | HUCOM01 4, 5         |
| POST   | `/api/solicitudes`                         | Gestionar solicitudes                         | HUCOM01 1-3          |
| PUT    | `/api/solicitudes/:folio/partidas`         | Gestionar solicitudes                         | Preparar partidas    |
| POST   | `/api/solicitudes/:folio/envio`            | Gestionar solicitudes                         | HUCOM01 1, 2         |
| POST   | `/api/solicitudes/:folio/autorizacion`     | Gestionar solicitudes                         | Tesorería (simulada) |
| POST   | `/api/solicitudes/:folio/recepciones`      | Registrar recepciones                         | HUCOM01 6, 7         |
| POST   | `/api/solicitudes/:folio/entrega-catalogo` | Registrar recepciones                         | Front                |

- **Dos formas de crear, como el front:** "Nueva petición" (`titulo`, `solicitante`,
  `cantidad`, `costoEstimado`, `justificacion`) queda "Por autorizar"; con `partidas` y
  `enviar: true` se prepara y se remite a Tesorería en un paso.
- **Envío:** solo con la confirmación de Tesorería pasa a "En Tesorería" con fecha. Muestra el
  presupuesto del mes (autorizado, comprometido y disponible) o "Presupuesto no informado".
  Tesorería se simula en `servicios/tesoreriaServicio.js`.
- **Recepciones:** `{ fechaRecepcion: "AAAA-MM-DD", partidas: [{ numero, cantidad }] }` (o
  `cantidades: { "1": 2 }`). Acumula sin exceder lo solicitado; queda "Recibido parcialmente" o
  "Recibido" con folio `REC-0003...`. No crea fichas, ejemplares ni etiquetas.
- Estados con los textos del front: Por autorizar → En Tesorería → Autorizado / Rechazado →
  Recibido parcialmente → Recibido → Entregado al catálogo.

### Front conectado a la API

Para usar la aplicación completa, desde esta carpeta:

```bash
npm run inicio   # levanta la API (puerto 3000) y el front (http://127.0.0.1:5173) juntos
```

Inicia sesión con cualquier cuenta de prueba (contraseña `Ducky2026`); el rol sale del perfil
de la cuenta, no de la lista del formulario. Vite reenvía `/api` a la API (`vite.config.ts`),
así la cookie de sesión funciona sin configurar CORS en el navegador.

- **Conectado (Sprint 1):** inicio y cierre de sesión, catálogo y detalle de libros, gestión
  de usuarios (alta, edición, roles, baja, reactivación), gestión de libros (alta, edición,
  clasificación, etiquetas, bajas) y compras (solicitudes, envío, autorización simulada,
  recepciones y entrega al catálogo). La lógica está en `src/api.ts` y en `src/App.tsx`.
- **Cuentas nuevas:** al entrar con la contraseña temporal aparece un formulario para cambiarla.
- **Sprints posteriores:** préstamos, devoluciones, renovaciones, multas, suspendidos y
  reportes muestran un aviso hasta que tengan su API; no usan datos inventados.

### Documentación y pruebas del Sprint 1

- [`docs/trazabilidad-sprint1.md`](docs/trazabilidad-sprint1.md): cada escenario de las 13
  historias con su ruta y la prueba que lo comprueba.
- [`docs/postman/SIGB-Sprint1.postman_collection.json`](docs/postman/SIGB-Sprint1.postman_collection.json):
  62 peticiones de ejemplo en orden por rol. En Postman: Importar → elegir el archivo → Run
  collection. Ejecutar `npm run db:reset` antes de correrla completa.
- `npm test`: 78 pruebas sin BD (front y API). `npm run test:bd`: 205 pruebas contra la BD real;
  se pueden repetir sin reiniciar la base porque cada archivo limpia lo que crea.

### Avance del Sprint 1

- [x] Fase 0 — Esqueleto del proyecto
- [x] Fase 1 — Base de datos (migración y semillas)
- [x] Fase 2 — Autenticación y RBAC (HUGUS01)
- [x] Fase 3 — Perfiles y usuarios (HUPRF01, HUGUS02–05)
- [x] Fase 4 — Libros y ejemplares (HULIB01–03)
- [x] Fase 5 — Consulta, ubicación y listado (HULIB04, HUUBI01, HULIS01)
- [x] Fase 6 — Compras (HUCOM01)
- [x] Fase 7 — Pruebas y cierre
