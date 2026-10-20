// features/auth/pages/NotFoundPage.tsx
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '@components/ui/Button'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[var(--bg-surface)] flex items-center justify-center p-4">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="relative text-center max-w-md"
      >
        {/* Number */}
        <div className="relative mb-8">
          <h1 className="text-[160px] font-black leading-none text-[var(--text-muted)] select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[160px] font-black leading-none bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] bg-clip-text text-transparent opacity-20 select-none">
              404
            </span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">Página no encontrada</h2>
        <p className="text-[var(--text-muted)] mb-8">
          La página que buscas no existe o fue movida a otra dirección.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="secondary"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(-1)}
          >
            Volver
          </Button>
          <Button
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