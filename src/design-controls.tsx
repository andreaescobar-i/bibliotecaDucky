import React,{createContext,useContext,useState,ReactNode,HTMLAttributes} from 'react';
import {Data,Book,roles,money} from './model';
export type DesignState={data:Data;role:string;userId:string;route:string;overlay:string;book:Book;selected:string;query:string;filter:string;sort:string;page:number;fields:Record<string,string>;action:(label:string,record?:string)=>void;field:(label:string,value:string)=>void};
export const DesignContext=createContext<DesignState>(null!);
export const useDesign=()=>useContext(DesignContext);
const clean=(s:string)=>s.replace(/\u200b/g,'').trim();
export function DesignInput({label,initialValue,children,...props}:HTMLAttributes<HTMLDivElement>&{label:string;initialValue:string}){
 const state=useDesign(); const id=props['data-node-id'];const fieldLabel=label==='Left icon'||!label?(state.route==='27-759'?(String(id).includes('3757')?'Contraseña':'Usuario'):'Buscar'):label;
 let initial=clean(initialValue);if(/^Ej\.|^Escribe |^Buscar /.test(initial))initial='';
 const isBookForm=state.overlay==='211-1034';
 const bookFields={'Título':'title','Autor':'author','Editorial':'publisher','Clave':'code','ISBN':'isbn','Descripción del libro':'description','Ubicación':'location'};
 if(isBookForm&&bookFields[fieldLabel])initial=state.selected==='new'?'':String(state.book[bookFields[fieldLabel]]||'');
 if(state.overlay==='211-962'&&/Monto pagado/.test(fieldLabel)){initial=String(state.data.fines.find(f=>f.id===state.selected)?.amount||120);}
 if(state.overlay==='241-3699'){const u=state.data.users.find(u=>u.id===state.selected);initial=({'Nombre completo':u?.name,'ID o matrícula':u?.id,'Correo institucional':u?.email}[fieldLabel]??'');}
 const numeric=/cantidad|ejemplares|copias|precio|costo|cambio|monto/i.test(fieldLabel);if(numeric)initial=initial.replace(/[^0-9.]/g,'');
 const [value,setValue]=useState(initial);const type=/contraseña/i.test(fieldLabel)?'password':/correo/i.test(fieldLabel)?'email':/cantidad|ejemplares|copias|precio|costo|cambio|monto/i.test(fieldLabel)?'number':'text';
 return <div {...props} className={(props.className||'')+' design-input'}>{children}<input aria-label={fieldLabel} name={fieldLabel} type={type} min={type==='number'?0:undefined} step={type==='number'?'any':undefined} value={value} placeholder={initialValue.startsWith('Ej.')?initialValue:''} autoComplete={type==='password'?'current-password':'off'} style={{paddingLeft:props['data-name']==='Left icon'?38:14}} onChange={e=>{setValue(e.target.value);state.field(fieldLabel,e.target.value)}} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();state.action(state.route==='27-759'?'Ingresar':state.overlay==='321-2162'?'Enviar':'Buscar')}}}/></div>
}
export function DesignSelect({label,initialValue,children,...props}:HTMLAttributes<HTMLDivElement>&{label:string;initialValue:string}){
 const state=useDesign();let text=clean(initialValue).split('Item')[0].trim();const [value,setValue]=useState(text||'Todos');
 const name=props['data-name']||'';const key=(label+' '+name).toLowerCase();
 let options=/rol/.test(key)?roles:/criterio/.test(key)?['Todos','Título','Autor','Editorial','Clave']:/uso/.test(key)?['Todos','Préstamo externo','Consulta interna','Reservado']:/tema/.test(key)?['Todos los temas','Literatura','Computación','Historia','Matemáticas','Ciencias']:/motivo/.test(key)?['Perdido','Dañado','Obsoleto','Otro']:/periodo/.test(key)?['Octubre 2025','Septiembre 2025','Agosto 2025']:/programa/.test(key)?['Todos los programas','Ing. Industrial','Arquitectura','Lic. Economía']:/estante/.test(key)?['Todos los estantes','LIT · A1','COM · B2','HIS · C1']:/estado/.test(key)?['Todos','Activo','Inactivo','Pendiente','Registrada','Por autorizar','Autorizado','Recibido','Entregado al catálogo']:['Todos','Alumno','Maestro','Colaborador'];
 if(text&&!options.includes(String(text)))options=[text,...options];
 const actualLabel=label||(/rol/.test(name)?'Rol':'Estado');
 return <div {...props} className={(props.className||'')+' design-select'}>{children}<select aria-label={actualLabel} value={value} onChange={e=>{setValue(e.target.value);state.field(actualLabel,e.target.value)}}>{options.map(o=><option key={o}>{o}</option>)}</select></div>
}
export function DesignText({children,...props}:HTMLAttributes<HTMLParagraphElement>){
 const s=useDesign();let text=typeof children==='string'?children.trim():children;const old=text;
 const id=String(props['data-node-id']||'');
 if(typeof text==='string'){
  if(id==='312:1703')text=(s.role==='Administrador'?'Alfonso Chapa':s.role==='Bibliotecario'?'Ernesto Díaz':s.role==='Comprador de libros'?'Luisa Palacios':'Mariana López')+' · '+s.role;
  if(['6-26','211-1135','247-3645','2196-2026','2196-2044','2196-2076','247-3458','2114-2308'].includes(s.overlay||s.route)){
   const b=s.book;if(s.route==='6-26'&&!s.overlay){if(['2136:2275','6:191'].includes(id))text=String(b.copies);if(id==='6:165')text=b.description;if(id==='6:194')text=b.location;}const map={'Introducción a los algoritmos':b.title,'Thomas H. Cormen':b.author,'Cien años de soledad':b.title,'Gabriel García Márquez':b.author,'MIT Press':b.publisher,'LIT-863.64-GAR':b.code,'COM-005.1-COR':b.code,'No registrado':b.isbn};text=map[String(text)]??text;
  }
  if(['174-3080','182-571','207-712'].includes(s.route)&&!s.overlay&&!id.includes(';')){const loan=s.data.loans.find(l=>l.id===s.selected);const u=s.data.users.find(u=>u.id===(loan?.userId||s.userId));const selectedBook=s.data.books.find(b=>b.id===loan?.bookId)||s.book;const map={'Mariana López Hernández':u?.name||'Mariana López','A01234567':u?.id||s.userId,'Pedro Páramo':selectedBook.title,'EJ-01082':selectedBook.code+' / EJ-001','PRE-2026-1843':loan?.id||'PRE-2026-1843','8 oct 2026':loan?.start||new Date().toISOString().slice(0,10),'15 oct 2026':loan?.due||new Date().toISOString().slice(0,10)};text=map[String(text)]??text;}
  if(s.overlay==='211-962'){const f=s.data.fines.find(f=>f.id===s.selected);if(f&&text==='Ana Torres Ruiz')text=f.user;}
  if(id.includes(';')&&['Mariana López','Alfonso Chapa','Luisa Palacios'].includes(String(text)))text=s.role==='Administrador'?'Alfonso Chapa':s.role==='Bibliotecario'?'Ernesto Díaz':s.role==='Comprador de libros'?'Luisa Palacios':'Mariana López';
  if(id.includes(';')&&['Alumno','Admin','Comprador de libros'].includes(String(text))&&(/62:591|247:3347|207:710|62:651/.test(id)))text=s.role;
  if(/resultados$/.test(String(text))&&['1-336','272-2449'].includes(s.route))text=`${s.data.books.filter(b=>b.title.toLowerCase().includes(s.query.toLowerCase())||b.author.toLowerCase().includes(s.query.toLowerCase())).length} resultados`;
  if(text==='Mostrando 1–5 de 10'){const books=s.data.books.filter(b=>[b.title,b.author,b.code,b.publisher].join(' ').toLowerCase().includes(s.query.toLowerCase()));text=`Mostrando ${books.length?(s.page-1)*5+1:0}–${Math.min(s.page*5,books.length)} de ${books.length}`;}
  if(text==='3 usuarios registrados')text=`${s.data.users.length} usuarios registrados`;
  if(text==='Página 1 · 10 libros')text=`Página ${s.page} · ${s.data.books.length} libros`;
  if(text==='Relevancia')text=s.sort;
  if(text==='Ordenados por relevancia')text=`Ordenados por ${s.sort.toLowerCase()}`;
  if(['2081-2172','2081-2189','2081-2208','211-1245','211-1260'].includes(s.overlay)){const r=s.data.requests.find(r=>r.id===s.selected);if(r){const map={'Diseño de sistemas interactivos':r.title,'SOL-2418':r.id,'Facultad de Diseño':r.requester,'2340.00':r.cost.toFixed(2),'Preparación':r.state};text=map[String(text)]??text;}}
  if(text==='Página 1 de 2')text=`Página ${s.page} de ${Math.max(1,Math.ceil(s.data.books.filter(b=>[b.title,b.author,b.code].join(' ').toLowerCase().includes(s.query.toLowerCase())).length/5))}`;
  if((s.overlay==='247-3679'||s.overlay==='2081-2208')&&(!text||text==='SOL-2418 · Solicitud preparada · Facultad de Diseño'))text=s.data.history.slice(-8).map(h=>`${new Date(h.at).toLocaleString('es-MX')} · ${h.action} · ${h.detail}`).join('\n')||'Aún no hay movimientos registrados.';
 }
 return <p {...props} data-original-text={typeof old==='string'?old:undefined}>{text}</p>
}
export function Action({children,record,primary=false}:{children:ReactNode;record?:string;primary?:boolean}){const s=useDesign();return <button className={primary?'action primary':'action'} onClick={e=>{e.stopPropagation();s.action(String(children),record)}}>{children}</button>}
function Table({headers,children}:{headers:string[];children:ReactNode}){return <div className="live-table-wrap"><table className="live-table"><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div>}
export function DynamicSlot({children,...props}:HTMLAttributes<HTMLDivElement>){
 const s=useDesign();const id=String(props['data-node-id']);const name=String(props['data-name']);
 let content:ReactNode=null;const query=s.query.toLowerCase();const matches=(...v:unknown[])=>v.join(' ').toLowerCase().includes(query);const badge=(v:string)=><span className={'badge '+(v==='Prestado'?'dark':v==='No disponible'?'dashed':'')}>{v}</span>;
 if(name==='catalog_results'){
  let books=s.data.books.filter(b=>matches((s.fields.Criterio==='Título'?b.title:s.fields.Criterio==='Autor'?b.author:s.fields.Criterio==='Editorial'?b.publisher:s.fields.Criterio==='Clave'?b.code:[b.title,b.author,b.code,b.publisher].join(' ')))&&(!s.filter||s.filter==='Todos'||[b.use,b.state].includes(s.filter)));
  if(s.sort==='Autor A–Z')books=[...books].sort((a,b)=>a.author.localeCompare(b.author));
  if(s.sort==='Título A–Z')books=[...books].sort((a,b)=>a.title.localeCompare(b.title));if(s.sort==='Título Z–A')books=[...books].sort((a,b)=>b.title.localeCompare(a.title));
  content=<div className="catalog-rows">{books.slice((s.page-1)*5,s.page*5).map(b=><article className="book-row" key={b.id} data-record={b.id}><div className="book-cover">LIBRO</div><div className="book-info"><button className="book-title" onClick={e=>{e.stopPropagation();s.action('Ver detalle',b.id)}}>{b.title}</button><p>{b.author}</p><small>{b.publisher}<span>{b.code}</span></small></div><div className="availability">{badge(b.state)}<small>{b.use}</small></div><Action primary record={b.id}>Ver detalle</Action></article>)}{!books.length&&<div className="empty"><h3>No se encontraron libros</h3><p>Prueba con otro título, autor o clave.</p><Action>Limpiar filtros</Action></div>}</div>;
 }else if(id==='241:3426'){
 content=<Table headers={['ID / matrícula','Nombre','Correo institucional','Rol','Estado','Acciones']}>{s.data.users.filter(u=>matches(u.id,u.name,u.email)&&(!s.filter||['Todos','Todos los roles'].includes(s.filter)||u.role===s.filter||(s.filter==='Activo'?u.active:s.filter==='Inactivo'?!u.active:true))).map(u=><tr key={u.id}><td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td>{badge(u.role)}</td><td>{u.active?'Activo':'Inactivo'}</td><td><Action record={u.id}>Editar</Action><Action record={u.id}>Roles</Action><Action record={u.id}>{u.active?'Baja':'Reactivar'}</Action></td></tr>)}</Table>;
 }else if(['247:2890','247:3115','207:1276'].includes(id)){
 content=<Table headers={['Clave','Título y autor','Ejemplares','Tipo de uso','Estado','Acciones']}>{s.data.books.filter(b=>matches(b.code,b.title,b.author)&&(!s.filter||s.filter==='Todos'||b.use===s.filter)).slice((s.page-1)*5,s.page*5).map(b=><tr key={b.id}><td>{b.code}</td><td>{b.title}<p className="muted">{b.author}</p></td><td>{b.copies}</td><td>{badge(b.use)}</td><td>{b.state==='No disponible'?'Inactivo':'Activo'}</td><td><Action record={b.id}>Editar</Action>{id==='207:1276'?<><Action record={b.id}>Etiqueta</Action><Action record={b.id}>Baja</Action></>:<><Action record={b.id}>Ejemplares</Action><Action record={b.id}>Historial</Action></>}</td></tr>)}</Table>;
 }else if(['207:1727','2081:3458'].includes(id)){
 content=<Table headers={['Folio','Libro solicitado','Solicitante','Costo estimado','Estado','Acción']}>{s.data.requests.filter(r=>matches(r.id,r.title,r.requester)&&(!s.filter||s.filter==='Todos'||r.state===s.filter)).map(r=><tr key={r.id}><td>{r.id}</td><td>{r.title}</td><td>{r.requester}</td><td>{r.cost.toFixed(2)}</td><td>{badge(r.state)}</td><td><Action record={r.id}>{s.role==='Comprador de libros'?'Revisar':'Ver historial'}</Action></td></tr>)}</Table>;
 }else if(id==='207:896'){
 content=<Table headers={['Alumno','Concepto','Fecha','Monto','Estado','Acción']}>{s.data.fines.filter(f=>matches(f.user)&&(!s.filter||['Todos','Todas'].includes(s.filter)||(s.filter==='Registrada'?f.paid:!f.paid))).map(f=><tr key={f.id}><td>{f.user}</td><td>{f.reason}</td><td>12 oct 2025</td><td>{money(f.amount)}</td><td>{badge(f.paid?'Registrada':'Pendiente')}</td><td>{!f.paid&&<Action record={f.id}>Registrar pago</Action>}</td></tr>)}</Table>;
 }else if(id==='7:559'){
 content=<Table headers={['Libro','Fecha de préstamo','Vencimiento','Renovaciones','Estado','Acción']}>{s.data.loans.filter(l=>!l.returned&&l.userId==='A01234567').map(l=><tr key={l.id}><td>{s.data.books.find(b=>b.id===l.bookId)?.title}</td><td>{l.start}</td><td>{l.due}</td><td>{l.renewals} de 2</td><td>{badge('En tiempo')}</td><td><Action record={l.id}>Solicitar renovación</Action></td></tr>)}</Table>;
 }else if(['144:2196','174:3022','192:2732'].includes(id)&&s.fields.__searched){
  if(id==='144:2196'){const users=s.data.users.filter(u=>u.active&&matches(u.name,u.id));content=<div className="search-result">{users.length?users.map(u=><div key={u.id}><h3>{u.name}</h3><p>{u.id} · {u.role} · Cuenta autorizada</p><Action primary record={u.id}>Continuar con este usuario</Action></div>):<p>No se encontró un usuario activo con esos datos.</p>}</div>}
  if(id==='174:3022'){const books=s.data.books.filter(b=>matches(b.title,b.code));content=<div className="search-result">{books.length?books.map(b=><div key={b.id}><h3>{b.title}</h3><p>{b.code} · {b.state}</p>{b.state==='Disponible'&&b.use==='Préstamo externo'?<Action primary record={b.id}>Seleccionar ejemplar</Action>:<p>Este libro no admite un préstamo externo en este momento.</p>}</div>):<p>No se encontró el libro.</p>}</div>}
  if(id==='192:2732'){const loans=s.data.loans.filter(l=>!l.returned&&matches(l.id,l.userId,s.data.books.find(b=>b.id===l.bookId)?.code));content=<div className="search-result">{loans.length?loans.map(l=><div key={l.id}><h3>{s.data.books.find(b=>b.id===l.bookId)?.title}</h3><p>{l.id} · Vencimiento: {l.due}</p><Action primary record={l.id}>Confirmar devolución</Action></div>):<p>No hay préstamos activos que coincidan.</p>}</div>}
 }
 return content!==null?<div {...props} className="dynamic-slot" style={{width:'100%',minHeight:name==='catalog_results'?647:undefined}}>{content}</div>:<div {...props}>{children}</div>
}
