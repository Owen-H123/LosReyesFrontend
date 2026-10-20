// components/layout/AuthLayout.tsx
import { Suspense } from 'react'
import { PageLoader } from '@components/shared/PageLoader'
import { PageShell } from '@components/layout/PageShell'

// Layout de pantalla completa para login, 403 y 404.
// Aquí SÍ se puede mostrar un loader a pantalla completa porque no hay
// un layout persistente (sidebar/header) que preservar.
export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <PageShell>{children}</PageShell>
    </Suspense>
  )
}
