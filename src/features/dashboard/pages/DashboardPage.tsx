// features/dashboard/pages/DashboardPage.tsx
// Pide los datos del dashboard y arma las secciones. Cada sección vive en
// features/dashboard/components/.
import { useQueryClient } from '@tanstack/react-query'
import {
  useDashboardSummary, useTopProducts, useLowStockDashboard,
  useWorkerActivity, useDailyRevenue, DASHBOARD_KEYS,
} from '@features/dashboard/hooks/useDashboard'
import { useUIStore } from '@store/ui.store'
import { DashboardHeader } from '@features/dashboard/components/DashboardHeader'
import { KpiGrid } from '@features/dashboard/components/KpiGrid'
import { RevenueChart } from '@features/dashboard/components/RevenueChart'
import { TopProductsChart } from '@features/dashboard/components/TopProductsChart'
import { ProductRanking } from '@features/dashboard/components/ProductRanking'
import { StockAlerts } from '@features/dashboard/components/StockAlerts'
import { TeamActivity } from '@features/dashboard/components/TeamActivity'
import { QuickStats } from '@features/dashboard/components/QuickStats'

export default function DashboardPage() {
  const queryClient = useQueryClient()
  const { theme } = useUIStore()
  const isDark = theme === 'dark'

  const { data: summary,      isLoading: loadingSummary } = useDashboardSummary()
  const { data: topProducts,  isLoading: loadingTop }     = useTopProducts(5)
  const { data: lowStock,     isLoading: loadingStock }   = useLowStockDashboard()
  const { data: workers,      isLoading: loadingWorkers } = useWorkerActivity()
  const { data: dailyRevenue, isLoading: loadingChart }   = useDailyRevenue(7)

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.summary })
    queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.topProducts(5) })
    queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.lowStock })
    queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.workerActivity })
    queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.dailyRevenue(7) })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      <DashboardHeader onRefresh={handleRefresh} />

      <KpiGrid summary={summary} dailyRevenue={dailyRevenue} loading={loadingSummary} />

      {/* ── Charts row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
        <RevenueChart dailyRevenue={dailyRevenue} loading={loadingChart} isDark={isDark} />
        <TopProductsChart topProducts={topProducts} loading={loadingTop} isDark={isDark} />
      </div>

      {/* ── Bottom row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, paddingBottom: 4 }}>
        <ProductRanking topProducts={topProducts} loading={loadingTop} />
        <StockAlerts lowStock={lowStock} loading={loadingStock} />
        <TeamActivity workers={workers} loading={loadingWorkers} />
      </div>

      {summary && <QuickStats summary={summary} />}
    </div>
  )
}
