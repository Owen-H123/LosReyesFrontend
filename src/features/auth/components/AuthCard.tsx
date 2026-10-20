// features/auth/components/AuthCard.tsx
// Tarjeta centrada con el mismo estilo del login, para las pantallas de
// recuperación de contraseña.
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { LoginLogo } from '@features/auth/components/LoginLogo'

interface Props {
  title: string
  subtitle: string
  children: React.ReactNode
}

export function AuthCard({ title, subtitle, children }: Props) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-5 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(59,130,246,0.10),transparent_55%)]" />

      <div className="relative w-full max-w-[400px] overflow-hidden rounded-4xl border border-slate-200/70 bg-white p-8 shadow-[0_32px_72px_rgba(15,23,42,0.18),0_8px_24px_rgba(15,23,42,0.10)] sm:p-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-0.75 rounded-t-4xl bg-linear-to-r from-blue-600 via-blue-500 to-cyan-400" />

        <div className="relative flex flex-col gap-7">
          <div className="flex flex-col items-center gap-4 text-center">
            <LoginLogo />
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold tracking-tight text-slate-800">{title}</h2>
              <p className="text-sm leading-relaxed text-slate-400">{subtitle}</p>
            </div>
          </div>

          {children}

          <div className="flex justify-center border-t border-slate-100 pt-5">
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600"
            >
              <ArrowLeft size={15} />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
