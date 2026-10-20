// features/reports/services/reports.api.ts
import apiClient from '@api/client/axios.client'
import { API } from '@api/endpoints'
import type { ApiResponse, DailySalesReport, TopProductRow, LowStockRow } from '@interfaces/api.types'

export const reportsApi = {
  getDailySales: async (params: { from: string; to: string }) => {
    const { data } = await apiClient.get<ApiResponse<DailySalesReport>>(API.reports.dailySales, { params })
    return data.data
  },
  getTopProducts: async (params: { from: string; to: string; limit?: number }) => {
    const { data } = await apiClient.get<ApiResponse<TopProductRow[]>>(API.reports.topProducts, { params })
    return data.data
  },
  getLowStock: async () => {
    const { data } = await apiClient.get<ApiResponse<LowStockRow[]>>(API.reports.lowStock)
    return data.data
  },
  downloadDailySalesExcel: async (params: { from: string; to: string }) => {
    const response = await apiClient.get(API.reports.dailySalesExcel, {
      params,
      responseType: 'blob',
    })
    const url  = URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href  = url
    link.download = `reporte-ventas-${params.from}-${params.to}.xlsx`
    link.click()
    URL.revokeObjectURL(url)
  },
  downloadDailySalesPdf: async (params: { from: string; to: string }) => {
    const response = await apiClient.get(API.reports.dailySalesPdf, {
      params,
      responseType: 'blob',
    })
    const url  = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
    window.open(url, '_blank')
    URL.revokeObjectURL(url)
  },
  downloadLowStockExcel: async () => {
    const response = await apiClient.get(API.reports.lowStockExcel, { responseType: 'blob' })
    const url  = URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href  = url
    link.download = `stock-bajo-${new Date().toISOString().slice(0, 10)}.xlsx`
    link.click()
    URL.revokeObjectURL(url)
  },
}