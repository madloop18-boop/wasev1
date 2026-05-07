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
  const w = sidebarOpen ? 232 : 60

  return (
    <motion.nav
      animate={{ width: w }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-full flex-shrink-0 z-20 overflow-hidden"
      style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}
    >
      {/* Accent line */}
      <div className="absolute right-0 top-0 bottom-0 w-px pointer-events-none"
           style={{ background: 'linear-gradient(to bottom, transparent, rgba(200,240,0,0.2) 50%, transparent)' }} />

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <motion.div whileHover={{ rotate: 8 }}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0"
          style={{ background: 'var(--accent)', color: '#0a0a0a', fontFamily: 'Syne, sans-serif' }}>
          W
        </motion.div>
        <AnimText show={sidebarOpen}>
          <div>
            <div className="font-black text-[15px] tracking-tight leading-none"
                 style={{ fontFamily: 'Syne, sans-serif' }}>
              WASE<span style={{ color: 'var(--accent)' }}>.</span>
            </div>
            <div className="text-[9px] uppercase tracking-[0.15em] mt-0.5" style={{ color: 'var(--text3)' }}>
              Marketing Digital
            </div>
          </div>
        </AnimText>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
        {NAV.map(({ section, items }) => (
          <div key={section} className="mb-1 px-2.5">
            <AnimText show={sidebarOpen}>
              <div className="text-[9px] uppercase tracking-[0.16em] px-2 py-2 font-semibold"
                   style={{ color: 'var(--text3)' }}>{section}</div>
            </AnimText>
            {items.map(({ id, label, icon: Icon, badge }) => {
              const active = activePage === id
              return (
                <motion.button key={id} onClick={() => setPage(id)}
                  whileHover={{ x: active ? 0 : 2 }} whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-0.5 relative group"
                  style={{ background: active ? 'var(--accent-dim)' : 'transparent', color: active ? 'var(--accent)' : 'var(--text2)' }}
                >
                  {active && (
                    <motion.div layoutId="activeBar"
                      className="absolute left-0 top-[20%] bottom-[20%] w-0.5 rounded-r-full"
                      style={{ background: 'var(--accent)' }} />
                  )}
                  <Icon size={15} strokeWidth={active ? 2.5 : 2} className="flex-shrink-0" />
                  <AnimText show={sidebarOpen}>
                    <span className="text-[12.5px] font-medium whitespace-nowrap flex-1 text-left">{label}</span>
                  </AnimText>
                  {badge && sidebarOpen && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                          style={{ background: 'var(--accent)', color: '#0a0a0a' }}>{badge}</span>
                  )}
                  {!sidebarOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 rounded-md text-[11.5px] font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50"
                         style={{ background: 'var(--overlay)', color: 'var(--text1)', border: '1px solid var(--border)' }}>
                      {label}
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t p-2.5" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer hover:bg-[var(--raised)] transition-colors">
          <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-black"
               style={{ background: 'var(--accent)', color: '#0a0a0a' }}>
            {user?.avatar || 'WB'}
          </div>
          <AnimText show={sidebarOpen}>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold truncate">{user?.nombre || 'Wanda Bisogni'}</div>
              <div className="text-[10px] truncate" style={{ color: 'var(--text3)' }}>Agency Owner</div>
            </div>
          </AnimText>
        </div>
        <div className="flex items-center justify-between mt-1 px-1">
          <motion.button onClick={logout} whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 text-[11px] py-1 px-2 rounded transition-colors hover:bg-[var(--raised)]"
            style={{ color: 'var(--text3)' }}>
            <AnimText show={sidebarOpen}><span>Salir</span></AnimText>
            <LogOut size={12} />
          </motion.button>
          <motion.button onClick={toggleSidebar} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            className="w-7 h-7 flex items-center justify-center rounded transition-colors hover:bg-[var(--raised)]"
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
    <motion.div animate={{ opacity: show ? 1 : 0, width: show ? 'auto' : 0 }}
      transition={{ duration: 0.2 }} className="overflow-hidden flex-1 min-w-0">
      {children}
    </motion.div>
  )
}
