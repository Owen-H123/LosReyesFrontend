# 06 - Convenciones

## Alias de importacion

Se definen en `vite.config.ts` (para ejecutar) y `tsconfig.json` (para el editor).
Si agregas uno nuevo, hay que agregarlo en los dos.

| Alias | Carpeta |
|---|---|
| `@/` | `src/` |
| `@app/` | `src/app/` |
| `@api/` | `src/api/` |
| `@components/` | `src/components/` |
| `@constants/` | `src/constants/` |
| `@features/` | `src/features/` |
| `@hooks/` | `src/hooks/` |
| `@interfaces/` | `src/interfaces/` |
| `@lib/` | `src/lib/` |
| `@store/` | `src/store/` |

Ejemplos:

```ts
import { Button } from '@components/ui/Button'
import { useDebounce } from '@hooks/useDebounce'
import { formatCurrency } from '@lib/utils'
import type { ApiResponse } from '@interfaces/api.types'
import { useProducts } from '@features/products/hooks/useProducts'
import logo from '@/assets/logos/logo.png'
```

Reglas:

- Entre carpetas distintas, siempre alias.
- Dentro del mismo modulo, tambien se usa alias para mantener un solo estilo.
- Nunca `../../../`.

## Nombres

| Elemento | Convencion | Ejemplo |
|---|---|---|
| Componente y su archivo | PascalCase | `SaleDetailDrawer.tsx` |
| Pagina | PascalCase + `Page` | `ProductsPage.tsx` |
| Hook y su archivo | camelCase con `use` | `useProducts.ts` |
| Service | `<modulo>.api.ts`, objeto `<modulo>Api` | `productsApi` |
| Tipos e interfaces | PascalCase | `CreateProductRequest` |
| Constantes | MAYUSCULAS_CON_GUION_BAJO | `SIDEBAR_WIDTH` |
| Stores de Zustand | `<nombre>.store.ts`, hook `use<Nombre>Store` | `useUIStore` |
| Carpetas | minusculas | `features/products` |

## Que va en cada tipo de archivo

- `pages/`: orquesta la pantalla. Usa hooks, arma componentes. Sin llamadas a axios.
- `components/`: presentacion. Recibe props.
- `hooks/`: TanStack Query o logica de estado reutilizable.
- `services/`: unicamente llamadas HTTP.
- `store/`: estado global minimo (sesion, tema, IP del servidor). Los datos del
  backend NO se guardan aqui; para eso esta TanStack Query.

## Estilos

- Tailwind para casi todo.
- Colores y fondos con las variables de `src/styles/theme.css`.
- Mantener el modo claro y oscuro funcionando: no usar un color fijo si existe variable.

## Comentarios

- Comentar el por que, no el que.
- Si un cambio corrige un error del backend o un comportamiento no obvio, dejar una
  nota breve (el proyecto ya lo hace con "CORRECCION: ...").

## Checklist antes de subir cambios

- [ ] `npm run type-check` no muestra errores nuevos
- [ ] `npm run dev` abre sin errores en consola
- [ ] Imports con alias, sin rutas relativas largas
- [ ] No hay llamadas a axios dentro de pages ni components
- [ ] Endpoints registrados en `api/endpoints/index.ts`
- [ ] Rutas nuevas en `routes.ts` y `AppRouter.tsx`
- [ ] Item de menu agregado si corresponde
- [ ] No quedaron `console.log` ni codigo comentado

## Problemas conocidos del proyecto

- `npm run build` ejecuta `tsc` primero y hoy falla por imports sin usar
  (`noUnusedLocals`) y por `ButtonProps`/`InputProps` que no estan exportados
  en `components/ui/Button.tsx` e `Input.tsx`. Hay que corregirlos para poder
  compilar con `npm run build`. `vite build` solo funciona.
- `tsconfig.json` tiene `"ignoreDeprecations": "6.0"`, valor que TypeScript 5.9
  no reconoce. Cambiarlo a `"5.0"` o quitarlo.
- Algunas rutas siguen escritas como texto en `Sidebar`, `Header` y `CommandPalette`.
