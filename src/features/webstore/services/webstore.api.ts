// features/webstore/services/webstore.api.ts
// Gestión de la tienda online (backend: modules/weborders y modules/webstore).
import apiClient from '@api/client/axios.client'
import type { ApiResponse, PagedResponse } from '@interfaces/api.types'

export type WebOrderStatus = 'NEW' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
export type WebDelivery = 'SHIPPING' | 'PICKUP'
export type WebPaymentStatus = 'UNPAID' | 'SUBMITTED' | 'PAID' | 'REJECTED'

export interface WebOrder {
  id: number
  orderNumber: string
  customerName: string
  phone: string
  delivery: WebDelivery
  address: string | null
  district: string | null
  car: string | null
  paymentMethod: string
  total: number
  status: WebOrderStatus
  items: { productId: number; productCode: string; productName: string; unitPrice: number; quantity: number }[]
  createdAt: string
  paymentStatus: WebPaymentStatus
  paymentOperationCode: string | null
  paymentSubmittedAt: string | null
}

export interface WebstoreSummary {
  newCount: number
  confirmedCount: number
  shippedCount: number
  monthCount: number
  monthTotal: number
  publishedProducts: number
  deliveriesPending: number
  paymentsToVerify: number
}

export interface WebOrderFilters {
  status?: WebOrderStatus[]
  delivery?: WebDelivery
  paymentStatus?: WebPaymentStatus
  search?: string
  from?: string
  to?: string
  page?: number
  size?: number
}

export interface WebCustomer {
  phone: string
  name: string
  orders: number
  totalSpent: number
  lastOrderAt: string
}

export interface WebTopProduct {
  code: string
  name: string
  units: number
  amount: number
}

export interface CatalogItem {
  id: number
  code: string
  name: string
  brand: string | null
  categoryName: string | null
  price: number
  stock: number
  imageUrl: string | null
  published: boolean
  featured: boolean
}

export interface StoreSettings {
  whatsapp: string | null
  announcement: string | null
  paymentMethods: string[]
  pickupAddress: string | null
  businessHours: string | null
  shippingNote: string | null
  yapeNumber: string | null
  yapeHolder: string | null
  yapeQrUrl: string | null
}

export const webstoreApi = {
  getSummary: async () => {
    const { data } = await apiClient.get<ApiResponse<WebstoreSummary>>('/web-orders/summary')
    return data.data
  },
  getOrders: async (filters: WebOrderFilters) => {
    // status se manda repetido (?status=A&status=B); sin esto axios lo envía como status[]=A
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v === undefined || v === '') return
      if (Array.isArray(v)) v.forEach(x => params.append(k, x))
      else params.set(k, String(v))
    })
    const { data } = await apiClient.get<ApiResponse<PagedResponse<WebOrder>>>('/web-orders', { params })
    return data.data
  },
  updateStatus: async (id: number, status: WebOrderStatus) => {
    const { data } = await apiClient.patch<ApiResponse<WebOrder>>(`/web-orders/${id}/status`, { status })
    return data.data
  },
  verifyPayment: async (id: number, status: 'PAID' | 'REJECTED') => {
    const { data } = await apiClient.patch<ApiResponse<WebOrder>>(`/web-orders/${id}/payment`, { status })
    return data.data
  },
  getCustomers: async () => {
    const { data } = await apiClient.get<ApiResponse<WebCustomer[]>>('/web-orders/customers')
    return data.data
  },
  getTopProducts: async () => {
    const { data } = await apiClient.get<ApiResponse<WebTopProduct[]>>('/web-orders/top-products')
    return data.data
  },
  getCatalog: async (params: { search?: string; published?: boolean; featured?: boolean; page?: number; size?: number }) => {
    const { data } = await apiClient.get<ApiResponse<PagedResponse<CatalogItem>>>('/web-catalog', { params })
    return data.data
  },
  updateCatalogItem: async (id: number, body: { published?: boolean; featured?: boolean }) => {
    const { data } = await apiClient.patch<ApiResponse<CatalogItem>>(`/web-catalog/${id}`, body)
    return data.data
  },
  getSettings: async () => {
    const { data } = await apiClient.get<ApiResponse<StoreSettings>>('/store-settings')
    return data.data
  },
  saveSettings: async (body: StoreSettings) => {
    const { data } = await apiClient.put<ApiResponse<StoreSettings>>('/store-settings', body)
    return data.data
  },
}
