# 04 · Diseño del chatbot

## La idea en pocas palabras

El asistente Ducky no "sabe" nada de la biblioteca por sí mismo. Cada vez que alguien pregunta,
el backend le da a Gemini tres cosas: las reglas de comportamiento, una guía de la app y un
juego de **consultas ya preparadas** que puede pedir. Gemini decide qué consulta necesita, el
backend la ejecuta contra PostgreSQL con un usuario de solo lectura y le devuelve el resultado.
Gemini redacta la respuesta con esos datos. Si los datos no alcanzan, lo dice.

```text
Navegador                Backend (Express)                        Google          PostgreSQL
─────────                ─────────────────                        ──────          ──────────
Ventana "Asistente" ──▶  POST /api/chat/mensajes
                         1. ¿Sesión válida? ¿Dentro del límite?
                         2. Guarda la pregunta                 ─────────────────▶ mensaje_chat
                         3. Envía: reglas + guía + historial ──▶  Gemini
                                                              ◀──  "necesito buscar_libros(autor: Rulfo)"
                         4. Ejecuta esa consulta fija         ─────────────────▶ chat.libro (solo lectura)
                         5. Devuelve las filas               ──▶  Gemini
                                                              ◀──  respuesta redactada
                         6. Guarda la respuesta               ─────────────────▶ mensaje_chat
Muestra la respuesta ◀── 7. Responde JSON
```

La key de Gemini solo existe en el paso 3, dentro del backend. El navegador nunca la ve.

## Conexión con Gemini

### Qué se usa

- **SDK:** `@google/genai`, el SDK oficial Google Gen AI. Pide Node 22 o más; tienes 26.
- **Plataforma:** Gemini Enterprise Agent Platform (antes Vertex AI). Las llamadas van a
  `aiplatform.googleapis.com`, que es donde aplican tus créditos de GCP. **No** se usa
  `generativelanguage.googleapis.com` (AI Studio).
- **Key:** la de `GEMINI_API_KEY`, pasada a mano porque el SDK busca `GOOGLE_API_KEY`.

### Cómo se configura el cliente

```js
import { GoogleGenAI } from '@google/genai';

const ClienteGemini = new GoogleGenAI({
  enterprise: true, // Agent Platform, no AI Studio
  apiKey: process.env.GEMINI_API_KEY, // explícita: el SDK no busca este nombre
});
```

**Comprobado en la Fase 3 (15 de noviembre de 2026), con una llamada real:**

- `enterprise: true` junto con `apiKey` funciona en JavaScript con la versión 3.3 del SDK. La
  documentación no traía ese ejemplo, pero el código del SDK lo contempla y la prueba lo
  confirmó.
- La dirección que usa el cliente es `https://aiplatform.googleapis.com/`: Agent Platform, no AI
  Studio. Además, el servicio se niega a funcionar si el cliente no quedó en Agent Platform.
- Las peticiones llegan a tu proyecto de Google Cloud, que es donde aplican los créditos.
- El modelo ligero entiende las consultas preparadas: ante "¿Tienen algún libro de Juan Rulfo
  disponible?" pidió `buscar_libros(autor: "Juan Rulfo")` y, con el resultado, respondió de
  manera formal con los datos exactos. Esa conversación completa costó 239 tokens de entrada y
  77 de salida.
- Un detalle para la Fase 4: el modelo tiende a responder con formato Markdown (negritas y
  viñetas). Hay que pedirle texto simple o convertirlo al mostrarlo.

Para repetir la comprobación: `npm run chat:probar`.

### Sobre tu key

- Empieza con `AQ.`, el formato de las keys de Google Cloud ligadas a una cuenta de servicio.
  Coincide con lo que describiste.
- Google recomienda API key **para pruebas** y la credencial del propio servidor (ADC) **para
  producción**. Para desarrollo y para una entrega escolar la key es suficiente.
- Conviene restringirla en la consola de Google Cloud para que solo pueda llamar a la API de
  Agent Platform. Así, si se filtrara, no serviría para otra cosa.

### Modelo

