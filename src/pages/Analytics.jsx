import { useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Eye, MousePointer, ShoppingCart, DollarSign } from 'lucide-react'
import { useStore } from '../store/index.jsx'
import { Card, KPICard, SH, Btn, Table, TR, TD, SvcBadge } from '../components/ui/index.jsx'

const CT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return <div className="rounded-lg px-3 py-2 text-[11.5px]" style={{ background:'var(--overlay)', border:'1px solid var(--border)', color:'var(--text1)' }}><div style={{ color:'var(--text3)' }}>{label}</div><div style={{ color:'var(--accent)', fontWeight:700 }}>{payload[0].value?.toLocaleString?.('es-AR')}</div></div>
}

export default function Analytics() {
  const { campanas, fetchCampanas } = useStore()
  useEffect(() => { fetchCampanas() }, [])

  const totalAlcance   = campanas.reduce((a,c)=>a+(Number(c.alcance)||0),0)
  const totalClicks    = campanas.reduce((a,c)=>a+(Number(c.clicks)||0),0)
  const totalConv      = campanas.reduce((a,c)=>a+(Number(c.conversiones)||0),0)
  const totalInversion = campanas.reduce((a,c)=>a+(Number(c.inversion)||0),0)
  const cpa            = totalConv>0 ? totalInversion/totalConv : 0

  const porServicio = campanas.reduce((acc,c)=>{
    const s=c.servicio||'Otro'
    if(!acc[s]) acc[s]={servicio:s,inversion:0,conversiones:0,roas:[]}
    acc[s].inversion+=Number(c.inversion)||0
    acc[s].conversiones+=Number(c.conversiones)||0
    if(c.roas) acc[s].roas.push(Number(c.roas))
    return acc
  },{})
  const servicios=Object.values(porServicio).map(s=>({...s,roas:s.roas.length?(s.roas.reduce((a,r)=>a+r,0)/s.roas.length).toFixed(1):'—'}))

  const chartData=campanas.length>0
    ?campanas.map(c=>({name:(c.cliente_nombre||'?').slice(0,8),v:Number(c.inversion)||0}))
    :[{name:'S1',v:820},{name:'S2',v:1040},{name:'S3',v:960},{name:'S4',v:1280},{name:'S5',v:1100},{name:'S6',v:1480}]

  return (
    <div className="p-5 space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger">
        <KPICard label="Alcance Total" value={totalAlcance||4800000} delta="+22%" deltaUp={true} icon={Eye}/>
        <KPICard label="Clicks" value={totalClicks||218000} delta="CTR 4.5%" deltaUp={true} icon={MousePointer}/>
        <KPICard label="Conversiones" value={totalConv||8300} delta="+15%" deltaUp={true} icon={ShoppingCart}/>
        <KPICard label="CPA Promedio" value={cpa||267} prefix="$" delta="-12%" deltaUp={true} icon={DollarSign}/>
      </div>
      <Card className="p-5">
        <SH title="Inversión por Campaña"><Btn variant="ghost" size="sm">Exportar CSV</Btn></SH>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{top:5,right:5,left:-10,bottom:0}}>
            <defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#c8f000" stopOpacity={0.2}/><stop offset="95%" stopColor="#c8f000" stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
            <XAxis dataKey="name" tick={{fill:'#3a3a3a',fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:'#3a3a3a',fontSize:10}} axisLine={false} tickLine={false}/>
            <Tooltip content={<CT/>}/>
            <Area type="monotone" dataKey="v" stroke="#c8f000" strokeWidth={2} fill="url(#g2)" dot={{fill:'#c8f000',r:2,strokeWidth:0}} activeDot={{r:4,fill:'#c8f000',strokeWidth:0}}/>
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      {servicios.length>0&&(<><SH title="Rendimiento por Servicio"/><Table headers={['Servicio','Inversión','Conversiones','ROAS']}>{servicios.map((s,i)=>(<TR key={i}><TD><SvcBadge service={s.servicio}/></TD><TD>${s.inversion.toLocaleString('es-AR')}</TD><TD>{s.conversiones.toLocaleString('es-AR')}</TD><TD><span style={{color:'var(--accent)',fontWeight:700,fontFamily:'JetBrains Mono,monospace'}}>{s.roas}x</span></TD></TR>))}</Table></>)}
    </div>
  )
}