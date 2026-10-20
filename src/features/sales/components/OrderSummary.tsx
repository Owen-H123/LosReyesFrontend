// features/sales/components/OrderSummary.tsx
// Resumen de la venta: subtotal, descuento global, IGV incluido, total,
// notas y el botón Confirmar Venta.
import { ShoppingCart } from 'lucide-react'
import { formatCurrency } from '@lib/utils'

export function OrderSummary({
  subtotal, tax, total, globalDiscount, onDiscountChange,
  notes, onNotesChange, onConfirm, canConfirm, isPending,
}: {
  subtotal: number
  tax: number
  total: number
  globalDiscount: number
  onDiscountChange: (value: number) => void
  notes: string
  onNotesChange: (value: string) => void
  onConfirm: () => void
  canConfirm: boolean
  isPending: boolean
}) {
  return (
    <div className="section-card">
      <h3 className="section-title">Resumen</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-[var(--text-muted)]">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[var(--text-muted)]">Descuento Global</span>
          <input type="number" min="0" value={globalDiscount || ''}
            onChange={e => onDiscountChange(Number(e.target.value))}
            placeholder="0.00"
            className="w-24 px-2 py-1 bg-[var(--bg-base)] border border-[var(--border)] rounded text-right text-[var(--text-primary)] text-xs focus:outline-none focus:ring-1 focus:ring-[var(--accent)]" />
        </div>
        <div className="flex justify-between text-[var(--text-muted)]">
          <span>IGV (18%) incluido</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="h-px bg-[var(--border)] my-2" />
        <div className="flex justify-between font-bold text-lg">
          <span className="text-[var(--text-primary)]">Total</span>
          <span className="text-[var(--success)]">{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="mt-4">
        <label className="field-label">Notas</label>
        <textarea value={notes} onChange={e => onNotesChange(e.target.value)} rows={2}
          placeholder="Notas adicionales..." className="w-full px-4 py-2 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none text-sm" />
      </div>

      <button onClick={onConfirm} disabled={!canConfirm || isPending}
        className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white rounded-lg font-medium transition-all text-base">
        <ShoppingCart className="w-5 h-5" />
        {isPending ? 'Procesando...' : `Confirmar Venta — ${formatCurrency(total)}`}
      </button>
    </div>
  )
}
