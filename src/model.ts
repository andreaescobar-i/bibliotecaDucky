import { initialData } from './data/demo-data';

export const roles = [
  'Alumno',
  'Maestro',
  'Colaborador',
  'Bibliotecario',
  'Administrador',
  'Comprador de libros',
];
export type Book = {
  id: string;
  title: string;
  author: string;
  publisher: string;
  code: string;
  state: string;
  use: string;
  copies: number;
  location: string;
  isbn: string;
  description: string;
};
export { seedBooks, initialData } from './data/demo-data';

export type Data = typeof initialData;
const STORAGE_KEY = 'ducky-data-v1';

export function loadData(): Data {
  try {
    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return storedData?.books && storedData?.users && storedData?.history
      ? storedData
      : structuredClone(initialData);
  } catch {
    return structuredClone(initialData);
  }
}
export function saveData(data: Data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
export function addBusinessDays(days: number, from = new Date()) {
  const date = new Date(from);
  while (days > 0) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0 && date.getDay() !== 6) days--;
  }
  return date.toISOString().slice(0, 10);
}
export const money = (n: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);
