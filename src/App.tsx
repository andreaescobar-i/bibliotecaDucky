import React,{useState,useEffect,useRef,Suspense,lazy} from 'react';
import manifest from './manifest.json';
import {DesignContext,DesignState,Action} from './design-controls';
import {loadData,saveData,Data,roles,addBusinessDays,money} from './model';

const modules=import.meta.glob('./screens/*.tsx');
const screens=Object.fromEntries(manifest.map(n=>[n.module,lazy(modules[`./screens/${n.module}.tsx`] as any)]));
const defaults={'Alumno':'1-336','Maestro':'1-336','Colaborador':'1-336','Bibliotecario':'7-1177','Administrador':'207-1430','Comprador de libros':'207-1669'};
const norm=(s:string)=>s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const defaultBook='2';
export default function App(){
 const [data,setData]=useState(loadData);
 const [role,setRole]=useState(()=>sessionStorage.getItem('ducky-role')||'Alumno');
 const [route,setRoute]=useState(()=>{const r=location.hash.slice(1);
    return manifest.some(n=>n.module===r&&!n.overlay)?r:'27-759'});
    
 const [overlay,setOverlay]=useState('');const [selected,setSelected]=useState(defaultBook);const [bookId,setBookId]=useState(defaultBook);const [userId,setUserId]=useState('A01234567');
 const [fields,setFields]=useState<Record<string,string>>({});const [query,setQuery]=useState('');const [filter,setFilter]=useState('');const [sort,setSort]=useState('Relevancia');const [page,setPage]=useState(1);
 const [menu,setMenu]=useState<string[]>([]);const [toast,setToast]=useState('');const [explorer,setExplorer]=useState(false);const [chat,setChat]=useState<{who:string;text:string}[]>([]);const [revision,setRevision]=useState(0);
 const root=useRef<HTMLDivElement>(null);const modal=useRef<HTMLDivElement>(null);const lastFocus=useRef<HTMLElement>(null);const timer=useRef<ReturnType<typeof setTimeout>>(null);
 const book=data.books.find(b=>b.id===bookId)||data.books[0];
 useEffect(()=>{saveData(data)},[data]);
 useEffect(()=>{const onHash=()=>{const r=location.hash.slice(1);if(manifest.some(n=>n.module===r&&!n.overlay)){setRoute(r);setOverlay('');setFields({});setQuery('');setFilter('');setPage(1)}};addEventListener('hashchange',onHash);return()=>removeEventListener('hashchange',onHash)},[]);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[]);
 function notify(text:string){setToast(text);if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>setToast(''),5000)}
 function go(id:string){setRoute(id);location.hash=id;setOverlay('');setFields({});setQuery('');setFilter('');setPage(1);setMenu([]);window.scrollTo({top:0,behavior:'instant'})}
 function open(id:string,record?:string){lastFocus.current=document.activeElement as HTMLElement;if(record)setSelected(record);setOverlay(id);setFields({});setMenu([]);setRevision(v=>v+1)}
 function close(){setOverlay('');setFields({});setMenu([]);setTimeout(()=>lastFocus.current?.focus(),0)}
 function update(actionName:string,detail:string,change:(d:Data)=>void){setData(prev=>{const d=structuredClone(prev);change(d);d.history.push({at:new Date().toISOString(),action:actionName,detail});return d});notify(actionName)}
 const field=(label:string,value:string)=>{setFields(f=>({...f,[label]:value}));if(['207-1669','2081-3418'].includes(route)&&!overlay){if(/Buscar/.test(label)){setQuery(value);setPage(1)}if(label==='Estado')setFilter(value)}};
 function input(...names:string[]){for(const name of names){if(fields[name]!==undefined)return fields[name];const scope=overlay?modal.current:root.current;const element=scope?.querySelector<HTMLInputElement|HTMLSelectElement>('[aria-label="'+CSS.escape(name)+'"]');if(element?.value!==undefined)return element.value}return ''}
 function download(name:string,body:string,type='text/csv;charset=utf-8'){const url=URL.createObjectURL(new Blob(['\ufeff'+body],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
 function filterResults(){const label=Object.keys(fields).find(k=>/buscar|matrícula o nombre|folio|título|clave|nombre/i.test(k)&&!k.startsWith('__'));setQuery(label?fields[label]:'');setFilter(input('Estado','Tipo de uso','Rol','Tema','Programa'));setPage(1);setFields(f=>({...f,__searched:'1'}));notify('Búsqueda actualizada')}
 function action(label:string,record?:string){
  const a=norm(label);if(record){setSelected(record);if(data.books.some(b=>b.id===record))setBookId(record)}
  const current=record||selected;const userRoles=roles.slice(0,3);const isStaff=['Bibliotecario','Administrador'].includes(role);
  if(a==='cerrar sesion'||a==='volver al inicio de sesion'){sessionStorage.removeItem('ducky-role');go('27-759');return}
  if(a==='ingresar'){
   const user=input('Usuario');const password=input('Contraseña');const chosen=input('Rol')||'Alumno';if(!user||!password){notify('Escribe tu usuario y contraseña para probar el acceso.');return}
   setRole(chosen);sessionStorage.setItem('ducky-role',chosen);go(defaults[chosen]);return;
  }
  if(a.includes('olvidaste')){open('211-1295');return}
  if(a==='continuar'&&overlay==='211-1295'){if(!Object.values(fields).some(Boolean)){notify('Escribe tu usuario institucional.');return}close();notify('Solicitud simulada: contacta a la biblioteca para recuperar el acceso.');return}
  if(['cerrar','cancelar','entendido','volver'].includes(a)){close();return}
  if(a==='catalogo'||a==='buscar libros'||a==='ver en catalogo'||a==='volver al catalogo'){go(role==='Bibliotecario'?'272-2449':'1-336');return}
  if(a==='mi cuenta'){go('7-439');return}
  if(a==='prestamos'){if(isStaff)go('7-1177');else go('7-439');return}
  const routes={'devolucion':'182-908','renovacion':'207-712','renovaciones':'207-712','multas y pagos':'207-849','suspendidos':'207-1046','gestion de libros':role==='Administrador'?'247-2861':'247-3086','reportes':'207-1430','usuarios':'241-3397','gestion de usuarios':'241-3397','gestion de catalogo':'207-1228','catalogo administrativo':'207-1228','perfiles':'371-1836','gestion de perfiles':'371-1836','solicitudes de libros':'2081-3418','compras':'207-1669','compras y adquisiciones':'207-1669'};
  if(routes[a]){if(userRoles.includes(role)&&!['renovaciones'].includes(a)){notify('Esta opción corresponde a un rol de gestión. Cambia de rol desde el explorador.');return}go(routes[a]);return}
  if(a.startsWith('libros')){setMenu(['Catálogo','Gestión de catálogo','Gestión de libros']);return}
  if(a.startsWith('administracion')){setMenu(['Usuarios','Perfiles','Solicitudes de libros']);return}
  if(a.startsWith('operaciones')){setMenu(['Préstamos','Devolución','Renovación','Multas y pagos','Suspendidos']);return}
  if(a==='mi perfil'||/^(mariana lopez|alfonso chapa|ernesto diaz|luisa palacios)$/.test(a)){open('312-1701');return}
  if(a==='mi rol'){open('211-941');return}
  if(a==='roles'){open('283-1681',current);return}
  if(roles.some(r=>norm(r)===a)){
   const chosen=roles.find(r=>norm(r)===a)!;
   if(overlay==='283-1681'){update('Rol actualizado',current,d=>{const u=d.users.find(u=>u.id===current);if(u)u.role=chosen});close()}
   else{setRole(chosen);sessionStorage.setItem('ducky-role',chosen);go(defaults[chosen])}return;
  }
  if(a==='ver detalle'){setBookId(current);go('6-26');return}
  if(a==='ver pdf'||a.includes('visualizar pdf')){open('2196-2026');return}
  if(a==='mandar a imprimir'||a==='imprimir libro'){open('2196-2044');return}
  if(['1','2','3'].includes(a)&&overlay==='2196-2044'){field('Copias',a);notify(`${a} copia(s) seleccionadas`);return}
  if(a==='imprimir'){window.print();open('2196-2076');return}
  if(a.includes('imprimir recibo')||a.includes('imprimir etiqueta')){window.print();return}
  if(a==='buscar'||a==='filtrar'||a==='aplicar filtros'||a==='buscar usuario'||a==='buscar libro'||a==='buscar prestamo'){filterResults();return}
  if(a==='limpiar filtros'){setFields({});setQuery('');setFilter('');setPage(1);setRevision(v=>v+1);return}
  if(a==='relevancia'||a==='ordenar'){setMenu(['Relevancia original','Título A–Z','Autor A–Z','Título Z–A']);return}
  if(['relevancia original','titulo a–z','autor a–z','titulo z–a'].includes(a)){setSort(label==='Relevancia original'?'Relevancia':label);setMenu([]);return}
  if(a==='siguiente'||a==='anterior'){const max=Math.max(1,Math.ceil(data.books.length/5));setPage(p=>Math.max(1,Math.min(max,p+(a==='siguiente'?1:-1))));return}
  if(a==='continuar con este usuario'){setUserId(current);go('162-2206');return}
  if(a==='seleccionar ejemplar'){setBookId(current);go('174-3080');return}
  if(a.includes('confirmar y generar recibo')){
   if(!isStaff){notify('Se requiere un rol de gestión.');return}
   const u=data.users.find(u=>u.id===userId);if(!u?.active||book.state!=='Disponible'){notify('Revisa que el usuario esté activo y el libro disponible.');return}
   if(data.loans.filter(l=>l.userId===userId&&!l.returned).length>=2){notify('Este usuario alcanzó el límite de 2 ejemplares.');return}
   const id=`PRE-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;update('Préstamo registrado',`${id} · ${book.title}`,d=>{d.loans.push({id,bookId:book.id,userId,start:new Date().toISOString().slice(0,10),due:addBusinessDays(u.role==='Maestro'?10:5),renewals:0,returned:false});d.books.find(b=>b.id===book.id)!.state='Prestado'});setSelected(id);go('182-571');return;
  }
  if(a==='regresar'){go('162-2206');return}
  if(a==='registrar otro prestamo'){go('7-1177');return}
  if(a==='confirmar devolucion'){update('Devolución registrada',current,d=>{const l=d.loans.find(l=>l.id===current);if(l){l.returned=true;d.books.find(b=>b.id===l.bookId)!.state='Disponible'}});setFields({});return}
  if(a==='solicitar renovacion'){
   const loan=data.loans.find(l=>l.id===current);if(!loan||loan.renewals>=2){notify('Se alcanzó el máximo de 2 renovaciones.');return}setSelected(current);notify('Solicitud de renovación registrada para validación del bibliotecario.');update('Renovación solicitada',current,()=>{});return;
  }
  if(a==='consultar'){const folio=input('Folio de préstamo');const l=data.loans.find(l=>l.id===(folio||'PRE-2025-1654')&&!l.returned);if(l){setSelected(l.id);notify(`Préstamo encontrado: ${l.id}`)}else notify('No se encontró un préstamo activo con ese folio.');return}
  if(a==='autorizar renovacion'){
   const loan=data.loans.find(l=>l.id===(selected.startsWith('PRE-')?selected:'PRE-2025-1654'));
   if(!loan||loan.returned||loan.renewals>=2){notify('El préstamo no cumple las condiciones para renovar.');return}
   update('Renovación autorizada',loan.id,d=>{const l=d.loans.find(l=>l.id===loan.id)!;l.renewals++;l.due=addBusinessDays(5,new Date(l.due+'T12:00:00'))});return;
  }
  if(a==='registrar pago'&&overlay!=='211-962'){open('211-962',current);return}
  if(a==='registrar pago'){
   const fine=data.fines.find(f=>f.id===current);if(fine&&Number(input('Monto pagado (MXN)'))<fine.amount){notify('El monto debe cubrir el adeudo registrado.');return}
   if(!input('Folio del comprobante')){notify('Ingresa el folio del comprobante.');return}
   update('Pago registrado',current,d=>{const f=d.fines.find(f=>f.id===current);if(f)f.paid=true});close();return;
  }
  if(a==='reportar libro perdido'){open('211-1005');return}
  if(a==='registrar y notificar'){const usd=Number(input('Precio última compra (USD)')||68),rate=Number(input('Tipo de cambio (MXN por USD)')||17.85);update('Reposición registrada',book.title,d=>{d.books.find(b=>b.id===bookId)!.state='No disponible';d.fines.push({id:`F${Date.now()}`,user:'Mariana López',amount:usd*rate,reason:'Reposición por libro perdido',paid:false})});close();notify('Reposición guardada. El aviso queda simulado en el historial.');return}
  if(a==='generar lista'){open('211-1194');return}
  if(a==='notificar a servicios escolares'){update('Aviso preparado','Lista de alumnos suspendidos',()=>{});notify('Aviso preparado en el historial; no se envió a un servicio externo.');return}
  if(a==='exportar reporte'||a==='ver reporte completo'){download('reporte-ducky.csv','Clave,Título,Autor,Estado,Ejemplares\n'+data.books.map(b=>[b.code,b.title,b.author,b.state,b.copies].map(x=>'"'+String(x).replaceAll('"','""')+'"').join(',')).join('\n'));return}
  if(a.includes('alta de usuario')){open('241-3699','new');return}
  if(a==='editar'){open(route==='241-3397'?'241-3699':'211-1034',current);return}
  if(a.includes('agregar libro')||a==='alta de ficha bibliografica'){open('211-1034','new');return}
  if(a==='guardar usuario'){
   const old=data.users.find(u=>u.id===current);const name=input('Nombre completo')||old?.name;const id=input('ID o matrícula')||old?.id;const email=input('Correo institucional')||old?.email;
   if(!name||!id||!email||!email.includes('@')){notify('Completa nombre, matrícula y un correo válido.');return}
   if(current==='new'&&data.users.some(u=>u.id===id)){notify('Ya existe un usuario con esa matrícula.');return}
   update('Usuario guardado',name,d=>{const u={id,name,email,role:input('Rol asignado')||old?.role||'Alumno',active:old?.active??true};const index=d.users.findIndex(v=>v.id===current);if(index>=0)d.users[index]=u;else d.users.push(u)});close();return;
  }
  if(a==='reactivar'){update('Usuario reactivado',current,d=>{const u=d.users.find(u=>u.id===current);if(u)u.active=true});return}
  if(a==='baja'){open(route==='241-3397'?'241-3795':overlay==='247-3458'?'247-3658':'211-1149',current);return}
  if(a==='dar de baja libro completo'){open('2114-2308');return}
  if(a==='confirmar baja'){
   if(overlay==='241-3795')update('Usuario dado de baja',current,d=>{const u=d.users.find(u=>u.id===current);if(u)u.active=false});
   else update('Baja registrada',book.title,d=>{const b=d.books.find(b=>b.id===bookId)!;b.state='No disponible';b.copies=overlay==='2114-2308'?0:Math.max(0,b.copies-1)});close();return;
  }
  if(a==='guardar borrador'||a==='guardar y generar etiqueta'){
   const title=input('Título')||(current!=='new'?book.title:'');const author=input('Autor')||(current!=='new'?book.author:'');const code=input('Clave')||(current!=='new'?book.code:'');if(!title||!author||!code){notify('Completa título, autor y clave.');return}
   const nextId=current==='new'?`B${Date.now()}`:bookId;update('Ficha bibliográfica guardada',title,d=>{const b={...book,id:nextId,title,author,code,publisher:input('Editorial')||book.publisher,isbn:input('ISBN')||'No registrado',description:input('Descripción del libro')||book.description,location:input('Ubicación')||book.location,copies:Number(input('Ejemplares que se reciben')||book.copies),use:input('Tipo de uso')||book.use,state:'Disponible'};const i=d.books.findIndex(b=>b.id===nextId);if(i>=0)d.books[i]=b;else d.books.push(b)});setBookId(nextId);if(a==='guardar y generar etiqueta')open('211-1135');else close();return;
  }
  if(a==='etiqueta'){if(record)setBookId(record);open(overlay==='247-3458'?'247-3645':'211-1135');return}
  if(a==='ejemplares'){open('247-3458',current);return}
  if(a==='clasificar'){open('247-3593',current);return}
  if(a==='guardar clasificacion'){update('Clasificación guardada',book.title,d=>{const b=d.books.find(b=>b.id===bookId)!;b.location=input('Ubicación / estante')||b.location;b.code=input('Clave')||b.code;b.use=input('Tipo de uso')||b.use});open('247-3458');return}
  if(a==='historial'){open('247-3679');return}
  if(a.includes('nueva peticion')||a.includes('solicitar libro')){open('211-1204','new');return}
  if(a==='registrar peticion'){
   const title=input('Título solicitado'),requester=input('Solicitante o facultad'),cost=Number(input('Costo total estimado del lote (MXN)'));if(!title||!requester||!cost||cost<=0){notify('Completa título, solicitante y un costo mayor a cero.');return}
   update('Petición registrada',title,d=>{d.requests.push({id:`SOL-${Date.now().toString().slice(-6)}`,title,requester,cost,quantity:Number(input('Cantidad de ejemplares solicitados')||1),state:'Por autorizar',received:0})});close();return;
  }
  if(a==='revisar'){open('2081-2172',current);return}
  if(a==='consultar autorizacion'){update('Autorización de Tesorería simulada',current,d=>{const r=d.requests.find(r=>r.id===current);if(r)r.state='Autorizado'});return}
  if(a==='confirmar revision'){update('Revisión confirmada',current,d=>{const r=d.requests.find(r=>r.id===current);if(r)r.state='En Tesorería'});notify('Solicitud remitida a Tesorería en esta demostración.');return}
  if(a==='registrar recepcion'){if(overlay!=='211-1260'){open('211-1260');return}const r=data.requests.find(r=>r.id===current);const quantity=Number(input('Cantidad recibida')||1);if(!r||quantity<1||quantity>r.quantity){notify('La recepción debe corresponder a la cantidad solicitada.');return}update('Recepción registrada',current,d=>{const r=d.requests.find(r=>r.id===current)!;r.received=quantity;r.state='Recibido'});open('2081-2189');return}
  if(a==='confirmar entrega a catalogo'){const r=data.requests.find(r=>r.id===current);if(!r||!r.received){notify('Registra la recepción del lote antes de entregarlo.');return}update('Entrega al catálogo registrada',current,d=>{d.requests.find(r=>r.id===current)!.state='Entregado al catálogo'});close();return}
  if(a==='enviados al catalogo'||a==='recibidos de compras'){open('2189-2119');return}
  if(a==='historial de adquisiciones'||a==='ver historial'){open('2081-2208',current);return}
  if(a==='actualizar lista de solicitudes'){notify('Lista actualizada con los datos guardados en este navegador.');setRevision(v=>v+1);return}
  if(a==='autorizar'||a==='rechazar'){update(a==='autorizar'?'Petición autorizada':'Solicitud rechazada',current,d=>{const r=d.requests.find(r=>r.id===current);if(r)r.state=a==='autorizar'?'Autorizado':'Rechazado'});close();return}
  if(a==='confirmar desactivacion'){open('373-1912');return}
  if(a==='enviar'){
   const q=input('Escribe tu pregunta')||Object.values(fields)[0];if(!q?.trim())return;
   const t=norm(q);const reply=t.includes('renov')?'Puedes solicitar hasta 2 renovaciones desde Mi cuenta. El bibliotecario valida la cuenta y el préstamo.':t.includes('multa')?'Consulta tus adeudos en Mi cuenta. Los comprobantes se pagan en Tesorería y el bibliotecario registra el pago.':t.includes('libro')?'Busca un título, autor o clave en el catálogo. Ver detalle muestra la ficha y disponibilidad.':'Puedo orientarte sobre catálogo, préstamos, renovaciones, multas y tu perfil. Este asistente usa respuestas locales de demostración.';setChat(c=>[...c,{who:'Tú',text:q},{who:'Ducky',text:reply}]);setFields({});return;
  }
  if(a==='reiniciar'){setChat([]);setRevision(v=>v+1);return}
  if(a.includes('dias habiles')){notify('Alumno y colaborador: 5 días hábiles. Maestro: 10. Máximo 2 renovaciones.');return}
  notify('Selecciona una opción del menú para continuar.');
 }
 useEffect(()=>{
  if(!overlay)return;const previous=document.activeElement as HTMLElement;const node=modal.current;const controls=()=>Array.from(node?.querySelectorAll<HTMLElement>('button,input,select,textarea,a,[tabindex="0"]')||[]).filter(e=>!e.hasAttribute('disabled'));setTimeout(()=>controls()[0]?.focus(),0);
  const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape'){close();return}if(e.key==='Tab'){const list=controls(),first=list[0],last=list.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}};document.addEventListener('keydown',onKey);return()=>{document.removeEventListener('keydown',onKey);previous?.focus()};
 },[overlay,revision]);
 useEffect(()=>{root.current?.querySelectorAll<HTMLElement>('[id^="node-27_"],[data-name="nav"],a:not([href]),[data-name="Buttons"]').forEach(e=>{if(!e.closest('button')&&!e.querySelector('button')){e.tabIndex=0;e.setAttribute('role','button')}})},[route,overlay,revision]);
 function delegate(e:React.MouseEvent|React.KeyboardEvent){
  if(e.type==='keydown'&&!['Enter',' '].includes((e as React.KeyboardEvent).key))return;const target=e.target as HTMLElement;if(!target.closest('.screen-canvas,.modal-window')||target.closest('input,select,textarea,.action,.modal-close'))return;
  const control=target.closest<HTMLElement>('[id^="node-27_"],[data-name="nav"],[data-name="Buttons"],button,a,[data-name="Sort-btn"]');if(!control||!root.current?.contains(control))return;
  const text=control.innerText?.trim();if(text&&text.length<150){e.preventDefault();action(text,control.closest<HTMLElement>('[data-record]')?.dataset.record)}
 }
 const ctx:DesignState={data,role,userId,route,overlay,book,selected,query,filter,sort,page,fields,action,field};
 const Screen=screens[route]||screens['27-759'];const Overlay=screens[overlay];const selectedRequest=data.requests.find(r=>r.id===selected);
 return <DesignContext.Provider value={ctx}><div ref={root} onClick={delegate} onKeyDown={delegate}>
 <div className="screen-canvas" key={route+'-'+revision} inert={overlay?true:undefined}><Suspense fallback={<p className="loading">Cargando biblioteca…</p>}><Screen/></Suspense></div>
 {menu.length>0&&<div className="quick-menu">{menu.map(m=><button key={m} onClick={()=>action(m)}>{m}</button>)}<button onClick={()=>setMenu([])}>Cerrar menú</button></div>}
 {Overlay&&<div className="modal-shade" onClick={e=>{if(e.target===e.currentTarget)close()}}><div ref={modal} role="dialog" aria-modal="true" aria-label={manifest.find(n=>n.module===overlay)?.name} className="modal-window" style={{width:(manifest.find(n=>n.module===overlay) as any)?.width||640}} key={overlay+'-'+revision}><button className="modal-close" aria-label="Cerrar ventana" onClick={close}>×</button><Suspense fallback={<p>Cargando…</p>}><Overlay/></Suspense>
 {overlay==='2081-2172'&&selectedRequest&&<div className="modal-extra"><p>{selectedRequest.id} · {selectedRequest.title} · {selectedRequest.state}</p>{selectedRequest.state==='En Tesorería'&&<Action primary>Consultar autorización</Action>}{selectedRequest.state==='Autorizado'&&<Action primary>Registrar recepción</Action>}{selectedRequest.state==='Recibido'&&<button className="action primary" onClick={()=>open('2081-2189')}>Entregar al catálogo</button>}</div>}
 {overlay==='2189-2119'&&data.requests.filter(r=>r.state==='Entregado al catálogo').map(r=><p className="modal-extra" key={r.id}>{r.id} · {r.title} · {r.received} ejemplar(es) entregados</p>)}
 {overlay==='321-2162'&&chat.length>0&&<div className="chat-messages" aria-live="polite">{chat.map((m,i)=><p key={i}><strong>{m.who}:</strong> {m.text}</p>)}</div>}
 </div></div>}
 <div className="prototype-tools"><button onClick={()=>setExplorer(v=>!v)}>Explorar prototipo</button>{route!=='27-759'&&<button onClick={()=>open('321-2162')}>Asistente Ducky</button>}</div>
 {explorer&&<aside className="explorer" aria-label="Explorador del prototipo"><header><strong>Biblioteca Ducky · Prototipo React</strong><button aria-label="Cerrar explorador" onClick={()=>setExplorer(false)}>×</button></header><p>Datos de demostración guardados en este navegador.</p><label>Rol de acceso<select aria-label="Rol de acceso" value={role} onChange={e=>{setRole(e.target.value);sessionStorage.setItem('ducky-role',e.target.value);go(defaults[e.target.value])}}>{roles.map(r=><option key={r}>{r}</option>)}</select></label><div className="explorer-links">{manifest.filter(n=>!n.overlay).map(n=><button key={n.module} onClick={()=>{go(n.module);setExplorer(false)}}>{n.name}</button>)}</div><details><summary>Ventanas del prototipo</summary>{manifest.filter(n=>n.overlay).map(n=><button key={n.module} onClick={()=>{open(n.module);setExplorer(false)}}>{n.name}</button>)}</details><button onClick={()=>{if(confirm('¿Restablecer los datos de demostración?')){localStorage.removeItem('ducky-data-v1');setData(loadData());notify('Datos restablecidos')}}}>Restablecer demostración</button></aside>}
 {toast&&<div role="status" className="toast">{toast}<button aria-label="Cerrar aviso" onClick={()=>setToast('')}>×</button></div>}
 </div></DesignContext.Provider>
}
