// api/endpoints/index.ts
// Central registry of all API endpoints — matches Spring Boot controllers exactly

export const API = {
  // Auth 
  auth: {
    login:          '/auth/login',
    refresh:        '/auth/refresh',
    logout:         '/auth/logout',
    changePassword: '/auth/change-password',
    forgotPassword: '/auth/forgot-password',
    resetPassword:  '/auth/reset-password',
    updateProfile:  '/auth/profile',
    uploadAvatar:   '/auth/profile/avatar',
  },

  // Dashboard
  dashboard: {
    full:            '/dashboard',
    summary:         '/dashboard/summary',
    topProducts:     '/dashboard/top-products',
    lowStock:        '/dashboard/low-stock',
    recentSales:     '/dashboard/recent-sales',
    dailyRevenue:    '/dashboard/daily-revenue',
    recentMovements: '/dashboard/recent-movements',
    workerActivity:  '/dashboard/worker-activity',
  },

  //Products 
  products: {
    list:         '/products',
    byId:         (id: number) => `/products/${id}`,
    byCode:       (code: string) => `/products/code/${code}`,
    lowStock:     '/products/low-stock',
    byVehicle:    (vehicleId: number) => `/products/vehicle/${vehicleId}`,
    uploadImage:  '/products/upload-image',
  },

  //Categories
  categories: {
    list:   '/categories',
    active: '/categories/active',
    byId:   (id: number) => `/categories/${id}`,
  },

  //Vehicles
  vehicles: {
    list:      '/vehicles',
    search:    '/vehicles/search',
    brands:    '/vehicles/brands',
    models:    (brand: string) => `/vehicles/brands/${brand}/models`,
    byBrand:   (brand: string) => `/vehicles/brand/${brand}`,
    byProduct: (productId: number) => `/vehicles/product/${productId}`,
    byId:      (id: number) => `/vehicles/${id}`,
  },

  // Inventory
  inventory: {
    entry:          '/inventory/entry',
    exit:           '/inventory/exit',
    adjustment:     '/inventory/adjustment',
    movements:      '/inventory/movements',
    byProduct:      (productId: number) => `/inventory/movements/product/${productId}`,
    recent:         '/inventory/movements/recent',
    byDateRange:    '/inventory/movements/date-range',
  },

  // Sales
  sales: {
    list:      '/sales',
    byId:      (id: number) => `/sales/${id}`,
    byNumber:  (number: string) => `/sales/number/${number}`,
    recent:    '/sales/recent',
    cancel:    (id: number) => `/sales/${id}/cancel`,
    update:    (id: number) => `/sales/${id}`,
  },

  // Customers
  customers: {
    list:       '/customers',
    byId:       (id: number) => `/customers/${id}`,
    byDocument: (doc: string) => `/customers/document/${doc}`,
  },

  // Users
  users: {
    list:         '/users',
    byId:         (id: number) => `/users/${id}`,
    changeStatus: (id: number) => `/users/${id}/status`,
    permissions:  (id: number) => `/users/${id}/permissions`,
  },

  //Roles
  roles: {
    list: '/roles',
  },

  //Reports
  reports: {
    dailySales:         '/reports/sales/daily',
    dailySalesExcel:    '/reports/sales/daily/excel',
    dailySalesPdf:      '/reports/sales/daily/pdf',
    topProducts:        '/reports/sales/top-products',
    lowStock:           '/reports/inventory/low-stock',
    lowStockExcel:      '/reports/inventory/low-stock/excel',
  },

  // Audit
  audit: {
    list:        '/audit',
    byUser:      (userId: number) => `/audit/user/${userId}`,
    byModule:    (module: string) => `/audit/module/${module}`,
    byDateRange: '/audit/date-range',
  },

  // Receipts
  receipts: {
    pdf:   (saleId: number) => `/receipts/${saleId}/pdf`,
    email: (saleId: number) => `/receipts/${saleId}/email`,
  },
} as const