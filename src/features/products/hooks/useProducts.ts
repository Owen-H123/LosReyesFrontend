// features/products/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsApi } from '@features/products/services/products.api'
import type { CreateProductRequest, UpdateProductRequest } from '@interfaces/api.types'
import { toast } from 'sonner'

export const PRODUCT_KEYS = {
  all:      ['products']             as const,
  list:     (params: object) => ['products', 'list', params] as const,
  detail:   (id: number) => ['products', id] as const,
  byCode:   (code: string) => ['products', 'code', code] as const,
  lowStock: ['products', 'lowStock'] as const,
}

export function useProducts(params?: {
  search?: string; categoryId?: number; status?: string
  sortBy?: string; sortDir?: string; page?: number; size?: number
}) {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(params ?? {}),
    queryFn:  () => productsApi.getAll(params),
  })
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(id),
    queryFn:  () => productsApi.getById(id),
    enabled:  !!id,
  })
}

export function useProductByCode(code: string) {
  return useQuery({
    queryKey: PRODUCT_KEYS.byCode(code),
    queryFn:  () => productsApi.getByCode(code),
    enabled:  code.length >= 2,
    staleTime: 1000 * 30,
  })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateProductRequest) => productsApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all })
      toast.success('Producto creado correctamente')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? 'Error al crear producto')
    },
  })
}

export function useUpdateProduct(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateProductRequest) => productsApi.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all })
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(id) })
      toast.success('Producto actualizado')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? 'Error al actualizar')
    },
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => productsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all })
      toast.success('Producto eliminado')
    },
    onError: () => toast.error('Error al eliminar producto'),
  })
}

export function useUploadProductImage() {
  return useMutation({
    mutationFn: (file: File) => productsApi.uploadImage(file),
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? 'Error al subir la imagen')
    },
  })
}