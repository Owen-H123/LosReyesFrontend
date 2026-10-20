// features/dashboard/components/DashboardHeader.tsx
// Saludo según la hora, indicador "Sistema activo" y botón Actualizar.
import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { fadeUp } from '@features/dashboard/components/dashboardUi'

export function DashboardHeader({ onRefresh }: { onRefresh: () => void }) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <motion.div {...fadeUp(0)} className="flex items-center justify-between">
      <div>
        <h1 className="page-title">{greeting}</h1>
        <p className="page-subtitle">Aquí está el resumen ejecutivo de hoy</p>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
          style={{ background: 'var(--success-light)', color: 'var(--success)', border: '1px solid var(--success-border)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: 'var(--success)' }} />
          Sistema activo
        </span>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            boxShadow: 'var(--shadow-xs)',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-primary)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
        >
          <RefreshCw size={13} />
          Actualizar
        </button>
      </div>
    </motion.div>
  )
}
