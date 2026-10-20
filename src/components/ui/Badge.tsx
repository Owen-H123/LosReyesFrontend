// components/ui/Badge.tsx
//
// QUÉ HACE:
//   Componente de badge/etiqueta reutilizable para estados, tipos y categorías.
//   También exporta Spinner y Card como componentes utilitarios del design system.
//
// POR QUÉ SE REESCRIBIÓ:
//   La versión anterior tenía: Input y Skeleton duplicados en el mismo archivo
//   (causando conflictos de exports en TypeScript), y usaba tokens de la paleta
//   vieja que no existen en el proyecto actual (surface-400, brand-500, etc.).
//
// RELACIONES:
//   ← Exportado por components/ui/index.tsx
//   ← Usado en ProductsPage, SalesPage, InventoryPage, UsersPage, AuditPage

import { cn } from '@lib/utils'

// ── Badge ─────────────────────────────────────────────────────
export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'

const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  default: 'bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border)]',
  success: 'bg-[var(--success-light)] text-[var(--success)] border border-[var(--success-border)]',
  warning: 'bg-[var(--warning-light)] text-[var(--warning)] border border-[var(--warning-border)]',
  danger:  'bg-[var(--danger-light)] text-[var(--danger)] border border-[var(--danger-border)]',
  info:    'bg-[var(--accent-light)] text-[var(--accent-text)] border border-[var(--accent-border)]',
  neutral: 'bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border)]',
}

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  dot?: boolean
  className?: string
}

export function Badge({
  children,
  variant = 'default',
  dot,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        BADGE_VARIANTS[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', {
            'bg-[var(--success)]': variant === 'success',
            'bg-[var(--warning)]': variant === 'warning',
            'bg-[var(--danger)]': variant === 'danger',
            'bg-[var(--accent)]': variant === 'info',
            'bg-[var(--text-muted)]': variant === 'default' || variant === 'neutral',
          })}
        />
      )}
      {children}
    </span>
  )
}

// ── Spinner ───────────────────────────────────────────────────
//
// QUÉ HACE:
//   Indicador de carga circular animado.
//   Reutilizable en botones, tablas y páginas.

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SPINNER_SIZES = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <svg
      className={cn('animate-spin text-[var(--accent-text)]', SPINNER_SIZES[size], className)}
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

// ── Card ──────────────────────────────────────────────────────
//
// QUÉ HACE:
//   Contenedor de superficie con borde y fondo del design system.
//   Variante hover añade transición en el borde.

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function Card({ children, className, hover, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl',
        hover && 'transition-all duration-200 hover:border-[var(--border-hover)] cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────
//
// QUÉ HACE:
//   Placeholder animado con efecto shimmer para estados de carga.
//   Modo `lines` genera múltiples líneas de texto simuladas.

interface SkeletonProps {
  className?: string
  lines?: number
}

export function Skeleton({ className, lines }: SkeletonProps) {
  if (lines && lines > 1) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'skeleton h-4',
              i === lines - 1 && 'w-3/4',
              className
            )}
          />
        ))}
      </div>
    )
  }
  return <div className={cn('skeleton', className)} />
}