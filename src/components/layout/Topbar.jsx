// ── TOPBAR ────────────────────────────────────────────────
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, Plus, CheckCircle, AlertTriangle, X, ChevronRight } from 'lucide-react'
import { useStore, useAuth } from '../../store'

const META = {
  dashboard:  ['Dashboard',   'Resumen ejecutivo — Mayo 2026'],
  analytics:  ['Analytics',   'Métricas y rendimiento de campañas'],
  clientes:   ['Clientes',    'Gestión de cuentas activas'],
  pipeline:   ['Pipeline',    'Seguimiento de oportunidades'],
  campanas:   ['Campañas',    'Campañas activas y métricas'],
  calendario: ['Calendario',  'Calendario editorial de contenidos'],
  cotizador:  ['Cotizador',   'Generador de propuestas comerciales'],
  reportes:   ['Reportes',    'Reportes para clientes'],
}

export function Topbar() {
  const { activePage, showToast } = useStore()
  const { user } = useAuth()
  const [focused, setFocused] = useState(false)
  const [title, sub] = META[activePage] || ['', '']

  return (
    <header className="h-[60px] flex items-center gap-4 px-5 flex-shrink-0"
            style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>

      {/* Page title */}
      <motion.div key={title} initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }}
        className="flex items-baseline gap-3 flex-1">
        <h1 className="text-[16px] font-black leading-none" style={{ fontFamily: 'Syne, sans-serif' }}>{title}</h1>
        {sub && (
          <>
            <ChevronRight size={11} style={{ color:'var(--text3)', flexShrink:0 }} />
            <span className="text-[11.5px] hidden sm:block" style={{ color: 'var(--text3)' }}>{sub}</span>
          </>
        )}
      </motion.div>

      {/* Search */}
      <motion.div animate={{ width: focused ? 260 : 200 }} transition={{ duration: 0.2 }} className="relative hidden md:block">
        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text3)' }} />
        <input
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Buscar…"
          className="w-full text-[12.5px] py-2 pl-8 pr-3 rounded-xl outline-none"
          style={{
            background: 'var(--raised)',
            border: `1px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
            color: 'var(--text1)',
            transition: 'border-color 0.15s',
            boxShadow: focused ? '0 0 0 3px rgba(200,240,0,0.1)' : 'none',
          }}
        />
      </motion.div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Bell */}
        <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
          className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-[var(--raised)]"
          style={{ color: 'var(--text2)', border: '1px solid var(--border)' }}>
          <Bell size={16} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full pulse-dot" style={{ background: 'var(--accent)' }} />
        </motion.button>

        {/* CTA — Nuevo */}
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 24px rgba(200,240,0,0.5), 0 4px 12px rgba(0,0,0,0.4)' }}
          whileTap={{ scale: 0.96 }}
          onClick={() => showToast('Acción rápida')}
          className="flex items-center gap-2 font-black rounded-xl px-5 py-2"
          style={{
            background: 'var(--accent)',
            color: '#0a0a0a',
            fontFamily: 'Syne, sans-serif',
            fontSize: '13px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
          <Plus size={15} strokeWidth={3} />
          <span className="hidden sm:block">Nuevo</span>
        </motion.button>
      </div>
    </header>
  )
}

export default Topbar

// ── TOAST ─────────────────────────────────────────────────
export function Toast() {
  const { toast } = useStore()
  const icons = { success: CheckCircle, error: AlertTriangle, warn: AlertTriangle }
  const colors = { success: 'var(--accent)', error: 'var(--danger)', warn: 'var(--warn)' }

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity:0, y:16, scale:0.95 }}
          animate={{ opacity:1, y:0, scale:1 }}
          exit={{ opacity:0, y:8, scale:0.95 }}
          className="fixed bottom-5 right-5 flex items-center gap-2.5 px-4 py-3 rounded-2xl text-[12.5px] z-[200] max-w-xs"
          style={{ background:'var(--overlay)', border:'1px solid var(--border)', boxShadow:'0 8px 32px rgba(0,0,0,0.5)', color:'var(--text1)' }}>
          {(() => { const I = icons[toast.type] || CheckCircle; return <I size={15} style={{ color: colors[toast.type] || 'var(--accent)', flexShrink:0 }} /> })()}
          <span>{toast.msg}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── MODAL ─────────────────────────────────────────────────
export function Modal() {
  const { modal, closeModal } = useStore()
  return (
    <AnimatePresence>
      {modal && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          onClick={closeModal}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)' }}>
          <motion.div initial={{ scale:0.95, y:10 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95, y:6 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md mx-4 rounded-2xl overflow-hidden"
            style={{ background:'var(--surface)', border:'1px solid var(--border)', boxShadow:'0 24px 60px rgba(0,0,0,0.7)' }}>
            {modal}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
