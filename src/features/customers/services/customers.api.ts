// features/customers/services/customers.api.ts
import apiClient from '@api/client/axios.client'
import { API } from '@api/endpoints'
import type { ApiResponse, PagedResponse, Customer } from '@interfaces/api.types'

export const customersApi = {
  getAll: async (params?: { search?: string; page?: number; size?: number }) => {
    const { data } = await apiClient.get<ApiResponse<PagedResponse<Customer>>>(API.customers.list, { params })
    return data.data
  },
  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<Customer>>(API.customers.byId(id))
    return data.data
  },
  getByDocument: async (doc: string) => {
    const { data } = await apiClient.get<ApiResponse<Customer>>(API.customers.byDocument(doc))
    return data.data
  },
  create: async (body: { documentType: string; documentNumber: string; name: string; email?: string; phone?: string; address?: string }) => {
    const { data } = await apiClient.post<ApiResponse<Customer>>(API.customers.list, body)
    return data.data
  },
  update: async (id: number, body: object) => {
    const { data } = await apiClient.put<ApiResponse<Customer>>(API.customers.byId(id), body)
    return data.data
  },
  deactivate: async (id: number) => {
    await apiClient.delete(API.customers.byId(id))
  },
}