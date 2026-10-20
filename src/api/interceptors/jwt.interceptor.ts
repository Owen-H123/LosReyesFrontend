// api/interceptors/jwt.interceptor.ts
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import apiClient from '@api/client/axios.client'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token!)
  })
  failedQueue = []
}

// El refresh token no pasa por aquí: está en una cookie HttpOnly que el
// navegador envía solo a /auth/refresh (JavaScript no la puede leer).
export function setupJwtInterceptors(
  getAccessToken: () => string | null,
  onRefreshSuccess: (accessToken: string) => void,
  onLogout: () => void
) {
  // ── Request: attach Bearer token ──────────────────────────
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  // ── Response: handle 401 with refresh flow ─────────────────
  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
      }

      // Only handle 401 on non-auth routes and non-retried requests
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes('/auth/')
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          // Sin body: el refresh token va en la cookie. /auth/refresh devuelve
          // LoginResponse directo, sin envolver en ApiResponse.
          const { data } = await apiClient.post('/auth/refresh')
          const { accessToken } = data

          onRefreshSuccess(accessToken)
          processQueue(null, accessToken)

          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return apiClient(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError, null)
          onLogout()
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      return Promise.reject(error)
    }
  )
}