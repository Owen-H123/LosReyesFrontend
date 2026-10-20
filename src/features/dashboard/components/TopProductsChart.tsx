// features/dashboard/components/TopProductsChart.tsx
// Gráfico de barras con los 5 productos que más ingresos dieron en el mes.
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import type { TopProduct } from '@interfaces/api.types'
import { SectionCard } from '@features/dashboard/components/SectionCard'
import { Skeleton } from '@features/dashboard/components/Skeleton'
import { ChartTooltip, ProductNameTick } from '@features/dashboard/components/ChartTooltip'
import { CHART_COLORS, chartGrid, chartTick } from '@features/dashboard/components/dashboardUi'

export function TopProductsChart({ topProducts, loading, isDark }: {
  topProducts?: TopProduct[]
  loading: boolean
  isDark: boolean
}) {
  // Se guarda el nombre completo: el eje X lo trunca solo visualmente (ver
  // ProductNameTick) y el tooltip siempre muestra el nombre íntegro.
  const chartData = (topProducts ?? []).map(p => ({
    name: p.name,
    revenue: p.totalRevenue,
  }))

  return (
    <SectionCard title="Top 5 productos" sub="Por ingresos del mes" delay={0.28}>
      {loading ? <Skeleton h={210} /> : (
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={chartData} margin={{ top: 4, right: 2, left: -20, bottom: 0 }} barSize={20}>
            <CartesianGrid {...chartGrid(isDark)} vertical={false} />
            <XAxis dataKey="name" tick={<ProductNameTick x={0} y={0} payload={{ value: '' }} />} tickLine={false} axisLine={false} interval={0} />
            <YAxis tick={chartTick} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }} />
            <Bar dataKey="revenue" radius={[5, 5, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </SectionCard>
  )
}
