/*----
 * Programa: 004_catalogo.sql
 * Objetivo: Cargar temas, editoriales, tipos de uso, fichas bibliográficas y ejemplares
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 *
 * Los cinco primeros libros son los del front (src/data/demo-data.ts). Se agregan otros tres
 * para cubrir escenarios: libro sin ejemplares, ubicación incompleta y ejemplar dado de baja.
 */

BEGIN;

-- Temas y tipos de uso con los mismos nombres que las listas del front
INSERT INTO categoria (nombre) VALUES
    ('Literatura'), ('Computación'), ('Historia'), ('Matemáticas'), ('Ciencias');

INSERT INTO tipo_uso (nombre, permite_prestamo, descripcion) VALUES
    ('Préstamo externo', TRUE,  'Puede salir de la biblioteca'),
    ('Consulta interna', FALSE, 'Solo se consulta dentro de la biblioteca'),
    ('Reservado',        FALSE, 'Apartado por la biblioteca; no circula');

INSERT INTO editorial (nombre) VALUES
    ('Diana'), ('MIT Press'), ('El Colegio de México'), ('Cengage'), ('RM'), ('Pearson'),
    ('Fondo de Cultura Económica');

INSERT INTO autor (primer_nombre, primer_apellido) VALUES
    ('Gabriel', 'García Márquez'),
    ('Thomas H.', 'Cormen'),
    ('Charles E.', 'Leiserson'),
    ('Pablo', 'Escalante Gonzalbo'),
    ('James', 'Stewart'),
    ('Juan', 'Rulfo'),
    ('Ian', 'Sommerville'),
    ('Paul G.', 'Hewitt'),
    ('Octavio', 'Paz');

-- precio_compra: último precio de compra en USD (Regla 4, se usa en sprints posteriores)
INSERT INTO libro
    (editorial_id, categoria_id, clave_libro, titulo, isbn, edicion, "año", descripcion,
     precio_compra)
SELECT e.id_editorial, c.categoria_id, v.clave, v.titulo, v.isbn, v.edicion, v.anio,
       v.descripcion, v.precio
FROM (VALUES
    ('LIT-863.64-GAR', 'Cien años de soledad', 'Diana', 'Literatura', '9780307474728', '1a', 2014,
     'Novela que narra la historia de la familia Buendía en Macondo.', 18.50),
    ('COM-005.1-COR', 'Introducción a los algoritmos', 'MIT Press', 'Computación', '9780262046305', '4a', 2022,
     'Referencia sobre diseño y análisis de algoritmos.', 95.00),
    ('HIS-972-ESC', 'Historia mínima de México', 'El Colegio de México', 'Historia', NULL, '2a', 2019,
     'Síntesis de la historia de México desde la época prehispánica.', 22.00),
    ('MAT-515-STE', 'Cálculo de una variable', 'Cengage', 'Matemáticas', '9786075228143', '8a', 2018,
     'Trascendentes tempranas para cursos de cálculo diferencial e integral.', 74.90),
    ('LIT-863-RUL', 'Pedro Páramo', 'RM', 'Literatura', NULL, '1a', 2005,
     'Novela de Juan Rulfo ambientada en Comala.', 12.00),
    ('COM-005.1-SOM', 'Ingeniería de software', 'Pearson', 'Computación', '9786073206037', '9a', 2011,
     'Procesos, requerimientos, diseño y pruebas de software.', 68.00),
    ('CIE-530-HEW', 'Física conceptual', 'Pearson', 'Ciencias', '9786073238229', '12a', 2016,
     'Introducción a la física con énfasis en conceptos.', 59.00),
    ('LIT-863-PAZ', 'El laberinto de la soledad', 'Fondo de Cultura Económica', 'Literatura', NULL, '3a', 2015,
     'Ensayo sobre la identidad mexicana.', 10.50)
) AS v (clave, titulo, editorial, tema, isbn, edicion, anio, descripcion, precio)
JOIN editorial e ON e.nombre = v.editorial
JOIN categoria c ON c.nombre = v.tema;

