// features/sales/hooks/useSales.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { salesApi, type UpdateSaleRequest } from '@features/sales/services/sales.api'
import { DASHBOARD_KEYS } from '@features/dashboard/hooks/useDashboard'
import { PRODUCT_KEYS } from '@features/products/hooks/useProducts'
import type { CreateSaleRequest } from '@interfaces/api.types'
import { toast } from 'sonner'

export const SALE_KEYS = {
  all:    ['sales']                             as const,
  list:   (params: object) => ['sales', 'list', params] as const,
  detail: (id: number) => ['sales', id]         as const,
  recent: (limit: number) => ['sales', 'recent', limit] as const,
}

export function useSales(params?: { status?: string; customerId?: number; page?: number; size?: number }) {
  return useQuery({
    queryKey: SALE_KEYS.list(params ?? {}),
    queryFn:  () => salesApi.getAll(params),
  })
}

export function useSale(id: number) {
  return useQuery({
    queryKey: SALE_KEYS.detail(id),
    queryFn:  () => salesApi.getById(id),
    enabled:  !!id,
  })
}

export function useRecentSales(limit = 10) {
  return useQuery({
    queryKey: SALE_KEYS.recent(limit),
    queryFn:  () => salesApi.getRecent(limit),
  })
}

export function useCreateSale() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateSaleRequest) => salesApi.create(body),
    onSuccess: (sale) => {
      qc.invalidateQueries({ queryKey: SALE_KEYS.all })
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all })
      qc.invalidateQueries({ queryKey: DASHBOARD_KEYS.summary })
      toast.success(`Venta ${sale.saleNumber} registrada — Total: S/ ${sale.total}`)
    },
    onError: (e: { response?: { data?: { message?: string } } }) =>
      toast.error(e?.response?.data?.message ?? 'Error al registrar venta'),
  })
}

export function useUpdateSale() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateSaleRequest }) => salesApi.update(id, body),
    onSuccess: (sale) => {
      qc.invalidateQueries({ queryKey: SALE_KEYS.all })
      toast.success(`Venta ${sale.saleNumber} actualizada`)
    },
    onError: (e: { response?: { data?: { message?: string } } }) =>
      toast.error(e?.response?.data?.message ?? 'Error al editar venta'),
  })
}

export function useCancelSale() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => salesApi.cancel(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SALE_KEYS.all })
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all })
      qc.invalidateQueries({ queryKey: DASHBOARD_KEYS.summary })
      toast.success('Venta cancelada y stock revertido')
    },
    onError: (e: { response?: { data?: { message?: string } } }) =>
      toast.error(e?.response?.data?.message ?? 'Error al cancelar venta'),
  })
}