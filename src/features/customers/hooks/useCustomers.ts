// features/customers/hooks/useCustomers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customersApi } from '@features/customers/services/customers.api'
import { salesApi } from '@features/sales/services/sales.api'
import type { PaginationParams } from '@interfaces/api.types'

const KEYS = {
  all:     ['customers'] as const,
  list:    (p: PaginationParams) => ['customers', 'list', p] as const,
  detail:  (id: number)          => ['customers', id] as const,
  sales:   (id: number)          => ['customers', id, 'sales'] as const,
}

export function useCustomers(params: PaginationParams = {}) {
  return useQuery({
    queryKey: KEYS.list(params),
    queryFn:  () => customersApi.getAll(params),
  })
}

export function useCustomerById(id: number) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn:  () => customersApi.getById(id),
    enabled:  !!id,
  })
}

export function useCustomerSales(customerId: number) {
  return useQuery({
    queryKey: KEYS.sales(customerId),
    queryFn:  async () => {
      const data = await salesApi.getAll({ size: 50 })
      return data.content.filter(s => s.customerId === customerId)
    },
    enabled: !!customerId,
  })
}

export function useCreateCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: customersApi.create,
    onSuccess:  () => qc.invalidateQueries({ queryKey: KEYS.all }),
  })
}

export function useUpdateCustomer(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: object) => customersApi.update(id, body),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: KEYS.all })
      qc.invalidateQueries({ queryKey: KEYS.detail(id) })
    },
  })
}

export function useDeactivateCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: customersApi.deactivate,
    onSuccess:  () => qc.invalidateQueries({ queryKey: KEYS.all }),
  })
}