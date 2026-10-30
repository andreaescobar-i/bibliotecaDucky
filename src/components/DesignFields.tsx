/*----
 * Programa: DesignFields.tsx
 * Objetivo: Implementación del módulo DesignFields
 */

import { useState, type HTMLAttributes } from 'react';
import { roles } from '../model';
import { useDesign } from '../context/DesignContext';

const clean = (s: string) => s.replace(/\u200b/g, '').trim();
export function DesignInput({
  label,
  initialValue,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { label: string; initialValue: string }) {
  const state = useDesign();
  const id = props['data-node-id'];
  const fieldLabel =
    label === 'Left icon' || !label
      ? state.route === '27-759'
        ? String(id).includes('3757')
          ? 'Contraseña'
          : 'Usuario'
        : 'Buscar'
      : label;
  let initial = clean(initialValue);
  if (/^Ej\.|^Escribe |^Buscar /.test(initial)) initial = '';
  const isBookForm = state.overlay === '211-1034';
  const bookFields = {
    Título: 'title',
    Autor: 'author',
    Editorial: 'publisher',
    Clave: 'code',
    ISBN: 'isbn',
    'Descripción del libro': 'description',
    Ubicación: 'location',
    Tema: 'topic',
    'Tipo de uso': 'use',
  };
  if (isBookForm) {
    // Ficha nueva: vacía, con un ejemplar y el tipo de uso más común; edición: datos de la BD
    const isNew = state.selected === 'new';
    if (bookFields[fieldLabel])
      initial = isNew
        ? fieldLabel === 'Tipo de uso'
          ? 'Préstamo externo'
          : ''
        : String(state.book[bookFields[fieldLabel]] || '');
    if (fieldLabel === 'Precio de compra (USD)')
      initial = isNew || state.book.price == null ? '' : String(state.book.price);
    // En la edición indica cuántos ejemplares nuevos se agregan a la ficha
    if (fieldLabel === 'Ejemplares que se reciben') initial = isNew ? '1' : '0';
    if (!isNew && fieldLabel === 'Ubicación' && !state.book.copyList?.some((c) => c.ubicacion))
      initial = '';
    if (!isNew && fieldLabel === 'Tipo de uso' && !state.book.copyList?.length) initial = '';
  }
  // Clasificación del ejemplar elegido en la tabla de ejemplares
  if (state.overlay === '247-3593') {
    const copy =
      state.book.copyList?.find((c) => c.clave === state.selected) || state.book.copyList?.[0];
    const copyValues: Record<string, string | null | undefined> = {
      Clave: copy?.clasificacion,
      'Ubicación / estante': copy?.ubicacion,
      Tema: state.book.topic,
      'Tipo de uso': copy?.tipoUso,
    };
    if (fieldLabel in copyValues) initial = String(copyValues[fieldLabel] || '');
  }
  // Alta y cambio de usuario: en el cambio se precargan los datos de la cuenta
  const editingUser = state.overlay === '241-3699' && state.selected !== 'new';
  if (state.overlay === '241-3699') {
    const u = state.data.users.find((u) => u.id === state.selected);
    initial =
      {
        'Nombre completo': u?.name,
        'ID o matrícula': u?.id,
        'Correo institucional': u?.email,
      }[fieldLabel] ?? '';
  }
  // Las claves no se editan: identifican la cuenta o la ficha en la BD
  const readOnly =
    (editingUser && fieldLabel === 'ID o matrícula') ||
    (state.overlay === '211-1034' && state.selected !== 'new' && fieldLabel === 'Clave');
  const numeric = /cantidad|ejemplares|copias|precio|costo|cambio|monto/i.test(fieldLabel);
  if (numeric) initial = initial.replace(/[^0-9.]/g, '');
  const [value, setValue] = useState(initial);
  const type = /contraseña/i.test(fieldLabel)
    ? 'password'
    : /correo/i.test(fieldLabel)
      ? 'email'
      : /cantidad|ejemplares|copias|precio|costo|cambio|monto/i.test(fieldLabel)
        ? 'number'
        : 'text';
  return (
    <div {...props} className={(props.className || '') + ' design-input'}>
      {children}
      <input
        aria-label={fieldLabel}
        name={fieldLabel}
        type={type}
        min={type === 'number' ? 0 : undefined}
        step={type === 'number' ? 'any' : undefined}
        value={value}
        readOnly={readOnly}
        title={readOnly ? 'Este dato identifica el registro y no se puede cambiar' : undefined}
        placeholder={initialValue.startsWith('Ej.') ? initialValue : ''}
        autoComplete={type === 'password' ? 'current-password' : 'off'}
        style={{
          paddingLeft:
            props['data-name'] === 'Left icon' ? (state.route === '27-759' ? 46 : 38) : 14,
        }}
        onChange={(e) => {
          setValue(e.target.value);
          state.field(fieldLabel, e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            state.action(
              state.route === '27-759'
                ? 'Ingresar'
                : state.overlay === '321-2162'
                  ? 'Enviar'
                  : 'Buscar',
            );
          }
        }}
      />
    </div>
  );
}
export function DesignSelect({
  label,
  initialValue,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { label: string; initialValue: string }) {
  const state = useDesign();
  let text = clean(initialValue).split('Item')[0].trim();
  // Al cambiar un usuario, el rol empieza en el que ya tiene la cuenta
  if (state.overlay === '241-3699' && label === 'Rol asignado')
    text = state.data.users.find((u) => u.id === state.selected)?.role || text;
  // Ficha y clasificación: listas sin "Todos". Ficha nueva sin tema elegido; en la edición y la
  // clasificación, el tema del libro y el tipo de uso del ejemplar
  const bookForm = ['211-1034', '247-3593'].includes(state.overlay);
  const copy =
    state.book.copyList?.find((c) => c.clave === state.selected) || state.book.copyList?.[0];
  if (bookForm && label === 'Tema') text = state.selected === 'new' ? '' : state.book.topic || '';
  if (bookForm && label === 'Tipo de uso' && state.selected !== 'new') text = copy?.tipoUso || text;
  const [value, setValue] = useState(bookForm ? text : text || 'Todos');
  const name = props['data-name'] || '';
  const key = (label + ' ' + name).toLowerCase();
  // Temas, tipos de uso y motivos de baja vienen de los catálogos de la BD
  const catalogs = state.data.catalogs;
  let options = /rol/.test(key)
    ? roles
    : /criterio/.test(key)
      ? ['Todos', 'Título', 'Autor', 'Editorial', 'Clave']
      : /uso/.test(key)
        ? [...(bookForm ? [] : ['Todos']), ...(catalogs?.tiposUso || [])]
        : /tema/.test(key)
          ? [bookForm ? '' : 'Todos los temas', ...(catalogs?.temas || [])]
          : /motivo/.test(key)
            ? catalogs?.motivosBaja || []
            : /estado/.test(key)
              ? state.route === '241-3397'
                ? ['Todos', 'Activo', 'Inactivo']
                : [
                    'Todos',
                    'Por autorizar',
                    'En Tesorería',
                    'Autorizado',
                    'Rechazado',
                    'Recibido parcialmente',
                    'Recibido',
                    'Entregado al catálogo',
                  ]
              : ['Todos', 'Alumno', 'Maestro', 'Colaborador'];
  if (text && !options.includes(String(text))) options = [text, ...options];
  const actualLabel = label || (/rol/.test(name) ? 'Rol' : 'Estado');
  return (
    <div {...props} className={(props.className || '') + ' design-select'}>
      {children}
      <select
        aria-label={actualLabel}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          state.field(actualLabel, e.target.value);
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o || 'Selecciona un tema'}
          </option>
        ))}
      </select>
    </div>
  );
}
