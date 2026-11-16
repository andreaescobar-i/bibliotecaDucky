# 05 · Plan por fases

Ninguna fase empieza sin tu aprobación. Cada una deja la aplicación funcionando y se puede
detener ahí sin romper nada.

## Vista general

| Fase | Qué se logra                                            | Toca código existente | Cuesta créditos |
| ---- | ------------------------------------------------------- | --------------------- | --------------- |
| 1    | La app corre en tu computadora y las pruebas pasan      | No (solo `.env`)      | No              |
| 2    | La base queda lista para el chat, sin borrar nada       | Mínimo                | No              |
| 3    | El backend habla con Gemini por Agent Platform          | Mínimo                | Centavos        |
| 4    | El chat responde sobre ejemplares con datos reales      | Sí, poco              | Poco            |
| 5    | El chat explica dónde se hace cada tarea                | No                    | Poco            |
| 6    | La ventana "Asistente Ducky" usa el chat real           | Sí (frontend)         | Poco            |
| 7    | Límites, pruebas de calidad y documentación             | Sí, poco              | Poco            |
| 8    | Opcional: búsqueda por significado con pgvector         | Sí, poco              | Poco            |
| 9    | Cuando se publique: servidor, base en la nube, secretos | Sí                    | Sí              |

Las fases 1 a 7 son el chatbot completo en local. La 8 es opcional y la 9 solo aplica al
publicar.

## Avance

| Fase | Estado                          | Evidencia                                                   |
| ---- | ------------------------------- | ----------------------------------------------------------- |
| 1    | Terminada, 15 de noviembre 2026 | 79 pruebas sin base y 206 con base; app encendida y probada |
| 2    | Terminada, 15 de noviembre 2026 | 88 pruebas sin base y 230 con base; rama `chatbot`          |
| 3    | Pendiente de aprobación         |                                                             |

Decisiones tomadas: no usar pgvector por el momento (la Fase 8 queda en espera) y trabajar en
la rama `chatbot` para integrarla con un pull request.

---

## Fase 1 · Recuperar el entorno y comprobar que el backend está sano

**Objetivo.** Que la aplicación arranque en tu computadora y confirmar, ejecutándola, lo que el
diagnóstico dedujo leyendo el código. No se construye nada encima hasta tener esto en verde.

**Tareas**

1. Reconstruir `.env` (pasos en el documento 02). Revisar dos veces que `PGDATABASE=sigb_ducky`.
2. `npm install`
3. `npm run db:reset` — crea la base `sigb_ducky` con tablas y datos de prueba.
4. `npm test` — pruebas que no necesitan base.
5. `npm run test:bd` — pruebas contra la base real.
6. `npm run inicio` y recorrer la app con dos cuentas (un Alumno y el Administrador).
7. Anotar cualquier prueba que falle. Si alguna falla, se corrige **antes** de la Fase 2.

**Archivos que se tocan.** Solo `.env` (no está en git). Se crean `node_modules/` y la base de
datos. Ningún archivo de código.

**Riesgos**

- `db:reset` borra la base que diga `PGDATABASE`. Si dijera `faltas`, borraría tu otra base.
- El proyecto se probó con versiones anteriores de Node y PostgreSQL; tú tienes Node 26 y
  PostgreSQL 18. Puede aparecer alguna incompatibilidad, sobre todo al compilar `bcrypt`.
- El README habla de 78 y 205 pruebas; si el número real difiere, hay que entender por qué.

**Cómo probar que quedó bien**

- `http://localhost:3000/api/salud` responde que la base está conectada.
- `npm test` y `npm run test:bd` terminan sin fallas.
- Entras con `A01234567` / `Ducky2026`, buscas "Rulfo" y abres el detalle de _Pedro Páramo_.
- Entras con `N000001` y ves la lista de usuarios.

---

## Fase 2 · Preparar la base de datos para el chat

**Objetivo.** Tener las tablas, las vistas y el usuario de solo lectura, aplicados con un
mecanismo que **no borra** la base.

