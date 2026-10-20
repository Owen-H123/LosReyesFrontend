// interfaces/api.types.ts
// Global API contract types matching Spring Boot ApiResponse<T>

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors: string[]
  timestamp: string
}

export interface PagedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export interface PaginationParams {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
  search?: string
}

// Auth
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  userId: number
  name: string
  email: string
  role: 'ADMIN' | 'WORKER'
  avatarUrl?: string | null
  permissions: string[]
  accessToken: string
  expiresIn: number
}

export interface UpdateProfileRequest {
  name: string
  email: string
}

// User
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE'
export type UserRole = 'ADMIN' | 'WORKER'

export type PermissionCode =
  | 'VIEW_AUDIT'
  | 'VIEW_REPORTS'
  | 'ADJUST_INVENTORY'
  | 'DELETE_PRODUCTS'
  | 'CANCEL_SALES'
  | 'MANAGE_CATEGORIES'
  | 'EDIT_SALES'

export interface UserPermissionItem {
  code: PermissionCode
  label: string
  granted: boolean
}

export interface User {
  id: number
  name: string
  email: string
  role: string
  roleId: number
  avatarUrl?: string | null
  status: UserStatus
  lastLogin: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  roleId: number
}

export interface UpdateUserRequest {
  name: string
  email: string
  roleId: number
  status: UserStatus
}

// Role
export interface Role {
  id: number
  name: string
  description: string
}

// Category
export interface Category {
  id: number
  name: string
  description: string
  active: boolean
  createdAt: string
}

// Vehicle
export interface Vehicle {
  id: number
  brand: string
  model: string
  year: number
  engine: string
  displayName: string
}

// Product
export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED'

export interface Product {
  id: number
  code: string
  name: string
  description: string
  brand: string
  categoryId: number
  categoryName: string
  costPrice: number
  salePrice: number
  profitMargin: number
  stock: number
  minimumStock: number
  lowStock: boolean
  imageUrl: string | null
  status: ProductStatus
  vehicles: Vehicle[]
  createdAt: string
  updatedAt: string
}

export interface CreateProductRequest {
  code: string
  name: string
  description?: string
  brand?: string
  categoryId: number
  costPrice: number
  salePrice: number
  stock: number
  minimumStock?: number
  imageUrl?: string
  vehicleIds?: number[]
}

export interface UpdateProductRequest {
  name: string
  description?: string
  brand?: string
  categoryId: number
  costPrice: number
  salePrice: number
  minimumStock?: number
  imageUrl?: string
  status: ProductStatus
  vehicleIds?: number[]
}

// Customer
export type DocumentType = 'DNI' | 'RUC' | 'CE' | 'PASSPORT'

export interface Customer {
  id: number
  documentType: DocumentType
  documentNumber: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  active: boolean
  createdAt: string
}

// Sale
export type SaleStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'
export type PaymentMethod = 'CASH' | 'CARD' | 'TRANSFER' | 'CREDIT'

export interface SaleItem {
  id: number
  productId: number
  productCode: string
  productName: string
  quantity: number
  unitPrice: number
  discount: number
  subtotal: number
}

export interface Sale {
  id: number
  saleNumber: string
  customerId: number | null
  customerName: string | null
  userId: number
  userName: string
  status: SaleStatus
  subtotal: number
  discount: number
  tax: number
  total: number
  paymentMethod: PaymentMethod
  notes: string | null
  items: SaleItem[]
  saleDate: string
  createdAt: string
}

export interface SaleItemRequest {
  productId: number
  quantity: number
  discount?: number
}

export interface CreateSaleRequest {
  customerId?: number
  paymentMethod: PaymentMethod
  items: SaleItemRequest[]
  globalDiscount?: number
  notes?: string
}

// Inventory Movement
export type MovementType = 'ENTRY' | 'EXIT' | 'SALE' | 'ADJUSTMENT'

export interface InventoryMovement {
  id: number
  productId: number
  productCode: string
  productName: string
  userId: number
  userName: string
  saleId: number | null
  type: MovementType
  quantity: number
  stockBefore: number
  stockAfter: number
  unitCost: number | null
  observation: string | null
  createdAt: string
}

// Dashboard
export interface DashboardSummary {
  todayRevenue: number
  weekRevenue: number
  monthRevenue: number
  todaySalesCount: number
  weekSalesCount: number
  monthSalesCount: number
  lowStockCount: number
  activeProductsCount: number
}

export interface TopProduct {
  productId: number
  code: string
  name: string
  imageUrl: string | null
  totalQuantity: number
  totalRevenue: number
}

export interface WorkerActivity {
  userId: number
  userName: string
  userAvatarUrl: string | null
  salesCount: number
  totalRevenue: number
}

export interface DashboardData {
  summary: DashboardSummary
  topProducts: TopProduct[]
  workerActivity: WorkerActivity[]
}

// Audit
export interface AuditLog {
  id: number
  userId: number | null
  userEmail: string
  module: string
  action: string
  entityId: string | null
  description: string
  metadata: string | null
  ipAddress: string | null
  createdAt: string
}

// Reports
export interface DailySalesRow {
  day: string
  count: number
  revenue: number
  netRevenue: number
}

export interface DailySalesReport {
  from: string
  to: string
  totalRevenue: number
  totalSales: number
  rows: DailySalesRow[]
}

export interface TopProductRow {
  productId: number
  code: string
  name: string
  totalQty: number
  totalRevenue: number
}

export interface LowStockRow {
  productId: number
  code: string
  name: string
  category: string
  currentStock: number
  minimumStock: number
  shortage: number
}