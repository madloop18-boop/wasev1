import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isToday, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import { useStore } from '../store/index.jsx'
import { SH, Btn } from '../components/ui/index.jsx'

const TIPO_COLORS = { 'Reel':'#c8f000','Post':'#38bdf8','Story':'#a78bfa','Reporte':'#f59e0b','Campaña':'#c8f000','Admin':'#4a566a' }

export default function Calendario() {
  const { calendario, fetchCalendario, createEvento, clientes, showToast } = useStore()
  const [current, setCurrent] = useState(new Date())
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ titulo:'', fecha:'', tipo:'Reel', cliente:'' })

  useEffect(() => { fetchCalendario() }, [])

  const days  = eachDayOfInterval({ start: startOfMonth(current), end: endOfMonth(current) })
  const blank = (getDay(startOfMonth(current)) + 6) % 7
  const eventsForDay = (date) => (calendario||[]).filter(e => isSameDay(new Date(e.fecha+'T00:00:00'), date))

  const handleSave = async () => {
    if (!form.titulo || !form.fecha) return showToast('Completá título y fecha','warn')
    await createEvento({ ...form, color: TIPO_COLORS[form.tipo]||'#c8f000' })
    setShowForm(false)
    setForm({ titulo:'', fecha:'', tipo:'Reel', cliente:'' })
  }

  const clienteOpts = clientes.length > 0 ? clientes.map(c=>c.nombre) : ['Sokassia','Bonse','TerraFit','LuxHome','NovaTech','ModaCo']

  return (
    <div className="p-5">
      <SH title={`Calendario Editorial — ${format(current,'MMMM yyyy',{locale:es})}`}>
        <button onClick={()=>setCurrent(subMonths(current,1))} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--raised)]" style={{color:'var(--text2)'}}><ChevronLeft size={15}/></button>
        <button onClick={()=>setCurrent(addMonths(current,1))} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--raised)]" style={{color:'var(--text2)'}}><ChevronRight size={15}/></button>
        <Btn icon={Plus} onClick={()=>setShowForm(true)}>+ Publicación</Btn>
      </SH>

      <div className="flex gap-2 mb-4 flex-wrap">
        {Object.entries(TIPO_COLORS).filter(([k])=>k!=='Admin').map(([tipo,color])=>{
          const count=(calendario||[]).filter(e=>e.tipo===tipo).length
          if(!count) return null
          return(
            <div key={tipo} className="flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full" style={{background:`${color}18`,border:`1px solid ${color}30`}}>
              <span className="w-1.5 h-1.5 rounded-full" style={{background:color}}/>
              <span style={{color,fontWeight:600}}>{tipo}</span>
              <span style={{color:'var(--text3)'}}>({count})</span>
            </div>
          )
        })}
      </div>

      <div className="rounded-xl overflow-hidden" style={{border:'1px solid var(--border)',background:'var(--surface)'}}>
        <div className="grid grid-cols-7" style={{borderBottom:'1px solid var(--border)',background:'var(--raised)'}}>
          {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(d=>(
            <div key={d} className="text-center py-2.5 text-[10px] uppercase tracking-wider font-semibold" style={{color:'var(--text3)'}}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array(blank).fill(null).map((_,i)=>(
            <div key={`b${i}`} className="min-h-[80px] p-1.5" style={{borderRight:'1px solid var(--border)',borderBottom:'1px solid var(--border)',opacity:0.2}}/>
          ))}
          {days.map((day,i)=>{
            const evs=eventsForDay(day)
            const isTodays=isToday(day)
            const isSel=selected&&isSameDay(day,selected)
            const col=(blank+i)%7
            return(
              <motion.div key={i} whileHover={{backgroundColor:'var(--raised)'}}
                onClick={()=>setSelected(isSel?null:day)}
                className="min-h-[80px] p-1.5 cursor-pointer"
                style={{borderRight:col===6?'none':'1px solid var(--border)',borderBottom:'1px solid var(--border)',outline:isSel?'1px solid var(--accent)':'none',outlineOffset:'-1px'}}>
                <div className="text-[11px] font-semibold mb-1 w-5 h-5 flex items-center justify-center rounded-full"
                     style={{background:isTodays?'var(--accent)':'transparent',color:isTodays?'#0a0a0a':'var(--text3)'}}>
                  {format(day,'d')}
                </div>
                {evs.slice(0,3).map((ev,ei)=>(
                  <div key={ei} className="text-[9px] px-1.5 py-0.5 rounded font-medium truncate mb-0.5"
                       style={{background:`${ev.color||'var(--accent)'}18`,color:ev.color||'var(--accent)'}}>
                    {ev.titulo}
                  </div>
                ))}
                {evs.length>3&&<div className="text-[9px] px-1" style={{color:'var(--text3)'}}>+{evs.length-3}</div>}
              </motion.div>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {selected&&eventsForDay(selected).length>0&&(
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="mt-4 p-4 rounded-xl" style={{background:'var(--surface)',border:'1px solid var(--border)'}}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-[13px]" style={{fontFamily:'Syne,sans-serif'}}>{format(selected,"EEEE d 'de' MMMM",{locale:es})}</span>
              <button onClick={()=>setSelected(null)} style={{color:'var(--text3)'}}><X size={14}/></button>
            </div>
            {eventsForDay(selected).map((ev,i)=>(
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg mb-2" style={{background:'var(--raised)',borderLeft:`3px solid ${ev.color||'var(--accent)'}`}}>
                <div className="flex-1"><div className="font-semibold text-[12.5px]">{ev.titulo}</div><div className="text-[11px]" style={{color:'var(--text3)'}}>{ev.cliente}</div></div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{background:`${ev.color||'var(--accent)'}18`,color:ev.color||'var(--accent)'}}>{ev.tipo}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setShowForm(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center" style={{background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)'}}>
            <motion.div initial={{scale:0.95,y:10}} animate={{scale:1,y:0}} exit={{scale:0.95}} onClick={e=>e.stopPropagation()}
              className="w-full max-w-sm mx-4 p-5 rounded-2xl" style={{background:'var(--surface)',border:'1px solid var(--border)'}}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[15px]" style={{fontFamily:'Syne,sans-serif'}}>Nueva Publicación</h3>
                <button onClick={()=>setShowForm(false)} style={{color:'var(--text3)'}}><X size={16}/></button>
              </div>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wider" style={{color:'var(--text3)'}}>Título</label>
                  <input type="text" placeholder="Ej. Reel Sokassia Mayo" value={form.titulo} onChange={e=>setForm({...form,titulo:e.target.value})}
                    className="w-full text-[12.5px] py-2 px-3 rounded-lg outline-none" style={{background:'var(--raised)',border:'1px solid var(--border)',color:'var(--text1)'}}/>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wider" style={{color:'var(--text3)'}}>Fecha</label>
                  <input type="date" value={form.fecha} onChange={e=>setForm({...form,fecha:e.target.value})}
                    className="w-full text-[12.5px] py-2 px-3 rounded-lg outline-none" style={{background:'var(--raised)',border:'1px solid var(--border)',color:'var(--text1)'}}/>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wider" style={{color:'var(--text3)'}}>Cliente</label>
                  <select value={form.cliente} onChange={e=>setForm({...form,cliente:e.target.value})}
                    className="w-full text-[12.5px] py-2 px-3 rounded-lg outline-none" style={{background:'var(--raised)',border:'1px solid var(--border)',color:'var(--text1)'}}>
                    <option value="">Seleccionar...</option>
                    {clienteOpts.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wider" style={{color:'var(--text3)'}}>Tipo</label>
                  <select value={form.tipo} onChange={e=>setForm({...form,tipo:e.target.value})}
                    className="w-full text-[12.5px] py-2 px-3 rounded-lg outline-none" style={{background:'var(--raised)',border:'1px solid var(--border)',color:'var(--text1)'}}>
                    <option>Reel</option><option>Post</option><option>Story</option><option>Campaña</option><option>Reporte</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <Btn variant="ghost" className="flex-1 justify-center" onClick={()=>setShowForm(false)}>Cancelar</Btn>
                <Btn className="flex-1 justify-center" onClick={handleSave}>Guardar</Btn>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}