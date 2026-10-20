import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AxiosError } from 'axios'
import ResetPasswordPage from '@features/auth/pages/ResetPasswordPage'
import { authApi } from '@features/auth/services/auth.api'

// No se llama al backend real: se simula la API
vi.mock('@features/auth/services/auth.api', () => ({
  authApi: { resetPassword: vi.fn() },
}))
vi.mock('sonner', () => ({ toast: { success: vi.fn() } }))

function renderAt(url: string) {
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/login" element={<p>Pantalla de login</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

async function fill(password: string, confirm: string) {
  const user = userEvent.setup()
  await user.type(screen.getByPlaceholderText('Mínimo 8 caracteres'), password)
  await user.type(screen.getByPlaceholderText('••••••••'), confirm)
  await user.click(screen.getByRole('button', { name: 'Guardar contraseña' }))
}

describe('ResetPasswordPage', () => {
  // Borra el historial de llamadas al terminar cada prueba. Se hace en afterEach:
  // limpiar el mock en beforeEach hacía que Vitest reportara como no manejado el
  // error que la prueba del enlace usado lanza a propósito.
  afterEach(() => vi.mocked(authApi.resetPassword).mockClear())

  it('sin token en el enlace muestra que no es válido', () => {
    renderAt('/reset-password')

    expect(screen.getByText('Enlace no válido')).toBeInTheDocument()
    expect(screen.getByText('Solicitar un enlace nuevo')).toBeInTheDocument()
  })

  it('exige al menos 8 caracteres y no llama a la API', async () => {
    renderAt('/reset-password?token=abc')

    await fill('corta', 'corta')

    expect(await screen.findByText('La contraseña debe tener al menos 8 caracteres')).toBeInTheDocument()
    expect(authApi.resetPassword).not.toHaveBeenCalled()
  })

  it('avisa si las dos contraseñas no coinciden', async () => {
    renderAt('/reset-password?token=abc')

    await fill('ClaveNueva123', 'ClaveNueva124')

    expect(await screen.findByText('Las contraseñas no coinciden')).toBeInTheDocument()
    expect(authApi.resetPassword).not.toHaveBeenCalled()
  })

  it('con datos válidos envía el token y la contraseña, y vuelve al login', async () => {
    vi.mocked(authApi.resetPassword).mockResolvedValue()
    renderAt('/reset-password?token=abc123')

    await fill('ClaveNueva123', 'ClaveNueva123')

    expect(authApi.resetPassword).toHaveBeenCalledWith('abc123', 'ClaveNueva123')
    expect(await screen.findByText('Pantalla de login')).toBeInTheDocument()
  })

  it('si el enlace ya fue usado muestra el error del backend', async () => {
    // Mismo tipo de error que devuelve axios cuando el backend responde 400
    const backendError = new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
      data: { message: 'Este enlace ya fue usado. Solicita uno nuevo.' },
      status: 400, statusText: 'Bad Request', headers: {}, config: {} as never,
    })
    vi.mocked(authApi.resetPassword).mockImplementation(async () => { throw backendError })
    renderAt('/reset-password?token=usado')

    await fill('ClaveNueva123', 'ClaveNueva123')

    expect(await screen.findByText('Este enlace ya fue usado. Solicita uno nuevo.')).toBeInTheDocument()
  })
})
