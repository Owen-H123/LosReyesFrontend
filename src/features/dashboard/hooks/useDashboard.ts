// features/dashboard/hooks/useDashboard.ts
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@features/dashboard/services/dashboard.api'

export const DASHBOARD_KEYS = {
  summary:        ['dashboard', 'summary']                          as const,
  full:           ['dashboard', 'full']                             as const,
  topProducts:    (limit: number) => ['dashboard', 'topProducts', limit] as const,
  lowStock:       ['dashboard', 'lowStock']                         as const,
  workerActivity: ['dashboard', 'workerActivity']                   as const,
  recentSales:    (limit: number) => ['dashboard', 'recentSales', limit]  as const,
  dailyRevenue:   (days: number) => ['dashboard', 'dailyRevenue', days]   as const,
}

export function useDashboardSummary() {
  return useQuery({
    queryKey:              DASHBOARD_KEYS.summary,
    queryFn:               dashboardApi.getSummary,
    // "Tiempo real": ventas de hoy, de la semana y stock crítico (badge de
    // la campana) se refrescan cada 5s. Es seguro pedir esto tan seguido
    // porque el backend ahora invalida su caché en cada movimiento/venta
    // (ver @CacheEvict en InventoryMovementService / ProductService) — antes
    // de eso, refrescar rápido no habría servido de nada porque el valor
    // cacheado no cambiaba.
    staleTime:              0,
    refetchInterval:        5000,
    refetchOnWindowFocus:   true,
    refetchOnReconnect:     true,
  })
}

export function useDashboardFull() {
  return useQuery({
    queryKey:  DASHBOARD_KEYS.full,
    queryFn:   dashboardApi.getFull,
    staleTime: 1000 * 60,
  })
}

export function useTopProducts(limit = 5) {
  return useQuery({
    queryKey:             DASHBOARD_KEYS.topProducts(limit),
    queryFn:              () => dashboardApi.getTopProducts(limit),
    staleTime:            0,
    refetchInterval:      15000, // el ranking del mes cambia menos seguido que el resumen
    refetchOnWindowFocus: true,
  })
}

export function useLowStockDashboard() {
  return useQuery({
    queryKey:             DASHBOARD_KEYS.lowStock,
    queryFn:              dashboardApi.getLowStock,
    staleTime:            0,
    refetchInterval:      5000,
    refetchOnWindowFocus: true,
  })
}

export function useWorkerActivity() {
  return useQuery({
    queryKey:             DASHBOARD_KEYS.workerActivity,
    queryFn:              dashboardApi.getWorkerActivity,
    staleTime:            0,
    refetchInterval:      5000,
    refetchOnWindowFocus: true,
  })
}

export function useRecentSales(limit = 10) {
  return useQuery({
    queryKey: DASHBOARD_KEYS.recentSales(limit),
    queryFn:  () => dashboardApi.getRecentSales(limit),
  })
}

// Alimenta el AreaChart de "Últimos N días" — datos ya agrupados por día
export function useDailyRevenue(days = 7) {
  return useQuery({
    queryKey:  DASHBOARD_KEYS.dailyRevenue(days),
    queryFn:   () => dashboardApi.getDailyRevenue(days),
    staleTime: 1000 * 60 * 5,
  })
}