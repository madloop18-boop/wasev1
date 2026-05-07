import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore, useAuth } from './store/index.jsx'
import Sidebar from './components/layout/Sidebar'
import Topbar  from './components/layout/Topbar'
import { Toast, Modal } from './components/layout/Topbar'

import Splash  from './components/ui/Splash'
import Login   from './pages/Login'

import Dashboard  from './pages/Dashboard'
import Analytics  from './pages/Analytics'
import Clientes   from './pages/Clientes'
import Pipeline   from './pages/Pipeline'
import Campanas   from './pages/Campanas'
import Calendario from './pages/Calendario'
import Cotizador  from './pages/Cotizador'
import Reportes   from './pages/Reportes'

const PAGES = {
  dashboard:  Dashboard,
  analytics:  Analytics,
  clientes:   Clientes,
  pipeline:   Pipeline,
  campanas:   Campanas,
  calendario: Calendario,
  cotizador:  Cotizador,
  reportes:   Reportes,
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
      <AnimatePresence>
        {!splashDone && <Splash onDone={() => setSplashDone(true)} />}
      </AnimatePresence>

      {splashDone && !user && (
        <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 50 }}>
          <Login />
        </div>
      )}

      {splashDone && user && (
        <div className="noise flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
          {/* Ambient glows */}
          <div className="pointer-events-none fixed top-0 left-0 w-[500px] h-[500px] rounded-full"
               style={{ background: 'radial-gradient(circle, rgba(200,240,0,0.05) 0%, transparent 70%)', transform: 'translate(-40%,-40%)' }} />
          <div className="pointer-events-none fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full"
               style={{ background: 'radial-gradient(circle, rgba(200,240,0,0.03) 0%, transparent 70%)', transform: 'translate(40%,40%)' }} />

          <Sidebar />

          <div className="flex flex-col flex-1 overflow-hidden">
            <Topbar />
            <main className="flex-1 overflow-y-auto bg-grid">
              <AnimatePresence mode="wait">
                <motion.div key={activePage}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="h-full"
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
