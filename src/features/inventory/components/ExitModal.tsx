// features/inventory/components/ExitModal.tsx
// Registrar una salida manual (merma, pérdida, devolución).
import { useState } from 'react'
import { PackageMinus } from 'lucide-react'
import { useRegisterExit } from '@features/inventory/hooks/useInventory'
import { Button } from '@components/ui/Button'
import { ModalBody, ModalFooter } from '@components/ui/Modal'
import type { Product } from '@interfaces/api.types'
import { InventoryModal, ProductOptions } from '@features/inventory/components/InventoryModal'

export function ExitModal({ products, onClose }: { products: Product[]; onClose: () => void }) {
  const [form, setForm] = useState({ productId: 0, quantity: 1, observation: '' })
  const exitMutation = useRegisterExit()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await exitMutation.mutateAsync({
      productId:   form.productId,
      quantity:    form.quantity,
      observation: form.observation || undefined,
    })
    onClose()
  }

  return (
    <InventoryModal icon={<PackageMinus />} tone="danger" title="Registrar salida" description="Merma, pérdida o devolución de un producto." onClose={onClose}>
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
          <label className="field-label">Motivo / Observación</label>
          <input
            className="field-input"
            placeholder="Merma, pérdida, devolución..."
            value={form.observation}
            onChange={e => setForm(f => ({ ...f, observation: e.target.value }))}
          />
        </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="danger" loading={exitMutation.isPending}>
            Registrar salida
          </Button>
        </ModalFooter>
      </form>
    </InventoryModal>
  )
}
