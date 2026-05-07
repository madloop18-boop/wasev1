import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function Splash({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: 'var(--bg)' }}
    >
      {/* Grid */}
      <div className="absolute inset-0 bg-grid opacity-50" />

      {/* Glow orb */}
      <div className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(200,240,0,0.07) 0%, transparent 65%)' }} />

      <div className="relative flex flex-col items-center gap-7">

        {/* Logo W */}
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-[28px] font-black"
          style={{ background: 'var(--accent)', color: '#0a0a0a', fontFamily: 'Syne, sans-serif' }}
        >
          W
        </motion.div>

        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-center"
        >
          <div className="text-[52px] font-black leading-none tracking-[-0.04em]"
               style={{ fontFamily: 'Syne, sans-serif' }}>
            WASE<span style={{ color: 'var(--accent)' }}>.</span>
          </div>
          <div className="text-[11px] uppercase tracking-[0.28em] mt-2"
               style={{ color: 'var(--text2)' }}>
            Panel de Gestión · Marketing Digital
          </div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-44 h-[2px] rounded-full overflow-hidden"
               style={{ background: 'var(--raised)' }}>
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.7, duration: 1.7, ease: 'easeInOut' }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, var(--accent), #fff)' }}
            />
          </div>

          {/* Pulse dots */}
          <div className="flex gap-1.5">
            {[0, 0.2, 0.4].map((delay, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full pulse-dot"
                style={{ background: 'var(--accent)', animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        </motion.div>

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: i % 2 === 0 ? 4 : 3,
              height: i % 2 === 0 ? 4 : 3,
              background: i % 3 === 0 ? 'var(--accent)' : 'rgba(200,240,0,0.3)',
            }}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.9, 0],
              scale:   [0, 1, 0],
              x: Math.cos((i * 45) * Math.PI / 180) * (80 + i * 10),
              y: Math.sin((i * 45) * Math.PI / 180) * (80 + i * 10),
            }}
            transition={{ delay: 0.4 + i * 0.08, duration: 2, ease: 'easeOut' }}
          />
        ))}
      </div>
    </motion.div>
  )
}
