# 02 - Crear un componente nuevo

## Paso 1: decidir donde va

Usa la tabla de [01-estructura.md](01-estructura.md). Resumen:

| Tipo de componente | Carpeta |
|---|---|
| Boton, input, badge, tarjeta, modal generico | `src/components/ui/` |
| Componente global con logica (buscador, paleta de comandos) | `src/components/shared/` |
| Parte del esqueleto de pantalla | `src/components/layout/` |
| Solo lo usa un modulo (por ejemplo un drawer de ventas) | `src/features/<modulo>/components/` |

Si dudas, empieza dentro del modulo. Moverlo a global despues es facil porque
los imports usan alias.

## Paso 2: crear el archivo

- Nombre del archivo en PascalCase igual al componente: `StatusBadge.tsx`.
- Export con nombre (`export function StatusBadge`). Las paginas son la excepcion y usan `export default`.
- Tipar las props con una interfaz.

Ejemplo en `src/components/ui/StatusBadge.tsx`:

```tsx
// components/ui/StatusBadge.tsx
import { cn } from '@lib/utils'

interface StatusBadgeProps {
  active: boolean
  className?: string
}

export function StatusBadge({ active, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'rounded-full px-2 py-0.5 text-xs font-medium',
        active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-500/15 text-slate-400',
        className,
      )}
    >
      {active ? 'Activo' : 'Inactivo'}
    </span>
  )
}
```

## Paso 3: usarlo

Siempre con alias, nunca con rutas relativas largas:

```tsx
import { StatusBadge } from '@components/ui/StatusBadge'
```

Si el componente pertenece a `components/ui/` y es una pieza base, agregalo
tambien a `src/components/ui/index.tsx` para poder importarlo desde
`@components/ui`.

## Reglas

1. Un componente no llama a axios. Recibe datos por props o usa un hook del modulo.
2. Los estilos van con clases de Tailwind y las variables del tema (`var(--bg-base)`, etc.). No colores sueltos nuevos si ya existe una variable en `styles/theme.css`.
3. Si el componente tiene mas de ~200 lineas, dividirlo en subcomponentes en la misma carpeta.
4. Un componente de `features/a/` no importa componentes de `features/b/`. Si lo necesitas en ambos, subelo a `components/shared/`.
5. Para el estado de carga usa `PageLoader` de `@components/shared/PageLoader` o los `Skeleton` de `@components/ui`.

## Componente con formulario

Usar React Hook Form + Zod. El esquema va en `features/<modulo>/schemas/` si es
del modulo. Ver `features/auth/schemas/login.schema.ts` y
`features/auth/components/LoginForm.tsx` como referencia.
