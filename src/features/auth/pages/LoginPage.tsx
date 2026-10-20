import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'

import { useAuthStore } from '@store/auth.store'
import apiClient from '@api/client/axios.client'
import { API } from '@api/endpoints'

import { LoginHero } from '@features/auth/components/LoginHero'
import { LoginForm } from '@features/auth/components/LoginForm'
import introLogo from '@/assets/images/logo.png'

const schema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})
type FormData = z.infer<typeof schema>

// Pantalla de intro que se muestra la primera vez
function IntroScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 1500)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.07),transparent_65%)]" />

      <div className="relative flex flex-col items-center gap-8">
        <motion.img
          src={introLogo}
          alt="De los Reyes"
          className="h-28 w-auto select-none object-contain"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        />

        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '180px', opacity: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.55 }}
        />

        <motion.div
          className="flex flex-col items-center gap-1 text-center"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.75 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.30em] text-slate-300">
            Accesorios y Repuestos Automotrices
          </p>
          <p className="text-[11px] uppercase tracking-[0.20em] text-slate-600">
            Sistema de Gestión Empresarial
          </p>
        </motion.div>

        {/* Fade a negro antes de revelar el form — sin corte brusco */}
        <motion.div
          className="pointer-events-none fixed inset-0 bg-slate-950"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: 'easeIn', delay: 1.15 }}
        />
      </div>
    </motion.div>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setAuth, isAuthenticated } = useAuthStore()

  const [introComplete, setIntroComplete] = useState(false)
  const [showPassword,  setShowPassword]  = useState(false)
  const [apiError,      setApiError]      = useState<string | null>(null)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard'

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true })
  }, [isAuthenticated, navigate, from])

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: FormData) => {
    setApiError(null)
    try {
      const res = await apiClient.post(API.auth.login, data)
      setAuth(res.data)
      toast.success(`Bienvenido, ${res.data.name}`)
      navigate(from, { replace: true })
    } catch (err) {
      const msg = isAxiosError(err)
        ? err.response?.data?.message ?? err.message
        : 'Error al iniciar sesión'
      setApiError(msg)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* AnimatePresence interno — controla intro → form sin que el router interfiera */}
      <AnimatePresence mode="wait">
        {!introComplete && (
          <IntroScreen key="intro" onComplete={() => setIntroComplete(true)} />
        )}
      </AnimatePresence>

      {/* El form siempre está montado — solo es visible cuando introComplete=true */}
      <motion.div
        className="relative z-10 flex min-h-screen flex-col items-stretch lg:flex-row"
        initial={{ opacity: 0 }}
        animate={{ opacity: introComplete ? 1 : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <LoginHero />

        <div className="relative flex w-full items-center justify-center bg-white px-6 py-12 text-slate-900 sm:px-10 min-h-screen lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: introComplete ? 1 : 0, y: introComplete ? 0 : 28 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="relative w-full max-w-[380px]"
          >
            <LoginForm
              register={register}
              errors={errors}
              apiError={apiError}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit(onSubmit)}
              onClearError={() => setApiError(null)}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}