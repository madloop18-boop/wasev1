import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const GAS_URL = 'https://script.google.com/macros/s/AKfycbygpwcS9rqF5-zfY3Iq1kVcEJazwul26ro5pu0LjkI0P8TFW-81HR-HD1vx_Nq2-tM1/exec'

const call = async (action, params = {}) => {
  const url = new URL(GAS_URL)
  url.searchParams.set('action', action)
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v))
  })
  const r = await fetch(url.toString(), { method: 'GET', redirect: 'follow', credentials: 'omit' })
  const j = JSON.parse(await r.text())
  if (!j.ok) throw new Error(j.error)
  return j.data
}

const post = async (action, body = {}) => call(action, body)

export const useStore = create((set, get) => ({
  activePage: 'dashboard', sidebarOpen: true, toast: null, modal: null,
  setPage: (p) => set({ activePage: p }),
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  showToast: (msg, type = 'success') => { set({ toast: { msg, type } }); setTimeout(() => set({ toast: null }), 3000) },
  openModal: (content) => set({ modal: content }),
  closeModal: () => set({ modal: null }),
  kpis: null, clientes: [], campanas: [], pipeline: null, calendario: [], actividad: [], loading: {},
  setLoading: (k, v) => set(s => ({ loading: { ...s.loading, [k]: v } })),

  fetchAll: async () => {
    const { fetchKPIs, fetchClientes, fetchCampanas, fetchActividad } = get()
    await Promise.all([fetchKPIs(), fetchClientes(), fetchCampanas(), fetchActividad()])
  },

  fetchKPIs: async () => {
    get().setLoading('kpis', true)
    try { set({ kpis: await call('kpis.dashboard') }) }
    catch { set({ kpis: { mrr: 2148000, clientes: 8, campanas_live: 5, roas_avg: 4.8, pipeline: 3200000, alcance_total: 4800000 } }) }
    finally { get().setLoading('kpis', false) }
  },

  fetchClientes: async () => {
    get().setLoading('clientes', true)
    try { set({ clientes: await call('clientes.list') }) }
    catch { set({ clientes: DEMO_CLIENTES }) }
    finally { get().setLoading('clientes', false) }
  },

  fetchCampanas: async () => {
    get().setLoading('campanas', true)
    try { set({ campanas: await call('campanas.list') }) }
    catch { set({ campanas: DEMO_CAMPANAS }) }
    finally { get().setLoading('campanas', false) }
  },

  fetchPipeline: async () => {
    get().setLoading('pipeline', true)
    try { set({ pipeline: await call('pipeline.list') }) }
    catch { set({ pipeline: DEMO_PIPELINE }) }
    finally { get().setLoading('pipeline', false) }
  },

  fetchCalendario: async () => {
    try { set({ calendario: await call('calendario.list') }) }
    catch { set({ calendario: DEMO_CALENDARIO }) }
  },

  fetchActividad: async () => {
    try { set({ actividad: await call('actividad.list', { limit: 10 }) }) }
    catch { set({ actividad: DEMO_ACTIVIDAD }) }
  },

  createCliente: async (data) => {
    try { const r = await call('clientes.create', data); get().fetchClientes(); get().showToast('Cliente creado'); return r }
    catch { get().showToast('Error al crear cliente', 'error') }
  },

  createCampana: async (data) => {
    try { const r = await call('campanas.create', data); get().fetchCampanas(); get().showToast('Campaña creada'); return r }
    catch { get().showToast('Error al crear campaña', 'error') }
  },

  updateCampana: async (id, data) => {
    try { await call('campanas.update', { id, ...data }); get().fetchCampanas(); get().showToast('Métricas actualizadas') }
    catch { get().showToast('Error al actualizar', 'error') }
  },

  createCotizacion: async (data) => {
    try { const r = await call('cotizacion.create', data); get().showToast(`✓ Cotización ${r.folio} guardada`); return r }
    catch { get().showToast('Cotización guardada (demo)'); return { folio: 'COT-DEMO-001' } }
  },

  createEvento: async (data) => {
    try { await call('calendario.create', data); get().fetchCalendario(); get().showToast('Publicación agendada') }
    catch { get().showToast('Evento guardado (demo)') }
  },

  createDeal: async (data) => {
    try { const r = await call('pipeline.create', data); get().fetchPipeline(); get().showToast('Deal creado'); return r }
    catch { get().showToast('Error al crear deal', 'error') }
  },

  moveDeal: async (id, etapa) => {
    try { await call('pipeline.update', { id, etapa }) } catch {}
    set(s => {
      if (!s.pipeline) return s
      const deals = Object.values(s.pipeline.grouped).flat()
      const deal = deals.find(d => d.id === id)
      if (!deal) return s
      const grouped = { ...s.pipeline.grouped }
      Object.keys(grouped).forEach(k => { grouped[k] = grouped[k].filter(d => d.id !== id) })
      grouped[etapa] = [...(grouped[etapa] || []), { ...deal, etapa }]
      return { pipeline: { ...s.pipeline, grouped } }
    })
  },
}))

