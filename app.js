/*----
 * Programa: app.js
 * Objetivo: Configurar la aplicación Express (seguridad, CORS, JSON, cookies, rutas y errores)
 * Autores: Equipo OHNO S.A. de C.V.
 * Fecha: 27 de Octubre de 2026
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ENTORNO from './config/entorno.js';
import indexRutas from './rutas/indexRutas.js';
import { rutaNoEncontrada, manejarErrores } from './middlewares/manejoErrores.js';

const LIMITE_CUERPO_JSON = '1mb'; // Tamaño máximo aceptado del cuerpo de una petición

const app = express();

app.disable('x-powered-by');
app.use(helmet());
// credentials: true permite que el front envíe la cookie de sesión
app.use(cors({ origin: ENTORNO.ORIGEN_FRONT, credentials: true }));
app.use(express.json({ limit: LIMITE_CUERPO_JSON }));
app.use(cookieParser());

app.use('/api', indexRutas);

app.use(rutaNoEncontrada);
app.use(manejarErrores);

export default app;
