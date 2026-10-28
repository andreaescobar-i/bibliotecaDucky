import { createContext, useContext } from 'react';
import type { Data, Book } from '../model';

export type DesignState = {
  data: Data;
  role: string;
  userId: string;
  userName?: string;
  session?: import('../api').Session | null;
  route: string;
  overlay: string;
  book: Book;
  selected: string;
  query: string;
  filter: string;
  sort: string;
  page: number;
  fields: Record<string, string>;
  // Datos que la ventana abierta pidió a la API (historial, detalle, rechazos)
  extra: Record<string, any>;
  action: (label: string, record?: string) => void;
  field: (label: string, value: string) => void;
};
export const DesignContext = createContext<DesignState>(null!);
export const useDesign = () => useContext(DesignContext);
