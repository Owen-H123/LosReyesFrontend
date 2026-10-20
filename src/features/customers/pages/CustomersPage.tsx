// features/customers/pages/CustomersPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, UserCheck, UserX, Eye, Pencil, Ban } from 'lucide-react'
import { useDebounce } from '@hooks/useDebounce'
import { Button } from '@components/ui/Button'
import { Modal, ModalBody, ModalFooter } from '@components/ui/Modal'
import { confirmDialog } from '@components/ui/confirm'
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeactivateCustomer } from '@features/customers/hooks/useCustomers'
import type { Customer, DocumentType } from '@interfaces/api.types'
import { CellphoneField, DocumentFields } from '@features/customers/components/CustomerDocumentFields'

interface FormState {
  documentType: DocumentType
  documentNumber: string
  name: string
  email: string
  phone: string
  address: string
}

const INITIAL_FORM: FormState = {
  documentType: 'DNI',
  documentNumber: '',
  name: '',
  email: '',
  phone: '',
  address: '',
}

export default function CustomersPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)

  const debouncedSearch = useDebounce(search, 350)
  const { data, isLoading } = useCustomers({ search: debouncedSearch })
  const createMutation     = useCreateCustomer()
  const updateMutation     = useUpdateCustomer(editingCustomer?.id ?? 0)
  const deactivateMutation = useDeactivateCustomer()

  const customers = data?.content ?? []

  const openCreateModal = () => {
    setEditingCustomer(null)
    setForm(INITIAL_FORM)
    setShowModal(true)
  }

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer)
    setForm({
      documentType: customer.documentType,
      documentNumber: customer.documentNumber,
      name: customer.name,
      email: customer.email ?? '',
      phone: customer.phone ?? '',
      address: customer.address ?? '',
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCustomer(null)
    setForm(INITIAL_FORM)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCustomer) {
      await updateMutation.mutateAsync(form)
    } else {
      await createMutation.mutateAsync(form)
    }
    closeModal()
  }

  const handleDeactivate = async (customer: Customer) => {
    const confirmed = await confirmDialog({
      title: `¿Desactivar a ${customer.name}?`,
      description: 'Su historial de ventas se conserva, pero hoy el sistema no tiene un botón para reactivarlo.',
      confirmLabel: 'Desactivar',
      tone: 'warning',
    })
    if (!confirmed) return
    deactivateMutation.mutate(customer.id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Clientes</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            {data?.totalElements ?? 0} clientes registrados
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreateModal}>
          Nuevo Cliente
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        <input
          className="field-input pl-9"
          placeholder="Buscar por nombre o documento..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Tipo Doc', 'N° Documento', 'Nombre', 'Email', 'Celular', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[var(--text-muted)]">
                    Cargando clientes...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[var(--text-muted)]">
                    No se encontraron clientes
                  </td>
                </tr>
              ) : customers.map(c => (
                <tr key={c.id} className="hover:bg-[var(--bg-subtle)] transition-colors group">
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-[var(--accent-light)] text-[var(--accent-text)] text-xs font-medium rounded">
                      {c.documentType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-[var(--text-primary)]">{c.documentNumber}</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-primary)] font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-muted)]">{c.email ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-muted)]">{c.phone ?? '—'}</td>
                  <td className="px-4 py-3">
                    {c.active ? (
                      <span className="flex items-center gap-1.5 text-xs text-[var(--success)]">
                        <UserCheck className="w-3.5 h-3.5" /> Activo
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-[var(--danger)]">
                        <UserX className="w-3.5 h-3.5" /> Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/customers/${c.id}`)}
                        title="Ver historial de compras"
                        className="p-1.5 hover:bg-[var(--bg-subtle)] rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(c)}
                        title="Editar datos del cliente"
                        className="p-1.5 hover:bg-[var(--accent-light)] rounded text-[var(--text-muted)] hover:text-[var(--accent-text)] transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {c.active && (
                        <button
                          onClick={() => handleDeactivate(c)}
                          disabled={deactivateMutation.isPending}
                          title="Desactivar cliente"
                          className="p-1.5 hover:bg-[var(--danger-light)] rounded text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors disabled:opacity-50"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-[var(--border)] flex items-center justify-between">
            <p className="text-xs text-[var(--text-muted)]">
              Página {data.page + 1} de {data.totalPages}
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled={data.first}>Anterior</Button>
              <Button variant="secondary" size="sm" disabled={data.last}>Siguiente</Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal - Create/Edit Customer */}
      {showModal && (
        <Modal
          size="lg"
          title={editingCustomer ? 'Editar cliente' : 'Nuevo cliente'}
          description={editingCustomer ? editingCustomer.name : 'Registra los datos del cliente para emitir comprobantes.'}
          icon={editingCustomer ? <Pencil /> : <UserCheck />}
          onClose={closeModal}
        >
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
                  />
                </div>
                <CellphoneField
                  value={form.phone}
                  onChange={phone => setForm(f => ({ ...f, phone }))}
                  labelClassName="field-label"
                  inputClassName="field-input"
                />
              </div>
              <div>
                <label className="field-label">Dirección</label>
                <input
                  className="field-input"
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                />
              </div>
              </ModalBody>
              <ModalFooter>
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Cancelar
                </Button>
                <Button type="submit" loading={editingCustomer ? updateMutation.isPending : createMutation.isPending}>
                  {editingCustomer ? 'Guardar cambios' : 'Crear cliente'}
                </Button>
              </ModalFooter>
            </form>
        </Modal>
      )}
    </div>
  )
}