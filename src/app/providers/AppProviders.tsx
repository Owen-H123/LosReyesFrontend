import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useEffect } from 'react'

import { useUIStore, ACCENT_COLORS } from '@store/ui.store'
import { useAuthStore } from '@store/auth.store'
import { setupJwtInterceptors } from '@api/interceptors/jwt.interceptor'
import { CommandPalette } from '@components/shared/CommandPalette'
import { ConfirmDialogHost } from '@components/ui/ConfirmDialog'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 10,
      retry: (failureCount, error: unknown) => {
        const status = (error as { response?: { status: number } })?.response?.status

        if (
          status === 401 ||
          status === 403 ||
          status === 404
        ) {
          return false
        }

        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, accentColor } = useUIStore()

  useEffect(() => {
    const root = document.documentElement

    root.setAttribute('data-theme', theme)

    const colors = ACCENT_COLORS[accentColor]

    root.style.setProperty('--accent', colors.primary)
    root.style.setProperty('--accent-hover', colors.text)
    root.style.setProperty('--accent-light', colors.light)
    root.style.setProperty('--accent-border', colors.border)
    root.style.setProperty('--accent-text', colors.text)
  }, [theme, accentColor])

  return <>{children}</>
}

function JwtSetup() {
  const { updateAccessToken, clearAuth } = useAuthStore()

  useEffect(() => {
    // Los tokens se leen del store en cada petición. Si se capturaran aquí,
    // el interceptor seguiría usando los del primer render aunque el usuario
    // vuelva a iniciar sesión o se renueve el token.
    setupJwtInterceptors(
      () => useAuthStore.getState().accessToken,
      (accessToken) => updateAccessToken(accessToken),
      () => {
        clearAuth()
        queryClient.clear()
        window.location.href = '/login'
      }
    )
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

export function AppProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <JwtSetup />

          {children}

          <CommandPalette />
          <ConfirmDialogHost />

          <Toaster
            position="bottom-right"
            richColors
            toastOptions={{
              style: {
                borderRadius: '10px',
                fontSize: '0.875rem',
              },
            }}
          />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}