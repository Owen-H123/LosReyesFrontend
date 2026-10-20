// features/webstore/components/Pager.tsx
import { Button } from '@components/ui/Button'

export function Pager({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--border)] text-sm text-[var(--text-muted)]">
      <span>Página {page + 1} de {totalPages}</span>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => onChange(page - 1)}>Anterior</Button>
        <Button variant="secondary" size="sm" disabled={page + 1 >= totalPages} onClick={() => onChange(page + 1)}>Siguiente</Button>
      </div>
    </div>
  )
}
