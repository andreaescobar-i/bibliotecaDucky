/*----
 * Programa: 002_identidades_externas.sql
 * Objetivo: Cargar identidades simuladas de CIAA (alumnos) y Capital Humano (personal)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 *
 * Incluye identidades con cuenta, sin cuenta (para probar el alta) y no vigentes
 * (para probar los rechazos de HUGUS01 y HUGUS02).
 */

BEGIN;

INSERT INTO programa_academico (clave, nombre) VALUES
    ('IIN', 'Ing. Industrial'),
    ('ARQ', 'Arquitectura'),
    ('LEC', 'Lic. Economía'),
    ('ICO', 'Ing. Computación');

INSERT INTO externo.ciaa_alumno
    (matricula, primer_nombre, primer_apellido, segundo_apellido, programa_clave,
     correo_institucional, vigente)
VALUES
    ('A01234567', 'Mariana',  'López',  NULL,    'ICO', 'mariana.lopez@ducky.edu.mx',  TRUE),
    ('A01678234', 'Ana',      'Torres', 'Ruiz',  'ARQ', 'ana.torres@ducky.edu.mx',     TRUE),
    ('A01555888', 'Rodrigo',  'Díaz',   'Mora',  'IIN', 'rodrigo.diaz@ducky.edu.mx',   TRUE),
    ('A01999000', 'Carlos',   'Pérez',  'Soto',  'LEC', 'carlos.perez@ducky.edu.mx',   TRUE),
    ('A01333444', 'Diego',    'Castro', NULL,    'LEC', 'diego.castro@ducky.edu.mx',   TRUE),
    -- Sin cuenta en la biblioteca: disponible para probar el alta
    ('A01777111', 'Valeria',  'Gómez',  'Ríos',  'ICO', 'valeria.gomez@ducky.edu.mx',  TRUE),
    -- No vigente en CIAA: el alta y el acceso se rechazan
    ('A01000999', 'Jorge',    'Ruiz',   'León',  'IIN', 'jorge.ruiz@ducky.edu.mx',     FALSE),
    -- Tiene cuenta activa pero ya no es alumno vigente (HUGUS01 escenario 3)
    ('A01444222', 'Lucía',    'Herrera', NULL,   'ARQ', 'lucia.herrera@ducky.edu.mx',  FALSE);

INSERT INTO externo.capital_humano_empleado
    (nomina, primer_nombre, primer_apellido, segundo_apellido, puesto,
     correo_institucional, vigente)
VALUES
    ('N000001', 'Patricia', 'Morales',   'Vega',  'Administradora de biblioteca', 'patricia.morales@ducky.edu.mx', TRUE),
    ('N000104', 'Ernesto',  'Díaz',      NULL,    'Bibliotecario',                'ernesto.diaz@ducky.edu.mx',     TRUE),
    ('N000105', 'Gabriela', 'Núñez',     'Paz',   'Bibliotecaria',                'gabriela.nunez@ducky.edu.mx',   TRUE),
    ('N000210', 'Ricardo',  'Vega',      'Lara',  'Comprador de libros',          'ricardo.vega@ducky.edu.mx',     TRUE),
    ('N000305', 'Sofía',    'Hernández', 'Cruz',  'Profesora',                    'sofia.hernandez@ducky.edu.mx',  TRUE),
    ('N000402', 'Luis',     'Ramírez',   'Ortiz', 'Asistente administrativo',     'luis.ramirez@ducky.edu.mx',     TRUE),
    -- Sin cuenta en la biblioteca: disponible para probar el alta
    ('N000500', 'Daniel',   'Flores',    'Mejía', 'Profesor',                     'daniel.flores@ducky.edu.mx',    TRUE),
    -- Ya no labora en la universidad
    ('N000999', 'Héctor',   'Salinas',   NULL,    'Profesor',                     'hector.salinas@ducky.edu.mx',   FALSE);

COMMIT;
