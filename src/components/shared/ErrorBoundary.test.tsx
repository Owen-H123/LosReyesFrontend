import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBoundary } from '@components/shared/ErrorBoundary'
import { ErrorFallback } from '@components/shared/ErrorFallback'

// Componente que falla mientras `shouldFail.current` sea true
const shouldFail = { current: true }
function FailingScreen({ message = 'Cannot read properties of undefined' }: { message?: string }) {
  if (shouldFail.current) throw new Error(message)
  return <p>Pantalla funcionando</p>
}

function renderWithBoundary(resetKey = '/dashboard', message?: string) {
  return render(
    <ErrorBoundary resetKey={resetKey} fallback={(error, reset) => <ErrorFallback error={error} reset={reset} />}>
      <FailingScreen message={message} />
    </ErrorBoundary>,
  )
}

describe('ErrorBoundary', () => {
  // React escribe en consola cada error atrapado; se silencia para no ensuciar la salida
  beforeEach(() => {
    shouldFail.current = true
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => vi.restoreAllMocks())

  it('si la pantalla falla muestra el mensaje de error en vez de quedar en blanco', () => {
    renderWithBoundary()

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Algo salió mal en esta pantalla')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Volver a intentar/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Ir al inicio/ })).toBeInTheDocument()
  })

  it('"Volver a intentar" vuelve a mostrar la pantalla si el problema se resolvió', async () => {
    renderWithBoundary()

    shouldFail.current = false
    await userEvent.click(screen.getByRole('button', { name: /Volver a intentar/ }))

    expect(screen.getByText('Pantalla funcionando')).toBeInTheDocument()
  })

  it('al navegar a otra ruta el error se limpia solo', () => {
    const { rerender } = renderWithBoundary('/dashboard')
    expect(screen.getByRole('alert')).toBeInTheDocument()

    shouldFail.current = false
    rerender(
      <ErrorBoundary resetKey="/products" fallback={(error, reset) => <ErrorFallback error={error} reset={reset} />}>
        <FailingScreen />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Pantalla funcionando')).toBeInTheDocument()
  })

  it('si falló la carga de una pantalla por una versión nueva, pide recargar', () => {
    renderWithBoundary('/dashboard', 'Failed to fetch dynamically imported module: /assets/DashboardPage-abc123.js')

    expect(screen.getByText('Hay una versión nueva del sistema')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Recargar página/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Volver a intentar/ })).not.toBeInTheDocument()
  })

  it('registra el error en la consola para poder diagnosticarlo', () => {
    renderWithBoundary()

    expect(console.error).toHaveBeenCalledWith('Error en la interfaz:', expect.any(Error), expect.anything())
  })
})
