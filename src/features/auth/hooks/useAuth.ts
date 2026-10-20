// features/auth/hooks/useAuth.ts
//
// QUÉ HACE:
//   Hook principal del módulo de autenticación.
//   Encapsula la lógica de login y logout: llamada API, manejo
//   de estado de carga, captura de errores, actualización del
//   store global y navegación post-login.
//
// POR QUÉ EXISTE:
//   Siguiendo el patrón del proyecto (useProducts, useSales, etc.),
//   la lógica de negocio nunca vive en los componentes de página.
//   LoginPage solo renderiza y delega al hook.
//
// RELACIONES:
//   → authApi      — realiza las llamadas HTTP
//   → useAuthStore — persiste la sesión en Zustand + localStorage
//   → useNavigate  — redirige después del login/logout
//   ← LoginPage.tsx — consume este hook
//
// FLUJO DE LOGIN:
//   1. Componente llama a login(data)
//   2. Hook llama a authApi.login(data)
//   3. Si OK → setAuth(response) en el store → navegar a `from`
//   4. Si error → capturar mensaje del servidor → exponer en apiError
//
// FLUJO DE LOGOUT:
//   1. Componente llama a logout()
//   2. Hook llama a authApi.logout() (best-effort, ignora fallos de red)
//   3. clearAuth() en el store → limpiar React Query cache → navegar a /login

import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authApi } from '@features/auth/services/auth.api'
import { useAuthStore } from '@store/auth.store'
import type { LoginFormData } from '@features/auth/schemas/login.schema'
import type { UseAuthReturn } from '@features/auth/interfaces/auth.types'
import type { UpdateProfileRequest } from '@interfaces/api.types'

// Extrae el mensaje de error de la respuesta Axios de forma segura
function extractApiError(error: unknown): string {
  const axiosError = error as {
    response?: {
      data?: {
        message?: string
        errors?: string[]
      }
      status?: number
    }
  }

  // Mensajes específicos por código HTTP
  if (axiosError?.response?.status === 401) {
    return 'Correo o contraseña incorrectos'
  }
  if (axiosError?.response?.status === 403) {
    return 'Tu cuenta está suspendida. Contacta al administrador'
  }
  if (axiosError?.response?.status === 0 || !axiosError?.response) {
    return 'No se pudo conectar con el servidor. Verifica tu conexión'
  }

  // Mensaje del backend si existe
  const serverMessage = axiosError?.response?.data?.message
  if (serverMessage) return serverMessage

  return 'Ocurrió un error al iniciar sesión. Intenta nuevamente'
}

export function useAuth(): UseAuthReturn {
  const navigate     = useNavigate()
  const location     = useLocation()
  const queryClient  = useQueryClient()
  const { setAuth, clearAuth } = useAuthStore()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError]         = useState<string | null>(null)

  // Obtiene la ruta a la que redirigir post-login.
  // Si el usuario fue redirigido desde una ruta protegida, vuelve a ella.
  // Si no, va al dashboard por defecto.
  const getRedirectPath = (): string => {
    return (
      (location.state as { from?: { pathname: string } })
        ?.from?.pathname ?? '/dashboard'
    )
  }

  const login = useCallback(async (data: LoginFormData): Promise<void> => {
    setIsSubmitting(true)
    setApiError(null)

    try {
      const response = await authApi.login(data)

      // Persistir sesión en Zustand (con localStorage via persist middleware)
      setAuth(response)

      toast.success(`Bienvenido, ${response.name}`, {
        description: `Rol: ${response.role === 'ADMIN' ? 'Administrador' : 'Trabajador'}`,
        duration: 3000,
      })

      navigate(getRedirectPath(), { replace: true })

    } catch (error) {
      const message = extractApiError(error)
      setApiError(message)
      // No lanzamos toast de error aquí — el mensaje se muestra inline
      // en el formulario para mejor UX (más visible que un toast)
    } finally {
      setIsSubmitting(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state])

  const logout = useCallback(async (): Promise<void> => {
    try {
      // Intentamos revocar tokens en el servidor (best-effort)
      await authApi.logout()
    } catch {
      // Si falla la red, continuamos con el logout local de todas formas
    } finally {
      clearAuth()
      queryClient.clear()
      navigate('/login', { replace: true })
      toast.success('Sesión cerrada correctamente')
    }
  }, [clearAuth, queryClient, navigate])

  const clearError = useCallback(() => {
    setApiError(null)
  }, [])

  return {
    isSubmitting,
    apiError,
    login,
    logout,
    clearError,
  }
}

// ACTUALIZAR PERFIL (nombre / email)

export function useUpdateProfile() {
  const { updateUser } = useAuthStore()
  return useMutation({
    mutationFn: (body: UpdateProfileRequest) => authApi.updateProfile(body),
    onSuccess: (data) => {
      updateUser(data)
      toast.success('Perfil actualizado correctamente')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? 'Error al actualizar el perfil')
    },
  })
}

// ACTUALIZAR FOTO DE PERFIL

export function useUploadAvatar() {
  const { updateUser } = useAuthStore()
  return useMutation({
    mutationFn: (file: File) => authApi.uploadAvatar(file),
    onSuccess: (data) => {
      updateUser(data)
      toast.success('Foto de perfil actualizada')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? 'Error al subir la foto')
    },
  })
}