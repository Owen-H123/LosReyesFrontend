// features/sales/components/CustomerPicker.tsx
// Elegir el cliente de la venta (opcional): buscarlo, quitarlo o pedir que se
// cree uno nuevo.
import { useState, useEffect } from 'react'
import { Trash2, User, UserPlus } from 'lucide-react'
import { useDebounce } from 'use-debounce'
import { useCustomers } from '@features/customers/hooks/useCustomers'
import type { Customer } from '@interfaces/api.types'
import { saleInputClass } from '@features/sales/components/saleStyles'

export function CustomerPicker({ selectedCustomer, onSelect, onRequestNewCustomer }: {
  selectedCustomer: Customer | null
  onSelect: (customer: Customer | null) => void
  // Pide abrir el modal de cliente nuevo, con lo escrito en la búsqueda como nombre
  onRequestNewCustomer: (name: string) => void
}) {
  const [customerSearch, setCustomerSearch] = useState('')
  const [showCustomerSearch, setShowCustomerSearch] = useState(false)
  const [debouncedCustomer] = useDebounce(customerSearch, 300)
  const { data: customers } = useCustomers({ search: debouncedCustomer, size: 6 })

  // Al elegir un cliente (de la lista o recién creado) se limpia la búsqueda
  useEffect(() => {
    if (selectedCustomer) {
      setCustomerSearch('')
      setShowCustomerSearch(false)
    }
  }, [selectedCustomer])

  const requestNewCustomer = () => {
    setShowCustomerSearch(false)
    onRequestNewCustomer(customerSearch)
  }

  return (
    <div className="section-card">
      <h3 className="section-title">Cliente</h3>
      {selectedCustomer ? (
        <div className="flex items-center justify-between p-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold">
              {selectedCustomer.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-[var(--text-primary)] text-sm font-medium">{selectedCustomer.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{selectedCustomer.documentNumber}</p>
            </div>
          </div>
          <button onClick={() => onSelect(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input value={customerSearch} onChange={e => { setCustomerSearch(e.target.value); setShowCustomerSearch(true) }}
              placeholder="Buscar por nombre o documento..." className={`${saleInputClass} pl-10`} />
          </div>
          {showCustomerSearch && customerSearch && customers?.content && customers.content.length > 0 && (
            <div className="mt-1 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg overflow-hidden">
              {customers.content.map(c => (
                <button key={c.id} type="button"
                  onClick={() => onSelect(c)}
                  className="w-full px-3 py-2 text-left hover:bg-[var(--bg-subtle)] text-sm">
                  <span className="text-[var(--text-primary)]">{c.name}</span>
                  <span className="text-[var(--text-muted)] ml-2 text-xs">{c.documentNumber}</span>
                </button>
              ))}
            </div>
          )}
          {showCustomerSearch && customerSearch && customers?.content && customers.content.length === 0 && (
            <div className="mt-1 p-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-center">
              <p className="text-xs text-[var(--text-muted)] mb-2">Sin resultados para "{customerSearch}"</p>
              <button type="button" onClick={requestNewCustomer}
                className="inline-flex items-center gap-1.5 text-xs text-[var(--accent-text)] hover:text-[var(--accent-text)] font-medium">
                <UserPlus className="w-3.5 h-3.5" /> Crear "{customerSearch}" como cliente nuevo
              </button>
            </div>
          )}
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-[var(--text-muted)]">Opcional — venta sin cliente identificado</p>
            <button type="button" onClick={requestNewCustomer}
              className="flex items-center gap-1 text-xs text-[var(--accent-text)] hover:text-[var(--accent-text)] font-medium">
              <UserPlus className="w-3.5 h-3.5" /> Nuevo cliente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
