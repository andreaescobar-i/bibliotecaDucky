BEGIN;
CREATE TABLE recuperacion_acceso (
    huella CHAR(64) PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuario(usuario_id) ON DELETE CASCADE,
    version_sesion BIGINT NOT NULL,
    vence TIMESTAMPTZ NOT NULL,
    usada_en TIMESTAMPTZ
);
CREATE INDEX idx_recuperacion_usuario ON recuperacion_acceso(usuario_id, vence);
COMMIT;
