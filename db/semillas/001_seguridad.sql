/*----
 * Programa: 001_seguridad.sql
 * Objetivo: Cargar roles, permisos, matriz rol-permiso, políticas de préstamo y perfiles base
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 *
 * Los seis roles son los del front (src/model.ts). La matriz sigue HUPRF01:
 *   - Solo Administrador gestiona cuentas y perfiles.
 *   - Administrador y Bibliotecario dan de alta, baja y cambio a libros, clasifican y etiquetan.
 *   - Administrador, Bibliotecario y Comprador de libros gestionan compras y recepciones.
 *   - Todos los roles consultan el catálogo, la ubicación y el listado.
 */

BEGIN;

INSERT INTO rol (nombre, descripcion) VALUES
    ('Alumno',              'Alumno vigente en CIAA'),
    ('Maestro',             'Profesor con nómina vigente en Capital Humano'),
    ('Colaborador',         'Personal administrativo con nómina vigente'),
    ('Bibliotecario',       'Personal de ventanilla y catálogo'),
    ('Administrador',       'Responsable de la biblioteca y de las cuentas'),
    ('Comprador de libros', 'Encargado de adquisiciones y recepciones');

INSERT INTO permiso (clave, nombre, modulo, descripcion) VALUES
    ('ALTA_CUENTAS',          'Alta de cuentas',             'CUENTAS',  'Crear cuentas de usuario'),
    ('BAJA_CUENTAS',          'Baja de cuentas',             'CUENTAS',  'Baja lógica de cuentas'),
    ('CAMBIO_CUENTAS',        'Cambio de cuentas',           'CUENTAS',  'Editar contacto de cuentas'),
    ('CONSULTA_CUENTAS',      'Consulta de cuentas',         'CUENTAS',  'Buscar y consultar cuentas'),
    ('ASIGNAR_PERFILES',      'Asignar perfiles',            'CUENTAS',  'Asignar o cambiar el perfil de una cuenta'),
    ('CREAR_PERFILES',        'Crear perfiles',              'PERFILES', 'Registrar perfiles'),
    ('CONSULTAR_PERFILES',    'Consultar perfiles',          'PERFILES', 'Consultar perfiles y sus permisos'),
    ('MODIFICAR_PERFILES',    'Modificar perfiles',          'PERFILES', 'Editar nombre, rol y permisos'),
    ('DESACTIVAR_PERFILES',   'Desactivar perfiles',         'PERFILES', 'Desactivar perfiles sin cuentas activas'),
    ('ALTA_LIBROS',           'Alta de libros',              'CATALOGO', 'Registrar fichas y ejemplares'),
    ('BAJA_LIBROS',           'Baja de libros',              'CATALOGO', 'Dar de baja ejemplares conservando historial'),
    ('CAMBIO_LIBROS',         'Cambio de libros',            'CATALOGO', 'Editar datos bibliográficos'),
    ('CLASIFICAR_EJEMPLARES', 'Clasificar ejemplares',       'CATALOGO', 'Cambiar clasificación y ubicación'),
    ('ETIQUETAR_EJEMPLARES',  'Etiquetar ejemplares',        'CATALOGO', 'Generar y actualizar etiquetas'),
    ('CONSULTAR_LIBROS',      'Consultar libros',            'CONSULTA', 'Buscar libros y ver disponibilidad'),
    ('CONSULTAR_UBICACION',   'Consultar ubicación',         'CONSULTA', 'Ver librero y fila de cada ejemplar'),
    ('CONSULTAR_LISTADO',     'Consultar listado de libros', 'CONSULTA', 'Listado filtrado, PDF e impresión'),
    ('GESTIONAR_SOLICITUDES', 'Gestionar solicitudes de compra', 'COMPRAS', 'Preparar y enviar solicitudes a Tesorería'),
    ('REGISTRAR_RECEPCIONES', 'Registrar recepciones',       'COMPRAS',  'Registrar entregas recibidas');

