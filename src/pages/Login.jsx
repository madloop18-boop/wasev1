import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a',
      overflow: 'hidden',
    }}>

      {/* ── Grid background ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* ── Glow orbs ── */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700, height: 700, borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(200,240,0,0.08) 0%, transparent 60%)',
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', right: '-100px',
        width: 400, height: 400, borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(200,240,0,0.04) 0%, transparent 70%)',
      }} />

      {/* ── Animated accent ring ── */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 600, height: 600,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%', pointerEvents: 'none',
          border: '1px solid rgba(200,240,0,0.04)',
        }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 800, height: 800,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%', pointerEvents: 'none',
          border: '1px solid rgba(200,240,0,0.025)',
        }}
      />

      {/* ── Main card ── */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.1, 0.64, 1] }}
        style={{
          position: 'relative', zIndex: 10,
          width: '100%', maxWidth: 400,
          margin: '0 16px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}
      >

        {/* ── LOGO SECTION ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 36 }}
        >
          {/* Logo glow halo */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                width: 180, height: 80, borderRadius: 20,
                background: 'radial-gradient(ellipse, rgba(200,240,0,0.35) 0%, transparent 70%)',
                filter: 'blur(16px)',
                pointerEvents: 'none',
              }}
            />
            <motion.img
              src="https://wasedigital.com/wp-content/uploads/2025/05/cropped-Diseno-sin-titulo-18-106x57.png"
              alt="Wase Digital"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.34, 1.2, 0.64, 1] }}
              whileHover={{ scale: 1.06 }}
              style={{
                position: 'relative', zIndex: 1,
                width: 160, height: 86,
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 20px rgba(200,240,0,0.4))',
              }}
            />
          </div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            style={{
              marginTop: 12,
              fontSize: 10,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Panel de Gestión
          </motion.div>
        </motion.div>

        {/* ── FORM CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
          style={{
            width: '100%',
            background: '#141414',
            border: '1px solid #2a2a2a',
            borderRadius: 20,
            padding: '28px 28px 24px',
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <h2 style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 20, fontWeight: 900,
              color: '#f5f5f5', margin: 0, marginBottom: 4,
            }}>
              Iniciá sesión
            </h2>
            <p style={{ fontSize: 12.5, color: '#888', margin: 0 }}>
              Ingresá con tu cuenta de Wase Digital
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 12px', borderRadius: 12, marginBottom: 16,
                  background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.3)',
                  color: '#ff4d4d', fontSize: 12.5,
                }}>
                <AlertCircle size={14} style={{ flexShrink: 0 }} />{error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Email */}
            <div>
              <label style={{
                display: 'block', fontSize: 10.5, fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.12em',
                color: '#666', marginBottom: 6,
              }}>Email</label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@wasedigital.com" required
                style={{
                  width: '100%', boxSizing: 'border-box',
                  fontSize: 13.5, padding: '11px 14px',
                  borderRadius: 12, outline: 'none',
                  background: '#1e1e1e', color: '#f5f5f5',
                  border: '1px solid #333', transition: 'border-color 0.15s, box-shadow 0.15s',
                  fontFamily: 'DM Sans, sans-serif',
                }}
                onFocus={e => { e.target.style.borderColor='#c8f000'; e.target.style.boxShadow='0 0 0 3px rgba(200,240,0,0.12)' }}
                onBlur={e =>  { e.target.style.borderColor='#333';     e.target.style.boxShadow='none' }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{
                display: 'block', fontSize: 10.5, fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.12em',
                color: '#666', marginBottom: 6,
              }}>Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    fontSize: 13.5, padding: '11px 44px 11px 14px',
                    borderRadius: 12, outline: 'none',
                    background: '#1e1e1e', color: '#f5f5f5',
                    border: '1px solid #333', transition: 'border-color 0.15s, box-shadow 0.15s',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                  onFocus={e => { e.target.style.borderColor='#c8f000'; e.target.style.boxShadow='0 0 0 3px rgba(200,240,0,0.12)' }}
                  onBlur={e =>  { e.target.style.borderColor='#333';     e.target.style.boxShadow='none' }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute', right: 14, top: '50%',
                    transform: 'translateY(-50%)', color: '#666',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 32px rgba(200,240,0,0.5), 0 4px 20px rgba(0,0,0,0.5)' }}
              whileTap={{ scale: 0.97 }}
              type="submit" disabled={loading}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px 0', borderRadius: 14, border: 'none',
                background: '#c8f000', color: '#0a0a0a',
                fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 900,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: 4,
              }}>
              {loading ? 'Ingresando…' : 'Ingresar'}
              {!loading && <ArrowRight size={17} strokeWidth={3} />}
            </motion.button>
          </form>

          <motion.button
            whileHover={{ borderColor: '#c8f000', color: '#c8f000' }}
            onClick={demoLogin}
            style={{
              width: '100%', marginTop: 10, padding: '12px 0',
              borderRadius: 14, fontSize: 13, fontWeight: 600,
              border: '1px solid #2a2a2a', color: '#666',
              background: 'transparent', cursor: 'pointer',
              transition: 'border-color 0.15s, color 0.15s',
              fontFamily: 'DM Sans, sans-serif',
            }}>
            Ver demo sin cuenta
          </motion.button>
        </motion.div>

        <p style={{ marginTop: 20, fontSize: 11, color: '#444', textAlign: 'center', fontFamily: 'DM Sans, sans-serif' }}>
          WASE Digital · Panel Interno v1.0
        </p>
      </motion.div>
    </div>
  )
}
