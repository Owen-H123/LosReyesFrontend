// features/sales/components/ProductSearch.tsx
// Buscador de productos activos. Al elegir uno se agrega al carrito y el
// buscador se limpia.
import { useState } from 'react'
import { Search } from 'lucide-react'
import { useDebounce } from 'use-debounce'
import { useProducts } from '@features/products/hooks/useProducts'
import { formatCurrency } from '@lib/utils'
import type { Product } from '@interfaces/api.types'
import { saleInputClass } from '@features/sales/components/saleStyles'

export function ProductSearch({ onAdd }: { onAdd: (product: Product) => void }) {
  const [productSearch, setProductSearch] = useState('')
  const [debouncedProduct] = useDebounce(productSearch, 300)
  const { data: products } = useProducts({ search: debouncedProduct, status: 'ACTIVE', size: 8 })

  const handleAdd = (product: Product) => {
    onAdd(product)
    setProductSearch('')
  }

  return (
    <div className="section-card">
      <h3 className="section-title">Buscar Producto</h3>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        <input value={productSearch} onChange={e => setProductSearch(e.target.value)}
          placeholder="Buscar por código, nombre o marca..." className={`${saleInputClass} pl-10`} />
      </div>

      {productSearch && products?.content && products.content.length > 0 && (
        <div className="mt-2 space-y-1">
          {products.content.map(p => (
            <button key={p.id} onClick={() => handleAdd(p)}
              className="w-full flex items-center justify-between p-3 bg-[var(--bg-base)] border border-[var(--border)] hover:border-[var(--accent)] rounded-lg transition-all group">
              <div className="text-left">
                <p className="text-[var(--text-primary)] text-sm font-medium">{p.name}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  <span className="font-mono text-[var(--accent-text)]">{p.code}</span>
                  {p.brand && ` · ${p.brand}`}
                </p>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <p className="text-[var(--text-primary)] font-semibold">{formatCurrency(p.salePrice)}</p>
                <p className={`text-xs ${p.lowStock ? 'text-[var(--danger)]' : 'text-[var(--text-muted)]'}`}>
                  Stock: {p.stock}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
