// features/auth/pages/ResetPasswordPage.tsx
// Paso 2 de la recuperación: se abre desde el enlace del correo
// (/reset-password?token=...) y permite crear la nueva contraseña.
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import { Button } from '@components/ui/Button'
import { authApi } from '@features/auth/services/auth.api'
import { AuthCard } from '@features/auth/components/AuthCard'
import { authButtonStyle, authInputClass } from '@features/auth/components/authStyles'

// Misma regla que el backend: al menos 8 caracteres
const schema = z.object({
  newPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})
type FormData = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const [apiError, setApiError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ newPassword }: FormData) => {
    if (!token) return
    setApiError(null)
    try {
      await authApi.resetPassword(token, newPassword)
      toast.success('Contraseña actualizada. Ya puedes iniciar sesión.')
      navigate('/login', { replace: true })
    } catch (err) {
      setApiError(isAxiosError(err)
        ? err.response?.data?.message ?? 'No se pudo cambiar la contraseña'
        : 'No se pudo cambiar la contraseña')
    }
  }

  if (!token) {
    return (
      <AuthCard title="Enlace no válido" subtitle="Al enlace le falta el código de recuperación">
        <Link to="/forgot-password" className="text-center text-sm font-medium text-blue-600 hover:underline">
          Solicitar un enlace nuevo
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Crear nueva contraseña" subtitle="Escribe tu nueva contraseña dos veces">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Nueva contraseña
          </label>
          <input type="password" autoComplete="new-password" autoFocus placeholder="Mínimo 8 caracteres"
            {...register('newPassword')} className={authInputClass(!!errors.newPassword)} />
          {errors.newPassword && <p className="text-xs font-medium text-red-500">{errors.newPassword.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Repetir contraseña
          </label>
          <input type="password" autoComplete="new-password" placeholder="••••••••"
            {...register('confirmPassword')} className={authInputClass(!!errors.confirmPassword)} />
          {errors.confirmPassword && <p className="text-xs font-medium text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        {apiError && (
          <div className="space-y-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            <p>{apiError}</p>
            <Link to="/forgot-password" className="font-medium underline">Solicitar un enlace nuevo</Link>
          </div>
        )}

        <Button type="submit" loading={isSubmitting} size="lg"
          className="h-13 w-full rounded-2xl text-sm font-bold" style={authButtonStyle}>
          Guardar contraseña
        </Button>
      </form>
    </AuthCard>
  )
}
