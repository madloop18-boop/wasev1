import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, Plus, CheckCircle, AlertTriangle, X, Command } from 'lucide-react'
import { useStore, useAuth } from '../../store'

const META = {
  dashboard:  ['Dashboard',   'Resumen ejecutivo · Mayo 2026'],
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
    <header 
      className="h-[56px] flex items-center gap-4 px-5 flex-shrink-0 relative z-20"
      style={{ 
        borderBottom: '1px solid var(--border)', 
        background: 'var(--surface)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
      }}
    >
      {/* Title section */}
      <motion.div
        key={title}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="flex items-baseline gap-3 flex-1 min-w-0"
      >
        <h1 
          className="text-[17px] font-bold leading-none tracking-tight"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          {title}
        </h1>
        <span 
          className="text-[12px] hidden sm:block font-medium truncate"
          style={{ color: 'var(--text4)' }}
        >
          {sub}
        </span>
      </motion.div>

      {/* Search */}
      <motion.div
        animate={{ width: focused ? 280 : 220 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="relative hidden md:block flex-shrink-0"
      >
        <Search 
          size={14} 
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: focused ? 'var(--accent)' : 'var(--text4)' }}
        />
        <input
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Buscar clientes, campañas..."
          className="w-full text-[13px] py-2.5 pl-10 pr-10 rounded-xl input"
        />
        <div 
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none"
          style={{ color: 'var(--text4)' }}
        >
          <Command size={10} strokeWidth={2.5} />
          <span className="text-[10px] font-bold">K</span>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Notification bell */}
        <motion.button
          whileHover={{ scale: 1.08, backgroundColor: 'var(--raised)' }}
          whileTap={{ scale: 0.92 }}
          className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
          style={{ color: 'var(--text2)' }}
        >
          <Bell size={16} strokeWidth={1.8} />
          {/* Notification dot */}
          <span 
            className="absolute top-2 right-2 w-2 h-2 rounded-full pulse-dot"
            style={{ 
              background: 'var(--accent)',
              boxShadow: '0 0 6px var(--accent)'
            }} 
          />
        </motion.button>

        {/* New button */}
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => showToast('Acción rápida')}
          className="btn btn-primary"
          style={{ boxShadow: 'var(--shadow-sm), 0 0 0 1px rgba(200,240,0,0.3), 0 4px 12px rgba(200,240,0,0.15)' }}
        >
          <Plus size={14} strokeWidth={2.5} />
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
  const icons = { success: CheckCircle, error: AlertTriangle, warn: AlertTriangle, info: Bell }
  const colors = { 
    success: 'var(--accent)', 
    error: 'var(--danger)', 
    warn: 'var(--warn)', 
    info: 'var(--info)' 
  }

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95, x: 20 }}
          animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
          exit={{ opacity: 0, y: 10, scale: 0.95, x: 10 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-6 right-6 flex items-start gap-3 px-5 py-4 rounded-2xl text-[13px] z-[200] max-w-sm glass"
          style={{ 
            boxShadow: 'var(--shadow-lg), 0 0 0 1px var(--border)',
          }}
        >
          {(() => {
            const I = icons[toast.type] || CheckCircle
            return (
              <div 
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
                style={{ 
                  background: `${colors[toast.type] || colors.success}15`,
                  color: colors[toast.type] || colors.success
                }}
              >
                <I size={16} strokeWidth={2} />
              </div>
            )
          })()}
          <div className="flex-1 min-w-0">
            <div className="font-semibold leading-tight">{toast.msg}</div>
            {toast.sub && (
              <div className="text-[11px] mt-1 font-medium" style={{ color: 'var(--text3)' }}>
                {toast.sub}
              </div>
            )}
          </div>
          <button 
            onClick={() => useStore.getState().hideToast()}
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md hover:bg-[var(--raised)] transition-colors"
            style={{ color: 'var(--text4)' }}
          >
            <X size={14} />
          </button>
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeModal}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ 
            background: 'rgba(0,0,0,0.6)', 
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl overflow-hidden relative"
            style={{ 
              background: 'var(--surface)', 
              border: '1px solid var(--border)', 
              boxShadow: 'var(--shadow-lg), 0 0 60px rgba(0,0,0,0.4)'
            }}
          >
            {/* Top glow */}
            <div 
              className="absolute top-0 left-0 right-0 h-px"
              style={{ 
                background: 'linear-gradient(90deg, transparent, var(--accent-glow), transparent)' 
              }}
            />
            {modal}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}