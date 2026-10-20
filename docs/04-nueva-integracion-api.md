# 04 - Integrar un endpoint nuevo del backend

Aplica cuando el backend (Spring Boot) agrega un endpoint y el frontend debe
consumirlo, dentro de un modulo que ya existe.

## Como funciona la conexion

- `src/api/client/axios.client.ts` crea la instancia de axios. En cada peticion
  calcula la URL base con la IP guardada en `store/connection.store.ts`
  (`http://<ip>:8080/api/v1`). Esa IP se cambia desde Configuracion, sin recompilar.
- `src/api/interceptors/jwt.interceptor.ts` agrega el token JWT a cada peticion
  y se encarga del refresh cuando expira.
- Todas las respuestas llegan con la forma:

```json
{ "success": true, "message": "...", "data": { }, "errors": [], "timestamp": "..." }
```

Por eso en los services siempre se devuelve `data.data`.

## Pasos

### 1. Confirmar el contrato en el backend

Revisar el controller o Swagger (`http://localhost:8080/api/v1/swagger-ui.html`):
metodo HTTP, ruta, cuerpo, parametros y roles permitidos.

### 2. Registrar la ruta en `src/api/endpoints/index.ts`

```ts
products: {
  // ...
  export: '/products/export',
  byBrand: (brand: string) => `/products/brand/${brand}`,
},
```

Nunca escribir URLs sueltas dentro de un service o componente.

### 3. Agregar la funcion al service del modulo

En `features/<modulo>/services/<modulo>.api.ts`:

```ts
getByBrand: async (brand: string) => {
  const { data } = await apiClient.get<ApiResponse<Product[]>>(API.products.byBrand(brand))
  return data.data
},
```

- GET con filtros: usar `params` de axios.
- Subida de archivos: `FormData` y cabecera `multipart/form-data`
  (ver `products.api.ts`, `uploadImage`).
- Descargas (Excel/PDF): `responseType: 'blob'` (ver `reports.api.ts`).

### 4. Exponerlo con un hook

En `features/<modulo>/hooks/`:

```ts
export function useProductsByBrand(brand: string) {
  return useQuery({
    queryKey: ['products', 'brand', brand],
    queryFn: () => productsApi.getByBrand(brand),
    enabled: !!brand,
  })
}
```

Para escrituras (POST/PUT/DELETE) usar `useMutation` e invalidar las keys afectadas.

### 5. Tipar la respuesta

Si el backend devuelve un objeto nuevo, definir su interfaz. Los nombres de
campos deben coincidir con el DTO de Java. Si el backend cambia un campo,
cambiar la interfaz y dejar que TypeScript marque los usos rotos.

### 6. Usarlo en la pagina

Solo desde el hook, nunca llamando a `productsApi` directamente en un componente.

## Errores y mensajes

- Los errores del backend llegan en `error.response.data.message`.
- Para avisar al usuario se usa `sonner` (`toast.success`, `toast.error`).
- Los 401 los maneja el interceptor (refresh o cierre de sesion). No duplicar esa logica.

## Permisos

Si el endpoint requiere un rol o permiso:

- El backend es quien decide. El frontend solo oculta o deshabilita la accion.
- Para ocultar acciones usar `usePermission()` de `@features/auth/hooks/usePermission`
  (por ejemplo `canDeleteProducts`, `canCancelSales`).
- Si agregas un permiso nuevo, debe existir tambien en `PermissionCode` del backend
  y en el tipo `PermissionCode` de `src/interfaces/api.types.ts`.

## Verificacion

1. Probar el endpoint en Swagger primero.
2. Probar en la app con la red del navegador abierta (F12) y revisar la URL y el cuerpo.
3. `npm run type-check`.
