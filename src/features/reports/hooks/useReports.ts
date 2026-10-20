// features/reports/hooks/useReports.ts
import { useQuery, useMutation } from '@tanstack/react-query'
import { reportsApi } from '@features/reports/services/reports.api'

export function useDailySalesReport(params: { from: string; to: string }) {
  return useQuery({
    queryKey: ['reports', 'daily-sales', params],
    queryFn:  () => reportsApi.getDailySales(params),
    enabled:  !!params.from && !!params.to,
  })
}

export function useTopProductsReport(params: { from: string; to: string; limit?: number }) {
  return useQuery({
    queryKey: ['reports', 'top-products', params],
    queryFn:  () => reportsApi.getTopProducts(params),
    enabled:  !!params.from && !!params.to,
  })
}

export function useLowStockReport() {
  return useQuery({
    queryKey: ['reports', 'low-stock'],
    queryFn:  reportsApi.getLowStock,
  })
}

export function useDownloadDailySalesExcel() {
  return useMutation({ mutationFn: reportsApi.downloadDailySalesExcel })
}

export function useDownloadDailySalesPdf() {
  return useMutation({ mutationFn: reportsApi.downloadDailySalesPdf })
}

export function useDownloadLowStockExcel() {
  return useMutation({ mutationFn: reportsApi.downloadLowStockExcel })
}