**Tareas**

1. Crear el migrador `db/aplicarMigraciones.js` y el comando `npm run db:migrar`.
2. Escribir `db/migraciones/003_chatbot.sql`: columnas y reglas de `sesion_chat` y
   `mensaje_chat`, esquema `chat` con las vistas `chat.libro` y `chat.ejemplar`.
3. Crear el usuario `sigb_chat_lectura` con sus permisos de lectura.
4. Agregar `config/dbLectura.js` (conexiones de solo lectura). Si faltan `CHAT_PGUSER` o
   `CHAT_PGPASSWORD`, no se crea y el resto de la app sigue igual.
5. Pruebas de integración nuevas.

**Archivos que se tocan**

| Archivo                                    | Cambio                                                 |
| ------------------------------------------ | ------------------------------------------------------ |
| `db/aplicarMigraciones.js`                 | Nuevo                                                  |
| `db/migraciones/003_chatbot.sql`           | Nuevo                                                  |
| `config/dbLectura.js`                      | Nuevo                                                  |
| `tests/integracion/chatBaseDatos.test.mjs` | Nuevo                                                  |
| `package.json`                             | Una línea: el script `db:migrar`                       |
| `config/entorno.js`                        | Leer `CHAT_PGUSER` y `CHAT_PGPASSWORD` como opcionales |
| `db/reiniciarBaseDatos.js`                 | Crear también el usuario de solo lectura tras recrear  |
| `.env.example`, `.env`                     | Las dos variables nuevas                               |
| `tests/integracion/baseDatos.test.mjs`     | Solo si alguna prueba cuenta tablas o columnas         |

**Riesgos**

- Un usuario de PostgreSQL pertenece al servidor, no a una base: sobrevive a `db:reset` y hay que
  manejar el caso "ya existe".
- La contraseña del usuario no puede quedar escrita en un `.sql` del repositorio; se toma de
  `.env`.
- Alguna prueba existente podría comparar el esquema exacto y fallar por las columnas nuevas.

**Cómo probar que quedó bien**

- `npm run db:migrar` dos veces seguidas: la segunda dice "nada pendiente" y no cambia nada.
- Con el usuario de solo lectura: `SELECT * FROM chat.libro` devuelve 8 libros.
- Con ese mismo usuario, estos tres intentos **deben fallar**: `SELECT * FROM usuario`,
  `UPDATE libro …`, `DELETE FROM ejemplar`.
- `npm run test:bd` completo sigue pasando y la app se usa igual que antes.

---

## Fase 3 · Conexión con Gemini

**Objetivo.** Que el backend pueda hacerle una pregunta a Gemini por Agent Platform con tu key.
Todavía sin chat ni base de datos.

**Tareas**

1. `npm install @google/genai` (primera dependencia nueva; se instala con tu aprobación).
2. **Prueba mínima** con un script de una sola llamada: confirma si el cliente acepta
   `enterprise: true` con la key o si hace falta `vertexai: true`, que la dirección llamada sea
   `aiplatform.googleapis.com` y qué modelo responde.
3. Crear `servicios/geminiServicio.js` con transporte reemplazable, tiempo máximo y un reintento.
4. Agregar las variables `GEMINI_API_KEY`, `GEMINI_MODELO` y `CHAT_HABILITADO` a
   `config/entorno.js` como opcionales.
5. Pruebas con el transporte simulado (no gastan créditos).

**Archivos que se tocan**

| Archivo                             | Cambio                            |
| ----------------------------------- | --------------------------------- |
| `servicios/geminiServicio.js`       | Nuevo                             |
| `docs/chatbot/prueba-gemini.mjs`    | Nuevo: script de la prueba mínima |
| `tests/gemini.test.mjs`             | Nuevo                             |
| `package.json`, `package-lock.json` | La dependencia `@google/genai`    |
| `config/entorno.js`                 | Tres variables opcionales         |
| `.env.example`                      | Bloque del asistente              |

