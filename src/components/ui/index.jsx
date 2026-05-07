import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

// ── CARD ──────────────────────────────────────────────────
export function Card({ children, className = '', hover = true, style = {} }) {
  return (
    <motion.div whileHover={hover ? { y: -2 } : {}} transition={{ duration: 0.15 }}
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', ...style }}>
      {children}
    </motion.div>
  )
}

// ── KPI CARD ─────────────────────────────────────────────
export function KPICard({ label, value, delta, deltaUp, icon: Icon, prefix = '', suffix = '', loading }) {
  const [displayed, setDisplayed] = useState(0)
  const num = parseFloat(String(value || 0).replace(/[^0-9.]/g, '')) || 0

  useEffect(() => {
    if (!num) return
    const dur = 1000, step = 16
    const inc = num / (dur / step)
    let cur = 0
    const t = setInterval(() => {
      cur += inc
      if (cur >= num) { setDisplayed(num); clearInterval(t) }
      else setDisplayed(cur)
    }, step)
    return () => clearInterval(t)
  }, [value])

  const fmt = (n) => {
    if (suffix === 'x') return n.toFixed(1)
    if (n >= 1000000) return (n/1000000).toFixed(1)+'M'
    if (n >= 1000)    return (n/1000).toFixed(0)+'K'
    return Math.round(n).toLocaleString('es-AR')
  }

  return (
    <motion.div whileHover={{ y:-2, borderColor:'rgba(200,240,0,0.6)' }} transition={{ duration:0.15 }}
      className="relative overflow-hidden rounded-2xl p-5 scan"
      style={{ background:'var(--surface)', border:'1px solid var(--border)' }}>
      <div className="absolute top-0 left-0 right-0 h-[2px]"
           style={{ background:'linear-gradient(90deg,transparent,rgba(200,240,0,0.7),transparent)' }} />
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] uppercase tracking-[0.12em] font-bold" style={{ color:'var(--text2)' }}>{label}</span>
        {Icon && <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'var(--accent-dim)', border:'1px solid rgba(200,240,0,0.2)' }}>
          <Icon size={16} style={{ color:'var(--accent)' }} />
        </div>}
      </div>
      <div className="font-black text-[32px] leading-none mb-2 count-up" style={{ fontFamily:'Syne,sans-serif', color:'var(--text1)' }}>
        {loading ? <div className="shimmer h-9 w-28" /> : <>{prefix}{fmt(displayed)}{suffix}</>}
      </div>
      {delta && (
        <div className="flex items-center gap-1.5 text-[12.5px] font-semibold">
          <span>{deltaUp ? '▲' : '▼'}</span>
          <span style={{ color: deltaUp ? 'var(--accent)' : 'var(--danger)' }}>{delta}</span>
        </div>
      )}
    </motion.div>
  )
}

// ── SECTION HEADER ────────────────────────────────────────
export function SH({ title, children }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="font-bold text-[17px]" style={{ fontFamily:'Syne,sans-serif', color:'var(--text1)' }}>{title}</h2>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}

// ── BUTTON ────────────────────────────────────────────────
export function Btn({ children, variant='primary', onClick, className='', size='md', icon:Icon, disabled=false }) {
  const sizes = {
    sm: { cls: 'text-[12px] px-4 py-2 gap-1.5', iconSz: 13 },
    md: { cls: 'text-[13.5px] px-5 py-2.5 gap-2', iconSz: 15 },
    lg: { cls: 'text-[15px] px-7 py-3.5 gap-2.5', iconSz: 17 },
  }
  const { cls, iconSz } = sizes[size] || sizes.md

  const base = `inline-flex items-center justify-center font-bold rounded-xl transition-all ${cls} ${className}`

  if (variant === 'primary') return (
    <motion.button
      whileHover={{ scale: 1.04, boxShadow: '0 0 28px rgba(200,240,0,0.5), 0 4px 16px rgba(0,0,0,0.4)' }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick} disabled={disabled}
      className={base}
      style={{ background:'var(--accent)', color:'#0a0a0a', border:'none', letterSpacing:'0.05em', textTransform:'uppercase', fontFamily:'Syne,sans-serif', opacity:disabled?0.5:1, cursor:disabled?'not-allowed':'pointer' }}>
      {Icon && <Icon size={iconSz} strokeWidth={2.5} />}{children}
    </motion.button>
  )

  if (variant === 'ghost') return (
    <motion.button
      whileHover={{ scale: 1.03, borderColor:'rgba(200,240,0,0.5)', color:'var(--accent)' }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick} disabled={disabled}
      className={base}
      style={{ background:'var(--raised)', color:'var(--text1)', border:'1px solid var(--border)', opacity:disabled?0.5:1, cursor:disabled?'not-allowed':'pointer', transition:'color 0.15s, border-color 0.15s' }}>
      {Icon && <Icon size={iconSz} strokeWidth={2} />}{children}
    </motion.button>
  )

  if (variant === 'danger') return (
    <motion.button
      whileHover={{ scale: 1.03, boxShadow:'0 0 18px rgba(255,77,77,0.3)' }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick} disabled={disabled}
      className={base}
      style={{ background:'rgba(255,77,77,0.12)', color:'var(--danger)', border:'1px solid rgba(255,77,77,0.4)', opacity:disabled?0.5:1, cursor:disabled?'not-allowed':'pointer' }}>
      {Icon && <Icon size={iconSz} strokeWidth={2} />}{children}
    </motion.button>
  )

  // outline
  return (
    <motion.button
      whileHover={{ scale: 1.03, background:'var(--accent-dim)' }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick} disabled={disabled}
      className={base}
      style={{ background:'transparent', color:'var(--accent)', border:'2px solid var(--accent)', opacity:disabled?0.5:1, cursor:disabled?'not-allowed':'pointer' }}>
      {Icon && <Icon size={iconSz} strokeWidth={2} />}{children}
    </motion.button>
  )
}

