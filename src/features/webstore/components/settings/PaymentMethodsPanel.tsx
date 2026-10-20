// features/webstore/components/settings/PaymentMethodsPanel.tsx
import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Panel } from '@components/ui/Form'
import { Button } from '@components/ui/Button'
import type { SettingsPanelProps } from './types'

const MAX_METHODS = 8

export function PaymentMethodsPanel({ form, set, disabled }: SettingsPanelProps) {
  const [draft, setDraft] = useState('')
  const methods = form.paymentMethods

  const add = () => {
    // La coma separa los medios al guardarlos, por eso no se admite dentro de un nombre
    const m = draft.replace(/,/g, ' ').trim()
    if (m && !methods.includes(m) && methods.length < MAX_METHODS) set('paymentMethods', [...methods, m])
    setDraft('')
  }

  return (
    <Panel title="Medios de pago" description={`Son las opciones que el cliente elige al finalizar su pedido (máximo ${MAX_METHODS}). Los que incluyan la palabra “Yape” usan la pantalla de pago con Yape.`}>
      <div className="flex flex-wrap gap-2">
        {methods.map(m => (
          <span key={m} className="inline-flex items-center gap-1.5 h-9 pl-3 pr-2 rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] text-sm text-[var(--text-primary)]">
            {m}
            {!disabled && (
              <button type="button" onClick={() => set('paymentMethods', methods.filter(x => x !== m))} aria-label={`Quitar ${m}`}
                className="p-1 rounded hover:bg-[var(--bg-muted)] text-[var(--text-muted)]"><X className="w-3.5 h-3.5" /></button>
            )}
          </span>
        ))}
        {!methods.length && <p className="text-sm text-[var(--danger)]">Agrega al menos un medio de pago.</p>}
      </div>
      {!disabled && methods.length < MAX_METHODS && (
        <div className="mt-4 flex gap-2 max-w-sm">
          <input className="field-input" maxLength={40} placeholder="Ej. Tarjeta (POS)" value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }} />
          <Button type="button" variant="secondary" leftIcon={<Plus className="w-4 h-4" />} onClick={add}>Agregar</Button>
        </div>
      )}
    </Panel>
  )
}
