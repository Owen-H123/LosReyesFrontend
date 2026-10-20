// features/inventory/components/MovementsTable.tsx
// Tabla del historial de movimientos de stock, con paginación.
import { ArrowDownCircle, ArrowUpCircle, RefreshCw } from 'lucide-react'
import { formatCurrency, formatDateTime } from '@lib/utils'
import type { InventoryMovement, MovementType, PagedResponse } from '@interfaces/api.types'

const TYPE_STYLES: Record<MovementType, { label: string; color: string; icon: React.ElementType }> = {
  ENTRY:      { label: 'Entrada',  color: 'text-[var(--success)] bg-[var(--success-light)]', icon: ArrowDownCircle },
  EXIT:       { label: 'Salida',   color: 'text-[var(--danger)] bg-[var(--danger-light)]', icon: ArrowUpCircle },
  SALE:       { label: 'Venta',    color: 'text-[var(--accent-text)] bg-[var(--accent-light)]', icon: ArrowUpCircle },
  ADJUSTMENT: { label: 'Ajuste',   color: 'text-[var(--warning)] bg-[var(--warning-light)]', icon: RefreshCw },
}

const COLUMNS = ['Tipo', 'Producto', 'Código', 'Cantidad', 'Stock Antes → Después', 'Costo Unit.', 'Usuario', 'Fecha', 'Observación']

export function MovementsTable({ data, isLoading, page, onPageChange }: {
  data?: PagedResponse<InventoryMovement>
  isLoading: boolean
  page: number
  onPageChange: (page: number) => void
}) {
  const movements = data?.content ?? []

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {COLUMNS.map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-[var(--text-muted)]">
                  Cargando movimientos...
                </td>
              </tr>
            ) : movements.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-[var(--text-muted)]">
                  Sin movimientos registrados
                </td>
              </tr>
            ) : movements.map(m => {
              const typeStyle = TYPE_STYLES[m.type]
              const Icon = typeStyle.icon
              return (
                <tr key={m.id} className="hover:bg-[var(--bg-subtle)] transition-colors">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold ${typeStyle.color}`}>
                      <Icon className="w-3 h-3" />
                      {typeStyle.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-primary)] max-w-[160px] truncate">{m.productName}</td>
                  <td className="px-4 py-3 text-sm font-mono text-[var(--accent-text)]">{m.productCode}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-bold ${
                      m.type === 'ENTRY' ? 'text-[var(--success)]' :
                      m.type === 'ADJUSTMENT' ? 'text-[var(--warning)]' :
                      'text-[var(--danger)]'
                    }`}>
                      {m.type === 'ENTRY' ? '+' : m.type === 'ADJUSTMENT' ? '=' : '-'}{m.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-muted)] font-mono whitespace-nowrap">
                    {m.stockBefore} → <span className="text-[var(--text-primary)]">{m.stockAfter}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-muted)]">
                    {m.unitCost ? formatCurrency(m.unitCost) : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--text-muted)]">{m.userName}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-muted)] whitespace-nowrap">{formatDateTime(m.createdAt)}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-muted)] max-w-[120px] truncate">
                    {m.observation ?? '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="px-4 py-3 border-t border-[var(--border)] flex items-center justify-between">
          <p className="text-xs text-[var(--text-muted)]">Página {page + 1} de {data.totalPages}</p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(0, page - 1))}
              disabled={data.first}
              className="px-3 py-1 text-xs bg-[var(--bg-elevated)] text-[var(--text-muted)] rounded disabled:opacity-40 hover:bg-[var(--bg-subtle)] transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={data.last}
              className="px-3 py-1 text-xs bg-[var(--bg-elevated)] text-[var(--text-muted)] rounded disabled:opacity-40 hover:bg-[var(--bg-subtle)] transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
