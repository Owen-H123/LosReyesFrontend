// features/dashboard/components/dashboardUi.ts
// Animación y colores compartidos por las secciones del Dashboard.
import type { motion } from 'framer-motion'

// Aparece subiendo levemente, con un retraso para escalonar las tarjetas
export const fadeUp = (delay = 0): React.ComponentProps<typeof motion.div> => ({
  initial:    { opacity: 0, y: 14 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1], delay },
})

// Paleta de los gráficos, el ranking y el equipo
export const CHART_COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626']

// Estilos de los ejes de los gráficos (dependen del tema claro u oscuro)
export const chartGrid = (isDark: boolean) => ({
  stroke: isDark ? '#1e2d42' : '#f1f5f9',
  strokeDasharray: '3 6',
})
export const chartTick = { fill: 'var(--text-disabled)', fontSize: 11 }
