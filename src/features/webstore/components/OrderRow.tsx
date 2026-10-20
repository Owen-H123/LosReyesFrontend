// features/webstore/components/OrderRow.tsx
// Fila desplegable de un pedido web. La usan Pedidos web y Entregas.
import { useState } from 'react'
import { ChevronDown, MessageCircle, Store, Truck, Car } from 'lucide-react'
import { Button } from '@components/ui/Button'
import { confirmDialog } from '@components/ui/confirm'
import { formatCurrency, formatDateTime } from '@lib/utils'
import { useUpdateWebOrderStatus } from '@features/webstore/hooks/useWebstore'
import { NEXT_STATUS, ORDER_STATUS } from '@features/webstore/constants/labels'
import { whatsappLink } from '@features/webstore/utils/whatsapp'
import { PaymentBadge } from '@features/webstore/components/PaymentBadge'
import { PaymentPanel } from '@features/webstore/components/PaymentPanel'
import type { WebOrder } from '@features/webstore/services/webstore.api'

export function OrderRow({ o }: { o: WebOrder }) {
  const [open, setOpen] = useState(false)
  const update = useUpdateWebOrderStatus()
  // Un recojo en tienda no pasa por "en camino": de confirmado va directo a entregado
  const next = o.delivery === 'PICKUP' && o.status === 'CONFIRMED'
    ? { to: 'DELIVERED' as const, label: 'Marcar entregado' }
    : NEXT_STATUS[o.status]
  const wa = whatsappLink(o.phone, `Hola ${o.customerName}, te escribimos por tu pedido ${o.orderNumber}.`)

  const cancel = async () => {
    const ok = await confirmDialog({
      title: `¿Cancelar el pedido ${o.orderNumber}?`,
      description: 'El cliente no recibe aviso automático: avísale por WhatsApp.',
      confirmLabel: 'Cancelar pedido',
      cancelLabel: 'Volver',
    })
    if (ok) update.mutate({ id: o.id, status: 'CANCELLED' })
  }

  return (
    <li>
      <button onClick={() => setOpen(v => !v)} className="w-full px-5 py-3.5 flex items-center gap-4 text-left hover:bg-[var(--bg-subtle)] transition-colors">
        <span className="font-mono text-xs text-[var(--text-muted)] w-20 shrink-0">{o.orderNumber}</span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-medium truncate text-[var(--text-primary)]">{o.customerName}</span>
          <span className="block text-xs text-[var(--text-muted)]">
            {formatDateTime(o.createdAt)} · {o.items.length} {o.items.length === 1 ? 'producto' : 'productos'} · {o.delivery === 'SHIPPING' ? 'Envío' : 'Recojo'}
          </span>
        </span>
        {o.paymentStatus !== 'UNPAID' && <span className="hidden sm:block"><PaymentBadge status={o.paymentStatus} /></span>}
        <span className={`badge ${ORDER_STATUS[o.status].badge} shrink-0`}>{ORDER_STATUS[o.status].label}</span>
        <span className="w-28 text-right text-sm font-semibold tabular-nums shrink-0 text-[var(--text-primary)]">{formatCurrency(Number(o.total))}</span>
        <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-5 pb-5 grid gap-5 md:grid-cols-[1fr_280px]">
          <table className="w-full text-sm self-start">
            <tbody className="divide-y divide-[var(--border)]">
              {o.items.map(i => (
                <tr key={i.productId}>
                  <td className="py-2 pr-3 w-10 tabular-nums text-[var(--text-muted)]">{i.quantity}×</td>
                  <td className="py-2 pr-3 text-[var(--text-primary)]">{i.productName} <span className="font-mono text-xs text-[var(--text-muted)]">{i.productCode}</span></td>
                  <td className="py-2 text-right tabular-nums text-[var(--text-primary)]">{formatCurrency(Number(i.unitPrice) * i.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="rounded-lg p-4 space-y-2 text-sm bg-[var(--bg-subtle)] border border-[var(--border)]">
            <p className="flex items-start gap-2 text-[var(--text-primary)]">
              {o.delivery === 'SHIPPING' ? <Truck className="w-4 h-4 mt-0.5 shrink-0" /> : <Store className="w-4 h-4 mt-0.5 shrink-0" />}
              {o.delivery === 'SHIPPING' ? `${o.address}, ${o.district}` : 'Recojo en tienda'}
            </p>
            {o.car && <p className="flex items-start gap-2 text-[var(--text-primary)]"><Car className="w-4 h-4 mt-0.5 shrink-0" /> {o.car}</p>}
            <p className="text-[var(--text-muted)]">Medio de pago: {o.paymentMethod} · Tel. {o.phone}</p>

            <PaymentPanel order={o} />

            <div className="pt-2 flex flex-col gap-2">
              <a href={wa} target="_blank" rel="noreferrer">
                <Button variant="success" className="w-full" leftIcon={<MessageCircle className="w-4 h-4" />}>Escribir al cliente</Button>
              </a>
              {next && (
                <Button className="w-full" loading={update.isPending} onClick={() => update.mutate({ id: o.id, status: next.to })}>
                  {next.label}
                </Button>
              )}
              {o.status !== 'CANCELLED' && o.status !== 'DELIVERED' && (
                <Button variant="ghost" className="w-full" onClick={cancel}>Cancelar pedido</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </li>
  )
}
