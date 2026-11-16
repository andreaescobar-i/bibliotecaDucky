# 01 · Estado del proyecto

Revisión hecha el 15 de noviembre de 2026 leyendo el código de `bibliotecaDucky/`, los cuatro PDF
de la carpeta superior y el estado de esta computadora. No se modificó ningún archivo existente.

## Actualización: Fase 1 terminada (15 de noviembre de 2026)

El diagnóstico de abajo se escribió antes de poder ejecutar nada. La Fase 1 lo confirmó:

| Comprobación                       | Resultado                                                           |
| ---------------------------------- | ------------------------------------------------------------------- |
| `.env` completo                    | Sí; se conservó `GEMINI_API_KEY` y se generó un `JWT_SECRETO` nuevo |
| `npm install`                      | 282 paquetes instalados                                             |
| `npm run db:reset`                 | Base `sigb_ducky` creada: 12 cuentas, 8 libros, 21 ejemplares       |
| `npm test`                         | 79 de 79 pruebas pasan                                              |
| `npm run test:bd`                  | 206 de 206 pruebas pasan                                            |
| `npm run lint` y `npm run build`   | Sin errores                                                         |
| App encendida con `npm run inicio` | Login, búsqueda, detalle y permisos responden bien                  |

Los tres problemas de entorno de la lista siguiente **ya están resueltos**. Pendientes menores
que quedaron a la vista:

- `PGPASSWORD` quedó con un valor de relleno. Funciona porque tu PostgreSQL local no pide
  contraseña; conviene poner la real.
- npm 12 bloqueó los scripts de instalación de `bcrypt` y `esbuild`. Los dos funcionan igual
  (se comprobó), así que no hizo falta aprobarlos.
- `npm audit` reporta 4 avisos de severidad moderada en `minimatch`, una dependencia de las
  herramientas de desarrollo. No afecta a la app en ejecución.
- El README dice 78 y 205 pruebas; son 79 y 206.

## Resumen en una página

- **El proyecto está mejor de lo que pensabas.** El backend del Sprint 1 está completo y el
  frontend sí lo llama: inicio de sesión, catálogo, libros y ejemplares, usuarios, perfiles y
  compras usan datos reales de PostgreSQL. No encontré pantallas con datos inventados.
- **Lo que no funciona hoy es el entorno de esta computadora, no el código:**
  1. No están instaladas las dependencias (no existe `node_modules/`).
  2. La base de datos `sigb_ducky` no existe en tu PostgreSQL local (solo hay `faltas` y
     `postgres`).
  3. El `.env` solo tiene `GEMINI_API_KEY`; faltan seis variables obligatorias y la API se niega
     a arrancar sin ellas.
- **Las tres cosas se arreglan en minutos** y sin tocar código (Fase 1 del plan). El `.env`
  perdido no es grave: el archivo `.env.example` del repositorio lista todo lo que había.
- **El asistente "Ducky" ya existe como ventana**, pero responde con cuatro textos fijos escritos
  en el frontend. No llama al backend ni a ninguna IA.
- **La base de datos ya trae las tablas `sesion_chat` y `mensaje_chat`** para el historial. Hoy
  ningún programa las usa.

Como no hay dependencias ni base de datos, **no pude ejecutar la aplicación ni las pruebas**. Todo
lo que sigue sale de leer el código; la Fase 1 del plan lo confirma ejecutándolo.

## Qué es el proyecto

SIGB (Sistema Integral de Gestión Bibliotecaria) de la Universidad Ducky, hecho por el equipo
OHNO S.A. de C.V. para la materia de Ingeniería de Software. Son 5 sprints; el código actual
cubre el Sprint 1. Según el Sprint Backlog, el **ChatBot es del Sprint 3**, lo usan todos los
roles, y su alcance escrito es "Preguntas frecuentes" (encargados: Armando y Lenin).

## Stack

| Parte         | Tecnología                                                             |
| ------------- | ---------------------------------------------------------------------- |
| Frontend      | React 19 + TypeScript + Vite 7, CSS propio (sin Bootstrap ni Tailwind) |
| Backend       | Node.js + Express 5, módulos ES, patrón MVC                            |
| Base de datos | PostgreSQL con el driver `pg` y SQL escrito a mano (no hay ORM)        |
| Sesiones      | JWT dentro de una cookie `httpOnly`; contraseñas con `bcrypt`          |
| Seguridad     | `helmet`, `cors`, `express-rate-limit`, permisos por perfil (RBAC)     |
| Otros         | `pdfkit` para los PDF, `dotenv` para el `.env`                         |
| Pruebas       | `node:test` + `supertest`; ESLint y Prettier                           |

Frontend y backend viven en la misma carpeta y comparten `package.json`.

En esta computadora: Node 26.13 (el proyecto pide 22.12 o más), npm 12.2, PostgreSQL 18.6
encendido en `localhost:5432`.

## Cómo está organizado

