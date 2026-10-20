// features/inventory/services/inventory.api.ts
import apiClient from '@api/client/axios.client'
import { API } from '@api/endpoints'
import type { ApiResponse, PagedResponse, InventoryMovement } from '@interfaces/api.types'

export const inventoryApi = {
  getMovements: async (params?: { type?: string; page?: number; size?: number }) => {
    const { data } = await apiClient.get<ApiResponse<PagedResponse<InventoryMovement>>>(API.inventory.movements, { params })
    return data.data
  },
  getByProduct: async (productId: number, page = 0) => {
    const { data } = await apiClient.get<ApiResponse<PagedResponse<InventoryMovement>>>(
      API.inventory.byProduct(productId), { params: { page } })
    return data.data
  },
  getRecent: async (limit = 10) => {
    const { data } = await apiClient.get<ApiResponse<InventoryMovement[]>>(API.inventory.recent, { params: { limit } })
    return data.data
  },
  registerEntry: async (body: { productId: number; quantity: number; unitCost?: number; observation?: string }) => {
    const { data } = await apiClient.post<ApiResponse<InventoryMovement>>(API.inventory.entry, body)
    return data.data
  },
  registerExit: async (body: { productId: number; quantity: number; observation?: string }) => {
    const { data } = await apiClient.post<ApiResponse<InventoryMovement>>(API.inventory.exit, body)
    return data.data
  },
  registerAdjustment: async (productId: number, newStock: number, observation?: string) => {
    const { data } = await apiClient.post<ApiResponse<InventoryMovement>>(
      API.inventory.adjustment, null, { params: { productId, newStock, observation } })
    return data.data
  },
}