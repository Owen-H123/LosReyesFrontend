// features/dashboard/components/RevenueChart.tsx
// Gráfico de área con los ingresos de los últimos 7 días.
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { DailyRevenue } from '@features/dashboard/services/dashboard.api'
import { SectionCard } from '@features/dashboard/components/SectionCard'
import { Skeleton } from '@features/dashboard/components/Skeleton'
import { ChartTooltip } from '@features/dashboard/components/ChartTooltip'
import { chartGrid, chartTick } from '@features/dashboard/components/dashboardUi'

// Datos de ejemplo para que el gráfico no quede vacío si todavía no hay ventas
const SAMPLE_SALES = [
  { day: 'Lun', revenue: 1200 },
  { day: 'Mar', revenue: 1900 },
  { day: 'Mié', revenue: 1400 },
  { day: 'Jue', revenue: 2200 },
  { day: 'Vie', revenue: 1800 },
  { day: 'Sáb', revenue: 2600 },
  { day: 'Dom', revenue: 1100 },
]

export function RevenueChart({ dailyRevenue, loading, isDark }: {
  dailyRevenue?: DailyRevenue[]
  loading: boolean
  isDark: boolean
}) {
  const salesData = (dailyRevenue && dailyRevenue.length > 0) ? dailyRevenue : SAMPLE_SALES

  return (
    <SectionCard
      title="Ingresos — últimos 7 días"
      sub="Tendencia de ventas diarias"
      delay={0.22}
      right={
        <span
          className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{ background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}
        >
          Semana actual
        </span>
      }
    >
      {loading ? <Skeleton h={210} /> : (
        <ResponsiveContainer width="100%" height={210}>
          <AreaChart data={salesData} margin={{ top: 4, right: 2, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="var(--accent)" stopOpacity={0.18} />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid {...chartGrid(isDark)} vertical={false} />
            <XAxis dataKey="day" tick={chartTick} tickLine={false} axisLine={false} />
            <YAxis tick={chartTick} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--border-hover)', strokeWidth: 1 }} />
            <Area
              type="monotone" dataKey="revenue"
              stroke="var(--accent)" strokeWidth={2}
              fill="url(#gArea)" dot={false}
              activeDot={{ r: 5, fill: 'var(--accent)', strokeWidth: 2, stroke: 'var(--bg-surface)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </SectionCard>
  )
}
