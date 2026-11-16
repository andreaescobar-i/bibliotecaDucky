BEGIN;

CREATE UNIQUE INDEX uq_prestamo_ejemplar_activo ON prestamo (ejemplar_id) WHERE estado = 'ACTIVO';
CREATE UNIQUE INDEX uq_espera_usuario_libro ON lista_espera (libro_id, usuario_id) WHERE estatus = 'PENDIENTE';
ALTER TABLE ejemplar DROP CONSTRAINT ck_ejemplar_estado;
ALTER TABLE ejemplar ADD CONSTRAINT ck_ejemplar_estado CHECK (estado IN ('DISPONIBLE', 'PRESTADO', 'DADO_DE_BAJA', 'EN_REVISION'));
ALTER TABLE movimiento_ejemplar DROP CONSTRAINT ck_movimiento_tipo;
ALTER TABLE movimiento_ejemplar ADD CONSTRAINT ck_movimiento_tipo CHECK (
    tipo IN ('ALTA', 'BAJA', 'CAMBIO_CLASIFICACION', 'CAMBIO_UBICACION', 'CAMBIO_USO', 'ETIQUETA', 'PRESTAMO', 'DEVOLUCION')
);
ALTER TABLE adeudo ADD COLUMN acuse_tesoreria VARCHAR(100), ADD COLUMN fecha_envio_tesoreria TIMESTAMPTZ;

INSERT INTO permiso (clave, nombre, modulo, descripcion)
VALUES ('OPERAR_CIRCULACION', 'Operar circulación', 'CIRCULACION', 'Registrar préstamos, renovaciones, devoluciones y remitir multas');

INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT r.rol_id, p.permiso_id FROM rol r CROSS JOIN permiso p
WHERE r.nombre IN ('Administrador', 'Bibliotecario') AND p.clave = 'OPERAR_CIRCULACION';

INSERT INTO perfil_permiso (perfil_id, rol_id, permiso_id)
SELECT f.perfil_id, f.rol_id, p.permiso_id FROM perfil f
JOIN rol_permiso rp ON rp.rol_id = f.rol_id
JOIN permiso p ON p.permiso_id = rp.permiso_id
WHERE f.clave IN ('PRF-ADM', 'PRF-BIB') AND p.clave = 'OPERAR_CIRCULACION';

COMMIT;
