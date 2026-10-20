// features/sales/pages/NewSalePage.tsx
// Punto de venta. Aquí viven el carrito, el cliente elegido y los totales;
// cada sección de la pantalla está en features/sales/components/.
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useCreateSale } from '@features/sales/hooks/useSales'
import { includedIgv } from '@lib/igv'
import type { Product, Customer, PaymentMethod } from '@interfaces/api.types'
import { toast } from 'sonner'
import { ProductSearch } from '@features/sales/components/ProductSearch'
import { CartList, type CartItem } from '@features/sales/components/CartList'
import { CustomerPicker } from '@features/sales/components/CustomerPicker'
import { NewCustomerModal } from '@features/sales/components/NewCustomerModal'
import { PaymentMethodPicker } from '@features/sales/components/PaymentMethodPicker'
import { OrderSummary } from '@features/sales/components/OrderSummary'

export default function NewSalePage() {
  const navigate     = useNavigate()
  const createSale   = useCreateSale()

  const [selectedCustomer, setCustomer]     = useState<Customer | null>(null)
  const [cart, setCart]                     = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod]   = useState<PaymentMethod>('CASH')
  const [globalDiscount, setGlobalDiscount] = useState(0)
  const [notes, setNotes]                   = useState('')
  // null = modal cerrado; string = abierto con ese nombre precargado
  const [newCustomerName, setNewCustomerName] = useState<string | null>(null)

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) {
        return prev.map(i => i.product.id === product.id
          ? { ...i, quantity: Math.min(i.quantity + 1, product.stock) }
          : i)
      }
      if (product.stock === 0) { toast.error('Sin stock disponible'); return prev }
      return [...prev, { product, quantity: 1, discount: 0 }]
    })
  }, [])

  const updateQty = (productId: number, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.product.id !== productId) return i
      const newQty = i.quantity + delta
      if (newQty <= 0) return i
      if (newQty > i.product.stock) { toast.warning('Stock insuficiente'); return i }
      return { ...i, quantity: newQty }
    }))
  }

  const removeItem = (productId: number) => setCart(prev => prev.filter(i => i.product.id !== productId))

  // Totales: los precios ya incluyen IGV. El descuento se resta del precio con
  // IGV y el IGV se desglosa del total (no se suma). Es una vista previa: el
  // total oficial lo calcula el backend con la misma fórmula.
  const subtotal = cart.reduce((s, i) => s + (i.product.salePrice * i.quantity - i.discount), 0)
  const total    = Math.max(subtotal - globalDiscount, 0)
  const tax      = includedIgv(total)

  const handleSubmit = async () => {
    if (cart.length === 0) { toast.error('El carrito está vacío'); return }
    await createSale.mutateAsync({
      customerId:    selectedCustomer?.id,
      paymentMethod,
      globalDiscount,
      notes: notes || undefined,
      items: cart.map(i => ({ productId: i.product.id, quantity: i.quantity, discount: i.discount })),
    })
    navigate('/sales')
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/sales')} className="p-2 hover:bg-[var(--bg-subtle)] rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-[var(--text-muted)]" />
        </button>
        <div>
          <h1 className="page-title">Nueva Venta</h1>
          <p className="page-subtitle">Punto de venta</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ── Left: Product search + cart ────────────────────── */}
        <div className="lg:col-span-3 space-y-4">
          <ProductSearch onAdd={addToCart} />
          <CartList cart={cart} onUpdateQty={updateQty} onRemove={removeItem} />
        </div>

        {/* ── Right: Order summary ────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          <CustomerPicker
            selectedCustomer={selectedCustomer}
            onSelect={setCustomer}
            onRequestNewCustomer={setNewCustomerName}
          />
          <PaymentMethodPicker value={paymentMethod} onChange={setPaymentMethod} />
          <OrderSummary
            subtotal={subtotal}
            tax={tax}
            total={total}
            globalDiscount={globalDiscount}
            onDiscountChange={setGlobalDiscount}
            notes={notes}
            onNotesChange={setNotes}
            onConfirm={handleSubmit}
            canConfirm={cart.length > 0}
            isPending={createSale.isPending}
          />
        </div>
      </div>

      {/* Modal — Crear cliente rápido (sin salir de la venta) */}
      {newCustomerName !== null && (
        <NewCustomerModal
          initialName={newCustomerName}
          onClose={() => setNewCustomerName(null)}
          onCreated={customer => { setCustomer(customer); setNewCustomerName(null) }}
        />
      )}
    </div>
  )
}
