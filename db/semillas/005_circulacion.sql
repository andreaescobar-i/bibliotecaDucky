/*----
 * Programa: 005_circulacion.sql
 * Objetivo: Cargar préstamos y adeudos mínimos para probar las reglas del Sprint 1
 *           (baja de cuentas con pendientes, baja de ejemplares prestados, disponibilidad)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 *
 * La operación de préstamos, devoluciones y multas corresponde a los Sprints 2 y 3; aquí solo
 * se cargan registros ya existentes.
 */

BEGIN;

INSERT INTO prestamo
    (usuario_id, ejemplar_id, bibliotecario_usuario_id, politica_prestamo_id, folio,
     fecha_prestamo, fecha_vencimiento, estado)
SELECT u.usuario_id, ej.ejemplar_id, bib.usuario_id, pp.politica_prestamo_id, v.folio,
       v.inicio, v.vence, v.estado
FROM (VALUES
    -- Mariana: 2 préstamos activos (máximo para alumnos)
    ('PRE-2026-0001', 'A01234567', 'COM-005.1-COR-E01', 'Alumnos',
     TIMESTAMPTZ '2026-10-20 10:00:00-06', TIMESTAMPTZ '2026-10-27 20:00:00-06', 'ACTIVO'),
    ('PRE-2026-0002', 'A01234567', 'LIT-863-RUL-E01', 'Alumnos',
     TIMESTAMPTZ '2026-10-22 11:00:00-06', TIMESTAMPTZ '2026-10-29 20:00:00-06', 'ACTIVO'),
    -- Maestra: 10 días hábiles
    ('PRE-2026-0003', 'N000305', 'LIT-863-PAZ-E01', 'Maestros',
     TIMESTAMPTZ '2026-10-15 09:30:00-06', TIMESTAMPTZ '2026-10-29 20:00:00-06', 'ACTIVO'),
    -- Préstamos devueltos con retraso que generaron multa
    ('PRE-2026-0004', 'A01555888', 'COM-005.1-COR-E02', 'Alumnos',
     TIMESTAMPTZ '2026-09-01 10:00:00-06', TIMESTAMPTZ '2026-09-08 20:00:00-06', 'DEVUELTO'),
    ('PRE-2026-0005', 'A01678234', 'LIT-863.64-GAR-E04', 'Alumnos',
     TIMESTAMPTZ '2026-08-10 10:00:00-06', TIMESTAMPTZ '2026-08-17 20:00:00-06', 'DEVUELTO')
) AS v (folio, identificador, ejemplar, politica, inicio, vence, estado)
JOIN usuario u ON u.identificador = v.identificador
JOIN ejemplar ej ON ej.codigo_ejemplar = v.ejemplar
JOIN politica_prestamo pp ON pp.nombre = v.politica
CROSS JOIN (SELECT usuario_id FROM usuario WHERE identificador = 'N000104') AS bib;

UPDATE ejemplar
SET estado = 'PRESTADO'
WHERE ejemplar_id IN (SELECT ejemplar_id FROM prestamo WHERE estado = 'ACTIVO');

INSERT INTO devolucion (prestamo_id, bibliotecario_usuario_id, fecha_devolucion, condicion)
SELECT p.prestamo_id, p.bibliotecario_usuario_id, v.fecha, 'Buen estado'
FROM (VALUES
    ('PRE-2026-0004', TIMESTAMPTZ '2026-09-15 12:00:00-06'),
    ('PRE-2026-0005', TIMESTAMPTZ '2026-09-02 12:00:00-06')
) AS v (folio, fecha)
JOIN prestamo p ON p.folio = v.folio;

-- Multas pendientes ($10 por día hábil de retraso, Regla 3)
WITH nuevos AS (
    INSERT INTO adeudo (prestamo_id, tipo, concepto, fecha_emision, monto_mxn, estado)
    SELECT p.prestamo_id, 'MULTA', v.concepto, v.emision, v.dias * 10, 'PENDIENTE'
    FROM (VALUES
        ('PRE-2026-0004', '5 días de retraso',  5,  TIMESTAMPTZ '2026-09-15 12:00:00-06'),
        ('PRE-2026-0005', '12 días de retraso', 12, TIMESTAMPTZ '2026-09-02 12:00:00-06')
    ) AS v (folio, concepto, dias, emision)
    JOIN prestamo p ON p.folio = v.folio
    RETURNING adeudo_id, monto_mxn
)
INSERT INTO multa (adeudo_id, dias_habiles, tarifa_mxn)
SELECT adeudo_id, monto_mxn / 10, 10
FROM nuevos;

COMMIT;
