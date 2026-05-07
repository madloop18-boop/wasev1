import { useState } from 'react'
import { Plus, Edit2 } from 'lucide-react'
import { useStore } from '../store/index.jsx'
import { SH, Btn, Table, TR, TD, Badge, SvcBadge } from '../components/ui/index.jsx'
import { ModalNuevaCampana, ModalMetricas } from '../components/ui/Modals.jsx'

export default function Campanas() {
  const { campanas } = useStore()
  const [showNew, setShowNew] = useState(false)
  const [editando, setEditando] = useState(null)

  return (
    <div className="p-5">
      <SH title="Campañas">
        <Btn variant="ghost" size="sm">Filtros</Btn>
        <Btn icon={Plus} onClick={() => setShowNew(true)}>Nueva Campaña</Btn>
      </SH>

      <Table headers={['Cliente','Servicio','Inversión','Alcance','Clicks','Conv.','ROAS','Estado','']}>
        {campanas.map((c, i) => (
          <TR key={i}>
            <TD>
              <strong>{c.cliente_nombre}</strong>
              <div className="text-[10.5px]" style={{ color: 'var(--text3)' }}>{c.nombre}</div>
            </TD>
            <TD><SvcBadge service={c.servicio} /></TD>
            <TD>${(Number(c.inversion)||0).toLocaleString('es-AR')}</TD>
            <TD style={{ color: 'var(--text2)' }}>
              {c.alcance ? (Number(c.alcance) >= 1000000 ? (Number(c.alcance)/1000000).toFixed(1)+'M' : (Number(c.alcance)/1000).toFixed(0)+'K') : '—'}
            </TD>
            <TD style={{ color: 'var(--text2)' }}>
              {c.clicks ? (Number(c.clicks)/1000).toFixed(0)+'K' : '—'}
            </TD>
            <TD style={{ color: 'var(--text2)' }}>{c.conversiones || '—'}</TD>
            <TD>
              <span style={{ color: Number(c.roas)>=4?'var(--accent)':Number(c.roas)>=2?'var(--warn)':'var(--danger)', fontWeight:700, fontFamily:'JetBrains Mono,monospace' }}>
                {c.roas || '—'}x
              </span>
            </TD>
            <TD><Badge status={c.estado} /></TD>
            <TD>
              <button onClick={() => setEditando(c)}
                className="flex items-center gap-1 text-[11px] px-2 py-1 rounded transition-colors hover:bg-[var(--raised)]"
                style={{ color: 'var(--text3)' }}>
                <Edit2 size={11} /> Métricas
              </button>
            </TD>
          </TR>
        ))}
      </Table>

      {campanas.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="text-4xl opacity-20">⚡</div>
          <div className="font-semibold">No hay campañas todavía</div>
          <div className="text-[12.5px]" style={{ color: 'var(--text2)' }}>Creá la primera campaña para empezar</div>
          <Btn icon={Plus} onClick={() => setShowNew(true)}>Nueva Campaña</Btn>
        </div>
      )}

      {showNew && <ModalNuevaCampana onClose={() => setShowNew(false)} />}
      {editando && <ModalMetricas campana={editando} onClose={() => setEditando(null)} />}
    </div>
  )
}