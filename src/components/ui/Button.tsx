// components/ui/Button.tsx
import React from 'react'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const VARIANTS: Record<string, React.CSSProperties> = {
  primary:   { background: 'var(--accent)',       color: '#fff',                  border: '1px solid transparent' },
  secondary: { background: 'var(--bg-subtle)',     color: 'var(--text-primary)',   border: '1px solid var(--border)' },
  ghost:     { background: 'transparent',          color: 'var(--text-secondary)', border: '1px solid transparent' },
  danger:    { background: 'var(--danger)',        color: '#fff',                  border: '1px solid transparent' },
  success:   { background: 'var(--success)',       color: '#fff',                  border: '1px solid transparent' },
}
const HOVER: Record<string, React.CSSProperties> = {
  primary:   { background: 'var(--accent-hover)' },
  secondary: { background: 'var(--bg-muted)', borderColor: 'var(--border-hover)' },
  ghost:     { background: 'var(--bg-subtle)' },
  danger:    { opacity: 0.88 },
  success:   { opacity: 0.88 },
}
const SIZES: Record<string, React.CSSProperties> = {
  sm: { padding: '0.375rem 0.75rem', fontSize: '0.8125rem', borderRadius: 6 },
  md: { padding: '0.5rem 1rem',      fontSize: '0.875rem',  borderRadius: 8 },
  lg: { padding: '0.625rem 1.25rem', fontSize: '0.9375rem', borderRadius: 10 },
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <button
      {...props}
      disabled={disabled || loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontWeight: 500,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s ease',
        boxShadow: variant === 'primary' ? 'var(--shadow-sm)' : 'none',
        ...SIZES[size],
        ...VARIANTS[variant],
        ...(hovered && !disabled && !loading ? HOVER[variant] : {}),
        ...props.style,
      }}
    >
      {loading
        ? <Loader2 className="w-4 h-4 animate-spin" />
        : leftIcon
      }
      {children}
      {!loading && rightIcon}
    </button>
  )
}