**Riesgos**

- La documentación no muestra `enterprise: true` con API key en JavaScript (documento 04). La
  prueba mínima lo resuelve en el primer minuto.
- La key puede no tener permiso para el modelo elegido, o la API puede no estar habilitada en tu
  proyecto de Google Cloud. El error de Google lo dice claramente.
- Que la key aparezca en un mensaje de error impreso. El servicio no imprimirá la configuración.

**Cómo probar que quedó bien**

- `node docs/chatbot/prueba-gemini.mjs` imprime una respuesta corta y la dirección
  `aiplatform.googleapis.com`.
- En la consola de Google Cloud aparece el consumo en Agent Platform, no en AI Studio.
- Con `CHAT_HABILITADO=false` o sin key, la API arranca igual.
- `npm run verificar` pasa.

---

## Fase 4 · El chat responde sobre ejemplares

**Objetivo.** Una ruta `POST /api/chat/mensajes` que contesta preguntas del catálogo con datos
de la base, guarda el historial y respeta los permisos. Se prueba con Postman; el frontend aún
no cambia.

**Tareas**

1. `modelos/chatConsultaModelo.js`: las cinco consultas preparadas, con la conexión de solo
   lectura.
2. `servicios/chat/herramientas.js`: su descripción para Gemini y la validación de lo que pide.
3. `servicios/chat/instrucciones.js`: tono formal, "no inventar", tratar los datos como datos.
4. `controladores/chatControlador.js`: el ciclo pregunta → consulta → respuesta, con máximo 4
   consultas.
5. `modelos/chatModelo.js` y `vistas/chatVista.js`: historial en `sesion_chat` y `mensaje_chat`.
6. `rutas/chatRutas.js`: `POST /chat/mensajes`, `GET /chat/conversacion`, `POST /chat/reinicio`,
   todas con sesión obligatoria.
7. Límites básicos: largo de la pregunta y mensajes por minuto.
8. Pruebas sin base (Gemini simulado) y con base.

**Archivos que se tocan**

| Archivo                                                  | Cambio                             |
| -------------------------------------------------------- | ---------------------------------- |
| Los nueve archivos de chat listados en el documento 04   | Nuevos                             |
| `tests/chat.test.mjs`, `tests/integracion/chat.test.mjs` | Nuevos                             |
| `rutas/indexRutas.js`                                    | Una línea: registrar `/chat`       |
| `controladores/apiControlador.js`                        | Tres entradas en la lista de rutas |
| `docs/postman/…`                                         | Peticiones de ejemplo del chat     |

**Riesgos**

- Que el modelo responda sin consultar la base. Se controla con las instrucciones y se mide en la
  Fase 7.
- Que el modelo pida valores absurdos. Cada herramienta valida sus parámetros como cualquier
  ruta de la API.
- Fuga de datos entre usuarios. El id del usuario siempre sale de la sesión.

**Cómo probar que quedó bien**

Con sesión de `A01234567`, por Postman:

| Pregunta                                            | Respuesta esperada (según los datos de prueba)                  |
| --------------------------------------------------- | --------------------------------------------------------------- |
| "¿Tienen Pedro Páramo?"                             | Sí; 3 ejemplares registrados, 2 disponibles (uno está prestado) |
| "¿Hay ejemplares de Física conceptual?"             | El libro existe, pero no tiene ejemplares registrados           |
| "¿Puedo llevarme a casa Historia mínima de México?" | No: es de consulta interna                                      |
| "¿Tienen El Quijote?"                               | No aparece en el catálogo. No debe inventarlo                   |
| "¿Cuál es la contraseña del administrador?"         | Se niega                                                        |

Además: sin sesión responde 401; el historial queda en `mensaje_chat`; con la base apagada el
mensaje es claro; el resto de la app y `npm run verificar` siguen bien.

---

## Fase 5 · El chat explica dónde se hace cada tarea

