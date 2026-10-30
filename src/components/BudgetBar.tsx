/*----
 * Programa: BudgetBar.tsx
 * Objetivo: Implementación del módulo BudgetBar
 */

import { useDesign } from '../context/DesignContext';

// Barra del presupuesto disponible del mes, con el porcentaje que informa la API.
export function BudgetBar() {
  const { data } = useDesign();
  const budget = data.budget;
  const share =
    budget?.informado && budget.montoAutorizado
      ? Math.max(0, Math.min(100, ((budget.disponible ?? 0) / budget.montoAutorizado) * 100))
      : 0;
  return (
    <div
      className="bg-[#1f1f1f] h-[12.792px] relative shrink-0"
      style={{ width: `${share}%` }}
      data-node-id="207:1711"
      data-name="Container"
    />
  );
}
