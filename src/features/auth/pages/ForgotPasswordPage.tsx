// features/auth/pages/ForgotPasswordPage.tsx
// Paso 1 de la recuperación: el usuario escribe su email y recibe un enlace.
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MailCheck } from 'lucide-react'
import { isAxiosError } from 'axios'
import { Button } from '@components/ui/Button'
import { authApi } from '@features/auth/services/auth.api'
import { AuthCard } from '@features/auth/components/AuthCard'
import { authButtonStyle, authInputClass } from '@features/auth/components/authStyles'

const schema = z.object({
  email: z.string().min(1, 'El email es obligatorio').email('Formato de email inválido'),
})
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ email }: FormData) => {
    setApiError(null)
    try {
      await authApi.forgotPassword(email)
      setSentTo(email)
    } catch (err) {
      setApiError(isAxiosError(err)
        ? err.response?.data?.message ?? 'No se pudo enviar la solicitud'
        : 'No se pudo enviar la solicitud')
    }
  }

  // El mensaje es el mismo exista o no el email: así no se revela quién tiene cuenta
  if (sentTo) {
    return (
      <AuthCard title="Revisa tu correo" subtitle="Te enviamos las instrucciones">
        <div className="flex flex-col items-center gap-4 text-center">
          <MailCheck className="h-12 w-12 text-blue-500" strokeWidth={1.5} />
          <p className="text-sm leading-relaxed text-slate-600">
            Si <strong>{sentTo}</strong> está registrado, recibirás un enlace para crear una nueva
            contraseña. El enlace vence en 30 minutos.
          </p>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="¿Olvidaste tu contraseña?"
      subtitle="Escribe tu correo y te enviaremos un enlace para crear una nueva"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Correo Electrónico
          </label>
          <input
            type="email"
            placeholder="tu@correo.com"
            autoComplete="email"
            autoFocus
            {...register('email')}
            className={authInputClass(!!errors.email)}
          />
          {errors.email && <p className="text-xs font-medium text-red-500">{errors.email.message}</p>}
        </div>

        {apiError && (
          <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{apiError}</p>
        )}

        <Button type="submit" loading={isSubmitting} size="lg"
          className="h-13 w-full rounded-2xl text-sm font-bold" style={authButtonStyle}>
          Enviar enlace
        </Button>
      </form>
    </AuthCard>
  )
}
