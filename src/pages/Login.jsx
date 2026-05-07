import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '../store/index.jsx'

export default function Login() {
  const { login, loading, error, clearError } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    try { await login(email, password) } catch {}
  }

  const demoLogin = async () => {
    clearError()
    try { await login('wanda@wasedigital.com', 'wase2026') }
    catch {
      useAuth.setState({
        user: { id:'demo', nombre:'Wanda Bisogni', email:'wanda@wasedigital.com', rol:'admin', avatar:'WB' },
        loading: false, error: null,
      })
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center"
         style={{ background: 'var(--bg)' }}>

      {/* Grid bg */}
      <div className="absolute inset-0 bg-grid opacity-40" />

      {/* Glow orb centrado */}
      <div className="absolute pointer-events-none"
           style={{
             width: 600, height: 600,
             borderRadius: '50%',
             background: 'radial-gradient(circle, rgba(200,240,0,0.07) 0%, transparent 65%)',
             transform: 'translate(-50%, -50%)',
             left: '50%', top: '50%',
           }} />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.34, 1.1, 0.64, 1] }}
        className="relative w-full mx-4"
        style={{ maxWidth: 380 }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            whileHover={{ scale: 1.06 }}
            className="mb-4 overflow-hidden rounded-2xl"
            style={{ width: 72, height: 40, background: 'transparent' }}
          >
            <img
              src="https://wasedigital.com/wp-content/uploads/2025/05/cropped-Diseno-sin-titulo-18-106x57.png"
              alt="Wase Digital"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </motion.div>
          <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: 'var(--text3)' }}>
            Panel de Gestión
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-7"
             style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h2 className="text-[18px] font-black mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>
            Iniciá sesión
          </h2>
          <p className="text-[12.5px] mb-6" style={{ color: 'var(--text2)' }}>
            Ingresá con tu cuenta de Wase Digital
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl mb-4 text-[12.5px]"
              style={{ background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.3)', color: 'var(--danger)' }}>
              <AlertCircle size={14} />{error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10.5px] font-black uppercase tracking-wider"
                     style={{ color: 'var(--text2)' }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@wasedigital.com" required
                className="w-full text-[13px] py-3 px-3.5 rounded-xl outline-none transition-all"
                style={{ background: 'var(--raised)', border: '1px solid var(--border)', color: 'var(--text1)' }}
                onFocus={e => { e.target.style.borderColor='var(--accent)'; e.target.style.boxShadow='0 0 0 3px rgba(200,240,0,0.1)' }}
                onBlur={e =>  { e.target.style.borderColor='var(--border)';  e.target.style.boxShadow='none' }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10.5px] font-black uppercase tracking-wider"
                     style={{ color: 'var(--text2)' }}>Contraseña</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full text-[13px] py-3 px-3.5 pr-11 rounded-xl outline-none transition-all"
                  style={{ background: 'var(--raised)', border: '1px solid var(--border)', color: 'var(--text1)' }}
                  onFocus={e => { e.target.style.borderColor='var(--accent)'; e.target.style.boxShadow='0 0 0 3px rgba(200,240,0,0.1)' }}
                  onBlur={e =>  { e.target.style.borderColor='var(--border)';  e.target.style.boxShadow='none' }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2"
                        style={{ color: 'var(--text2)' }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 28px rgba(200,240,0,0.45)' }}
              whileTap={{ scale: 0.97 }}
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-[14px] uppercase tracking-widest mt-2"
              style={{
                background: 'var(--accent)',
                color: '#0a0a0a',
                fontFamily: 'Syne, sans-serif',
                opacity: loading ? 0.7 : 1,
                letterSpacing: '0.08em',
              }}>
              {loading ? 'Ingresando…' : 'Ingresar'}
              {!loading && <ArrowRight size={16} strokeWidth={3} />}
            </motion.button>
          </form>

          <motion.button
            whileHover={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
            onClick={demoLogin}
            className="w-full mt-3 py-3 rounded-xl text-[13px] font-semibold transition-colors"
            style={{ border: '1px solid var(--border)', color: 'var(--text2)', background: 'transparent' }}>
            Ver demo sin cuenta
          </motion.button>
        </div>

        <p className="text-center text-[11px] mt-5" style={{ color: 'var(--text3)' }}>
          WASE Digital · Panel Interno v1.0
        </p>
      </motion.div>
    </div>
  )
}
