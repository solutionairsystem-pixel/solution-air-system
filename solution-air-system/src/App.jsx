import { useState } from "react";

const LOGO = "data:image/jpeg;base64,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";

// ── HELPERS ──────────────────────────────────────────────
const useShared = (key, init) => {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; }
  });
  const set = (v) => { const n = typeof v==="function"?v(val):v; setVal(n); try{localStorage.setItem(key,JSON.stringify(n));}catch{} };
  return [val, set];
};

const MESES = ["","Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const fmt   = (iso) => { if(!iso) return "—"; const [,m,d]=iso.split("-"); return d+" "+MESES[+m]; };
const days  = (f)   => f ? Math.ceil((new Date(f+"T00:00:00")-new Date())/86400000) : null;
let _n = Date.now(); const uid = () => String(++_n);

// ── SEED DATA ─────────────────────────────────────────────
const CLIENTES0 = [
  { id:"c1", nombre:"Carlos Mendoza", email:"carlos@email.com", password:"1234", telefono:"5512345678", avatar:"CM",
    residencias:[{ id:"r1", nombre:"Casa principal", direccion:"Calle Roble 45, Col. Jardines", lat:null, lng:null, equipos:"Minisplit 1.5 ton LG" }] },
  { id:"c2", nombre:"Ana Rodriguez",  email:"ana@email.com",    password:"1234", telefono:"5598765432", avatar:"AR",
    residencias:[{ id:"r2", nombre:"Casa principal", direccion:"Av. Pinos 12, Col. Las Flores",  lat:null, lng:null, equipos:"Minisplit 2 ton Carrier" }] },
];
const HISTORIAL0 = [
  { id:"h1", cid:"c1", fecha:"2024-11-15", tipo:"Mantenimiento preventivo", tecnico:"Roberto Garcia", equipo:"Minisplit 1.5 ton LG",    desc:"Limpieza de filtros, revision de gas, lubricacion de motor." },
  { id:"h2", cid:"c1", fecha:"2024-08-03", tipo:"Reparacion",               tecnico:"Miguel Torres",  equipo:"Minisplit 1.5 ton LG",    desc:"Cambio de capacitor del compresor. Funcionando al 100%." },
  { id:"h3", cid:"c2", fecha:"2025-01-10", tipo:"Mantenimiento preventivo", tecnico:"Miguel Torres",  equipo:"Minisplit 2 ton Carrier", desc:"Limpieza profunda, carga de gas al 100%." },
];
const CITAS0 = [
  { id:"ci1", cid:"c1", nombre:"Carlos Mendoza", tel:"5512345678", fecha:"2025-08-10", hora:"10:00", tipo:"Mantenimiento preventivo", residencia:"Casa principal", direccion:"Calle Roble 45, Col. Jardines", lat:null, lng:null, notas:"", status:"Confirmada", nota:"" },
  { id:"ci2", cid:"c2", nombre:"Ana Rodriguez",  tel:"5598765432", fecha:"2025-07-22", hora:"09:00", tipo:"Revision general",          residencia:"Casa principal", direccion:"Av. Pinos 12, Col. Las Flores",  lat:null, lng:null, notas:"El equipo hace ruido.", status:"Pendiente de confirmacion", nota:"" },
];
const MANT0   = [{ cid:"c1", fecha:"2025-08-10" },{ cid:"c2", fecha:"2025-09-15" }];
const TWILIO0 = { sid:"", token:"", from:"", secTel:"", ok:false };
const OFERTAS = [
  { id:"o1", titulo:"Mantenimiento de Verano", badge:"20% OFF",  desc:"Limpieza profunda + revision de gas incluida.",    vig:"Valido hasta 30 Jun 2025", grad:"linear-gradient(135deg,#f97316,#ea580c)", icon:"☀️" },
  { id:"o2", titulo:"Plan Anual 3x2",           badge:"3 x 2",   desc:"Contrata 3 mantenimientos y el tercero es gratis.", vig:"Oferta permanente",         grad:"linear-gradient(135deg,#0ea5e9,#0284c7)", icon:"📋" },
  { id:"o3", titulo:"Programa de Referidos",    badge:"$300 OFF", desc:"Recomienda a un amigo y ambos obtienen $300.",     vig:"Sin fecha limite",          grad:"linear-gradient(135deg,#10b981,#059669)", icon:"🎁" },
];
const HORAS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];
const TIPOS  = ["Mantenimiento preventivo","Revision general","Limpieza de filtros","Recarga de gas","Reparacion","Instalacion nueva"];

const SC = {
  "Confirmada":               {bg:"#dcfce7",color:"#15803d"},
  "Pendiente de confirmacion":{bg:"#fef9c3",color:"#a16207"},
  "Reagendada":               {bg:"#dbeafe",color:"#1d4ed8"},
  "Cancelada":                {bg:"#fee2e2",color:"#b91c1c"},
};
const Pill = ({s}) => { const st=SC[s]||{bg:"#f1f5f9",color:"#64748b"}; return <span style={{display:"inline-block",padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:600,background:st.bg,color:st.color}}>{s}</span>; };

const sendWA = async (tw,to,msg) => {
  if(!tw.ok) return {ok:false};
  try {
    const r = await fetch("https://api.twilio.com/2010-04-01/Accounts/"+tw.sid+"/Messages.json",{
      method:"POST", headers:{"Authorization":"Basic "+btoa(tw.sid+":"+tw.token),"Content-Type":"application/x-www-form-urlencoded"},
      body:new URLSearchParams({From:"whatsapp:+"+tw.from.replace(/\D/g,""),To:"whatsapp:+"+to.replace(/\D/g,""),Body:msg}),
    });
    const d=await r.json(); return r.ok?{ok:true}:{ok:false};
  } catch{return {ok:false};}
};

const waMsg = {
  confirmada: (c) => "Hola "+c.nombre.split(" ")[0]+", tu cita de "+c.tipo+" fue CONFIRMADA para el "+fmt(c.fecha)+" a las "+c.hora+". Direccion: "+c.direccion+". Solution Air System",
  reagendada: (c) => "Hola "+c.nombre.split(" ")[0]+", tu cita fue REAGENDADA para el "+fmt(c.fecha)+" a las "+c.hora+". Solution Air System",
  cancelada:  (c) => "Hola "+c.nombre.split(" ")[0]+", tu cita del "+fmt(c.fecha)+" fue cancelada. Solution Air System",
  solicitud:  (c) => "Hola "+c.nombre.split(" ")[0]+", recibimos tu solicitud: "+c.tipo+" el "+fmt(c.fecha)+" a las "+c.hora+" en "+c.residencia+". Te confirmamos pronto. Solution Air System",
  secretaria: (c) => "Nueva cita: "+c.nombre+" - "+c.tipo+" - "+fmt(c.fecha)+" "+c.hora+" - "+c.residencia+": "+c.direccion,
};

const LogoImg = ({w}) => <img src={LOGO} alt="SAS" style={{width:w||160,display:"block",margin:"0 auto"}}/>;

