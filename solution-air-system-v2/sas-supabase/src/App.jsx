import { useState, useEffect } from "react";

// ── CONFIG ────────────────────────────────────────────────
const LOGO_URL = "https://res.cloudinary.com/duhjgt8rb/image/upload/f_auto,q_auto/Logo_SAS_ybxfcz";
const SUPA_URL = "https://ppjdmzudiphswtluslaj.supabase.co";
const SUPA_KEY = "sb_publishable_z-ONiPzekFH-yBFRxGXDWQ_nLwSdz32";

const h = { "apikey": SUPA_KEY, "Authorization": "Bearer " + SUPA_KEY, "Content-Type": "application/json", "Prefer": "return=representation" };

// ── DATABASE ──────────────────────────────────────────────
const db = {
  get: (table, qs="") => fetch(`${SUPA_URL}/rest/v1/${table}?${qs}`, { headers: h }).then(r => r.json()),
  post: (table, body) => fetch(`${SUPA_URL}/rest/v1/${table}`, { method:"POST", headers: h, body: JSON.stringify(body) }).then(r => r.json()),
  patch: (table, id, body) => fetch(`${SUPA_URL}/rest/v1/${table}?id=eq.${id}`, { method:"PATCH", headers: h, body: JSON.stringify(body) }).then(r => r.json()),

  getClientes: () => db.get("clientes", "select=*,residencias(*)"),
  getClienteByEmail: (email) => db.get("clientes", `email=eq.${encodeURIComponent(email)}&select=*,residencias(*)`),
  createCliente: (d) => db.post("clientes", d),
  createResidencia: (d) => db.post("residencias", d),
  updateResidencia: (id, d) => db.patch("residencias", id, d),
  updateCliente: (id, d) => db.patch("clientes", id, d),

  getCitas: () => db.get("citas", "select=*&order=created_at.desc"),
  getCitasByCliente: (cid) => db.get("citas", `cliente_id=eq.${cid}&order=created_at.desc`),
  createCita: (d) => db.post("citas", d),
  updateCita: (id, d) => db.patch("citas", id, d),

  getHistorial: (cid) => db.get("historial", `cliente_id=eq.${cid}&order=fecha.desc`),

  getCRMUsuarios: () => db.get("crm_usuarios", "select=*&activo=eq.true"),
  getCRMUsuarioByEmail: (email) => db.get("crm_usuarios", `email=eq.${encodeURIComponent(email)}`),
  createCRMUsuario: (d) => db.post("crm_usuarios", d),
  updateCRMUsuario: (id, d) => db.patch("crm_usuarios", id, d),
};

// ── HELPERS ───────────────────────────────────────────────
const MESES = ["","Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const fmt = (iso) => { if(!iso) return "—"; const [,m,d] = iso.split("-"); return `${d} ${MESES[+m]}`; };
const today = () => new Date().toISOString().split("T")[0];
const HORAS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];
const TIPOS = ["Mantenimiento preventivo","Revision general","Limpieza de filtros","Recarga de gas","Reparacion","Instalacion nueva"];

const nextMant = (fechaInstalacion) => {
  if (!fechaInstalacion) return null;
  const d = new Date(fechaInstalacion + "T00:00:00");
  const now = new Date();
  while (d <= now) d.setMonth(d.getMonth() + 6);
  return d.toISOString().split("T")[0];
};

const diasParaMant = (fechaInstalacion) => {
  const next = nextMant(fechaInstalacion);
  if (!next) return null;
  return Math.ceil((new Date(next + "T00:00:00") - new Date()) / 86400000);
};
const OFERTAS = [
  { id:"o1", titulo:"Mantenimiento de Verano", badge:"20% OFF", desc:"Limpieza profunda + revision de gas.", vig:"Valido hasta 30 Jun 2025", grad:"linear-gradient(135deg,#f97316,#ea580c)", icon:"☀️" },
  { id:"o2", titulo:"Plan Anual 3x2", badge:"3 x 2", desc:"Contrata 3 mantenimientos y el tercero es gratis.", vig:"Oferta permanente", grad:"linear-gradient(135deg,#0ea5e9,#0284c7)", icon:"📋" },
  { id:"o3", titulo:"Programa de Referidos", badge:"$300 OFF", desc:"Recomienda a un amigo y ambos obtienen $300.", vig:"Sin fecha limite", grad:"linear-gradient(135deg,#10b981,#059669)", icon:"🎁" },
];

const SC = {
  "Confirmada":               { bg:"#dcfce7", color:"#15803d" },
  "Pendiente de confirmacion":{ bg:"#fef9c3", color:"#a16207" },
  "Reagendada":               { bg:"#dbeafe", color:"#1d4ed8" },
  "Cancelada":                { bg:"#fee2e2", color:"#b91c1c" },
};
const Pill = ({ s }) => { const st = SC[s] || { bg:"#f1f5f9", color:"#64748b" }; return <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600, background:st.bg, color:st.color }}>{s}</span>; };
const Logo = ({ w }) => <img src={LOGO_URL} alt="SAS" style={{ width: w || 150, display:"block", margin:"0 auto" }} onError={e => { e.target.style.display="none"; }} />;

// ═══════════════════════════════════════════════════════════
//  ROOT
// ═══════════════════════════════════════════════════════════
export default function App() {
  const isCRM = window.location.pathname.startsWith("/crm");
  if (isCRM) return <CRM />;
  return <Portal />;
}


