# 03 · Base de datos

## Actualización: Fase 2 terminada (15 de noviembre de 2026)

Los cambios 1 a 4 de este documento ya están construidos en la rama `chatbot`. Lo que quedó
distinto de la propuesta original:

| Tema                     | Propuesta                                          | Como quedó                                                                   |
| ------------------------ | -------------------------------------------------- | ---------------------------------------------------------------------------- |
| Vistas                   | `chat.libro` y `chat.ejemplar`                     | Además `chat.tema`, `chat.tipo_uso` y `chat.regla_prestamo`                  |
| Permisos del usuario     | Lectura de las vistas y de tres tablas de `public` | Solo las vistas del esquema `chat`; ninguna tabla de `public`                |
| Dónde se crea el usuario | En un archivo SQL                                  | En `db/utilidadesMigracion.js`, porque la contraseña sale del `.env`         |
| `mensaje_chat.resultado` | `EXITO`, `ERROR`, `LIMITE`                         | Se agregó `SIN_INFORMACION`, para saber qué preguntas quedaron sin respuesta |
| Migrador                 | Solo migraciones                                   | También puede crear el esquema base en una base vacía (sin datos de prueba)  |

Archivos: `db/migraciones/003_chatbot.sql`, `db/utilidadesMigracion.js`,
`db/aplicarMigraciones.js` (`npm run db:migrar`) y `config/dbLectura.js`.

Comprobado con pruebas: el usuario de solo lectura consulta el catálogo, no puede leer
`usuario`, la bitácora, los préstamos ni el historial de chat, y no puede modificar ni crear
nada aunque desactive el modo de solo lectura de su sesión.

Un límite que conviene conocer: en PostgreSQL los usuarios pertenecen al servidor, no a una
base. `sigb_chat_lectura` puede conectarse a las otras bases de tu servidor, donde no tiene
ningún permiso propio.

Las secciones siguientes conservan el diagnóstico y la propuesta originales.

## Estado en esta computadora

| Dato                                | Resultado                                             |
| ----------------------------------- | ----------------------------------------------------- |
| PostgreSQL                          | Versión 18.6, encendido en `localhost:5432`           |
| Base `sigb_ducky`                   | **No existe todavía.** Solo hay `faltas` y `postgres` |
| Extensiones `unaccent` y `pgcrypto` | Disponibles (el proyecto las necesita)                |
| Extensión `pgvector`                | **No instalada** en el sistema                        |

La base se crea con `npm run db:reset` (Fase 1 del plan).

## Cómo se define el esquema

No hay ORM ni herramienta de migraciones. Son archivos SQL que `db/reiniciarBaseDatos.js`
ejecuta en orden:

1. `db/esquema/000_biblioteca_schema.sql`: el esquema del diagrama entidad-relación (31 tablas).
2. `db/migraciones/001_sprint1.sql`: lo que el Sprint 1 agregó (7 tablas y columnas nuevas).
3. `db/migraciones/002_sesiones.sql`: una columna para invalidar sesiones.
4. `db/semillas/001…006`: datos de prueba.

**Punto débil:** ese script primero **borra la base completa** y luego la crea. No existe una
forma de aplicar solo una migración nueva sobre una base que ya tiene datos. En desarrollo no
duele, porque los datos son de prueba; en producción sería inaceptable.

## Esquema actual

### Seguridad y usuarios

| Tabla                                                    | Qué guarda                                                                                   |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `rol`                                                    | Los 6 roles: Alumno, Maestro, Colaborador, Bibliotecario, Administrador, Comprador de libros |
| `permiso`                                                | 19 permisos (por ejemplo `CONSULTAR_LIBROS`, `ALTA_CUENTAS`)                                 |
| `rol_permiso`                                            | Máximo de permisos que admite cada rol                                                       |
| `perfil` y `perfil_permiso`                              | Perfiles (8 de prueba) y los permisos de cada uno                                            |
| `politica_prestamo`                                      | Días hábiles y renovaciones máximas (Alumnos: 5 y 2; Maestros: 10 y 3)                       |
| `programa_academico`                                     | Carreras                                                                                     |
| `usuario`                                                | Cuentas: identificador, nombre, correo, contraseña cifrada, estado, perfil                   |
| `registro_auditoria`                                     | Bitácora: quién, qué, cuándo, desde qué IP y con qué resultado                               |
| `externo.ciaa_alumno`, `externo.capital_humano_empleado` | Simulación de los sistemas escolares y de personal                                           |

### Catálogo (lo que más usará el chatbot)

| Tabla                     | Qué guarda                                                                                                                                     |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `libro`                   | La ficha: clave (`LIT-863.64-GAR`), título, ISBN, edición, año, descripción, precio, estado                                                    |
| `autor` y `autoria_ficha` | Autores y qué autor escribió qué libro                                                                                                         |
| `categoria`               | Temas: Literatura, Computación, Historia, Matemáticas, Ciencias                                                                                |
| `editorial`               | Editoriales                                                                                                                                    |
| `ejemplar`                | Cada copia física: código (`LIT-863.64-GAR-E01`), clasificación, librero, fila, estado (`DISPONIBLE`, `PRESTADO`, `DADO_DE_BAJA`), tipo de uso |
| `tipo_uso`                | Préstamo externo, Consulta interna, Reservado                                                                                                  |
| `movimiento_ejemplar`     | Historial de cada copia (altas, bajas, cambios)                                                                                                |

