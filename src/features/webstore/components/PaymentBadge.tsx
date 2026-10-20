// features/webstore/components/PaymentBadge.tsx
import { PAYMENT_STATUS } from '@features/webstore/constants/labels'
import type { WebPaymentStatus } from '@features/webstore/services/webstore.api'

export function PaymentBadge({ status }: { status: WebPaymentStatus }) {
  const { label, badge } = PAYMENT_STATUS[status]
  return <span className={`badge ${badge} shrink-0`}>{label}</span>
}
