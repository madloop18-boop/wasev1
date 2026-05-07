import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, TrendingUp, Users, GitBranch,
  Zap, Calendar, FileText, BarChart3, ChevronLeft, LogOut,
  ChevronRight
} from 'lucide-react'
import { useStore, useAuth } from '../../store'

const NAV = [
  { 
    section: 'Principal', 
    items: [
      { id: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard, desc: 'Resumen ejecutivo' },
      { id: 'analytics',  label: 'Analytics',  icon: TrendingUp,      desc: 'Métricas y KPIs' },
      { id: 'reportes',   label: 'Reportes',   icon: BarChart3,       desc: 'Reportes clientes' },
    ]
  },
  { 
    section: 'Clientes', 
    items: [
      { id: 'clientes',   label: 'Clientes',   icon: Users,     badge: 8,  desc: 'Gestión de cuentas' },
      { id: 'pipeline',   label: 'Pipeline',   icon: GitBranch,          desc: 'Oportunidades' },
      { id: 'cotizador',  label: 'Cotizador',  icon: FileText,           desc: 'Propuestas' },
    ]
  },
  { 
    section: 'Campañas', 
    items: [
      { id: 'campanas',   label: 'Campañas',   icon: Zap,       badge: 5,  desc: 'Campañas activas' },
      { id: 'calendario', label: 'Calendario', icon: Calendar,           desc: 'Editorial de contenidos' },
    ]
  },
]

