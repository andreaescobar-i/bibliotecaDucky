export const roles = [
  'Alumno',
  'Maestro',
  'Colaborador',
  'Bibliotecario',
  'Administrador',
  'Comprador de libros',
];
export type Copy = {
  clave: string;
  clasificacion: string | null;
  ubicacion: string | null;
  tipoUso: string;
  estado: string;
};
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
  topic?: string;
  edition?: string;
  price?: number | null;
  copyList?: Copy[];
};
export type User = { id: string; name: string; email: string; role: string; active: boolean };
export type Profile = {
  key: string;
  name: string;
  role: string;
  permissions: string[];
  activeAccounts: number;
  active: boolean;
};
export type Role = {
  name: string;
  description: string;
  permissions: string[];
  active: boolean;
};
export type Budget = {
  informado: boolean;
  periodo?: string;
  montoAutorizado?: number;
  disponible?: number;
};
export type Catalogs = { temas: string[]; tiposUso: string[]; motivosBaja: string[] };
export type Data = {
  books: Book[];
  users: User[];
  requests: import('./purchases').Purchase[];
  profiles?: Profile[];
  roles?: Role[];
  budget?: Budget;
  catalogs?: Catalogs;
};

// Todo sale de la API; mientras carga, las listas quedan vacías.
export const emptyData = (): Data => ({ books: [], users: [], requests: [] });
export const EMPTY_BOOK: Book = {
  id: '',
  title: '',
  author: '',
  publisher: '',
  code: '',
  state: '',
  use: '',
  copies: 0,
  location: '',
  isbn: '',
  description: '',
};
export const money = (n: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);
export const dateText = (value?: string | null) =>
  value ? new Date(value).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' }) : '';
