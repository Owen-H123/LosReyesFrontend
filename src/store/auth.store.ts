// store/auth.store.ts

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { LoginResponse } from '@interfaces/api.types'

// Dónde vive cada dato de la sesión:
//   - refresh token → cookie HttpOnly que pone el backend. JavaScript no la ve.
//   - access token  → solo en memoria (este store). No se guarda en localStorage:
//                     al recargar la página se pide uno nuevo con la cookie.
//   - usuario       → localStorage, para mostrar nombre y rol sin esperar al backend.
interface AuthState {
  user: Omit<LoginResponse, 'accessToken' | 'expiresIn'> | null
  accessToken: string | null
  expiresIn: number | null
  isAuthenticated: boolean

  // Actions
  setAuth: (data: LoginResponse) => void
  updateAccessToken: (accessToken: string) => void
  updateUser: (patch: Partial<Omit<LoginResponse, 'accessToken' | 'expiresIn'>>) => void
  clearAuth: () => void

  // Helpers
  isAdmin: () => boolean
  isWorker: () => boolean
  hasRole: (role: string) => boolean
}

type PersistedAuth = Pick<AuthState, 'user' | 'expiresIn' | 'isAuthenticated'>

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      expiresIn: null,
      isAuthenticated: false,

      setAuth: (data: LoginResponse) => {
        if (!data) return

        const { accessToken, expiresIn, ...user } = data

        set({
          user,
          accessToken,
          expiresIn,
          isAuthenticated: true,
        })
      },

      updateAccessToken: (accessToken: string) => {
        set({ accessToken })
      },

      updateUser: (patch) => {
        set(state => ({
          user: state.user ? { ...state.user, ...patch } : state.user,
        }))
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          expiresIn: null,
          isAuthenticated: false,
        })
      },

      isAdmin: () => get().user?.role === 'ADMIN',

      isWorker: () => get().user?.role === 'WORKER',

      hasRole: (role: string) => get().user?.role === role,
    }),
    {
      name: 'dlr-auth',

      storage: createJSONStorage(() => localStorage),

      // Los tokens NO se guardan: solo los datos del usuario
      partialize: (state): PersistedAuth => ({
        user: state.user,
        expiresIn: state.expiresIn,
        isAuthenticated: state.isAuthenticated,
      }),

      // Versión 1: la versión 0 guardaba accessToken y refreshToken en
      // localStorage. Al cargar, se descartan para que no queden guardados.
      version: 1,
      migrate: (persisted): PersistedAuth => {
        const old = (persisted ?? {}) as Partial<PersistedAuth>
        return {
          user: old.user ?? null,
          expiresIn: old.expiresIn ?? null,
          isAuthenticated: old.isAuthenticated ?? false,
        }
      },
    }
  )
)
