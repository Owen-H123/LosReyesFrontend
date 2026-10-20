// features/webstore/components/PaymentPanel.tsx
// Bloque de pago dentro del detalle de un pedido: muestra el código de operación que
// informó el cliente y deja verificarlo (contra los Yape recibidos) o rechazarlo.
import { Check, X } from 'lucide-react'
import { Button } from '@components/ui/Button'
import { confirmDialog } from '@components/ui/confirm'
import { formatCurrency, formatDateTime } from '@lib/utils'
import { useVerifyWebPayment } from '@features/webstore/hooks/useWebstore'
import { PaymentBadge } from '@features/webstore/components/PaymentBadge'
import type { WebOrder } from '@features/webstore/services/webstore.api'

export function PaymentPanel({ order }: { order: WebOrder }) {
  const verify = useVerifyWebPayment()
  const toVerify = order.paymentStatus === 'SUBMITTED'

  const reject = async () => {
    const ok = await confirmDialog({
      title: `¿Rechazar el pago de ${order.orderNumber}?`,
      description: 'El cliente verá que no pudimos verificarlo y podrá enviar otro código.',
      confirmLabel: 'Rechazar pago',
      cancelLabel: 'Volver',
    })
    if (ok) verify.mutate({ id: order.id, status: 'REJECTED' })
  }

  return (
    <div className="pt-3 mt-1 border-t border-[var(--border)] space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[var(--text-muted)]">Pago</span>
        <PaymentBadge status={order.paymentStatus} />
      </div>

      {order.paymentOperationCode && (
        <p className="text-[var(--text-primary)]">
          Operación <span className="font-mono font-semibold">{order.paymentOperationCode}</span>
          {order.paymentSubmittedAt && <span className="block text-xs text-[var(--text-muted)]">Enviada {formatDateTime(order.paymentSubmittedAt)}</span>}
        </p>
      )}

      {toVerify && (
        <>
          <p className="text-xs text-[var(--text-muted)]">
            Busca esa operación en tu Yape y confirma que el monto sea {formatCurrency(Number(order.total))}.
          </p>
          <div className="flex gap-2">
            <Button className="flex-1" variant="success" loading={verify.isPending} leftIcon={<Check className="w-4 h-4" />}
              onClick={() => verify.mutate({ id: order.id, status: 'PAID' })}>Confirmar</Button>
            <Button className="flex-1" variant="secondary" disabled={verify.isPending} leftIcon={<X className="w-4 h-4" />} onClick={reject}>Rechazar</Button>
          </div>
        </>
      )}
    </div>
  )
}
