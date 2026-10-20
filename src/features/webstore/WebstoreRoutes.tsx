// features/webstore/WebstoreRoutes.tsx
// Rutas del grupo "Tienda online". AppRouter lo monta en /webstore/*, así que aquí son relativas.
// Los paths públicos (para menú y enlaces) están en ROUTES.webstore.
import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from '@app/router/routes'

const OverviewPage   = lazy(() => import('@features/webstore/pages/WebstorePage'))
const OrdersPage     = lazy(() => import('@features/webstore/pages/WebOrdersPage'))
const DeliveriesPage = lazy(() => import('@features/webstore/pages/WebDeliveriesPage'))
const CatalogPage    = lazy(() => import('@features/webstore/pages/WebCatalogPage'))
const CustomersPage  = lazy(() => import('@features/webstore/pages/WebCustomersPage'))
const SettingsPage   = lazy(() => import('@features/webstore/pages/WebSettingsPage'))

export default function WebstoreRoutes() {
  return (
    <Routes>
      <Route index element={<OverviewPage />} />
      <Route path="orders"     element={<OrdersPage />} />
      <Route path="deliveries" element={<DeliveriesPage />} />
      <Route path="catalog"    element={<CatalogPage />} />
      <Route path="customers"  element={<CustomersPage />} />
      <Route path="settings"   element={<SettingsPage />} />
      <Route path="*" element={<Navigate to={ROUTES.webstore.root} replace />} />
    </Routes>
  )
}
