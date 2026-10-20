// components/ui/Modal.tsx
//
// Modal global del sistema. Todos los diálogos usan este marco para que
// se vean y se comporten igual:
//   - Se monta en <body> (portal), con fondo oscuro difuminado.
//   - Cierra con Escape, con clic fuera o con la X.
//   - Bloquea el scroll de la página mientras está abierto.
//   - Jerarquía fija: encabezado (ícono + título + descripción) →
//     cuerpo → pie con acciones alineadas a la derecha (secundaria, principal).
//
// Uso típico con formulario:
//   <Modal title="Nueva categoría" onClose={close}>
//     <form onSubmit={submit}>
//       <ModalBody>...campos...</ModalBody>
//       <ModalFooter>
//         <Button variant="secondary" type="button" onClick={close}>Cancelar</Button>
//         <Button type="submit">Crear</Button>
//       </ModalFooter>
//     </form>
//   </Modal>
import React, { useEffect, useId } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export type ModalTone = 'accent' | 'success' | 'danger' | 'warning' | 'info'

const TONES: Record<ModalTone, { bg: string; fg: string; border: string }> = {
  accent:  { bg: 'var(--accent-light)',  fg: 'var(--accent)',  border: 'var(--accent-border)' },
  success: { bg: 'var(--success-light)', fg: 'var(--success)', border: 'var(--success-border)' },
  danger:  { bg: 'var(--danger-light)',  fg: 'var(--danger)',  border: 'var(--danger-border)' },
  warning: { bg: 'var(--warning-light)', fg: 'var(--warning)', border: 'var(--warning-border)' },
  info:    { bg: 'var(--info-light)',    fg: 'var(--info)',    border: 'var(--info-border)' },
}

const WIDTHS = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' } as const

export interface ModalProps {
  title: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  tone?: ModalTone
  size?: keyof typeof WIDTHS
  onClose: () => void
  // false cuando hay una operación en curso y no se debe cerrar
  dismissible?: boolean
  children: React.ReactNode
}

export function Modal({
  title,
  description,
  icon,
  tone = 'accent',
  size = 'md',
  onClose,
  dismissible = true,
  children,
}: ModalProps) {
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dismissible) onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose, dismissible])

  const t = TONES[tone]

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 backdrop-blur-[2px]"
        style={{ background: 'var(--overlay)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => dismissible && onClose()}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.16, ease: 'easeOut' }}
        className={`relative w-full ${WIDTHS[size]} max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden`}
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <header className="flex items-start gap-3 px-6 pt-5 pb-4">
          {icon && (
            <div
              className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center [&_svg]:w-[18px] [&_svg]:h-[18px]"
              style={{ background: t.bg, color: t.fg, border: `1px solid ${t.border}` }}
            >
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0 pt-0.5">
            <h2 id={titleId} className="text-base font-semibold leading-6" style={{ color: 'var(--text-primary)' }}>
              {title}
            </h2>
            {description && (
              <p id={descId} className="text-[13px] leading-5 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {description}
              </p>
            )}
          </div>
          {dismissible && (
            <button
              type="button"
              aria-label="Cerrar"
              onClick={onClose}
              className="-mr-2 -mt-1 p-1.5 rounded-md transition-colors hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </header>
        <div className="flex flex-col min-h-0">{children}</div>
      </motion.div>
    </div>,
    document.body,
  )
}

export function ModalBody({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <div className={`px-6 pb-5 space-y-4 overflow-y-auto ${className}`}>{children}</div>
}

export function ModalFooter({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <footer
      className={`flex items-center justify-end gap-2 px-6 py-3.5 ${className}`}
      style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-subtle)' }}
    >
      {children}
    </footer>
  )
}
