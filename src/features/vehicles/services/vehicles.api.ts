// features/vehicles/services/vehicles.api.ts
import apiClient from '@api/client/axios.client'
import { API } from '@api/endpoints'
import type { ApiResponse, Vehicle } from '@interfaces/api.types'

export interface CreateVehicleRequest {
  brand: string
  model: string
  year: number
  engine?: string
}

export const vehiclesApi = {
  // CORRECCIÓN: GET /vehicles devuelve una LISTA plana (List<Response>),
  // no un objeto paginado con ".content" — el backend no pagina este
  // endpoint. Antes se pedía como ApiResponse<PagedResponse<Vehicle>> y
  // como un array no tiene ".content", vehicles siempre salía vacío
  // aunque hubiera datos reales en la base.
  getAll: async (): Promise<Vehicle[]> => {
    const { data } = await apiClient.get<ApiResponse<Vehicle[]>>(API.vehicles.list)
    return data.data
  },
  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<Vehicle>>(API.vehicles.byId(id))
    return data.data
  },
  getBrands: async (): Promise<string[]> => {
    const { data } = await apiClient.get<ApiResponse<string[]>>(API.vehicles.brands)
    return data.data
  },
  getModelsByBrand: async (brand: string): Promise<string[]> => {
    const { data } = await apiClient.get<ApiResponse<string[]>>(API.vehicles.models(brand))
    return data.data
  },
  create: async (body: CreateVehicleRequest) => {
    const { data } = await apiClient.post<ApiResponse<Vehicle>>(API.vehicles.list, body)
    return data.data
  },
  update: async (id: number, body: Partial<CreateVehicleRequest>) => {
    const { data } = await apiClient.put<ApiResponse<Vehicle>>(API.vehicles.byId(id), body)
    return data.data
  },
  delete: async (id: number) => {
    await apiClient.delete(API.vehicles.byId(id))
  },
}