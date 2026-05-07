import { motion } from 'framer-motion'
import { Download, Send } from 'lucide-react'
import { useStore } from '../store/index.jsx'
import { Card,SH,Btn,SvcBadge } from '../components/ui'

export default function Reportes(){
  const{clientes,campanas,showToast}=useStore()
  return(
    <div className="p-5">
      <SH title="Reportes para Clientes">
        <Btn variant="ghost" size="sm">Este mes</Btn>
        <Btn icon={Download} onClick={()=>showToast('Generando PDF...')}>Exportar Todo</Btn>
      </SH>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger">
        {clientes.map((c,i)=>{
          const cps=campanas.filter(x=>x.cliente_id===c.id)
          const totalInv=cps.reduce((a,x)=>a+(x.inversion||0),0)
          const totalAlc=cps.reduce((a,x)=>a+(x.alcance||0),0)
          const avgRoas=cps.length?cps.reduce((a,x)=>a+(x.roas||0),0)/cps.length:0
          return(
            <motion.div key={c.id} whileHover={{y:-2,borderColor:'var(--accent)'}}
              className="p-5 rounded-xl" style={{background:'var(--surface)',border:'1px solid var(--border)'}}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-bold text-[14px]" style={{fontFamily:'Syne,sans-serif'}}>{c.nombre}</div>
                  <SvcBadge service={c.servicio}/>
                </div>
                <div className="text-[24px] font-black" style={{color:'var(--accent)',fontFamily:'Syne,sans-serif'}}>
                  {avgRoas.toFixed(1)}x
                </div>
              </div>
              <div className="space-y-2 mb-4 text-[12px]">
                {[
                  {l:'Inversión del mes', v:`$${totalInv.toLocaleString('es-AR')}`},
                  {l:'Alcance total',     v:totalAlc>(1e6)?(totalAlc/1e6).toFixed(1)+'M':(totalAlc/1000).toFixed(0)+'K'},
                  {l:'Campañas activas', v:cps.filter(x=>x.estado==='activa').length},
                ].map(({l,v})=>(
                  <div key={l} className="flex justify-between py-1" style={{borderBottom:'1px solid var(--border)'}}>
                    <span style={{color:'var(--text3)'}}>{l}</span>
                    <span className="font-semibold">{v||'—'}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Btn variant="ghost" size="sm" icon={Download} className="flex-1 justify-center" onClick={()=>showToast(`PDF de ${c.nombre} generado`)}>PDF</Btn>
                <Btn size="sm" icon={Send} className="flex-1 justify-center" onClick={()=>showToast(`Reporte enviado a ${c.contacto}`)}>Enviar</Btn>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
