# 03 - Crear un modulo nuevo (feature)

Un modulo es una seccion de negocio completa: por ejemplo `suppliers`
(proveedores). Toma como modelo `features/vehicles/`, que es pequeno y completo.

## Resumen de pasos

1. Crear la carpeta del modulo.
2. Definir los tipos.
3. Registrar los endpoints.
4. Crear el service.
5. Crear los hooks.
6. Crear la pagina y sus componentes.
7. Agregar la ruta.
8. Agregar la entrada al menu (Sidebar).

## 1. Carpeta

```
src/features/suppliers/
├── pages/SuppliersPage.tsx
├── components/          (solo si hace falta)
├── hooks/useSuppliers.ts
└── services/suppliers.api.ts
```

## 2. Tipos

Si el tipo lo usa solo este modulo, defínelo en el mismo `services/suppliers.api.ts`
o en `features/suppliers/interfaces/`. Si lo usan varios modulos, agregalo a
`src/interfaces/api.types.ts`.

Todas las respuestas del backend vienen envueltas en `ApiResponse<T>`
(`success`, `message`, `data`, `errors`, `timestamp`). Las listas paginadas usan
`PagedResponse<T>`.

## 3. Endpoints

Agregar el bloque en `src/api/endpoints/index.ts`. Debe coincidir exactamente
con el controller de Spring Boot:

```ts
suppliers: {
  list: '/suppliers',
  byId: (id: number) => `/suppliers/${id}`,
},
```

## 4. Service

`src/features/suppliers/services/suppliers.api.ts`:

```ts
import apiClient from '@api/client/axios.client'
import { API } from '@api/endpoints'
import type { ApiResponse } from '@interfaces/api.types'

export interface Supplier { id: number; name: string; phone?: string }
export interface CreateSupplierRequest { name: string; phone?: string }

export const suppliersApi = {
  getAll: async (): Promise<Supplier[]> => {
    const { data } = await apiClient.get<ApiResponse<Supplier[]>>(API.suppliers.list)
    return data.data
  },
  create: async (body: CreateSupplierRequest) => {
    const { data } = await apiClient.post<ApiResponse<Supplier>>(API.suppliers.list, body)
    return data.data
  },
}
```

El service no tiene logica de React. Solo llama al backend y devuelve `data.data`.

## 5. Hooks

`src/features/suppliers/hooks/useSuppliers.ts`:

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { suppliersApi } from '@features/suppliers/services/suppliers.api'

const KEYS = { all: ['suppliers'] as const }

export function useSuppliers() {
  return useQuery({ queryKey: KEYS.all, queryFn: suppliersApi.getAll })
}

export function useCreateSupplier() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: suppliersApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  })
}
```

Reglas de las query keys: una constante `KEYS` por archivo, y al mutar siempre
invalidar la key de la lista.

## 6. Pagina

`src/features/suppliers/pages/SuppliersPage.tsx` con `export default`
(el router la carga con lazy):

```tsx
import { useSuppliers } from '@features/suppliers/hooks/useSuppliers'

export default function SuppliersPage() {
  const { data = [], isLoading } = useSuppliers()
  if (isLoading) return null
  return <div>{data.map(s => <p key={s.id}>{s.name}</p>)}</div>
}
```

Para tablas, buscadores y cabeceras de pagina copia el patron de
`features/vehicles/pages/VehiclesPage.tsx` o `features/products/pages/ProductsPage.tsx`.

## 7. Ruta

Ver [05-rutas-y-layouts.md](05-rutas-y-layouts.md). En corto: agregar la constante
en `routes.ts`, el `lazy` y el `<Route>` en `AppRouter.tsx`.

## 8. Menu

En `src/components/layout/Sidebar.tsx` agregar un item a `NAV_ITEMS` y su ruta
al grupo correspondiente de `NAV_GROUPS`. Si es solo para administradores,
marcar `adminOnly: true`.

Si el modulo tambien debe aparecer en la paleta de comandos (Ctrl+K), agregarlo
en `src/components/shared/CommandPalette.tsx`.

## Checklist del modulo

- [ ] Endpoints agregados y verificados contra Swagger del backend
- [ ] Service sin logica de React
- [ ] Hooks con `KEYS` e invalidacion al mutar
- [ ] Pagina con `export default`
- [ ] Ruta agregada (con proteccion si aplica)
- [ ] Item en Sidebar
- [ ] `npm run type-check` sin errores nuevos
