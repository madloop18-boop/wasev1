import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Trash2 } from 'lucide-react'
import { useStore } from '../../store/index.jsx'
import { Btn } from './index.jsx'

// ── INPUT FIELD ────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-[12px] font-bold uppercase tracking-wider" style={{ color: 'var(--text2)' }}>{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, type = 'text', placeholder = '' }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full text-[14px] py-3 px-4 rounded-xl outline-none transition-all"
      style={{ background: 'var(--raised)', border: '1px solid var(--border)', color: 'var(--text1)' }}
      onFocus={e => e.target.style.borderColor = 'var(--accent)'}
      onBlur={e => e.target.style.borderColor = 'var(--border)'}
    />
  )
}

function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full text-[14px] py-3 px-4 rounded-xl outline-none"
      style={{ background: 'var(--raised)', border: '1px solid var(--border)', color: 'var(--text1)' }}>
      {options.map(o => typeof o === 'string'
        ? <option key={o} value={o}>{o}</option>
        : <option key={o.value} value={o.value}>{o.label}</option>
      )}
    </select>
  )
}

// ── MODAL WRAPPER ──────────────────────────────────────────
function ModalWrap({ title, onClose, children, onSave, saving }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose} className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}>
      <motion.div initial={{ scale: 0.95, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md mx-4 rounded-2xl overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 24px 60px rgba(0,0,0,0.7)' }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <h3 className="font-bold text-[18px]" style={{ fontFamily: 'Syne,sans-serif', color: 'var(--text1)' }}>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[var(--raised)] transition-colors text-[20px]" style={{ color: 'var(--text2)' }}>×</button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">{children}</div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl text-[14px] font-semibold transition-all hover:bg-[var(--overlay)]"
            style={{ background: 'var(--raised)', color: 'var(--text1)', border: '1px solid var(--border)' }}>
            Cancelar
          </button>
          <button onClick={onSave} disabled={saving}
            className="flex-1 py-3 rounded-xl text-[14px] font-bold transition-all"
            style={{ background: 'var(--accent)', color: '#0a0a0a', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── MODAL NUEVO CLIENTE ────────────────────────────────────
const SERVICIOS_OPTS = ['Meta ADS', 'Social Media', 'Content Creation', 'Pack Completo']

export function ModalNuevoCliente({ onClose }) {
  const { createCliente, showToast } = useStore()
  const [saving, setSaving] = useState(false)
  const [serviciosSelec, setServiciosSelec] = useState([])
  const [form, setForm] = useState({ nombre: '', sector: '', contacto: '', email: '', telefono: '', retainer: '', notas: '' })
  const f = k => v => setForm(p => ({ ...p, [k]: v }))

  const toggleServicio = (svc) => {
    setServiciosSelec(prev =>
      prev.includes(svc) ? prev.filter(s => s !== svc) : [...prev, svc]
    )
  }

  const handleSave = async () => {
    if (!form.nombre) return showToast('El nombre es obligatorio', 'warn')
    if (!serviciosSelec.length) return showToast('Seleccioná al menos un servicio', 'warn')
    setSaving(true)
    try {
      await createCliente({ ...form, servicio: serviciosSelec.join(', ') })
      onClose()
    } catch { showToast('Error al guardar', 'error') }
    finally { setSaving(false) }
  }

  return (
    <AnimatePresence>
      <ModalWrap title="Nuevo Cliente" onClose={onClose} onSave={handleSave} saving={saving}>
        <Field label="Nombre de la empresa *">
          <Input value={form.nombre} onChange={f('nombre')} placeholder="Ej. Sokassia" />
        </Field>
        <Field label="Sector">
          <Input value={form.sector} onChange={f('sector')} placeholder="Ej. Moda, Fitness, Tech..." />
        </Field>

        {/* Multi-select servicios */}
        <Field label="Servicios * (podés elegir varios)">
          <div className="flex flex-wrap gap-2 mt-1">
            {SERVICIOS_OPTS.map(svc => {
              const active = serviciosSelec.includes(svc)
              return (
                <button key={svc} type="button" onClick={() => toggleServicio(svc)}
                  className="px-3.5 py-2 rounded-xl text-[12.5px] font-semibold transition-all"
                  style={{
                    background: active ? 'var(--accent)' : 'var(--raised)',
                    color: active ? '#0a0a0a' : 'var(--text2)',
                    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                    transform: active ? 'scale(1.03)' : 'scale(1)',
                  }}>
                  {active ? '✓ ' : ''}{svc}
                </button>
              )
            })}
          </div>
          {serviciosSelec.length > 0 && (
            <div className="mt-2 text-[11.5px]" style={{ color: 'var(--accent)' }}>
              Seleccionados: {serviciosSelec.join(' · ')}
            </div>
          )}
        </Field>

        <Field label="Nombre del contacto">
          <Input value={form.contacto} onChange={f('contacto')} placeholder="Ej. María García" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email">
            <Input value={form.email} onChange={f('email')} type="email" placeholder="cliente@empresa.com" />
          </Field>
          <Field label="Teléfono">
            <Input value={form.telefono} onChange={f('telefono')} placeholder="+54 9 11..." />
          </Field>
        </div>
        <Field label="Retainer mensual (ARS)">
          <Input value={form.retainer} onChange={f('retainer')} type="number" placeholder="149000" />
        </Field>
        <Field label="Notas">
          <textarea value={form.notas} onChange={e => f('notas')(e.target.value)}
            placeholder="Observaciones del cliente..."
            rows={2} className="w-full text-[13px] py-2.5 px-3.5 rounded-xl outline-none resize-none"
            style={{ background: 'var(--raised)', border: '1px solid var(--border)', color: 'var(--text1)' }} />
        </Field>
      </ModalWrap>
    </AnimatePresence>
  )
}

// ── MODAL NUEVA CAMPAÑA ────────────────────────────────────
export function ModalNuevaCampana({ onClose }) {
  const { createCampana, clientes, showToast } = useStore()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ nombre: '', cliente_id: '', cliente_nombre: '', servicio: 'Meta ADS', inversion: '', inicio: '', fin: '', notas: '' })
  const f = k => v => setForm(p => ({ ...p, [k]: v }))

  const handleClienteChange = (id) => {
    const c = clientes.find(x => x.id === id)
    setForm(p => ({ ...p, cliente_id: id, cliente_nombre: c?.nombre || '' }))
  }

  const handleSave = async () => {
    if (!form.nombre || !form.cliente_id) return showToast('Nombre y cliente son obligatorios', 'warn')
    setSaving(true)
    try {
      await createCampana(form)
      onClose()
    } catch { showToast('Error al guardar', 'error') }
    finally { setSaving(false) }
  }

  return (
    <AnimatePresence>
      <ModalWrap title="Nueva Campaña" onClose={onClose} onSave={handleSave} saving={saving}>
        <Field label="Nombre de la campaña *"><Input value={form.nombre} onChange={f('nombre')} placeholder="Ej. Brand Awareness Q3" /></Field>
        <Field label="Cliente *">
          <Select value={form.cliente_id} onChange={handleClienteChange}
            options={[{ value: '', label: 'Seleccionar cliente...' }, ...clientes.map(c => ({ value: c.id, label: c.nombre }))]} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Servicio">
            <Select value={form.servicio} onChange={f('servicio')} options={['Meta ADS', 'Social Media', 'Content Creation', 'Pack Completo']} />
          </Field>
          <Field label="Inversión (ARS)"><Input value={form.inversion} onChange={f('inversion')} type="number" placeholder="280000" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Fecha inicio"><Input value={form.inicio} onChange={f('inicio')} type="date" /></Field>
          <Field label="Fecha fin"><Input value={form.fin} onChange={f('fin')} type="date" /></Field>
        </div>
        <Field label="Notas">
          <textarea value={form.notas} onChange={e => f('notas')(e.target.value)} placeholder="Objetivo, público, observaciones..."
            rows={2} className="w-full text-[12.5px] py-2 px-3 rounded-lg outline-none resize-none"
            style={{ background: 'var(--raised)', border: '1px solid var(--border)', color: 'var(--text1)' }} />
        </Field>
      </ModalWrap>
    </AnimatePresence>
  )
}

// ── MODAL NUEVO DEAL ───────────────────────────────────────
export function ModalNuevoDeal({ onClose, etapaInicial = 'prospecto' }) {
  const { createDeal, showToast } = useStore()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ nombre: '', empresa: '', valor: '', etapa: etapaInicial, probabilidad: '20', responsable: '', notas: '' })
  const f = k => v => setForm(p => ({ ...p, [k]: v }))

  const handleSave = async () => {
    if (!form.nombre || !form.empresa) return showToast('Nombre y empresa son obligatorios', 'warn')
    setSaving(true)
    try {
      await createDeal(form)
      onClose()
    } catch { showToast('Error al guardar', 'error') }
    finally { setSaving(false) }
  }

  return (
    <AnimatePresence>
      <ModalWrap title="Nuevo Deal" onClose={onClose} onSave={handleSave} saving={saving}>
        <Field label="Nombre del deal *"><Input value={form.nombre} onChange={f('nombre')} placeholder="Ej. Propuesta Social Media" /></Field>
        <Field label="Empresa *"><Input value={form.empresa} onChange={f('empresa')} placeholder="Ej. FitZone" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Valor (ARS)"><Input value={form.valor} onChange={f('valor')} type="number" placeholder="280000" /></Field>
          <Field label="Probabilidad (%)"><Input value={form.probabilidad} onChange={f('probabilidad')} type="number" placeholder="50" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Etapa">
            <Select value={form.etapa} onChange={f('etapa')} options={['prospecto','contactado','propuesta','negociacion','cerrado']} />
          </Field>
          <Field label="Responsable"><Input value={form.responsable} onChange={f('responsable')} placeholder="Wanda" /></Field>
        </div>
        <Field label="Notas">
          <textarea value={form.notas} onChange={e => f('notas')(e.target.value)} placeholder="Detalles del deal..."
            rows={2} className="w-full text-[12.5px] py-2 px-3 rounded-lg outline-none resize-none"
            style={{ background: 'var(--raised)', border: '1px solid var(--border)', color: 'var(--text1)' }} />
        </Field>
      </ModalWrap>
    </AnimatePresence>
  )
}

