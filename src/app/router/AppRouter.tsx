import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { lazy } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ProtectedRoute } from '@features/auth/components/ProtectedRoute'
import { MainLayout } from '@components/layout/MainLayout'
import { AuthLayout } from '@components/layout/AuthLayout'
import { PageShell } from '@components/layout/PageShell'
import { ROUTES } from './routes'

const LoginPage      = lazy(() => import('@features/auth/pages/LoginPage'))
const ForgotPasswordPage = lazy(() => import('@features/auth/pages/ForgotPasswordPage'))
const ResetPasswordPage  = lazy(() => import('@features/auth/pages/ResetPasswordPage'))
const DashboardPage  = lazy(() => import('@features/dashboard/pages/DashboardPage'))
const ProductsPage   = lazy(() => import('@features/products/pages/ProductsPage'))
const ProductDetail  = lazy(() => import('@features/products/pages/ProductDetailPage'))
const CategoriesPage = lazy(() => import('@features/categories/pages/CategoriesPage'))
const InventoryPage  = lazy(() => import('@features/inventory/pages/InventoryPage'))
const SalesPage      = lazy(() => import('@features/sales/pages/SalesPage'))
const NewSalePage    = lazy(() => import('@features/sales/pages/NewSalePage'))
const CustomersPage  = lazy(() => import('@features/customers/pages/CustomersPage'))
const CustomerDetail = lazy(() => import('@features/customers/pages/CustomerDetailPage'))
const VehiclesPage   = lazy(() => import('@features/vehicles/pages/VehiclesPage'))
const UsersPage      = lazy(() => import('@features/users/pages/UsersPage'))
const ReportsPage    = lazy(() => import('@features/reports/pages/ReportsPage'))
const AuditPage      = lazy(() => import('@features/audit/pages/AuditPage'))
const SettingsPage   = lazy(() => import('@features/settings/pages/SettingsPage'))
const WebstoreRoutes = lazy(() => import('@features/webstore/WebstoreRoutes'))
const NotFoundPage  = lazy(() => import('@features/auth/pages/NotFoundPage'))
const ForbiddenPage  = lazy(() => import('@features/auth/pages/ForbiddenPage'))

export function AppRouter() {
  const location = useLocation()

  const layoutKey = location.pathname.startsWith(ROUTES.login)          ? 'auth'
                  : location.pathname.startsWith(ROUTES.forgotPassword) ? 'auth'
                  : location.pathname.startsWith(ROUTES.resetPassword)  ? 'auth'
                  : location.pathname.startsWith(ROUTES.forbidden) ? '403'
                  : location.pathname.startsWith(ROUTES.notFound)  ? '404'
                  : 'app'

  return (
    <AnimatePresence mode="wait">
      {/* Layout "auth" (login, 403, 404): AuthLayout trae su propio Suspense.  */}
      {/* Layout "app": MainLayout resuelve su propio Suspense alrededor del    */}
      {/* Outlet — así el sidebar nunca desaparece al cargar un chunk lazy.    */}
      <Routes location={location} key={layoutKey}>

        <Route path={ROUTES.login}     element={<AuthLayout><LoginPage /></AuthLayout>} />
        <Route path={ROUTES.forgotPassword} element={<AuthLayout><ForgotPasswordPage /></AuthLayout>} />
        <Route path={ROUTES.resetPassword}  element={<AuthLayout><ResetPasswordPage /></AuthLayout>} />
        <Route path={ROUTES.forbidden} element={<AuthLayout><ForbiddenPage /></AuthLayout>} />
        <Route path={ROUTES.notFound}  element={<AuthLayout><NotFoundPage /></AuthLayout>} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PageShell>
                <MainLayout />
              </PageShell>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to={ROUTES.dashboard} replace />} />
          <Route path="dashboard"     element={<DashboardPage />} />
          <Route path="products"      element={<ProductsPage />} />
          <Route path="products/new"  element={<ProductDetail />} />
          <Route path="products/:id"  element={<ProductDetail />} />
          <Route path="categories"    element={<CategoriesPage />} />
          <Route path="vehicles"      element={<VehiclesPage />} />
          <Route path="inventory"     element={<InventoryPage />} />
          <Route path="sales"         element={<SalesPage />} />
          <Route path="sales/new"     element={<NewSalePage />} />
          <Route path="customers"     element={<CustomersPage />} />
          <Route path="customers/:id" element={<CustomerDetail />} />
          <Route path="webstore/*"          element={<WebstoreRoutes />} />
          {/* Gestión de usuarios nunca se delega: solo ADMIN (ver PermissionCode.java) */}
          <Route path="users"    element={<ProtectedRoute requiredRole="ADMIN"><UsersPage /></ProtectedRoute>} />
          {/* Reportes y Auditoría sí son delegables: ADMIN siempre pasa,        */}
          {/* WORKER pasa si tiene el permiso asignado (usePermission -> has()). */}
          <Route path="reports"  element={<ProtectedRoute requiredPermission="VIEW_REPORTS"><ReportsPage /></ProtectedRoute>} />
          <Route path="audit"    element={<ProtectedRoute requiredPermission="VIEW_AUDIT"><AuditPage /></ProtectedRoute>} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.notFound} replace />} />

      </Routes>
    </AnimatePresence>
  )
}
