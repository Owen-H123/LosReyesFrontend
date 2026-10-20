// features/products/services/products.api.ts
import apiClient from '@api/client/axios.client'
import { API } from '@api/endpoints'
import type { ApiResponse, PagedResponse, Product, CreateProductRequest, UpdateProductRequest } from '@interfaces/api.types'

export const productsApi = {
  getAll: async (params?: {
    search?: string; categoryId?: number; status?: string
    sortBy?: string; sortDir?: string; page?: number; size?: number
  }) => {
    const { data } = await apiClient.get<ApiResponse<PagedResponse<Product>>>(API.products.list, { params })
    return data.data
  },
  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<Product>>(API.products.byId(id))
    return data.data
  },
  getByCode: async (code: string) => {
    const { data } = await apiClient.get<ApiResponse<Product>>(API.products.byCode(code))
    return data.data
  },
  getLowStock: async () => {
    const { data } = await apiClient.get<ApiResponse<Product[]>>(API.products.lowStock)
    return data.data
  },
  create: async (body: CreateProductRequest) => {
    const { data } = await apiClient.post<ApiResponse<Product>>(API.products.list, body)
    return data.data
  },
  update: async (id: number, body: UpdateProductRequest) => {
    const { data } = await apiClient.put<ApiResponse<Product>>(API.products.byId(id), body)
    return data.data
  },
  delete: async (id: number) => {
    await apiClient.delete(API.products.byId(id))
  },
  uploadImage: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await apiClient.post<ApiResponse<{ imageUrl: string }>>(
      API.products.uploadImage,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return data.data
  },
}