export const useAuth = create(
  persist(
    (set, get) => ({
      user: null, loading: false, error: null,
      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const data = await call('auth.login', { email: email.toLowerCase().trim(), password })
          set({ user: { id: data.id, nombre: data.nombre, email: data.email, rol: data.rol, avatar: data.nombre.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() }, loading: false })
        } catch (e) { set({ loading: false, error: e.message || 'Credenciales incorrectas' }); throw e }
      },
      logout: () => set({ user: null, error: null }),
      clearError: () => set({ error: null }),
    }),
    { name: 'wase-auth', partialize: s => ({ user: s.user }) }
  )
)

export const DEMO_CLIENTES = [
  { id:'1', nombre:'Sokassia',  sector:'Moda',      servicio:'Meta ADS',         retainer:280000, estado:'activo', roas:6.2, contacto:'Sofia Valenzuela', email:'soki@sokassia.com' },
  { id:'2', nombre:'Bonse',     sector:'Importados', servicio:'Social Media',    retainer:149000, estado:'activo', roas:4.1, contacto:'Azariel Bonanno',  email:'az@bonse.com' },
  { id:'3', nombre:'TerraFit',  sector:'Fitness',    servicio:'Meta ADS',        retainer:350000, estado:'revision',roas:2.8, contacto:'Lucas Méndez',    email:'lucas@terrafit.com' },
  { id:'4', nombre:'LuxHome',   sector:'Decoración', servicio:'Content Creation',retainer:220000, estado:'activo', roas:5.4, contacto:'Marta Iglesias',   email:'marta@luxhome.com' },
  { id:'5', nombre:'NovaTech',  sector:'SaaS',       servicio:'Meta ADS',        retainer:500000, estado:'activo', roas:7.1, contacto:'Diego Ramos',      email:'diego@novatech.com' },
  { id:'6', nombre:'ModaCo',    sector:'Moda',       servicio:'Social Media',    retainer:149000, estado:'activo', roas:3.9, contacto:'Valentina Cruz',   email:'vale@modaco.com' },
]

const DEMO_CAMPANAS = [
  { id:'1', nombre:'Brand Awareness Q2', cliente_id:'1', cliente_nombre:'Sokassia', servicio:'Meta ADS',         inversion:280000, alcance:1400000, clicks:48000, conversiones:820, roas:6.2, estado:'activa' },
  { id:'2', nombre:'Gestión Mayo',       cliente_id:'2', cliente_nombre:'Bonse',    servicio:'Social Media',     inversion:149000, alcance:380000,  clicks:12000, conversiones:340, roas:4.1, estado:'activa' },
  { id:'3', nombre:'Conversión Ventas',  cliente_id:'3', cliente_nombre:'TerraFit', servicio:'Meta ADS',         inversion:350000, alcance:620000,  clicks:18000, conversiones:290, roas:2.8, estado:'revision' },
  { id:'4', nombre:'Contenido Mayo',     cliente_id:'4', cliente_nombre:'LuxHome',  servicio:'Content Creation', inversion:220000, alcance:290000,  clicks:8400,  conversiones:180, roas:5.4, estado:'activa' },
  { id:'5', nombre:'Performance Scale',  cliente_id:'5', cliente_nombre:'NovaTech', servicio:'Meta ADS',         inversion:500000, alcance:2100000, clicks:74000, conversiones:1240,roas:7.1, estado:'activa' },
]

const DEMO_PIPELINE = {
  total: 3200000,
  grouped: {
    prospecto:   [{ id:'p1', nombre:'FitZone',    empresa:'Gym',         valor:280000 }, { id:'p2', nombre:'CaféRoast', empresa:'Gastro', valor:149000 }],
    contactado:  [{ id:'p3', nombre:'SkinLab',    empresa:'Skincare',    valor:350000 }],
    propuesta:   [{ id:'p5', nombre:'VerdeFarm',  empresa:'Alimentos',   valor:500000 }],
    negociacion: [{ id:'p7', nombre:'UrbanStyle', empresa:'Streetwear',  valor:780000 }],
    cerrado:     [{ id:'p8', nombre:'Sokassia ✓', empresa:'Moda',        valor:280000 }],
  }
}

export const DEMO_CALENDARIO = [
  { id:'c1', titulo:'Reel Sokassia',  cliente:'Sokassia', tipo:'Reel',    fecha:'2026-05-06', color:'#c8f000' },
  { id:'c2', titulo:'Post Bonse',     cliente:'Bonse',    tipo:'Post',    fecha:'2026-05-06', color:'#38bdf8' },
  { id:'c3', titulo:'Story LuxHome',  cliente:'LuxHome',  tipo:'Story',   fecha:'2026-05-08', color:'#a78bfa' },
  { id:'c4', titulo:'Reporte Q1',     cliente:'Wase',     tipo:'Reporte', fecha:'2026-05-14', color:'#f59e0b' },
]

const DEMO_ACTIVIDAD = [
  { id:'a1', tipo:'campana',    texto:'Sokassia superó meta ROAS (6.2x)',        creado_en: new Date().toISOString() },
  { id:'a2', tipo:'cliente',    texto:'Nuevo cliente NovaTech onboarded',         creado_en: new Date(Date.now()-7200000).toISOString() },
  { id:'a3', tipo:'alerta',     texto:'Budget de TerraFit al 85% — revisar',      creado_en: new Date(Date.now()-14400000).toISOString() },
  { id:'a4', tipo:'cotizacion', texto:'Cotización enviada a ModaCo — $378.000',   creado_en: new Date(Date.now()-86400000).toISOString() },
]