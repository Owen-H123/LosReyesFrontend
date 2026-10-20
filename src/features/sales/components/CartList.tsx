// features/sales/components/CartList.tsx
// Productos del carrito, con botones para cambiar la cantidad o quitarlos.
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, Trash2, ShoppingCart } from 'lucide-react'
import { formatCurrency } from '@lib/utils'
import type { Product } from '@interfaces/api.types'

export interface CartItem { product: Product; quantity: number; discount: number }

export function CartList({ cart, onUpdateQty, onRemove }: {
  cart: CartItem[]
  onUpdateQty: (productId: number, delta: number) => void
  onRemove: (productId: number) => void
}) {
  return (
    <div className="section-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title mb-0">Carrito</h3>
        {cart.length > 0 && (
          <span className="badge badge-brand">{cart.length} item(s)</span>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="w-10 h-10 text-[var(--border-hover)] mx-auto mb-2" />
          <p className="text-[var(--text-muted)] text-sm">Agrega productos buscando arriba</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {cart.map(item => (
              <motion.div key={item.product.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 p-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--text-primary)] text-sm font-medium truncate">{item.product.name}</p>
                  <p className="text-xs text-[var(--text-muted)] font-mono">{item.product.code}</p>
                </div>

                {/* Qty controls */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => onUpdateQty(item.product.id, -1)}
                    className="w-6 h-6 rounded bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center hover:border-[var(--border-hover)] transition-colors">
                    <Minus className="w-3 h-3 text-[var(--text-muted)]" />
                  </button>
                  <span className="w-8 text-center text-[var(--text-primary)] text-sm font-medium">{item.quantity}</span>
                  <button onClick={() => onUpdateQty(item.product.id, 1)}
                    className="w-6 h-6 rounded bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center hover:border-[var(--border-hover)] transition-colors">
                    <Plus className="w-3 h-3 text-[var(--text-muted)]" />
                  </button>
                </div>

                <div className="text-right flex-shrink-0 w-20">
                  <p className="text-[var(--text-primary)] text-sm font-semibold">
                    {formatCurrency(item.product.salePrice * item.quantity - item.discount)}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">{formatCurrency(item.product.salePrice)} c/u</p>
                </div>

                <button onClick={() => onRemove(item.product.id)}
                  className="p-1 hover:bg-[var(--danger-light)] rounded text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
