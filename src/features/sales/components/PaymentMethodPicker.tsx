// features/sales/components/PaymentMethodPicker.tsx
import { CreditCard } from 'lucide-react'
import type { PaymentMethod } from '@interfaces/api.types'

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'CASH',     label: 'Efectivo' },
  { value: 'CARD',     label: 'Tarjeta' },
  { value: 'TRANSFER', label: 'Transferencia' },
  { value: 'CREDIT',   label: 'Crédito' },
]

export function PaymentMethodPicker({ value, onChange }: {
  value: PaymentMethod
  onChange: (method: PaymentMethod) => void
}) {
  return (
    <div className="section-card">
      <h3 className="section-title">Método de Pago</h3>
      <div className="grid grid-cols-2 gap-2">
        {PAYMENT_METHODS.map(pm => (
          <button key={pm.value} onClick={() => onChange(pm.value)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
              value === pm.value
                ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                : 'bg-[var(--bg-base)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-hover)]'}`}>
            <CreditCard className="w-4 h-4" />{pm.label}
          </button>
        ))}
      </div>
    </div>
  )
}
