// Pruebas del manejo de la sesión en las peticiones:
//   - Regresión del PR #3: el interceptor guardaba el token del primer render y,
//     al iniciar sesión o renovar el token, las peticiones salían con el viejo.
//   - Refresh token en cookie HttpOnly: ante un 401 se renueva la sesión sin
//     enviar el token en el body (lo envía el navegador en la cookie).
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import apiClient from '@api/client/axios.client'
import { AppProviders } from '@app/providers/AppProviders'
import { useAuthStore } from '@store/auth.store'
import type { LoginResponse } from '@interfaces/api.types'

interface SentRequest { url?: string; token?: string; body?: unknown }

// Captura cada petición sin llamar a ningún servidor. `respond` permite simular
// la respuesta del backend en cada prueba.
const sent: SentRequest[] = []
let respond: (config: InternalAxiosRequestConfig) => AxiosResponse | Promise<AxiosResponse>
const ok = (config: InternalAxiosRequestConfig, data: unknown = {}): AxiosResponse =>
  ({ data, status: 200, statusText: 'OK', headers: {}, config })
const unauthorized = (config: InternalAxiosRequestConfig) =>
  Promise.reject(new AxiosError('401', 'ERR_BAD_REQUEST', config, null,
    { data: {}, status: 401, statusText: 'Unauthorized', headers: {}, config }))

beforeAll(() => {
  // jsdom no trae matchMedia, que usa el Toaster de sonner
  window.matchMedia ??= vi.fn().mockReturnValue({
    matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn(),
    addListener: vi.fn(), removeListener: vi.fn(),
  })
  apiClient.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
    sent.push({ url: config.url, token: config.headers.Authorization as string | undefined, body: config.data })
    return respond(config)
  }
})

afterEach(() => {
  sent.length = 0
  useAuthStore.getState().clearAuth()
})

const login = (accessToken: string): LoginResponse => ({
  userId: 1, name: 'Admin', email: 'admin@delosreyes.com', role: 'ADMIN',
  permissions: [], accessToken, expiresIn: 3600,
})

describe('AppProviders · token de las peticiones', () => {
  it('usa el token de un inicio de sesión hecho después de cargar la app', async () => {
    respond = config => ok(config)
    render(<AppProviders><div /></AppProviders>)   // la app carga sin sesión

    useAuthStore.getState().setAuth(login('token-del-login'))
    await apiClient.get('/categories/active')

    expect(sent.map(r => r.token)).toEqual(['Bearer token-del-login'])
  })

  it('usa el token nuevo después de renovar la sesión', async () => {
    respond = config => ok(config)
    render(<AppProviders><div /></AppProviders>)
    useAuthStore.getState().setAuth(login('token-viejo'))
    await apiClient.get('/products')

    useAuthStore.getState().updateAccessToken('token-renovado')
    await apiClient.get('/products')

    expect(sent[sent.length - 1].token).toBe('Bearer token-renovado')
  })
})

describe('AppProviders · renovación con la cookie del refresh token', () => {
  it('ante un 401 renueva la sesión sin enviar el token y repite la petición', async () => {
    respond = config => {
      if (config.url === '/auth/refresh') return ok(config, { accessToken: 'token-nuevo' })
      return config.headers.Authorization === 'Bearer token-nuevo' ? ok(config) : unauthorized(config)
    }
    render(<AppProviders><div /></AppProviders>)
    useAuthStore.getState().setAuth(login('token-vencido'))

    await apiClient.get('/products')

    const refresh = sent.find(r => r.url === '/auth/refresh')
    expect(refresh?.body).toBeUndefined()   // el refresh token va en la cookie, no en el body
    expect(sent[sent.length - 1]).toMatchObject({ url: '/products', token: 'Bearer token-nuevo' })
    expect(useAuthStore.getState().accessToken).toBe('token-nuevo')
  })

  it('si la renovación falla, cierra la sesión', async () => {
    respond = config => unauthorized(config)
    // onLogout redirige con window.location; en jsdom se evita la navegación real
    const location = { ...window.location, href: '' }
    vi.stubGlobal('location', location)
    render(<AppProviders><div /></AppProviders>)
    useAuthStore.getState().setAuth(login('token-vencido'))

    await expect(apiClient.get('/products')).rejects.toBeDefined()

    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(location.href).toBe('/login')
    vi.unstubAllGlobals()
  })
})
