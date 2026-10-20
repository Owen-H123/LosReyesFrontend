// app/router/routes.ts
// Única fuente de verdad de las rutas de la app.
export const ROUTES = {
  login: '/login',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  forbidden: '/403',
  notFound: '/404',

  dashboard: '/dashboard',

  products: '/products',
  productNew: '/products/new',
  product: (id: string | number) => `/products/${id}`,

  categories: '/categories',
  vehicles: '/vehicles',
  inventory: '/inventory',

  sales: '/sales',
  saleNew: '/sales/new',

  customers: '/customers',
  customer: (id: string | number) => `/customers/${id}`,

  // Tienda online: un módulo por área (rutas montadas en features/webstore/WebstoreRoutes.tsx)
  webstore: {
    root: '/webstore',
    orders: '/webstore/orders',
    deliveries: '/webstore/deliveries',
    catalog: '/webstore/catalog',
    customers: '/webstore/customers',
    settings: '/webstore/settings',
  },

  users: '/users',
  reports: '/reports',
  audit: '/audit',
  settings: '/settings',
} as const
