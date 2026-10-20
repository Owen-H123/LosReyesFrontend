// features/products/pages/ProductsPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search, Package, AlertTriangle, Edit, Trash2 } from 'lucide-react'
import { useProducts, useDeleteProduct } from '@features/products/hooks/useProducts'
import { usePermission } from '@features/auth/hooks/usePermission'
import { formatCurrency, formatPercent, getImageUrl } from '@lib/utils'
import type { ProductStatus } from '@interfaces/api.types'
import { useDebounce } from 'use-debounce'
import { confirmDialog } from '@components/ui/confirm'
import { useCategoriesActive } from '@features/categories/hooks/useCategories'

const STATUS_STYLES: Record<ProductStatus, string> = {
  ACTIVE:       'badge-success',
  INACTIVE:     'badge-neutral',
  DISCONTINUED: 'badge badge-warning',
}
const STATUS_LABELS: Record<ProductStatus, string> = {
  ACTIVE:       'Activo',
  INACTIVE:     'Inactivo',
  DISCONTINUED: 'Descontinuado',
}

export default function ProductsPage() {
  const navigate = useNavigate()
  const { canDeleteProducts } = usePermission()
  const { mutate: deleteProduct } = useDeleteProduct()

  const [search, setSearch]         = useState('')
  const [categoryId, setCategoryId] = useState<number | undefined>()
  const [status, setStatus]         = useState<string | undefined>()
  const [page, setPage]             = useState(0)

  const [debouncedSearch] = useDebounce(search, 400)
  const { data, isLoading } = useProducts({ search: debouncedSearch, categoryId, status, page, size: 20 })
  const { data: categories }   = useCategoriesActive()

  const handleDelete = async (id: number, name: string) => {
    const ok = await confirmDialog({
      title: '¿Eliminar producto?',
      description: `"${name}" dejará de aparecer en el catálogo. Esta acción no se puede deshacer.`,
      confirmLabel: 'Eliminar',
    })
    if (!ok) return
    deleteProduct(id)
  }

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Productos</h1>
          <p className="page-subtitle">Gestión de repuestos y accesorios</p>
        </div>
        <button
          onClick={() => navigate('/products/new')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
          style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
        >
          <Plus className="w-4 h-4" />
          Agregar Producto
        </button>
      </div>

      {/* ── Filters ────────────────────────────────────────── */}
      <div className="section-card">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0) }}
              placeholder="Buscar por código, nombre o marca..."
              className="field-input pl-10"
            />
          </div>

          {/* Category */}
          <select
            value={categoryId ?? ''}
            onChange={e => { setCategoryId(e.target.value ? Number(e.target.value) : undefined); setPage(0) }}
            className="field-input w-auto min-w-[160px]"
          >
            <option value="">Todas las categorías</option>
            {categories?.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Status */}
          <select
            value={status ?? ''}
            onChange={e => { setStatus(e.target.value || undefined); setPage(0) }}
            className="field-input w-auto min-w-[140px]"
          >
            <option value="">Todos los estados</option>
            <option value="ACTIVE">Activos</option>
            <option value="INACTIVE">Inactivos</option>
            <option value="DISCONTINUED">Descontinuados</option>
          </select>
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────── */}
      <div className="section-card p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Costo</th>
                <th>Precio (con IGV)</th>
                <th>Margen</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {isLoading && Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <td key={j}><div className="skeleton h-4 w-full" /></td>
                  ))}
                </tr>
              ))}

              {!isLoading && data?.content.map((product, i) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <td>
                    <span className="font-mono text-xs text-[var(--accent-text)]">{product.code}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      {product.imageUrl ? (
                        <img
                          src={getImageUrl(product.imageUrl) ?? undefined}
                          alt={product.name}
                          className="w-9 h-9 rounded-lg object-cover border border-[var(--border)] flex-shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
                          <Package className="w-4 h-4 text-[var(--text-muted)]" />
                        </div>
                      )}
                      <div>
                        <p className="text-[var(--text-primary)] font-medium">{product.name}</p>
                        {product.brand && <p className="text-xs text-[var(--text-muted)]">{product.brand}</p>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-sm">{product.categoryName}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <span className={`font-semibold ${product.lowStock ? 'text-[var(--danger)]' : 'text-[var(--text-primary)]'}`}>
                        {product.stock}
                      </span>
                      {product.lowStock && (
                        <AlertTriangle className="w-3.5 h-3.5 text-[var(--danger)]" />
                      )}
                    </div>
                  </td>
                  <td className="text-[var(--text-muted)]">{formatCurrency(product.costPrice)}</td>
                  <td className="text-[var(--text-primary)] font-medium">{formatCurrency(product.salePrice)}</td>
                  <td>
                    <span className={`text-sm font-medium ${product.profitMargin >= 20 ? 'text-[var(--success)]' : 'text-[var(--warning)]'}`}>
                      {formatPercent(product.profitMargin ?? 0)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${STATUS_STYLES[product.status]}`}>
                      {STATUS_LABELS[product.status]}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="p-1.5 hover:bg-[var(--bg-subtle)] rounded-lg transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {canDeleteProducts && (
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-1.5 hover:bg-[var(--danger-light)] rounded-lg transition-colors text-[var(--text-muted)] hover:text-[var(--danger)]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}

              {!isLoading && data?.content.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-16">
                    <Package className="w-12 h-12 text-[var(--border-hover)] mx-auto mb-3" />
                    <p className="text-[var(--text-muted)]">No se encontraron productos</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)]">
              {data.totalElements} productos · Página {data.page + 1} de {data.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={data.first}
                className="px-3 py-1 text-xs bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--border-hover)] text-[var(--text-muted)] rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={data.last}
                className="px-3 py-1 text-xs bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--border-hover)] text-[var(--text-muted)] rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}