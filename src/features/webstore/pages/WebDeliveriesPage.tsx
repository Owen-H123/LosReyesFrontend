// features/webstore/pages/WebDeliveriesPage.tsx
// Módulo "Entregas": lo que ya está confirmado y falta despachar o entregar.
import { useState } from 'react'
import { PackageCheck, Store, Truck } from 'lucide-react'
import { PageHeader } from '@components/ui/Form'
import { useWebOrders } from '@features/webstore/hooks/useWebstore'
import { OrderRow } from '@features/webstore/components/OrderRow'
import { Pager } from '@features/webstore/components/Pager'
import type { WebDelivery } from '@features/webstore/services/webstore.api'

const TABS: { value: WebDelivery; label: string; icon: React.ElementType; empty: string }[] = [
  { value: 'SHIPPING', label: 'Envíos a domicilio', icon: Truck, empty: 'No hay envíos pendientes.' },
  { value: 'PICKUP',   label: 'Recojo en tienda',   icon: Store, empty: 'Nadie tiene un recojo pendiente.' },
]

export default function WebDeliveriesPage() {
  const [tab, setTab] = useState<WebDelivery>('SHIPPING')
  const [page, setPage] = useState(0)
  // Confirmado = listo para despachar o para que lo recojan; en camino = ya salió
  const { data, isLoading } = useWebOrders({ status: ['CONFIRMED', 'SHIPPED'], delivery: tab, page, size: 20 })
  const active = TABS.find(t => t.value === tab)!

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader
        title="Entregas"
        subtitle="Pedidos confirmados que falta despachar o entregar. Al marcarlos entregados salen de esta lista."
      />

      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-[var(--border)]">
          <div className="flex gap-1 p-1 rounded-lg bg-[var(--bg-subtle)]">
            {TABS.map(t => (
              <button
                key={t.value}
                onClick={() => { setTab(t.value); setPage(0) }}
                className={`h-8 px-3 rounded-md text-[13px] font-medium inline-flex items-center gap-2 transition-colors ${
                  tab === t.value ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-[var(--shadow-sm)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
              >
                <t.icon className="w-3.5 h-3.5" /> {t.label}
              </button>
            ))}
          </div>
          {data && <span className="text-sm text-[var(--text-muted)]">{data.totalElements} pendientes</span>}
        </div>

        {isLoading ? (
          <div className="p-5 space-y-3">{[0, 1, 2].map(i => <div key={i} className="skeleton h-12 w-full" />)}</div>
        ) : !data?.content.length ? (
          <div className="py-16 text-center">
            <PackageCheck className="w-8 h-8 mx-auto text-[var(--text-disabled)]" strokeWidth={1.5} />
            <p className="mt-3 text-sm font-medium text-[var(--text-secondary)]">{active.empty}</p>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-[var(--border)]">
              {data.content.map(o => <OrderRow key={o.id} o={o} />)}
            </ul>
            <Pager page={page} totalPages={data.totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
