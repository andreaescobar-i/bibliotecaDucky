/*----
 * Programa: 007_identidades_plantilla.sql
 * Objetivo: Añadir personas de ejemplo a CIAA y Capital Humano sin crear cuentas de biblioteca
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 1 de Noviembre de 2026
 */

BEGIN;

-- Matrículas A02000001–A02000020: alumnos vigentes sin cuenta de biblioteca.
INSERT INTO externo.ciaa_alumno
    (matricula, primer_nombre, primer_apellido, programa_clave, correo_institucional, vigente)
SELECT 'A' || LPAD(n::TEXT, 8, '0'), 'Alumno', 'Ejemplo ' || n, 'ICO',
       'alumno' || n || '@ducky.edu.mx', TRUE
FROM generate_series(2000001, 2000020) AS n
ON CONFLICT (matricula) DO NOTHING;

-- Nóminas N001001–N001020: personal vigente sin cuenta de biblioteca.
INSERT INTO externo.capital_humano_empleado
    (nomina, primer_nombre, primer_apellido, puesto, correo_institucional, vigente)
SELECT 'N' || LPAD(n::TEXT, 6, '0'), 'Empleado', 'Ejemplo ' || n,
       'Personal universitario', 'empleado' || n || '@ducky.edu.mx', TRUE
FROM generate_series(1001, 1020) AS n
ON CONFLICT (nomina) DO NOTHING;

COMMIT;
