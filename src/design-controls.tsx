/*----
 * Programa: design-controls.tsx
 * Objetivo: Implementación del módulo design-controls
 */

// Punto de entrada compartido por las pantallas importadas de Figma.
export { DesignContext, useDesign } from './context/DesignContext';
export type { DesignState } from './context/DesignContext';
export { DesignInput, DesignSelect } from './components/DesignFields';
export { DesignText } from './components/DesignText';
export { Action } from './components/Action';
export { DynamicSlot } from './components/DynamicSlot';
