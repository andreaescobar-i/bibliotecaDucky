import test from 'node:test';
import assert from 'node:assert/strict';
import { validateLines, receivePurchase, findPurchase } from '../src/purchases.ts';
const line = {
  id: 'L1',
  title: 'Libro nuevo',
  author: 'Autor',
  publisher: 'Editorial',
  isbn: '',
  quantity: 3,
  received: 0,
};
const purchase = () => ({
  id: 'SOL-1',
  title: line.title,
  requester: 'Facultad',
  cost: 300,
  quantity: 3,
  received: 0,
  state: 'En Tesorería',
  lines: [{ ...line }],
  sentAt: '2026-10-27T12:00:00Z',
});
test('solicitud válida sin ISBN ni ficha de catálogo', () =>
  assert.doesNotThrow(() => validateLines([line])));
test('solicitud sin libros', () => assert.throws(() => validateLines([]), /al menos una/));
test('datos bibliográficos vacíos o con espacios', () => {
  for (const key of ['title', 'author', 'publisher'])
    assert.throws(() => validateLines([{ ...line, [key]: '   ' }]), /Completa/);
});
test('cantidades solicitadas inválidas', () => {
  for (const quantity of [0, -1, 1.5, NaN, Infinity])
    assert.throws(() => validateLines([{ ...line, quantity }]), /enteros/);
});
test('recepción completa conserva fecha, folio y cantidades', () => {
  const p = receivePurchase(purchase(), '2026-10-27', { L1: 3 }, 'REC-1');
  assert.equal(p.state, 'Recibido');
  assert.equal(p.received, 3);
  assert.deepEqual(p.receipts, [
    { id: 'REC-1', date: '2026-10-27', lines: [{ id: 'L1', quantity: 3 }] },
  ]);
});
test('recepciones parciales acumuladas y cierre posterior', () => {
  const initial = purchase();
  const partial = receivePurchase(initial, '2026-10-27', { L1: 1 }, 'REC-1');
  assert.equal(partial.state, 'Recibido parcialmente');
  assert.equal(initial.received, 0);
  assert.throws(() => receivePurchase(partial, '2026-10-28', { L1: 3 }, 'REC-X'), /pendiente/);
  const full = receivePurchase(partial, '2026-10-28', { L1: 2 }, 'REC-2');
  assert.equal(full.received, 3);
  assert.equal(full.state, 'Recibido');
  assert.equal(full.receipts.length, 2);
  assert.throws(() => receivePurchase(full, '2026-10-29', { L1: 1 }, 'REC-X'));
});
test('recepción parcial de varias partidas', () => {
  const p = purchase();
  p.lines.push({ ...line, id: 'L2', quantity: 2 });
  p.quantity = 5;
  const partial = receivePurchase(p, '2026-10-27', { L2: 2 }, 'REC-1');
  assert.equal(partial.state, 'Recibido parcialmente');
  assert.equal(partial.received, 2);
  assert.equal(partial.lines[0].received, 0);
});
test('rechaza fechas inválidas, partidas ajenas, cantidades inválidas y solicitud no enviada', () => {
  for (const date of ['', '2026-02-30', 'incorrecta'])
    assert.throws(() => receivePurchase(purchase(), date, { L1: 1 }, 'REC-X'));
  for (const quantity of [0, -1, 1.5, NaN, Infinity, 4])
    assert.throws(() => receivePurchase(purchase(), '2026-10-27', { L1: quantity }, 'REC-X'));
  assert.throws(() => receivePurchase(purchase(), '2026-10-27', { desconocida: 1 }, 'REC-X'));
  assert.throws(() =>
    receivePurchase({ ...purchase(), state: 'Por autorizar' }, '2026-10-27', { L1: 1 }, 'REC-X'),
  );
});

test('consulta por folio enviado e inexistente', () => {
  const p = purchase();
  assert.equal(findPurchase([p], ' sol-1 '), p);
  assert.equal(findPurchase([p], 'SOL-INEXISTENTE'), undefined);
  assert.equal(findPurchase([p], ''), undefined);
});
