// features/auth/hooks/useLogout.ts
// Cierra la sesión: avisa al backend (si falla, igual se sale), limpia el store
// y la caché de React Query, y vuelve al login.
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import apiClient from '@api/client/axios.client'
import { useAuthStore } from '@store/auth.store'

export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const clearAuth = useAuthStore(s => s.clearAuth)

  return async () => {
    try { await apiClient.post('/auth/logout') } catch { /* ignore */ }
    clearAuth()
    queryClient.clear()
    navigate('/login', { replace: true })
    toast.success('Sesión cerrada correctamente')
  }
}
