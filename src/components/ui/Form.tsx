// components/ui/Form.tsx
//
// Piezas comunes de las páginas de formulario (crear / editar):
//   <PageHeader>   → volver + título + subtítulo + acciones
//   <FormSection>  → tarjeta con título y descripción a la izquierda y campos a la derecha
//   <Field>        → etiqueta, campo, ayuda y error, siempre en el mismo orden
//   <FormActions>  → barra fija al pie con Cancelar / Guardar
import React from 'react'
import { ArrowLeft } from 'lucide-react'

export function PageHeader({ title, subtitle, onBack, actions }: {
  title: React.ReactNode
  subtitle?: React.ReactNode
  onBack?: () => void
  actions?: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver"
            className="mt-0.5 p-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}

export function FormSection({ title, description, children }: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section
      className="grid gap-6 lg:grid-cols-[240px_1fr] lg:gap-10 p-6"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}
    >
      <div>
        <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">{title}</h2>
        {description && <p className="mt-1 text-[13px] leading-5 text-[var(--text-muted)]">{description}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 content-start">{children}</div>
    </section>
  )
}

export function Field({ label, required, hint, error, full, children }: {
  label: string
  required?: boolean
  hint?: string
  error?: string
  // ocupa las dos columnas de la sección
  full?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={full ? 'sm:col-span-2' : undefined}>
      <label className="field-label">
        {label}
        {required && <span className="ml-0.5 text-[var(--danger)]">*</span>}
      </label>
      {children}
      {error
        ? <p className="mt-1.5 text-xs font-medium text-[var(--danger)]">{error}</p>
        : hint && <p className="mt-1.5 text-xs text-[var(--text-muted)]">{hint}</p>}
    </div>
  )
}

// Tarjeta de configuración: encabezado (título + descripción) → cuerpo → pie con acciones.
export function Panel({ title, description, children, footer, footerNote }: {
  title: string
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  footerNote?: React.ReactNode
}) {
  return (
    <section
      className="overflow-hidden"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}
    >
      <header className="px-6 pt-5 pb-4 border-b border-[var(--border)]">
        <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">{title}</h2>
        {description && <p className="mt-0.5 text-[13px] text-[var(--text-muted)]">{description}</p>}
      </header>
      <div className="px-6 py-5">{children}</div>
      {footer && (
        <footer className="flex items-center justify-between gap-3 px-6 py-3 border-t border-[var(--border)] bg-[var(--bg-subtle)]">
          <div className="text-xs text-[var(--text-muted)]">{footerNote}</div>
          <div className="flex items-center gap-2">{footer}</div>
        </footer>
      )}
    </section>
  )
}

export function FormActions({ children, note }: { children: React.ReactNode; note?: React.ReactNode }) {
  return (
    <div
      className="sticky bottom-0 z-10 -mx-1 flex items-center justify-between gap-3 px-5 py-3"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}
    >
      <div className="text-xs text-[var(--text-muted)]">{note}</div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  )
}