Un **libro** es la ficha; un **ejemplar** es una copia física de ese libro. Los datos de prueba
tienen 8 libros y 21 ejemplares.

### Compras

`presupuesto_mensual`, `solicitud_adquisicion`, `solicitud_partida`, `recepcion`,
`recepcion_partida`.

### Circulación y adeudos (tablas listas, sin API todavía)

`prestamo`, `renovacion`, `devolucion`, `reserva`, `lista_espera`, `adeudo`, `multa`,
`reposicion`, `pago`, `suspension`, `reporte_deudores`, `detalle_reporte`.

El código actual solo **lee** `prestamo`, `adeudo` y `pago`, para rechazar bajas con pendientes.
Nadie escribe en ellas todavía (Sprints 2 y 3). Hay 5 préstamos y 2 multas de prueba.

### Chat (ya existe, sin usar)

```sql
sesion_chat  (id_sesion, id_usuario → usuario, fecha_inicio, fecha_fin, canal, estatus)
mensaje_chat (id_mensaje, id_sesion → sesion_chat, emisor, contenido, "timestamp")
```

Ningún programa las usa hoy. Sirven tal cual para guardar conversaciones; les faltan algunos
datos para controlar costos.

## Cambios propuestos para el chatbot

Ninguno modifica ni borra datos existentes: son tablas, columnas, vistas y un usuario nuevos.
Las dos tablas de chat están vacías, así que agregarles columnas no afecta nada.

### Cambio 1 · Un migrador que no borre la base

Hoy no hay forma segura de aplicar una migración. Propongo un script nuevo,
`db/aplicarMigraciones.js` (`npm run db:migrar`), que:

- lleva la cuenta de las migraciones aplicadas en una tabla nueva `migracion_aplicada`;
- ejecuta solo las que falten, cada una dentro de una transacción;
- nunca borra la base.

`db:reset` seguiría funcionando igual para regresar a los datos de prueba.

### Cambio 2 · Completar las tablas de chat

Archivo nuevo `db/migraciones/003_chatbot.sql`:

```sql
-- Qué valores se permiten (hoy son texto libre)
ALTER TABLE sesion_chat
    ADD CONSTRAINT ck_sesion_chat_canal   CHECK (canal IN ('WEB')),
    ADD CONSTRAINT ck_sesion_chat_estatus CHECK (estatus IN ('ABIERTA', 'CERRADA'));

ALTER TABLE mensaje_chat
    ADD CONSTRAINT ck_mensaje_chat_emisor CHECK (emisor IN ('USUARIO', 'ASISTENTE')),
    -- Para medir el gasto y revisar de dónde salió cada respuesta
    ADD COLUMN modelo          VARCHAR(64),
    ADD COLUMN tokens_entrada  INTEGER CHECK (tokens_entrada >= 0),
    ADD COLUMN tokens_salida   INTEGER CHECK (tokens_salida >= 0),
    ADD COLUMN herramientas    JSONB,       -- qué consultas hizo el asistente para responder
    ADD COLUMN resultado       VARCHAR(16) NOT NULL DEFAULT 'EXITO'
        CHECK (resultado IN ('EXITO', 'ERROR', 'LIMITE'));

-- Para contar rápido los mensajes de un usuario en el día (límites de uso)
CREATE INDEX idx_mensaje_chat_fecha ON mensaje_chat ("timestamp");
```

Los "tokens" son la unidad en que Google cobra: trozos de palabra de lo que se envía y de lo que
se recibe. Guardarlos permite saber cuánto cuesta cada conversación.

### Cambio 3 · Vistas de solo consulta para el asistente

Dos vistas que muestran **solo** lo que el asistente puede decir en voz alta, sin datos
personales ni internos:

```sql
CREATE SCHEMA chat;

-- Una fila por libro activo, con autores, tema, editorial y conteo de copias
CREATE VIEW chat.libro AS
SELECT l.clave_libro, l.titulo, l.isbn, l.edicion, l."año" AS anio, l.descripcion,
       c.nombre AS tema, e.nombre AS editorial,
       (SELECT STRING_AGG(CONCAT_WS(' ', a.primer_nombre, a.primer_apellido), '; ' ORDER BY af.orden)
        FROM autoria_ficha af JOIN autor a ON a.autor_id = af.autor_id
        WHERE af.libro_id = l.libro_id) AS autores,
       (SELECT COUNT(*) FROM ejemplar ej
        WHERE ej.libro_id = l.libro_id AND ej.estado = 'DISPONIBLE') AS ejemplares_disponibles,
       (SELECT COUNT(*) FROM ejemplar ej
        WHERE ej.libro_id = l.libro_id AND ej.estado <> 'DADO_DE_BAJA') AS ejemplares_registrados
FROM libro l
JOIN categoria c ON c.categoria_id = l.categoria_id
JOIN editorial e ON e.id_editorial = l.editorial_id
WHERE l.estado = 'ACTIVO';

-- Una fila por copia física en circulación
CREATE VIEW chat.ejemplar AS
SELECT l.clave_libro, l.titulo, ej.codigo_ejemplar, ej.clave_clasificacion,
       ej.librero, ej.fila, ej.estado, tu.nombre AS tipo_uso, tu.permite_prestamo
FROM ejemplar ej
JOIN libro l      ON l.libro_id = ej.libro_id AND l.estado = 'ACTIVO'
JOIN tipo_uso tu  ON tu.tipo_uso_id = ej.tipo_uso_id
WHERE ej.estado <> 'DADO_DE_BAJA';
```

