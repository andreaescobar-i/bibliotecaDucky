/*----
 * Programa: Action.tsx
 * Objetivo: Implementación del módulo Action
 */

import type { ReactNode } from 'react';
import { useDesign } from '../context/DesignContext';

export function Action({
  children,
  record,
  primary = false,
}: {
  children: ReactNode;
  record?: string;
  primary?: boolean;
}) {
  const s = useDesign();
  return (
    <button
      className={primary ? 'action primary' : 'action'}
      onClick={(e) => {
        e.stopPropagation();
        s.action(String(children), record);
      }}
    >
      {children}
    </button>
  );
}
