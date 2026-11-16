# 02 · Variables de entorno

## Qué pasó con tu `.env`

Hoy el archivo tiene una sola línea: `GEMINI_API_KEY`. La API exige otras seis y, si faltan, se
detiene al arrancar con el mensaje `Faltan variables en .env: …` (`config/entorno.js`, línea 33).

No se perdió nada irrecuperable: `.env.example` conserva la lista completa. Solo dos valores
eran propios de tu computadora, y los dos se vuelven a generar.

## Variables que el código usa hoy

Busqué `process.env` e `import.meta.env` en todo el proyecto. Solo se leen en
`config/entorno.js` y `vite.config.ts`. El frontend no lee ninguna.

| Variable                   | Obligatoria | Para qué sirve                                                                                   | Dónde se usa                                                     | De dónde sacar el valor                                                                                                                 |
| -------------------------- | ----------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `PGHOST`                   | Sí          | Computadora donde está PostgreSQL                                                                | `config/entorno.js` → `config/db.js`, `db/reiniciarBaseDatos.js` | `localhost`                                                                                                                             |
| `PGPORT`                   | Sí          | Puerto de PostgreSQL                                                                             | Igual                                                            | `5432` (comprobado: tu servidor escucha ahí)                                                                                            |
| `PGDATABASE`               | Sí          | Nombre de la base del proyecto                                                                   | Igual                                                            | `sigb_ducky`. **No pongas `faltas`**: `db:reset` borra la base que nombres                                                              |
| `PGUSER`                   | Sí          | Usuario de PostgreSQL                                                                            | Igual                                                            | `postgres`                                                                                                                              |
| `PGPASSWORD`               | Sí          | Contraseña de ese usuario                                                                        | Igual                                                            | La que definiste al instalar PostgreSQL. Tu servidor local hoy acepta conexiones sin contraseña, pero la variable no puede quedar vacía |
| `JWT_SECRETO`              | Sí          | Clave que firma las sesiones. Mínimo 32 caracteres                                               | `config/entorno.js` → `utilidades/sesion.js`                     | Se genera nueva (comando abajo). Al cambiarla, las sesiones abiertas dejan de valer; no hay otro efecto                                 |
| `PUERTO`                   | No (3000)   | Puerto de la API                                                                                 | `config/entorno.js`, `vite.config.ts`                            | `3000`                                                                                                                                  |
| `NODE_ENV`                 | No          | `development`, `test` o `production`. En producción activa la cookie segura y bloquea `db:reset` | `config/entorno.js` y las pruebas                                | `development`                                                                                                                           |
| `ORIGEN_FRONT`             | No          | Dirección del frontend autorizada a enviar la cookie                                             | `config/entorno.js` → `app.js`                                   | `http://127.0.0.1:5173`                                                                                                                 |
| `DURACION_SESION_HORAS`    | No (8)      | Horas que dura una sesión                                                                        | `config/entorno.js` → `utilidades/sesion.js`                     | `8`                                                                                                                                     |
| `LIMITE_INTENTOS_LOGIN`    | No (10)     | Intentos fallidos de login permitidos                                                            | `config/entorno.js` → `rutas/authRutas.js`                       | `10`                                                                                                                                    |
| `VENTANA_INTENTOS_MINUTOS` | No (15)     | Minutos de la ventana de intentos                                                                | Igual                                                            | `15`                                                                                                                                    |
| `GEMINI_API_KEY`           | —           | Hoy **ningún programa la lee**. Será la key del chatbot                                          | —                                                                | Ya la tienes en `.env`                                                                                                                  |

Comando para generar `JWT_SECRETO`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Variables del chatbot que quedaron construidas (15 de noviembre de 2026)

Esta tabla es la vigente; la propuesta original sigue más abajo. Todas son opcionales y están en
`.env.example`.

| Variable                 | Para qué sirve                                                   | Valor por omisión       |
| ------------------------ | ---------------------------------------------------------------- | ----------------------- |
| `GEMINI_API_KEY`         | Key de Agent Platform. Sin ella el asistente queda apagado       | (ninguno)               |
| `GEMINI_MODELO`          | Modelo que responde                                              | `gemini-3.5-flash-lite` |
| `CHAT_HABILITADO`        | `false` apaga el asistente                                       | `true`                  |
| `CHAT_PGUSER`            | Usuario de PostgreSQL de solo lectura para consultar el catálogo | (ninguno)               |
| `CHAT_PGPASSWORD`        | Contraseña de ese usuario                                        | (ninguno)               |
| `CHAT_LIMITE_POR_MINUTO` | Preguntas por cuenta en cada minuto                              | `6`                     |
| `CHAT_MAX_CARACTERES`    | Largo máximo de una pregunta                                     | `500`                   |

No se construyeron `CHAT_LIMITE_POR_DIA` ni `CHAT_LIMITE_GLOBAL_DIA`: se decidió no poner
límites por día.

## Variables nuevas que propongo para el chatbot (propuesta original)

Todas serían **opcionales**: si faltan, la app arranca igual y el asistente responde que no está
disponible. Así el chatbot nunca impide que el resto del sistema funcione.