-- Matriz rol-permiso (máximo permitido por rol)
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT r.rol_id, p.permiso_id
FROM rol r
JOIN permiso p ON
    r.nombre = 'Administrador'
    OR (r.nombre = 'Bibliotecario' AND p.modulo IN ('CATALOGO', 'CONSULTA', 'COMPRAS'))
    OR (r.nombre = 'Comprador de libros' AND p.modulo IN ('CONSULTA', 'COMPRAS'))
    OR (r.nombre IN ('Alumno', 'Maestro', 'Colaborador') AND p.modulo = 'CONSULTA');

-- Reglas 5 y 6 de la biblioteca
INSERT INTO politica_prestamo (nombre, dias_habiles, max_renovaciones, vigente_desde) VALUES
    ('Alumnos',  5,  2, DATE '2026-08-01'),
    ('Maestros', 10, 3, DATE '2026-08-01');

INSERT INTO perfil (rol_id, politica_prestamo_id, clave, nombre, descripcion, activo)
SELECT r.rol_id, pp.politica_prestamo_id, v.clave, v.nombre, v.descripcion, v.activo
FROM (VALUES
    ('PRF-ADM', 'Administrador general', 'Administrador', NULL,
     'Gestionar usuarios, asignar roles y administrar perfiles.', TRUE),
    ('PRF-BIB', 'Bibliotecario de ventanilla', 'Bibliotecario', NULL,
     'Registrar y editar libros; clasificar, etiquetar y dar de baja ejemplares.', TRUE),
    ('PRF-BIB-CON', 'Bibliotecario de consulta', 'Bibliotecario', NULL,
     'Perfil reducido: solo consulta del catálogo.', TRUE),
    ('PRF-COM', 'Comprador de libros', 'Comprador de libros', NULL,
     'Preparar solicitudes y remitirlas a Tesorería; registrar entregas recibidas.', TRUE),
    ('PRF-MAE', 'Maestro', 'Maestro', 'Maestros',
     'Préstamos: 10 días hábiles. Máximo 3 renovaciones.', TRUE),
    ('PRF-ALU', 'Alumno', 'Alumno', 'Alumnos',
     'Préstamos: 5 días hábiles. Máximo 2 renovaciones.', TRUE),
    ('PRF-COL', 'Colaborador', 'Colaborador', 'Alumnos',
     'Préstamos: 5 días hábiles. Máximo 2 renovaciones.', TRUE),
    ('PRF-ALU-2020', 'Alumno plan 2020', 'Alumno', 'Alumnos',
     'Perfil histórico, ya no se asigna.', FALSE)
) AS v (clave, nombre, rol, politica, descripcion, activo)
JOIN rol r ON r.nombre = v.rol
LEFT JOIN politica_prestamo pp ON pp.nombre = v.politica;

-- Los perfiles base reciben todos los permisos de su rol, excepto el perfil reducido
INSERT INTO perfil_permiso (perfil_id, rol_id, permiso_id)
SELECT pf.perfil_id, rp.rol_id, rp.permiso_id
FROM perfil pf
JOIN rol_permiso rp ON rp.rol_id = pf.rol_id
JOIN permiso p ON p.permiso_id = rp.permiso_id
WHERE pf.clave <> 'PRF-BIB-CON'
    -- El Bibliotecario de ventanilla no compra: en el front las compras son del Comprador
    AND NOT (pf.clave = 'PRF-BIB' AND p.modulo = 'COMPRAS')
UNION ALL
SELECT pf.perfil_id, rp.rol_id, rp.permiso_id
FROM perfil pf
JOIN rol_permiso rp ON rp.rol_id = pf.rol_id
JOIN permiso p ON p.permiso_id = rp.permiso_id
WHERE pf.clave = 'PRF-BIB-CON' AND p.modulo = 'CONSULTA';

COMMIT;
