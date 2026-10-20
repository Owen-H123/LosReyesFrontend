// features/inventory/hooks/useInventory.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryApi } from '@features/inventory/services/inventory.api'
import { PRODUCT_KEYS } from '@features/products/hooks/useProducts'
import { DASHBOARD_KEYS } from '@features/dashboard/hooks/useDashboard'
import { toast } from 'sonner'

export const INVENTORY_KEYS = {
  movements:  (params: object) => ['inventory', 'movements', params] as const,
  byProduct:  (id: number, page: number) => ['inventory', 'product', id, page] as const,
  recent:     (limit: number) => ['inventory', 'recent', limit] as const,
}

export function useMovements(params?: { type?: string; page?: number; size?: number }) {
  return useQuery({
    queryKey: INVENTORY_KEYS.movements(params ?? {}),
    queryFn:  () => inventoryApi.getMovements(params),
  })
}

export function useRecentMovements(limit = 10) {
  return useQuery({
    queryKey: INVENTORY_KEYS.recent(limit),
    queryFn:  () => inventoryApi.getRecent(limit),
  })
}

// Invalida TODO lo que depende del stock: la lista de productos, el
// contador del resumen (summary.lowStockCount, usado en la campana y el
// sidebar) Y la lista detallada de productos bajo mínimo (el widget
// "Alertas de stock" del dashboard) — antes solo se invalidaba el contador,
// así que esa lista se quedaba con datos viejos aunque el número cambiara.
function invalidateStockRelatedQueries(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all })
  qc.invalidateQueries({ queryKey: DASHBOARD_KEYS.summary })
  qc.invalidateQueries({ queryKey: DASHBOARD_KEYS.lowStock })
}

export function useRegisterEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: inventoryApi.registerEntry,
    onSuccess: () => {
      invalidateStockRelatedQueries(qc)
      toast.success('Entrada registrada correctamente')
    },
    onError: (e: { response?: { data?: { message?: string } } }) =>
      toast.error(e?.response?.data?.message ?? 'Error al registrar entrada'),
  })
}

export function useRegisterExit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: inventoryApi.registerExit,
    onSuccess: () => {
      invalidateStockRelatedQueries(qc)
      toast.success('Salida registrada correctamente')
    },
    onError: (e: { response?: { data?: { message?: string } } }) =>
      toast.error(e?.response?.data?.message ?? 'Error al registrar salida'),
  })
}

export function useRegisterAdjustment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, newStock, observation }: { productId: number; newStock: number; observation?: string }) =>
      inventoryApi.registerAdjustment(productId, newStock, observation),
    onSuccess: () => {
      invalidateStockRelatedQueries(qc)
      toast.success('Ajuste registrado')
    },
    onError: (e: { response?: { data?: { message?: string } } }) =>
      toast.error(e?.response?.data?.message ?? 'Error al ajustar stock'),
  })
}