```text
bibliotecaDucky/
├── servidor.js, app.js     Arranque de la API y configuración de Express
├── config/                 entorno.js (lee .env) y db.js (conexiones a Postgres)
├── rutas/                  URLs de la API (12 archivos)
├── middlewares/            Sesión, permisos, límite de intentos de login, errores
├── controladores/          Reglas de cada historia de usuario
├── modelos/                El único lugar con SQL
├── vistas/                 Formato de las respuestas JSON y PDF
├── servicios/              Sistemas externos simulados (CIAA, Capital Humano, Tesorería, correo)
├── utilidades/             Validaciones y reglas compartidas
├── db/                     Esquema, migraciones, semillas y el script que recrea la base
├── src/                    Frontend React (21 pantallas y 33 ventanas)
├── tests/                  Pruebas sin base (tests/) y con base real (tests/integracion/)
└── docs/                   Trazabilidad del Sprint 1 y colección de Postman
```

Camino de una petición: `rutas → middlewares → controlador → modelo → vista → respuesta`.

## Cómo se conecta cada parte

**Frontend → backend.** `src/api.ts` llama siempre a `/api/...`. En desarrollo, Vite reenvía
`/api` al puerto de la API (`vite.config.ts`), así el navegador ve un solo sitio y la cookie de
sesión funciona sin configuración extra.

**Backend → PostgreSQL.** `config/db.js` abre un grupo de hasta 10 conexiones con los datos de
`PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER` y `PGPASSWORD`. Todas las consultas usan parámetros
(`$1`, `$2`…), que es la forma correcta de evitar inyección de SQL.

**Autenticación.** El login compara la contraseña con `bcrypt` y entrega un JWT en la cookie
`sigb_sesion` (`httpOnly`, `sameSite: lax`, y `secure` solo en producción). El JWT solo guarda el
id de la cuenta. En **cada** petición protegida el backend vuelve a leer de la base la cuenta, su
perfil, sus permisos y su vigencia institucional, así que una baja se aplica al instante. Cada
ruta declara qué permiso exige (`requierePermiso('CONSULTAR_LIBROS')`, por ejemplo).

**Despliegue.** No hay nada preparado: no hay Dockerfile, ni configuración de nube, ni CI. Todo
está pensado para correr en local con `npm run inicio`. La propuesta de negocio habla de
"despliegue en el servidor productivo de la Universidad" en el Sprint 5 y excluye el costo de
hosting.

## Rutas de la API (todas bajo `/api`)

| Grupo                                                                       | Rutas                                                                                                                  | Estado   |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------- |
| Salud                                                                       | `GET /salud`                                                                                                           | Funciona |
| Sesión                                                                      | `POST /auth/login`, `POST /auth/logout`, `GET /auth/sesion`, `PUT /auth/contrasena`                                    | Funciona |
| Usuarios                                                                    | `GET/POST /usuarios`, `GET/PUT /usuarios/:id`, `PUT …/perfil`, `POST …/baja`, `POST …/reactivar`                       | Funciona |
| Perfiles y roles                                                            | `GET/POST /perfiles`, `GET/PUT /perfiles/:clave`, `POST …/desactivar`, `GET /roles`                                    | Funciona |
| Libros                                                                      | `GET/POST /libros`, `GET/PUT /libros/:clave`, `POST …/ejemplares`, `GET …/etiquetas`, `GET …/historial`, `POST …/baja` | Funciona |
| Ejemplares                                                                  | `GET/PUT /ejemplares/:clave`, `GET …/etiqueta`, `POST …/baja`                                                          | Funciona |
| Consulta                                                                    | `GET /catalogos`, `GET /ubicaciones`, `GET /listado-libros` (+ `/pdf`, `/impresion`)                                   | Funciona |
| Compras                                                                     | `GET/POST /solicitudes`, `GET /solicitudes/presupuesto`, `…/entregadas`, `…/:folio` y sus acciones                     | Funciona |
| Préstamos, devoluciones, renovaciones, multas, pagos, suspendidos, reportes | No existen                                                                                                             | Falta    |
| Chat                                                                        | No existe                                                                                                              | Falta    |

"Funciona" significa que la ruta, su controlador, su modelo y sus pruebas existen en el código.

## Diagnóstico

### Conectado y con datos reales

- Inicio y cierre de sesión, cambio de contraseña temporal.
- Catálogo con búsqueda, filtros, orden y paginación; detalle del libro con sus ejemplares.
- PDF e impresión del listado, generados por la API.
- Alta, cambio, clasificación, etiquetas y baja de libros y ejemplares, con historial.
- Usuarios, roles y perfiles.
- Solicitudes de compra, presupuesto, recepciones y entrega al catálogo.
- Bitácora: accesos, rechazos y cambios quedan en `registro_auditoria`.

El README declara 78 pruebas sin base y 205 con base real. Están en `tests/`, pero no las pude
correr aquí.

### A medias

