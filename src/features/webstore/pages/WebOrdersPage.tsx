// features/webstore/pages/WebOrdersPage.tsx
// Módulo "Pedidos web": todos los pedidos con búsqueda y filtros.
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Inbox, Search } from 'lucide-react'
import { PageHeader } from '@components/ui/Form'
import { Input } from '@components/ui/Input'
import { useDebounce } from '@hooks/useDebounce'
import { useWebOrders } from '@features/webstore/hooks/useWebstore'
import { OrderRow } from '@features/webstore/components/OrderRow'
import { Pager } from '@features/webstore/components/Pager'
import { withParam } from '@features/webstore/utils/params'
import { ORDER_STATUS, PAYMENT_STATUS } from '@features/webstore/constants/labels'
import type { WebDelivery, WebOrderStatus, WebPaymentStatus } from '@features/webstore/services/webstore.api'

const FILTERS: (WebOrderStatus | '')[] = ['', 'NEW', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function WebOrdersPage() {
  const [params, setParams] = useSearchParams()
  const estado = (params.get('estado') ?? '') as WebOrderStatus | ''
  // ?pago=SUBMITTED llega desde el resumen ("Pagos por verificar")
  const pago = (params.get('pago') ?? '') as WebPaymentStatus | ''
  const [search, setSearch] = useState('')
  const [delivery, setDelivery] = useState<WebDelivery | ''>('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [page, setPage] = useState(0)
  const debounced = useDebounce(search, 350)

  const { data: orders, isLoading } = useWebOrders({
    status: estado ? [estado] : undefined,
    delivery: delivery || undefined,
    paymentStatus: pago || undefined,
    search: debounced.trim() || undefined,
    from: from || undefined,
    to: to || undefined,
    page,
    size: 20,
  })

  const resetPage = <T,>(set: (v: T) => void) => (v: T) => { set(v); setPage(0) }

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader
        title="Pedidos web"
        subtitle="Pedidos que llegan desde la tienda. Confírmalos por WhatsApp y avanza su estado aquí."
      />

      <div className="card p-4 grid gap-3 md:grid-cols-[1fr_160px_160px_150px_150px]">
        <Input
          placeholder="Buscar por número, nombre o celular"
          leftIcon={<Search className="w-4 h-4" />}
          value={search}
          onChange={e => resetPage(setSearch)(e.target.value)}
        />
        <select className="field-input" value={delivery} onChange={e => resetPage(setDelivery)(e.target.value as WebDelivery | '')} aria-label="Tipo de entrega">
          <option value="">Toda entrega</option>
          <option value="SHIPPING">Envío a domicilio</option>
          <option value="PICKUP">Recojo en tienda</option>
        </select>
        <select className="field-input" value={pago}
          onChange={e => { setParams(withParam(params, 'pago', e.target.value)); setPage(0) }}
          aria-label="Estado del pago">
          <option value="">Todo pago</option>
          {(Object.keys(PAYMENT_STATUS) as WebPaymentStatus[]).map(p => <option key={p} value={p}>{PAYMENT_STATUS[p].label}</option>)}
        </select>
        <input type="date" className="field-input" value={from} max={to || undefined} onChange={e => resetPage(setFrom)(e.target.value)} aria-label="Desde" />
        <input type="date" className="field-input" value={to} min={from || undefined} onChange={e => resetPage(setTo)(e.target.value)} aria-label="Hasta" />
      </div>

      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-[var(--border)]">
          <h2 className="section-title">
            Pedidos {orders && <span className="font-normal text-[var(--text-muted)]">({orders.totalElements})</span>}
          </h2>
          <div className="flex flex-wrap gap-1 p-1 rounded-lg bg-[var(--bg-subtle)]">
            {FILTERS.map(f => (
              <button
                key={f || 'all'}
                onClick={() => { setParams(withParam(params, 'estado', f)); setPage(0) }}
                className={`h-8 px-3 rounded-md text-[13px] font-medium transition-colors ${
                  estado === f ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-[var(--shadow-sm)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
              >
                {f ? ORDER_STATUS[f].label : 'Todos'}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="p-5 space-y-3">{[0, 1, 2].map(i => <div key={i} className="skeleton h-12 w-full" />)}</div>
        ) : !orders?.content.length ? (
          <div className="py-16 text-center">
            <Inbox className="w-8 h-8 mx-auto text-[var(--text-disabled)]" strokeWidth={1.5} />
            <p className="mt-3 text-sm font-medium text-[var(--text-secondary)]">No hay pedidos con esos filtros</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Aparecerán aquí apenas un cliente envíe uno desde la tienda.</p>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-[var(--border)]">
              {orders.content.map(o => <OrderRow key={o.id} o={o} />)}
            </ul>
            <Pager page={page} totalPages={orders.totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
