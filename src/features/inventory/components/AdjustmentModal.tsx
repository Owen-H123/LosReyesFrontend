// features/inventory/components/AdjustmentModal.tsx
// Ajustar el stock a un valor exacto (conteo físico). Solo ADMIN.
import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { useRegisterAdjustment } from '@features/inventory/hooks/useInventory'
import { Button } from '@components/ui/Button'
import { ModalBody, ModalFooter } from '@components/ui/Modal'
import type { Product } from '@interfaces/api.types'
import { InventoryModal, ProductOptions } from '@features/inventory/components/InventoryModal'

export function AdjustmentModal({ products, onClose }: { products: Product[]; onClose: () => void }) {
  const [form, setForm] = useState({ productId: 0, newStock: 0, observation: '' })
  const adjustMutation = useRegisterAdjustment()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await adjustMutation.mutateAsync({
      productId:   form.productId,
      newStock:    form.newStock,
      observation: form.observation || undefined,
    })
    onClose()
  }

  return (
    <InventoryModal icon={<SlidersHorizontal />} tone="warning" title="Ajustar stock" description="Fija el stock exacto tras un conteo físico." onClose={onClose}>
      <form onSubmit={handleSubmit} >
        <ModalBody>
        <div>
          <label className="field-label">Producto *</label>
          <select
            className="field-input"
            required
            value={form.productId || ''}
            onChange={e => {
              // Al elegir el producto, el campo arranca con su stock actual
              const p = products.find(p => p.id === Number(e.target.value))
              setForm(f => ({ ...f, productId: Number(e.target.value), newStock: p?.stock ?? 0 }))
            }}
          >
            <ProductOptions products={products} />
          </select>
        </div>
        <div>
          <label className="field-label">Nuevo stock *</label>
          <input
            type="number"
            className="field-input"
            required
            min={0}
            value={form.newStock}
            onChange={e => setForm(f => ({ ...f, newStock: Number(e.target.value) }))}
          />
        </div>
        <div>
          <label className="field-label">Motivo del ajuste *</label>
          <input
            className="field-input"
            required
            placeholder="Conteo físico, inventario..."
            value={form.observation}
            onChange={e => setForm(f => ({ ...f, observation: e.target.value }))}
          />
        </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button
            type="submit"
            loading={adjustMutation.isPending}
          >
            Aplicar ajuste
          </Button>
        </ModalFooter>
      </form>
    </InventoryModal>
  )
}
