// features/sales/components/NewCustomerModal.tsx
// Crear un cliente rápido sin salir de la venta.
import { useState } from 'react'
import { useCreateCustomer } from '@features/customers/hooks/useCustomers'
import type { Customer, DocumentType } from '@interfaces/api.types'
import { UserPlus } from 'lucide-react'
import { Button } from '@components/ui/Button'
import { Modal, ModalBody, ModalFooter } from '@components/ui/Modal'
import { CellphoneField, DocumentFields } from '@features/customers/components/CustomerDocumentFields'

export function NewCustomerModal({ initialName, onClose, onCreated }: {
  initialName: string
  onClose: () => void
  onCreated: (customer: Customer) => void
}) {
  const [form, setForm] = useState({
    documentType: 'DNI' as DocumentType,
    documentNumber: '',
    name: initialName,
    email: '',
    phone: '',
  })
  const createCustomer = useCreateCustomer()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const created = await createCustomer.mutateAsync({
      documentType: form.documentType,
      documentNumber: form.documentNumber,
      name: form.name,
      email: form.email || undefined,
      phone: form.phone || undefined,
    })
    onCreated(created)
  }

  return (
    <Modal title="Nuevo cliente" description="Créalo sin salir de la venta." icon={<UserPlus />} onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <ModalBody>
          <DocumentFields
            documentType={form.documentType}
            documentNumber={form.documentNumber}
            onChange={doc => setForm(f => ({ ...f, ...doc }))}
            labelClassName="field-label"
            inputClassName="field-input"
          />
          <div>
            <label className="field-label">Nombre completo / Razón social *</label>
            <input
              className="field-input"
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Email</label>
              <input
                type="email"
                className="field-input"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="Para enviarle la boleta"
              />
            </div>
            <CellphoneField
              value={form.phone}
              onChange={phone => setForm(f => ({ ...f, phone }))}
              labelClassName="field-label"
              inputClassName="field-input"
            />
          </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit" loading={createCustomer.isPending}>Crear cliente</Button>
          </ModalFooter>
        </form>
    </Modal>
  )
}
