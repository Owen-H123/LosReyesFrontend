// features/sales/services/sales.api.ts
import apiClient from '@api/client/axios.client'
import { API } from '@api/endpoints'
import type { ApiResponse, PagedResponse, Sale, CreateSaleRequest, PaymentMethod } from '@interfaces/api.types'

export interface UpdateSaleRequest {
  customerId?: number
  paymentMethod?: PaymentMethod
  notes?: string
}

export const salesApi = {
  getAll: async (params?: { status?: string; customerId?: number; userId?: number; page?: number; size?: number }) => {
    const { data } = await apiClient.get<ApiResponse<PagedResponse<Sale>>>(API.sales.list, { params })
    return data.data
  },
  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<Sale>>(API.sales.byId(id))
    return data.data
  },
  getRecent: async (limit = 10) => {
    const { data } = await apiClient.get<ApiResponse<Sale[]>>(API.sales.recent, { params: { limit } })
    return data.data
  },
  create: async (body: CreateSaleRequest) => {
    const { data } = await apiClient.post<ApiResponse<Sale>>(API.sales.list, body)
    return data.data
  },
  update: async (id: number, body: UpdateSaleRequest) => {
    const { data } = await apiClient.patch<ApiResponse<Sale>>(API.sales.update(id), body)
    return data.data
  },
  cancel: async (id: number, reason: string) => {
    const { data } = await apiClient.post<ApiResponse<Sale>>(API.sales.cancel(id), null, { params: { reason } })
    return data.data
  },
}