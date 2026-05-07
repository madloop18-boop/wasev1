import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Splash({ onDone }) {
  const [phase, setPhase] = useState(0) // 0: enter, 1: hold, 2: exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1200)
    const t2 = setTimeout(() => setPhase(2), 2200)
    const t3 = setTimeout(() => onDone(),, 2800)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 2 ? 0 : 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 flex flex-col items-center justify-center z-[100]"
      style={{ background: 'var(--bg)' }}
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        {/* Radial glow */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
          style={{ 
            background: 'radial-gradient(circle, rgba(200,240,0,0.06) 0%, rgba(200,240,0,0.02) 40%, transparent 70%)' 
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Secondary glow */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ 
            background: 'radial-gradient(circle, rgba(200,240,0,0.08) 0%, transparent 60%)' 
          }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) * Math.PI / 180
          const distance = 100 + (i % 3) * 60
          return (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: i % 3 === 0 ? 3 : 2,
                height: i % 3 === 0 ? 3 : 2,
                background: i % 4 === 0 ? 'var(--accent)' : 'rgba(200,240,0,0.4)',
                marginLeft: -1,
                marginTop: -1,
              }}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
              }}
              transition={{ 
                delay: 0.3 + i * 0.1, 
                duration: 2.5, 
                ease: 'easeOut',
                repeat: Infinity,
                repeatDelay: 1 + i * 0.2
              }}
            />
          )
        })}
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center gap-8">
        
        {/* Logo container with ring animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative"
        >
          {/* Outer ring */}
          <motion.div
            className="absolute inset-[-12px] rounded-2xl border border-dashed"
            style={{ borderColor: 'rgba(200,240,0,0.2)' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          
          {/* Inner ring */}
          <motion.div
            className="absolute inset-[-6px] rounded-xl border"
            style={{ borderColor: 'rgba(200,240,0,0.1)' }}
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />

          {/* Logo */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-[32px] font-black relative overflow-hidden"
            style={{ 
              background: 'var(--accent)', 
              color: '#080808', 
              fontFamily: 'Syne, sans-serif',
              boxShadow: '0 0 40px rgba(200,240,0,0.3), 0 0 80px rgba(200,240,0,0.1)'
            }}
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
            />
            W
          </div>
        </motion.div>

        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center"
        >
          <div 
            className="text-[48px] font-black leading-none tracking-[-0.04em]"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            WASE<span style={{ color: 'var(--accent)' }}>.</span>
          </div>
          <motion.div 
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.28em' }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-[11px] uppercase mt-3 font-medium"
            style={{ color: 'var(--text3)' }}
          >
            Panel de Gestión · Marketing Digital
          </motion.div>
        </motion.div>

        {/* Progress section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col items-center gap-4 mt-2"
        >
          {/* Progress bar with segments */}
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-8 h-[3px] rounded-full overflow-hidden"
                style={{ background: 'var(--raised)' }}
              >
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ 
                    delay: 1.0 + i * 0.15, 
                    duration: 0.4, 
                    ease: 'easeOut' 
                  }}
                  className="h-full rounded-full"
                  style={{ 
                    background: i === 4 
                      ? 'linear-gradient(90deg, var(--accent), var(--accent-hover))' 
                      : 'var(--accent)' 
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Loading text */}
          <motion.div
            className="flex items-center gap-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] font-medium tracking-wide" style={{ color: 'var(--text4)' }}>
              Cargando sistema
            </span>
          </motion.div>
        </motion.div>

        {/* Version badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute -bottom-24 text-[10px] font-mono tracking-wider"
          style={{ color: 'var(--text4)' }}
        >
          v2.0.1 · WASE Digital
        </motion.div>
      </div>
    </motion.div>
  )
}