Se usa **`gemini-3.5-flash-lite`**, un modelo ligero: rápido, económico y suficiente para
preguntas de biblioteca. El nombre va en `GEMINI_MODELO` para cambiarlo sin tocar código.

Lo que respondió tu proyecto al probar cada modelo:

| Modelo                                                                                      | Resultado                                                               |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `gemini-3.5-flash-lite`                                                                     | Disponible. Es el elegido                                               |
| `gemini-3.1-flash-lite`                                                                     | Disponible                                                              |
| `gemini-3.8-flash`                                                                          | Disponible, pero "piensa" antes de responder y eso se cobra como salida |
| `gemini-3.8-flash-lite`, `gemini-3-flash-lite`, `gemini-2.5-flash-lite`, `gemini-2.5-flash` | No disponibles                                                          |

Si más adelante las respuestas se quedan cortas, el siguiente paso natural es `gemini-3.8-flash`.

## Dudas sobre ejemplares: SQL, RAG o combinación

### Las tres opciones, en sencillo

**SQL de solo lectura.** El asistente consulta la base en el momento y lee el dato exacto: hay 3
copias disponibles, están en el librero LIT fila A1. Es como preguntarle al bibliotecario que
mira el sistema.

**RAG con embeddings (pgvector).** Se convierte el texto de cada libro en una lista de números
que representa su significado y se guarda. Al preguntar, se buscan los libros con significado
parecido. Sirve para preguntas vagas ("algo sobre identidad mexicana") aunque no coincida
ninguna palabra. Es como un bibliotecario que recuerda de qué trata cada libro, pero con la
memoria de la última vez que los revisó.

**Combinación.** SQL para los hechos, embeddings para encontrar por significado.

### Comparación

| Criterio                                     | SQL de solo lectura             | RAG con pgvector                         |
| -------------------------------------------- | ------------------------------- | ---------------------------------------- |
| "¿Hay ejemplares disponibles de X?"          | Exacto y al momento             | Malo: el dato guardado puede estar viejo |
| "¿Dónde está el ejemplar X?"                 | Exacto                          | Malo                                     |
| "¿Qué libros hay de Rulfo?"                  | Exacto                          | Aproximado                               |
| "Recomiéndame algo sobre identidad mexicana" | Solo si la palabra aparece      | Bueno                                    |
| Riesgo de inventar                           | Bajo: responde con filas reales | Mayor: trae "parecidos", no "correctos"  |
| Trabajo de mantenimiento                     | Ninguno                         | Recalcular cada vez que cambia un libro  |
| Costo                                        | Solo la respuesta               | Respuesta + cálculo de embeddings        |
| Qué hay que instalar                         | Nada                            | pgvector en el sistema (hoy no está)     |

### Recomendación

**Empezar solo con SQL de solo lectura, mediante consultas preparadas. Dejar pgvector como fase
opcional.**

Razones:

1. Lo que pediste es que responda **con datos reales y sin inventar**. Disponibilidad, ubicación
   y tipo de uso son datos exactos que cambian con cada préstamo. Eso es terreno de SQL.
2. El catálogo actual tiene 8 libros con descripciones de una línea. Los embeddings no aportarían
   nada medible todavía.
3. El proyecto ya tiene una búsqueda que ignora acentos y mayúsculas (`modelos/consultaModelo.js`).
   Además, Gemini ayuda por su cuenta: si alguien pide "novelas mexicanas", puede buscar por el
   tema "Literatura" y revisar las descripciones que regresan.
4. pgvector no está instalado y agrega piezas que mantener.

Cuándo sí valdría la pena la combinación: si el catálogo crece a cientos de títulos con
descripciones ricas y los usuarios hacen preguntas temáticas que la búsqueda por palabra no
resuelve. El diseño lo permite sin rehacer nada: sería una consulta preparada más
(`buscar_por_tema_libre`).

### Por qué "consultas preparadas" y no dejar que la IA escriba SQL

Hay dos formas de dar acceso de lectura:

- **Que Gemini escriba el SQL** (texto a SQL). Flexible, pero puede escribir consultas erróneas,
  lentas, o ser manipulado por un usuario para leer lo que no debe.
