// components/ui/Input.tsx
import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function Input({ label, error, leftIcon, rightIcon, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="field-label">{label}</label>}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-disabled)' }}>
            {leftIcon}
          </div>
        )}
        <input
          {...props}
          className={`field-input ${error ? 'field-input-error' : ''} ${leftIcon ? 'pl-9' : ''} ${rightIcon ? 'pr-9' : ''} ${className}`}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-disabled)' }}>
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs mt-1.5 font-medium" style={{ color: 'var(--danger)' }}>{error}</p>}
    </div>
  )
}
