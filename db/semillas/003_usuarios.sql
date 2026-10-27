/*----
 * Programa: 003_usuarios.sql
 * Objetivo: Cargar cuentas de prueba, una o más por cada rol del front y por cada escenario
 *           de las historias de usuario
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 *
 * Contraseña de todas las cuentas de prueba: Ducky2026
 * El hash se genera con bcrypt (pgcrypto, $2a$, costo 10), compatible con la librería bcrypt
 * de Node. Solo para desarrollo.
 */

BEGIN;

-- El administrador va primero porque registra el alta de las demás cuentas
INSERT INTO usuario
    (perfil_id, tipo_identificador, identificador, nombre_usuario, primer_nombre,
     primer_apellido, segundo_apellido, correo, telefono, "contraseña_hash", estado_cuenta)
SELECT perfil_id, 'NOMINA', 'N000001', 'N000001', 'Patricia', 'Morales', 'Vega',
       'patricia.morales@ducky.edu.mx', '8181000001', crypt('Ducky2026', gen_salt('bf', 10)),
       'ACTIVO'
FROM perfil
WHERE clave = 'PRF-ADM';

INSERT INTO usuario
    (perfil_id, programa_id, tipo_identificador, identificador, nombre_usuario, matricula,
     primer_nombre, primer_apellido, segundo_apellido, correo, telefono, "contraseña_hash",
     estado_cuenta, fecha_baja, motivo_baja, baja_por_usuario_id, alta_por_usuario_id)
SELECT pf.perfil_id,
       pa.programa_id,
       v.tipo,
       v.identificador,
       v.identificador,
       CASE WHEN v.tipo = 'MATRICULA' THEN v.identificador END,
       v.primer_nombre,
       v.primer_apellido,
       v.segundo_apellido,
       v.correo,
       v.telefono,
       crypt('Ducky2026', gen_salt('bf', 10)),
       v.estado,
       CASE WHEN v.estado = 'INACTIVO' THEN TIMESTAMPTZ '2026-09-15 10:00:00-06' END,
       v.motivo_baja,
       CASE WHEN v.estado = 'INACTIVO' THEN adm.usuario_id END,
       adm.usuario_id
FROM (VALUES
    ('NOMINA',    'N000104',   'Ernesto',  'Díaz',      NULL,    'ernesto.diaz@ducky.edu.mx',     '8181000104', 'PRF-BIB',      NULL,  'ACTIVO',   NULL),
    ('NOMINA',    'N000105',   'Gabriela', 'Núñez',     'Paz',   'gabriela.nunez@ducky.edu.mx',   NULL,         'PRF-BIB-CON',  NULL,  'ACTIVO',   NULL),
    ('NOMINA',    'N000210',   'Ricardo',  'Vega',      'Lara',  'ricardo.vega@ducky.edu.mx',     '8181000210', 'PRF-COM',      NULL,  'ACTIVO',   NULL),
    ('NOMINA',    'N000305',   'Sofía',    'Hernández', 'Cruz',  'sofia.hernandez@ducky.edu.mx',  '8181000305', 'PRF-MAE',      NULL,  'ACTIVO',   NULL),
    ('NOMINA',    'N000402',   'Luis',     'Ramírez',   'Ortiz', 'luis.ramirez@ducky.edu.mx',     NULL,         'PRF-COL',      NULL,  'ACTIVO',   NULL),
    -- Con 2 préstamos activos (HUGUS03 escenario 2)
    ('MATRICULA', 'A01234567', 'Mariana',  'López',     NULL,    'mariana.lopez@ducky.edu.mx',    '8112345678', 'PRF-ALU',      'ICO', 'ACTIVO',   NULL),
    -- Cuenta inactiva (HUGUS01 escenario 3, HUGUS03 escenario 5)
    ('MATRICULA', 'A01678234', 'Ana',      'Torres',    'Ruiz',  'ana.torres@ducky.edu.mx',       NULL,         'PRF-ALU',      'ARQ', 'INACTIVO', 'Baja temporal solicitada por Servicios Escolares'),
    -- Sin préstamos pero con multa pendiente (HUGUS03 escenario 3)
    ('MATRICULA', 'A01555888', 'Rodrigo',  'Díaz',      'Mora',  'rodrigo.diaz@ducky.edu.mx',     NULL,         'PRF-ALU',      'IIN', 'ACTIVO',   NULL),
    -- Sin pendientes: su baja procede (HUGUS03 escenario 1)
    ('MATRICULA', 'A01999000', 'Carlos',   'Pérez',     'Soto',  'carlos.perez@ducky.edu.mx',     '8119990000', 'PRF-ALU',      'LEC', 'ACTIVO',   NULL),
    -- Cuenta activa con perfil inactivo (HUGUS01 escenario 3)
    ('MATRICULA', 'A01333444', 'Diego',    'Castro',    NULL,    'diego.castro@ducky.edu.mx',     NULL,         'PRF-ALU-2020', 'LEC', 'ACTIVO',   NULL),
    -- Cuenta activa, pero ya no es alumno vigente en CIAA (HUGUS01 escenario 3)
    ('MATRICULA', 'A01444222', 'Lucía',    'Herrera',   NULL,    'lucia.herrera@ducky.edu.mx',    NULL,         'PRF-ALU',      'ARQ', 'ACTIVO',   NULL)
) AS v (tipo, identificador, primer_nombre, primer_apellido, segundo_apellido, correo,
        telefono, perfil_clave, programa_clave, estado, motivo_baja)
JOIN perfil pf ON pf.clave = v.perfil_clave
LEFT JOIN programa_academico pa ON pa.clave = v.programa_clave
CROSS JOIN (SELECT usuario_id FROM usuario WHERE identificador = 'N000001') AS adm;

-- Los perfiles base quedan registrados como creados por el administrador
UPDATE perfil
SET creado_por_usuario_id = (SELECT usuario_id FROM usuario WHERE identificador = 'N000001');

COMMIT;