// ── CRM LOGIN ─────────────────────────────────────────────
function CRMLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !pass) { setErr("Completa todos los campos."); return; }
    setLoading(true);
    const res = await db.getCRMUsuarioByEmail(email);
    setLoading(false);
    if (res && res.length > 0) {
      const u = res[0];
      if (!u.activo) { setErr("Usuario inactivo."); return; }
      if (u.password_hash === pass) { onLogin(u); }
      else { setErr("Contrasena incorrecta."); }
    } else {
      setErr("Email no encontrado.");
    }
  };

  return (
    <div style={{ fontFamily:"Outfit,sans-serif", minHeight:"100vh", background:"linear-gradient(160deg,#f0f9ff,#e0f2fe 60%,#f8fafc)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={{ background:"#fff", borderRadius:24, padding:"36px 32px", boxShadow:"0 4px 24px rgba(0,0,0,.08)", width:"100%", maxWidth:400 }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <Logo w={150} />
          <div style={{ fontSize:13, fontWeight:700, color:"#1d6fa4", letterSpacing:"1px", marginTop:10 }}>ACCESO CRM</div>
          <div style={{ fontSize:13, color:"#94a3b8", marginTop:4 }}>Solo personal autorizado</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>CORREO</label>
            <input value={email} onChange={e => { setEmail(e.target.value); setErr(""); }} onKeyDown={e => e.key==="Enter"&&login()} placeholder="tu@solutionairsystem.com" autoComplete="email"
              style={{ width:"100%", padding:"13px 15px", background:"#f8fafc", border:`2px solid ${err?"#fca5a5":"#e2e8f0"}`, borderRadius:12, color:"#0f172a", fontSize:15, fontFamily:"Outfit,sans-serif", outline:"none" }} />
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>CONTRASENA</label>
            <input type="password" value={pass} onChange={e => { setPass(e.target.value); setErr(""); }} onKeyDown={e => e.key==="Enter"&&login()} placeholder="••••••••" autoComplete="current-password"
              style={{ width:"100%", padding:"13px 15px", background:"#f8fafc", border:`2px solid ${err?"#fca5a5":"#e2e8f0"}`, borderRadius:12, color:"#0f172a", fontSize:15, fontFamily:"Outfit,sans-serif", outline:"none" }} />
          </div>
          {err && <div style={{ fontSize:13, color:"#dc2626", background:"#fef2f2", padding:"10px 13px", borderRadius:10, fontWeight:500 }}>⚠️ {err}</div>}
          <button onClick={login} disabled={loading} style={{ background:"linear-gradient(135deg,#1d6fa4,#0284c7)", color:"#fff", padding:"14px", fontSize:16, borderRadius:12, border:"none", cursor:"pointer", fontWeight:700, fontFamily:"Outfit,sans-serif", boxShadow:"0 6px 16px rgba(29,111,164,.3)" }}>
            {loading ? "Verificando..." : "Entrar al CRM"}
          </button>
        </div>
        <div style={{ marginTop:20, padding:"12px 14px", background:"#f0f9ff", borderRadius:12, fontSize:12, color:"#0369a1" }}>
          <div style={{ fontWeight:700, marginBottom:4 }}>Credenciales por defecto:</div>
          <div>Admin: admin@solutionairsystem.com</div>
          <div>Secretaria: secretaria@solutionairsystem.com</div>
        </div>
      </div>
    </div>
  );
}

// ── USUARIOS CRM ──────────────────────────────────────────
function UsuariosCRM({ showToast }) {
  const [usuarios, setUsuarios] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await db.getCRMUsuarios();
    setUsuarios(Array.isArray(res) ? res : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const crear = async () => {
    if (!form.nombre || !form.email || !form.password_hash) return;
    await db.createCRMUsuario({ nombre:form.nombre, email:form.email, password_hash:form.password_hash, rol:form.rol||"secretaria" });
    showToast("Usuario creado ✅");
    setModal(false); setForm({});
    load();
  };

  const toggleActivo = async (u) => {
    await db.updateCRMUsuario(u.id, { activo: !u.activo });
    showToast(u.activo ? "Usuario desactivado" : "Usuario activado");
    load();
  };

  const css = `.cb{cursor:pointer;border:none;border-radius:9px;padding:9px 16px;font-family:Outfit,sans-serif;font-size:14px;font-weight:600;transition:all .2s}.cc{background:#fff;border:1px solid #e2e8f0;border-radius:14px;box-shadow:0 1px 6px rgba(0,0,0,.06)}.ov{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px}.mo{background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:26px;width:480px;max-width:100%;max-height:90vh;overflow-y:auto}.fl{display:flex;flex-direction:column;gap:4px}label{font-size:12px;color:#64748b;display:block;margin-bottom:4px;font-weight:500}input,select{background:#f8fafc;border:1px solid #e2e8f0;color:#1e293b;padding:10px 14px;border-radius:8px;font-family:Outfit,sans-serif;font-size:14px;width:100%;outline:none}`;

  return (
    <div>
      <style>{css}</style>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h1 style={{ fontSize:22, fontWeight:800, color:"#0f172a" }}>👥 Usuarios CRM</h1>
        <button className="cb" onClick={() => { setForm({ rol:"secretaria" }); setModal(true); }} style={{ background:"linear-gradient(135deg,#1d6fa4,#0284c7)", color:"#fff", padding:"10px 18px" }}>+ Nuevo usuario</button>
      </div>
      {loading ? <div style={{ textAlign:"center", padding:40, color:"#94a3b8" }}>Cargando...</div> : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
          {usuarios.map(u => (
            <div key={u.id} className="cc" style={{ padding:18 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg,${u.rol==="admin"?"#7c3aed,#6d28d9":"#1d6fa4,#0284c7"})`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:18 }}>
                  {u.nombre.slice(0,2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight:700, fontSize:15 }}>{u.nombre}</div>
                  <div style={{ fontSize:12, color:"#64748b", textTransform:"capitalize" }}>{u.rol}</div>
                </div>
                <span style={{ marginLeft:"auto", fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:10, background:u.activo?"#dcfce7":"#fee2e2", color:u.activo?"#15803d":"#dc2626" }}>{u.activo?"Activo":"Inactivo"}</span>
              </div>
              <div style={{ fontSize:13, color:"#64748b", marginBottom:12 }}>📧 {u.email}</div>
              <button onClick={() => toggleActivo(u)} style={{ width:"100%", padding:"8px", borderRadius:8, border:`1px solid ${u.activo?"#fecaca":"#bbf7d0"}`, background:u.activo?"#fef2f2":"#f0fdf4", color:u.activo?"#dc2626":"#15803d", cursor:"pointer", fontFamily:"Outfit,sans-serif", fontSize:13, fontWeight:600 }}>
                {u.activo ? "Desactivar" : "Activar"}
              </button>
            </div>
          ))}
        </div>
      )}
      {modal && (
        <div className="ov" onClick={() => { setModal(false); setForm({}); }}>
          <div className="mo" onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight:800, fontSize:18, marginBottom:16, color:"#0f172a" }}>👥 Nuevo usuario CRM</div>
            <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
              <div className="fl"><label>Nombre completo *</label><input value={form.nombre||""} onChange={e=>setForm(p=>({...p,nombre:e.target.value}))}/></div>
              <div className="fl"><label>Email *</label><input type="email" value={form.email||""} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/></div>
              <div className="fl"><label>Contrasena *</label><input type="password" value={form.password_hash||""} onChange={e=>setForm(p=>({...p,password_hash:e.target.value}))}/></div>
              <div className="fl"><label>Rol</label>
                <select value={form.rol||"secretaria"} onChange={e=>setForm(p=>({...p,rol:e.target.value}))}>
                  <option value="secretaria">Secretaria</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:20 }}>
              <button className="cb" onClick={()=>{setModal(false);setForm({});}} style={{ flex:1, background:"#f1f5f9", color:"#64748b", padding:"12px" }}>Cancelar</button>
              <button className="cb" onClick={crear} style={{ flex:2, background:"linear-gradient(135deg,#1d6fa4,#0284c7)", color:"#fff", padding:"12px" }}>Crear usuario</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  CRM
// ═══════════════════════════════════════════════════════════
function CRM() {
  const [usuario, setUsuario] = useState(null);
  const [tab, setTab] = useState("citas");
  const [clientes, setClientes] = useState([]);
  const [citas, setCitas] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [cls, cts] = await Promise.all([db.getClientes(), db.getCitas()]);
    setClientes(Array.isArray(cls) ? cls : []);
    setCitas(Array.isArray(cts) ? cts : []);
    setLoading(false);
  };

  useEffect(() => { if(usuario) load(); }, [usuario]); // eslint-disable-line

  const showToast = (msg, type = "ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 4000); };

  const confirmar = async (id, nota, nf, nh) => {
    const rea = !!(nf || nh);
    const upd = { status: rea ? "Reagendada" : "Confirmada", nota_secretaria: nota || "" };
    if (nf) upd.fecha = nf;
    if (nh) upd.hora = nh;
    await db.updateCita(id, upd);
    showToast("Cita actualizada ✅");
    setModal(null); setForm({});
    load();
  };

  const rechazar = async (id, nota) => {
    await db.updateCita(id, { status: "Cancelada", nota_secretaria: nota || "" });
    showToast("Cita cancelada");
    setModal(null); setForm({});
    load();
  };

  const crearCliente = async () => {
    if (!form.nombre || !form.email) return;
    const avatar = form.nombre.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    // Generate temp password from phone last 4 digits or default
    const tempPass = form.telefono ? form.telefono.slice(-4) : "1234";
    const res = await db.createCliente({ nombre: form.nombre, email: form.email, password_hash: tempPass, telefono: form.telefono || "", avatar });
    const cl = Array.isArray(res) ? res[0] : res;
    if (cl?.id) {
      await db.createResidencia({
        cliente_id: cl.id,
        nombre: form.resNombre || "Residencia principal",
        direccion: form.direccion || "",
        equipos: form.equipos || "",
        marca: form.marca || "",
        modelo: form.modelo || "",
        serie: form.serie || "",
        fecha_instalacion: form.fecha_instalacion || null,
        lat: null, lng: null
      });
    }
    showToast("Cliente creado ✅ Contrasena temporal: " + tempPass);
    setModal(null); setForm({});
    load();
  };

  const filter = (arr) => search ? arr.filter(i => JSON.stringify(i).toLowerCase().includes(search.toLowerCase())) : arr;
  const pendientes = citas.filter(c => c.status === "Pendiente de confirmacion");

  const Nav = ({ id, icon, label, badge }) => (
    <div onClick={() => setTab(id)} style={{ cursor:"pointer", padding:"9px 14px", borderRadius:8, display:"flex", alignItems:"center", gap:10, fontSize:14, fontWeight:500, background: tab===id ? "#eff6ff" : "transparent", color: tab===id ? "#1d6fa4" : "#64748b" }}>
      <span>{icon}</span><span style={{ flex:1 }}>{label}</span>
      {badge > 0 && <span style={{ background:"#ef4444", color:"#fff", borderRadius:10, fontSize:11, padding:"1px 7px", fontWeight:700 }}>{badge}</span>}
    </div>
  );

  if (!usuario) return <CRMLogin onLogin={(u) => setUsuario(u)} />;

  return (
    <div style={{ fontFamily:"Outfit,sans-serif", background:"#f8fafc", minHeight:"100vh", color:"#1e293b", display:"flex" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}input,select,textarea{background:#f8fafc;border:1px solid #e2e8f0;color:#1e293b;padding:10px 14px;border-radius:8px;font-family:Outfit,sans-serif;font-size:14px;width:100%;outline:none}input:focus,select:focus,textarea:focus{border-color:#1d6fa4}select option{background:#fff}.cb{cursor:pointer;border:none;border-radius:9px;padding:9px 16px;font-family:Outfit,sans-serif;font-size:14px;font-weight:600;transition:all .2s}.cb:hover{opacity:.88}.cc{background:#fff;border:1px solid #e2e8f0;border-radius:14px;box-shadow:0 1px 6px rgba(0,0,0,.06)}.ov{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px}.mo{background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:26px;width:520px;max-width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 8px 32px rgba(0,0,0,.12)}table{width:100%;border-collapse:collapse}th{text-align:left;padding:10px 14px;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#94a3b8;border-bottom:1px solid #f1f5f9;font-weight:600;background:#f8fafc}td{padding:11px 14px;font-size:14px;border-bottom:1px solid #f1f5f9;vertical-align:middle}tr:hover td{background:#fafafa}.fade{animation:fi .3s ease both}@keyframes fi{from{opacity:0}to{opacity:1}}label{font-size:12px;color:#64748b;display:block;margin-bottom:4px;font-weight:500}.fl{display:flex;flex-direction:column;gap:4px}.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px}`}</style>

      {toast && <div className="fade" style={{ position:"fixed", top:20, right:20, zIndex:200, background: toast.type==="ok" ? "#f0fdf4" : "#fefce8", border:`1px solid ${toast.type==="ok"?"#bbf7d0":"#fde68a"}`, borderRadius:14, padding:"14px 18px", fontSize:14, fontWeight:600, color: toast.type==="ok" ? "#15803d" : "#a16207", boxShadow:"0 4px 16px rgba(0,0,0,.1)" }}>{toast.msg}</div>}

      {/* SIDEBAR */}
      <div style={{ width:230, borderRight:"1px solid #e2e8f0", padding:"18px 10px", display:"flex", flexDirection:"column", gap:3, flexShrink:0, background:"#fff" }}>
        <div style={{ padding:"12px 8px 16px", borderBottom:"1px solid #e2e8f0", marginBottom:6 }}>
          <Logo w={120} />
        </div>
        <Nav id="citas"     icon="📅" label="Gestion de citas"  badge={pendientes.length} />
        <Nav id="clientes"  icon="👤" label="Clientes" />
        <Nav id="historial" icon="🔧" label="Historial" />
        {usuario?.rol === "admin" && <Nav id="usuarios" icon="👥" label="Usuarios CRM" />}
        <div style={{ borderTop:"1px solid #e2e8f0", margin:"8px 4px" }} />
        <div style={{ padding:"8px 14px" }}>
          <div style={{ fontSize:13, fontWeight:600, color:"#0f172a" }}>{usuario?.nombre}</div>
          <div style={{ fontSize:11, color:"#94a3b8", marginTop:1, textTransform:"capitalize" }}>{usuario?.rol}</div>
        </div>
        <div onClick={() => setUsuario(null)} style={{ cursor:"pointer", padding:"9px 14px", borderRadius:8, display:"flex", alignItems:"center", gap:10, fontSize:13, fontWeight:500, color:"#ef4444", margin:"0 4px" }}>
          🚪 Cerrar sesion
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex:1, overflow:"auto", padding:28 }}>
        {loading && <div style={{ textAlign:"center", padding:40, color:"#94a3b8", fontSize:16 }}>⏳ Cargando datos...</div>}

        {/* CITAS */}
        {!loading && tab === "citas" && (
          <div className="fade">
            <div style={{ marginBottom:20 }}>
              <h1 style={{ fontSize:22, fontWeight:800, color:"#0f172a" }}>📅 Gestion de citas</h1>
              <p style={{ color:"#64748b", fontSize:13, marginTop:3 }}>{pendientes.length} pendiente{pendientes.length !== 1 ? "s" : ""} de confirmacion</p>
            </div>
            {pendientes.length > 0 && (
              <div style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:14, padding:"16px 18px", marginBottom:20 }}>
                <div style={{ fontWeight:700, color:"#a16207", marginBottom:12, fontSize:14 }}>⏳ Pendientes de confirmar</div>
                {pendientes.map(c => (
                  <div key={c.id} style={{ background:"#fff", border:"1px solid #fde68a", borderRadius:12, padding:"14px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, flexWrap:"wrap", marginBottom:8 }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15 }}>{c.cliente_nombre}</div>
                      <div style={{ fontSize:13, color:"#64748b", marginTop:2 }}>{c.tipo} · {fmt(c.fecha)} {c.hora}</div>
                      <div style={{ fontSize:12, color:"#1d6fa4", marginTop:2 }}>📍 {c.residencia}: {c.direccion}</div>
                      {c.lat && c.lng && <a href={`https://maps.google.com/?q=${c.lat},${c.lng}`} target="_blank" rel="noreferrer" style={{ fontSize:12, color:"#10b981", fontWeight:600 }}>🗺 Ver en Maps</a>}
                      {c.notas && <div style={{ fontSize:12, color:"#94a3b8", marginTop:3, fontStyle:"italic" }}>📝 {c.notas}</div>}
                    </div>
                    <button className="cb" onClick={() => { setForm({ ...c, nf:"", nh:"", notaSec:"" }); setModal("gestion"); }} style={{ background:"linear-gradient(135deg,#f59e0b,#d97706)", color:"#fff", whiteSpace:"nowrap" }}>Gestionar →</button>
                  </div>
                ))}
              </div>
            )}
            <input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth:300, marginBottom:14 }} />
            <div className="cc" style={{ overflow:"hidden" }}>
              <table>
                <thead><tr><th>Cliente</th><th>Servicio</th><th>Residencia</th><th>Fecha</th><th>Hora</th><th>Status</th><th>Mapa</th><th></th></tr></thead>
                <tbody>
                  {filter(citas).map(c => (
                    <tr key={c.id}>
                      <td style={{ fontWeight:600 }}>{c.cliente_nombre}</td>
                      <td style={{ color:"#64748b", fontSize:13 }}>{c.tipo}</td>
                      <td style={{ color:"#64748b", fontSize:13 }}>{c.residencia || "—"}</td>
                      <td style={{ color:"#64748b" }}>{fmt(c.fecha)}</td>
                      <td style={{ color:"#64748b" }}>{c.hora}</td>
                      <td><Pill s={c.status} /></td>
                      <td>{c.lat && c.lng ? <a href={`https://maps.google.com/?q=${c.lat},${c.lng}`} target="_blank" rel="noreferrer" style={{ color:"#10b981", fontSize:13, fontWeight:600 }}>🗺</a> : <span style={{ color:"#cbd5e1" }}>—</span>}</td>
                      <td>{c.status !== "Cancelada" && <button className="cb" onClick={() => { setForm({ ...c, nf:"", nh:"", notaSec:"" }); setModal("gestion"); }} style={{ background:"#eff6ff", color:"#1d6fa4", padding:"5px 12px", fontSize:12 }}>✏️</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {citas.length === 0 && <div style={{ padding:40, textAlign:"center", color:"#94a3b8" }}>Sin citas aun.</div>}
            </div>
          </div>
        )}

        {/* USUARIOS CRM */}
        {!loading && tab === "usuarios" && usuario?.rol === "admin" && (
          <UsuariosCRM showToast={showToast} />
        )}

        {/* CLIENTES */}
        {!loading && tab === "clientes" && (
          <div className="fade">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h1 style={{ fontSize:22, fontWeight:800, color:"#0f172a" }}>👤 Clientes</h1>
              <button className="cb" onClick={() => { setForm({}); setModal("cliente"); }} style={{ background:"linear-gradient(135deg,#1d6fa4,#0284c7)", color:"#fff", padding:"10px 18px" }}>+ Nuevo cliente</button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {clientes.map(cl => (
                <div key={cl.id} className="cc" style={{ padding:18 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                    <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#1d6fa4,#0284c7)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:16 }}>{cl.avatar || cl.nombre?.slice(0,2).toUpperCase()}</div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:16 }}>{cl.nombre}</div>
                      <div style={{ fontSize:13, color:"#64748b" }}>{cl.email} · {cl.telefono}</div>
                    </div>
                  </div>
                  <div style={{ fontSize:13, fontWeight:600, color:"#64748b", marginBottom:8 }}>Residencias ({cl.residencias?.length || 0})</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {(cl.residencias || []).map(r => (
                      <div key={r.id} style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10, padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div>
                          <div style={{ fontWeight:600, fontSize:14 }}>🏠 {r.nombre}</div>
                          <div style={{ fontSize:13, color:"#64748b", marginTop:2 }}>📍 {r.direccion}</div>
                          {r.equipos && <div style={{ fontSize:12, color:"#94a3b8", marginTop:1 }}>❄️ {r.equipos}</div>}
                        </div>
                        {r.lat && r.lng && <a href={`https://maps.google.com/?q=${r.lat},${r.lng}`} target="_blank" rel="noreferrer" style={{ background:"#dcfce7", color:"#15803d", padding:"6px 12px", borderRadius:8, fontSize:12, fontWeight:600, textDecoration:"none" }}>🗺 Maps</a>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {clientes.length === 0 && <div style={{ textAlign:"center", padding:40, color:"#94a3b8" }}>Sin clientes aun. Agrega el primero.</div>}
            </div>
          </div>
        )}

        {/* HISTORIAL */}
        {!loading && tab === "historial" && (
          <div className="fade">
            <h1 style={{ fontSize:22, fontWeight:800, color:"#0f172a", marginBottom:16 }}>🔧 Historial de servicios</h1>
            <div className="cc" style={{ padding:40, textAlign:"center", color:"#94a3b8" }}>
              El historial se mostrara aqui cuando los tecnicos completen work orders.
            </div>
          </div>
        )}
      </div>

      {/* MODAL GESTION */}
      {modal === "gestion" && (
        <div className="ov" onClick={() => { setModal(null); setForm({}); }}>
          <div className="mo" onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight:800, fontSize:18, marginBottom:4, color:"#0f172a" }}>Gestionar cita</div>
            <div style={{ fontSize:13, color:"#64748b", marginBottom:16 }}>Confirma, reagenda o cancela la solicitud.</div>
            <div style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:12, padding:"14px 16px", marginBottom:16 }}>
              {[{ l:"Cliente", v:form.cliente_nombre }, { l:"Servicio", v:form.tipo }, { l:"Residencia", v:form.residencia }, { l:"Direccion", v:form.direccion }, { l:"Fecha", v:fmt(form.fecha) }, { l:"Hora", v:form.hora }].map(r => (
                <div key={r.l} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid #e2e8f0", fontSize:14 }}>
                  <span style={{ color:"#64748b" }}>{r.l}</span><span style={{ fontWeight:600 }}>{r.v || "—"}</span>
                </div>
              ))}
              {form.lat && form.lng && <a href={`https://maps.google.com/?q=${form.lat},${form.lng}`} target="_blank" rel="noreferrer" style={{ color:"#10b981", fontSize:13, fontWeight:600, display:"block", marginTop:8 }}>🗺 Ver en Google Maps</a>}
              {form.notas && <div style={{ marginTop:10, fontSize:13, color:"#94a3b8", fontStyle:"italic" }}>📝 {form.notas}</div>}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
              <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:12, padding:"14px 16px" }}>
                <div style={{ fontSize:13, fontWeight:600, color:"#1d4ed8", marginBottom:11 }}>🔄 Reagendar (opcional)</div>
                <div className="g2">
                  <div className="fl"><label>Nueva fecha</label><input type="date" value={form.nf || ""} min={today()} onChange={e => setForm(p => ({ ...p, nf:e.target.value }))} /></div>
                  <div className="fl"><label>Nueva hora</label>
                    <select value={form.nh || ""} onChange={e => setForm(p => ({ ...p, nh:e.target.value }))}>
                      <option value="">Misma hora</option>
                      {HORAS.map(h => <option key={h}>{h}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="fl"><label>Nota para el cliente</label><textarea rows={3} value={form.notaSec || ""} onChange={e => setForm(p => ({ ...p, notaSec:e.target.value }))} /></div>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:18 }}>
              <button className="cb" onClick={() => rechazar(form.id, form.notaSec)} style={{ flex:1, background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", padding:"12px" }}>Cancelar cita</button>
              <button className="cb" onClick={() => confirmar(form.id, form.notaSec, form.nf, form.nh)} style={{ flex:2, background:"linear-gradient(135deg,#10b981,#059669)", color:"#fff", padding:"12px" }}>{form.nf || form.nh ? "Reagendar" : "Confirmar"} ✓</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CLIENTE */}
      {modal === "cliente" && (
        <div className="ov" onClick={() => { setModal(null); setForm({}); }}>
          <div className="mo" onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight:800, fontSize:18, marginBottom:16, color:"#0f172a" }}>👤 Nuevo cliente</div>
            <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
              <div style={{ background:"#f0f9ff", border:"1px solid #bae6fd", borderRadius:12, padding:"12px 14px" }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#0369a1", marginBottom:10 }}>👤 Datos del cliente</div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <div className="fl"><label>Nombre completo *</label><input value={form.nombre || ""} onChange={e => setForm(p => ({ ...p, nombre:e.target.value }))} /></div>
                  <div className="g2">
                    <div className="fl"><label>Email *</label><input type="email" value={form.email || ""} onChange={e => setForm(p => ({ ...p, email:e.target.value }))} /></div>
                    <div className="fl"><label>Telefono</label><input value={form.telefono || ""} onChange={e => setForm(p => ({ ...p, telefono:e.target.value }))} /></div>
                  </div>
                </div>
              </div>
              <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:12, padding:"12px 14px" }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#15803d", marginBottom:10 }}>🏠 Residencia</div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <div className="fl"><label>Nombre de residencia</label><input value={form.resNombre || ""} onChange={e => setForm(p => ({ ...p, resNombre:e.target.value }))} placeholder="Casa principal, Oficina..." /></div>
                  <div className="fl"><label>Direccion</label><input value={form.direccion || ""} onChange={e => setForm(p => ({ ...p, direccion:e.target.value }))} placeholder="Calle, Colonia, Ciudad" /></div>
                </div>
              </div>
              <div style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:12, padding:"12px 14px" }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#a16207", marginBottom:10 }}>❄️ Equipo instalado</div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <div className="fl"><label>Descripcion</label><input value={form.equipos || ""} onChange={e => setForm(p => ({ ...p, equipos:e.target.value }))} placeholder="Minisplit 1.5 ton" /></div>
                  <div className="g2">
                    <div className="fl"><label>Marca</label><input value={form.marca || ""} onChange={e => setForm(p => ({ ...p, marca:e.target.value }))} placeholder="LG, Carrier..." /></div>
                    <div className="fl"><label>Modelo</label><input value={form.modelo || ""} onChange={e => setForm(p => ({ ...p, modelo:e.target.value }))} placeholder="LV181HV4" /></div>
                  </div>
                  <div className="g2">
                    <div className="fl"><label>No. de serie</label><input value={form.serie || ""} onChange={e => setForm(p => ({ ...p, serie:e.target.value }))} placeholder="SN-123456" /></div>
                    <div className="fl"><label>Fecha instalacion</label><input type="date" value={form.fecha_instalacion || ""} onChange={e => setForm(p => ({ ...p, fecha_instalacion:e.target.value }))} /></div>
                  </div>
                </div>
              </div>
              <div style={{ background:"#f1f5f9", border:"1px solid #e2e8f0", borderRadius:10, padding:"10px 14px", fontSize:12, color:"#64748b" }}>
                💡 La contrasena temporal sera los ultimos 4 digitos del telefono
              </div>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:20 }}>
              <button className="cb" onClick={() => { setModal(null); setForm({}); }} style={{ flex:1, background:"#f1f5f9", color:"#64748b", padding:"12px" }}>Cancelar</button>
              <button className="cb" onClick={crearCliente} style={{ flex:2, background:"linear-gradient(135deg,#1d6fa4,#0284c7)", color:"#fff", padding:"12px" }}>Crear cliente</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ── LOGIN SCREEN (stable component - fixes input focus bug) ──────────────
function LoginScreen({ lf, setLf, loading, onSubmit, onRegister }) {
  return (
    <PhoneShell>
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:"#f1f5f9" }}>
        <div style={{ background:"#fff", padding:"48px 28px 28px", textAlign:"center", boxShadow:"0 2px 16px rgba(0,0,0,.06)" }}>
          <Logo w={160} />
          <div style={{ fontSize:12, fontWeight:600, color:"#1d6fa4", letterSpacing:"1px", marginTop:10 }}>PORTAL DE CLIENTES</div>
        </div>
        <div style={{ flex:1, padding:"28px 20px 40px" }}>
          <div style={{ fontSize:21, fontWeight:700, color:"#0f172a", marginBottom:4 }}>Bienvenido 👋</div>
          <div style={{ fontSize:14, color:"#64748b", marginBottom:22 }}>Inicia sesion para ver tu cuenta</div>
          <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>CORREO</label>
              <input
                value={lf.email}
                onChange={e => setLf(p => ({ ...p, email:e.target.value, err:"" }))}
                onKeyDown={e => e.key === "Enter" && onSubmit()}
                placeholder="tu@correo.com"
                autoComplete="email"
                style={{ width:"100%", padding:"13px 15px", background:"#fff", border:`2px solid ${lf.err ? "#fca5a5" : "#e2e8f0"}`, borderRadius:13, color:"#0f172a", fontSize:16, fontFamily:"Outfit,sans-serif", outline:"none" }}
              />
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>CONTRASENA</label>
              <input
                type="password"
                value={lf.pass}
                onChange={e => setLf(p => ({ ...p, pass:e.target.value, err:"" }))}
                onKeyDown={e => e.key === "Enter" && onSubmit()}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{ width:"100%", padding:"13px 15px", background:"#fff", border:`2px solid ${lf.err ? "#fca5a5" : "#e2e8f0"}`, borderRadius:13, color:"#0f172a", fontSize:16, fontFamily:"Outfit,sans-serif", outline:"none" }}
              />
            </div>
            {lf.err && <div style={{ fontSize:13, color:"#dc2626", background:"#fef2f2", padding:"10px 13px", borderRadius:10, fontWeight:500 }}>⚠️ {lf.err}</div>}
            <button onClick={onSubmit} disabled={loading} style={{ background:"linear-gradient(135deg,#1d6fa4,#0284c7)", color:"#fff", padding:"15px", fontSize:16, marginTop:4, boxShadow:"0 8px 20px rgba(29,111,164,.35)", border:"none", borderRadius:14, fontFamily:"Outfit,sans-serif", fontWeight:600, cursor:"pointer" }}>{loading ? "Verificando..." : "Entrar"}</button>
            <button onClick={onRegister} style={{ background:"#f1f5f9", color:"#1d6fa4", padding:"13px", fontSize:15, border:"2px solid #bfdbfe", borderRadius:14, fontFamily:"Outfit,sans-serif", fontWeight:600, cursor:"pointer" }}>Crear cuenta nueva</button>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}

// ── PHONE SHELL ───────────────────────────────────────────
const PORTAL_CSS = `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}input,select,textarea{font-family:Outfit,sans-serif;font-size:15px;outline:none;transition:all .2s}.pb{cursor:pointer;border:none;font-family:Outfit,sans-serif;font-weight:600;transition:all .2s;border-radius:14px}.pb:active{transform:scale(.97)}.pc{background:#fff;border-radius:20px;padding:20px;box-shadow:0 2px 12px rgba(0,0,0,.06)}.tbar{display:flex;background:#fff;border-top:1px solid #e2e8f0;position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;z-index:50}.tbtn{flex:1;padding:11px 4px 9px;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;border:none;background:transparent;font-family:Outfit,sans-serif;font-size:11px;font-weight:500;color:#94a3b8;transition:color .2s}.tbtn.on{color:#1d6fa4}.sl{animation:su .3s ease both}@keyframes su{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}.fade{animation:fi .3s ease both}@keyframes fi{from{opacity:0}to{opacity:1}}.dot{width:8px;height:8px;border-radius:50%;background:#e2e8f0;transition:background .3s}.dot.on{background:#1d6fa4}input[type=date]::-webkit-calendar-picker-indicator{opacity:.5;cursor:pointer}.ov2{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100;display:flex;align-items:flex-end;justify-content:center}.sh{background:#fff;border-radius:24px 24px 0 0;padding:24px;width:100%;max-width:430px;max-height:85vh;overflow-y:auto}`;

function PhoneShell({ children }) {
  return (
    <div style={{ display:"flex", justifyContent:"center", minHeight:"100vh", background:"linear-gradient(160deg,#e0f2fe,#bfdbfe 50%,#ddd6fe)" }}>
      <style>{PORTAL_CSS}</style>
      <div style={{ width:"100%", maxWidth:430, minHeight:"100vh", background:"#f1f5f9", overflow:"hidden", boxShadow:"0 0 60px rgba(0,0,0,.15)" }}>{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  PORTAL
// ═══════════════════════════════════════════════════════════
function Portal() {
  const [screen, setScreen] = useState("login");
  const [cliente, setCliente] = useState(null);
  const [tab, setTab] = useState("inicio");
  const [lf, setLf] = useState({ email:"", pass:"", err:"" });
  const [rf, setRf] = useState({ nombre:"", email:"", pass:"", pass2:"", tel:"", direccion:"", lat:null, lng:null, err:"" });
  const [cf, setCf] = useState({ tipo:"", fecha:"", hora:"", notas:"", residenciaId:"", step:1 });
  const [citas, setCitas] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [exito, setExito] = useState(false);
  const [detalle, setDetalle] = useState(null);
  const [resModal, setResModal] = useState(false);
  const [editResModal, setEditResModal] = useState(false);
  const [editResData, setEditResData] = useState(null);
  const [newRes, setNewRes] = useState({ nombre:"", direccion:"", equipos:"", marca:"", modelo:"", serie:"", fecha_instalacion:"", lat:null, lng:null });
  const [gpsLoad, setGpsLoad] = useState(false);
  const [loading, setLoading] = useState(false);

  const misRes = cliente?.residencias || [];

  const loadData = async (cl) => {
    const [cts, hist] = await Promise.all([db.getCitasByCliente(cl.id), db.getHistorial(cl.id)]);
    setCitas(Array.isArray(cts) ? cts : []);
    setHistorial(Array.isArray(hist) ? hist : []);
  };

  const login = async () => {
    if (!lf.email || !lf.pass) return;
    setLoading(true);
    try {
      const res = await db.getClienteByEmail(lf.email);
      if (res && res.length > 0) {
        const cl = res[0];
        if (cl.password_hash === lf.pass) {
          const [cts, hist] = await Promise.all([db.getCitasByCliente(cl.id), db.getHistorial(cl.id)]);
          setCitas(Array.isArray(cts) ? cts : []);
          setHistorial(Array.isArray(hist) ? hist : []);
          setCliente(cl);
          setLoading(false);
          setLf({ email:"", pass:"", err:"" });
          setScreen("app");
        } else {
          setLf(p => ({ ...p, err:"Contrasena incorrecta." }));
          setLoading(false);
        }
      } else {
        setLf(p => ({ ...p, err:"Email no encontrado. Registrate primero." }));
        setLoading(false);
      }
    } catch(e) {
      setLf(p => ({ ...p, err:"Error de conexion. Intenta de nuevo." }));
      setLoading(false);
    }
  };

  const registrar = async () => {
    if (!rf.nombre || !rf.email || !rf.pass || !rf.tel) { setRf(p => ({ ...p, err:"Completa todos los campos." })); return; }
    if (rf.pass !== rf.pass2) { setRf(p => ({ ...p, err:"Las contrasenas no coinciden." })); return; }
    setLoading(true);
    try {
      const exist = await db.getClienteByEmail(rf.email);
      if (exist && exist.length > 0) { setRf(p => ({ ...p, err:"Este email ya esta registrado." })); setLoading(false); return; }
      const avatar = rf.nombre.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
      const res = await db.createCliente({ nombre:rf.nombre, email:rf.email, password_hash:rf.pass, telefono:rf.tel, avatar });
      const cl = Array.isArray(res) ? res[0] : res;
      if (!cl?.id) { setRf(p => ({ ...p, err:"Error al crear cuenta. Intenta de nuevo." })); setLoading(false); return; }
      await db.createResidencia({ cliente_id:cl.id, nombre:"Mi residencia", direccion:rf.direccion || "Por definir", lat:rf.lat||null, lng:rf.lng||null, equipos:"" });
      const clFull = await db.getClienteByEmail(rf.email);
      const clienteFinal = Array.isArray(clFull) && clFull.length > 0 ? clFull[0] : cl;
      const [cts, hist] = await Promise.all([db.getCitasByCliente(clienteFinal.id), db.getHistorial(clienteFinal.id)]);
      setCitas(Array.isArray(cts) ? cts : []);
      setHistorial(Array.isArray(hist) ? hist : []);
      setCliente(clienteFinal);
      setLoading(false);
      setScreen("app");
    } catch(e) {
      setRf(p => ({ ...p, err:"Error de conexion. Intenta de nuevo." }));
      setLoading(false);
    }
  };

  const getGPS = (target) => {
    setGpsLoad(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude:lat, longitude:lng } = pos.coords;
        if (target === "reg") setRf(p => ({ ...p, lat, lng }));
        if (target === "res") setNewRes(p => ({ ...p, lat, lng }));
        if (target === "edit") setEditResData(p => ({ ...p, lat, lng }));
        setGpsLoad(false);
      },
      () => { setGpsLoad(false); alert("Activa el GPS e intenta de nuevo."); }
    );
  };

  const addResidencia = async () => {
    if (!newRes.nombre || !newRes.direccion) return;
    try {
      await db.createResidencia({
        cliente_id:cliente.id, nombre:newRes.nombre, direccion:newRes.direccion,
        lat:newRes.lat||null, lng:newRes.lng||null, equipos:newRes.equipos||"",
        marca:newRes.marca||"", modelo:newRes.modelo||"", serie:newRes.serie||"",
        fecha_instalacion:newRes.fecha_instalacion||null
      });
      const clFull = await db.getClienteByEmail(cliente.email);
      const clActual = Array.isArray(clFull) && clFull.length > 0 ? clFull[0] : cliente;
      setCliente(clActual);
      setNewRes({ nombre:"", direccion:"", equipos:"", marca:"", modelo:"", serie:"", fecha_instalacion:"", lat:null, lng:null });
      setResModal(false);
    } catch(e) {
      alert("Error al guardar. Intenta de nuevo.");
    }
  };

  const editResidencia = async () => {
    if (!editResData?.id) return;
    try {
      await db.updateResidencia(editResData.id, {
        nombre: editResData.nombre,
        direccion: editResData.direccion,
        equipos: editResData.equipos || "",
        marca: editResData.marca || "",
        modelo: editResData.modelo || "",
        serie: editResData.serie || "",
        fecha_instalacion: editResData.fecha_instalacion || null,
        lat: editResData.lat || null,
        lng: editResData.lng || null,
      });
      const clFull = await db.getClienteByEmail(cliente.email);
      const clActual = Array.isArray(clFull) && clFull.length > 0 ? clFull[0] : cliente;
      setCliente(clActual);
      setEditResModal(false);
      setEditResData(null);
    } catch(e) {
      alert("Error al actualizar. Intenta de nuevo.");
    }
  };

  const agendar = async () => {
    if (!cf.tipo || !cf.fecha || !cf.hora || !cf.residenciaId) return;
    const res = misRes.find(r => r.id === cf.residenciaId);
    await db.createCita({
      cliente_id:cliente.id, cliente_nombre:cliente.nombre, cliente_tel:cliente.telefono,
      fecha:cf.fecha, hora:cf.hora, tipo:cf.tipo,
      residencia:res?.nombre || "", direccion:res?.direccion || "",
      lat:res?.lat || null, lng:res?.lng || null,
      notas:cf.notas, status:"Pendiente de confirmacion", nota_secretaria:""
    });
    setCf({ tipo:"", fecha:"", hora:"", notas:"", residenciaId:"", step:1 });
    setExito(true);
    setTimeout(() => { setExito(false); setTab("citas"); loadData(cliente); }, 2800);
  };

  const cancelar = async (id) => {
    await db.updateCita(id, { status:"Cancelada" });
    loadData(cliente);
  };

  const logout = () => { setCliente(null); setScreen("login"); setTab("inicio"); setCitas([]); setHistorial([]); };

  const Phone = ({ children }) => <PhoneShell>{children}</PhoneShell>;

  if (screen === "login") return <LoginScreen lf={lf} setLf={setLf} loading={loading} onSubmit={login} onRegister={() => setScreen("registro")} />;

  if (screen === "registro") return (
    <PhoneShell>
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
        <div style={{ background:"linear-gradient(135deg,#1d6fa4,#0284c7)", padding:"50px 22px 24px" }}>
          <div style={{ fontSize:22, fontWeight:800, color:"#fff" }}>Crear cuenta 👤</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,.8)", marginTop:3 }}>Registro rapido</div>
        </div>
        <div style={{ flex:1, padding:"20px 20px 40px", overflowY:"auto", background:"#f1f5f9" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
            {[
              { label:"NOMBRE COMPLETO *", key:"nombre", type:"text", placeholder:"Juan Perez" },
              { label:"TELEFONO *", key:"tel", type:"tel", placeholder:"5512345678" },
              { label:"CORREO ELECTRONICO *", key:"email", type:"email", placeholder:"tu@correo.com" },
              { label:"CONTRASENA *", key:"pass", type:"password", placeholder:"Minimo 4 caracteres" },
              { label:"CONFIRMAR CONTRASENA *", key:"pass2", type:"password", placeholder:"Repite tu contrasena" },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>{f.label}</label>
                <input type={f.type} value={rf[f.key] || ""} onChange={e => setRf(p => ({ ...p, [f.key]:e.target.value }))} placeholder={f.placeholder} style={{ width:"100%", padding:"13px 15px", background:"#fff", border:"2px solid #e2e8f0", borderRadius:13, color:"#0f172a" }} />
              </div>
            ))}
            <div style={{ background:"#f0f9ff", border:"1px solid #bae6fd", borderRadius:14, padding:"14px 16px" }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#0369a1", marginBottom:10 }}>📍 Tu primera residencia</div>
              <input value={rf.direccion || ""} onChange={e => setRf(p => ({ ...p, direccion:e.target.value }))} placeholder="Calle, Colonia, Ciudad" style={{ width:"100%", padding:"11px 13px", background:"#fff", border:"2px solid #e2e8f0", borderRadius:12, color:"#0f172a", fontSize:14, marginBottom:8 }} />
              <button className="pb" onClick={() => getGPS("reg")} style={{ background: rf.lat ? "#dcfce7" : "#1d6fa4", color: rf.lat ? "#15803d" : "#fff", padding:"11px", fontSize:14, borderRadius:12, width:"100%" }}>
                {gpsLoad ? "Obteniendo GPS..." : rf.lat ? "✅ Ubicacion guardada" : "📍 Usar mi ubicacion GPS"}
              </button>
            </div>
            {rf.err && <div style={{ fontSize:13, color:"#dc2626", background:"#fef2f2", padding:"10px 13px", borderRadius:10, fontWeight:500 }}>⚠️ {rf.err}</div>}
            <button className="pb" onClick={registrar} disabled={loading} style={{ background:"linear-gradient(135deg,#10b981,#059669)", color:"#fff", padding:"15px", fontSize:16, marginTop:4 }}>{loading ? "Creando cuenta..." : "Crear mi cuenta ✓"}</button>
            <button className="pb" onClick={() => setScreen("login")} style={{ background:"#f1f5f9", color:"#64748b", padding:"13px", fontSize:14 }}>← Ya tengo cuenta</button>
          </div>
        </div>
      </div>
    </PhoneShell>
  );

  const lastServ = historial[0];
  return (
    <PhoneShell>
      <div style={{ paddingBottom:80, minHeight:"100vh", background:"#f1f5f9" }}>

        {tab === "inicio" && (
          <div className="sl">
            <div style={{ background:"linear-gradient(135deg,#1d6fa4,#0284c7)", padding:"50px 22px 26px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
                <div>
                  <div style={{ fontSize:13, color:"rgba(255,255,255,.75)" }}>Hola,</div>
                  <div style={{ fontSize:20, fontWeight:800, color:"#fff" }}>{cliente.nombre.split(" ")[0]} 👋</div>
                </div>
                <button className="pb" onClick={logout} style={{ background:"rgba(255,255,255,.15)", color:"#fff", padding:"7px 13px", fontSize:12, borderRadius:9 }}>Salir</button>
              </div>
            </div>
            <div style={{ padding:"18px 14px", display:"flex", flexDirection:"column", gap:13 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11 }}>
                {[
                  { icon:"📅", label:"Agendar cita",    bg:"#dbeafe", action:() => setTab("agendar") },
                  { icon:"🔧", label:"Mi historial",    bg:"#ede9fe", action:() => setTab("historial") },
                  { icon:"🗓️", label:"Mis citas",       bg:"#ffedd5", action:() => setTab("citas") },
                  { icon:"🏠", label:"Mis residencias", bg:"#dcfce7", action:() => setTab("residencias") },
                  { icon:"🎁", label:"Ofertas",          bg:"#fce7f3", action:() => setTab("ofertas") },
                ].map(a => (
                  <button key={a.label} className="pb" onClick={a.action} style={{ background:"#fff", padding:"16px 12px", borderRadius:18, display:"flex", flexDirection:"column", alignItems:"flex-start", gap:7, boxShadow:"0 2px 10px rgba(0,0,0,.06)", textAlign:"left" }}>
                    <div style={{ width:38, height:38, borderRadius:12, background:a.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{a.icon}</div>
                    <div style={{ fontSize:14, fontWeight:600, color:"#0f172a" }}>{a.label}</div>
                  </button>
                ))}
              </div>
              {lastServ && (
                <div className="pc">
                  <div style={{ fontSize:12, fontWeight:600, color:"#94a3b8", marginBottom:10 }}>ULTIMO SERVICIO</div>
                  <div style={{ display:"flex", gap:12 }}>
                    <div style={{ width:42, height:42, borderRadius:13, background:"#dbeafe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🔧</div>
                    <div>
                      <div style={{ fontSize:15, fontWeight:700, color:"#0f172a" }}>{lastServ.tipo}</div>
                      <div style={{ fontSize:13, color:"#64748b", marginTop:2 }}>{lastServ.equipo}</div>
                      <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>{fmt(lastServ.fecha)} · {lastServ.tecnico}</div>
                    </div>
                  </div>
                </div>
              )}
              <div style={{ textAlign:"center", fontSize:12, color:"#cbd5e1" }}>Solution Air System · (55) 1234-5678</div>
            </div>
          </div>
        )}

        {tab === "residencias" && (
          <div className="sl">
            <div style={{ background:"linear-gradient(135deg,#10b981,#059669)", padding:"50px 22px 22px" }}>
              <div style={{ fontSize:21, fontWeight:800, color:"#fff" }}>Mis residencias 🏠</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,.8)", marginTop:3 }}>{misRes.length} registrada{misRes.length !== 1 ? "s" : ""}</div>
            </div>
            <div style={{ padding:"16px 14px", display:"flex", flexDirection:"column", gap:12 }}>
              <button className="pb" onClick={() => setResModal(true)} style={{ background:"linear-gradient(135deg,#1d6fa4,#0284c7)", color:"#fff", padding:"14px", fontSize:15 }}>+ Agregar residencia</button>
              {misRes.map(r => {
                const dias = diasParaMant(r.fecha_instalacion);
                const next = nextMant(r.fecha_instalacion);
                return (
                  <div key={r.id} className="pc">
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                      <div style={{ fontSize:16, fontWeight:700, color:"#0f172a" }}>🏠 {r.nombre}</div>
                      {r.lat && r.lng && <a href={`https://maps.google.com/?q=${r.lat},${r.lng}`} target="_blank" rel="noreferrer" style={{ background:"#dcfce7", color:"#15803d", padding:"6px 12px", borderRadius:8, fontSize:12, fontWeight:600, textDecoration:"none" }}>🗺 Maps</a>}
                    </div>
                    <div style={{ fontSize:14, color:"#475569", marginBottom:6 }}>📍 {r.direccion}</div>
                    {r.equipos && <div style={{ fontSize:13, color:"#64748b", marginBottom:4 }}>❄️ {r.equipos}</div>}
                    {r.marca && (
                      <div style={{ background:"#f0f9ff", border:"1px solid #bae6fd", borderRadius:10, padding:"10px 13px", marginTop:6, display:"flex", flexDirection:"column", gap:4 }}>
                        {r.marca && <div style={{ fontSize:13, color:"#0369a1" }}>🏷️ <b>Marca:</b> {r.marca}</div>}
                        {r.modelo && <div style={{ fontSize:13, color:"#0369a1" }}>📋 <b>Modelo:</b> {r.modelo}</div>}
                        {r.serie && <div style={{ fontSize:13, color:"#0369a1" }}>🔢 <b>No. Serie:</b> {r.serie}</div>}
                        {r.fecha_instalacion && <div style={{ fontSize:13, color:"#0369a1" }}>📅 <b>Instalado:</b> {fmt(r.fecha_instalacion)}</div>}
                      </div>
                    )}
                    {next && (
                      <div style={{ background: dias <= 30 ? "#fef9c3" : "#f0fdf4", border:`1px solid ${dias <= 30 ? "#fde68a" : "#bbf7d0"}`, borderRadius:10, padding:"10px 13px", marginTop:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div>
                          <div style={{ fontSize:12, fontWeight:700, color: dias <= 30 ? "#a16207" : "#15803d" }}>🔧 Proximo mantenimiento</div>
                          <div style={{ fontSize:13, color:"#475569", marginTop:2 }}>{fmt(next)}</div>
                        </div>
                        <div style={{ fontSize:12, fontWeight:700, color: dias <= 30 ? "#a16207" : "#15803d", textAlign:"right" }}>
                          {dias <= 0 ? "¡Vencido!" : dias <= 30 ? `En ${dias}d ⚠️` : `En ${dias}d`}
                        </div>
                      </div>
                    )}
                    {r.lat && r.lng && <div style={{ fontSize:12, color:"#10b981", marginTop:6 }}>✅ GPS guardado</div>}
                    <button onClick={() => { setEditResData({...r}); setEditResModal(true); }} style={{ marginTop:10, width:"100%", padding:"9px", borderRadius:10, border:"1px solid #bfdbfe", background:"#eff6ff", color:"#1d6fa4", cursor:"pointer", fontFamily:"Outfit,sans-serif", fontSize:13, fontWeight:600 }}>✏️ Editar residencia</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "agendar" && (
          <div className="sl">
            <div style={{ background:"linear-gradient(135deg,#1d6fa4,#0284c7)", padding:"50px 22px 22px" }}>
              <div style={{ fontSize:21, fontWeight:800, color:"#fff" }}>Agendar cita 📅</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,.8)", marginTop:3 }}>La secretaria confirmara tu solicitud</div>
              <div style={{ display:"flex", gap:6, marginTop:14 }}>{[1,2,3,4].map(s => <div key={s} className={`dot${cf.step >= s ? " on" : ""}`} />)}</div>
            </div>
            {exito ? (
              <div style={{ padding:32, textAlign:"center" }} className="fade">
                <div style={{ fontSize:56, marginBottom:14 }}>✅</div>
                <div style={{ fontSize:20, fontWeight:700, color:"#0f172a" }}>Solicitud enviada!</div>
                <div style={{ fontSize:14, color:"#64748b", marginTop:8 }}>La secretaria revisara y confirmara tu cita pronto.</div>
              </div>
            ) : (
              <div style={{ padding:"18px 14px", display:"flex", flexDirection:"column", gap:13 }}>
                {cf.step === 1 && (
                  <div className="fade">
                    <div style={{ fontSize:15, fontWeight:700, color:"#0f172a", marginBottom:12 }}>¿En cual residencia?</div>
                    {misRes.length === 0 && <div style={{ background:"#fef9c3", border:"1px solid #fde68a", borderRadius:12, padding:"14px", fontSize:13, color:"#92400e", marginBottom:10 }}>No tienes residencias. <span style={{ fontWeight:700, cursor:"pointer", color:"#1d6fa4" }} onClick={() => setTab("residencias")}>Agregar →</span></div>}
                    {misRes.map(r => (
                      <button key={r.id} className="pb" onClick={() => setCf(p => ({ ...p, residenciaId:r.id, step:2 }))}
                        style={{ width:"100%", background: cf.residenciaId === r.id ? "#1d6fa4" : "#fff", color: cf.residenciaId === r.id ? "#fff" : "#0f172a", padding:"15px 16px", marginBottom:9, borderRadius:14, textAlign:"left", border:`2px solid ${cf.residenciaId === r.id ? "#1d6fa4" : "#e2e8f0"}` }}>
                        <div style={{ fontWeight:700, fontSize:15 }}>🏠 {r.nombre}</div>
                        <div style={{ fontSize:13, opacity:.8, marginTop:3 }}>📍 {r.direccion}</div>
                      </button>
                    ))}
                  </div>
                )}
                {cf.step === 2 && (
                  <div className="fade">
                    <div style={{ fontSize:15, fontWeight:700, color:"#0f172a", marginBottom:12 }}>¿Que servicio necesitas?</div>
                    {TIPOS.map(t => (
                      <button key={t} className="pb" onClick={() => setCf(p => ({ ...p, tipo:t, step:3 }))}
                        style={{ width:"100%", background: cf.tipo === t ? "#1d6fa4" : "#fff", color: cf.tipo === t ? "#fff" : "#0f172a", padding:"15px 16px", marginBottom:9, borderRadius:14, textAlign:"left", border:`2px solid ${cf.tipo === t ? "#1d6fa4" : "#e2e8f0"}`, display:"flex", justifyContent:"space-between" }}>
                        {t}<span style={{ opacity:.6 }}>{cf.tipo === t ? "✓" : "›"}</span>
                      </button>
                    ))}
                    <button className="pb" onClick={() => setCf(p => ({ ...p, step:1 }))} style={{ width:"100%", background:"#f1f5f9", color:"#64748b", padding:"13px", marginTop:4 }}>← Atras</button>
                  </div>
                )}
                {cf.step === 3 && (
                  <div className="fade">
                    <div style={{ fontSize:15, fontWeight:700, color:"#0f172a", marginBottom:12 }}>¿Cuando te viene bien?</div>
                    <div className="pc" style={{ display:"flex", flexDirection:"column", gap:13 }}>
                      <div>
                        <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:5 }}>FECHA</label>
                        <input type="date" value={cf.fecha} min={today()} onChange={e => setCf(p => ({ ...p, fecha:e.target.value }))} style={{ width:"100%", padding:"12px 13px", border:"2px solid #e2e8f0", borderRadius:12, background:"#f8fafc", color:"#0f172a" }} />
                      </div>
                      <div>
                        <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:7 }}>HORA</label>
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:7 }}>
                          {HORAS.map(h => <button key={h} className="pb" onClick={() => setCf(p => ({ ...p, hora:h }))} style={{ padding:"9px 4px", fontSize:13, borderRadius:10, background: cf.hora === h ? "#1d6fa4" : "#f1f5f9", color: cf.hora === h ? "#fff" : "#475569", border:`2px solid ${cf.hora === h ? "#1d6fa4" : "transparent"}` }}>{h}</button>)}
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:5 }}>NOTAS (opcional)</label>
                        <textarea value={cf.notas} onChange={e => setCf(p => ({ ...p, notas:e.target.value }))} rows={3} style={{ width:"100%", padding:"11px 13px", border:"2px solid #e2e8f0", borderRadius:12, background:"#f8fafc", color:"#0f172a", resize:"none", fontSize:14 }} />
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:10, marginTop:12 }}>
                      <button className="pb" onClick={() => setCf(p => ({ ...p, step:2 }))} style={{ flex:1, background:"#f1f5f9", color:"#64748b", padding:"13px" }}>← Atras</button>
                      <button className="pb" onClick={() => cf.fecha && cf.hora && setCf(p => ({ ...p, step:4 }))} style={{ flex:2, background: cf.fecha && cf.hora ? "linear-gradient(135deg,#1d6fa4,#0284c7)" : "#cbd5e1", color:"#fff", padding:"13px", opacity: cf.fecha && cf.hora ? 1 : .7 }}>Continuar →</button>
                    </div>
                  </div>
                )}
                {cf.step === 4 && (
                  <div className="fade">
                    <div style={{ fontSize:15, fontWeight:700, color:"#0f172a", marginBottom:12 }}>Confirma tu solicitud</div>
                    <div className="pc" style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:13 }}>
                      {[
                        { icon:"🏠", l:"Residencia", v: misRes.find(r => r.id === cf.residenciaId)?.nombre },
                        { icon:"📍", l:"Direccion",  v: misRes.find(r => r.id === cf.residenciaId)?.direccion },
                        { icon:"🔧", l:"Servicio",   v: cf.tipo },
                        { icon:"📅", l:"Fecha",      v: fmt(cf.fecha) },
                        { icon:"⏰", l:"Hora",       v: cf.hora },
                      ].map(r => (
                        <div key={r.l} style={{ display:"flex", gap:11, alignItems:"center" }}>
                          <div style={{ width:34, height:34, borderRadius:10, background:"#f0f9ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>{r.icon}</div>
                          <div>
                            <div style={{ fontSize:11, color:"#94a3b8", fontWeight:600 }}>{r.l.toUpperCase()}</div>
                            <div style={{ fontSize:14, fontWeight:600, color:"#0f172a" }}>{r.v}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background:"#fef9c3", border:"1px solid #fde68a", borderRadius:12, padding:"11px 14px", fontSize:13, color:"#92400e", marginBottom:13 }}>La secretaria confirmara tu cita pronto.</div>
                    <div style={{ display:"flex", gap:10 }}>
                      <button className="pb" onClick={() => setCf(p => ({ ...p, step:3 }))} style={{ flex:1, background:"#f1f5f9", color:"#64748b", padding:"13px" }}>← Atras</button>
                      <button className="pb" onClick={agendar} style={{ flex:2, background:"linear-gradient(135deg,#10b981,#059669)", color:"#fff", padding:"13px" }}>Enviar solicitud ✓</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === "historial" && (
          <div className="sl">
            <div style={{ background:"linear-gradient(135deg,#8b5cf6,#7c3aed)", padding:"50px 22px 22px" }}>
              <div style={{ fontSize:21, fontWeight:800, color:"#fff" }}>Historial 🔧</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,.8)", marginTop:3 }}>{historial.length} servicios</div>
            </div>
            <div style={{ padding:"16px 14px", display:"flex", flexDirection:"column", gap:12 }}>
              {historial.length === 0
                ? <div style={{ textAlign:"center", padding:40, color:"#94a3b8" }}><div style={{ fontSize:40 }}>📋</div><div style={{ marginTop:10 }}>Sin historial aun</div></div>
                : historial.map((h, i) => (
                  <div key={h.id} className="pc" style={{ cursor:"pointer" }} onClick={() => setDetalle(detalle === h.id ? null : h.id)}>
                    <div style={{ display:"flex", gap:12 }}>
                      <div style={{ width:42, height:42, borderRadius:13, background:"#ede9fe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0, position:"relative" }}>
                        🔧{i === 0 && <div style={{ position:"absolute", top:-4, right:-4, width:13, height:13, background:"#1d6fa4", borderRadius:"50%", border:"2px solid #fff" }} />}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:15, fontWeight:700, color:"#0f172a" }}>{h.tipo}</div>
                        <div style={{ fontSize:13, color:"#64748b", marginTop:2 }}>{h.equipo}</div>
                        <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>{fmt(h.fecha)} · {h.tecnico}</div>
                      </div>
                    </div>
                    {detalle === h.id && <div className="fade" style={{ marginTop:13, padding:"11px 13px", background:"#f8fafc", borderRadius:13, fontSize:13, color:"#475569", lineHeight:1.6, borderLeft:"3px solid #8b5cf6" }}>{h.descripcion}</div>}
                    <div style={{ textAlign:"center", marginTop:8, fontSize:12, color:"#cbd5e1" }}>{detalle === h.id ? "▲ Ocultar" : "▼ Ver detalle"}</div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {tab === "citas" && (
          <div className="sl">
            <div style={{ background:"linear-gradient(135deg,#f97316,#ea580c)", padding:"50px 22px 22px" }}>
              <div style={{ fontSize:21, fontWeight:800, color:"#fff" }}>Mis citas 🗓️</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,.8)", marginTop:3 }}>{citas.filter(c => c.status !== "Cancelada").length} activa(s)</div>
            </div>
            <div style={{ padding:"16px 14px", display:"flex", flexDirection:"column", gap:12 }}>
              <button className="pb" onClick={() => setTab("agendar")} style={{ background:"linear-gradient(135deg,#1d6fa4,#0284c7)", color:"#fff", padding:"14px", fontSize:15 }}>+ Solicitar nueva cita</button>
              {citas.length === 0
                ? <div style={{ textAlign:"center", padding:32, color:"#94a3b8" }}><div style={{ fontSize:40 }}>🗓️</div><div style={{ marginTop:10 }}>Sin citas aun</div></div>
                : citas.map(c => (
                  <div key={c.id} className="pc">
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                      <div style={{ fontSize:15, fontWeight:700, color:"#0f172a" }}>{c.tipo}</div>
                      <Pill s={c.status} />
                    </div>
                    <div style={{ fontSize:13, color:"#1d6fa4", marginBottom:4, fontWeight:600 }}>🏠 {c.residencia}</div>
                    <div style={{ display:"flex", gap:14, marginBottom:8 }}>
                      <div style={{ fontSize:13, color:"#64748b" }}>📅 {fmt(c.fecha)}</div>
                      <div style={{ fontSize:13, color:"#64748b" }}>⏰ {c.hora}</div>
                    </div>
                    {c.nota_secretaria && <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"9px 12px", fontSize:13, color:"#166534", marginBottom:8 }}>💬 {c.nota_secretaria}</div>}
                    {c.status === "Pendiente de confirmacion" && <div style={{ background:"#fef9c3", border:"1px solid #fde68a", borderRadius:10, padding:"8px 12px", fontSize:12, color:"#92400e", marginBottom:8 }}>⏳ En espera de confirmacion</div>}
                    {c.status !== "Cancelada" && <button className="pb" onClick={() => cancelar(c.id)} style={{ width:"100%", background:"#fff1f2", color:"#e11d48", border:"1px solid #fecdd3", padding:"10px", fontSize:13, borderRadius:11 }}>Cancelar</button>}
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {tab === "ofertas" && (
          <div className="sl">
            <div style={{ background:"linear-gradient(135deg,#10b981,#059669)", padding:"50px 22px 22px" }}>
              <div style={{ fontSize:21, fontWeight:800, color:"#fff" }}>Ofertas 🎁</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,.8)", marginTop:3 }}>Solo para clientes Solution Air System</div>
            </div>
            <div style={{ padding:"16px 14px", display:"flex", flexDirection:"column", gap:14 }}>
              {OFERTAS.map(o => (
                <div key={o.id} style={{ borderRadius:20, overflow:"hidden", boxShadow:"0 4px 16px rgba(0,0,0,.1)" }}>
                  <div style={{ background:o.grad, padding:"18px 18px 14px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <div style={{ fontSize:30 }}>{o.icon}</div>
                      <div style={{ background:"rgba(255,255,255,.25)", color:"#fff", padding:"5px 13px", borderRadius:20, fontSize:14, fontWeight:800 }}>{o.badge}</div>
                    </div>
                    <div style={{ fontSize:17, fontWeight:800, color:"#fff", marginTop:9 }}>{o.titulo}</div>
                    <div style={{ fontSize:13, color:"rgba(255,255,255,.9)", marginTop:3 }}>{o.desc}</div>
                  </div>
                  <div style={{ background:"#fff", padding:"12px 18px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ fontSize:12, color:"#94a3b8" }}>{o.vig}</div>
                    <button className="pb" onClick={() => setTab("agendar")} style={{ background:"#1d6fa4", color:"#fff", padding:"8px 15px", fontSize:13, borderRadius:10 }}>Aprovechar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <nav className="tbar">
          {[{ id:"inicio", icon:"🏠", label:"Inicio" }, { id:"agendar", icon:"📅", label:"Agendar" }, { id:"residencias", icon:"🏠", label:"Residencias" }, { id:"citas", icon:"🗓️", label:"Mis citas" }, { id:"ofertas", icon:"🎁", label:"Ofertas" }].map(t => (
            <button key={t.id} className={`tbtn${tab === t.id ? " on" : ""}`} onClick={() => setTab(t.id)}>
              <span style={{ fontSize:18 }}>{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>
      </div>

      {editResModal && editResData && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:100, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={() => setEditResModal(false)}>
          <div style={{ background:"#fff", borderRadius:"24px 24px 0 0", padding:24, width:"100%", maxWidth:430, maxHeight:"85vh", overflowY:"auto", fontFamily:"Outfit,sans-serif" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize:18, fontWeight:800, color:"#0f172a", marginBottom:16 }}>✏️ Editar residencia</div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div><label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>NOMBRE</label>
                <input value={editResData.nombre||""} onChange={e => setEditResData(p => ({ ...p, nombre:e.target.value }))} style={{ width:"100%", padding:"12px 14px", border:"2px solid #e2e8f0", borderRadius:12, background:"#f8fafc", color:"#0f172a", fontSize:14, fontFamily:"Outfit,sans-serif", outline:"none", boxSizing:"border-box" }} />
              </div>
              <div><label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>DIRECCION</label>
                <input value={editResData.direccion||""} onChange={e => setEditResData(p => ({ ...p, direccion:e.target.value }))} style={{ width:"100%", padding:"12px 14px", border:"2px solid #e2e8f0", borderRadius:12, background:"#f8fafc", color:"#0f172a", fontSize:14, fontFamily:"Outfit,sans-serif", outline:"none", boxSizing:"border-box" }} />
              </div>
              <div><label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>DESCRIPCION DEL EQUIPO</label>
                <input value={editResData.equipos||""} onChange={e => setEditResData(p => ({ ...p, equipos:e.target.value }))} placeholder="Ej: Minisplit 1.5 ton" style={{ width:"100%", padding:"12px 14px", border:"2px solid #e2e8f0", borderRadius:12, background:"#f8fafc", color:"#0f172a", fontSize:14, fontFamily:"Outfit,sans-serif", outline:"none", boxSizing:"border-box" }} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div><label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>MARCA</label>
                  <input value={editResData.marca||""} onChange={e => setEditResData(p => ({ ...p, marca:e.target.value }))} placeholder="LG, Carrier..." style={{ width:"100%", padding:"12px 14px", border:"2px solid #e2e8f0", borderRadius:12, background:"#f8fafc", color:"#0f172a", fontSize:14, fontFamily:"Outfit,sans-serif", outline:"none", boxSizing:"border-box" }} />
                </div>
                <div><label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>MODELO</label>
                  <input value={editResData.modelo||""} onChange={e => setEditResData(p => ({ ...p, modelo:e.target.value }))} placeholder="LV181HV4" style={{ width:"100%", padding:"12px 14px", border:"2px solid #e2e8f0", borderRadius:12, background:"#f8fafc", color:"#0f172a", fontSize:14, fontFamily:"Outfit,sans-serif", outline:"none", boxSizing:"border-box" }} />
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div><label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>NO. DE SERIE</label>
                  <input value={editResData.serie||""} onChange={e => setEditResData(p => ({ ...p, serie:e.target.value }))} placeholder="SN-123456" style={{ width:"100%", padding:"12px 14px", border:"2px solid #e2e8f0", borderRadius:12, background:"#f8fafc", color:"#0f172a", fontSize:14, fontFamily:"Outfit,sans-serif", outline:"none", boxSizing:"border-box" }} />
                </div>
                <div><label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>FECHA INSTALACION</label>
                  <input type="date" value={editResData.fecha_instalacion||""} onChange={e => setEditResData(p => ({ ...p, fecha_instalacion:e.target.value }))} style={{ width:"100%", padding:"12px 14px", border:"2px solid #e2e8f0", borderRadius:12, background:"#f8fafc", color:"#0f172a", fontSize:14, fontFamily:"Outfit,sans-serif", outline:"none", boxSizing:"border-box" }} />
                </div>
              </div>
              <button onClick={() => getGPS("edit")} style={{ background:editResData.lat?"#dcfce7":"#1d6fa4", color:editResData.lat?"#15803d":"#fff", padding:"12px", fontSize:14, borderRadius:12, border:"none", cursor:"pointer", fontFamily:"Outfit,sans-serif", fontWeight:600 }}>
                {gpsLoad ? "Obteniendo..." : editResData.lat ? "✅ GPS guardado" : "📍 Actualizar ubicacion GPS"}
              </button>
              <div style={{ display:"flex", gap:10, marginTop:4 }}>
                <button onClick={() => { setEditResModal(false); setEditResData(null); }} style={{ flex:1, background:"#f1f5f9", color:"#64748b", padding:"13px", borderRadius:14, border:"none", cursor:"pointer", fontFamily:"Outfit,sans-serif", fontWeight:600 }}>Cancelar</button>
                <button onClick={editResidencia} style={{ flex:2, background:"linear-gradient(135deg,#1d6fa4,#0284c7)", color:"#fff", padding:"13px", borderRadius:14, border:"none", cursor:"pointer", fontFamily:"Outfit,sans-serif", fontWeight:600 }}>Guardar cambios</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {resModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:100, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={() => setResModal(false)}>
          <div style={{ background:"#fff", borderRadius:"24px 24px 0 0", padding:24, width:"100%", maxWidth:430, maxHeight:"85vh", overflowY:"auto", fontFamily:"Outfit,sans-serif" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize:18, fontWeight:800, color:"#0f172a", marginBottom:16 }}>🏠 Nueva residencia</div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div><label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>NOMBRE *</label>
                <input value={newRes.nombre} onChange={e => setNewRes(p => ({ ...p, nombre:e.target.value }))} placeholder="Casa de verano, Local..." style={{ width:"100%", padding:"12px 14px", border:"2px solid #e2e8f0", borderRadius:12, background:"#f8fafc", color:"#0f172a", fontSize:14, fontFamily:"Outfit,sans-serif", outline:"none", boxSizing:"border-box" }} />
              </div>
              <div><label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>DIRECCION *</label>
                <input value={newRes.direccion} onChange={e => setNewRes(p => ({ ...p, direccion:e.target.value }))} placeholder="Calle, Colonia, Ciudad" style={{ width:"100%", padding:"12px 14px", border:"2px solid #e2e8f0", borderRadius:12, background:"#f8fafc", color:"#0f172a", fontSize:14, fontFamily:"Outfit,sans-serif", outline:"none", boxSizing:"border-box" }} />
              </div>
              <div><label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>DESCRIPCION DEL EQUIPO</label>
                <input value={newRes.equipos} onChange={e => setNewRes(p => ({ ...p, equipos:e.target.value }))} placeholder="Ej: Minisplit 1.5 ton" style={{ width:"100%", padding:"12px 14px", border:"2px solid #e2e8f0", borderRadius:12, background:"#f8fafc", color:"#0f172a", fontSize:14, fontFamily:"Outfit,sans-serif", outline:"none", boxSizing:"border-box" }} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div><label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>MARCA</label>
                  <input value={newRes.marca||""} onChange={e => setNewRes(p => ({ ...p, marca:e.target.value }))} placeholder="LG, Carrier..." style={{ width:"100%", padding:"12px 14px", border:"2px solid #e2e8f0", borderRadius:12, background:"#f8fafc", color:"#0f172a", fontSize:14, fontFamily:"Outfit,sans-serif", outline:"none", boxSizing:"border-box" }} />
                </div>
                <div><label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>MODELO</label>
                  <input value={newRes.modelo||""} onChange={e => setNewRes(p => ({ ...p, modelo:e.target.value }))} placeholder="LV181HV4" style={{ width:"100%", padding:"12px 14px", border:"2px solid #e2e8f0", borderRadius:12, background:"#f8fafc", color:"#0f172a", fontSize:14, fontFamily:"Outfit,sans-serif", outline:"none", boxSizing:"border-box" }} />
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div><label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>NO. DE SERIE</label>
                  <input value={newRes.serie||""} onChange={e => setNewRes(p => ({ ...p, serie:e.target.value }))} placeholder="SN-123456" style={{ width:"100%", padding:"12px 14px", border:"2px solid #e2e8f0", borderRadius:12, background:"#f8fafc", color:"#0f172a", fontSize:14, fontFamily:"Outfit,sans-serif", outline:"none", boxSizing:"border-box" }} />
                </div>
                <div><label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>FECHA INSTALACION</label>
                  <input type="date" value={newRes.fecha_instalacion||""} onChange={e => setNewRes(p => ({ ...p, fecha_instalacion:e.target.value }))} style={{ width:"100%", padding:"12px 14px", border:"2px solid #e2e8f0", borderRadius:12, background:"#f8fafc", color:"#0f172a", fontSize:14, fontFamily:"Outfit,sans-serif", outline:"none", boxSizing:"border-box" }} />
                </div>
              </div>
              <button onClick={() => getGPS("res")} style={{ background:newRes.lat?"#dcfce7":"#1d6fa4", color:newRes.lat?"#15803d":"#fff", padding:"12px", fontSize:14, borderRadius:12, border:"none", cursor:"pointer", fontFamily:"Outfit,sans-serif", fontWeight:600 }}>
                {gpsLoad ? "Obteniendo..." : newRes.lat ? "✅ GPS guardado" : "📍 Guardar ubicacion GPS"}
              </button>
              <div style={{ display:"flex", gap:10, marginTop:4 }}>
                <button onClick={() => setResModal(false)} style={{ flex:1, background:"#f1f5f9", color:"#64748b", padding:"13px", borderRadius:14, border:"none", cursor:"pointer", fontFamily:"Outfit,sans-serif", fontWeight:600 }}>Cancelar</button>
                <button onClick={addResidencia} style={{ flex:2, background:"linear-gradient(135deg,#10b981,#059669)", color:"#fff", padding:"13px", borderRadius:14, border:"none", cursor:"pointer", fontFamily:"Outfit,sans-serif", fontWeight:600 }}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PhoneShell>
  );
}
