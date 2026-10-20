// features/dashboard/components/KpiGrid.tsx
// Fila de los 5 indicadores principales (ventas, productos, stock crítico).
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, CalendarDays, BarChart2, Package, AlertTriangle } from 'lucide-react'
import { formatCurrencyCompact, formatNumber } from '@lib/utils'
import type { DashboardSummary } from '@interfaces/api.types'
import type { DailyRevenue } from '@features/dashboard/services/dashboard.api'
import { KpiCard, type KpiProps } from '@features/dashboard/components/KpiCard'
import { Skeleton } from '@features/dashboard/components/Skeleton'

const GRID = 'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5'

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

export function KpiGrid({ summary, dailyRevenue, loading }: {
  summary?: DashboardSummary
  dailyRevenue?: DailyRevenue[]
  loading: boolean
}) {
  // dailyRevenue viene ordenado del día más antiguo a hoy
  const series = dailyRevenue?.map(d => d.revenue) ?? []
  const today = series[series.length - 1] as number | undefined
  const yesterday = series[series.length - 2] as number | undefined
  const vsYesterday = today !== undefined && yesterday ? ((today - yesterday) / yesterday) * 100 : null

  const kpis: Omit<KpiProps, 'delay'>[] = summary ? [
    {
      title: 'Ventas de hoy',
      value: formatCurrencyCompact(summary.todayRevenue),
      sub: plural(summary.todaySalesCount, 'venta', 'ventas'),
      deltaLabel: 'vs. ayer',
      delta: vsYesterday,
      icon: <TrendingUp />,
      tone: 'success',
    },
    {
      title: 'Últimos 7 días',
      value: formatCurrencyCompact(summary.weekRevenue),
      sub: plural(summary.weekSalesCount, 'venta', 'ventas'),
      icon: <CalendarDays />,
      tone: 'accent',
      spark: series,
    },
    {
      title: 'Mes actual',
      value: formatCurrencyCompact(summary.monthRevenue),
      sub: plural(summary.monthSalesCount, 'venta acumulada', 'ventas acumuladas'),
      icon: <BarChart2 />,
      tone: 'info',
    },
    {
      title: 'Productos activos',
      value: formatNumber(summary.activeProductsCount),
      sub: 'En el catálogo',
      icon: <Package />,
      tone: 'neutral',
    },
    {
      title: 'Stock crítico',
      value: formatNumber(summary.lowStockCount),
      sub: summary.lowStockCount > 0 ? 'Necesitan reposición' : 'Todo dentro del mínimo',
      icon: <AlertTriangle />,
      tone: summary.lowStockCount > 0 ? 'danger' : 'neutral',
    },
  ] : []

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div key="kpi-sk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={GRID}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-5">
              <Skeleton h={12} w="50%" />
              <div style={{ marginTop: 16 }}><Skeleton h={26} w="60%" /></div>
              <div style={{ marginTop: 10 }}><Skeleton h={11} w="40%" /></div>
            </div>
          ))}
        </motion.div>
      ) : (
        <motion.div key="kpi-data" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={GRID}>
          {kpis.map((kpi, i) => (
            <KpiCard key={kpi.title} {...kpi} delay={i * 0.05} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
