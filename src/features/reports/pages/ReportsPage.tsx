// features/reports/pages/ReportsPage.tsx
import { useState } from 'react'
import {
  FileText, BarChart3, TrendingUp,
  FileSpreadsheet, AlertTriangle
} from 'lucide-react'
import { Button } from '@components/ui/Button'
import { formatCurrency } from '@lib/utils'
import {
  useDailySalesReport, useTopProductsReport, useLowStockReport,
  useDownloadDailySalesExcel, useDownloadDailySalesPdf, useDownloadLowStockExcel
} from '@features/reports/hooks/useReports'

type Tab = 'sales' | 'products' | 'lowstock'

function getDefaultDates() {
  const to   = new Date()
  const from = new Date()
  from.setDate(from.getDate() - 30)
  return {
    from: from.toISOString().slice(0, 10),
    to:   to.toISOString().slice(0, 10),
  }
}

export default function ReportsPage() {
  const [tab, setTab]       = useState<Tab>('sales')
  const [dates, setDates]   = useState(getDefaultDates())

  const salesReport      = useDailySalesReport(dates)
  const topProducts      = useTopProductsReport({ ...dates, limit: 10 })
  const lowStock         = useLowStockReport()
  const dlExcel          = useDownloadDailySalesExcel()
  const dlPdf            = useDownloadDailySalesPdf()
  const dlLowStock       = useDownloadLowStockExcel()

  const TABS = [
    { id: 'sales',    label: 'Ventas Diarias', icon: BarChart3 },
    { id: 'products', label: 'Top Productos',  icon: TrendingUp },
    { id: 'lowstock', label: 'Stock Bajo',     icon: AlertTriangle },
  ] as const

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Reportes</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Análisis e informes del negocio</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--bg-subtle)] rounded-lg w-fit">
        {TABS.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as Tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Date range (for sales + products tabs) */}
      {tab !== 'lowstock' && (
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1">Desde</label>
              <input
                type="date"
                className="field-input"
                value={dates.from}
                onChange={e => setDates(d => ({ ...d, from: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1">Hasta</label>
              <input
                type="date"
                className="field-input"
                value={dates.to}
                onChange={e => setDates(d => ({ ...d, to: e.target.value }))}
              />
            </div>
          </div>

          {tab === 'sales' && (
            <div className="flex gap-2 self-end">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<FileSpreadsheet className="w-4 h-4" />}
                loading={dlExcel.isPending}
                onClick={() => dlExcel.mutate(dates)}
              >
                Excel
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<FileText className="w-4 h-4" />}
                loading={dlPdf.isPending}
                onClick={() => dlPdf.mutate(dates)}
              >
                PDF
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── SALES TAB ─────────────────────────────────────────── */}
      {tab === 'sales' && (
        <div className="space-y-4">
          {/* Summary cards */}
          {salesReport.data && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Total Ingresos', value: formatCurrency(salesReport.data.totalRevenue), color: 'text-[var(--success)]' },
                { label: 'Total Ventas',   value: salesReport.data.totalSales.toString(),         color: 'text-[var(--accent-text)]' },
                { label: 'Periodo',        value: `${salesReport.data.from} → ${salesReport.data.to}`, color: 'text-[var(--text-primary)]' },
              ].map(s => (
                <div key={s.label} className="card p-4">
                  <p className="text-xs text-[var(--text-muted)] mb-1">{s.label}</p>
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    {['Fecha', 'N° Ventas', 'Ingresos', 'Ingreso Neto'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {salesReport.isLoading ? (
                    <tr><td colSpan={4} className="px-4 py-12 text-center text-[var(--text-muted)]">Cargando...</td></tr>
                  ) : !salesReport.data?.rows.length ? (
                    <tr><td colSpan={4} className="px-4 py-12 text-center text-[var(--text-muted)]">Sin datos en el período</td></tr>
                  ) : salesReport.data.rows.map(row => (
                    <tr key={row.day} className="hover:bg-[var(--bg-subtle)] transition-colors">
                      <td className="px-4 py-3 text-sm text-[var(--text-primary)]">{row.day}</td>
                      <td className="px-4 py-3 text-sm text-[var(--text-muted)]">{row.count}</td>
                      <td className="px-4 py-3 text-sm text-[var(--text-primary)] font-medium">{formatCurrency(row.revenue)}</td>
                      <td className="px-4 py-3 text-sm text-[var(--success)]">{formatCurrency(row.netRevenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TOP PRODUCTS TAB ──────────────────────────────────── */}
      {tab === 'products' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {['#', 'Código', 'Producto', 'Unidades', 'Ingresos'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {topProducts.isLoading ? (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-[var(--text-muted)]">Cargando...</td></tr>
                ) : !topProducts.data?.length ? (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-[var(--text-muted)]">Sin datos</td></tr>
                ) : topProducts.data.map((p, i) => (
                  <tr key={p.productId} className="hover:bg-[var(--bg-subtle)] transition-colors">
                    <td className="px-4 py-3 text-sm font-bold text-[var(--text-muted)]">#{i + 1}</td>
                    <td className="px-4 py-3 text-sm font-mono text-[var(--accent-text)]">{p.code}</td>
                    <td className="px-4 py-3 text-sm text-[var(--text-primary)]">{p.name}</td>
                    <td className="px-4 py-3 text-sm text-[var(--text-muted)]">{p.totalQty}</td>
                    <td className="px-4 py-3 text-sm font-medium text-[var(--text-primary)]">{formatCurrency(p.totalRevenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── LOW STOCK TAB ─────────────────────────────────────── */}
      {tab === 'lowstock' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<FileSpreadsheet className="w-4 h-4" />}
              loading={dlLowStock.isPending}
              onClick={() => dlLowStock.mutate()}
            >
              Exportar Excel
            </Button>
          </div>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    {['Código', 'Producto', 'Categoría', 'Stock Actual', 'Stock Mínimo', 'Faltante'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {lowStock.isLoading ? (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-[var(--text-muted)]">Cargando...</td></tr>
                  ) : !lowStock.data?.length ? (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-[var(--success)]">✓ Todo el stock está en niveles correctos</td></tr>
                  ) : lowStock.data.map(row => (
                    <tr key={row.productId} className="hover:bg-[var(--bg-subtle)] transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-[var(--accent-text)]">{row.code}</td>
                      <td className="px-4 py-3 text-sm text-[var(--text-primary)]">{row.name}</td>
                      <td className="px-4 py-3 text-sm text-[var(--text-muted)]">{row.category}</td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-[var(--danger)]">{row.currentStock}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text-muted)]">{row.minimumStock}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-[var(--danger-light)] text-[var(--danger)] text-xs font-medium rounded">
                          -{row.shortage}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}