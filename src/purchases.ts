/*----
 * Programa: purchases.ts
 * Objetivo: Implementación del módulo purchases
 */

export type PurchaseLine = {
  id: string;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  quantity: number;
  received: number;
};
export type Purchase = {
  id: string;
  title: string;
  requester: string;
  cost: number;
  quantity: number;
  received: number;
  state: string;
  lines?: PurchaseLine[];
  createdAt?: string;
  sentAt?: string;
  resolvedAt?: string;
  deliveredAt?: string;
  receipts?: { id: string; date: string; lines: { id: string; quantity: number }[] }[];
};
export function validateLines(lines: PurchaseLine[]) {
  if (!lines.length) throw new Error('Agrega al menos una partida antes de enviar.');
  if (lines.some((l) => !l.title.trim() || !l.author.trim() || !l.publisher.trim()))
    throw new Error('Completa título, autor y editorial en cada partida.');
  if (lines.some((l) => !Number.isSafeInteger(l.quantity) || l.quantity <= 0))
    throw new Error('Las cantidades solicitadas deben ser enteros mayores que cero.');
}
export function receivePurchase(
  p: Purchase,
  date: string,
  quantities: Record<string, number>,
  receiptId: string,
): Purchase {
  if (!['En Tesorería', 'Autorizado', 'Recibido parcialmente'].includes(p.state))
    throw new Error('La solicitud debe estar enviada y tener material pendiente.');
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(Date.parse(date)) ||
    new Date(date).toISOString().slice(0, 10) !== date
  )
    throw new Error('Captura una fecha de recepción válida.');
  const lines = p.lines || [
    {
      id: p.id,
      title: p.title,
      author: '',
      publisher: '',
      isbn: '',
      quantity: p.quantity,
      received: p.received,
    },
  ];
  if (Object.keys(quantities).some((id) => !lines.some((l) => l.id === id)))
    throw new Error('La partida no pertenece a la solicitud.');
  const receivedLines = lines.map((l) => ({ id: l.id, quantity: quantities[l.id] ?? 0 }));
  if (
    receivedLines.some(
      (l, i) =>
        !Number.isSafeInteger(l.quantity) ||
        l.quantity < 0 ||
        l.quantity > lines[i].quantity - lines[i].received,
    )
  )
    throw new Error('Cada cantidad debe ser entera, no negativa y no superar lo pendiente.');
  if (!receivedLines.some((l) => l.quantity > 0)) throw new Error('Recibe al menos un ejemplar.');
  const updated = lines.map((l, i) => ({ ...l, received: l.received + receivedLines[i].quantity }));
  const received = updated.reduce((n, l) => n + l.received, 0);
  return {
    ...p,
    lines: updated,
    received,
    state: updated.every((l) => l.received === l.quantity) ? 'Recibido' : 'Recibido parcialmente',
    receipts: [
      ...(p.receipts || []),
      { id: receiptId, date, lines: receivedLines.filter((l) => l.quantity > 0) },
    ],
  };
}

export function findPurchase(requests: Purchase[], folio: string) {
  return requests.find((r) => r.id.toLowerCase() === folio.trim().toLowerCase());
}
