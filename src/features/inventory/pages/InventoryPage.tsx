// features/inventory/pages/InventoryPage.tsx
// Historial de movimientos y botones para registrar entradas, salidas y
// ajustes. La tabla y los modales viven en features/inventory/components/.
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PackagePlus, PackageMinus, SlidersHorizontal } from 'lucide-react'
import { useMovements } from '@features/inventory/hooks/useInventory'
import { useProducts } from '@features/products/hooks/useProducts'
import { MOVEMENT_TYPE_LABELS } from '@lib/utils'
import type { MovementType } from '@interfaces/api.types'
import { MovementsTable } from '@features/inventory/components/MovementsTable'
import { EntryModal } from '@features/inventory/components/EntryModal'
import { ExitModal } from '@features/inventory/components/ExitModal'
import { AdjustmentModal } from '@features/inventory/components/AdjustmentModal'

type ModalType = 'entry' | 'exit' | 'adjustment' | null

const ACTIONS = [
  {
    id: 'entry' as ModalType,
    label: 'Registrar Entrada',
    icon: PackagePlus,
    color: 'bg-[var(--success-light)] hover:bg-[var(--success-light)] text-[var(--success)] border border-[var(--success-border)]',
  },
  {
    id: 'exit' as ModalType,
    label: 'Registrar Salida',
    icon: PackageMinus,
    color: 'bg-[var(--danger-light)] hover:bg-[var(--danger-light)] text-[var(--danger)] border border-[var(--danger-border)]',
  },
  {
    id: 'adjustment' as ModalType,
    label: 'Ajustar Stock',
    icon: SlidersHorizontal,
    color: 'bg-[var(--warning-light)] hover:bg-[var(--warning-light)] text-[var(--warning)] border border-[var(--warning-border)]',
  },
]

export default function InventoryPage() {
  const [modal, setModal]           = useState<ModalType>(null)
  const [entryProductId, setEntryProductId] = useState(0)
  const [typeFilter, setTypeFilter] = useState('')
  const [page, setPage]             = useState(0)
  const [searchParams, setSearchParams] = useSearchParams()

  const { data, isLoading } = useMovements({ type: typeFilter || undefined, page, size: 30 })
  const { data: productsData } = useProducts({ status: 'ACTIVE', size: 200 })
  const products = productsData?.content ?? []

  // Deep-link desde "Alertas de stock" (Header y Dashboard):
  // ?action=entry&productId=X abre directamente el modal "Registrar Entrada"
  // con el producto ya preseleccionado. Se limpia la URL después de aplicarlo
  // para que un refresh no vuelva a reabrir el modal.
  useEffect(() => {
    const action    = searchParams.get('action')
    const productId = searchParams.get('productId')

    if (action === 'entry' && productId) {
      setEntryProductId(Number(productId))
      setModal('entry')
      setSearchParams(params => {
        params.delete('action')
        params.delete('productId')
        return params
      }, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const closeModal = () => {
    setModal(null)
    setEntryProductId(0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Inventario</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            Movimientos de stock — {data?.totalElements ?? 0} registros
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          {ACTIONS.map(a => {
            const Icon = a.icon
            return (
              <motion.button
                key={a.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setModal(a.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${a.color}`}
              >
                <Icon className="w-4 h-4" />
                {a.label}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          className="field-input w-auto min-w-[180px]"
          value={typeFilter}
          onChange={e => { setTypeFilter(e.target.value); setPage(0) }}
        >
          <option value="">Todos los movimientos</option>
          {(Object.keys(MOVEMENT_TYPE_LABELS) as MovementType[]).map(t => (
            <option key={t} value={t}>{MOVEMENT_TYPE_LABELS[t]}</option>
          ))}
        </select>
      </div>

      <MovementsTable data={data} isLoading={isLoading} page={page} onPageChange={setPage} />

      {modal === 'entry' && (
        <EntryModal products={products} initialProductId={entryProductId} onClose={closeModal} />
      )}
      {modal === 'exit' && <ExitModal products={products} onClose={closeModal} />}
      {modal === 'adjustment' && <AdjustmentModal products={products} onClose={closeModal} />}
    </div>
  )
}
