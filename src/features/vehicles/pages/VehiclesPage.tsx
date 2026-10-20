// features/vehicles/pages/VehiclesPage.tsx
import { useState } from 'react'
import { Search, Plus, Car, Pencil, Trash2 } from 'lucide-react'
import { useDebounce } from '@hooks/useDebounce'
import { Button } from '@components/ui/Button'
import { Modal, ModalBody, ModalFooter } from '@components/ui/Modal'
import { useVehicles, useVehicleBrands, useCreateVehicle, useDeleteVehicle } from '@features/vehicles/hooks/useVehicles'

interface FormState {
  brand: string
  model: string
  year: number
  engine: string
}

const INITIAL: FormState = { brand: '', model: '', year: new Date().getFullYear(), engine: '' }

export default function VehiclesPage() {
  const [search, setSearch]         = useState('')
  const [brandFilter, setBrandFilter] = useState('')
  const [showModal, setShowModal]   = useState(false)
  const [form, setForm]             = useState<FormState>(INITIAL)
  const [deleteId, setDeleteId]     = useState<number | null>(null)

  const debouncedSearch = useDebounce(search, 350)
  const { data: vehicles = [], isLoading } = useVehicles({ search: debouncedSearch, brand: brandFilter || undefined })
  const { data: brands = [] }       = useVehicleBrands()
  const createMutation              = useCreateVehicle()
  const deleteMutation              = useDeleteVehicle()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createMutation.mutateAsync({
      brand:  form.brand,
      model:  form.model,
      year:   form.year,
      engine: form.engine || undefined,
    })
    setShowModal(false)
    setForm(INITIAL)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteMutation.mutateAsync(deleteId)
    setDeleteId(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Vehículos</h1>
          <p className="page-subtitle">{vehicles.length} vehículos registrados</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>
          Nuevo Vehículo
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input
            className="field-input pl-9"
            placeholder="Buscar marca, modelo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="field-input w-auto min-w-[160px]"
          value={brandFilter}
          onChange={e => setBrandFilter(e.target.value)}
        >
          <option value="">Todas las marcas</option>
          {brands.map(b => <option key={b}>{b}</option>)}
        </select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>Cargando vehículos...</div>
      ) : vehicles.length === 0 ? (
        <div className="card p-12 text-center">
          <Car className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--border-hover)' }} />
          <p style={{ color: 'var(--text-muted)' }}>No se encontraron vehículos</p>
          <Button className="mt-4" onClick={() => setShowModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Agregar vehículo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {vehicles.map(v => (
            <div key={v.id} className="card p-4 card-hover group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
                  <Car className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded transition-colors" style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-subtle)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(v.id)}
                    className="p-1.5 rounded transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-light)'; e.currentTarget.style.color = 'var(--danger)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{v.brand} {v.model}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{v.year}{v.engine ? ` · ${v.engine}` : ''}</p>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <Modal
          title="Nuevo vehículo"
          description="Registra un modelo compatible con el catálogo."
          icon={<Car />}
          onClose={() => setShowModal(false)}
        >
            <form onSubmit={handleSubmit}>
              <ModalBody>
              <div>
                <label className="field-label">Marca *</label>
                <input
                  className="field-input"
                  required
                  placeholder="Toyota, Honda, Ford..."
                  value={form.brand}
                  onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                />
              </div>
              <div>
                <label className="field-label">Modelo *</label>
                <input
                  className="field-input"
                  required
                  placeholder="Corolla, Civic, F-150..."
                  value={form.model}
                  onChange={e => setForm(f => ({ ...f, model: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Año *</label>
                  <input
                    type="number"
                    className="field-input"
                    required
                    min={1980}
                    max={new Date().getFullYear() + 1}
                    value={form.year}
                    onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="field-label">Motor</label>
                  <input
                    className="field-input"
                    placeholder="2.0L, 1.6L..."
                    value={form.engine}
                    onChange={e => setForm(f => ({ ...f, engine: e.target.value }))}
                  />
                </div>
              </div>
              </ModalBody>
              <ModalFooter>
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" loading={createMutation.isPending}>
                  Crear vehículo
                </Button>
              </ModalFooter>
            </form>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <Modal
          size="sm"
          tone="danger"
          icon={<Trash2 />}
          title="¿Eliminar vehículo?"
          description="Esta acción no se puede deshacer."
          onClose={() => setDeleteId(null)}
          dismissible={!deleteMutation.isPending}
        >
          <ModalFooter>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>
              Cancelar
            </Button>
            <Button variant="danger" loading={deleteMutation.isPending} onClick={handleDelete}>
              Eliminar
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  )
}