import { afterEach, describe, expect, it } from 'vitest'
import { useAuthStore } from '@store/auth.store'
import type { LoginResponse } from '@interfaces/api.types'

const login: LoginResponse = {
  userId: 1, name: 'Admin', email: 'admin@delosreyes.com', role: 'ADMIN',
  permissions: [], accessToken: 'token-secreto', expiresIn: 3600,
}

const stored = () => JSON.parse(localStorage.getItem('dlr-auth') ?? '{}')

describe('auth.store · qué se guarda en localStorage', () => {
  afterEach(() => {
    useAuthStore.getState().clearAuth()
    localStorage.clear()
  })

  it('guarda el usuario pero no el access token', () => {
    useAuthStore.getState().setAuth(login)

    expect(useAuthStore.getState().accessToken).toBe('token-secreto')   // en memoria sí
    expect(stored().state.user.email).toBe('admin@delosreyes.com')
    expect(JSON.stringify(stored())).not.toContain('token-secreto')
  })

  it('descarta los tokens que guardó la versión anterior', async () => {
    // Así guardaba la sesión la versión 0, con los tokens en localStorage
    localStorage.setItem('dlr-auth', JSON.stringify({
      version: 0,
      state: { user: { name: 'Admin' }, accessToken: 'viejo', refreshToken: 'viejo-refresh', isAuthenticated: true },
    }))

    await useAuthStore.persist.rehydrate()

    expect(useAuthStore.getState().user?.name).toBe('Admin')
    expect(useAuthStore.getState().accessToken).toBeNull()
    expect(JSON.stringify(stored())).not.toContain('viejo')
  })
})
