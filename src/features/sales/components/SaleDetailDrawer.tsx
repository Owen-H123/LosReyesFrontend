// features/sales/components/SaleDetailDrawer.tsx
import { useEffect, useState } from 'react'
import { X, FileText, ExternalLink, Printer, Mail, Ban, Pencil, Check, Loader2 } from 'lucide-react'
import { useUpdateSale, useCancelSale } from '@features/sales/hooks/useSales'
import { useDownloadReceipt, useSendReceiptEmail, useOpenReceipt, usePrintReceipt } from '@features/receipts/hooks/useReceipts'
import { useCustomers } from '@features/customers/hooks/useCustomers'
import { usePermission } from '@features/auth/hooks/usePermission'
import { formatCurrency, formatDateTime, SALE_STATUS_LABELS, PAYMENT_METHOD_LABELS } from '@lib/utils'
import { Button } from '@components/ui/Button'
import { Modal, ModalBody, ModalFooter } from '@components/ui/Modal'
import type { Sale, SaleStatus, PaymentMethod } from '@interfaces/api.types'

const STATUS_STYLES: Record<SaleStatus, string> = {
  COMPLETED: 'badge-success',
  PENDING:   'badge-warning',
  CANCELLED: 'badge-danger',
  REFUNDED:  'badge-neutral',
}

const PAYMENT_METHODS: PaymentMethod[] = ['CASH', 'CARD', 'TRANSFER', 'CREDIT']

interface Props {
  sale: Sale | null
  onClose: () => void
}

/**
 * SaleDetailDrawer — panel lateral con todo lo de una venta en un solo lugar:
 * detalle de items, edición de campos seguros (cliente/pago/notas), cambio
 * de estado (cancelar) y acciones de boleta. Reemplaza los 5 íconos sueltos
 * que había antes en cada fila de la tabla.
 */