// ── TABLE ─────────────────────────────────────────────────
export function Table({ headers, children, className='' }) {
  return (
    <div className={`rounded-2xl overflow-hidden ${className}`} style={{ border:'1px solid var(--border)' }}>
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ background:'var(--raised)' }}>
            {headers.map(h => (
              <th key={h} className="text-left px-4 py-3 text-[11px] uppercase tracking-[0.10em] font-bold"
                  style={{ color:'var(--text2)', borderBottom:'1px solid var(--border)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function TR({ children, onClick }) {
  return (
    <motion.tr whileHover={{ backgroundColor:'var(--raised)' }} onClick={onClick}
      style={{ borderBottom:'1px solid var(--border)', cursor: onClick ? 'pointer' : 'default' }}>
      {children}
    </motion.tr>
  )
}

export function TD({ children, className='' }) {
  return <td className={`px-4 py-3.5 text-[13.5px] ${className}`} style={{ color:'var(--text1)' }}>{children}</td>
}

// ── BADGE ─────────────────────────────────────────────────
const BADGE_MAP = {
  activa:'b-active', activo:'b-active', active:'b-active',
  revision:'b-pending', pending:'b-pending',
  pausada:'b-paused', paused:'b-paused',
  borrador:'b-draft', draft:'b-draft',
}
const BADGE_LABELS = {
  activa:'Activa', activo:'Activo', active:'Activo',
  revision:'Revisión', pending:'Pendiente',
  pausada:'Pausada', paused:'Pausada',
  borrador:'Borrador', draft:'Borrador',
}
export function Badge({ status }) {
  return <span className={`badge ${BADGE_MAP[status] || 'b-draft'}`}>{BADGE_LABELS[status] || status}</span>
}

// ── SERVICE BADGE ─────────────────────────────────────────
const SVC_COLORS = {
  'Meta ADS':        { bg:'rgba(56,189,248,0.15)',  color:'#38bdf8' },
  'Social Media':    { bg:'rgba(167,139,250,0.15)', color:'#a78bfa' },
  'Content Creation':{ bg:'rgba(200,240,0,0.15)',   color:'var(--accent)' },
  'Pack Completo':   { bg:'rgba(245,158,11,0.15)',  color:'var(--warn)' },
}
export function SvcBadge({ service }) {
  const services = String(service || '').split(',').map(s => s.trim()).filter(Boolean)
  return (
    <div className="flex flex-wrap gap-1">
      {services.map(svc => {
        const s = SVC_COLORS[svc] || { bg:'var(--raised)', color:'var(--text2)' }
        return (
          <span key={svc} className="text-[11px] px-2.5 py-1 rounded-full font-semibold"
                style={{ background: s.bg, color: s.color }}>{svc}</span>
        )
      })}
    </div>
  )
}

// ── STAT ROW ──────────────────────────────────────────────
export function StatRow({ label, value, accent }) {
  return (
    <div className="flex justify-between items-center py-2" style={{ borderBottom:'1px solid var(--border)' }}>
      <span className="text-[12px] font-medium" style={{ color:'var(--text2)' }}>{label}</span>
      <span className="text-[13px] font-semibold" style={{ color: accent ? 'var(--accent)' : 'var(--text1)' }}>{value}</span>
    </div>
  )
}

// ── EMPTY STATE ───────────────────────────────────────────
export function Empty({ icon, title, sub, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="text-5xl opacity-20">{icon}</div>
      <div className="font-semibold text-[15px]" style={{ color:'var(--text1)' }}>{title}</div>
      <div className="text-[13px]" style={{ color:'var(--text2)' }}>{sub}</div>
      {action}
    </div>
  )
}

export { Toast, Modal } from '../layout/Topbar'
