// features/categories/services/categories.api.ts
import apiClient from '@api/client/axios.client'
import { API } from '@api/endpoints'
import type { ApiResponse, Category } from '@interfaces/api.types'

export const categoriesApi = {
  getAll: async () => {
    const { data } = await apiClient.get<ApiResponse<Category[]>>(API.categories.list)
    return data.data
  },
  getActive: async () => {
    const { data } = await apiClient.get<ApiResponse<Category[]>>(API.categories.active)
    return data.data
  },
  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<Category>>(API.categories.byId(id))
    return data.data
  },
  create: async (body: { name: string; description?: string }) => {
    const { data } = await apiClient.post<ApiResponse<Category>>(API.categories.list, body)
    return data.data
  },
  update: async (id: number, body: { name: string; description?: string; active: boolean }) => {
    const { data } = await apiClient.put<ApiResponse<Category>>(API.categories.byId(id), body)
    return data.data
  },
  delete: async (id: number) => {
    await apiClient.delete(API.categories.byId(id))
  },
}