// ═══════════════════════════════════════════════════════════
//  ROOT
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [clientes,  setClientes]  = useShared("sas3_cli",   CLIENTES0);
  const [historial, setHistorial] = useShared("sas3_hist",  HISTORIAL0);
  const [citas,     setCitas]     = useShared("sas3_citas", CITAS0);
  const [mant,      setMant]      = useShared("sas3_mant",  MANT0);
  const [twilio,    setTwilio]    = useShared("sas3_tw",    TWILIO0);
  const [mode, setMode] = useState("select");
  const shared = {clientes,setClientes,historial,setHistorial,citas,setCitas,mant,setMant,twilio,setTwilio};

  const css = `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}`;

  if (mode==="select") return (
    <div style={{fontFamily:"Outfit,sans-serif",minHeight:"100vh",background:"linear-gradient(160deg,#f0f9ff,#e0f2fe 60%,#f8fafc)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:28,gap:22}}>
      <style>{css}</style>
      <div style={{background:"#fff",borderRadius:24,padding:"28px 32px",boxShadow:"0 4px 24px rgba(0,0,0,.08)",textAlign:"center",width:"100%",maxWidth:340}}>
        <LogoImg w={180}/>
        <div style={{fontSize:13,color:"#64748b",marginTop:14,marginBottom:22}}>Selecciona como deseas entrar</div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[
            {label:"Secretaria / CRM",  sub:"Gestion interna del negocio",icon:"🖥️",bg:"linear-gradient(135deg,#1d6fa4,#0284c7)",action:()=>setMode("crm")},
            {label:"Portal del Cliente",sub:"Agenda citas y tu historial", icon:"📱",bg:"linear-gradient(135deg,#0ea5e9,#0284c7)",action:()=>setMode("portal")},
          ].map(b=>(
            <button key={b.label} onClick={b.action} style={{background:b.bg,color:"#fff",padding:"16px 20px",fontSize:15,borderRadius:16,textAlign:"left",display:"flex",alignItems:"center",gap:14,border:"none",cursor:"pointer",boxShadow:"0 4px 14px rgba(0,0,0,.1)"}}>
              <div style={{width:44,height:44,borderRadius:12,background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{b.icon}</div>
              <div><div style={{fontWeight:700}}>{b.label}</div><div style={{fontSize:12,opacity:.8,marginTop:2}}>{b.sub}</div></div>
            </button>
          ))}
        </div>
        <div style={{fontSize:11,color:"#cbd5e1",marginTop:16}}>Datos sincronizados en tiempo real</div>
      </div>
    </div>
  );
  if (mode==="crm")    return <CRM    {...shared} onBack={()=>setMode("select")}/>;
  if (mode==="portal") return <Portal {...shared} onBack={()=>setMode("select")}/>;
}

// ═══════════════════════════════════════════════════════════
//  CRM
// ═══════════════════════════════════════════════════════════
function CRM({clientes,historial,citas,setCitas,mant,twilio,setTwilio,onBack}) {
  const [tab,setTab]       = useState("citas");
  const [modal,setModal]   = useState(null);
  const [form,setForm]     = useState({});
  const [search,setSearch] = useState("");
  const [toast,setToast]   = useState(null);
  const [twf,setTwf]       = useState({...twilio});

  const pendientes = citas.filter(c=>c.status==="Pendiente de confirmacion");
  const showToast  = (msg,type)=>{setToast({msg,type});setTimeout(()=>setToast(null),4000);};

  const notify = async (cita,tipo) => {
    const msg = tipo==="confirmada"?waMsg.confirmada(cita):tipo==="reagendada"?waMsg.reagendada(cita):waMsg.cancelada(cita);
    const r = await sendWA(twilio,cita.tel,msg);
    if(twilio.secTel) await sendWA(twilio,twilio.secTel,"Cita de "+cita.nombre+" -> "+tipo);
    showToast(r.ok?"WhatsApp enviado":"Cita actualizada",r.ok?"ok":"warn");
  };
  const confirmar = async (id,nota,nf,nh) => {
    const rea=!!(nf||nh);
    const upd=citas.map(c=>c.id===id?{...c,status:rea?"Reagendada":"Confirmada",nota:nota||"",fecha:nf||c.fecha,hora:nh||c.hora}:c);
    setCitas(upd); await notify(upd.find(c=>c.id===id),rea?"reagendada":"confirmada"); setModal(null); setForm({});
  };
  const rechazar = async (id,nota) => {
    const upd=citas.map(c=>c.id===id?{...c,status:"Cancelada",nota:nota||""}:c);
    setCitas(upd); await notify(upd.find(c=>c.id===id),"cancelada"); setModal(null); setForm({});
  };
  const saveTw = () => {
    const t={...twf,ok:!!(twf.sid&&twf.token&&twf.from)};
    setTwilio(t); showToast(t.ok?"Twilio configurado":"Completa todos los campos",t.ok?"ok":"warn");
  };
  const filter = (arr) => search?arr.filter(i=>JSON.stringify(i).toLowerCase().includes(search.toLowerCase())):arr;
  const Nav = ({id,icon,label,badge}) => (
    <div onClick={()=>setTab(id)} style={{cursor:"pointer",padding:"9px 14px",borderRadius:8,display:"flex",alignItems:"center",gap:10,fontSize:14,fontWeight:500,background:tab===id?"#eff6ff":"transparent",color:tab===id?"#1d6fa4":"#64748b"}}>
      <span>{icon}</span><span style={{flex:1}}>{label}</span>
      {badge>0&&<span style={{background:"#ef4444",color:"#fff",borderRadius:10,fontSize:11,padding:"1px 7px",fontWeight:700}}>{badge}</span>}
    </div>
  );

  return (
    <div style={{fontFamily:"Outfit,sans-serif",background:"#f8fafc",minHeight:"100vh",color:"#1e293b",display:"flex"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}input,select,textarea{background:#f8fafc;border:1px solid #e2e8f0;color:#1e293b;padding:10px 14px;border-radius:8px;font-family:Outfit,sans-serif;font-size:14px;width:100%;outline:none;transition:border .2s}input:focus,select:focus,textarea:focus{border-color:#1d6fa4}select option{background:#fff}.cb{cursor:pointer;border:none;border-radius:9px;padding:9px 16px;font-family:Outfit,sans-serif;font-size:14px;font-weight:600;transition:all .2s}.cb:hover{opacity:.88}.cc{background:#fff;border:1px solid #e2e8f0;border-radius:14px;box-shadow:0 1px 6px rgba(0,0,0,.06)}.ov{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px}.mo{background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:26px;width:520px;max-width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 8px 32px rgba(0,0,0,.12)}table{width:100%;border-collapse:collapse}th{text-align:left;padding:10px 14px;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#94a3b8;border-bottom:1px solid #f1f5f9;font-weight:600;background:#f8fafc}td{padding:11px 14px;font-size:14px;border-bottom:1px solid #f1f5f9;vertical-align:middle}tr:hover td{background:#f8fafc}.fade{animation:fi .3s ease both}@keyframes fi{from{opacity:0}to{opacity:1}}label{font-size:12px;color:#64748b;display:block;margin-bottom:4px;font-weight:500}.fl{display:flex;flex-direction:column;gap:4px}.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px}`}</style>

      {toast&&<div className="fade" style={{position:"fixed",top:20,right:20,zIndex:200,background:toast.type==="ok"?"#f0fdf4":"#fefce8",border:"1px solid "+(toast.type==="ok"?"#bbf7d0":"#fde68a"),borderRadius:14,padding:"14px 18px",fontSize:14,fontWeight:600,color:toast.type==="ok"?"#15803d":"#a16207",boxShadow:"0 4px 16px rgba(0,0,0,.1)"}}>{toast.msg}</div>}

      <div style={{width:230,borderRight:"1px solid #e2e8f0",padding:"18px 10px",display:"flex",flexDirection:"column",gap:3,flexShrink:0,background:"#fff"}}>
        <div style={{padding:"12px 8px 16px",borderBottom:"1px solid #e2e8f0",marginBottom:6}}><LogoImg w={120}/></div>
        <Nav id="citas"      icon="📅" label="Gestion de citas"   badge={pendientes.length}/>
        <Nav id="clientes"   icon="👤" label="Clientes"/>
        <Nav id="historial"  icon="🔧" label="Historial"/>
        <Nav id="mant"       icon="🗓️" label="Mantenimientos"/>
        <Nav id="whatsapp"   icon="💬" label="WhatsApp / Twilio"/>
        <div style={{borderTop:"1px solid #e2e8f0",margin:"8px 0"}}/>
        <div onClick={onBack} style={{cursor:"pointer",padding:"9px 14px",borderRadius:8,display:"flex",alignItems:"center",gap:10,fontSize:14,fontWeight:500,color:"#94a3b8"}}>← Cambiar vista</div>
      </div>

      <div style={{flex:1,overflow:"auto",padding:28}}>

        {tab==="citas"&&<div className="fade">
          <div style={{marginBottom:20}}><h1 style={{fontSize:22,fontWeight:800,color:"#0f172a"}}>📅 Gestion de citas</h1><p style={{color:"#64748b",fontSize:13,marginTop:3}}>{pendientes.length} pendiente{pendientes.length!==1?"s":""} de confirmacion</p></div>
          {pendientes.length>0&&<div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:14,padding:"16px 18px",marginBottom:20}}>
            <div style={{fontWeight:700,color:"#a16207",marginBottom:12,fontSize:14}}>Pendientes de confirmar</div>
            {pendientes.map(c=><div key={c.id} style={{background:"#fff",border:"1px solid #fde68a",borderRadius:12,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap",marginBottom:8}}>
              <div>
                <div style={{fontWeight:700,fontSize:15}}>{c.nombre}</div>
                <div style={{fontSize:13,color:"#64748b",marginTop:2}}>{c.tipo} · {fmt(c.fecha)} {c.hora}</div>
                <div style={{fontSize:12,color:"#1d6fa4",marginTop:2}}>📍 {c.residencia}: {c.direccion}</div>
                {c.lat&&c.lng&&<a href={"https://maps.google.com/?q="+c.lat+","+c.lng} target="_blank" rel="noreferrer" style={{fontSize:12,color:"#10b981",fontWeight:600}}>🗺 Ver en Google Maps</a>}
                {c.notas&&<div style={{fontSize:12,color:"#94a3b8",marginTop:3,fontStyle:"italic"}}>📝 {c.notas}</div>}
              </div>
              <button className="cb" onClick={()=>{setForm({...c,nf:"",nh:"",notaSec:""});setModal("gestion");}} style={{background:"linear-gradient(135deg,#f59e0b,#d97706)",color:"#fff",whiteSpace:"nowrap"}}>Gestionar →</button>
            </div>)}
          </div>}
          <input placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)} style={{maxWidth:300,marginBottom:14}}/>
          <div className="cc" style={{overflow:"hidden"}}>
            <table><thead><tr><th>Cliente</th><th>Servicio</th><th>Residencia</th><th>Fecha</th><th>Hora</th><th>Status</th><th>Mapa</th><th></th></tr></thead>
              <tbody>{filter(citas).sort((a,b)=>a.fecha>b.fecha?1:-1).map(c=>(
                <tr key={c.id}>
                  <td style={{fontWeight:600}}>{c.nombre}</td>
                  <td style={{color:"#64748b",fontSize:13}}>{c.tipo}</td>
                  <td style={{color:"#64748b",fontSize:13}}>{c.residencia||"—"}</td>
                  <td style={{color:"#64748b"}}>{fmt(c.fecha)}</td>
                  <td style={{color:"#64748b"}}>{c.hora}</td>
                  <td><Pill s={c.status}/></td>
                  <td>{c.lat&&c.lng?<a href={"https://maps.google.com/?q="+c.lat+","+c.lng} target="_blank" rel="noreferrer" style={{color:"#10b981",fontSize:13,fontWeight:600}}>🗺 Maps</a>:<span style={{color:"#cbd5e1",fontSize:12}}>—</span>}</td>
                  <td>{c.status!=="Cancelada"&&<button className="cb" onClick={()=>{setForm({...c,nf:"",nh:"",notaSec:""});setModal("gestion");}} style={{background:"#eff6ff",color:"#1d6fa4",padding:"5px 12px",fontSize:12}}>✏️</button>}</td>
                </tr>
              ))}</tbody>
            </table>
            {citas.length===0&&<div style={{padding:40,textAlign:"center",color:"#94a3b8"}}>Sin citas.</div>}
          </div>
        </div>}

        {tab==="clientes"&&<div className="fade">
          <h1 style={{fontSize:22,fontWeight:800,color:"#0f172a",marginBottom:16}}>👤 Clientes</h1>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {clientes.map(cl=>(
              <div key={cl.id} className="cc" style={{padding:18}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:42,height:42,borderRadius:"50%",background:"linear-gradient(135deg,#1d6fa4,#0284c7)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:16}}>{cl.avatar}</div>
                    <div><div style={{fontWeight:700,fontSize:16}}>{cl.nombre}</div><div style={{fontSize:13,color:"#64748b"}}>{cl.email} · {cl.telefono}</div></div>
                  </div>
                </div>
                <div style={{fontSize:13,fontWeight:600,color:"#64748b",marginBottom:8}}>Residencias ({cl.residencias?.length||0})</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {(cl.residencias||[]).map(r=>(
                    <div key={r.id} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <div style={{fontWeight:600,fontSize:14}}>🏠 {r.nombre}</div>
                        <div style={{fontSize:13,color:"#64748b",marginTop:2}}>📍 {r.direccion}</div>
                        {r.equipos&&<div style={{fontSize:12,color:"#94a3b8",marginTop:1}}>❄️ {r.equipos}</div>}
                      </div>
                      {r.lat&&r.lng&&<a href={"https://maps.google.com/?q="+r.lat+","+r.lng} target="_blank" rel="noreferrer" style={{background:"#dcfce7",color:"#15803d",padding:"6px 12px",borderRadius:8,fontSize:12,fontWeight:600,textDecoration:"none"}}>🗺 Maps</a>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>}

        {tab==="historial"&&<div className="fade">
          <h1 style={{fontSize:22,fontWeight:800,color:"#0f172a",marginBottom:16}}>🔧 Historial</h1>
          <input placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)} style={{maxWidth:300,marginBottom:14}}/>
          <div className="cc" style={{overflow:"hidden"}}>
            <table><thead><tr><th>Cliente</th><th>Tipo</th><th>Equipo</th><th>Tecnico</th><th>Fecha</th></tr></thead>
              <tbody>{filter(historial.map(h=>({...h,cname:clientes.find(c=>c.id===h.cid)?.nombre||h.cid}))).map(h=>(
                <tr key={h.id}><td style={{fontWeight:600}}>{h.cname}</td><td>{h.tipo}</td><td style={{color:"#64748b",fontSize:13}}>{h.equipo}</td><td style={{color:"#64748b"}}>{h.tecnico}</td><td style={{color:"#64748b"}}>{fmt(h.fecha)}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </div>}

        {tab==="mant"&&<div className="fade">
          <h1 style={{fontSize:22,fontWeight:800,color:"#0f172a",marginBottom:16}}>🗓️ Mantenimientos</h1>
          <div className="cc" style={{overflow:"hidden"}}>
            <table><thead><tr><th>Cliente</th><th>Fecha</th><th>Dias restantes</th></tr></thead>
              <tbody>{mant.map((m,i)=>{const cl=clientes.find(c=>c.id===m.cid);const d=days(m.fecha);return(
                <tr key={i}><td style={{fontWeight:600}}>{cl?.nombre}</td><td style={{color:"#64748b"}}>{fmt(m.fecha)}</td>
                  <td><span style={{fontWeight:700,color:d<0?"#ef4444":d<=7?"#f59e0b":"#10b981"}}>{d<0?Math.abs(d)+"d vencido":d===0?"Hoy":d+" dias"}</span></td>
                </tr>);
              })}</tbody>
            </table>
          </div>
        </div>}

        {tab==="whatsapp"&&<div className="fade">
          <div style={{marginBottom:20}}><h1 style={{fontSize:22,fontWeight:800,color:"#0f172a"}}>💬 WhatsApp / Twilio</h1></div>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 16px",borderRadius:20,marginBottom:20,background:twilio.ok?"#f0fdf4":"#fef2f2",border:"1px solid "+(twilio.ok?"#bbf7d0":"#fecaca")}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:twilio.ok?"#22c55e":"#ef4444"}}/>
            <span style={{fontSize:13,fontWeight:600,color:twilio.ok?"#15803d":"#dc2626"}}>{twilio.ok?"Twilio conectado":"Sin configurar"}</span>
          </div>
          <div className="cc" style={{padding:20}}>
            <div style={{fontWeight:700,fontSize:15,marginBottom:16,color:"#0f172a"}}>Credenciales Twilio</div>
            <div style={{display:"flex",flexDirection:"column",gap:13}}>
              <div className="fl"><label>Account SID</label><input placeholder="ACxxxxxxxx..." value={twf.sid||""} onChange={e=>setTwf(p=>({...p,sid:e.target.value}))}/></div>
              <div className="fl"><label>Auth Token</label><input type="password" value={twf.token||""} onChange={e=>setTwf(p=>({...p,token:e.target.value}))}/></div>
              <div className="fl"><label>Numero Twilio (sin +)</label><input placeholder="14155238886" value={twf.from||""} onChange={e=>setTwf(p=>({...p,from:e.target.value}))}/></div>
              <div className="fl"><label>Telefono secretaria</label><input placeholder="5512345678" value={twf.secTel||""} onChange={e=>setTwf(p=>({...p,secTel:e.target.value}))}/></div>
              <button className="cb" onClick={saveTw} style={{background:"linear-gradient(135deg,#10b981,#059669)",color:"#fff",padding:"13px",fontSize:15}}>Guardar</button>
            </div>
          </div>
        </div>}
      </div>

      {modal==="gestion"&&<div className="ov" onClick={()=>{setModal(null);setForm({});}}>
        <div className="mo" onClick={e=>e.stopPropagation()}>
          <div style={{fontWeight:800,fontSize:18,marginBottom:4,color:"#0f172a"}}>Gestionar cita</div>
          <div style={{fontSize:13,color:"#64748b",marginBottom:16}}>Confirma, reagenda o cancela.</div>
          <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px 16px",marginBottom:16}}>
            {[{l:"Cliente",v:form.nombre},{l:"Servicio",v:form.tipo},{l:"Residencia",v:form.residencia},{l:"Direccion",v:form.direccion},{l:"Fecha",v:fmt(form.fecha)},{l:"Hora",v:form.hora}].map(r=>(
              <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #e2e8f0",fontSize:14}}>
                <span style={{color:"#64748b"}}>{r.l}</span><span style={{fontWeight:600}}>{r.v}</span>
              </div>
            ))}
            {form.lat&&form.lng&&<div style={{marginTop:8}}><a href={"https://maps.google.com/?q="+form.lat+","+form.lng} target="_blank" rel="noreferrer" style={{color:"#10b981",fontSize:13,fontWeight:600}}>🗺 Ver ubicacion en Google Maps</a></div>}
            {form.notas&&<div style={{marginTop:10,fontSize:13,color:"#94a3b8",fontStyle:"italic"}}>📝 {form.notas}</div>}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:13}}>
            <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:12,padding:"14px 16px"}}>
              <div style={{fontSize:13,fontWeight:600,color:"#1d4ed8",marginBottom:11}}>Reagendar (opcional)</div>
              <div className="g2">
                <div className="fl"><label>Nueva fecha</label><input type="date" value={form.nf||""} min={new Date().toISOString().split("T")[0]} onChange={e=>setForm(p=>({...p,nf:e.target.value}))}/></div>
                <div className="fl"><label>Nueva hora</label><select value={form.nh||""} onChange={e=>setForm(p=>({...p,nh:e.target.value}))}><option value="">Misma hora</option>{HORAS.map(h=><option key={h}>{h}</option>)}</select></div>
              </div>
            </div>
            <div className="fl"><label>Nota para el cliente</label><textarea rows={3} value={form.notaSec||""} onChange={e=>setForm(p=>({...p,notaSec:e.target.value}))}/></div>
          </div>
          <div style={{display:"flex",gap:10,marginTop:18}}>
            <button className="cb" onClick={()=>rechazar(form.id,form.notaSec)} style={{flex:1,background:"#fef2f2",color:"#dc2626",border:"1px solid #fecaca",padding:"12px"}}>Cancelar cita</button>
            <button className="cb" onClick={()=>confirmar(form.id,form.notaSec,form.nf,form.nh)} style={{flex:2,background:"linear-gradient(135deg,#10b981,#059669)",color:"#fff",padding:"12px"}}>{form.nf||form.nh?"Reagendar":"Confirmar"}{twilio.ok?" + WhatsApp":""}</button>
          </div>
        </div>
      </div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  PORTAL CLIENTE
// ═══════════════════════════════════════════════════════════
function Portal({clientes,setClientes,historial,citas,setCitas,mant,twilio,onBack}) {
  const [screen,setScreen]   = useState("login");
  const [cliente,setCliente] = useState(null);
  const [tab,setTab]         = useState("inicio");
  const [lf,setLf]           = useState({email:"",pass:"",err:""});
  const [rf,setRf]           = useState({nombre:"",email:"",pass:"",pass2:"",tel:"",err:""});
  const [cf,setCf]           = useState({tipo:"",fecha:"",hora:"",notas:"",residenciaId:"",step:1});
  const [exito,setExito]     = useState(false);
  const [detalle,setDetalle] = useState(null);
  const [resModal,setResModal] = useState(false);
  const [newRes,setNewRes]   = useState({nombre:"",direccion:"",equipos:""});
  const [gpsLoading,setGpsLoading] = useState(false);

  const misCitas    = citas.filter(c=>c.cid===cliente?.id);
  const miHistorial = historial.filter(h=>h.cid===cliente?.id);
  const miMant      = mant.find(m=>m.cid===cliente?.id);
  const diasMant    = days(miMant?.fecha);
  const misResidencias = cliente?.residencias || [];

  const login = () => {
    const f=clientes.find(c=>c.email===lf.email&&c.password===lf.pass);
    if(f){setCliente(f);setScreen("app");setLf({email:"",pass:"",err:""});}
    else setLf(p=>({...p,err:"Email o contrasena incorrectos."}));
  };

  const registrar = () => {
    if(!rf.nombre||!rf.email||!rf.pass||!rf.tel){setRf(p=>({...p,err:"Completa todos los campos."}));return;}
    if(rf.pass!==rf.pass2){setRf(p=>({...p,err:"Las contrasenas no coinciden."}));return;}
    if(clientes.find(c=>c.email===rf.email)){setRf(p=>({...p,err:"Este email ya esta registrado."}));return;}
    const nuevo = {
      id:uid(), nombre:rf.nombre, email:rf.email, password:rf.pass, telefono:rf.tel,
      avatar:rf.nombre.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2),
      residencias:[{id:uid(),nombre:"Mi residencia",direccion:rf.direccion||"Por definir",lat:rf.lat||null,lng:rf.lng||null,equipos:""}]
    };
    setClientes(p=>[...p,nuevo]);
    setCliente(nuevo); setScreen("app");
  };

  const getGPS = (target) => {
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const {latitude:lat,longitude:lng} = pos.coords;
        if(target==="registro") setRf(p=>({...p,lat,lng}));
        if(target==="residencia") setNewRes(p=>({...p,lat,lng}));
        setGpsLoading(false);
      },
      () => { setGpsLoading(false); alert("No se pudo obtener la ubicacion. Activa el GPS."); }
    );
  };

  const addResidencia = () => {
    if(!newRes.nombre||!newRes.direccion) return;
    const r = {id:uid(),nombre:newRes.nombre,direccion:newRes.direccion,lat:newRes.lat||null,lng:newRes.lng||null,equipos:newRes.equipos||""};
    const upd = clientes.map(c=>c.id===cliente.id?{...c,residencias:[...c.residencias,r]}:c);
    setClientes(upd);
    setCliente(prev=>({...prev,residencias:[...prev.residencias,r]}));
    setNewRes({nombre:"",direccion:"",equipos:""}); setResModal(false);
  };

  const logout = () => {setCliente(null);setScreen("login");setTab("inicio");};

  const agendar = async () => {
    if(!cf.tipo||!cf.fecha||!cf.hora||!cf.residenciaId) return;
    const res = misResidencias.find(r=>r.id===cf.residenciaId);
    const n = {id:uid(),cid:cliente.id,nombre:cliente.nombre,tel:cliente.telefono,
      fecha:cf.fecha,hora:cf.hora,tipo:cf.tipo,residencia:res?.nombre||"",
      direccion:res?.direccion||"",lat:res?.lat||null,lng:res?.lng||null,
      notas:cf.notas,status:"Pendiente de confirmacion",nota:""};
    setCitas(p=>[...p,n]);
    if(twilio.ok){
      await sendWA(twilio,cliente.telefono,waMsg.solicitud(n));
      if(twilio.secTel) await sendWA(twilio,twilio.secTel,waMsg.secretaria(n));
    }
    setCf({tipo:"",fecha:"",hora:"",notas:"",residenciaId:"",step:1});
    setExito(true); setTimeout(()=>{setExito(false);setTab("citas");},2800);
  };

  const cancelar=(id)=>setCitas(p=>p.map(c=>c.id===id?{...c,status:"Cancelada"}:c));

  const css=`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}input,select,textarea{font-family:Outfit,sans-serif;font-size:15px;outline:none;transition:all .2s}.pb{cursor:pointer;border:none;font-family:Outfit,sans-serif;font-weight:600;transition:all .2s;border-radius:14px}.pb:active{transform:scale(.97)}.pc{background:#fff;border-radius:20px;padding:20px;box-shadow:0 2px 12px rgba(0,0,0,.06)}.tbar{display:flex;background:#fff;border-top:1px solid #e2e8f0;position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;z-index:50}.tbtn{flex:1;padding:11px 4px 9px;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;border:none;background:transparent;font-family:Outfit,sans-serif;font-size:11px;font-weight:500;color:#94a3b8;transition:color .2s}.tbtn.on{color:#1d6fa4}.sl{animation:su .3s ease both}@keyframes su{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}.fd{animation:fi .3s ease both}@keyframes fi{from{opacity:0}to{opacity:1}}.dot{width:8px;height:8px;border-radius:50%;background:#e2e8f0;transition:background .3s}.dot.on{background:#1d6fa4}input[type=date]::-webkit-calendar-picker-indicator{opacity:.5;cursor:pointer}.ov2{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100;display:flex;align-items:flex-end;justify-content:center}.sh{background:#fff;border-radius:24px 24px 0 0;padding:24px;width:100%;max-width:430px;max-height:85vh;overflow-y:auto}`;

  const Phone=({children})=>(
    <div style={{display:"flex",justifyContent:"center",minHeight:"100vh",background:"linear-gradient(160deg,#e0f2fe,#bfdbfe 50%,#ddd6fe)"}}>
      <style>{css}</style>
      <div style={{width:"100%",maxWidth:430,minHeight:"100vh",background:"#f1f5f9",overflow:"hidden",boxShadow:"0 0 60px rgba(0,0,0,.15)"}}>{children}</div>
    </div>
  );

  // ── LOGIN ──
  if(screen==="login") return (
    <Phone>
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",background:"#f1f5f9"}}>
        <div style={{background:"#fff",padding:"48px 28px 28px",textAlign:"center",boxShadow:"0 2px 16px rgba(0,0,0,.06)"}}>
          <LogoImg w={160}/>
          <div style={{fontSize:12,fontWeight:600,color:"#1d6fa4",letterSpacing:"1px",marginTop:10}}>PORTAL DE CLIENTES</div>
        </div>
        <div style={{flex:1,padding:"28px 20px 40px"}}>
          <div style={{fontSize:21,fontWeight:700,color:"#0f172a",marginBottom:4}}>Bienvenido 👋</div>
          <div style={{fontSize:14,color:"#64748b",marginBottom:22}}>Inicia sesion para ver tu cuenta</div>
          <div style={{display:"flex",flexDirection:"column",gap:13}}>
            <div><label style={{fontSize:12,fontWeight:600,color:"#475569",display:"block",marginBottom:5}}>CORREO</label>
              <input value={lf.email} onChange={e=>setLf(p=>({...p,email:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="tu@correo.com" style={{width:"100%",padding:"13px 15px",background:"#fff",border:"2px solid "+(lf.err?"#fca5a5":"#e2e8f0"),borderRadius:13,color:"#0f172a"}}/>
            </div>
            <div><label style={{fontSize:12,fontWeight:600,color:"#475569",display:"block",marginBottom:5}}>CONTRASENA</label>
              <input type="password" value={lf.pass} onChange={e=>setLf(p=>({...p,pass:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="••••••••" style={{width:"100%",padding:"13px 15px",background:"#fff",border:"2px solid "+(lf.err?"#fca5a5":"#e2e8f0"),borderRadius:13,color:"#0f172a"}}/>
            </div>
            {lf.err&&<div style={{fontSize:13,color:"#dc2626",background:"#fef2f2",padding:"10px 13px",borderRadius:10,fontWeight:500}}>⚠️ {lf.err}</div>}
            <button className="pb" onClick={login} style={{background:"linear-gradient(135deg,#1d6fa4,#0284c7)",color:"#fff",padding:"15px",fontSize:16,marginTop:4,boxShadow:"0 8px 20px rgba(29,111,164,.35)"}}>Entrar</button>
            <button className="pb" onClick={()=>setScreen("registro")} style={{background:"#f1f5f9",color:"#1d6fa4",padding:"13px",fontSize:15,border:"2px solid #bfdbfe"}}>Crear cuenta nueva</button>
          </div>
          <div style={{textAlign:"center",marginTop:16,fontSize:13,color:"#94a3b8"}}>
            Nuevo cliente? <span style={{color:"#1d6fa4",fontWeight:600,cursor:"pointer"}} onClick={()=>setScreen("registro")}>Registrate aqui</span>
          </div>
          <div style={{marginTop:12,textAlign:"center"}}><span onClick={onBack} style={{fontSize:13,color:"#94a3b8",cursor:"pointer"}}>← Cambiar vista</span></div>
        </div>
      </div>
    </Phone>
  );

  // ── REGISTRO ──
  if(screen==="registro") return (
    <Phone>
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",background:"#f1f5f9"}}>
        <div style={{background:"linear-gradient(135deg,#1d6fa4,#0284c7)",padding:"50px 22px 24px"}}>
          <div style={{fontSize:22,fontWeight:800,color:"#fff"}}>Crear cuenta 👤</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,.8)",marginTop:3}}>Registro rapido — menos de 2 minutos</div>
        </div>
        <div style={{flex:1,padding:"20px 20px 40px",overflow:"auto"}}>
          <div style={{display:"flex",flexDirection:"column",gap:13}}>
            <div><label style={{fontSize:12,fontWeight:600,color:"#475569",display:"block",marginBottom:5}}>NOMBRE COMPLETO *</label>
              <input value={rf.nombre} onChange={e=>setRf(p=>({...p,nombre:e.target.value}))} placeholder="Juan Perez" style={{width:"100%",padding:"13px 15px",background:"#fff",border:"2px solid #e2e8f0",borderRadius:13,color:"#0f172a"}}/>
            </div>
            <div><label style={{fontSize:12,fontWeight:600,color:"#475569",display:"block",marginBottom:5}}>TELEFONO *</label>
              <input type="tel" value={rf.tel} onChange={e=>setRf(p=>({...p,tel:e.target.value}))} placeholder="5512345678" style={{width:"100%",padding:"13px 15px",background:"#fff",border:"2px solid #e2e8f0",borderRadius:13,color:"#0f172a"}}/>
            </div>
            <div><label style={{fontSize:12,fontWeight:600,color:"#475569",display:"block",marginBottom:5}}>CORREO ELECTRONICO *</label>
              <input type="email" value={rf.email} onChange={e=>setRf(p=>({...p,email:e.target.value}))} placeholder="tu@correo.com" style={{width:"100%",padding:"13px 15px",background:"#fff",border:"2px solid #e2e8f0",borderRadius:13,color:"#0f172a"}}/>
            </div>
            <div><label style={{fontSize:12,fontWeight:600,color:"#475569",display:"block",marginBottom:5}}>CONTRASENA *</label>
              <input type="password" value={rf.pass} onChange={e=>setRf(p=>({...p,pass:e.target.value}))} placeholder="Minimo 4 caracteres" style={{width:"100%",padding:"13px 15px",background:"#fff",border:"2px solid #e2e8f0",borderRadius:13,color:"#0f172a"}}/>
            </div>
            <div><label style={{fontSize:12,fontWeight:600,color:"#475569",display:"block",marginBottom:5}}>CONFIRMAR CONTRASENA *</label>
              <input type="password" value={rf.pass2} onChange={e=>setRf(p=>({...p,pass2:e.target.value}))} placeholder="Repite tu contrasena" style={{width:"100%",padding:"13px 15px",background:"#fff",border:"2px solid #e2e8f0",borderRadius:13,color:"#0f172a"}}/>
            </div>

            <div style={{background:"#f0f9ff",border:"1px solid #bae6fd",borderRadius:14,padding:"14px 16px"}}>
              <div style={{fontSize:13,fontWeight:700,color:"#0369a1",marginBottom:10}}>📍 Tu primera residencia</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <input value={rf.direccion||""} onChange={e=>setRf(p=>({...p,direccion:e.target.value}))} placeholder="Direccion: Calle, Colonia, Ciudad" style={{width:"100%",padding:"11px 13px",background:"#fff",border:"2px solid #e2e8f0",borderRadius:12,color:"#0f172a",fontSize:14}}/>
                <button className="pb" onClick={()=>getGPS("registro")} style={{background:rf.lat?"#dcfce7":"#1d6fa4",color:rf.lat?"#15803d":"#fff",padding:"11px",fontSize:14,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  {gpsLoading?"Obteniendo GPS...":rf.lat?"✅ Ubicacion guardada":"📍 Usar mi ubicacion GPS"}
                </button>
                {rf.lat&&<div style={{fontSize:12,color:"#15803d",textAlign:"center"}}>GPS: {rf.lat.toFixed(4)}, {rf.lng.toFixed(4)}</div>}
              </div>
            </div>

            {rf.err&&<div style={{fontSize:13,color:"#dc2626",background:"#fef2f2",padding:"10px 13px",borderRadius:10,fontWeight:500}}>⚠️ {rf.err}</div>}
            <button className="pb" onClick={registrar} style={{background:"linear-gradient(135deg,#10b981,#059669)",color:"#fff",padding:"15px",fontSize:16,marginTop:4,boxShadow:"0 8px 20px rgba(16,185,129,.3)"}}>Crear mi cuenta ✓</button>
            <button className="pb" onClick={()=>setScreen("login")} style={{background:"#f1f5f9",color:"#64748b",padding:"13px",fontSize:14}}>← Ya tengo cuenta</button>
          </div>
        </div>
      </div>
    </Phone>
  );

  // ── APP ──
  const lastServ = miHistorial[0];
  return (
    <Phone>
      <div style={{paddingBottom:80,minHeight:"100vh",background:"#f1f5f9"}}>

        {tab==="inicio"&&<div className="sl">
          <div style={{background:"linear-gradient(135deg,#1d6fa4,#0284c7)",padding:"50px 22px 26px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <div><div style={{fontSize:13,color:"rgba(255,255,255,.75)"}}>Hola,</div><div style={{fontSize:20,fontWeight:800,color:"#fff"}}>{cliente.nombre.split(" ")[0]} 👋</div></div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#fff",border:"2px solid rgba(255,255,255,.4)"}}>{cliente.avatar}</div>
                <button className="pb" onClick={logout} style={{background:"rgba(255,255,255,.15)",color:"#fff",padding:"7px 13px",fontSize:12,borderRadius:9}}>Salir</button>
              </div>
            </div>
            <div style={{background:"rgba(255,255,255,.15)",borderRadius:16,padding:"14px 16px",border:"1px solid rgba(255,255,255,.2)"}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,.8)",fontWeight:600,marginBottom:3}}>PROXIMO MANTENIMIENTO</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:17,fontWeight:700,color:"#fff"}}>{fmt(miMant?.fecha)||"No programado"}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,.75)",marginTop:2}}>{diasMant===null?"—":diasMant<0?"Vencido hace "+Math.abs(diasMant)+"d":diasMant===0?"Hoy!":diasMant<=7?"En "+diasMant+" dias":"En "+diasMant+" dias"}</div>
                </div>
                <button className="pb" onClick={()=>setTab("agendar")} style={{background:"#fff",color:"#1d6fa4",padding:"9px 15px",fontSize:13,borderRadius:11}}>Agendar</button>
              </div>
            </div>
          </div>
          <div style={{padding:"18px 14px",display:"flex",flexDirection:"column",gap:13}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
              {[{icon:"📅",label:"Agendar cita",bg:"#dbeafe",action:()=>setTab("agendar")},{icon:"🔧",label:"Mi historial",bg:"#ede9fe",action:()=>setTab("historial")},{icon:"🗓️",label:"Mis citas",bg:"#ffedd5",action:()=>setTab("citas")},{icon:"🏠",label:"Mis residencias",bg:"#dcfce7",action:()=>setTab("residencias")},{icon:"🎁",label:"Ofertas",bg:"#fce7f3",action:()=>setTab("ofertas")}].map(a=>(
                <button key={a.label} className="pb" onClick={a.action} style={{background:"#fff",padding:"16px 12px",borderRadius:18,display:"flex",flexDirection:"column",alignItems:"flex-start",gap:7,boxShadow:"0 2px 10px rgba(0,0,0,.06)",textAlign:"left"}}>
                  <div style={{width:38,height:38,borderRadius:12,background:a.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{a.icon}</div>
                  <div style={{fontSize:14,fontWeight:600,color:"#0f172a"}}>{a.label}</div>
                </button>
              ))}
            </div>
            {lastServ&&<div className="pc">
              <div style={{fontSize:12,fontWeight:600,color:"#94a3b8",marginBottom:10,letterSpacing:".05em"}}>ULTIMO SERVICIO</div>
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{width:42,height:42,borderRadius:13,background:"#dbeafe",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🔧</div>
                <div><div style={{fontSize:15,fontWeight:700,color:"#0f172a"}}>{lastServ.tipo}</div><div style={{fontSize:13,color:"#64748b",marginTop:2}}>{lastServ.equipo}</div><div style={{fontSize:12,color:"#94a3b8",marginTop:2}}>{fmt(lastServ.fecha)} · {lastServ.tecnico}</div></div>
              </div>
              <div style={{marginTop:11,padding:"10px 12px",background:"#f8fafc",borderRadius:12,fontSize:13,color:"#475569",lineHeight:1.5}}>{lastServ.desc}</div>
            </div>}
            <div style={{textAlign:"center",fontSize:12,color:"#cbd5e1"}}>Solution Air System · (55) 1234-5678</div>
          </div>
        </div>}

        {tab==="residencias"&&<div className="sl">
          <div style={{background:"linear-gradient(135deg,#10b981,#059669)",padding:"50px 22px 22px"}}>
            <div style={{fontSize:21,fontWeight:800,color:"#fff"}}>Mis residencias 🏠</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.8)",marginTop:3}}>{misResidencias.length} registrada{misResidencias.length!==1?"s":""}</div>
          </div>
          <div style={{padding:"16px 14px",display:"flex",flexDirection:"column",gap:12}}>
            <button className="pb" onClick={()=>setResModal(true)} style={{background:"linear-gradient(135deg,#1d6fa4,#0284c7)",color:"#fff",padding:"14px",fontSize:15,boxShadow:"0 6px 16px rgba(29,111,164,.3)"}}>+ Agregar residencia</button>
            {misResidencias.map(r=>(
              <div key={r.id} className="pc">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div style={{fontSize:16,fontWeight:700,color:"#0f172a"}}>🏠 {r.nombre}</div>
                  {r.lat&&r.lng&&<a href={"https://maps.google.com/?q="+r.lat+","+r.lng} target="_blank" rel="noreferrer" style={{background:"#dcfce7",color:"#15803d",padding:"6px 12px",borderRadius:8,fontSize:12,fontWeight:600,textDecoration:"none"}}>🗺 Maps</a>}
                </div>
                <div style={{fontSize:14,color:"#475569",marginBottom:6}}>📍 {r.direccion}</div>
                {r.equipos&&<div style={{fontSize:13,color:"#94a3b8"}}>❄️ Equipos: {r.equipos}</div>}
                {r.lat&&r.lng&&<div style={{fontSize:12,color:"#10b981",marginTop:4}}>✅ Ubicacion GPS guardada</div>}
              </div>
            ))}
          </div>
        </div>}

        {tab==="agendar"&&<div className="sl">
          <div style={{background:"linear-gradient(135deg,#1d6fa4,#0284c7)",padding:"50px 22px 22px"}}>
            <div style={{fontSize:21,fontWeight:800,color:"#fff"}}>Agendar cita 📅</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.8)",marginTop:3}}>La secretaria confirmara tu solicitud</div>
            <div style={{display:"flex",gap:6,marginTop:14}}>{[1,2,3,4].map(s=><div key={s} className={"dot"+(cf.step>=s?" on":"")}/>)}</div>
          </div>
          {exito?<div style={{padding:32,textAlign:"center"}} className="fd"><div style={{fontSize:56,marginBottom:14}}>✅</div><div style={{fontSize:20,fontWeight:700,color:"#0f172a"}}>Solicitud enviada!</div><div style={{fontSize:14,color:"#64748b",marginTop:8,lineHeight:1.6}}>{twilio.ok?"Te llegara un WhatsApp de confirmacion.":"La secretaria te contactara pronto."}</div></div>
          :<div style={{padding:"18px 14px",display:"flex",flexDirection:"column",gap:13}}>
            {cf.step===1&&<div className="fd">
              <div style={{fontSize:15,fontWeight:700,color:"#0f172a",marginBottom:12}}>¿En cual residencia?</div>
              {misResidencias.length===0&&<div style={{background:"#fef9c3",border:"1px solid #fde68a",borderRadius:12,padding:"14px",fontSize:13,color:"#92400e",marginBottom:10}}>No tienes residencias registradas. <span style={{fontWeight:700,cursor:"pointer",color:"#1d6fa4"}} onClick={()=>setTab("residencias")}>Agregar aqui →</span></div>}
              {misResidencias.map(r=>(
                <button key={r.id} className="pb" onClick={()=>setCf(p=>({...p,residenciaId:r.id,step:2}))}
                  style={{width:"100%",background:cf.residenciaId===r.id?"#1d6fa4":"#fff",color:cf.residenciaId===r.id?"#fff":"#0f172a",padding:"15px 16px",marginBottom:9,borderRadius:14,textAlign:"left",border:"2px solid "+(cf.residenciaId===r.id?"#1d6fa4":"#e2e8f0")}}>
                  <div style={{fontWeight:700,fontSize:15}}>🏠 {r.nombre}</div>
                  <div style={{fontSize:13,opacity:.8,marginTop:3}}>📍 {r.direccion}</div>
                </button>
              ))}
            </div>}
            {cf.step===2&&<div className="fd">
              <div style={{fontSize:15,fontWeight:700,color:"#0f172a",marginBottom:12}}>¿Que servicio necesitas?</div>
              {TIPOS.map(t=>(
                <button key={t} className="pb" onClick={()=>setCf(p=>({...p,tipo:t,step:3}))}
                  style={{width:"100%",background:cf.tipo===t?"#1d6fa4":"#fff",color:cf.tipo===t?"#fff":"#0f172a",padding:"15px 16px",marginBottom:9,borderRadius:14,textAlign:"left",fontSize:15,border:"2px solid "+(cf.tipo===t?"#1d6fa4":"#e2e8f0"),display:"flex",justifyContent:"space-between"}}>
                  {t}<span style={{opacity:.6}}>{cf.tipo===t?"✓":"›"}</span>
                </button>
              ))}
              <button className="pb" onClick={()=>setCf(p=>({...p,step:1}))} style={{width:"100%",background:"#f1f5f9",color:"#64748b",padding:"13px",marginTop:4}}>← Atras</button>
            </div>}
            {cf.step===3&&<div className="fd">
              <div style={{fontSize:15,fontWeight:700,color:"#0f172a",marginBottom:12}}>¿Cuando te viene bien?</div>
              <div className="pc" style={{display:"flex",flexDirection:"column",gap:13}}>
                <div><label style={{fontSize:12,fontWeight:600,color:"#64748b",display:"block",marginBottom:5}}>FECHA</label>
                  <input type="date" value={cf.fecha} min={new Date().toISOString().split("T")[0]} onChange={e=>setCf(p=>({...p,fecha:e.target.value}))} style={{width:"100%",padding:"12px 13px",border:"2px solid #e2e8f0",borderRadius:12,background:"#f8fafc",color:"#0f172a"}}/>
                </div>
                <div><label style={{fontSize:12,fontWeight:600,color:"#64748b",display:"block",marginBottom:7}}>HORA PREFERIDA</label>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7}}>
                    {HORAS.map(h=><button key={h} className="pb" onClick={()=>setCf(p=>({...p,hora:h}))} style={{padding:"9px 4px",fontSize:13,borderRadius:10,background:cf.hora===h?"#1d6fa4":"#f1f5f9",color:cf.hora===h?"#fff":"#475569",border:"2px solid "+(cf.hora===h?"#1d6fa4":"transparent")}}>{h}</button>)}
                  </div>
                </div>
                <div><label style={{fontSize:12,fontWeight:600,color:"#64748b",display:"block",marginBottom:5}}>NOTAS (opcional)</label>
                  <textarea value={cf.notas} onChange={e=>setCf(p=>({...p,notas:e.target.value}))} placeholder="Describe el problema..." rows={3} style={{width:"100%",padding:"11px 13px",border:"2px solid #e2e8f0",borderRadius:12,background:"#f8fafc",color:"#0f172a",resize:"none",fontSize:14}}/>
                </div>
              </div>
              <div style={{display:"flex",gap:10,marginTop:12}}>
                <button className="pb" onClick={()=>setCf(p=>({...p,step:2}))} style={{flex:1,background:"#f1f5f9",color:"#64748b",padding:"13px"}}>← Atras</button>
                <button className="pb" onClick={()=>cf.fecha&&cf.hora&&setCf(p=>({...p,step:4}))} style={{flex:2,background:cf.fecha&&cf.hora?"linear-gradient(135deg,#1d6fa4,#0284c7)":"#cbd5e1",color:"#fff",padding:"13px",opacity:cf.fecha&&cf.hora?1:.7}}>Continuar →</button>
              </div>
            </div>}
            {cf.step===4&&<div className="fd">
              <div style={{fontSize:15,fontWeight:700,color:"#0f172a",marginBottom:12}}>Confirma tu solicitud</div>
              <div className="pc" style={{display:"flex",flexDirection:"column",gap:12,marginBottom:13}}>
                {[
                  {icon:"🏠",l:"Residencia",v:misResidencias.find(r=>r.id===cf.residenciaId)?.nombre},
                  {icon:"📍",l:"Direccion",v:misResidencias.find(r=>r.id===cf.residenciaId)?.direccion},
                  {icon:"🔧",l:"Servicio",v:cf.tipo},
                  {icon:"📅",l:"Fecha",v:fmt(cf.fecha)},
                  {icon:"⏰",l:"Hora",v:cf.hora},
                  {icon:"👤",l:"Cliente",v:cliente.nombre},
                ].map(r=>(
                  <div key={r.l} style={{display:"flex",gap:11,alignItems:"center"}}>
                    <div style={{width:34,height:34,borderRadius:10,background:"#f0f9ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>{r.icon}</div>
                    <div><div style={{fontSize:11,color:"#94a3b8",fontWeight:600}}>{r.l.toUpperCase()}</div><div style={{fontSize:14,fontWeight:600,color:"#0f172a"}}>{r.v}</div></div>
                  </div>
                ))}
              </div>
              <div style={{background:"#fef9c3",border:"1px solid #fde68a",borderRadius:12,padding:"11px 14px",fontSize:13,color:"#92400e",marginBottom:13}}>Tu cita quedara Pendiente hasta que la secretaria confirme.</div>
              <div style={{display:"flex",gap:10}}>
                <button className="pb" onClick={()=>setCf(p=>({...p,step:3}))} style={{flex:1,background:"#f1f5f9",color:"#64748b",padding:"13px"}}>← Atras</button>
                <button className="pb" onClick={agendar} style={{flex:2,background:"linear-gradient(135deg,#10b981,#059669)",color:"#fff",padding:"13px"}}>Enviar solicitud ✓</button>
              </div>
            </div>}
          </div>}
        </div>}

        {tab==="historial"&&<div className="sl">
          <div style={{background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",padding:"50px 22px 22px"}}>
            <div style={{fontSize:21,fontWeight:800,color:"#fff"}}>Historial 🔧</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.8)",marginTop:3}}>{miHistorial.length} servicios</div>
          </div>
          <div style={{padding:"16px 14px",display:"flex",flexDirection:"column",gap:12}}>
            {miHistorial.length===0?<div style={{textAlign:"center",padding:40,color:"#94a3b8"}}><div style={{fontSize:40}}>📋</div><div style={{marginTop:10}}>Sin historial aun</div></div>
            :miHistorial.map((h,i)=>(
              <div key={h.id} className="pc" style={{cursor:"pointer"}} onClick={()=>setDetalle(detalle===h.id?null:h.id)}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <div style={{width:42,height:42,borderRadius:13,background:"#ede9fe",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,position:"relative"}}>🔧{i===0&&<div style={{position:"absolute",top:-4,right:-4,width:13,height:13,background:"#1d6fa4",borderRadius:"50%",border:"2px solid #fff"}}/>}</div>
                  <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:"#0f172a"}}>{h.tipo}</div><div style={{fontSize:13,color:"#64748b",marginTop:2}}>{h.equipo}</div><div style={{fontSize:12,color:"#94a3b8",marginTop:2}}>{fmt(h.fecha)} · {h.tecnico}</div></div>
                </div>
                {detalle===h.id&&<div className="fd" style={{marginTop:13,padding:"11px 13px",background:"#f8fafc",borderRadius:13,fontSize:13,color:"#475569",lineHeight:1.6,borderLeft:"3px solid #8b5cf6"}}>{h.desc}</div>}
                <div style={{textAlign:"center",marginTop:8,fontSize:12,color:"#cbd5e1"}}>{detalle===h.id?"▲ Ocultar":"▼ Ver detalle"}</div>
              </div>
            ))}
          </div>
        </div>}

        {tab==="citas"&&<div className="sl">
          <div style={{background:"linear-gradient(135deg,#f97316,#ea580c)",padding:"50px 22px 22px"}}>
            <div style={{fontSize:21,fontWeight:800,color:"#fff"}}>Mis citas 🗓️</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.8)",marginTop:3}}>{misCitas.filter(c=>c.status!=="Cancelada").length} cita(s) activa(s)</div>
          </div>
          <div style={{padding:"16px 14px",display:"flex",flexDirection:"column",gap:12}}>
            <button className="pb" onClick={()=>setTab("agendar")} style={{background:"linear-gradient(135deg,#1d6fa4,#0284c7)",color:"#fff",padding:"14px",fontSize:15,boxShadow:"0 6px 16px rgba(29,111,164,.3)"}}>+ Solicitar nueva cita</button>
            {misCitas.length===0?<div style={{textAlign:"center",padding:32,color:"#94a3b8"}}><div style={{fontSize:40}}>🗓️</div><div style={{marginTop:10}}>No tienes citas aun</div></div>
            :[...misCitas].reverse().map(c=>(
              <div key={c.id} className="pc">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}><div style={{fontSize:15,fontWeight:700,color:"#0f172a"}}>{c.tipo}</div><Pill s={c.status}/></div>
                <div style={{fontSize:13,color:"#1d6fa4",marginBottom:6,fontWeight:600}}>🏠 {c.residencia}</div>
                <div style={{fontSize:13,color:"#64748b",marginBottom:4}}>📍 {c.direccion}</div>
                <div style={{display:"flex",gap:14,marginBottom:8}}><div style={{fontSize:13,color:"#64748b"}}>📅 {fmt(c.fecha)}</div><div style={{fontSize:13,color:"#64748b"}}>⏰ {c.hora}</div></div>
                {c.notas&&<div style={{fontSize:13,color:"#94a3b8",fontStyle:"italic",marginBottom:8}}>📝 {c.notas}</div>}
                {c.nota&&<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"9px 12px",fontSize:13,color:"#166534",marginBottom:8}}>💬 <b>Nota:</b> {c.nota}</div>}
                {c.status==="Pendiente de confirmacion"&&<div style={{background:"#fef9c3",border:"1px solid #fde68a",borderRadius:10,padding:"8px 12px",fontSize:12,color:"#92400e",marginBottom:8}}>En espera de confirmacion</div>}
                {c.status!=="Cancelada"&&<button className="pb" onClick={()=>cancelar(c.id)} style={{width:"100%",background:"#fff1f2",color:"#e11d48",border:"1px solid #fecdd3",padding:"10px",fontSize:13,borderRadius:11}}>Cancelar esta cita</button>}
              </div>
            ))}
          </div>
        </div>}

        {tab==="ofertas"&&<div className="sl">
          <div style={{background:"linear-gradient(135deg,#10b981,#059669)",padding:"50px 22px 22px"}}>
            <div style={{fontSize:21,fontWeight:800,color:"#fff"}}>Ofertas exclusivas 🎁</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.8)",marginTop:3}}>Solo para clientes Solution Air System</div>
          </div>
          <div style={{padding:"16px 14px",display:"flex",flexDirection:"column",gap:14}}>
            {OFERTAS.map(o=>(
              <div key={o.id} style={{borderRadius:20,overflow:"hidden",boxShadow:"0 4px 16px rgba(0,0,0,.1)"}}>
                <div style={{background:o.grad,padding:"18px 18px 14px"}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontSize:30}}>{o.icon}</div><div style={{background:"rgba(255,255,255,.25)",color:"#fff",padding:"5px 13px",borderRadius:20,fontSize:14,fontWeight:800}}>{o.badge}</div></div>
                  <div style={{fontSize:17,fontWeight:800,color:"#fff",marginTop:9}}>{o.titulo}</div>
                  <div style={{fontSize:13,color:"rgba(255,255,255,.9)",marginTop:3,lineHeight:1.5}}>{o.desc}</div>
                </div>
                <div style={{background:"#fff",padding:"12px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontSize:12,color:"#94a3b8"}}>🕐 {o.vig}</div>
                  <button className="pb" onClick={()=>setTab("agendar")} style={{background:"#1d6fa4",color:"#fff",padding:"8px 15px",fontSize:13,borderRadius:10}}>Aprovechar</button>
                </div>
              </div>
            ))}
          </div>
        </div>}

        <nav className="tbar">
          {[{id:"inicio",icon:"🏠",label:"Inicio"},{id:"agendar",icon:"📅",label:"Agendar"},{id:"residencias",icon:"🏠",label:"Residencias"},{id:"citas",icon:"🗓️",label:"Mis citas"},{id:"ofertas",icon:"🎁",label:"Ofertas"}].map(t=>(
            <button key={t.id} className={"tbtn"+(tab===t.id?" on":"")} onClick={()=>setTab(t.id)}>
              <span style={{fontSize:18}}>{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>
      </div>

      {resModal&&<div className="ov2" onClick={()=>setResModal(false)}>
        <div className="sh" onClick={e=>e.stopPropagation()}>
          <div style={{fontSize:18,fontWeight:800,color:"#0f172a",marginBottom:4}}>🏠 Nueva residencia</div>
          <div style={{fontSize:13,color:"#64748b",marginBottom:16}}>Agrega otra propiedad donde tienes AC</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div><label style={{fontSize:12,fontWeight:600,color:"#64748b",display:"block",marginBottom:4}}>NOMBRE (ej: Casa de verano)</label>
              <input value={newRes.nombre} onChange={e=>setNewRes(p=>({...p,nombre:e.target.value}))} placeholder="Casa principal, Departamento, Local..." style={{width:"100%",padding:"12px 14px",border:"2px solid #e2e8f0",borderRadius:12,background:"#f8fafc",color:"#0f172a",fontSize:14}}/>
            </div>
            <div><label style={{fontSize:12,fontWeight:600,color:"#64748b",display:"block",marginBottom:4}}>DIRECCION</label>
              <input value={newRes.direccion} onChange={e=>setNewRes(p=>({...p,direccion:e.target.value}))} placeholder="Calle, Colonia, Ciudad" style={{width:"100%",padding:"12px 14px",border:"2px solid #e2e8f0",borderRadius:12,background:"#f8fafc",color:"#0f172a",fontSize:14}}/>
            </div>
            <div><label style={{fontSize:12,fontWeight:600,color:"#64748b",display:"block",marginBottom:4}}>EQUIPOS DE AC</label>
              <input value={newRes.equipos} onChange={e=>setNewRes(p=>({...p,equipos:e.target.value}))} placeholder="Ej: 2 Minisplits LG 1 ton" style={{width:"100%",padding:"12px 14px",border:"2px solid #e2e8f0",borderRadius:12,background:"#f8fafc",color:"#0f172a",fontSize:14}}/>
            </div>
            <button className="pb" onClick={()=>getGPS("residencia")} style={{background:newRes.lat?"#dcfce7":"#1d6fa4",color:newRes.lat?"#15803d":"#fff",padding:"12px",fontSize:14,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              {gpsLoading?"Obteniendo GPS...":newRes.lat?"✅ Ubicacion guardada":"📍 Guardar ubicacion GPS"}
            </button>
            {newRes.lat&&<div style={{fontSize:12,color:"#15803d",textAlign:"center"}}>GPS: {newRes.lat.toFixed(4)}, {newRes.lng.toFixed(4)}</div>}
            <div style={{display:"flex",gap:10,marginTop:4}}>
              <button className="pb" onClick={()=>setResModal(false)} style={{flex:1,background:"#f1f5f9",color:"#64748b",padding:"13px"}}>Cancelar</button>
              <button className="pb" onClick={addResidencia} style={{flex:2,background:"linear-gradient(135deg,#10b981,#059669)",color:"#fff",padding:"13px"}}>Guardar residencia</button>
            </div>
          </div>
        </div>
      </div>}
    </Phone>
  );
}
