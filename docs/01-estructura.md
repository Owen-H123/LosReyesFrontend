# 01 - Estructura del proyecto

```
src/
├── main.tsx                  Punto de entrada
├── index.css                 Estilos globales (importa styles/)
│
├── api/                      Capa HTTP compartida
│   ├── client/axios.client.ts      Instancia de axios (lee la IP del servidor en cada peticion)
│   ├── interceptors/jwt.interceptor.ts   Token JWT y refresh
│   └── endpoints/index.ts          Registro central de TODAS las URLs del backend
│
├── app/                      Arranque de la aplicacion
│   ├── App.tsx
│   ├── providers/AppProviders.tsx  QueryClient, Toaster, tema, CommandPalette
│   └── router/
│       ├── AppRouter.tsx           Definicion de rutas
│       └── routes.ts               Constantes de rutas (ROUTES)
│
├── components/               Componentes reutilizables por toda la app
│   ├── layout/                 MainLayout, AuthLayout, PageShell, Header, Sidebar
│   ├── shared/                 Componentes globales con logica (CommandPalette, PageLoader)
│   └── ui/                     Piezas visuales base (Button, Input, Badge, Card...)
│
├── constants/                Constantes globales (medidas del layout, etc.)
├── hooks/                    Hooks genericos que no pertenecen a un modulo (useDebounce)
├── interfaces/               Tipos compartidos entre modulos (api.types.ts)
├── lib/                      Funciones utilitarias (formatCurrency, cn, formatDate...)
├── store/                    Estado global con Zustand (auth, ui, connection)
├── styles/                   theme.css, fonts.css, tailwind.css
├── assets/                   Imagenes y logos
│
└── features/                 Un modulo de negocio por carpeta
    └── <modulo>/
        ├── pages/              Pantallas (una por ruta)
        ├── components/         Componentes que SOLO usa este modulo
        ├── hooks/              Hooks de TanStack Query del modulo
        ├── services/           Llamadas al backend del modulo
        ├── interfaces/         Tipos que solo usa este modulo (opcional)
        └── schemas/            Esquemas Zod de formularios (opcional)
```

## Modulos actuales

audit, auth, categories, customers, dashboard, inventory, products, receipts,
reports, sales, settings, users, vehicles.

## Como decidir donde va un archivo

| Pregunta | Respuesta | Destino |
|---|---|---|
| Lo usan 2 o mas modulos y es solo visual? | si | `components/ui/` |
| Lo usan 2 o mas modulos y tiene logica o dependencias de datos? | si | `components/shared/` |
| Es parte de la estructura de pantalla (menu, cabecera)? | si | `components/layout/` |
| Solo lo usa un modulo? | si | `features/<modulo>/components/` |
| Es un hook sin relacion con un modulo? | si | `hooks/` |
| Es una funcion pura (formatear, calcular)? | si | `lib/` |
| Es un tipo que usan varios modulos? | si | `interfaces/` |
| Es estado que debe vivir en toda la app? | si | `store/` |
| Es una llamada al backend? | si | `features/<modulo>/services/` |

Un componente que empieza en un modulo y luego lo necesita otro se mueve a
`components/shared/` o `components/ui/`. No se importa de un feature a otro
para componentes visuales.

## Flujo de datos

```
Pagina (pages/)  ->  Hook (hooks/)  ->  Service (services/)  ->  apiClient  ->  Backend
     UI              TanStack Query        funciones axios        axios + JWT
```

La pagina nunca llama a axios directamente. Siempre pasa por un hook.