export default function Sidebar() {
  const { activePage, setPage, sidebarOpen, toggleSidebar } = useStore()
  const { user, logout } = useAuth()
  const w = sidebarOpen ? 260 : 72

  return (
    <motion.nav
      animate={{ width: w }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-full flex-shrink-0 z-30 overflow-hidden"
      style={{ 
        background: 'var(--surface)', 
        borderRight: '1px solid var(--border)',
        boxShadow: sidebarOpen ? '4px 0 24px rgba(0,0,0,0.3)' : 'none'
      }}
    >
      {/* Top accent glow line */}
      <div 
        className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none z-10"
        style={{ 
          background: 'linear-gradient(90deg, transparent, var(--accent-glow), transparent)',
          opacity: 0.6
        }} 
      />

      {/* Vertical accent line */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-px pointer-events-none"
        style={{ 
          background: 'linear-gradient(to bottom, transparent, rgba(200,240,0,0.15) 30%, rgba(200,240,0,0.15) 70%, transparent)' 
        }} 
      />

      {/* Logo Header */}
      <div 
        className="flex items-center gap-3 px-5 py-5 border-b flex-shrink-0"
        style={{ borderColor: 'var(--border)' }}
      >
        <motion.div 
          whileHover={{ rotate: 8, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 relative overflow-hidden"
          style={{ 
            background: 'var(--accent)', 
            color: '#080808', 
            fontFamily: 'Syne, sans-serif',
            boxShadow: '0 0 16px rgba(200,240,0,0.2)'
          }}
        >
          W
        </motion.div>
        
        <AnimText show={sidebarOpen}>
          <div className="flex flex-col">
            <div 
              className="font-black text-[16px] tracking-tight leading-none"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              WASE<span style={{ color: 'var(--accent)' }}>.</span>
            </div>
            <div 
              className="text-[10px] uppercase tracking-[0.2em] mt-0.5 font-medium"
              style={{ color: 'var(--text4)' }}
            >
              Marketing Digital
            </div>
          </div>
        </AnimText>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2.5 space-y-1">
        {NAV.map(({ section, items }, sectionIdx) => (
          <div key={section} className="mb-4">
            {/* Section label */}
            <AnimText show={sidebarOpen}>
              <div className="flex items-center gap-2 px-3 mb-2">
                <div 
                  className="h-px flex-1"
                  style={{ background: 'linear-gradient(90deg, var(--border), transparent)' }}
                />
                <span 
                  className="text-[9px] uppercase tracking-[0.18em] font-bold flex-shrink-0"
                  style={{ color: 'var(--text4)' }}
                >
                  {section}
                </span>
                <div 
                  className="h-px flex-1"
                  style={{ background: 'linear-gradient(90deg, transparent, var(--border))' }}
                />
              </div>
            </AnimText>
            
            {!sidebarOpen && (
              <div className="h-px mx-3 mb-2" style={{ background: 'var(--border)' }} />
            )}

            {items.map(({ id, label, icon: Icon, badge, desc }) => {
              const active = activePage === id
              return (
                <motion.button
                  key={id}
                  onClick={() => setPage(id)}
                  whileHover={{ x: active ? 0 : 3 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 relative group focus-ring"
                  style={{ 
                    background: active ? 'var(--accent-dim)' : 'transparent',
                    color: active ? 'var(--accent)' : 'var(--text2)',
                    border: active ? '1px solid rgba(200,240,0,0.15)' : '1px solid transparent',
                  }}
                >
                  {/* Active indicator */}
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-[25%] bottom-[25%] w-[3px] rounded-r-full"
                      style={{ 
                        background: 'var(--accent)',
                        boxShadow: '0 0 8px var(--accent-glow)'
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}

                  {/* Icon */}
                  <div className="relative flex-shrink-0">
                    <Icon 
                      size={17} 
                      strokeWidth={active ? 2.5 : 1.8} 
                      className="transition-all duration-200"
                    />
                    {/* Active icon glow */}
                    {active && (
                      <motion.div
                        className="absolute inset-[-4px] rounded-lg -z-10"
                        style={{ background: 'var(--accent-dim)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                  </div>

                  {/* Label & description */}
                  <AnimText show={sidebarOpen}>
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <span className="text-[13px] font-semibold whitespace-nowrap leading-tight">
                        {label}
                      </span>
                      <span 
                        className="text-[10px] font-medium whitespace-nowrap leading-tight mt-0.5"
                        style={{ color: active ? 'rgba(200,240,0,0.6)' : 'var(--text4)' }}
                      >
                        {desc}
                      </span>
                    </div>
                  </AnimText>

                  {/* Badge */}
                  {badge && sidebarOpen && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ 
                        background: 'var(--accent)', 
                        color: '#080808',
                        boxShadow: '0 0 8px rgba(200,240,0,0.3)'
                      }}
                    >
                      {badge}
                    </motion.span>
                  )}

                  {/* Collapsed tooltip */}
                  {!sidebarOpen && (
                    <div 
                      className="absolute left-full ml-3 px-3 py-2 rounded-xl text-[12px] font-semibold whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 glass"
                      style={{ 
                        transform: 'translateX(-4px)',
                        boxShadow: 'var(--shadow-lg)'
                      }}
                    >
                      <div className="font-semibold">{label}</div>
                      <div className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--text3)' }}>
                        {desc}
                      </div>
                      {/* Arrow */}
                      <div 
                        className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 rotate-45"
                        style={{ 
                          background: 'var(--overlay)', 
                          borderLeft: '1px solid var(--border)',
                          borderBottom: '1px solid var(--border)'
                        }}
                      />
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div 
        className="border-t flex-shrink-0 p-3"
        style={{ borderColor: 'var(--border)' }}
      >
        {/* User card */}
        <div 
          className="flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 cursor-pointer hover:bg-[var(--raised)] group"
          style={{ border: '1px solid transparent' }}
        >
          <div 
            className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-black relative overflow-hidden"
            style={{ 
              background: 'var(--accent)', 
              color: '#080808',
              boxShadow: '0 0 12px rgba(200,240,0,0.2)'
            }}
          >
            {user?.avatar || 'WB'}
          </div>
          
          <AnimText show={sidebarOpen}>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold truncate leading-tight">
                {user?.nombre || 'Wanda Bisogni'}
              </div>
              <div 
                className="text-[10px] font-medium truncate mt-0.5"
                style={{ color: 'var(--text4)' }}
              >
                Agency Owner
              </div>
            </div>
          </AnimText>
        </div>

        {/* Actions row */}
        <div className="flex items-center justify-between mt-2 px-1">
          <motion.button
            onClick={logout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-[11px] font-semibold py-1.5 px-2.5 rounded-lg transition-all duration-200 hover:bg-[var(--raised)]"
            style={{ color: 'var(--text4)' }}
          >
            <AnimText show={sidebarOpen}>
              <span>Salir</span>
            </AnimText>
            <LogOut size={13} strokeWidth={2} />
          </motion.button>

          <motion.button
            onClick={toggleSidebar}
            whileHover={{ scale: 1.1, backgroundColor: 'var(--raised)' }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
            style={{ color: 'var(--text3)' }}
          >
            <motion.div
              animate={{ rotate: sidebarOpen ? 0 : 180 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <ChevronLeft size={14} strokeWidth={2.5} />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}

function AnimText({ show, children }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden flex-1 min-w-0"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}