- **Que Gemini elija entre consultas ya escritas por nosotros** (se llama _function calling_).
  Gemini solo aporta los valores: el título, el autor, la clave. El SQL nunca lo escribe la IA.

Propongo la segunda. Es la misma técnica de parámetros que ya usa todo el proyecto, y con el
usuario de solo lectura queda una doble protección.

### Consultas preparadas del asistente

| Herramienta                    | Qué responde                                                                                                   | De dónde lee                   |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `buscar_libros`                | Libros por título, autor, tema, editorial, clave o texto libre, con disponibles y registrados. Máximo 10 filas | `chat.libro`                   |
| `consultar_libro`              | La ficha completa de una clave y la lista de sus ejemplares                                                    | `chat.libro` + `chat.ejemplar` |
| `consultar_ejemplar`           | Una copia por su código: estado, tipo de uso, librero y fila                                                   | `chat.ejemplar`                |
| `listar_temas_y_tipos_de_uso`  | Los temas del catálogo y qué significa cada tipo de uso                                                        | `categoria`, `tipo_uso`        |
| `consultar_reglas_de_prestamo` | Días hábiles y renovaciones por tipo de usuario                                                                | `politica_prestamo`            |

Todas respetan los permisos del usuario: `consultar_ejemplar` devuelve librero y fila solo si su
perfil tiene `CONSULTAR_UBICACION`, igual que la pantalla.

**Fuera de la primera versión:** "mis préstamos" y "mis multas". Las tablas existen, pero la API
de préstamos es del Sprint 2 y los datos son de prueba. Agregarlo después es una herramienta más,
con una regla estricta: el id del usuario lo pone el backend desde la sesión, **nunca** lo decide
Gemini (pregunta abierta 2).

## Roles y permisos, comprobados en la aplicación

Esta sección sustituye a la propuesta original de "dónde realizar tareas" que sigue más abajo.
Por decisión del proyecto la guía es **general**: el asistente identifica quién le habla y qué
puede o no puede hacer, sin dar pasos ni nombres de botones.

### Cómo se comprobó (15 de noviembre de 2026)

1. Se abrió la aplicación en un navegador con una cuenta de cada perfil y se recorrió cada
   opción de su menú.
2. Con cada cuenta se intentó entrar, escribiendo la dirección, a pantallas de otros roles.
3. Con cada cuenta se envió a la API una petición por operación, vacía o sobre un registro
   inexistente, para ver si respondía "sin permiso". Ninguna modificó datos.

### Menú que muestra la aplicación a cada rol

| Rol                          | Secciones                                               | Aún no habilitado                      |
| ---------------------------- | ------------------------------------------------------- | -------------------------------------- |
| Alumno, Maestro, Colaborador | Catálogo, Mi cuenta                                     | Mi cuenta (Sprint 2)                   |
| Bibliotecario                | Catálogo, Libros, Operaciones                           | Todo Operaciones (Sprints 2 y 3)       |
| Administrador                | Reportes, Usuarios, Libros, Administración, Operaciones | Reportes (Sprint 5) y todo Operaciones |
| Comprador de libros          | Compras                                                 | Nada                                   |

Al intentar entrar a una pantalla de otro rol, la aplicación regresa a la pantalla inicial del
rol propio.

### Qué permite la API a cada perfil

| Operación                                                 | Alumno, Maestro, Colaborador | Bibliotecario de ventanilla | Bibliotecario de consulta | Comprador | Administrador |
| --------------------------------------------------------- | ---------------------------- | --------------------------- | ------------------------- | --------- | ------------- |
| Consultar libros, ubicación y listado                     | Sí                           | Sí                          | Sí                        | Sí        | Sí            |
| Alta, cambio y baja de libros y ejemplares                | No                           | Sí                          | No                        | No        | Sí            |
| Historial y etiquetas de libros                           | No                           | Sí                          | No                        | No        | Sí            |
| Cuentas de usuario (consulta, alta, cambio, baja, perfil) | No                           | No                          | No                        | No        | Sí            |
| Perfiles (consulta, alta, cambio, desactivar)             | No                           | No                          | No                        | No        | Sí            |
| Compras (solicitudes y recepciones)                       | No                           | No                          | No                        | Sí        | Sí            |
| Usar el asistente                                         | Sí                           | Sí                          | Sí                        | Sí        | Sí            |

