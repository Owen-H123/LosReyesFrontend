// features/webstore/pages/WebstorePage.tsx
// Módulo "Resumen" de la tienda online: indicadores, últimos pedidos y lo más pedido.
import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { PageHeader } from '@components/ui/Form'
import { Button } from '@components/ui/Button'
import { formatCurrency, formatDateTime } from '@lib/utils'
import { useWebOrders, useWebstoreSummary, useWebTopProducts } from '@features/webstore/hooks/useWebstore'
import { ORDER_STATUS } from '@features/webstore/constants/labels'
import { ROUTES } from '@app/router/routes'
import { STORE_URL } from '@features/webstore/constants/store'


export default function WebstorePage() {
  const { data: summary } = useWebstoreSummary()
  const { data: recent } = useWebOrders({ size: 6 })
  const { data: top } = useWebTopProducts()

  const tiles = summary ? [
    { label: 'Por atender', value: summary.newCount, hint: 'Pedidos nuevos sin confirmar', strong: summary.newCount > 0, to: `${ROUTES.webstore.orders}?estado=NEW` },
    { label: 'Entregas pendientes', value: summary.deliveriesPending, hint: `${summary.confirmedCount} por despachar · ${summary.shippedCount} en camino`, to: ROUTES.webstore.deliveries },
    { label: 'Pedidos del mes', value: summary.monthCount, hint: `${formatCurrency(Number(summary.monthTotal))} sin cancelados`, to: ROUTES.webstore.orders },
    { label: 'Pagos por verificar', value: summary.paymentsToVerify, hint: `Yape informados · ${summary.publishedProducts} productos publicados`, strong: summary.paymentsToVerify > 0, to: `${ROUTES.webstore.orders}?pago=SUBMITTED` },
  ] : []

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader
        title="Tienda online"
        subtitle="Resumen de lo que pasa en la web. Cada área tiene su propio módulo en el menú."
        actions={
          <a href={STORE_URL} target="_blank" rel="noreferrer">
            <Button variant="secondary" leftIcon={<ExternalLink className="w-4 h-4" />}>Ver la tienda</Button>
          </a>
        }
      />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {(summary ? tiles : Array.from({ length: 4 }, () => null)).map((t, i) => t ? (
          <Link
            key={t.label}
            to={t.to}
            className="card p-5 block"
            style={t.strong ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: 'var(--accent-contrast)' } : undefined}
          >
            <p className="text-[13px] font-medium" style={{ color: t.strong ? 'inherit' : 'var(--text-muted)', opacity: t.strong ? 0.85 : 1 }}>{t.label}</p>
            <p className="mt-2 text-[28px] font-bold tracking-tight leading-none tabular-nums" style={{ color: t.strong ? 'inherit' : 'var(--text-primary)' }}>{t.value}</p>
            <p className="mt-2 text-xs" style={{ color: t.strong ? 'inherit' : 'var(--text-muted)', opacity: t.strong ? 0.85 : 1 }}>{t.hint}</p>
          </Link>
        ) : <div key={i} className="card p-5"><div className="skeleton h-20 w-full" /></div>)}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
            <h2 className="section-title">Últimos pedidos</h2>
            <Link to={ROUTES.webstore.orders} className="text-[13px] font-medium text-[var(--accent-text)] hover:underline">Ver todos</Link>
          </div>
          {!recent ? (
            <div className="p-5 space-y-3">{[0, 1, 2].map(i => <div key={i} className="skeleton h-10 w-full" />)}</div>
          ) : !recent.content.length ? (
            <p className="py-12 text-center text-sm text-[var(--text-muted)]">Todavía no hay pedidos web.</p>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {recent.content.map(o => (
                <li key={o.id} className="px-5 py-3 flex items-center gap-4">
                  <span className="font-mono text-xs text-[var(--text-muted)] w-20 shrink-0">{o.orderNumber}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium truncate text-[var(--text-primary)]">{o.customerName}</span>
                    <span className="block text-xs text-[var(--text-muted)]">{formatDateTime(o.createdAt)}</span>
                  </span>
                  <span className={`badge ${ORDER_STATUS[o.status].badge} shrink-0`}>{ORDER_STATUS[o.status].label}</span>
                  <span className="w-24 text-right text-sm font-semibold tabular-nums shrink-0">{formatCurrency(Number(o.total))}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border)]">
            <h2 className="section-title">Más pedidos (30 días)</h2>
          </div>
          {!top ? (
            <div className="p-5 space-y-3">{[0, 1, 2].map(i => <div key={i} className="skeleton h-10 w-full" />)}</div>
          ) : !top.length ? (
            <p className="py-12 text-center text-sm text-[var(--text-muted)]">Aún no hay datos.</p>
          ) : (
            <ol className="divide-y divide-[var(--border)]">
              {top.map((p, i) => (
                <li key={p.code} className="px-5 py-3 flex items-center gap-3">
                  <span className="w-5 text-sm font-semibold tabular-nums text-[var(--text-muted)]">{i + 1}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium truncate text-[var(--text-primary)]">{p.name}</span>
                    <span className="block text-xs font-mono text-[var(--text-muted)]">{p.code}</span>
                  </span>
                  <span className="text-right shrink-0">
                    <span className="block text-sm font-semibold tabular-nums">{p.units} uds.</span>
                    <span className="block text-xs text-[var(--text-muted)] tabular-nums">{formatCurrency(Number(p.amount))}</span>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <p className="text-xs text-[var(--text-muted)]">
        Los pedidos web no descuentan stock. Al entregar, registra la venta en POS / Ventas para que el inventario se actualice.
      </p>
    </div>
  )
}