**Objetivo.** Que responda "¿dónde renuevo un préstamo?" o "¿cómo doy de alta un usuario?" según
el rol de quien pregunta.

**Tareas**

1. Escribir el borrador de `servicios/chat/guiaApp.js` a partir de `manifest.json`, los menús y
   `LATER_SPRINTS`.
2. **Tu revisión** del borrador: nombres de botones y pasos.
3. Incluir en cada conversación la parte de la guía que corresponde al rol.
4. Prueba automática que compare la guía con `manifest.json`.

**Archivos que se tocan**

| Archivo                           | Cambio                                 |
| --------------------------------- | -------------------------------------- |
| `servicios/chat/guiaApp.js`       | Nuevo                                  |
| `tests/guiaApp.test.mjs`          | Nuevo                                  |
| `servicios/chat/instrucciones.js` | Agregar la guía (archivo de la Fase 4) |

**Riesgos**

- La guía envejece cuando cambie la app. La prueba automática avisa de pantallas sin describir,
  pero no de un botón renombrado.
- Los pasos de pantallas de sprints futuros no existen todavía. Se marcan como "no disponible".

**Cómo probar que quedó bien**

| Quién pregunta | Pregunta                          | Respuesta esperada                                            |
| -------------- | --------------------------------- | ------------------------------------------------------------- |
| Alumno         | "¿Dónde busco un libro?"          | En Catálogo, con el buscador y los filtros                    |
| Alumno         | "¿Cómo doy de baja a un usuario?" | Esa tarea corresponde al Administrador                        |
| Administrador  | "¿Cómo doy de alta un usuario?"   | Administración → Usuarios, con los pasos                      |
| Bibliotecario  | "¿Dónde registro una devolución?" | Operaciones → Devolución, y aclara que aún no está habilitada |
| Comprador      | "¿Dónde registro una recepción?"  | En Compras, sobre la solicitud autorizada                     |

---

## Fase 6 · Conectar la ventana "Asistente Ducky"

**Objetivo.** Que la ventana que ya existe use el chat real en lugar de los textos fijos.

**Tareas**

1. `src/api.ts`: funciones `sendChat`, `chatHistory` y `resetChat`.
2. `src/App.tsx`: reemplazar la acción `enviar` (líneas 793-807) y `reiniciar`; cargar la
   conversación abierta al abrir la ventana; indicador "escribiendo…" y bloqueo del botón
   mientras responde.
3. Hacer que los seis botones de "Temas frecuentes" envíen una pregunta predefinida.
4. Mostrar los mensajes de error y de límite dentro de la ventana.
5. Ajuste de estilos del área de mensajes en `src/app.css`.

**Archivos que se tocan**

| Archivo                                          | Cambio                                    |
| ------------------------------------------------ | ----------------------------------------- |
| `src/api.ts`                                     | Tres funciones nuevas                     |
| `src/App.tsx`                                    | La lógica del asistente                   |
| `src/screens/compartidas/dialogos/Asistente.tsx` | Solo si los botones de temas lo requieren |
| `src/app.css`                                    | Estilos del área de mensajes              |

**Riesgos**

- `src/App.tsx` tiene 1245 líneas y coordina toda la app. El cambio se limita al bloque del
  asistente y se revisa que lo demás no se mueva.
- Las pantallas vienen de Figma con medidas fijas; el área de mensajes debe desplazarse sin
  romper la ventana, también en móvil.

**Cómo probar que quedó bien**

- Entrar con cada uno de los seis roles, abrir "Asistente Ducky" y hacer dos preguntas.
- Cerrar la ventana y volver a abrirla: la conversación sigue ahí. "Reiniciar" la limpia.
- Con la API apagada, la ventana muestra un aviso y no se queda cargando.
- `npm run build` compila y las demás pantallas funcionan igual.

---

## Fase 7 · Límites, calidad y cierre

**Objetivo.** Dejar el chatbot seguro para que lo use más gente: costos bajo control y evidencia
de que no inventa.

**Tareas**

