// features/categories/hooks/useCategories.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriesApi } from '@features/categories/services/categories.api'
import { toast } from 'sonner'

export const CATEGORY_KEYS = {
  all:    ['categories']          as const,
  active: ['categories', 'active'] as const,
  detail: (id: number) => ['categories', id] as const,
}

export function useCategories() {
  return useQuery({ queryKey: CATEGORY_KEYS.all, queryFn: categoriesApi.getAll })
}

export function useCategoriesActive() {
  return useQuery({ queryKey: CATEGORY_KEYS.active, queryFn: categoriesApi.getActive, staleTime: 1000 * 60 * 5 })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { name: string; description?: string }) => categoriesApi.create(body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CATEGORY_KEYS.all }); toast.success('Categoría creada') },
    onError: (e: { response?: { data?: { message?: string } } }) => toast.error(e?.response?.data?.message ?? 'Error'),
  })
}

export function useUpdateCategory(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { name: string; description?: string; active: boolean }) => categoriesApi.update(id, body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CATEGORY_KEYS.all }); toast.success('Categoría actualizada') },
    onError: () => toast.error('Error al actualizar'),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => categoriesApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CATEGORY_KEYS.all }); toast.success('Categoría eliminada') },
    onError: () => toast.error('Error al eliminar'),
  })
}