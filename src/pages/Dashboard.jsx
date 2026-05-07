import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { DollarSign, Users, Zap, TrendingUp, Clock } from 'lucide-react'
import { useStore } from '../store/index.jsx'
import { Card, KPICard, SH, Btn, Table, TR, TD, Badge, SvcBadge } from '../components/ui'

const REVENUE = [
  {m:'Ene',v:1200},{m:'Feb',v:1480},{m:'Mar',v:1350},{m:'Abr',v:1820},{m:'May',v:2148},{m:'Jun',v:2400}
]
const WEEKLY = [
  {d:'L',v:620},{d:'M',v:840},{d:'X',v:780},{d:'J',v:1100},{d:'V',v:960},{d:'S',v:1380},{d:'D',v:1040}
]

const CT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg px-3 py-2 text-[11.5px]"
         style={{ background:'var(--overlay)', border:'1px solid var(--border)', color:'var(--text1)' }}>
      <div style={{ color:'var(--text3)', marginBottom:2 }}>{label}</div>
      <div style={{ color:'var(--accent)', fontWeight:700 }}>
        {typeof payload[0].value === 'number' && payload[0].value > 100
          ? `$${payload[0].value.toLocaleString('es-AR')}`
          : payload[0].value}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { kpis, campanas, actividad, loading } = useStore()

  const kpiCards = [
    { label:'Facturación MRR',  value:kpis?.mrr,          prefix:'$', delta:'+18%', deltaUp:true,  icon:DollarSign },
    { label:'Clientes Activos', value:kpis?.clientes,      delta:'+2 nuevos', deltaUp:true,  icon:Users },
    { label:'Campañas Live',    value:kpis?.campanas_live, delta:'Todas activas', deltaUp:true, icon:Zap },
    { label:'ROAS Promedio',    value:kpis?.roas_avg,      suffix:'x', delta:'+0.6x', deltaUp:true, icon:TrendingUp },
  ]

  const relTime = (iso) => {
    const m = Math.floor((Date.now() - new Date(iso)) / 60000)
    if (m < 1) return 'ahora'
    if (m < 60) return `hace ${m} min`
    const h = Math.floor(m/60)
    if (h < 24) return `hace ${h}h`
    return `hace ${Math.floor(h/24)}d`
  }

  return (
    <div className="p-5 space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger">
        {kpiCards.map((k,i) => <KPICard key={i} {...k} loading={loading.kpis} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <SH title="Facturación MRR — Últimos 6 meses"><Btn variant="ghost" size="sm">Exportar</Btn></SH>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={REVENUE} margin={{ top:5, right:5, left:-20, bottom:0 }}>
              <defs>
                <linearGradient id="waseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#c8f000" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#c8f000" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="m" tick={{ fill:'#3a3a3a', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#3a3a3a', fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}K`} />
              <Tooltip content={<CT />} />
              <Area type="monotone" dataKey="v" stroke="#c8f000" strokeWidth={2}
                    fill="url(#waseGrad)" dot={{ fill:'#c8f000', r:3, strokeWidth:0 }}
                    activeDot={{ r:5, fill:'#c8f000', strokeWidth:0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <SH title="Alcance Semanal" />
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={WEEKLY} margin={{ top:5, right:5, left:-20, bottom:0 }}>
              <XAxis dataKey="d" tick={{ fill:'#3a3a3a', fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CT />} cursor={{ fill:'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="v" fill="var(--accent-dim)" radius={[3,3,0,0]} activeBar={{ fill:'var(--accent)' }} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Table + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SH title="Campañas Activas"><Btn variant="ghost" size="sm" onClick={() => useStore.getState().setPage('campanas')}>Ver todas</Btn></SH>
          <Table headers={['Cliente','Servicio','Inversión','Alcance','ROAS','Estado']}>
            {(campanas.length ? campanas : []).slice(0,5).map((c,i) => (
              <TR key={i}>
                <TD><strong>{c.cliente_nombre}</strong></TD>
                <TD><SvcBadge service={c.servicio} /></TD>
                <TD>${(c.inversion||0).toLocaleString('es-AR')}</TD>
                <TD style={{ color:'var(--text2)' }}>{c.alcance ? (c.alcance/1000000).toFixed(1)+'M' : '—'}</TD>
                <TD><span className="font-bold" style={{ color:c.roas>=4?'var(--accent)':c.roas>=2?'var(--warn)':'var(--danger)', fontFamily:'JetBrains Mono,monospace' }}>{c.roas||'—'}x</span></TD>
                <TD><Badge status={c.estado} /></TD>
              </TR>
            ))}
          </Table>
        </div>

        <Card className="p-5">
          <SH title="Actividad Reciente" />
          <div className="space-y-3">
            {(actividad.length ? actividad : []).map((a,i) => {
              const color = a.tipo==='alerta'?'var(--danger)':a.tipo==='cliente'?'var(--info)':'var(--accent)'
              return (
                <motion.div key={i} initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay:i*0.06 }} className="flex gap-2.5">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:color }} />
                  <div>
                    <p className="text-[12px] leading-snug">{a.texto}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock size={9} style={{ color:'var(--text3)' }} />
                      <span className="text-[10px]" style={{ color:'var(--text3)' }}>{relTime(a.creado_en)}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
