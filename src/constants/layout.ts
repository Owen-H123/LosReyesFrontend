// constants/layout.ts

/**
 * SIDEBAR_WIDTH — única fuente de verdad para el ancho del sidebar.
 * (ver nota completa donde se usa en Sidebar.tsx / MainLayout.tsx)
 */
export const SIDEBAR_WIDTH = {
  collapsed: 68,
  expanded: 240,
} as const

/**
 * HEADER_HEIGHT — única fuente de verdad para la altura del header Y del
 * bloque del logo en el sidebar. Antes el header medía 64px pero el bloque
 * del logo del sidebar tenía minHeight:80 — como ambos arrancan en el mismo
 * y=0, la diferencia de 16px generaba un escalón justo donde se tocan.
 */
export const HEADER_HEIGHT = 64