import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '../store/index.jsx'

export default function Login() {
  const { login, loading, error, clearError } = useAuth()
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    try { await login(email, password) }
    catch {}
  }

  // Demo login sin GAS
  const demoLogin = async () => {
    clearError()
    try { await login('wanda@wasedigital.com', 'wase2026') }
    catch {
      // fallback manual si GAS no está conectado
      useAuth.setState({
        user: { id:'demo', nombre:'Wanda Bisogni', email:'wanda@wasedigital.com', rol:'admin', avatar:'WB' },
        loading: false, error: null,
      })
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(200,240,0,0.06) 0%, transparent 65%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.34, 1.2, 0.64, 1] }}
        className="relative w-full max-w-sm mx-4"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 3 }}
            className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black mb-4"
            style={{ background: 'var(--accent)', color: '#0a0a0a', fontFamily: 'Syne, sans-serif' }}
          >
            W
          </motion.div>
          <div className="text-[28px] font-black tracking-[-0.03em]"
               style={{ fontFamily: 'Syne, sans-serif' }}>
            WASE<span style={{ color: 'var(--accent)' }}>.</span>
          </div>
          <div className="text-[11px] uppercase tracking-[0.2em] mt-1" style={{ color: 'var(--text2)' }}>
            Panel de Gestión
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-7"
             style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h2 className="text-[17px] font-bold mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>
            Iniciá sesión
          </h2>
          <p className="text-[12.5px] mb-6" style={{ color: 'var(--text2)' }}>
            Ingresá con tu cuenta de Wase Digital
          </p>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-lg mb-4 text-[12.5px]"
              style={{ background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.3)', color: 'var(--danger)' }}
            >
              <AlertCircle size={14} />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10.5px] font-semibold uppercase tracking-wider"
                     style={{ color: 'var(--text2)' }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@wasedigital.com" required
                className="w-full text-[13px] py-2.5 px-3 rounded-lg outline-none transition-all"
                style={{ background: 'var(--raised)', border: '1px solid var(--border)', color: 'var(--text1)' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10.5px] font-semibold uppercase tracking-wider"
                     style={{ color: 'var(--text2)' }}>Contraseña</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full text-[13px] py-2.5 px-3 pr-10 rounded-lg outline-none transition-all"
                  style={{ background: 'var(--raised)', border: '1px solid var(--border)', color: 'var(--text1)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: 'var(--text2)' }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-[13.5px] transition-opacity"
              style={{ background: 'var(--accent)', color: '#0a0a0a', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Ingresando…' : 'Ingresar'}
              {!loading && <ArrowRight size={15} strokeWidth={2.5} />}
            </motion.button>
          </form>

          {/* Demo button */}
          <button onClick={demoLogin}
                  className="w-full mt-3 py-2.5 rounded-lg text-[12.5px] font-medium transition-colors"
                  style={{ border: '1px solid var(--border)', color: 'var(--text2)', background: 'transparent' }}
                  onMouseEnter={e => { e.target.style.borderColor='var(--accent)'; e.target.style.color='var(--accent)' }}
                  onMouseLeave={e => { e.target.style.borderColor='var(--border)'; e.target.style.color='var(--text2)' }}>
            Ver demo sin cuenta
          </button>
        </div>

        <p className="text-center text-[11px] mt-4" style={{ color: 'var(--text3)' }}>
          WASE Digital · Panel Interno v1.0
        </p>
      </motion.div>
    </div>
  )
}
