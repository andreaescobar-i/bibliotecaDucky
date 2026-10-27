/*----
 * Programa: 006_compras.sql
 * Objetivo: Cargar presupuestos y solicitudes de compra en los distintos estados del front
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 *
 * SOL-2418, SOL-2391 y SOL-2345 son las del front (src/data/demo-data.ts). SOL-2402 queda con
 * recepción parcial (HUCOM01 escenario 7). No hay presupuesto de diciembre para probar
 * "Presupuesto no informado".
 */

BEGIN;

INSERT INTO presupuesto_mensual (anio, mes, monto_autorizado_mxn) VALUES
    (2026, 9,  40000.00),
    (2026, 10, 50000.00),
    (2026, 11, 45000.00);

INSERT INTO solicitud_adquisicion
    (presupuesto_mensual_id, solicitante_usuario_id, folio, titulo_solicitado, autor_solicitado,
     area_solicitante, cantidad, costo_total_estimado_mxn, prioridad, justificacion, estado,
     fecha_solicitud, fecha_envio, fecha_resolucion)
SELECT pm.presupuesto_mensual_id, com.usuario_id, v.folio, v.titulo, v.autor, v.area,
       v.cantidad, v.costo, v.prioridad, v.justificacion, v.estado, v.fecha, v.envio,
       v.resolucion
FROM (VALUES
    ('SOL-2418', 'Diseño de sistemas interactivos', 'Alan Cooper', 'Facultad de Diseño', 1,
     2340.00, 'Media', 'Bibliografía básica de la materia de Interacción.', 'POR_AUTORIZAR',
     TIMESTAMPTZ '2026-10-20 09:00:00-06', NULL::TIMESTAMPTZ, NULL::TIMESTAMPTZ),
    ('SOL-2391', 'Artificial Intelligence: A Modern Approach', 'Stuart Russell', 'Ing. Computación', 1,
     1820.00, 'Alta', 'Texto obligatorio de Inteligencia Artificial.', 'AUTORIZADO',
     TIMESTAMPTZ '2026-10-08 09:00:00-06', TIMESTAMPTZ '2026-10-10 10:00:00-06',
     TIMESTAMPTZ '2026-10-14 13:00:00-06'),
    ('SOL-2345', 'El infinito en un junco', 'Irene Vallejo', 'Humanidades', 1,
     540.00, 'Baja', 'Lectura complementaria del seminario de Humanidades.', 'RECIBIDO',
     TIMESTAMPTZ '2026-09-18 09:00:00-06', TIMESTAMPTZ '2026-09-20 10:00:00-06',
     TIMESTAMPTZ '2026-09-24 13:00:00-06'),
    ('SOL-2402', 'Bibliografía de Ingeniería Industrial', NULL, 'Ing. Industrial', 5,
     4100.00, 'Alta', 'Reposición de ejemplares para el semestre.', 'RECIBIDO_PARCIAL',
     TIMESTAMPTZ '2026-10-12 09:00:00-06', TIMESTAMPTZ '2026-10-13 10:00:00-06',
     TIMESTAMPTZ '2026-10-15 13:00:00-06')
) AS v (folio, titulo, autor, area, cantidad, costo, prioridad, justificacion, estado, fecha,
        envio, resolucion)
JOIN presupuesto_mensual pm
    ON pm.anio = EXTRACT(YEAR FROM v.fecha) AND pm.mes = EXTRACT(MONTH FROM v.fecha)
CROSS JOIN (SELECT usuario_id FROM usuario WHERE identificador = 'N000210') AS com;

INSERT INTO solicitud_partida
    (solicitud_adquisicion_id, numero, titulo, autor, editorial, isbn, cantidad_solicitada,
     cantidad_recibida)
SELECT s.solicitud_adquisicion_id, v.numero, v.titulo, v.autor, v.editorial, v.isbn,
       v.solicitada, v.recibida
FROM (VALUES
    ('SOL-2418', 1, 'Diseño de sistemas interactivos', 'Alan Cooper', 'Anaya', NULL, 1, 0),
    ('SOL-2391', 1, 'Artificial Intelligence: A Modern Approach', 'Stuart Russell', 'Pearson',
     '9780134610993', 1, 0),
    ('SOL-2345', 1, 'El infinito en un junco', 'Irene Vallejo', 'Siruela', '9788417860790', 1, 1),
    ('SOL-2402', 1, 'Investigación de operaciones', 'Hamdy A. Taha', 'Pearson', NULL, 3, 1),
    ('SOL-2402', 2, 'Ingeniería industrial de Niebel', 'Andris Freivalds', 'McGraw-Hill', NULL, 2, 0)
) AS v (folio, numero, titulo, autor, editorial, isbn, solicitada, recibida)
JOIN solicitud_adquisicion s ON s.folio = v.folio;

INSERT INTO recepcion (solicitud_adquisicion_id, recibio_usuario_id, folio, cantidad, fecha_recepcion)
SELECT s.solicitud_adquisicion_id, s.solicitante_usuario_id, v.folio, v.cantidad, v.fecha
FROM (VALUES
    ('SOL-2345', 'REC-0001', 1, TIMESTAMPTZ '2026-10-05 11:00:00-06'),
    ('SOL-2402', 'REC-0002', 1, TIMESTAMPTZ '2026-10-21 11:00:00-06')
) AS v (solicitud, folio, cantidad, fecha)
JOIN solicitud_adquisicion s ON s.folio = v.solicitud;

INSERT INTO recepcion_partida (recepcion_id, partida_id, cantidad)
SELECT r.recepcion_id, sp.partida_id, 1
FROM recepcion r
JOIN solicitud_partida sp
    ON sp.solicitud_adquisicion_id = r.solicitud_adquisicion_id AND sp.numero = 1;

-- Los próximos folios continúan después de los cargados
SELECT setval('seq_folio_recepcion', 2);

COMMIT;
