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
  };
  if (isBookForm && bookFields[fieldLabel])
    initial = state.selected === 'new' ? '' : String(state.book[bookFields[fieldLabel]] || '');
  if (state.overlay === '211-962' && /Monto pagado/.test(fieldLabel)) {
    initial = String(state.data.fines.find((f) => f.id === state.selected)?.amount || 120);
  }
  if (state.overlay === '241-3699') {
    const u = state.data.users.find((u) => u.id === state.selected);
    initial =
      { 'Nombre completo': u?.name, 'ID o matrícula': u?.id, 'Correo institucional': u?.email }[
        fieldLabel
      ] ?? '';
  }
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
        placeholder={initialValue.startsWith('Ej.') ? initialValue : ''}
        autoComplete={type === 'password' ? 'current-password' : 'off'}
        style={{ paddingLeft: props['data-name'] === 'Left icon' ? (state.route === '27-759' ? 46 : 38) : 14 }}
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
  const [value, setValue] = useState(text || 'Todos');
  const name = props['data-name'] || '';
  const key = (label + ' ' + name).toLowerCase();
  let options = /rol/.test(key)
    ? roles
    : /criterio/.test(key)
      ? ['Todos', 'Título', 'Autor', 'Editorial', 'Clave']
      : /uso/.test(key)
        ? ['Todos', 'Préstamo externo', 'Consulta interna', 'Reservado']
        : /tema/.test(key)
          ? ['Todos los temas', 'Literatura', 'Computación', 'Historia', 'Matemáticas', 'Ciencias']
          : /motivo/.test(key)
            ? ['Perdido', 'Dañado', 'Obsoleto', 'Otro']
            : /periodo/.test(key)
              ? ['Octubre 2025', 'Septiembre 2025', 'Agosto 2025']
              : /programa/.test(key)
                ? ['Todos los programas', 'Ing. Industrial', 'Arquitectura', 'Lic. Economía']
                : /estante/.test(key)
                  ? ['Todos los estantes', 'LIT · A1', 'COM · B2', 'HIS · C1']
                  : /estado/.test(key)
                    ? [
                        'Todos',
                        'Activo',
                        'Inactivo',
                        'Pendiente',
                        'Registrada',
                        'Por autorizar',
                        'Autorizado',
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
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
