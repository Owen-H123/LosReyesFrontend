# 05 - Rutas y layouts

El proyecto usa React Router 6 con las rutas escritas a mano. Los archivos clave:

| Archivo | Funcion |
|---|---|
| `src/app/router/routes.ts` | Constantes con todas las URLs (`ROUTES`) |
| `src/app/router/AppRouter.tsx` | Define las rutas y que layout usa cada una |
| `src/components/layout/AuthLayout.tsx` | Layout de pantalla completa (login, 403, 404) |
| `src/components/layout/MainLayout.tsx` | Layout con Sidebar y Header para la app |
| `src/components/layout/PageShell.tsx` | Transicion de entrada/salida entre layouts |
| `src/features/auth/components/ProtectedRoute.tsx` | Guard de autenticacion, rol y permiso |

## Los dos layouts

```
AuthLayout   -> /login, /403, /404          (sin menu)
MainLayout   -> todo lo demas, bajo "/"     (Sidebar + Header + contenido)
                protegido por ProtectedRoute
```

Una pagina nueva casi siempre va dentro de `MainLayout` (como hija de la ruta `/`).

## Agregar una pagina nueva

### 1. Constante de ruta

En `routes.ts`:

```ts
suppliers: '/suppliers',
supplier: (id: string | number) => `/suppliers/${id}`,
```

### 2. Carga diferida (lazy)

En `AppRouter.tsx`, junto a las demas:

```tsx
const SuppliersPage = lazy(() => import('@features/suppliers/pages/SuppliersPage'))
```

La pagina debe tener `export default`.

### 3. La ruta

Dentro del `<Route path="/" ...>` de `MainLayout`:

```tsx
<Route path="suppliers" element={<SuppliersPage />} />
<Route path="suppliers/:id" element={<SupplierDetailPage />} />
```

Las rutas hijas llevan el path relativo, sin la barra inicial.

### 4. Menu

Agregar el item en `Sidebar.tsx` (ver [03-nuevo-modulo.md](03-nuevo-modulo.md)).

## Proteger una ruta

`ProtectedRoute` ya envuelve todo `MainLayout` y exige sesion iniciada. Para
restringir una pagina concreta se anida otro `ProtectedRoute`:

```tsx
// Solo ADMIN (no delegable)
<Route path="users" element={
  <ProtectedRoute requiredRole="ADMIN"><UsersPage /></ProtectedRoute>
} />

// Delegable: ADMIN siempre pasa, WORKER solo si tiene el permiso
<Route path="reports" element={
  <ProtectedRoute requiredPermission="VIEW_REPORTS"><ReportsPage /></ProtectedRoute>
} />
```

Si no cumple, redirige a `/403`. Si no hay sesion, a `/login`.

## Navegar desde el codigo

Preferir las constantes:

```tsx
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/router/routes'

const navigate = useNavigate()
navigate(ROUTES.product(12))
```

Nota: hoy `Sidebar`, `Header` y `CommandPalette` todavia tienen algunas rutas
escritas como texto (`'/products'`). Al tocar esos archivos, migrarlas a `ROUTES`.

## Crear un layout nuevo

Solo si hace falta una estructura distinta (por ejemplo una pantalla de caja
sin menu lateral):

1. Crear el componente en `src/components/layout/`.
2. Si necesita `<Outlet />`, usarlo como el `MainLayout`; si recibe `children`, como `AuthLayout`.
3. Usarlo como `element` de una ruta padre en `AppRouter.tsx`.
4. Revisar `layoutKey` en `AppRouter.tsx`: cuando el usuario cambia entre layouts,
   la clave distinta fuerza la animacion de transicion.

## Carga diferida y Suspense

- En `MainLayout` el `<Suspense>` rodea al `<Outlet />`, asi el menu no desaparece
  mientras carga una pagina.
- En `AuthLayout` el `<Suspense>` es de pantalla completa.
- No agregar otro `Suspense` alrededor de cada ruta hija.
