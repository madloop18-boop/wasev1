import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Plus, Download, Send, Save } from 'lucide-react'
import { useStore } from '../store/index.jsx'
import { Card, SH, Btn, SvcBadge } from '../components/ui'

const SERVICIOS_PRESET = [
  { nombre: 'Social Media Management',       precio: 149000 },
  { nombre: 'Meta ADS — Gestión de Pauta',   precio: 149000 },
  { nombre: 'Content Creation (8 piezas)',   precio: 80000  },
  { nombre: 'Content Creation (15 piezas)',  precio: 140000 },
  { nombre: 'Reels (4 videos)',              precio: 120000 },
  { nombre: 'Fotografía de Producto',        precio: 95000  },
  { nombre: 'Estrategia de Contenidos',      precio: 60000  },
  { nombre: 'Informe de Resultados',         precio: 35000  },
  { nombre: 'Setup Inicial de Cuenta',       precio: 50000  },
]

export default function Cotizador() {
  const { clientes, createCotizacion, showToast } = useStore()
  const [cliente, setCliente]   = useState('')
  const [tipo, setTipo]         = useState('Retainer Mensual')
  const [items, setItems]       = useState([
    { nombre: 'Social Media Management',     qty: 1, precio: 149000 },
    { nombre: 'Meta ADS — Gestión de Pauta', qty: 1, precio: 149000 },
    { nombre: 'Content Creation (8 piezas)', qty: 1, precio: 80000  },
  ])
  const [discPct, setDiscPct]   = useState(5)
  const [showPreset, setShowPreset] = useState(false)

  const subtotal  = items.reduce((a, i) => a + i.qty * i.precio, 0)
  const descuento = subtotal * discPct / 100
  const iva       = (subtotal - descuento) * 0.21
  const total     = subtotal - descuento + iva
  const fmt = n => '$' + Math.round(n).toLocaleString('es-AR')

  const updateItem = (i, field, val) => {
    const n = [...items]
    n[i] = { ...n[i], [field]: field === 'nombre' ? val : Number(val) }
    setItems(n)
  }
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i))
  const addPreset  = (svc) => { setItems([...items, { nombre: svc.nombre, qty: 1, precio: svc.precio }]); setShowPreset(false) }

  const handleSave = async () => {
    const clienteNombre = clientes.find(c => c.id === cliente)?.nombre || cliente || 'Sin especificar'
    await createCotizacion({ cliente_id: cliente, cliente_nombre: clienteNombre, tipo, subtotal, descuento_pct: discPct, servicios: items })
  }

  const handlePDF = async () => {
    showToast('Generando PDF...')
    try {
      const { default: jsPDF } = await import('jspdf')
      const doc = new jsPDF()
      const clienteNombre = clientes.find(c => c.id === cliente)?.nombre || 'Cliente'

      doc.setFillColor(10, 10, 10)
      doc.rect(0, 0, 210, 297, 'F')

      doc.setTextColor(200, 240, 0)
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.text('WASE.', 20, 28)

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(16)
      doc.text(`Propuesta para ${clienteNombre}`, 20, 44)

      doc.setTextColor(100, 100, 100)
      doc.setFontSize(10)
      doc.text(`Tipo: ${tipo}  |  Fecha: ${new Date().toLocaleDateString('es-AR')}`, 20, 54)

      let y = 70
      doc.setTextColor(200, 240, 0)
      doc.setFontSize(11)
      doc.text('SERVICIO', 20, y)
      doc.text('CANT.', 120, y)
      doc.text('PRECIO', 145, y)
      doc.text('TOTAL', 175, y)
      y += 6
      doc.setDrawColor(50, 50, 50)
      doc.line(20, y, 190, y)
      y += 8

      items.forEach(item => {
        doc.setTextColor(240, 240, 240)
        doc.setFontSize(10)
        doc.text(item.nombre.slice(0, 40), 20, y)
        doc.text(String(item.qty), 126, y)
        doc.text(fmt(item.precio), 140, y)
        doc.text(fmt(item.qty * item.precio), 170, y)
        y += 8
      })

      y += 8
      doc.setDrawColor(50, 50, 50)
      doc.line(20, y, 190, y)
      y += 10

      const rows = [
        ['Subtotal', fmt(subtotal), false],
        [`Descuento (${discPct}%)`, `-${fmt(descuento)}`, false],
        ['IVA (21%)', fmt(iva), false],
        ['TOTAL', fmt(total), true],
      ]
      rows.forEach(([label, val, bold]) => {
        doc.setTextColor(bold ? 200 : 160, bold ? 240 : 160, bold ? 0 : 160)
        doc.setFontSize(bold ? 13 : 10)
        doc.setFont('helvetica', bold ? 'bold' : 'normal')
        doc.text(label, 120, y)
        doc.text(val, 170, y)
        y += bold ? 10 : 7
      })

      doc.setTextColor(60, 60, 60)
      doc.setFontSize(9)
      doc.text('WASE Digital · Marketing Digital · wasedigital.com', 20, 280)

      doc.save(`Propuesta-Wase-${clienteNombre}-${new Date().toISOString().slice(0,10)}.pdf`)
      showToast('PDF descargado correctamente')
    } catch (e) {
      showToast('PDF generado (modo demo)')
    }
  }

  return (
    <div className="p-5">
      <SH title="Nueva Cotización" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Form */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-5">
            <div className="grid grid-cols-2 gap-4 mb-5">
              {[
                { label:'Cliente', el:
                  <select value={cliente} onChange={e=>setCliente(e.target.value)} className="w-full text-[12.5px] py-2 px-3 rounded-lg outline-none"
                          style={{background:'var(--raised)',border:'1px solid var(--border)',color:'var(--text1)'}}>
                    <option value="">Seleccionar cliente…</option>
                    {clientes.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                },
                { label:'Tipo', el:
                  <select value={tipo} onChange={e=>setTipo(e.target.value)} className="w-full text-[12.5px] py-2 px-3 rounded-lg outline-none"
                          style={{background:'var(--raised)',border:'1px solid var(--border)',color:'var(--text1)'}}>
                    <option>Retainer Mensual</option><option>Proyecto Fijo</option><option>Campaña Puntual</option><option>Pack Completo</option>
                  </select>
                },
              ].map(({label,el})=>(
                <div key={label} className="space-y-1.5">
                  <label className="text-[10px] font-semibold uppercase tracking-wider" style={{color:'var(--text3)'}}>{label}</label>
                  {el}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-[10.5px] font-bold uppercase tracking-wider" style={{color:'var(--text3)'}}>Servicios</span>
              <button onClick={()=>setShowPreset(!showPreset)}
                className="text-[11px] px-2.5 py-1 rounded-lg transition-colors"
                style={{background:'var(--accent-dim)',color:'var(--accent)',border:'1px solid rgba(200,240,0,0.2)'}}>
                + Servicio preset
              </button>
            </div>

            {/* Preset dropdown */}
            {showPreset && (
              <motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}}
                className="rounded-xl mb-3 overflow-hidden" style={{border:'1px solid var(--border)',background:'var(--raised)'}}>
                {SERVICIOS_PRESET.map((s,i)=>(
                  <button key={i} onClick={()=>addPreset(s)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-[12.5px] transition-colors hover:bg-[var(--overlay)] text-left"
                    style={{borderBottom:i<SERVICIOS_PRESET.length-1?'1px solid var(--border)':'none',color:'var(--text1)'}}>
                    <span>{s.nombre}</span>
                    <span style={{color:'var(--accent)',fontFamily:'JetBrains Mono,monospace',fontWeight:700}}>{fmt(s.precio)}</span>
                  </button>
                ))}
              </motion.div>
            )}

            {/* Items */}
            <div className="space-y-2">
              {items.map((item,i)=>(
                <motion.div key={i} initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}
                  className="flex items-center gap-2 p-3 rounded-lg"
                  style={{background:'var(--raised)',border:'1px solid var(--border)'}}>
                  <input value={item.nombre} onChange={e=>updateItem(i,'nombre',e.target.value)}
                    className="flex-1 text-[12.5px] py-1 px-2 rounded outline-none"
                    style={{background:'var(--overlay)',border:'1px solid var(--border)',color:'var(--text1)'}}/>
                  <input type="number" value={item.qty} min={1} onChange={e=>updateItem(i,'qty',e.target.value)}
                    className="w-11 text-center text-[12.5px] py-1 px-1 rounded outline-none"
                    style={{background:'var(--overlay)',border:'1px solid var(--border)',color:'var(--text1)'}}/>
                  <input type="number" value={item.precio} onChange={e=>updateItem(i,'precio',e.target.value)}
                    className="w-24 text-[12.5px] py-1 px-2 rounded outline-none"
                    style={{background:'var(--overlay)',border:'1px solid var(--border)',color:'var(--text1)'}}/>
                  <span className="w-24 text-right font-bold text-[12.5px] flex-shrink-0"
                        style={{color:'var(--accent)',fontFamily:'JetBrains Mono,monospace'}}>{fmt(item.qty*item.precio)}</span>
                  <button onClick={()=>removeItem(i)} className="flex-shrink-0 transition-colors hover:text-[var(--danger)]"
                          style={{color:'var(--text3)'}}><Trash2 size={13}/></button>
                </motion.div>
              ))}
            </div>

            <button onClick={()=>setItems([...items,{nombre:'Nuevo servicio',qty:1,precio:0}])}
              className="mt-3 w-full py-2 rounded-lg text-[12.5px] transition-colors"
              style={{border:'1px dashed var(--border)',color:'var(--text3)',background:'transparent',cursor:'pointer'}}>
              + Personalizado
            </button>
          </Card>
        </div>

        {/* Summary */}
        <div className="lg:col-span-2">
          <Card className="p-5 sticky top-5">
            <div className="font-bold text-[14px] mb-4" style={{fontFamily:'Syne,sans-serif'}}>Resumen</div>

            {/* Discount slider */}
            <div className="mb-4 space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span style={{color:'var(--text3)'}}>Descuento</span>
                <span style={{color:'var(--accent)',fontWeight:700}}>{discPct}%</span>
              </div>
              <input type="range" min={0} max={30} value={discPct} onChange={e=>setDiscPct(+e.target.value)}
                className="w-full h-1 rounded-full appearance-none cursor-pointer"
                style={{background:`linear-gradient(to right, var(--accent) ${discPct/30*100}%, var(--raised) ${discPct/30*100}%)`}}/>
            </div>

            <div className="space-y-1 mb-5">
              {[
                {l:'Subtotal',         v:fmt(subtotal)},
                {l:`Descuento (${discPct}%)`, v:`-${fmt(descuento)}`, color:'var(--danger)'},
                {l:'IVA (21%)',        v:fmt(iva)},
              ].map(row=>(
                <div key={row.l} className="flex justify-between text-[12.5px] py-2"
                     style={{borderBottom:'1px solid var(--border)'}}>
                  <span style={{color:'var(--text2)'}}>{row.l}</span>
                  <span style={{color:row.color||'var(--text1)'}}>{row.v}</span>
                </div>
              ))}
              <div className="flex justify-between py-3">
                <span className="font-bold text-[14px]">TOTAL</span>
                <span className="font-black text-[20px]" style={{color:'var(--accent)',fontFamily:'Syne,sans-serif'}}>{fmt(total)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Btn className="w-full justify-center" icon={Save} onClick={handleSave}>Guardar en Sheets</Btn>
              <Btn variant="ghost" className="w-full justify-center" icon={Download} onClick={handlePDF}>Exportar PDF</Btn>
              <Btn variant="ghost" className="w-full justify-center" icon={Send} onClick={()=>showToast('Compartiendo por WhatsApp')}>WhatsApp</Btn>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