| Qué                              | Detalle                                                                                                                                       |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Asistente Ducky                  | La ventana existe. Las respuestas son cuatro textos fijos en `src/App.tsx` (líneas 793-807). Los botones de "Temas frecuentes" no hacen nada. |
| Recuperar acceso                 | La ventana existe, pero no hay ruta en el backend que recupere una contraseña.                                                                |
| Mi perfil                        | Abre la ventana y además muestra un aviso con las reglas de préstamo escritas a mano.                                                         |
| Correo de credenciales           | Simulado: la contraseña temporal se imprime en la consola de la API.                                                                          |
| Tesorería, CIAA y Capital Humano | Simulados. CIAA y Capital Humano son tablas en un esquema `externo` de la misma base.                                                         |

### Pendiente por sprint (no es un error)

Estas pantallas existen, pero muestran el aviso "Esta función se entrega en el Sprint N" y no
enseñan datos: Mi cuenta, Registrar préstamo, Devolución y Renovación (Sprint 2); Multas y pagos,
Suspendidos, Registrar pago y Libro perdido (Sprint 3); Reportes e inventario (Sprint 5).

Las tablas de préstamos y multas sí existen y tienen algunos registros de prueba (5 préstamos,
2 multas), porque el Sprint 1 los necesita para rechazar bajas con pendientes.

### Datos escritos a mano en el código

- Las respuestas del asistente y el aviso de reglas de préstamo, ya mencionados.
- Los datos de prueba de `db/semillas/`: 8 libros, 21 ejemplares, 12 cuentas con la contraseña
  `Ducky2026`. Es lo normal para desarrollo, pero **esa es toda la información que el chatbot
  tendrá hoy sobre ejemplares**.
- No encontré datos falsos dentro de las pantallas. El frontend no guarda datos en el navegador;
  `sessionStorage` solo recuerda el rol y el libro abierto.

### Lo que falta para el chatbot

- Ruta de chat en el backend y el SDK de Google (`@google/genai` no está en `package.json`).
- Un usuario de base de datos de solo lectura.
- Una forma de aplicar cambios a la base **sin borrarla** (ver riesgo 1).
- Un texto que describa dónde se hace cada tarea en la app.

## Riesgos

Ordenados por gravedad.

1. **`npm run db:reset` borra la base completa.** Es la única manera que tiene el proyecto de
   aplicar el esquema y las migraciones: borra la base que diga `PGDATABASE` y la crea de nuevo.
   Dos consecuencias:
   - Si al reconstruir el `.env` escribes `PGDATABASE=faltas` por error, **borra tu otra base**.
     Debe decir `sigb_ducky`.
   - No sirve para una base con datos reales. El plan propone un migrador que solo agrega.
2. **PostgreSQL local acepta conexiones sin contraseña.** Pude listar tus bases como `postgres`
   sin clave. En tu computadora es cómodo; en un servidor sería una puerta abierta.
3. **La contraseña `Ducky2026` de todas las cuentas de prueba está publicada** en el README y en
   las semillas, incluida la del Administrador. Nunca deben cargarse esas semillas en producción.
4. **El repositorio tiene un remoto en GitHub.** `.env` está en `.gitignore` y nunca se subió
   (lo comprobé en el historial), así que tu key no está expuesta. Hay que mantenerlo así.
5. **Sin configuración para estar detrás de un proxy.** Falta `trust proxy` en Express. En local
   no importa; publicado, la IP de la bitácora y de los límites de uso sería la del proxy, no la
   del usuario. Afecta directamente a los límites del chatbot.
6. **El frontend descarga todo el catálogo al entrar** (una petición por libro). Con 8 libros no
   se nota; con miles sería lento. No bloquea el chatbot.
7. **Documentos desactualizados.** `VERIFICACION.md` describe el prototipo anterior, con "acceso
   de demostración y cambio de rol". El README dice que la carpeta `dist/` viene incluida, pero
   no existe y está en `.gitignore`. La propuesta de negocio menciona Bootstrap y el código no lo
   usa.
8. **Aviso de PostgreSQL sobre "collation version mismatch"** en la base `postgres`. Apareció tras
   una actualización del sistema. No afecta al proyecto, porque crea su base desde `template0`.

### Revisión de secretos

| Revisión                                     | Resultado                                                                                                          |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `.env` en `.gitignore`                       | Sí                                                                                                                 |
| `.env` alguna vez subido a git               | No                                                                                                                 |
| Claves o tokens escritos en el código        | No. Solo un secreto de pruebas en `config/entorno.js`, que no se usa fuera de `NODE_ENV=test`                      |
| Claves expuestas en el frontend              | No. El frontend no lee variables de entorno                                                                        |
| `GEMINI_API_KEY` alcanzable por el navegador | No. Vite solo expone variables que empiezan con `VITE_`; nunca hay que renombrarla así                             |
| Formato de la key                            | Empieza con `AQ.`, lo que corresponde a una key de Google Cloud ligada a cuenta de servicio, no a una de AI Studio |

No imprimí ni copié el valor de la key en ningún documento.