// ── MODAL ACTUALIZAR MÉTRICAS ──────────────────────────────
export function ModalMetricas({ campana, onClose }) {
  const { updateCampana, showToast } = useStore()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    alcance:      String(campana?.alcance      || ''),
    clicks:       String(campana?.clicks       || ''),
    conversiones: String(campana?.conversiones || ''),
    inversion:    String(campana?.inversion    || ''),
    roas:         String(campana?.roas         || ''),
    estado:       campana?.estado || 'activa',
  })
  const f = k => v => setForm(p => ({ ...p, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateCampana(campana.id, form)
      showToast('Métricas actualizadas')
      onClose()
    } catch { showToast('Error al guardar', 'error') }
    finally { setSaving(false) }
  }

  return (
    <AnimatePresence>
      <ModalWrap title={`Métricas — ${campana?.nombre || ''}`} onClose={onClose} onSave={handleSave} saving={saving}>
        <div className="p-3 rounded-lg mb-2 text-[12px]" style={{ background: 'var(--raised)', color: 'var(--text2)' }}>
          Cliente: <strong style={{ color: 'var(--text1)' }}>{campana?.cliente_nombre}</strong> · {campana?.servicio}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Alcance"><Input value={form.alcance} onChange={f('alcance')} type="number" placeholder="1400000" /></Field>
          <Field label="Clicks"><Input value={form.clicks} onChange={f('clicks')} type="number" placeholder="48000" /></Field>
          <Field label="Conversiones"><Input value={form.conversiones} onChange={f('conversiones')} type="number" placeholder="820" /></Field>
          <Field label="Inversión (ARS)"><Input value={form.inversion} onChange={f('inversion')} type="number" placeholder="280000" /></Field>
          <Field label="ROAS"><Input value={form.roas} onChange={f('roas')} type="number" placeholder="6.2" /></Field>
          <Field label="Estado">
            <Select value={form.estado} onChange={f('estado')} options={['activa','revision','pausada','finalizada']} />
          </Field>
        </div>
      </ModalWrap>
    </AnimatePresence>
  )
}

