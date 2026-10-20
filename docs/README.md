# Documentacion del frontend - De los Reyes ERP

Guias para trabajar en el proyecto sin romper la estructura.

| Guia | Cuando leerla |
|---|---|
| [01-estructura.md](01-estructura.md) | Para entender que carpeta hace que |
| [02-nuevo-componente.md](02-nuevo-componente.md) | Vas a crear un componente |
| [03-nuevo-modulo.md](03-nuevo-modulo.md) | Vas a crear un modulo completo (feature) |
| [04-nueva-integracion-api.md](04-nueva-integracion-api.md) | Vas a consumir un endpoint nuevo del backend |
| [05-rutas-y-layouts.md](05-rutas-y-layouts.md) | Vas a agregar una pagina, ruta o proteger una ruta |
| [06-convenciones.md](06-convenciones.md) | Alias, nombres, checklist antes de subir cambios |

## Stack

- React 18 + TypeScript + Vite
- React Router 6 (rutas definidas a mano en `src/app/router/AppRouter.tsx`)
- TanStack Query (datos del servidor), TanStack Table
- Zustand (estado global), React Hook Form + Zod (formularios)
- Tailwind CSS 4, Radix UI, Framer Motion, Recharts
- Axios contra el backend Spring Boot en `http://<ip>:8080/api/v1`

## Comandos

```bash
npm install        # instalar dependencias (primera vez)
npm run dev        # servidor de desarrollo en http://localhost:3000
npm run build      # compilar para produccion
npm run type-check # revisar tipos sin compilar
```

## Regla de oro

Cada cosa va en un solo lugar. Si lo usa toda la app, va en una carpeta global
(`components/`, `hooks/`, `lib/`). Si lo usa un solo modulo, vive dentro de
`features/<modulo>/`. Las guias siguientes explican como decidir.