| Variable                 | Para qué sirve                                                      | Valor sugerido            | De dónde sale                                               |
| ------------------------ | ------------------------------------------------------------------- | ------------------------- | ----------------------------------------------------------- |
| `GEMINI_API_KEY`         | Key de Agent Platform. Se pasa al SDK de forma explícita            | (la que ya tienes)        | Consola de Google Cloud → Agent Platform → API keys         |
| `GEMINI_MODELO`          | Modelo que responde. Va en variable para cambiarlo sin tocar código | Un modelo "flash" vigente | Lista de modelos de Agent Platform (ver pregunta abierta 4) |
| `CHAT_HABILITADO`        | Interruptor general: `false` apaga el asistente de inmediato        | `true`                    | Lo decides tú                                               |
| `CHAT_PGUSER`            | Usuario de PostgreSQL de **solo lectura** que usará el chatbot      | `sigb_chat_lectura`       | Se crea en la Fase 2                                        |
| `CHAT_PGPASSWORD`        | Contraseña de ese usuario                                           | Generada                  | Se define al crearlo                                        |
| `CHAT_LIMITE_POR_MINUTO` | Mensajes por usuario por minuto                                     | `6`                       | Lo decides tú                                               |
| `CHAT_LIMITE_POR_DIA`    | Mensajes por usuario por día                                        | `40`                      | Lo decides tú                                               |
| `CHAT_LIMITE_GLOBAL_DIA` | Mensajes de todos los usuarios por día. Tope de gasto               | `1000`                    | Lo decides tú                                               |
| `CHAT_MAX_CARACTERES`    | Largo máximo de una pregunta                                        | `500`                     | Lo decides tú                                               |

Solo si más adelante se deja la API key y se usa la credencial del propio servidor (lo que
Google recomienda para producción), harían falta `GOOGLE_CLOUD_PROJECT` y
`GOOGLE_CLOUD_LOCATION`. Con API key no se necesitan.

### Reglas para la key

- Vive solo en `.env` del backend. `.env` ya está en `.gitignore`.
- **Nunca** debe llamarse `VITE_…`: Vite mete en el navegador cualquier variable con ese prefijo.
- El SDK busca por omisión `GOOGLE_API_KEY`. Como la tuya se llama `GEMINI_API_KEY`, el código la
  pasará a mano: `apiKey: process.env.GEMINI_API_KEY`.
- No debe imprimirse en la consola ni guardarse en la bitácora.

## `.env.example` propuesto

Es el actual más un bloque nuevo al final. No lo apliqué: el archivo real se cambiaría en la
Fase 3, cuando lo apruebes.

```dotenv
# Copia este archivo como .env y llena los valores. .env nunca se sube al repositorio.

# Servidor
PUERTO=3000
NODE_ENV=development

# Origen del front (Vite) autorizado para enviar cookies a la API
ORIGEN_FRONT=http://127.0.0.1:5173

# PostgreSQL
# CUIDADO: "npm run db:reset" BORRA la base indicada en PGDATABASE y la crea de nuevo.
PGHOST=localhost
PGPORT=5432
PGDATABASE=sigb_ducky
PGUSER=postgres
PGPASSWORD=cambia_esta_contrasena

# Sesiones: clave secreta para firmar las sesiones (mínimo 32 caracteres, distinta en cada equipo).
# Genera una con: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
JWT_SECRETO=cambia_esta_clave_por_una_aleatoria_de_al_menos_32_caracteres
DURACION_SESION_HORAS=8

# Intentos de inicio de sesión permitidos por IP en la ventana indicada
LIMITE_INTENTOS_LOGIN=10
VENTANA_INTENTOS_MINUTOS=15

# ---------------------------------------------------------------------------
# Asistente Ducky (chatbot). Todo este bloque es opcional: sin él la app
# funciona y el asistente avisa que no está disponible.
# ---------------------------------------------------------------------------

# Interruptor general del asistente
CHAT_HABILITADO=true

# Key de Gemini Enterprise Agent Platform (Google Cloud), NO de Google AI Studio.
# Solo la usa el backend. Nunca la renombres con el prefijo VITE_.
GEMINI_API_KEY=pega_aqui_tu_key_de_agent_platform
GEMINI_MODELO=nombre_del_modelo_flash_vigente

# Usuario de PostgreSQL de solo lectura para las consultas del asistente
CHAT_PGUSER=sigb_chat_lectura
CHAT_PGPASSWORD=cambia_esta_contrasena_de_solo_lectura

# Límites de uso para controlar el gasto
CHAT_LIMITE_POR_MINUTO=6
CHAT_LIMITE_POR_DIA=40
CHAT_LIMITE_GLOBAL_DIA=1000
CHAT_MAX_CARACTERES=500
```

## Lo que debes hacer tú (Fase 1)

No lo hice yo porque `.env` es un archivo existente y esta sesión no modifica archivos.

1. Conserva la línea `GEMINI_API_KEY=…` que ya tienes.
2. Agrega debajo las líneas de `.env.example`, desde `PUERTO` hasta `VENTANA_INTENTOS_MINUTOS`.
3. Cambia `PGPASSWORD` por la contraseña de tu usuario `postgres`.
4. Genera `JWT_SECRETO` con el comando de arriba y pégalo.
5. Revisa que `PGDATABASE` diga `sigb_ducky`.
