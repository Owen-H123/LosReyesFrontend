// features/dashboard/components/Skeleton.tsx
// Bloque gris animado que ocupa el lugar del contenido mientras carga.
export function Skeleton({ h, w = '100%', r = 8 }: { h: number; w?: string | number; r?: number }) {
  return <div className="skeleton" style={{ height: h, width: w, borderRadius: r, flexShrink: 0 }} />
}
