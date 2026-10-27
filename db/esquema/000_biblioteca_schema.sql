-- =====================================================================
--  Library system schema — generated from diagrama-ER-cardinalidades
--  Target: PostgreSQL 13+
--
--  Interpretation notes (where the diagram was ambiguous or had typos):
--   * Perfil."UniqueID" -> perfil_id; Perfil.politica_prestamo -> politica_prestamo_id
--   * Table "editoral" -> editorial (libro.editorial_id references it)
--   * ejemplar.codigo_ejempar -> codigo_ejemplar
--   * movimiento_ejemplar.fecha_movimento -> fecha_movimiento
--   * suspension.suspencion_id -> suspension_id
--   * recepcion.recibo_ususario_id -> recibio_usuario_id
--   * solicitud_adquisicion: the second FK row was labelled
--     "solicitud_adquisicion_id"; the diagram links it to presupuesto_mensual
--     (0..1 : 0..N), so it is modelled as presupuesto_mensual_id.
--   * solicitud_adquisicion.estado / fecha_solicitud were drawn outside the
--     table box and had no type; included as VARCHAR(32) / TIMESTAMPTZ.
--   * mensaje_chat.id_sesion was VARCHAR(300); changed to BIGINT so it can
--     reference sesion_chat.id_sesion.
--   * "TIMESTAMPZ" and plain TIMESTAMP columns normalized to TIMESTAMPTZ.
--   * detalle_reporte listed prestamos_vencidos_snapshots twice; kept once.
--   * ejemplar.estante_id has no "estante" table in the diagram, so it is
--     left as a plain BIGINT without a foreign key.
--   * reserva.usuario_id / libro_id were not marked FK but the diagram draws
--     the relationships, so FKs are included.
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- Security / users
-- ---------------------------------------------------------------------

