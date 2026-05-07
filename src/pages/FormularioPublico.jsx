import { useState } from 'react'
import { motion } from 'framer-motion'

const GAS_URL = 'PEGAR_URL_DEL_WEB_APP_AQUI'

export default function FormularioPublico() {
  const [form, setForm]       = useState({ nombre:'', email:'', telefono:'', servicio:'', mensaje:'' })
  const [estado, setEstado]   = useState(null) // 'ok' | 'err' | 'loading'

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const enviar = async (e) => {
    e.preventDefault()
    setEstado('loading')
    try {
      await fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify({ ...form, fuente: 'formulario-web' }),
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
      })
      setEstado('ok')
      setForm({ nombre:'', email:'', telefono:'', servicio:'', mensaje:'' })
    } catch {
      setEstado('err')
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', overflowY: 'auto',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)',
      backgroundSize: '40px 40px',
    }}>
      <motion.div
        initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.45 }}
        style={{ width:'100%', maxWidth:480, background:'#141414', border:'1px solid #2a2a2a', borderRadius:20, padding:40 }}
      >
        <img src="https://wasedigital.com/wp-content/uploads/2025/05/cropped-Diseno-sin-titulo-18-106x57.png"
             alt="Wase Digital" style={{ height:36, marginBottom:24, display:'block' }} />

        <h1 style={{ color:'#f5f5f5', fontSize:22, fontWeight:900, margin:'0 0 4px', fontFamily:'Syne,sans-serif' }}>
          Hablemos de tu marca
        </h1>
        <p style={{ color:'#666', fontSize:13, margin:'0 0 28px' }}>
          Completá el formulario y te contactamos en menos de 24hs.
        </p>

        {estado === 'ok' && (
          <div style={{ background:'rgba(200,240,0,.12)', border:'1px solid rgba(200,240,0,.3)', color:'#c8f000', borderRadius:12, padding:'12px 16px', marginBottom:20, fontSize:13, textAlign:'center' }}>
            ¡Gracias! Te contactamos pronto.
          </div>
        )}
        {estado === 'err' && (
          <div style={{ background:'rgba(255,77,77,.1)', border:'1px solid rgba(255,77,77,.3)', color:'#ff4d4d', borderRadius:12, padding:'12px 16px', marginBottom:20, fontSize:13, textAlign:'center' }}>
            Error al enviar. Intentá de nuevo.
          </div>
        )}

        <form onSubmit={enviar} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {[
            { key:'nombre',   label:'Nombre completo',      type:'text',  placeholder:'Tu nombre',           required:true },
            { key:'email',    label:'Email',                 type:'email', placeholder:'tu@email.com',         required:true },
            { key:'telefono', label:'Teléfono (opcional)',   type:'tel',   placeholder:'+54 9 11 0000-0000',   required:false },
          ].map(f => (
            <div key={f.key}>
              <label style={{ display:'block', color:'#888', fontSize:10.5, fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:6 }}>{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={e => set(f.key, e.target.value)}
                placeholder={f.placeholder} required={f.required}
                style={{ width:'100%', boxSizing:'border-box', background:'#1e1e1e', border:'1px solid #333', color:'#f5f5f5', fontSize:14, padding:'12px 14px', borderRadius:12, outline:'none', fontFamily:'inherit' }}
                onFocus={e => { e.target.style.borderColor='#c8f000'; e.target.style.boxShadow='0 0 0 3px rgba(200,240,0,.1)' }}
                onBlur={e =>  { e.target.style.borderColor='#333';     e.target.style.boxShadow='none' }}
              />
            </div>
          ))}

          <div>
            <label style={{ display:'block', color:'#888', fontSize:10.5, fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:6 }}>¿Qué servicio te interesa?</label>
            <select value={form.servicio} onChange={e => set('servicio', e.target.value)} required
              style={{ width:'100%', boxSizing:'border-box', background:'#1e1e1e', border:'1px solid #333', color: form.servicio ? '#f5f5f5' : '#666', fontSize:14, padding:'12px 14px', borderRadius:12, outline:'none', fontFamily:'inherit' }}
              onFocus={e => { e.target.style.borderColor='#c8f000' }}
              onBlur={e =>  { e.target.style.borderColor='#333' }}>
              <option value="">— Elegí una opción —</option>
              <option>Meta ADS</option>
              <option>Social Media</option>
              <option>Content Creation</option>
              <option>Pack Completo</option>
            </select>
          </div>

          <div>
            <label style={{ display:'block', color:'#888', fontSize:10.5, fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:6 }}>Mensaje (opcional)</label>
            <textarea value={form.mensaje} onChange={e => set('mensaje', e.target.value)}
              placeholder="Contanos sobre tu negocio..."
              style={{ width:'100%', boxSizing:'border-box', background:'#1e1e1e', border:'1px solid #333', color:'#f5f5f5', fontSize:14, padding:'12px 14px', borderRadius:12, outline:'none', fontFamily:'inherit', minHeight:80, resize:'vertical' }}
              onFocus={e => { e.target.style.borderColor='#c8f000'; e.target.style.boxShadow='0 0 0 3px rgba(200,240,0,.1)' }}
              onBlur={e =>  { e.target.style.borderColor='#333';     e.target.style.boxShadow='none' }}
            />
          </div>

          <motion.button type="submit" disabled={estado === 'loading'}
            whileHover={{ scale:1.03, boxShadow:'0 0 28px rgba(200,240,0,.45)' }}
            whileTap={{ scale:0.97 }}
            style={{ background:'#c8f000', color:'#0a0a0a', border:'none', padding:'14px', borderRadius:12, fontSize:14, fontWeight:900, cursor:'pointer', letterSpacing:'.08em', textTransform:'uppercase', fontFamily:'Syne,sans-serif', opacity: estado === 'loading' ? 0.7 : 1 }}>
            {estado === 'loading' ? 'Enviando...' : 'Enviar consulta'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
