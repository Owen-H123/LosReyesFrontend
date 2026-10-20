import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ForgotPasswordPage from '@features/auth/pages/ForgotPasswordPage'
import { authApi } from '@features/auth/services/auth.api'

vi.mock('@features/auth/services/auth.api', () => ({
  authApi: { forgotPassword: vi.fn().mockResolvedValue(undefined) },
}))

describe('ForgotPasswordPage', () => {
  it('envía el email y muestra el mismo mensaje exista o no la cuenta', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><ForgotPasswordPage /></MemoryRouter>)

    await user.type(screen.getByPlaceholderText('tu@correo.com'), 'cajero@delosreyes.com')
    await user.click(screen.getByRole('button', { name: 'Enviar enlace' }))

    expect(authApi.forgotPassword).toHaveBeenCalledWith('cajero@delosreyes.com')
    expect(await screen.findByText('Revisa tu correo')).toBeInTheDocument()
    expect(screen.getByText(/está registrado, recibirás un enlace/)).toBeInTheDocument()
  })

  it('no envía un email con formato inválido', async () => {
    const user = userEvent.setup()
    vi.mocked(authApi.forgotPassword).mockClear()
    render(<MemoryRouter><ForgotPasswordPage /></MemoryRouter>)

    await user.type(screen.getByPlaceholderText('tu@correo.com'), 'no-es-un-correo')
    await user.click(screen.getByRole('button', { name: 'Enviar enlace' }))

    expect(authApi.forgotPassword).not.toHaveBeenCalled()
  })
})
