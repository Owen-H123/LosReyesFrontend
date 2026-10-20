// features/dashboard/components/QuickStats.tsx
// Fila "Resumen rápido": ticket promedio, ventas del mes, catálogo y alertas.
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { formatCurrency, formatNumber } from '@lib/utils'
import type { DashboardSummary } from '@interfaces/api.types'
import { fadeUp } from '@features/dashboard/components/dashboardUi'

export function QuickStats({ summary }: { summary: DashboardSummary }) {
  const stats = [
    { label: 'Ticket promedio',     value: summary.todaySalesCount > 0 ? formatCurrency(summary.todayRevenue / summary.todaySalesCount) : '—', color: 'var(--accent)' },
    { label: 'Ventas este mes',      value: String(summary.monthSalesCount ?? 0), color: 'var(--success)' },
    { label: 'Productos en catálogo',value: formatNumber(summary.activeProductsCount), color: '#7c3aed' },
    { label: 'Alertas activas',      value: String(summary.lowStockCount ?? 0), color: summary.lowStockCount > 0 ? 'var(--danger)' : 'var(--text-muted)' },
  ]

  return (
    <motion.div {...fadeUp(0.52)} className="card p-4">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Zap size={14} style={{ color: 'var(--accent)' }} />
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Resumen rápido</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
        {stats.map((s, i) => (
          <div
            key={i}
            style={{
              textAlign: 'center', padding: '12px 8px',
              borderRight: i < 3 ? '1px solid var(--border)' : 'none',
            }}
          >
            <p style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
