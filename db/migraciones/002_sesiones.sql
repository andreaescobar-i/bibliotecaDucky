/*----
 * Programa: 002_sesiones.sql
 * Objetivo: Permitir invalidar todas las sesiones abiertas de una cuenta (HUGUS01, HUGUS03)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 *
 * Cada sesión guarda la versión vigente al iniciar. Al dar de baja la cuenta o cambiar su
 * contraseña se incrementa version_sesion y todas las sesiones anteriores dejan de ser válidas,
 * aunque la cuenta se reactive después.
 */

BEGIN;

ALTER TABLE usuario
    ADD COLUMN version_sesion INTEGER NOT NULL DEFAULT 0 CHECK (version_sesion >= 0);

COMMIT;
