// ── SIDEBAR ───────────────────────────────────────────────
import { motion } from 'framer-motion'
import {
  LayoutDashboard, TrendingUp, Users, GitBranch,
  Zap, Calendar, FileText, BarChart3, ChevronLeft, LogOut
} from 'lucide-react'
import { useStore, useAuth } from '../../store'

const NAV = [
  { section: 'Principal', items: [
    { id: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
    { id: 'analytics',  label: 'Analytics',  icon: TrendingUp },
    { id: 'reportes',   label: 'Reportes',   icon: BarChart3 },
  ]},
  { section: 'Clientes', items: [
    { id: 'clientes',   label: 'Clientes',   icon: Users,     badge: 8 },
    { id: 'pipeline',   label: 'Pipeline',   icon: GitBranch },
    { id: 'cotizador',  label: 'Cotizador',  icon: FileText },
  ]},
  { section: 'Campañas', items: [
    { id: 'campanas',   label: 'Campañas',   icon: Zap,       badge: 5 },
    { id: 'calendario', label: 'Calendario', icon: Calendar },
  ]},
]

export default function Sidebar() {
  const { activePage, setPage, sidebarOpen, toggleSidebar } = useStore()
  const { user, logout } = useAuth()
  const w = sidebarOpen ? 236 : 64

  return (
    <motion.nav
      animate={{ width: w }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-full flex-shrink-0 z-20 overflow-hidden"
      style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}>

      {/* Accent glow line */}
      <div className="absolute right-0 top-0 bottom-0 w-px pointer-events-none"
           style={{ background: 'linear-gradient(to bottom, transparent, rgba(200,240,0,0.25) 50%, transparent)' }} />

      {/* ── LOGO ── */}
      <div className="flex items-center gap-3 px-4 py-[18px] border-b" style={{ borderColor: 'var(--border)' }}>
        <motion.div
          whileHover={{ scale: 1.06 }}
          className="flex-shrink-0 overflow-hidden rounded-lg"
          style={{ width: 36, height: 36, background: 'var(--raised)' }}>
          <img
            src="https://wasedigital.com/wp-content/uploads/2025/05/cropped-Diseno-sin-titulo-18-106x57.png"
            alt="Wase Digital"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </motion.div>
        <AnimText show={sidebarOpen}>
          <div>
            <div className="font-black text-[15px] tracking-tight leading-none"
                 style={{ fontFamily: 'Syne, sans-serif' }}>
              WASE<span style={{ color: 'var(--accent)' }}>.</span>
            </div>
            <div className="text-[9px] uppercase tracking-[0.18em] mt-0.5" style={{ color: 'var(--text3)' }}>
              Marketing Digital
            </div>
          </div>
        </AnimText>
      </div>

      {/* ── NAV ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3">
        {NAV.map(({ section, items }) => (
          <div key={section} className="mb-2 px-2.5">
            <AnimText show={sidebarOpen}>
              <div className="text-[9px] uppercase tracking-[0.18em] px-2 pt-2 pb-1.5 font-black"
                   style={{ color: 'var(--text3)' }}>{section}</div>
            </AnimText>
            {items.map(({ id, label, icon: Icon, badge }) => {
              const active = activePage === id
              return (
                <motion.button key={id} onClick={() => setPage(id)}
                  whileHover={{ x: active ? 0 : 3 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center gap-3 rounded-xl mb-0.5 relative group"
                  style={{
                    padding: sidebarOpen ? '9px 10px 9px 12px' : '9px 0',
                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                    background: active ? 'var(--accent-dim)' : 'transparent',
                    color: active ? 'var(--accent)' : 'var(--text2)',
                    border: active ? '1px solid rgba(200,240,0,0.2)' : '1px solid transparent',
                  }}>
                  {/* Active indicator */}
                  {active && (
                    <motion.div layoutId="activeBar"
                      className="absolute left-0 top-[18%] bottom-[18%] w-[3px] rounded-r-full"
                      style={{ background: 'var(--accent)' }} />
                  )}
                  <Icon size={16} strokeWidth={active ? 2.5 : 2} className="flex-shrink-0" />
                  <AnimText show={sidebarOpen}>
                    <span className="text-[13px] font-semibold whitespace-nowrap flex-1 text-left">{label}</span>
                  </AnimText>
                  {badge && sidebarOpen && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                          style={{ background: 'var(--accent)', color: '#0a0a0a' }}>{badge}</span>
                  )}
                  {/* Collapsed tooltip */}
                  {!sidebarOpen && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 rounded-xl text-[12px] font-semibold whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50"
                         style={{ background: 'var(--overlay)', color: 'var(--text1)', border: '1px solid var(--border)', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
                      {label}
                      {badge && <span className="ml-1.5 text-[10px] font-black px-1 py-0.5 rounded-full" style={{ background:'var(--accent)', color:'#0a0a0a' }}>{badge}</span>}
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>
        ))}
      </div>

      {/* ── FOOTER ── */}
      <div className="border-t p-2.5 space-y-1" style={{ borderColor: 'var(--border)' }}>
        {/* User */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer hover:bg-[var(--raised)] transition-colors"
             style={{ border: '1px solid transparent' }}>
          <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-[11px] font-black"
               style={{ background: 'var(--accent)', color: '#0a0a0a', flexShrink: 0 }}>
            {user?.avatar || 'WB'}
          </div>
          <AnimText show={sidebarOpen}>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-bold truncate">{user?.nombre || 'Wanda Bisogni'}</div>
              <div className="text-[10px] truncate" style={{ color: 'var(--text3)' }}>Agency Owner</div>
            </div>
          </AnimText>
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between px-1">
          <motion.button onClick={logout}
            whileHover={{ color: 'var(--danger)' }}
            className="flex items-center gap-1.5 text-[11.5px] py-1.5 px-2 rounded-lg transition-colors"
            style={{ color: 'var(--text3)' }}>
            <LogOut size={12} />
            <AnimText show={sidebarOpen}><span>Salir</span></AnimText>
          </motion.button>

          <motion.button onClick={toggleSidebar}
            whileHover={{ scale: 1.1, background: 'var(--raised)' }}
            whileTap={{ scale: 0.9 }}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: 'var(--text3)' }}>
            <motion.div animate={{ rotate: sidebarOpen ? 0 : 180 }} transition={{ duration: 0.25 }}>
              <ChevronLeft size={13} />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}

function AnimText({ show, children }) {
  return (
    <motion.div
      animate={{ opacity: show ? 1 : 0, width: show ? 'auto' : 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden flex-1 min-w-0">
      {children}
    </motion.div>
  )
}
