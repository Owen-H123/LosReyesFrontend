// features/dashboard/services/dashboard.api.ts
import apiClient from '@api/client/axios.client'
import { API } from '@api/endpoints'
import type {
  ApiResponse,
  DashboardSummary,
  DashboardData,
  TopProduct,
  WorkerActivity,
  Product,
  Sale,
} from '@interfaces/api.types'

export interface DailyRevenue {
  day: string      // e.g. "Lun", "Mar", …
  date: string
  revenue: number
  count: number
}

export const dashboardApi = {
  getSummary: async () => {
    const { data } = await apiClient.get<ApiResponse<DashboardSummary>>(API.dashboard.summary)
    return data.data
  },
  getFull: async () => {
    const { data } = await apiClient.get<ApiResponse<DashboardData>>(API.dashboard.full)
    return data.data
  },
  getTopProducts: async (limit = 5) => {
    const { data } = await apiClient.get<ApiResponse<TopProduct[]>>(
      API.dashboard.topProducts,
      { params: { limit } }
    )
    return data.data
  },
  getLowStock: async () => {
    const { data } = await apiClient.get<ApiResponse<Product[]>>(API.dashboard.lowStock)
    return data.data
  },
  getWorkerActivity: async () => {
    const { data } = await apiClient.get<ApiResponse<WorkerActivity[]>>(API.dashboard.workerActivity)
    return data.data
  },
  // Lista de ventas individuales recientes (para tablas, NO para el gráfico)
  getRecentSales: async (limit = 10) => {
    const { data } = await apiClient.get<ApiResponse<Sale[]>>(API.dashboard.recentSales, { params: { limit } })
    return data.data
  },
  // Ingresos agrupados por día — esto es lo que alimenta el AreaChart de "Últimos 7 días"
  getDailyRevenue: async (days = 7) => {
    const { data } = await apiClient.get<ApiResponse<DailyRevenue[]>>(
      API.dashboard.dailyRevenue,
      { params: { days } }
    )
    return data.data
  },
}