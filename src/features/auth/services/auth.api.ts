// features/auth/services/auth.api.ts

import apiClient from '@api/client/axios.client'
import { API } from '@api/endpoints'
import type { LoginResponse, UpdateProfileRequest } from '@interfaces/api.types'
import type { LoginFormData } from '@features/auth/schemas/login.schema'

// El backend de /auth/** (AuthController) devuelve el LoginResponse
// DIRECTO en el body — a diferencia del resto de la API (productos,
// ventas, etc.) que sí envuelve todo en ApiResponse<T>. Por eso aquí NO
// se hace ".data.data", solo ".data" — un solo nivel.
export const authApi = {
  login: async (credentials: LoginFormData): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>(API.auth.login, credentials)
    return data
  },

  logout: async (): Promise<void> => {
    await apiClient.post(API.auth.logout)
  },

  // El refresh token va en la cookie HttpOnly: no se envía en el body
  refresh: async (): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>(API.auth.refresh)
    return data
  },

  // Responde igual exista o no el email (el backend no revela qué correos existen)
  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post(API.auth.forgotPassword, { email })
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post(API.auth.resetPassword, { token, newPassword })
  },

  updateProfile: async (body: UpdateProfileRequest): Promise<LoginResponse> => {
    const { data } = await apiClient.put<LoginResponse>(API.auth.updateProfile, body)
    return data
  },

  uploadAvatar: async (file: File): Promise<LoginResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await apiClient.post<LoginResponse>(
      API.auth.uploadAvatar,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return data
  },
}