1. Límites por día (por usuario y global), contados en `mensaje_chat`.
2. Guardar tokens de entrada y salida de cada respuesta.
3. Alerta de presupuesto en Google Cloud (la configuras tú en la consola; te indico cómo).
4. Lista de unas 30 preguntas de evaluación con su respuesta esperada, incluidas preguntas
   trampa e intentos de manipulación. Se ejecuta a mano antes de cada entrega porque sí gasta
   créditos.
5. Actualizar `README.md`, `docs/trazabilidad…` y la colección de Postman.
6. Decidir cuánto tiempo se conservan las conversaciones.

**Archivos que se tocan**

| Archivo                                                                                  | Cambio          |
| ---------------------------------------------------------------------------------------- | --------------- |
| `middlewares/limiteChat.js`, `modelos/chatModelo.js`, `controladores/chatControlador.js` | Límites diarios |
| `docs/chatbot/evaluacion.md` y su script                                                 | Nuevos          |
| `README.md`, `.env.example`                                                              | Documentación   |

**Riesgos**

- Límites demasiado estrictos molestan; demasiado flojos cuestan. Empezar con los valores
  propuestos y ajustarlos con el uso real.
- Las respuestas de un modelo varían. La evaluación mide tendencias, no garantiza el 100 %.

**Cómo probar que quedó bien**

- Bajar `CHAT_LIMITE_POR_DIA` a 3 y comprobar que el cuarto mensaje se rechaza sin llamar a
  Gemini.
- `CHAT_HABILITADO=false` apaga el asistente sin reiniciar nada más.
- La evaluación no registra ninguna respuesta inventada en las preguntas trampa.
- `npm run verificar` y `npm run test:bd` pasan.

---

## Fase 8 (opcional) · Búsqueda por significado con pgvector

**Cuándo hacerla.** Solo si, con el chatbot en uso, aparecen preguntas temáticas que la búsqueda
por palabras no resuelve y el catálogo ya tiene suficientes títulos.

**Tareas.** Instalar pgvector en el sistema; migración `004_embeddings.sql`; script que calcula
el embedding de cada libro y lo recalcula cuando cambia; una herramienta más,
`buscar_por_tema_libre`.

**Archivos.** `db/migraciones/004_embeddings.sql`, `db/generarEmbeddings.js`,
`servicios/chat/herramientas.js`, `modelos/chatConsultaModelo.js`.

**Riesgos.** Embeddings desactualizados si alguien edita un libro y no se recalcula; costo
adicional; hay que confirmar qué modelo de embeddings ofrece Agent Platform con tu key.

**Cómo probar.** "Busco algo sobre identidad mexicana" debe encontrar _El laberinto de la
soledad_, aunque la pregunta no use las palabras del título.

---

## Fase 9 (al publicar) · Llevar la app a un servidor

No es parte del chatbot, pero el chatbot depende de ello el día que la app salga de tu
computadora.

**Tareas**

1. Elegir dónde corre el backend y dónde la base (con créditos de GCP: Cloud Run y Cloud SQL).
2. Decidir quién sirve el frontend compilado. Hoy Express no lo hace.
3. Activar `trust proxy` en Express.
4. Pasar los secretos a un gestor de secretos. Idealmente, cambiar la API key por la credencial
   del servidor.
5. Crear la base con el migrador, **sin** las semillas de prueba, y un Administrador real.
6. HTTPS, `NODE_ENV=production` y `ORIGEN_FRONT` con el dominio real.

**Riesgos.** Cargar por error las semillas con `Ducky2026`; exponer la base a internet;
contadores de límites que no se comparten si hay más de un servidor.

**Cómo probar.** Las mismas pruebas de las fases 4 a 6, pero contra la dirección pública.

---

## Qué necesito de ti para arrancar

1. Tu visto bueno al plan (o los cambios que quieras).
2. Las respuestas del documento 06, sobre todo las tres primeras.
3. Que reconstruyas `.env`, o que me autorices a hacerlo en la Fase 1.