// ── MODAL DETALLE CLIENTE ──────────────────────────────────
export function ModalDetalleCliente({ cliente, onClose }) {
  const { campanas } = useStore()
  const misCampanas = campanas.filter(c => c.cliente_id === cliente.id)

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 z-[100] flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
        <motion.div initial={{ scale: 0.95, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-lg mx-4 rounded-2xl overflow-hidden"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <div>
              <h3 className="font-bold text-[16px]" style={{ fontFamily: 'Syne,sans-serif' }}>{cliente.nombre}</h3>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--text3)' }}>{cliente.sector}</div>
            </div>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--raised)]" style={{ color: 'var(--text3)' }}><X size={15} /></button>
          </div>

          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Info */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: 'Servicio',  v: cliente.servicio },
                { l: 'Retainer', v: `$${(Number(cliente.retainer)||0).toLocaleString('es-AR')}/mes` },
                { l: 'Contacto', v: cliente.contacto || '—' },
                { l: 'Email',    v: cliente.email || '—' },
                { l: 'Teléfono', v: cliente.telefono || '—' },
                { l: 'ROAS',     v: cliente.roas ? `${cliente.roas}x` : '—', accent: true },
              ].map(({ l, v, accent }) => (
                <div key={l} className="p-3 rounded-lg" style={{ background: 'var(--raised)' }}>
                  <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text3)' }}>{l}</div>
                  <div className="text-[13px] font-semibold" style={{ color: accent ? 'var(--accent)' : 'var(--text1)' }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Campañas */}
            {misCampanas.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text3)' }}>Campañas activas</div>
                {misCampanas.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg mb-2"
                       style={{ background: 'var(--raised)', borderLeft: '3px solid var(--accent)' }}>
                    <div>
                      <div className="font-semibold text-[12.5px]">{c.nombre}</div>
                      <div className="text-[11px]" style={{ color: 'var(--text3)' }}>{c.servicio}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[14px]" style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono,monospace' }}>{c.roas||'—'}x</div>
                      <div className="text-[10px]" style={{ color: 'var(--text3)' }}>ROAS</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cliente.notas && (
              <div className="p-3 rounded-lg text-[12.5px]" style={{ background: 'var(--raised)', color: 'var(--text2)' }}>
                {cliente.notas}
              </div>
            )}
          </div>

          <div className="px-5 pb-5">
            <Btn variant="ghost" className="w-full justify-center" onClick={onClose}>Cerrar</Btn>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}