INSERT INTO autoria_ficha (libro_id, autor_id, orden)
SELECT l.libro_id, a.autor_id, v.orden
FROM (VALUES
    ('LIT-863.64-GAR', 'García Márquez', 1),
    ('COM-005.1-COR', 'Cormen', 1),
    ('COM-005.1-COR', 'Leiserson', 2),
    ('HIS-972-ESC', 'Escalante Gonzalbo', 1),
    ('MAT-515-STE', 'Stewart', 1),
    ('LIT-863-RUL', 'Rulfo', 1),
    ('COM-005.1-SOM', 'Sommerville', 1),
    ('CIE-530-HEW', 'Hewitt', 1),
    ('LIT-863-PAZ', 'Paz', 1)
) AS v (clave, apellido, orden)
JOIN libro l ON l.clave_libro = v.clave
JOIN autor a ON a.primer_apellido = v.apellido;

-- Ejemplares: Clave de ejemplar = Clave de libro + "-E" + número de copia.
-- CIE-530-HEW no tiene ejemplares (HULIB04 escenario 3: "Sin ejemplares registrados").
INSERT INTO ejemplar
    (libro_id, tipo_uso_id, codigo_ejemplar, clave_clasificacion, librero, fila, estado,
     fecha_alta)
SELECT l.libro_id, tu.tipo_uso_id,
       v.clave || '-E' || LPAD(n::TEXT, 2, '0'),
       v.clave,
       v.librero,
       v.fila,
       'DISPONIBLE',
       TIMESTAMPTZ '2026-08-03 09:00:00-06'
FROM (VALUES
    ('LIT-863.64-GAR', 4, 'Préstamo externo', 'LIT', 'A1'),
    ('COM-005.1-COR',  3, 'Préstamo externo', 'COM', 'B2'),
    ('HIS-972-ESC',    2, 'Consulta interna', 'HIS', 'C1'),
    ('MAT-515-STE',    6, 'Reservado',        'MAT', 'D1'),
    ('LIT-863-RUL',    3, 'Préstamo externo', 'LIT', 'A2'),
    ('COM-005.1-SOM',  2, 'Préstamo externo', 'COM', 'B2'),
    ('LIT-863-PAZ',    1, 'Préstamo externo', 'LIT', 'A3')
) AS v (clave, copias, uso, librero, fila)
JOIN libro l ON l.clave_libro = v.clave
JOIN tipo_uso tu ON tu.nombre = v.uso
CROSS JOIN LATERAL generate_series(1, v.copias) AS n;

-- Ubicación incompleta (HULIB04 escenario 4 y HUUBI01): falta la fila, o librero y fila
UPDATE ejemplar SET fila = NULL WHERE codigo_ejemplar = 'MAT-515-STE-E06';
UPDATE ejemplar SET librero = NULL, fila = NULL WHERE codigo_ejemplar = 'MAT-515-STE-E05';

-- Alta registrada en el historial de cada ejemplar
INSERT INTO movimiento_ejemplar
    (ejemplar_id, operador_usuario_id, fecha_movimiento, tipo, valores_nuevos)
SELECT ej.ejemplar_id, op.usuario_id, ej.fecha_alta, 'ALTA',
       jsonb_build_object('clasificacion', ej.clave_clasificacion,
                          'librero', ej.librero, 'fila', ej.fila, 'estado', ej.estado)
FROM ejemplar ej
CROSS JOIN (SELECT usuario_id FROM usuario WHERE identificador = 'N000104') AS op;

-- Ejemplar dado de baja por daño (HULIB02 escenario 4: "El ejemplar ya está dado de baja")
UPDATE ejemplar
SET estado = 'DADO_DE_BAJA',
    fecha_baja = TIMESTAMPTZ '2026-10-01 12:30:00-06',
    motivo_baja = 'DANADO',
    detalle_baja = 'Páginas desprendidas y lomo roto',
    baja_por_usuario_id = (SELECT usuario_id FROM usuario WHERE identificador = 'N000104')
WHERE codigo_ejemplar = 'HIS-972-ESC-E02';

INSERT INTO movimiento_ejemplar
    (ejemplar_id, operador_usuario_id, fecha_movimiento, tipo, motivo, observaciones,
     valores_anteriores, valores_nuevos)
SELECT ejemplar_id, baja_por_usuario_id, fecha_baja, 'BAJA', motivo_baja, detalle_baja,
       '{"estado": "DISPONIBLE"}'::JSONB, '{"estado": "DADO_DE_BAJA"}'::JSONB
FROM ejemplar
WHERE codigo_ejemplar = 'HIS-972-ESC-E02';

COMMIT;
