import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, GripVertical } from 'lucide-react'
import { useStore } from '../store/index.jsx'
import { SH, Btn } from '../components/ui/index.jsx'
import { ModalNuevoDeal } from '../components/ui/Modals.jsx'

const STAGES = [
  { id: 'prospecto',   label: 'Prospecto',   color: '#3a3a3a' },
  { id: 'contactado',  label: 'Contactado',  color: 'var(--info)' },
  { id: 'propuesta',   label: 'Propuesta',   color: 'var(--warn)' },
  { id: 'negociacion', label: 'Negociación', color: 'var(--accent)' },
  { id: 'cerrado',     label: 'Cerrado ✓',   color: '#4ade80' },
]

export default function Pipeline() {
  const { pipeline, fetchPipeline, moveDeal, showToast } = useStore()
  const [showNew, setShowNew] = useState(false)
  const [etapaInicial, setEtapaInicial] = useState('prospecto')

  useEffect(() => { fetchPipeline() }, [])

  const grouped = pipeline?.grouped || {}
  const total   = pipeline?.total   || 0

  const handleAddToStage = (etapa) => {
    setEtapaInicial(etapa)
    setShowNew(true)
  }

  return (
    <div className="p-5">
      <SH title="Pipeline de Ventas">
        <Btn variant="ghost" size="sm">${total.toLocaleString('es-AR')} en pipeline</Btn>
        <Btn icon={Plus} onClick={() => setShowNew(true)}>Nuevo Deal</Btn>
      </SH>

      <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: 420 }}>
        {STAGES.map(stage => {
          const deals = grouped[stage.id] || []
          const stageTotal = deals.reduce((a, d) => a + (Number(d.valor) || 0), 0)

          return (
            <div key={stage.id} className="flex-shrink-0 w-52">
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg mb-2"
                   style={{ background: 'var(--raised)' }}>
                <span className="text-[10.5px] font-bold uppercase tracking-wider"
                      style={{ color: stage.color }}>{stage.label}</span>
                <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--overlay)', color: 'var(--text2)' }}>
                  {deals.length}
                </span>
              </div>

              {stageTotal > 0 && (
                <div className="text-[10.5px] px-1 mb-2 font-mono" style={{ color: 'var(--text3)' }}>
                  ${stageTotal.toLocaleString('es-AR')}
                </div>
              )}

              <div className="space-y-2">
                {deals.map((deal, i) => (
                  <motion.div key={deal.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ x: 2 }}
                    className="p-3 rounded-lg group"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <div className="flex items-start gap-1.5 mb-1">
                      <GripVertical size={12} className="mt-0.5 opacity-0 group-hover:opacity-30 flex-shrink-0"
                                   style={{ color: 'var(--text3)' }} />
                      <div className="text-[12px] font-semibold leading-snug">{deal.nombre}</div>
                    </div>
                    <div className="text-[10.5px] mb-2 ml-4" style={{ color: 'var(--text3)' }}>{deal.empresa}</div>
                    <div className="text-[13px] font-black ml-4" style={{ color: 'var(--accent)', fontFamily: 'Syne,sans-serif' }}>
                      ${(Number(deal.valor)||0).toLocaleString('es-AR')}
                    </div>

                    <div className="flex gap-1 mt-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity flex-wrap">
                      {STAGES.filter(s => s.id !== stage.id).map(s => (
                        <button key={s.id}
                          onClick={() => { moveDeal(deal.id, s.id); showToast(`Movido a ${s.label}`) }}
                          className="text-[9px] px-1.5 py-0.5 rounded font-medium transition-colors hover:bg-[var(--overlay)]"
                          style={{ background: 'var(--overlay)', color: 'var(--text2)', border: '1px solid var(--border)' }}>
                          → {s.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))}

                <motion.button whileHover={{ borderColor: 'var(--accent)' }}
                  onClick={() => handleAddToStage(stage.id)}
                  className="w-full py-2 rounded-lg text-[11px] transition-colors"
                  style={{ border: '1px dashed var(--border)', color: 'var(--text3)', background: 'transparent' }}>
                  + Agregar
                </motion.button>
              </div>
            </div>
          )
        })}
      </div>

      {pipeline?.deals?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="text-4xl opacity-20">🏆</div>
          <div className="font-semibold">Pipeline vacío</div>
          <div className="text-[12.5px]" style={{ color: 'var(--text2)' }}>Agregá el primer prospecto</div>
          <Btn icon={Plus} onClick={() => setShowNew(true)}>Nuevo Deal</Btn>
        </div>
      )}

      {showNew && <ModalNuevoDeal onClose={() => { setShowNew(false); fetchPipeline() }} etapaInicial={etapaInicial} />}
    </div>
  )
}