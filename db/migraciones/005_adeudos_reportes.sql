BEGIN;

INSERT INTO permiso (clave,nombre,modulo,descripcion)
VALUES ('CONSULTAR_REPORTES','Consultar reportes','REPORTES','Consultar y exportar reportes de inventario y circulación');
INSERT INTO rol_permiso (rol_id,permiso_id)
SELECT r.rol_id,p.permiso_id FROM rol r CROSS JOIN permiso p
WHERE r.nombre='Administrador' AND p.clave='CONSULTAR_REPORTES';
INSERT INTO perfil_permiso (perfil_id,rol_id,permiso_id)
SELECT f.perfil_id,f.rol_id,p.permiso_id FROM perfil f
JOIN rol_permiso rp ON rp.rol_id=f.rol_id JOIN permiso p ON p.permiso_id=rp.permiso_id
WHERE f.clave='PRF-ADM' AND p.clave='CONSULTAR_REPORTES';

UPDATE perfil f SET politica_prestamo_id=(
    SELECT p.politica_prestamo_id FROM politica_prestamo p
    WHERE p.nombre=CASE WHEN r.nombre='Maestro' THEN 'Maestros' ELSE 'Alumnos' END
      AND p.activo AND p.vigente_desde<=CURRENT_DATE ORDER BY p.vigente_desde DESC,p.version DESC LIMIT 1
)
FROM rol r WHERE r.rol_id=f.rol_id AND f.politica_prestamo_id IS NULL
  AND r.nombre IN ('Alumno','Maestro','Colaborador');

CREATE UNIQUE INDEX uq_reposicion_prestamo ON adeudo(prestamo_id) WHERE tipo='REPOSICION';
ALTER TABLE adeudo ADD COLUMN modo_envio_tesoreria VARCHAR(16);
UPDATE adeudo SET modo_envio_tesoreria='SIMULADO' WHERE acuse_tesoreria IS NOT NULL;
ALTER TABLE reporte_deudores ADD COLUMN operador_usuario_id BIGINT REFERENCES usuario,
    ADD COLUMN acuse_escolares VARCHAR(100), ADD COLUMN modo_envio VARCHAR(16);
ALTER TABLE detalle_reporte ADD COLUMN nombre_snapshot TEXT,
    ADD COLUMN identificador_snapshot VARCHAR(32), ADD COLUMN programa_snapshot TEXT,
    ADD COLUMN reposicion_mxn_snapshot NUMERIC(14,2) NOT NULL DEFAULT 0,
    ADD COLUMN suspendido_snapshot BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE reposicion ADD COLUMN acuse_escolares VARCHAR(100), ADD COLUMN modo_envio_escolares VARCHAR(16),
    ADD COLUMN fecha_envio_escolares TIMESTAMPTZ;
ALTER TABLE suspension ADD COLUMN creada_por BIGINT REFERENCES usuario,
    ADD COLUMN levantada_por BIGINT REFERENCES usuario;

COMMIT;
