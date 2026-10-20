// features/webstore/constants/labels.ts
// Textos y colores de los estados de un pedido web y de su pago.
import type { WebOrderStatus, WebPaymentStatus } from '@features/webstore/services/webstore.api'

export const ORDER_STATUS: Record<WebOrderStatus, { label: string; badge: string }> = {
  NEW:       { label: 'Nuevo',      badge: 'badge-warning' },
  CONFIRMED: { label: 'Confirmado', badge: 'badge-brand' },
  SHIPPED:   { label: 'En camino',  badge: 'badge-info' },
  DELIVERED: { label: 'Entregado',  badge: 'badge-success' },
  CANCELLED: { label: 'Cancelado',  badge: 'badge-neutral' },
}

// Siguiente paso natural de un pedido; los recojos en tienda se resuelven en OrderRow
export const NEXT_STATUS: Partial<Record<WebOrderStatus, { to: WebOrderStatus; label: string }>> = {
  NEW:       { to: 'CONFIRMED', label: 'Confirmar pedido' },
  CONFIRMED: { to: 'SHIPPED',   label: 'Marcar en camino' },
  SHIPPED:   { to: 'DELIVERED', label: 'Marcar entregado' },
}

export const PAYMENT_STATUS: Record<WebPaymentStatus, { label: string; badge: string }> = {
  UNPAID:    { label: 'Sin pago',      badge: 'badge-neutral' },
  SUBMITTED: { label: 'Por verificar', badge: 'badge-warning' },
  PAID:      { label: 'Pagado',        badge: 'badge-success' },
  REJECTED:  { label: 'Rechazado',     badge: 'badge-danger' },
}
