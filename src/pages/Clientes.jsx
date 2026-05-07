import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useStore } from '../store/index.jsx'
import { SH, Btn, Badge, SvcBadge, StatRow } from '../components/ui/index.jsx'
import { ModalNuevoCliente, ModalDetalleCliente } from '../components/ui/Modals.jsx'

const COLORS = ['#1a2a1a','#2a1a1a','#1a2a2a','#22201a','#1a1a2a','#2a1a2a']

export default function Clientes() {
  const { clientes } = useStore()
  const [showNew, setShowNew] = useState(false)
  const [selected, setSelected] = useState(null)

  return (
    <div className="p-5">
      <SH title="Clientes">
        <Btn variant="ghost" size="sm">Filtrar</Btn>
        <Btn icon={Plus} onClick={() => setShowNew(true)}>Nuevo Cliente</Btn>
      </SH>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger">
        {clientes.map((c, i) => {
          const init = c.nombre.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
          const pct = Math.min(100, Math.round((Number(c.roas) / 8) * 100))
          return (
            <motion.div key={c.id} whileHover={{ y: -3, borderColor: 'var(--accent)' }}
              onClick={() => setSelected(c)}
              className="p-5 rounded-xl cursor-pointer"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-black flex-shrink-0"
                     style={{ background: COLORS[i % COLORS.length], color: 'var(--accent)', fontFamily: 'Syne,sans-serif' }}>
                  {init}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[13.5px] truncate">{c.nombre}</div>
                  <div className="text-[10.5px] truncate" style={{ color: 'var(--text3)' }}>{c.sector}</div>
                </div>
                <Badge status={c.estado} />
              </div>
              <div className="space-y-1.5 mb-4">
                <StatRow label="Servicio"  value={<SvcBadge service={c.servicio} />} />
                <StatRow label="Retainer"  value={`$${(Number(c.retainer)||0).toLocaleString('es-AR')}/mes`} />
                <StatRow label="Contacto"  value={c.contacto || '—'} />
                <StatRow label="ROAS"      value={c.roas ? `${c.roas}x` : '—'} accent />
              </div>
              <div className="h-1 rounded-full" style={{ background: 'var(--raised)' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: pct > 65 ? 'var(--accent)' : pct > 35 ? 'var(--warn)' : 'var(--danger)' }} />
              </div>
            </motion.div>
          )
        })}

        <motion.div whileHover={{ borderColor: 'var(--accent)' }} onClick={() => setShowNew(true)}
          className="p-5 rounded-xl cursor-pointer flex flex-col items-center justify-center gap-3 min-h-[200px]"
          style={{ border: '1px dashed var(--border)', color: 'var(--text3)' }}>
          <Plus size={22} />
          <span className="text-[13px]">Agregar Cliente</span>
        </motion.div>
      </div>

      {showNew && <ModalNuevoCliente onClose={() => setShowNew(false)} />}
      {selected && <ModalDetalleCliente cliente={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}