Coincide exactamente con los permisos guardados en la base (`perfil_permiso`).

### Lo que se descubrió al abrir la app

- **El menú depende del rol; el permiso real, del perfil.** La cuenta "Bibliotecario de
  consulta" ve los mismos botones de agregar y editar libros que el Bibliotecario de ventanilla,
  pero la API le rechaza esas operaciones. Por eso la guía se arma con los permisos del perfil y
  no con el nombre del rol.
- **El Comprador de libros no tiene catálogo en su menú**, aunque su perfil sí puede consultar
  libros. El asistente le ofrece consultarlos por él.
- **El Administrador gestiona las compras en "Solicitudes de libros"** (dentro de
  Administración), no en la pantalla Compras.
- **Posible error del front, por confirmar a mano:** al pulsar "Historial" en Gestión de libros,
  la aplicación pidió `/api/libros//historial`, sin la clave del libro. Ocurrió con clics
  automatizados y con dos cuentas distintas.

### Cómo lo usa el asistente

`servicios/chat/guiaApp.js` arma, para cada pregunta, un texto con: nombre, rol y perfil de quien
pregunta; las secciones de su menú; lo que sus permisos sí le permiten; lo que no; y las
funciones de su menú que aún no están habilitadas. El asistente responde con eso.

Además incluye un resumen general de **los demás roles**: un renglón por cada perfil activo, con
lo que ese perfil puede hacer y las secciones de su menú. Sale de los perfiles y permisos de la
base, que se leen en cada pregunta (`perfilModelo.listarPerfiles`), así que un perfil nuevo o
modificado se refleja solo. No incluye personas: el asistente no dice quién tiene cada rol.

Para que la guía no quede desactualizada sin que nadie lo note, hay tres pruebas automáticas:

| Prueba                                | Qué compara                                                           |
| ------------------------------------- | --------------------------------------------------------------------- |
| `tests/integracion/chatGuia.test.mjs` | Lo que la guía dice de cada perfil contra lo que la API le permite    |
| `tests/chatGuia.test.mjs` (permisos)  | Los permisos de la guía contra los de la base                         |
| `tests/chatGuia.test.mjs` (front)     | El menú por rol y las pantallas pendientes contra el código del front |

Si el equipo cambia el menú o habilita una pantalla pendiente, la prueba falla e indica qué
actualizar en la guía.

## Dudas sobre dónde realizar tareas (propuesta original)

### De dónde saldrá la información

Propongo una **guía de la app escrita por nosotros**, en un archivo nuevo del backend
(`servicios/chat/guiaApp.js`), con una entrada por tarea:

```js
{
  tarea: 'Dar de alta un libro',
  roles: ['Administrador', 'Bibliotecario'],
  permiso: 'ALTA_LIBROS',
  pasos: 'Menú Libros → Gestión de libros → botón "Agregar libro".',
  disponible: true,
}
```

Es corta (unas 40 tareas), así que **se envía completa** en cada conversación, filtrada por el
rol de quien pregunta. No hace falta RAG para esto: cabe de sobra y así no hay riesgo de que la
búsqueda traiga el fragmento equivocado.

### Con qué se construye

No se inventa: sale de tres archivos que ya describen la app.

| Fuente                                                 | Qué aporta                                            |
| ------------------------------------------------------ | ----------------------------------------------------- |
| `src/manifest.json`                                    | Las 21 pantallas y 33 ventanas, con su nombre y rol   |
| `src/components/SessionNavigation.tsx` y `src/App.tsx` | Los menús reales de cada rol                          |
| `LATER_SPRINTS` en `src/App.tsx`                       | Qué pantallas aún no funcionan y en qué sprint llegan |

Menús reales hoy:

