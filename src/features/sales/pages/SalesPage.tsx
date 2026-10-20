// features/sales/pages/SalesPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, ShoppingCart, Eye } from 'lucide-react'
import { useSales } from '@features/sales/hooks/useSales'
import { formatCurrency, formatDateTime, SALE_STATUS_LABELS, PAYMENT_METHOD_LABELS } from '@lib/utils'
import type { Sale, SaleStatus } from '@interfaces/api.types'
import SaleDetailDrawer from '@features/sales/components/SaleDetailDrawer'

const STATUS_STYLES: Record<SaleStatus, string> = {
  COMPLETED: 'badge-success',
  PENDING:   'badge-warning',
  CANCELLED: 'badge-danger',
  REFUNDED:  'badge-neutral',
}

export default function SalesPage() {
  const navigate            = useNavigate()
  const [status, setStatus] = useState<string>('')
  const [page, setPage]     = useState(0)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)

  const { data, isLoading } = useSales({ status: status || undefined, page, size: 20 })

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Ventas</h1>
          <p className="page-subtitle">Historial y registro de transacciones</p>
        </div>
        <button onClick={() => navigate('/sales/new')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
          style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}>
          <Plus className="w-4 h-4" />Nueva Venta
        </button>
      </div>

      {/* Filters */}
      <div className="section-card">
        <div className="flex gap-2 flex-wrap">
          {['', 'COMPLETED', 'PENDING', 'CANCELLED'].map(s => (
            <button key={s} onClick={() => { setStatus(s); setPage(0) }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${status === s
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg-base)] border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-hover)]'}`}>
              {s === '' ? 'Todas' : SALE_STATUS_LABELS[s as SaleStatus]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="section-card p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Número</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Vendedor</th>
                <th>Items</th>
                <th>Pago</th>
                <th>Total</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {isLoading && Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 9 }).map((_, j) => (
                  <td key={j}><div className="skeleton h-4 w-full" /></td>
                ))}</tr>
              ))}
              {!isLoading && data?.content.map((sale, i) => (
                <motion.tr
                  key={sale.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  onClick={() => setSelectedSale(sale)}
                  className="cursor-pointer hover:bg-[var(--bg-base)] transition-colors">
                  <td>
                    <span className="font-mono text-[var(--accent-text)] text-xs">{sale.saleNumber}</span>
                  </td>
                  <td className="text-xs">{formatDateTime(sale.saleDate)}</td>
                  <td className="text-sm">{sale.customerName ?? <span className="text-[var(--text-muted)]">Sin cliente</span>}</td>
                  <td className="text-sm">{sale.userName}</td>
                  <td className="text-center">{sale.items.length}</td>
                  <td><span className="badge badge-neutral">{PAYMENT_METHOD_LABELS[sale.paymentMethod]}</span></td>
                  <td className="font-semibold text-[var(--text-primary)]">{formatCurrency(sale.total)}</td>
                  <td><span className={`badge ${STATUS_STYLES[sale.status]}`}>{SALE_STATUS_LABELS[sale.status]}</span></td>
                  <td>
                    <div className="flex items-center justify-end">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedSale(sale) }}
                        title="Ver detalle"
                        className="p-1.5 hover:bg-[var(--accent-light)] rounded-lg text-[var(--text-muted)] hover:text-[var(--accent-text)] transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {!isLoading && data?.content.length === 0 && (
                <tr><td colSpan={9} className="text-center py-16">
                  <ShoppingCart className="w-10 h-10 text-[var(--border-hover)] mx-auto mb-3" />
                  <p className="text-[var(--text-muted)]">Sin ventas registradas</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)]">{data.totalElements} ventas · Página {data.page + 1} de {data.totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => p - 1)} disabled={data.first}
                className="px-3 py-1 text-xs bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] rounded-lg disabled:opacity-40 transition-all">Anterior</button>
              <button onClick={() => setPage(p => p + 1)} disabled={data.last}
                className="px-3 py-1 text-xs bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] rounded-lg disabled:opacity-40 transition-all">Siguiente</button>
            </div>
          </div>
        )}
      </div>

      <SaleDetailDrawer sale={selectedSale} onClose={() => setSelectedSale(null)} />
    </div>
  )
}