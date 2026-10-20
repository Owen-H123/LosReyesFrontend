// features/categories/pages/CategoriesPage.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Tag } from 'lucide-react'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@features/categories/hooks/useCategories'
import { Button } from '@components/ui/Button'
import { Modal, ModalBody, ModalFooter } from '@components/ui/Modal'
import { confirmDialog } from '@components/ui/confirm'
import type { Category } from '@interfaces/api.types'

function CategoryModal({
  category, onClose
}: { category?: Category; onClose: () => void }) {
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory(category?.id ?? 0)
  const isEdit = !!category

  const [name, setName]           = useState(category?.name ?? '')
  const [description, setDesc]    = useState(category?.description ?? '')
  const [active, setActive]       = useState(category?.active ?? true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isEdit) {
      await updateMutation.mutateAsync({ name, description, active })
    } else {
      await createMutation.mutateAsync({ name, description })
    }
    onClose()
  }

  return (
    <Modal
      title={isEdit ? 'Editar categoría' : 'Nueva categoría'}
      description={isEdit ? category.name : 'Agrupa productos para encontrarlos más rápido.'}
      icon={isEdit ? <Edit /> : <Tag />}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div>
            <label className="field-label">Nombre *</label>
            <input value={name} onChange={e => setName(e.target.value)} required autoFocus className="field-input" placeholder="Frenos, Motor, Suspensión..." />
          </div>
          <div>
            <label className="field-label">Descripción</label>
            <textarea value={description} onChange={e => setDesc(e.target.value)} rows={3} className="field-input resize-none" placeholder="Descripción opcional..." />
          </div>
          {isEdit && (
            <div className="flex items-center justify-between rounded-lg px-3 py-2.5 border border-[var(--border)]">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Categoría activa</p>
                <p className="text-xs text-[var(--text-muted)]">Las inactivas no aparecen al crear productos.</p>
              </div>
              <button type="button" role="switch" aria-checked={active} onClick={() => setActive(v => !v)}
                className="relative w-10 h-5 rounded-full transition-colors shrink-0"
                style={{ background: active ? 'var(--accent)' : 'var(--border-hover)' }}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${active ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
            {isEdit ? 'Guardar cambios' : 'Crear categoría'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories()
  const { mutate: deleteCategory }      = useDeleteCategory()
  const [modal, setModal]               = useState<{ open: boolean; category?: Category }>({ open: false })

  const handleDelete = async (id: number, name: string) => {
    const ok = await confirmDialog({
      title: '¿Eliminar categoría?',
      description: `Se eliminará "${name}". Esta acción no se puede deshacer.`,
      confirmLabel: 'Eliminar',
    })
    if (!ok) return
    deleteCategory(id)
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Categorías</h1>
          <p className="page-subtitle">Organización de productos por categoría</p>
        </div>
        <button onClick={() => setModal({ open: true })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
          style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}>
          <Plus className="w-4 h-4" />Nueva Categoría
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="section-card">
            <div className="skeleton h-5 w-32 mb-2" />
            <div className="skeleton h-4 w-full" />
          </div>
        ))}
        {categories?.map((cat, i) => (
          <motion.div key={cat.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="section-card flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[var(--accent-light)] rounded-lg mt-0.5">
                <Tag className="w-4 h-4 text-[var(--accent-text)]" />
              </div>
              <div>
                <p className="font-medium text-[var(--text-primary)]">{cat.name}</p>
                {cat.description && <p className="text-sm text-[var(--text-muted)] mt-0.5">{cat.description}</p>}
                <span className={`badge mt-2 ${cat.active ? 'badge-success' : 'badge-neutral'}`}>
                  {cat.active ? 'Activa' : 'Inactiva'}
                </span>
              </div>
            </div>
            <div className="flex gap-1 flex-shrink-0 ml-2">
              <button onClick={() => setModal({ open: true, category: cat })}
                className="p-1.5 hover:bg-[var(--bg-subtle)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(cat.id, cat.name)}
                className="p-1.5 hover:bg-[var(--danger-light)] rounded-lg text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {modal.open && <CategoryModal category={modal.category} onClose={() => setModal({ open: false })} />}
    </div>
  )
}