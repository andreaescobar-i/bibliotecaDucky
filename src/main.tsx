/*----
 * Programa: main.tsx
 * Objetivo: Implementación del módulo main
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import './fonts.css';
import './base.css';
import './design.css';
import './app.css';
import App from './App';
import { Recovery } from './components/Recovery';
const token = /^#recuperar\/([A-Za-z0-9_-]+)$/.exec(location.hash)?.[1];
createRoot(document.getElementById('root')!).render(token ? <Recovery token={token} /> : <App />);
