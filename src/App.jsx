import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore, useAuth } from './store/index.jsx'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import { Toast, Modal } from './components/layout/Topbar'

import Splash from './components/ui/Splash'
import Login from './pages/Login'

import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Clientes from './pages/Clientes'
import Pipeline from './pages/Pipeline'
import Campanas from './pages/Campanas'
import Calendario from './pages/Calendario'
import Cotizador from './pages/Cotizador'
import Reportes from './pages/Reportes'

const PAGES = {
  dashboard: Dashboard,
  analytics: Analytics,
  clientes: Clientes,
  pipeline: Pipeline,
  campanas: Campanas,
  calendario: Calendario,
  cotizador: Cotizador,
  reportes: Reportes,
}

export default function App() {
  const { activePage, fetchAll } = useStore()
  const { user } = useAuth()
  const [splashDone, setSplashDone] = useState(false)

  useEffect(() => {
    if (user) fetchAll()
  }, [user])

  const Page = PAGES[activePage] || Dashboard

  return (
    <>
      <AnimatePresence mode="wait">
        {!splashDone && <Splash onDone={() => setSplashDone(true)} />}
      </AnimatePresence>

      {splashDone && !user && <Login />}

      {splashDone && user && (
        <div className="noise flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
          {/* Ambient glow effects */}
          <div 
            className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full opacity-60"
            style={{ 
              background: 'radial-gradient(circle, rgba(200,240,0,0.04) 0%, transparent 70%)',
              transform: 'translate(-50%,-50%)',
              filter: 'blur(40px)'
            }} 
          />
          <div 
            className="pointer-events-none fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-40"
            style={{ 
              background: 'radial-gradient(circle, rgba(200,240,0,0.03) 0%, transparent 70%)',
              transform: 'translate(30%,30%)',
              filter: 'blur(40px)'
            }} 
          />
          {/* Secondary subtle glow */}
          <div 
            className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
            style={{ 
              background: 'radial-gradient(circle, rgba(200,240,0,0.02) 0%, transparent 60%)',
            }} 
          />

          <Sidebar />

          <div className="flex flex-col flex-1 overflow-hidden relative">
            <Topbar />
            <main className="flex-1 overflow-y-auto bg-grid relative">
              {/* Content glow */}
              <div 
                className="pointer-events-none absolute top-0 right-0 w-[300px] h-[300px] rounded-full opacity-30"
                style={{ 
                  background: 'radial-gradient(circle, rgba(200,240,0,0.02) 0%, transparent 70%)',
                  transform: 'translate(30%,-30%)',
                }} 
              />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePage}
                  initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  className="h-full p-5"
                >
                  <Page />
                </motion.div>
              </AnimatePresence>
            </main>
          </div>

          <Toast />
          <Modal />
        </div>
      )}
    </>
  )
}