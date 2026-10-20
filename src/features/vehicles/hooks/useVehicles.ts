// features/vehicles/hooks/useVehicles.ts
import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { vehiclesApi, type CreateVehicleRequest } from '@features/vehicles/services/vehicles.api'

const KEYS = {
  all:    ['vehicles'] as const,
  detail: (id: number) => ['vehicles', id] as const,
  brands: ['vehicles', 'brands'] as const,
}

/**
 * useVehicles — trae TODOS los vehículos una sola vez y filtra en el
 * cliente (search + brand). Un catálogo de vehículos compatibles es chico
 * (decenas, no miles), así que no vale la pena pedirle al backend que
 * pagine/filtre — además hoy no lo soporta en GET /vehicles.
 */
export function useVehicles(params: { search?: string; brand?: string } = {}) {
  const query = useQuery({
    queryKey: KEYS.all,
    queryFn:  vehiclesApi.getAll,
  })

  const filtered = useMemo(() => {
    let list = query.data ?? []

    if (params.brand) {
      list = list.filter(v => v.brand === params.brand)
    }
    if (params.search) {
      const q = params.search.toLowerCase()
      list = list.filter(v =>
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        (v.engine ?? '').toLowerCase().includes(q)
      )
    }
    return list
  }, [query.data, params.search, params.brand])

  return { ...query, data: filtered }
}

export function useVehicleBrands() {
  return useQuery({
    queryKey: KEYS.brands,
    queryFn:  vehiclesApi.getBrands,
    staleTime: 1000 * 60 * 10,
  })
}

export function useModelsByBrand(brand: string) {
  return useQuery({
    queryKey: ['vehicles', 'brands', brand, 'models'],
    queryFn:  () => vehiclesApi.getModelsByBrand(brand),
    enabled:  !!brand,
  })
}

export function useCreateVehicle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: vehiclesApi.create,
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: KEYS.all })
      qc.invalidateQueries({ queryKey: KEYS.brands })
    },
  })
}

export function useUpdateVehicle(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Partial<CreateVehicleRequest>) => vehiclesApi.update(id, body),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: KEYS.all })
      qc.invalidateQueries({ queryKey: KEYS.detail(id) })
    },
  })
}

export function useDeleteVehicle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: vehiclesApi.delete,
    onSuccess:  () => qc.invalidateQueries({ queryKey: KEYS.all }),
  })
}