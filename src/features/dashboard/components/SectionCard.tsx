// features/dashboard/components/SectionCard.tsx
// Tarjeta con título, subtítulo y un elemento opcional a la derecha.
import { motion } from 'framer-motion'
import { fadeUp } from '@features/dashboard/components/dashboardUi'

export function SectionCard({ children, title, sub, right, delay = 0 }: {
  children: React.ReactNode
  title: string
  sub?: string
  right?: React.ReactNode
  delay?: number
}) {
  return (
    <motion.div {...fadeUp(delay)} className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</p>
          {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
        </div>
        {right}
      </div>
      {children}
    </motion.div>
  )
}