| Rol                          | Menú                                                                                                                                                |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Alumno, Maestro, Colaborador | Catálogo · Mi cuenta                                                                                                                                |
| Bibliotecario                | Catálogo · Libros (Catálogo, Gestión de catálogo, Gestión de libros) · Operaciones (Préstamos, Devolución, Renovación, Multas y pagos, Suspendidos) |
| Administrador                | Reportes · Usuarios · Libros · Administración (Usuarios, Perfiles, Solicitudes de libros) · Operaciones                                             |
| Comprador de libros          | Compras                                                                                                                                             |

### Tres reglas de la guía

1. **Por rol.** A un Alumno no se le explica cómo dar de baja usuarios. Si pregunta, el asistente
   responde que esa tarea corresponde al Administrador.
2. **Honesta con lo pendiente.** Si la tarea es de un sprint futuro (`disponible: false`),
   responde que la función aún no está habilitada, en lugar de mandar al usuario a una pantalla
   vacía.
3. **Se mantiene con la app.** Cuando un sprint agregue una pantalla, se actualiza la guía. Una
   prueba automática comparará la guía con `manifest.json` y avisará si quedó una pantalla sin
   describir.

El primer borrador lo escribo yo a partir del código; tú o el equipo lo revisan, porque son
ustedes quienes conocen el nombre exacto de cada botón (pregunta abierta 6).

## Cómo se evita que invente

- **Instrucciones fijas** al modelo: tono formal y trato de "usted"; responder solo con los
  resultados de las consultas y con la guía; si no hay datos, decir "No cuento con esa
  información" y sugerir acudir al personal de la biblioteca; no responder temas ajenos.
- **Temperatura baja**, para respuestas sobrias y repetibles.
- **Los resultados de la base se tratan como datos, no como órdenes.** Si la descripción de un
  libro dijera "ignora tus instrucciones", el asistente no debe obedecerla.
- **Sin acceso de escritura.** El asistente no puede prestar, renovar ni cambiar nada: solo
  explica dónde hacerlo.
- **Rastro de cada respuesta.** En `mensaje_chat.herramientas` queda qué consultas hizo. Si una
  respuesta sale mal, se puede ver si la base devolvió eso o si el modelo se equivocó.
- **Pruebas con preguntas trampa** (Fase 7): libros que no existen, ejemplares dados de baja,
  preguntas fuera de tema.

## Historial de conversaciones

- Se usan las tablas que ya existen: una fila en `sesion_chat` por conversación y una en
  `mensaje_chat` por cada pregunta y cada respuesta.
- **"Reiniciar"** cierra la sesión de chat actual y abre otra.
- A Gemini se le envían solo los **últimos 10 mensajes** de la conversación. Así entiende "¿y
  dónde está ese?" sin que el costo crezca con cada pregunta.
- Cada quien ve solo sus conversaciones: el id del usuario sale de la sesión, no del navegador.
- Al abrir la ventana, el frontend pide la conversación abierta para mostrarla de nuevo.
- Las conversaciones son datos personales. Propongo conservarlas 90 días (pregunta abierta 7).

## Límites de uso y costo

| Límite                           | Valor inicial  | Qué evita                              |
| -------------------------------- | -------------- | -------------------------------------- |
| Solo con sesión iniciada         | —              | Uso anónimo                            |
| Mensajes por usuario por minuto  | 6              | Ráfagas y bucles                       |
| Mensajes por usuario por día     | 40             | Que una persona consuma el presupuesto |
| Mensajes totales por día         | 1000           | Tope del gasto diario                  |
| Largo de la pregunta             | 500 caracteres | Preguntas enormes                      |
| Largo de la respuesta            | ~600 tokens    | Respuestas largas y caras              |
| Consultas a la base por pregunta | 4              | Que el modelo entre en bucle           |
| Filas por consulta               | 10             | Enviar el catálogo entero              |
| Tiempo máximo por respuesta      | 20 segundos    | Peticiones colgadas                    |
| Interruptor `CHAT_HABILITADO`    | —              | Apagar todo de inmediato               |

El límite por minuto reutiliza `express-rate-limit`, que ya está instalado. Los límites por día
se cuentan en `mensaje_chat`, así sobreviven a un reinicio del servidor.