CREATE TABLE rol (
    rol_id       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre       VARCHAR(64)  NOT NULL UNIQUE,
    descripcion  TEXT,
    activo       BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE politica_prestamo (
    politica_prestamo_id  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre                VARCHAR(100) NOT NULL,
    version               SMALLINT     NOT NULL DEFAULT 1,
    dias_habiles          SMALLINT     NOT NULL CHECK (dias_habiles > 0),
    max_renovaciones      SMALLINT     NOT NULL DEFAULT 0 CHECK (max_renovaciones >= 0),
    vigente_desde         DATE         NOT NULL,
    activo                BOOLEAN      NOT NULL DEFAULT TRUE
);

-- Perfil 0..N : 1 Rol ; Perfil 0..N : 0..1 politica_prestamo
CREATE TABLE perfil (
    perfil_id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rol_id                BIGINT       NOT NULL REFERENCES rol (rol_id),
    politica_prestamo_id  BIGINT       REFERENCES politica_prestamo (politica_prestamo_id),
    nombre                VARCHAR(100) NOT NULL UNIQUE,
    descripcion           TEXT,
    activo                BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE programa_academico (
    programa_id  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clave        VARCHAR(32)  NOT NULL UNIQUE,
    nombre       VARCHAR(200) NOT NULL,
    activo       BOOLEAN      NOT NULL DEFAULT TRUE
);

-- Usuario 0..N : 1 Perfil ; Usuario 0..N : 0..1 programa_academico
CREATE TABLE usuario (
    usuario_id       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    perfil_id        BIGINT       NOT NULL REFERENCES perfil (perfil_id),
    programa_id      BIGINT       REFERENCES programa_academico (programa_id),
    matricula        VARCHAR(32)  UNIQUE,
    primer_nombre    VARCHAR(100) NOT NULL,
    primer_apellido  VARCHAR(100) NOT NULL,
    nombre_usuario   VARCHAR(64)  NOT NULL UNIQUE,
    correo           VARCHAR(254) NOT NULL UNIQUE,
    "contraseña_hash" VARCHAR(255) NOT NULL,
    estado_cuenta    VARCHAR(32)  NOT NULL,
    estatus_escolar  VARCHAR(64),
    fecha_alta       TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Catalog
-- ---------------------------------------------------------------------

CREATE TABLE categoria (
    categoria_id  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre        VARCHAR(150) NOT NULL,
    descripcion   TEXT
);

CREATE TABLE editorial (
    id_editorial  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre        VARCHAR(200) NOT NULL UNIQUE,
    activo        BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE autor (
    autor_id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    primer_nombre    VARCHAR(100) NOT NULL,
    primer_apellido  VARCHAR(100)
);

-- libro 0..N : 1 categoria ; libro 0..N : 1 editorial
CREATE TABLE libro (
    libro_id       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    editorial_id   BIGINT        NOT NULL REFERENCES editorial (id_editorial),
    categoria_id   BIGINT        NOT NULL REFERENCES categoria (categoria_id),
    titulo         VARCHAR(300)  NOT NULL,
    isbn           VARCHAR(13)   UNIQUE,
    edicion        VARCHAR(64),
    "año"          SMALLINT,
    descripcion    TEXT,
    precio_compra  NUMERIC(14,2) CHECK (precio_compra >= 0)
);

-- autor 1 : 0..N autoria_ficha 0..N : 1 libro  (M:N)
CREATE TABLE autoria_ficha (
    libro_id  BIGINT   NOT NULL REFERENCES libro (libro_id) ON DELETE CASCADE,
    autor_id  BIGINT   NOT NULL REFERENCES autor (autor_id),
    orden     SMALLINT NOT NULL DEFAULT 1,
    PRIMARY KEY (libro_id, autor_id)
);

CREATE TABLE tipo_uso (
    tipo_uso_id       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre            VARCHAR(64) NOT NULL UNIQUE,
    permite_prestamo  BOOLEAN     NOT NULL DEFAULT TRUE,
    descripcion       TEXT
);

-- ---------------------------------------------------------------------
-- Acquisitions
-- ---------------------------------------------------------------------

CREATE TABLE presupuesto_mensual (
    presupuesto_mensual_id  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    anio                    SMALLINT      NOT NULL,
    mes                     SMALLINT      NOT NULL CHECK (mes BETWEEN 1 AND 12),
    monto_autorizado_mxn    NUMERIC(14,2) NOT NULL CHECK (monto_autorizado_mxn >= 0),
    UNIQUE (anio, mes)
);

-- presupuesto_mensual 0..1 : 0..N solicitud ; usuario : 0..N solicitud
CREATE TABLE solicitud_adquisicion (
    solicitud_adquisicion_id  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    presupuesto_mensual_id    BIGINT        REFERENCES presupuesto_mensual (presupuesto_mensual_id),
    solicitante_usuario_id    BIGINT        NOT NULL REFERENCES usuario (usuario_id),
    autorizado_usuario_id     BIGINT        REFERENCES usuario (usuario_id),
    folio                     VARCHAR(64)   NOT NULL UNIQUE,
    titulo_solicitado         VARCHAR(300)  NOT NULL,
    autor_solicitado          VARCHAR(200),
    area_solicitante          VARCHAR(150),
    cantidad                  INTEGER       NOT NULL CHECK (cantidad > 0),
    costo_total_estimado_mxn  NUMERIC(14,2) CHECK (costo_total_estimado_mxn >= 0),
    prioridad                 VARCHAR(32),
    justificacion             TEXT,
    estado                    VARCHAR(32)   NOT NULL,
    fecha_solicitud           TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- solicitud 1 : 0..N recepcion ; usuario 1 : 0..N recepcion
CREATE TABLE recepcion (
    recepcion_id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    solicitud_adquisicion_id  BIGINT      NOT NULL REFERENCES solicitud_adquisicion (solicitud_adquisicion_id),
    recibio_usuario_id        BIGINT      NOT NULL REFERENCES usuario (usuario_id),
    folio                     VARCHAR(64) NOT NULL UNIQUE,
    cantidad                  INTEGER     NOT NULL CHECK (cantidad > 0),
    fecha_recepcion           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Copies (ejemplares)
-- ---------------------------------------------------------------------

-- libro 1 : 0..N ejemplar ; tipo_uso 1 : 0..N ejemplar
CREATE TABLE ejemplar (
    ejemplar_id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    libro_id             BIGINT      NOT NULL REFERENCES libro (libro_id),
    estante_id           BIGINT,     -- no "estante" table in the diagram
    tipo_uso_id          BIGINT      NOT NULL REFERENCES tipo_uso (tipo_uso_id),
    recepcion_id         BIGINT      REFERENCES recepcion (recepcion_id),
    codigo_ejemplar      VARCHAR(64) NOT NULL UNIQUE,
    clave_clasificacion  VARCHAR(64),
    estado               VARCHAR(32) NOT NULL,
    fecha_alta           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ejemplar 1 : 0..N movimiento ; usuario 1 : 0..N movimiento
CREATE TABLE movimiento_ejemplar (
    movimiento_ejemplar_id  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ejemplar_id             BIGINT       NOT NULL REFERENCES ejemplar (ejemplar_id),
    operador_usuario_id     BIGINT       NOT NULL REFERENCES usuario (usuario_id),
    fecha_movimiento        TIMESTAMPTZ  NOT NULL DEFAULT now(),
    tipo                    VARCHAR(32)  NOT NULL,
    motivo                  VARCHAR(200),
    observaciones           TEXT
);

-- ---------------------------------------------------------------------
-- Circulation
-- ---------------------------------------------------------------------

-- usuario 1 : 0..N prestamo ; ejemplar 1 : 0..N prestamo ; politica 1 : prestamo
CREATE TABLE prestamo (
    prestamo_id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id                BIGINT      NOT NULL REFERENCES usuario (usuario_id),
    ejemplar_id               BIGINT      NOT NULL REFERENCES ejemplar (ejemplar_id),
    bibliotecario_usuario_id  BIGINT      NOT NULL REFERENCES usuario (usuario_id),
    politica_prestamo_id      BIGINT      NOT NULL REFERENCES politica_prestamo (politica_prestamo_id),
    folio                     VARCHAR(64) NOT NULL UNIQUE,
    fecha_prestamo            TIMESTAMPTZ NOT NULL DEFAULT now(),
    fecha_vencimiento         TIMESTAMPTZ NOT NULL,
    estado                    VARCHAR(32) NOT NULL,
    CHECK (fecha_vencimiento > fecha_prestamo)
);

-- prestamo 1 : 0..N renovacion ; usuario 1 : 0..N renovacion
CREATE TABLE renovacion (
    renovacion_id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    prestamo_id             BIGINT      NOT NULL REFERENCES prestamo (prestamo_id),
    autorizador_usuario_id  BIGINT      NOT NULL REFERENCES usuario (usuario_id),
    numero_renovacion       SMALLINT    NOT NULL CHECK (numero_renovacion > 0),
    fecha_renovacion        TIMESTAMPTZ NOT NULL DEFAULT now(),
    vencimiento_anterior    TIMESTAMPTZ NOT NULL,
    vencimiento_nuevo       TIMESTAMPTZ NOT NULL,
    UNIQUE (prestamo_id, numero_renovacion),
    CHECK (vencimiento_nuevo > vencimiento_anterior)
);

-- prestamo 1 : 0..1 devolucion ; usuario 1 : 0..N devolucion
CREATE TABLE devolucion (
    devolucion_id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    prestamo_id               BIGINT      NOT NULL UNIQUE REFERENCES prestamo (prestamo_id),
    bibliotecario_usuario_id  BIGINT      NOT NULL REFERENCES usuario (usuario_id),
    fecha_devolucion          TIMESTAMPTZ NOT NULL DEFAULT now(),
    condicion                 VARCHAR(64),
    observaciones             TEXT
);

-- usuario 1 : 0..N reserva ; libro 1 : 0..N reserva
CREATE TABLE reserva (
    reserva_id     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id     BIGINT      NOT NULL REFERENCES usuario (usuario_id),
    libro_id       BIGINT      NOT NULL REFERENCES libro (libro_id),
    fecha_reserva  TIMESTAMPTZ NOT NULL DEFAULT now(),
    estado         VARCHAR(32) NOT NULL
);

CREATE TABLE lista_espera (
    espera_id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id            BIGINT       NOT NULL REFERENCES usuario (usuario_id),
    libro_id              BIGINT       NOT NULL REFERENCES libro (libro_id),
    posicion_cola         BIGINT       NOT NULL CHECK (posicion_cola > 0),
    fecha_solicitud       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    fecha_notificacion    TIMESTAMPTZ,
    fecha_limite_reclamo  TIMESTAMPTZ,
    estatus               VARCHAR(100) NOT NULL
);

-- ---------------------------------------------------------------------
-- Debts, fines, payments, suspensions
-- ---------------------------------------------------------------------

-- prestamo 1 : 0..N adeudo
CREATE TABLE adeudo (
    adeudo_id      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    prestamo_id    BIGINT        NOT NULL REFERENCES prestamo (prestamo_id),
    tipo           VARCHAR(16)   NOT NULL,   -- e.g. 'MULTA' / 'REPOSICION'
    concepto       VARCHAR(200),
    fecha_emision  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    monto_mxn      NUMERIC(14,2) NOT NULL CHECK (monto_mxn >= 0),
    estado         VARCHAR(32)   NOT NULL
);

-- adeudo 1 : 0..1 multa  (subtype, shared PK)
CREATE TABLE multa (
    adeudo_id     BIGINT        PRIMARY KEY REFERENCES adeudo (adeudo_id) ON DELETE CASCADE,
    dias_habiles  SMALLINT      NOT NULL CHECK (dias_habiles >= 0),
    tarifa_mxn    NUMERIC(14,2) NOT NULL CHECK (tarifa_mxn >= 0)
);

-- adeudo 1 : 0..1 reposicion  (subtype, shared PK)
CREATE TABLE reposicion (
    adeudo_id                 BIGINT        PRIMARY KEY REFERENCES adeudo (adeudo_id) ON DELETE CASCADE,
    fecha_reporte             TIMESTAMPTZ   NOT NULL DEFAULT now(),
    precio_ultima_compra_usd  NUMERIC(14,2) NOT NULL CHECK (precio_ultima_compra_usd >= 0),
    tipo_cambio_mxn_usd       NUMERIC(14,6) NOT NULL CHECK (tipo_cambio_mxn_usd > 0),
    fecha_tipo_cambio         DATE          NOT NULL,
    fuente_tipo_cambio        VARCHAR(200)
);

-- adeudo 1 : 0..1 pago ; usuario 1 : 0..N pago
CREATE TABLE pago (
    pago_id                 BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    adeudo_id               BIGINT        NOT NULL UNIQUE REFERENCES adeudo (adeudo_id),
    folio_tesoreria         VARCHAR(64)   NOT NULL UNIQUE,
    monto_mxn               NUMERIC(14,2) NOT NULL CHECK (monto_mxn > 0),
    fecha_pago              TIMESTAMPTZ   NOT NULL,
    fecha_registro          TIMESTAMPTZ   NOT NULL DEFAULT now(),
    registrador_usuario_id  BIGINT        NOT NULL REFERENCES usuario (usuario_id)
);

-- usuario 1 : 0..N suspension
CREATE TABLE suspension (
    suspension_id  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id     BIGINT       NOT NULL REFERENCES usuario (usuario_id),
    area           VARCHAR(100),
    motivo         VARCHAR(200) NOT NULL,
    fecha_inicio   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    fecha_fin      TIMESTAMPTZ,
    CHECK (fecha_fin IS NULL OR fecha_fin > fecha_inicio)
);

-- ---------------------------------------------------------------------
-- Reports & audit
-- ---------------------------------------------------------------------

CREATE TABLE reporte_deudores (
    reporte_deudores_id  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fecha_corte          TIMESTAMPTZ NOT NULL,
    periodo              VARCHAR(64) NOT NULL,
    fecha_notificacion   TIMESTAMPTZ
);

-- reporte_deudores 1 : 0..N detalle ; usuario 1 : 0..N detalle
CREATE TABLE detalle_reporte (
    reporte_deudores_id           BIGINT        NOT NULL REFERENCES reporte_deudores (reporte_deudores_id) ON DELETE CASCADE,
    usuario_id                    BIGINT        NOT NULL REFERENCES usuario (usuario_id),
    multas_mxn_snapshot           NUMERIC(14,2) NOT NULL DEFAULT 0,
    prestamos_vencidos_snapshots  INTEGER       NOT NULL DEFAULT 0,
    estado_notificacion           VARCHAR(32)   NOT NULL,
    PRIMARY KEY (reporte_deudores_id, usuario_id)
);

-- usuario 0..1 : 0..N registro_auditoria (actor may be the system)
CREATE TABLE registro_auditoria (
    registro_auditoria_id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    actor_usuario_id         BIGINT       REFERENCES usuario (usuario_id),
    fecha_evento             TIMESTAMPTZ  NOT NULL DEFAULT now(),
    accion                   VARCHAR(100) NOT NULL,
    entidad_objetivo         VARCHAR(100) NOT NULL,
    clave_registro_objetivo  TEXT,
    detalle                  JSONB
);

-- ---------------------------------------------------------------------
-- Chat
-- ---------------------------------------------------------------------

-- usuario 1 : 0..N sesion_chat
CREATE TABLE sesion_chat (
    id_sesion     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario    BIGINT      NOT NULL REFERENCES usuario (usuario_id),
    fecha_inicio  TIMESTAMPTZ NOT NULL DEFAULT now(),
    fecha_fin     TIMESTAMPTZ,
    canal         VARCHAR(20) NOT NULL,
    estatus       VARCHAR(30) NOT NULL
);

-- sesion_chat 1 : 1..N mensaje_chat
-- (the "at least one message" side can't be enforced with a plain FK)
CREATE TABLE mensaje_chat (
    id_mensaje   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_sesion    BIGINT      NOT NULL REFERENCES sesion_chat (id_sesion) ON DELETE CASCADE,
    emisor       VARCHAR(20) NOT NULL,
    contenido    TEXT        NOT NULL,
    "timestamp"  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Indexes on foreign-key columns (PostgreSQL does not create these)
-- ---------------------------------------------------------------------

CREATE INDEX idx_perfil_rol                  ON perfil (rol_id);
CREATE INDEX idx_perfil_politica             ON perfil (politica_prestamo_id);
CREATE INDEX idx_usuario_perfil              ON usuario (perfil_id);
CREATE INDEX idx_usuario_programa            ON usuario (programa_id);
CREATE INDEX idx_libro_editorial             ON libro (editorial_id);
CREATE INDEX idx_libro_categoria             ON libro (categoria_id);
CREATE INDEX idx_autoria_autor               ON autoria_ficha (autor_id);
CREATE INDEX idx_solicitud_presupuesto       ON solicitud_adquisicion (presupuesto_mensual_id);
CREATE INDEX idx_solicitud_solicitante       ON solicitud_adquisicion (solicitante_usuario_id);
CREATE INDEX idx_solicitud_autorizado        ON solicitud_adquisicion (autorizado_usuario_id);
CREATE INDEX idx_recepcion_solicitud         ON recepcion (solicitud_adquisicion_id);
CREATE INDEX idx_recepcion_usuario           ON recepcion (recibio_usuario_id);
CREATE INDEX idx_ejemplar_libro              ON ejemplar (libro_id);
CREATE INDEX idx_ejemplar_tipo_uso           ON ejemplar (tipo_uso_id);
CREATE INDEX idx_ejemplar_recepcion          ON ejemplar (recepcion_id);
CREATE INDEX idx_movimiento_ejemplar         ON movimiento_ejemplar (ejemplar_id);
CREATE INDEX idx_movimiento_operador         ON movimiento_ejemplar (operador_usuario_id);
CREATE INDEX idx_prestamo_usuario            ON prestamo (usuario_id);
CREATE INDEX idx_prestamo_ejemplar           ON prestamo (ejemplar_id);
CREATE INDEX idx_prestamo_bibliotecario      ON prestamo (bibliotecario_usuario_id);
CREATE INDEX idx_prestamo_politica           ON prestamo (politica_prestamo_id);
CREATE INDEX idx_renovacion_autorizador      ON renovacion (autorizador_usuario_id);
CREATE INDEX idx_devolucion_bibliotecario    ON devolucion (bibliotecario_usuario_id);
CREATE INDEX idx_reserva_usuario             ON reserva (usuario_id);
CREATE INDEX idx_reserva_libro               ON reserva (libro_id);
CREATE INDEX idx_lista_espera_usuario        ON lista_espera (usuario_id);
CREATE INDEX idx_lista_espera_libro          ON lista_espera (libro_id, posicion_cola);
CREATE INDEX idx_adeudo_prestamo             ON adeudo (prestamo_id);
CREATE INDEX idx_pago_registrador            ON pago (registrador_usuario_id);
CREATE INDEX idx_suspension_usuario          ON suspension (usuario_id);
CREATE INDEX idx_detalle_reporte_usuario     ON detalle_reporte (usuario_id);
CREATE INDEX idx_auditoria_actor             ON registro_auditoria (actor_usuario_id);
CREATE INDEX idx_auditoria_entidad           ON registro_auditoria (entidad_objetivo, fecha_evento);
CREATE INDEX idx_sesion_chat_usuario         ON sesion_chat (id_usuario);
CREATE INDEX idx_mensaje_chat_sesion         ON mensaje_chat (id_sesion);

COMMIT;
