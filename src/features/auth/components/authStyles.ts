// features/auth/components/authStyles.ts
import type { CSSProperties } from 'react'

// Clases compartidas por los campos de estas pantallas (mismo estilo del login)
export const authInputClass = (hasError: boolean) =>
  `h-13 w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 text-[0.94rem] text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-300 hover:border-blue-400/50 focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.13)] ${
    hasError ? 'border-red-400 focus:border-red-500' : ''
  }`

export const authButtonStyle: CSSProperties = {
  background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 50%, #1e3a8a 100%)',
  boxShadow: '0 14px 40px rgba(29,78,216,0.32)',
  width: '100%',
}
