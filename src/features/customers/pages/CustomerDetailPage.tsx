// features/customers/pages/CustomerDetailPage.tsx
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, MapPin, FileText, ShoppingBag } from 'lucide-react'
import { useCustomerById, useCustomerSales } from '@features/customers/hooks/useCustomers'
import { PageLoader } from '@components/shared/PageLoader'
import { formatCurrency, formatDate } from '@lib/utils'

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const customerId = Number(id)

  const { data: customer, isLoading } = useCustomerById(customerId)
  const { data: sales } = useCustomerSales(customerId)

  if (isLoading) return <PageLoader />
  if (!customer) return (
    <div className="text-center py-20 text-[var(--text-muted)]">Cliente no encontrado</div>
  )

  const totalSpent = sales?.reduce((sum, s) => sum + s.total, 0) ?? 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/customers')}
          className="p-2 hover:bg-[var(--bg-subtle)] rounded-lg transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{customer.name}</h1>
          <p className="text-sm text-[var(--text-muted)]">
            {customer.documentType} · {customer.documentNumber}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          customer.active
            ? 'bg-[var(--success-light)] text-[var(--success)]'
            : 'bg-[var(--danger-light)] text-[var(--danger)]'
        }`}>
          {customer.active ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Info card */}
        <div className="space-y-4">
          <div className="card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Información de Contacto</h2>
            <div className="space-y-3">
              {customer.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                  <span className="text-[var(--text-muted)]">{customer.email}</span>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                  <span className="text-[var(--text-muted)]">{customer.phone}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                  <span className="text-[var(--text-muted)]">{customer.address}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <FileText className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                <span className="text-[var(--text-muted)]">Cliente desde {formatDate(customer.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Resumen</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--text-muted)]">Total compras</span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">{sales?.length ?? 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--text-muted)]">Total gastado</span>
                <span className="text-sm font-semibold text-[var(--accent-text)]">{formatCurrency(totalSpent)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sales history */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[var(--accent-text)]" />
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Historial de Compras</h2>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {!sales || sales.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-[var(--text-muted)]">
                  Sin compras registradas
                </div>
              ) : sales.map(sale => (
                <div
                  key={sale.id}
                  className="px-5 py-4 flex items-center justify-between hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
                  onClick={() => navigate(`/sales`)}
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{sale.saleNumber}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {formatDate(sale.saleDate)} · {sale.items.length} producto(s) · {sale.paymentMethod}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{formatCurrency(sale.total)}</p>
                    <span className={`text-xs ${
                      sale.status === 'COMPLETED' ? 'text-[var(--success)]' :
                      sale.status === 'CANCELLED' ? 'text-[var(--danger)]' :
                      'text-[var(--warning)]'
                    }`}>
                      {sale.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}