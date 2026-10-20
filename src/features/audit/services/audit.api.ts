// features/audit/services/audit.api.ts
import apiClient from '@api/client/axios.client'
import { API } from '@api/endpoints'
import type { ApiResponse, PagedResponse, AuditLog } from '@interfaces/api.types'

export const auditApi = {
  getAll: async (params?: { page?: number; size?: number; module?: string; search?: string }) => {
    const { data } = await apiClient.get<ApiResponse<PagedResponse<AuditLog>>>(API.audit.list, { params })
    return data.data
  },
  getByUser: async (userId: number) => {
    const { data } = await apiClient.get<ApiResponse<AuditLog[]>>(API.audit.byUser(userId))
    return data.data
  },
  getByModule: async (module: string) => {
    const { data } = await apiClient.get<ApiResponse<AuditLog[]>>(API.audit.byModule(module))
    return data.data
  },
  getByDateRange: async (params: { from: string; to: string }) => {
    const { data } = await apiClient.get<ApiResponse<AuditLog[]>>(API.audit.byDateRange, { params })
    return data.data
  },
}