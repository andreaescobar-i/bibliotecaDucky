/*----
 * Programa: 003_chatbot.sql
 * Objetivo: Preparar la base para el asistente Ducky (ChatBot, Sprint 3): completar las tablas
 *           del historial de conversaciones y crear las vistas de solo consulta que el
 *           asistente puede leer
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 15 de Noviembre de 2026
 *
 * Resumen de cambios (ninguno modifica ni borra datos existentes):
 *   1. Historial: valores permitidos y columnas de costo y resultado en sesion_chat y
 *      mensaje_chat (tablas del esquema base que aún no tenían uso).
 *   2. Esquema "chat": vistas con lo único que el asistente puede decir. No incluyen cuentas,
 *      contraseñas, bitácora, precios ni quién tiene prestado un ejemplar.
 *   3. Permisos: nadie más que el dueño de la base crea objetos en el esquema public.
 *
 * El usuario de solo lectura (CHAT_PGUSER) no se crea aquí porque su contraseña sale del .env;
 * lo crean npm run db:reset y npm run db:migrar (db/utilidadesMigracion.js).
 */

BEGIN;

-- ---------------------------------------------------------------------
-- 1. Historial de conversaciones
-- ---------------------------------------------------------------------

ALTER TABLE sesion_chat
    ADD CONSTRAINT ck_sesion_chat_canal CHECK (canal IN ('WEB')),
    ADD CONSTRAINT ck_sesion_chat_estatus CHECK (estatus IN ('ABIERTA', 'CERRADA')),
    -- Una conversación está cerrada si y solo si tiene fecha de fin
    ADD CONSTRAINT ck_sesion_chat_cierre CHECK ((estatus = 'CERRADA') = (fecha_fin IS NOT NULL));

ALTER TABLE mensaje_chat
    ADD COLUMN modelo          VARCHAR(64),  -- Modelo de IA que respondió (solo en ASISTENTE)
    -- Tokens: unidad en que se cobra el uso de la IA
    ADD COLUMN tokens_entrada  INTEGER CHECK (tokens_entrada >= 0),
    ADD COLUMN tokens_salida   INTEGER CHECK (tokens_salida >= 0),
    -- Consultas que hizo el asistente para responder: [{ "nombre": ..., "argumentos": ... }]
    ADD COLUMN herramientas    JSONB,
    -- SIN_INFORMACION: el asistente no tenía el dato y lo dijo; sirve para saber qué falta
    ADD COLUMN resultado       VARCHAR(16) NOT NULL DEFAULT 'EXITO'
        CHECK (resultado IN ('EXITO', 'SIN_INFORMACION', 'ERROR', 'LIMITE')),
    ADD CONSTRAINT ck_mensaje_chat_emisor CHECK (emisor IN ('USUARIO', 'ASISTENTE')),
    ADD CONSTRAINT ck_mensaje_chat_contenido CHECK (BTRIM(contenido) <> '');

-- Para contar los mensajes del día (límites de uso)
CREATE INDEX idx_mensaje_chat_fecha ON mensaje_chat ("timestamp");

-- ---------------------------------------------------------------------
-- 2. Vistas de solo consulta para el asistente
--    security_barrier impide que un filtro del lector se evalúe antes que el de la vista.
-- ---------------------------------------------------------------------

CREATE SCHEMA chat;

-- Una fila por ficha activa. Los ejemplares dados de baja no cuentan (igual que el catálogo).
CREATE VIEW chat.libro WITH (security_barrier = true) AS
SELECT l.clave_libro,
       l.titulo,
       COALESCE(
           (SELECT STRING_AGG(CONCAT_WS(' ', a.primer_nombre, a.primer_apellido), '; '
                              ORDER BY af.orden)
            FROM public.autoria_ficha af
            JOIN public.autor a ON a.autor_id = af.autor_id
            WHERE af.libro_id = l.libro_id),
           ''
       ) AS autores,
       c.nombre AS tema,
       e.nombre AS editorial,
       l.isbn,
       l.edicion,
       l."año" AS anio,
       l.descripcion,
       (SELECT COUNT(*)::INT FROM public.ejemplar ej
        WHERE ej.libro_id = l.libro_id AND ej.estado = 'DISPONIBLE') AS ejemplares_disponibles,
       (SELECT COUNT(*)::INT FROM public.ejemplar ej
        WHERE ej.libro_id = l.libro_id AND ej.estado <> 'DADO_DE_BAJA') AS ejemplares_registrados
FROM public.libro l
JOIN public.categoria c ON c.categoria_id = l.categoria_id
JOIN public.editorial e ON e.id_editorial = l.editorial_id
WHERE l.estado = 'ACTIVO';

-- Una fila por copia física en circulación. Librero y fila pueden faltar (HULIB04 escenario 4).
CREATE VIEW chat.ejemplar WITH (security_barrier = true) AS
SELECT l.clave_libro,
       l.titulo,
       ej.codigo_ejemplar,
       ej.clave_clasificacion,
       ej.librero,
       ej.fila,
       ej.estado,
       tu.nombre AS tipo_uso,
       tu.permite_prestamo
FROM public.ejemplar ej
JOIN public.libro l ON l.libro_id = ej.libro_id AND l.estado = 'ACTIVO'
JOIN public.tipo_uso tu ON tu.tipo_uso_id = ej.tipo_uso_id
WHERE ej.estado <> 'DADO_DE_BAJA';

-- Temas del catálogo con el número de fichas activas de cada uno
CREATE VIEW chat.tema AS
SELECT c.nombre,
       c.descripcion,
       (SELECT COUNT(*)::INT FROM public.libro l
        WHERE l.categoria_id = c.categoria_id AND l.estado = 'ACTIVO') AS libros
FROM public.categoria c;

CREATE VIEW chat.tipo_uso AS
SELECT tu.nombre, tu.permite_prestamo, tu.descripcion
FROM public.tipo_uso tu;

-- Reglas 5 y 6 de la biblioteca: días hábiles y renovaciones, con los roles a los que aplican
CREATE VIEW chat.regla_prestamo AS
SELECT pp.nombre,
       pp.dias_habiles,
       pp.max_renovaciones,
       pp.vigente_desde,
       COALESCE(
           (SELECT STRING_AGG(DISTINCT r.nombre, ', ' ORDER BY r.nombre)
            FROM public.perfil pf
            JOIN public.rol r ON r.rol_id = pf.rol_id
            WHERE pf.politica_prestamo_id = pp.politica_prestamo_id AND pf.activo),
           ''
       ) AS roles
FROM public.politica_prestamo pp
WHERE pp.activo;

-- ---------------------------------------------------------------------
-- 3. Permisos
-- ---------------------------------------------------------------------

-- Desde PostgreSQL 15 ya es así; en 13 y 14 cualquier usuario podía crear tablas en public
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

COMMIT;
