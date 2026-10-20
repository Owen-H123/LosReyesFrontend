// features/auth/pages/ForbiddenPage.tsx
//
// QUÉ HACE:
//   Página de error 403 — se muestra cuando un usuario autenticado
//   intenta acceder a una ruta que requiere un rol superior.
//
// RELACIONES:
//   ← Renderizado por AppRouter cuando ProtectedRoute detecta rol insuficiente

import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldOff, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@components/ui/Button'

export default function ForbiddenPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[var(--bg-surface)] flex items-center justify-center p-4">

      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ef4444 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="relative text-center max-w-md"
      >
        <div className="w-20 h-20 rounded-2xl bg-[var(--danger-light)] border border-[var(--danger-border)] flex items-center justify-center mx-auto mb-6">
          <ShieldOff className="w-10 h-10 text-[var(--danger)]" />
        </div>

        <h1 className="text-7xl font-black text-[var(--danger)] mb-2 select-none">403</h1>
        <h2 className="text-2xl font-bold text-white mb-3">Acceso denegado</h2>
        <p className="text-[var(--text-muted)] mb-8 leading-relaxed">
          No tienes permisos para acceder a esta sección.
          Contacta al administrador si crees que esto es un error.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(-1)}
          >
            Volver
          </Button>
          <Button
            size="sm"
            leftIcon={<Home className="w-4 h-4" />}
            onClick={() => navigate('/dashboard')}
          >
            Ir al Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  )
}