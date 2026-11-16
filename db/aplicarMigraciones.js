/*----
 * Programa: aplicarMigraciones.js
 * Objetivo: Aplicar a la base del .env solo los archivos de esquema y migración que le falten,
 *           sin borrar la base ni sus datos. Uso: npm run db:migrar
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 15 de Noviembre de 2026
 *
 * A diferencia de npm run db:reset, no borra nada ni carga semillas: sirve para actualizar una
 * base que ya tiene datos. Se puede ejecutar las veces que sea; si no hay nada pendiente, no
 * cambia nada.
 */

import pg from 'pg';
import ENTORNO from '../config/entorno.js';
import {
  listarMigraciones,
  calcularPendientes,
  asegurarTablaControl,
  registrarMigraciones,
  obtenerAplicadas,
  detectarAplicadasSinRegistro,
  aplicarMigracion,
  configurarRolLectura,
} from './utilidadesMigracion.js';

// Candado para que dos ejecuciones simultáneas no apliquen la misma migración
const LLAVE_CANDADO = 20261115;

/**
 * Objetivo: Aplicar las migraciones pendientes y preparar el usuario de solo lectura.
 * @returns {Promise<void>}
 * Limitaciones: La base debe existir. Se detiene en el primer archivo que falle.
 */
async function migrarBaseDatos() {
  console.log(
    `Actualizando la base "${ENTORNO.BD.database}" en ${ENTORNO.BD.host}:${ENTORNO.BD.port}...`,
  );
  const ClienteBd = new pg.Client(ENTORNO.BD);
  await ClienteBd.connect();
  try {
    await ClienteBd.query('SELECT pg_advisory_lock($1)', [LLAVE_CANDADO]);

    const existiaControl = await asegurarTablaControl(ClienteBd);
    if (!existiaControl) {
      // Base creada antes de que existiera el control: se anota lo que ya refleja
      const detectadas = await detectarAplicadasSinRegistro(ClienteBd);
      await registrarMigraciones(ClienteBd, detectadas);
      for (const nombre of detectadas) {
        console.log(`  · ${nombre} (ya estaba aplicado)`);
      }
    }

    const pendientes = calcularPendientes(listarMigraciones(), await obtenerAplicadas(ClienteBd));
    for (const migracion of pendientes) {
      await aplicarMigracion(ClienteBd, migracion);
      console.log(`  ✓ ${migracion.nombre}`);
    }
    if (pendientes.length === 0) {
      console.log('  No hay migraciones pendientes.');
    }

    console.log(
      await configurarRolLectura(ClienteBd, {
        chatBd: ENTORNO.CHAT_BD,
        baseDatos: ENTORNO.BD.database,
        usuarioPropietario: ENTORNO.BD.user,
      }),
    );
  } finally {
    // Al cerrar la conexión PostgreSQL libera el candado
    await ClienteBd.end();
  }
  console.log('Base de datos actualizada.');
}

// Sugerencias para los errores de conexión más comunes
const SUGERENCIAS_ERROR = {
  '28P01': 'Revisa PGUSER y PGPASSWORD en el archivo .env',
  '3D000': 'La base no existe; créala con npm run db:reset (borra y carga datos de prueba)',
  ECONNREFUSED: 'PostgreSQL no responde; revisa que el servicio esté iniciado y PGHOST/PGPORT',
  ENOTFOUND: 'No se encontró el servidor; revisa PGHOST en el archivo .env',
};

migrarBaseDatos().catch((err) => {
  // Un fallo de conexión llega como AggregateError, sin mensaje propio pero con código
  console.error(`\n✗ ${err.message || err.code || err}`);
  if (SUGERENCIAS_ERROR[err.code]) {
    console.error(`  ${SUGERENCIAS_ERROR[err.code]}`);
  }
  process.exitCode = 1;
});
