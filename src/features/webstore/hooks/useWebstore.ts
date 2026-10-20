// features/webstore/hooks/useWebstore.ts
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiErrorMessage } from '@features/webstore/utils/errors'
import {
  webstoreApi,
  type WebOrderFilters, type WebOrderStatus, type StoreSettings,
} from '@features/webstore/services/webstore.api'

export const WEBSTORE_KEYS = {
  summary:  ['webstore', 'summary'] as const,
  orders:   (filters: object) => ['webstore', 'orders', filters] as const,
  customers: ['webstore', 'customers'] as const,
  top:      ['webstore', 'top'] as const,
  catalog:  (params: object) => ['webstore', 'catalog', params] as const,
  settings: ['webstore', 'settings'] as const,
}

// Se refresca solo cada minuto: así el contador del menú avisa de pedidos nuevos
export function useWebstoreSummary() {
  return useQuery({
    queryKey: WEBSTORE_KEYS.summary,
    queryFn:  webstoreApi.getSummary,
    refetchInterval: 60_000,
  })
}

export function useWebOrders(filters: WebOrderFilters) {
  return useQuery({
    queryKey: WEBSTORE_KEYS.orders(filters),
    queryFn:  () => webstoreApi.getOrders(filters),
    placeholderData: keepPreviousData,
  })
}

export function useUpdateWebOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: WebOrderStatus }) => webstoreApi.updateStatus(id, status),
    onSuccess: (o) => {
      qc.invalidateQueries({ queryKey: ['webstore'] })
      toast.success(`Pedido ${o.orderNumber} actualizado`)
    },
    onError: () => toast.error('No se pudo actualizar el pedido'),
  })
}

export function useVerifyWebPayment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'PAID' | 'REJECTED' }) => webstoreApi.verifyPayment(id, status),
    onSuccess: (o) => {
      qc.invalidateQueries({ queryKey: ['webstore'] })
      toast.success(o.paymentStatus === 'PAID' ? `Pago de ${o.orderNumber} confirmado` : `Pago de ${o.orderNumber} rechazado`)
    },
    onError: (e) => toast.error(apiErrorMessage(e, 'No se pudo actualizar el pago')),
  })
}

export function useWebCustomers() {
  return useQuery({ queryKey: WEBSTORE_KEYS.customers, queryFn: webstoreApi.getCustomers })
}

export function useWebTopProducts() {
  return useQuery({ queryKey: WEBSTORE_KEYS.top, queryFn: webstoreApi.getTopProducts })
}

export function useWebCatalog(params: { search?: string; published?: boolean; featured?: boolean; page?: number; size?: number }) {
  return useQuery({
    queryKey: WEBSTORE_KEYS.catalog(params),
    queryFn:  () => webstoreApi.getCatalog(params),
    placeholderData: keepPreviousData,
  })
}

export function useUpdateCatalogItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: { id: number; published?: boolean; featured?: boolean }) => webstoreApi.updateCatalogItem(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['webstore', 'catalog'] })
      qc.invalidateQueries({ queryKey: WEBSTORE_KEYS.summary })
    },
    onError: () => toast.error('No se pudo actualizar el producto'),
  })
}

export function useStoreSettings() {
  return useQuery({ queryKey: WEBSTORE_KEYS.settings, queryFn: webstoreApi.getSettings })
}

export function useSaveStoreSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: StoreSettings) => webstoreApi.saveSettings(body),
    onSuccess: (data) => {
      qc.setQueryData(WEBSTORE_KEYS.settings, data)
      toast.success('Ajustes guardados. La tienda ya los usa.')
    },
    onError: (e) => toast.error(apiErrorMessage(e, 'No se pudieron guardar los ajustes')),
  })
}