Quedan fuera a propósito: precio de compra, quién dio de baja un ejemplar, quién tiene prestado
un libro y todo lo de la tabla `usuario`.

### Cambio 4 · Usuario de base de datos de solo lectura

```sql
CREATE ROLE sigb_chat_lectura LOGIN PASSWORD '<se define al crearlo>';

GRANT CONNECT ON DATABASE sigb_ducky TO sigb_chat_lectura;
GRANT USAGE  ON SCHEMA chat TO sigb_chat_lectura;
GRANT SELECT ON chat.libro, chat.ejemplar TO sigb_chat_lectura;
GRANT SELECT ON public.categoria, public.tipo_uso, public.politica_prestamo TO sigb_chat_lectura;

-- Cinturón y tirantes: aunque alguien lograra colar otra orden, la base la rechaza
ALTER ROLE sigb_chat_lectura SET default_transaction_read_only = on;
ALTER ROLE sigb_chat_lectura SET statement_timeout = '3s';
```

En palabras sencillas: es una "credencial de visitante". Puede mirar el catálogo, no puede
cambiar nada y no puede ver cuentas, contraseñas ni la bitácora. Si el chatbot fallara o alguien
intentara engañarlo, lo peor que podría pasar es que lea el catálogo, que ya es consultable por
cualquier usuario con sesión.

El historial de conversaciones **no** se escribe con este usuario, sino con la conexión normal
de la API, igual que el resto del sistema.

Detalle técnico: la contraseña no puede ir escrita en un archivo SQL del repositorio. El migrador
la tomará de `CHAT_PGPASSWORD`.

### Cambio 5 (opcional, fase posterior) · pgvector

Solo si se decide agregar búsqueda "por significado" (ver documento 04):

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE chat.libro_embedding (
    libro_id        BIGINT PRIMARY KEY REFERENCES public.libro (libro_id) ON DELETE CASCADE,
    modelo          VARCHAR(64) NOT NULL,
    contenido_hash  CHAR(64)    NOT NULL,   -- para saber si el libro cambió y hay que recalcular
    embedding       vector(768) NOT NULL,
    fecha           TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Requiere instalar antes la extensión en el sistema operativo (hoy no está). El número `768`
depende del modelo de embeddings que se elija; se confirma en esa fase.

## Resumen de impacto

| Cambio                         | Toca datos existentes | Reversible                | Fase        |
| ------------------------------ | --------------------- | ------------------------- | ----------- |
| Migrador que solo agrega       | No                    | Sí (se borra el script)   | 2           |
| Columnas y reglas en chat      | No (tablas vacías)    | Sí (`ALTER TABLE … DROP`) | 2           |
| Esquema `chat` con 2 vistas    | No                    | Sí (`DROP SCHEMA chat`)   | 2           |
| Usuario de solo lectura        | No                    | Sí (`DROP ROLE`)          | 2           |
| pgvector y tabla de embeddings | No                    | Sí                        | 8, opcional |

## Local hoy, servidor después

| Tema                       | En desarrollo (tu computadora)                   | Cuando se publique                                                                      |
| -------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Dónde está la base         | `localhost`; solo la alcanza tu computadora      | Un servidor administrado. Con créditos de GCP, lo natural es Cloud SQL para PostgreSQL  |
| Quién se conecta           | El backend, que también corre en tu computadora  | El backend publicado. Un backend en la nube **no puede** alcanzar una base en tu laptop |
| Crear y actualizar la base | `npm run db:reset` (borra y recrea)              | Solo el migrador que agrega. `db:reset` ya se bloquea con `NODE_ENV=production`         |
| Datos de prueba            | Las semillas con `Ducky2026`                     | No se cargan. Se crea un Administrador real con contraseña propia                       |
| Contraseñas de la base     | Tu servidor acepta conexiones sin clave          | Contraseñas fuertes, conexión cifrada y guardadas en un gestor de secretos              |
| Respaldos                  | Ninguno                                          | Respaldos automáticos del proveedor                                                     |
| Extensiones                | `unaccent`, `pgcrypto` instaladas; `pgvector` no | Cloud SQL ofrece las tres                                                               |
| CIAA y Capital Humano      | Tablas simuladas en el esquema `externo`         | Integración real, o seguir simulados si es entrega escolar                              |

El chatbot en sí funciona igual en los dos casos: el backend consulta la base que tenga
configurada y llama a Gemini por internet. Lo único que necesita tu computadora en desarrollo
es conexión a internet para llegar a Google.