export default function SaleDetailDrawer({ sale, onClose }: Props) {
  const { canCancelSales, canEditSales } = usePermission()
  const { mutate: updateSale, isPending: isSaving }   = useUpdateSale()
  const { mutate: cancelSale, isPending: isCancelling } = useCancelSale()
  const { data: customersPage } = useCustomers({ size: 100 })

  const { mutate: downloadReceipt, isPending: isDownloading } = useDownloadReceipt()
  const { mutate: sendReceiptEmail, isPending: isSendingEmail } = useSendReceiptEmail()
  const { mutate: openReceipt, isPending: isOpening } = useOpenReceipt()
  const { mutate: printReceipt, isPending: isPrinting } = usePrintReceipt()

  const [isEditing, setIsEditing] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [form, setForm] = useState({ customerId: '', paymentMethod: 'CASH' as PaymentMethod, notes: '' })

  useEffect(() => {
    if (sale) {
      setForm({
        customerId: sale.customerId ? String(sale.customerId) : '',
        paymentMethod: sale.paymentMethod,
        notes: sale.notes ?? '',
      })
      setIsEditing(false)
    }
  }, [sale])

  if (!sale) return null

  const isEditable = sale.status !== 'CANCELLED' && sale.status !== 'REFUNDED'

  const handleSave = () => {
    updateSale(
      {
        id: sale.id,
        body: {
          customerId: form.customerId ? Number(form.customerId) : undefined,
          paymentMethod: form.paymentMethod,
          notes: form.notes,
        },
      },
      { onSuccess: () => setIsEditing(false) }
    )
  }

  const handleCancel = () => {
    setCancelReason('')
    setShowCancel(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div className="absolute inset-0" style={{ background: 'var(--overlay)' }} onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-sm h-full bg-[var(--bg-elevated)] border-l border-[var(--border)] flex flex-col animate-slideIn">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div>
            <span className="font-mono text-sm text-[var(--accent-text)]">{sale.saleNumber}</span>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{formatDateTime(sale.saleDate)}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-[var(--bg-base)] rounded-lg text-[var(--text-muted)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Estado + acciones de estado */}
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-2">Estado</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`badge ${STATUS_STYLES[sale.status]}`}>{SALE_STATUS_LABELS[sale.status]}</span>
              {canCancelSales && sale.status === 'COMPLETED' && (
                <button
                  onClick={handleCancel}
                  disabled={isCancelling}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border border-[var(--border)] text-[var(--danger)] hover:bg-[var(--danger-light)] transition-colors disabled:opacity-50">
                  {isCancelling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ban className="w-3.5 h-3.5" />}
                  Cancelar venta
                </button>
              )}
            </div>
            {!isEditable && (
              <p className="text-xs text-[var(--text-muted)] mt-2">
                Esta venta ya no se puede editar ni cambiar de estado.
              </p>
            )}
          </div>

          {/* Datos editables */}
          <div className="border-t border-[var(--border)] pt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-[var(--text-muted)]">Detalles</p>
              {isEditable && canEditSales && !isEditing && (
                <button onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 text-xs text-[var(--accent-text)] hover:underline">
                  <Pencil className="w-3.5 h-3.5" /> Editar
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[var(--text-muted)]">Cliente</span><span>{sale.customerName ?? 'Sin cliente'}</span></div>
                <div className="flex justify-between"><span className="text-[var(--text-muted)]">Vendedor</span><span>{sale.userName}</span></div>
                <div className="flex justify-between"><span className="text-[var(--text-muted)]">Pago</span><span>{PAYMENT_METHOD_LABELS[sale.paymentMethod]}</span></div>
                {sale.notes && <div className="pt-1"><span className="text-[var(--text-muted)] text-xs">Notas</span><p className="mt-0.5">{sale.notes}</p></div>}
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Cliente</label>
                  <select className="field-input" value={form.customerId}
                    onChange={e => setForm(f => ({ ...f, customerId: e.target.value }))}>
                    <option value="">Sin cliente</option>
                    {customersPage?.content.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Método de pago</label>
                  <select className="field-input" value={form.paymentMethod}
                    onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value as PaymentMethod }))}>
                    {PAYMENT_METHODS.map(m => (
                      <option key={m} value={m}>{PAYMENT_METHOD_LABELS[m]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Notas</label>
                  <textarea className="field-input" rows={3} value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={handleSave} disabled={isSaving}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-lg disabled:opacity-50">
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    Guardar
                  </button>
                  <button onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 text-xs border border-[var(--border)] rounded-lg text-[var(--text-muted)]">
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="border-t border-[var(--border)] pt-4">
            <p className="text-xs text-[var(--text-muted)] mb-2">Productos ({sale.items.length})</p>
            <div className="space-y-2">
              {sale.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div className="min-w-0">
                    <p className="truncate">{item.productName}</p>
                    <p className="text-xs text-[var(--text-muted)]">{item.quantity} × {formatCurrency(item.unitPrice)}</p>
                  </div>
                  <span className="font-medium shrink-0 ml-2">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </div>

{/* Totales */}
          <div className="border-t border-[var(--border)] pt-4 space-y-1.5 text-sm">
            <div className="flex justify-between text-[var(--text-muted)]"><span>Subtotal</span><span>{formatCurrency(sale.subtotal)}</span></div>
            {sale.discount > 0 && <div className="flex justify-between text-[var(--text-muted)]"><span>Descuento</span><span>-{formatCurrency(sale.discount)}</span></div>}
            <div className="flex justify-between text-[var(--text-muted)]"><span>IGV (18%) incluido</span><span>{formatCurrency(sale.tax)}</span></div>
            <div className="flex justify-between font-semibold text-base pt-1" style={{ color: 'var(--text-primary)' }}>
              <span>Total</span><span>{formatCurrency(sale.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer — acciones de boleta */}
        <div className="border-t border-[var(--border)] px-5 py-4">
          <p className="text-xs text-[var(--text-muted)] mb-2">Boleta</p>
          <div className="flex gap-2">
            <button onClick={() => downloadReceipt({ saleId: sale.id, saleNumber: sale.saleNumber })}
              disabled={isDownloading} title="Descargar PDF"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs border border-[var(--border)] rounded-lg text-[var(--text-muted)] hover:text-[var(--accent-text)] hover:border-[var(--accent-border)] transition-colors disabled:opacity-50">
              {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            </button>
            <button onClick={() => openReceipt({ saleId: sale.id, saleNumber: sale.saleNumber })}
              disabled={isOpening} title="Abrir en pestaña nueva"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs border border-[var(--border)] rounded-lg text-[var(--text-muted)] hover:text-[var(--accent-text)] hover:border-[var(--accent-border)] transition-colors disabled:opacity-50">
              {isOpening ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
            </button>
            <button onClick={() => printReceipt({ saleId: sale.id, saleNumber: sale.saleNumber })}
              disabled={isPrinting} title="Imprimir"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs border border-[var(--border)] rounded-lg text-[var(--text-muted)] hover:text-[var(--warning)] hover:border-[var(--warning-border)] transition-colors disabled:opacity-50">
              {isPrinting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
            </button>
            <button onClick={() => sendReceiptEmail({ saleId: sale.id, saleNumber: sale.saleNumber })}
              disabled={isSendingEmail} title="Enviar por correo"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs border border-[var(--border)] rounded-lg text-[var(--text-muted)] hover:text-[var(--success)] hover:border-[var(--success-border)] transition-colors disabled:opacity-50">
              {isSendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
      {showCancel && (
        <Modal
          size="sm"
          tone="danger"
          icon={<Ban />}
          title={`¿Anular la venta ${sale.saleNumber}?`}
          description="El stock de los productos se devolverá al inventario."
          onClose={() => setShowCancel(false)}
          dismissible={!isCancelling}
        >
          <form
            onSubmit={e => {
              e.preventDefault()
              cancelSale(
                { id: sale.id, reason: cancelReason.trim() },
                { onSuccess: () => { setShowCancel(false); onClose() } }
              )
            }}
          >
            <ModalBody>
              <div>
                <label className="field-label">Motivo *</label>
                <textarea
                  className="field-input resize-none"
                  rows={3}
                  required
                  autoFocus
                  placeholder="Error de digitación, devolución del cliente..."
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button type="button" variant="secondary" onClick={() => setShowCancel(false)}>Volver</Button>
              <Button type="submit" variant="danger" loading={isCancelling} disabled={!cancelReason.trim()}>
                Anular venta
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      )}
    </div>
  )
}