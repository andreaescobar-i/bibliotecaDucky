/*----
 * Programa: 001_sprint1.sql
 * Objetivo: Completar el esquema base (000_biblioteca_schema.sql) con lo que exigen las
 *           historias de usuario del Sprint 1 y las pantallas del front
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 *
 * Resumen de cambios:
 *   1. Extensiones: unaccent (búsquedas sin acentos, igual que normalizeText del front) y
 *      pgcrypto (hashes bcrypt en las semillas).
 *   2. Esquema "externo": simulación de CIAA (alumnos) y Capital Humano (personal).
 *   3. Seguridad: permisos, matriz rol-permiso y permisos por perfil (HUPRF01).
 *   4. Usuario: Tipo/Identificador institucional, teléfono y baja lógica (HUGUS01-05).
 *   5. Catálogo: Clave de libro, Librero/Fila y baja de ejemplares sin borrar (HULIB01-04).
 *   6. Compras: partidas por solicitud y por recepción, estados del front (HUCOM01).
 *   7. Bitácora: IP y resultado de cada evento (HUGUS01).
 */

BEGIN;

-- ---------------------------------------------------------------------
-- 1. Extensiones
-- ---------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------
-- 2. Sistemas institucionales simulados (CIAA y Capital Humano)
--    En producción se reemplazan por la integración real; la API solo los lee.
-- ---------------------------------------------------------------------

CREATE SCHEMA externo;

CREATE TABLE externo.ciaa_alumno (
    matricula             VARCHAR(9)   PRIMARY KEY CHECK (matricula ~ '^A[0-9]{8}$'),
    primer_nombre         VARCHAR(100) NOT NULL,
    primer_apellido       VARCHAR(100) NOT NULL,
    segundo_apellido      VARCHAR(100),
    programa_clave        VARCHAR(32),
    correo_institucional  VARCHAR(254) NOT NULL,
    vigente               BOOLEAN      NOT NULL
);

CREATE TABLE externo.capital_humano_empleado (
    nomina                VARCHAR(7)   PRIMARY KEY CHECK (nomina ~ '^N[0-9]{6}$'),
    primer_nombre         VARCHAR(100) NOT NULL,
    primer_apellido       VARCHAR(100) NOT NULL,
    segundo_apellido      VARCHAR(100),
    puesto                VARCHAR(100) NOT NULL,
    correo_institucional  VARCHAR(254) NOT NULL,
    vigente               BOOLEAN      NOT NULL
);

-- ---------------------------------------------------------------------
-- 3. Seguridad: permisos, matriz rol-permiso y permisos por perfil
-- ---------------------------------------------------------------------

CREATE TABLE permiso (
    permiso_id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clave        VARCHAR(40)  NOT NULL UNIQUE,  -- La usa el código: requierePermiso('ALTA_LIBROS')
    nombre       VARCHAR(100) NOT NULL UNIQUE,  -- El que nombran las historias: "Alta de libros"
    modulo       VARCHAR(40)  NOT NULL,
    descripcion  TEXT
);

-- Matriz HUPRF01: máximo de permisos que puede tener un perfil de cada rol
CREATE TABLE rol_permiso (
    rol_id      BIGINT NOT NULL REFERENCES rol (rol_id),
    permiso_id  BIGINT NOT NULL REFERENCES permiso (permiso_id),
    PRIMARY KEY (rol_id, permiso_id)
);

ALTER TABLE perfil
    ADD COLUMN clave                  VARCHAR(32) NOT NULL UNIQUE
        CHECK (clave = BTRIM(clave) AND clave <> ''),
    ADD COLUMN fecha_creacion         TIMESTAMPTZ NOT NULL DEFAULT now(),
    ADD COLUMN creado_por_usuario_id  BIGINT,     -- FK se agrega después de alterar usuario
    ADD COLUMN fecha_modificacion     TIMESTAMPTZ,
    ADD CONSTRAINT uq_perfil_perfil_rol UNIQUE (perfil_id, rol_id),
    ADD CONSTRAINT ck_perfil_nombre CHECK (nombre = BTRIM(nombre) AND nombre <> '');

