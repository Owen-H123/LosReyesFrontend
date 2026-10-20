// features/inventory/components/EntryModal.tsx
// Registrar una entrada de mercadería (compra a proveedor).
import { useState } from 'react'
import { PackagePlus } from 'lucide-react'
import { useRegisterEntry } from '@features/inventory/hooks/useInventory'
import { Button } from '@components/ui/Button'
import { ModalBody, ModalFooter } from '@components/ui/Modal'
import type { Product } from '@interfaces/api.types'
import { InventoryModal, ProductOptions } from '@features/inventory/components/InventoryModal'

export function EntryModal({ products, initialProductId = 0, onClose }: {
  products: Product[]
  // Producto ya elegido cuando se llega desde "Alertas de stock"
  initialProductId?: number
  onClose: () => void
}) {
  const [form, setForm] = useState({ productId: initialProductId, quantity: 1, unitCost: 0, observation: '' })
  const entryMutation = useRegisterEntry()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await entryMutation.mutateAsync({
      productId:   form.productId,
      quantity:    form.quantity,
      unitCost:    form.unitCost || undefined,
      observation: form.observation || undefined,
    })
    onClose()
  }

  return (
    <InventoryModal icon={<PackagePlus />} tone="success" title="Registrar entrada" description="Ingreso de mercadería por compra a proveedor." onClose={onClose}>
      <form onSubmit={handleSubmit} >
        <ModalBody>
        <div>
          <label className="field-label">Producto *</label>
          <select
            className="field-input"
            required
            value={form.productId || ''}
            onChange={e => setForm(f => ({ ...f, productId: Number(e.target.value) }))}
          >
            <ProductOptions products={products} />
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label">Cantidad *</label>
            <input
              type="number"
              className="field-input"
              required
              min={1}
              value={form.quantity}
              onChange={e => setForm(f => ({ ...f, quantity: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label className="field-label">Costo unitario</label>
            <input
              type="number"
              className="field-input"
              min={0}
              step="0.01"
              placeholder="0.00"
              value={form.unitCost || ''}
              onChange={e => setForm(f => ({ ...f, unitCost: Number(e.target.value) }))}
            />
          </div>
        </div>
        <div>
          <label className="field-label">Observación</label>
          <input
            className="field-input"
            placeholder="Proveedor, N° factura..."
            value={form.observation}
            onChange={e => setForm(f => ({ ...f, observation: e.target.value }))}
          />
        </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="success" loading={entryMutation.isPending}>
            Registrar entrada
          </Button>
        </ModalFooter>
      </form>
    </InventoryModal>
  )
}