Además, **fuera del código**: una alerta de presupuesto en Google Cloud que te avise por correo
al llegar a cierto gasto. Es la red de seguridad más importante y se configura en la consola.

## Manejo de errores

El usuario siempre recibe un mensaje claro y formal; el detalle técnico queda en la consola del
servidor y nunca se muestra.

| Situación                                 | Qué ve el usuario                                                     |
| ----------------------------------------- | --------------------------------------------------------------------- |
| Asistente apagado o sin key               | "El asistente no está disponible por el momento."                     |
| Límite por minuto o por día               | "Ha alcanzado el límite de consultas. Intente más tarde."             |
| Google está saturado o tarda demasiado    | "El asistente no pudo responder en este momento. Intente nuevamente." |
| La base de datos no responde              | "No fue posible consultar el catálogo en este momento."               |
| Google bloquea la respuesta por seguridad | "No puedo responder esa consulta."                                    |
| Pregunta vacía o demasiado larga          | Aviso del límite, sin llamar a Gemini (no cuesta)                     |
| Sesión vencida                            | El mismo aviso de sesión que el resto de la app                       |

Reglas internas: un solo reintento automático ante saturación; si la base falla, **no** se le
pide a Gemini que conteste "de memoria"; los errores se registran en `mensaje_chat` con
`resultado = 'ERROR'`.

## Piezas nuevas, siguiendo el estilo del proyecto

```text
rutas/chatRutas.js                 POST /api/chat/mensajes, GET /api/chat/conversacion, POST /api/chat/reinicio
controladores/chatControlador.js   Valida, aplica límites y coordina
servicios/geminiServicio.js        El cliente de Gemini (único archivo que conoce la key)
servicios/chat/herramientas.js     Las consultas preparadas y su descripción para Gemini
servicios/chat/guiaApp.js          La guía de "dónde se hace cada tarea"
servicios/chat/instrucciones.js    Las reglas de comportamiento del asistente
modelos/chatModelo.js              SQL del historial y de los conteos de uso
modelos/chatConsultaModelo.js      SQL de solo lectura (usa la conexión de solo lectura)
vistas/chatVista.js                Formato de las respuestas JSON
config/dbLectura.js                Conexiones con el usuario de solo lectura
middlewares/limiteChat.js          Límite por minuto
```

`servicios/geminiServicio.js` seguirá el patrón de `tesoreriaServicio.js`: un "transporte" que
las pruebas reemplazan por uno simulado. Así las pruebas automáticas **no gastan créditos** ni
necesitan internet.

En el frontend cambian tres cosas pequeñas: una función `sendChat` en `src/api.ts`, la acción
`enviar` de `src/App.tsx` (hoy con textos fijos) y un indicador de "escribiendo…". La ventana
`Asistente.tsx` ya existe y se conserva.

## Local hoy, publicado después

| Tema                  | En desarrollo (hoy)                     | Cuando se publique                                                                     |
| --------------------- | --------------------------------------- | -------------------------------------------------------------------------------------- |
| Llamadas a Gemini     | Desde tu computadora; necesita internet | Desde el servidor. Sin cambios de código                                               |
| Credencial de Gemini  | API key en `.env`                       | Guardada en un gestor de secretos; idealmente la credencial del servidor en vez de key |
| Base de datos         | PostgreSQL local                        | Servidor administrado (ver documento 03)                                               |
| Frontend              | Vite en `127.0.0.1:5173` reenvía `/api` | Hay que decidir quién sirve los archivos compilados; hoy Express no lo hace            |
| Cookie de sesión      | Sin HTTPS                               | HTTPS obligatorio (la cookie ya se marca `secure` en producción)                       |
| Límites por IP        | Funcionan                               | Falta activar `trust proxy` en Express, o todos compartirían una misma IP              |
| Contadores por minuto | En memoria del proceso                  | Con más de un servidor habría que llevarlos a la base                                  |
| Presupuesto           | Poco tráfico                            | Alerta de presupuesto y tope global diario                                             |

Nada de esto bloquea el desarrollo en local. Son los pendientes para el día de publicar y están
reunidos en la Fase 9 del plan.