-- "El perfil puede reducir la matriz, no ampliarla": la doble llave foránea garantiza en la BD
-- que cada permiso del perfil exista en la matriz de su rol. Si se cambia el rol del perfil, el
-- ON UPDATE CASCADE vuelve a validar todos sus permisos y rechaza el cambio completo si alguno
-- no es compatible.
CREATE TABLE perfil_permiso (
    perfil_id   BIGINT NOT NULL,
    rol_id      BIGINT NOT NULL,
    permiso_id  BIGINT NOT NULL,
    PRIMARY KEY (perfil_id, permiso_id),
    FOREIGN KEY (perfil_id, rol_id) REFERENCES perfil (perfil_id, rol_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (rol_id, permiso_id) REFERENCES rol_permiso (rol_id, permiso_id)
);

CREATE INDEX idx_perfil_permiso_permiso ON perfil_permiso (permiso_id);

-- ---------------------------------------------------------------------
-- 4. Usuario: identificador institucional, contacto y baja lógica
-- ---------------------------------------------------------------------

-- nombre_usuario y matricula del esquema base quedan opcionales: el acceso se hace con
-- tipo_identificador + identificador (Matrícula de CIAA o Nómina de Capital Humano).
ALTER TABLE usuario
    ALTER COLUMN nombre_usuario DROP NOT NULL,
    ADD COLUMN tipo_identificador       VARCHAR(10)  NOT NULL
        CHECK (tipo_identificador IN ('MATRICULA', 'NOMINA')),
    ADD COLUMN identificador            VARCHAR(32)  NOT NULL,
    ADD COLUMN segundo_apellido         VARCHAR(100),
    ADD COLUMN telefono                 VARCHAR(10)  CHECK (telefono ~ '^[0-9]{10}$'),
    ADD COLUMN debe_cambiar_contrasena  BOOLEAN      NOT NULL DEFAULT FALSE,
    ADD COLUMN alta_por_usuario_id      BIGINT       REFERENCES usuario (usuario_id),
    ADD COLUMN ultimo_acceso            TIMESTAMPTZ,
    ADD COLUMN fecha_modificacion       TIMESTAMPTZ,
    ADD COLUMN fecha_baja               TIMESTAMPTZ,
    ADD COLUMN motivo_baja              VARCHAR(300),
    ADD COLUMN baja_por_usuario_id      BIGINT       REFERENCES usuario (usuario_id),
    ADD CONSTRAINT uq_usuario_identificador UNIQUE (tipo_identificador, identificador),
    -- Los identificadores son texto y conservan ceros iniciales
    ADD CONSTRAINT ck_usuario_formato_identificador CHECK (
        (tipo_identificador = 'MATRICULA' AND identificador ~ '^A[0-9]{8}$')
        OR (tipo_identificador = 'NOMINA' AND identificador ~ '^N[0-9]{6}$')
    ),
    ADD CONSTRAINT ck_usuario_estado_cuenta CHECK (estado_cuenta IN ('ACTIVO', 'INACTIVO')),
    -- Toda cuenta inactiva conserva cuándo y por qué se dio de baja
    ADD CONSTRAINT ck_usuario_baja CHECK (
        estado_cuenta = 'ACTIVO'
        OR (fecha_baja IS NOT NULL AND BTRIM(COALESCE(motivo_baja, '')) <> '')
    );

-- El correo es único sin importar mayúsculas
CREATE UNIQUE INDEX uq_usuario_correo_minusculas ON usuario (LOWER(correo));

ALTER TABLE perfil
    ADD CONSTRAINT fk_perfil_creado_por FOREIGN KEY (creado_por_usuario_id)
        REFERENCES usuario (usuario_id);

-- ---------------------------------------------------------------------
-- 5. Catálogo: fichas (libro) y ejemplares
-- ---------------------------------------------------------------------

ALTER TABLE categoria
    ADD CONSTRAINT uq_categoria_nombre UNIQUE (nombre);

-- clave_libro es la "Clave" de la ficha que captura el front (ej. LIT-863.64-GAR)
ALTER TABLE libro
    ADD COLUMN clave_libro  VARCHAR(32)  NOT NULL UNIQUE
        CHECK (clave_libro = BTRIM(clave_libro) AND clave_libro <> ''),
    ADD COLUMN estado       VARCHAR(16)  NOT NULL DEFAULT 'ACTIVO'
        CHECK (estado IN ('ACTIVO', 'DADO_DE_BAJA')),
    ADD COLUMN fecha_alta   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    ADD COLUMN fecha_baja   TIMESTAMPTZ,
    ADD COLUMN motivo_baja  VARCHAR(300),
    ADD CONSTRAINT ck_libro_titulo CHECK (titulo = BTRIM(titulo) AND titulo <> ''),
    ADD CONSTRAINT ck_libro_isbn CHECK (isbn ~ '^([0-9]{9}[0-9X]|[0-9]{13})$');

-- estante_id del esquema base no tiene tabla; la ubicación se guarda en librero y fila.
-- Pueden faltar (HULIB04 escenario 4: "Ubicación incompleta").
ALTER TABLE ejemplar
    ALTER COLUMN clave_clasificacion SET NOT NULL,
    ADD COLUMN librero              VARCHAR(16),
    ADD COLUMN fila                 VARCHAR(16),
    ADD COLUMN fecha_baja           TIMESTAMPTZ,
    ADD COLUMN motivo_baja          VARCHAR(16)
        CHECK (motivo_baja IN ('PERDIDO', 'ROBADO', 'DANADO', 'OBSOLETO', 'OTRO')),
    ADD COLUMN detalle_baja         VARCHAR(300),
    ADD COLUMN baja_por_usuario_id  BIGINT REFERENCES usuario (usuario_id),
    ADD CONSTRAINT ck_ejemplar_codigo
        CHECK (codigo_ejemplar = BTRIM(codigo_ejemplar) AND codigo_ejemplar <> ''),
    ADD CONSTRAINT ck_ejemplar_estado CHECK (estado IN ('DISPONIBLE', 'PRESTADO', 'DADO_DE_BAJA')),
    -- Un ejemplar está dado de baja si y solo si tiene fecha y motivo de baja
    ADD CONSTRAINT ck_ejemplar_baja CHECK (
        (estado = 'DADO_DE_BAJA') = (fecha_baja IS NOT NULL AND motivo_baja IS NOT NULL)
    ),
    -- El motivo "Otro" debe describirse
    ADD CONSTRAINT ck_ejemplar_detalle_otro CHECK (
        motivo_baja IS DISTINCT FROM 'OTRO' OR BTRIM(COALESCE(detalle_baja, '')) <> ''
    );

ALTER TABLE movimiento_ejemplar
    ADD COLUMN valores_anteriores  JSONB,
    ADD COLUMN valores_nuevos      JSONB,
    ADD CONSTRAINT ck_movimiento_tipo CHECK (
        tipo IN ('ALTA', 'BAJA', 'CAMBIO_CLASIFICACION', 'CAMBIO_UBICACION', 'CAMBIO_USO', 'ETIQUETA')
    );

-- ---------------------------------------------------------------------
-- 6. Compras: solicitudes con partidas y recepciones parciales
-- ---------------------------------------------------------------------

-- Estados en el mismo orden que el front: Por autorizar -> En Tesorería -> Autorizado/Rechazado
-- -> Recibido parcialmente -> Recibido -> Entregado al catálogo
ALTER TABLE solicitud_adquisicion
    ADD COLUMN destino                 VARCHAR(32) NOT NULL DEFAULT 'TESORERIA',
    ADD COLUMN fecha_envio             TIMESTAMPTZ,
    ADD COLUMN fecha_resolucion        TIMESTAMPTZ,
    ADD COLUMN fecha_entrega_catalogo  TIMESTAMPTZ,
    ADD CONSTRAINT ck_solicitud_estado CHECK (
        estado IN ('POR_AUTORIZAR', 'EN_TESORERIA', 'AUTORIZADO', 'RECHAZADO',
                   'RECIBIDO_PARCIAL', 'RECIBIDO', 'ENTREGADO_CATALOGO')
    ),
    -- Solo con confirmación de envío una solicitud deja de estar "Por autorizar"
    ADD CONSTRAINT ck_solicitud_envio CHECK (estado = 'POR_AUTORIZAR' OR fecha_envio IS NOT NULL);

CREATE TABLE solicitud_partida (
    partida_id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    solicitud_adquisicion_id  BIGINT       NOT NULL
        REFERENCES solicitud_adquisicion (solicitud_adquisicion_id) ON DELETE CASCADE,
    numero                    SMALLINT     NOT NULL CHECK (numero > 0),
    titulo                    VARCHAR(300) NOT NULL CHECK (BTRIM(titulo) <> ''),
    autor                     VARCHAR(200) NOT NULL CHECK (BTRIM(autor) <> ''),
    editorial                 VARCHAR(200) NOT NULL CHECK (BTRIM(editorial) <> ''),
    isbn                      VARCHAR(13)  CHECK (isbn ~ '^([0-9]{9}[0-9X]|[0-9]{13})$'),
    cantidad_solicitada       INTEGER      NOT NULL CHECK (cantidad_solicitada > 0),
    -- Acumulado de recepciones; nunca supera lo solicitado
    cantidad_recibida         INTEGER      NOT NULL DEFAULT 0
        CHECK (cantidad_recibida BETWEEN 0 AND cantidad_solicitada),
    UNIQUE (solicitud_adquisicion_id, numero)
);

CREATE TABLE recepcion_partida (
    recepcion_id  BIGINT  NOT NULL REFERENCES recepcion (recepcion_id) ON DELETE CASCADE,
    partida_id    BIGINT  NOT NULL REFERENCES solicitud_partida (partida_id),
    cantidad      INTEGER NOT NULL CHECK (cantidad > 0),
    PRIMARY KEY (recepcion_id, partida_id)
);

CREATE INDEX idx_partida_solicitud           ON solicitud_partida (solicitud_adquisicion_id);
CREATE INDEX idx_recepcion_partida_partida   ON recepcion_partida (partida_id);

-- Folios consecutivos: SOL-2500, REC-0001...
CREATE SEQUENCE seq_folio_solicitud START 2500;
CREATE SEQUENCE seq_folio_recepcion START 1;

-- ---------------------------------------------------------------------
-- 7. Bitácora de seguridad y operaciones
-- ---------------------------------------------------------------------

ALTER TABLE registro_auditoria
    ADD COLUMN ip         VARCHAR(45),
    ADD COLUMN resultado  VARCHAR(16) NOT NULL DEFAULT 'EXITO'
        CHECK (resultado IN ('EXITO', 'RECHAZO', 'ERROR'));

CREATE INDEX idx_auditoria_accion ON registro_auditoria (accion, fecha_evento);

COMMIT;
