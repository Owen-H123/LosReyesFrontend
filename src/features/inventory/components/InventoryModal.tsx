// features/inventory/components/InventoryModal.tsx
// Marco común de los modales de Inventario, sobre el Modal global.
import { Modal, type ModalTone } from '@components/ui/Modal'

export function InventoryModal({ icon, tone, title, description, onClose, children }: {
  icon: React.ReactNode
  tone: ModalTone
  title: string
  description?: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <Modal icon={icon} tone={tone} title={title} description={description} onClose={onClose}>
      {children}
    </Modal>
  )
}

// Opciones del selector de producto, compartidas por los tres modales
export function ProductOptions({ products }: { products: { id: number; code: string; name: string; stock: number }[] }) {
  return (
    <>
      <option value="">Seleccionar producto...</option>
      {products.map(p => (
        <option key={p.id} value={p.id}>{p.code} — {p.name} (stock: {p.stock})</option>
      ))}
    </>
  )
}
