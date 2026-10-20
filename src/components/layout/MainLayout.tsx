// components/layout/MainLayout.tsx
import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@components/layout/Sidebar'
import { Header } from '@components/layout/Header'
import { PageLoader } from '@components/shared/PageLoader'
import { ErrorBoundary } from '@components/shared/ErrorBoundary'
import { ErrorFallback } from '@components/shared/ErrorFallback'
import { useUIStore } from '@store/ui.store'
import { SIDEBAR_WIDTH } from '@constants/layout'

export function MainLayout() {
  const { sidebarCollapsed } = useUIStore()
  const expanded = !sidebarCollapsed
  const { pathname } = useLocation()

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <Sidebar />

      {/* CSS transition en vez de Framer Motion:                        */}
      {/* el navegador anima marginLeft en el compositor sin recalcular  */}
      {/* layout en cada frame de React — elimina el layout shift.       */}
      <div
        className="flex flex-col flex-1 overflow-hidden transition-[margin-left] duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ marginLeft: expanded ? SIDEBAR_WIDTH.expanded : SIDEBAR_WIDTH.collapsed }}
      >
        <Header />

        <main
          className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-7"
          style={{ background: 'var(--bg-base)' }}
        >
          {/* Suspense local: solo el contenido interno muestra el       */}
          {/* loader al cargar un chunk — sidebar y header permanecen    */}
          {/* montados y estáticos. Sin AnimatePresence: un fade CSS     */}
          {/* simple en el contenedor de página evita el parpadeo de     */}
          {/* exit/enter simultáneo.                                     */}
          {/* Si la pantalla falla, solo esta zona muestra el error: el menú   */}
          {/* y la cabecera siguen funcionando. Al cambiar de ruta se limpia.  */}
          <ErrorBoundary
            resetKey={pathname}
            fallback={(error, reset) => <ErrorFallback error={error} reset={reset} />}
          >
            <Suspense fallback={<PageLoader />}>
              <div key={undefined} className="h-full animate-fadeIn">
                <Outlet />
              </div>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}