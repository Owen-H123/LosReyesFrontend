// features/dashboard/components/KpiCard.tsx
// Tarjeta de un indicador: etiqueta → valor → contexto, con mini-gráfico opcional.
// La variación solo se muestra si viene de datos reales (nunca un número fijo).
import { useId } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { fadeUp } from '@features/dashboard/components/dashboardUi'

export type KpiTone = 'accent' | 'success' | 'info' | 'warning' | 'danger' | 'neutral'

export interface KpiProps {
  title: string
  value: string
  sub: string
  icon: React.ReactNode
  tone: KpiTone
  // variación porcentual calculada con datos reales; null = sin base para comparar
  delta?: number | null
  deltaLabel?: string
  spark?: number[]
  delay: number
}

const toneVar = (tone: KpiTone) => (tone === 'neutral' ? 'var(--text-muted)' : `var(--${tone})`)

export function KpiCard({ title, value, sub, icon, tone, delta, deltaLabel, spark, delay }: KpiProps) {
  const gradientId = useId()
  const color = toneVar(tone)
  const hasSpark = spark && spark.some(v => v > 0)

  return (
    <motion.div {...fadeUp(delay)} className="card card-hover relative overflow-hidden flex flex-col">
      <div className="p-5 pb-4 flex-1">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-medium text-[var(--text-muted)]">{title}</p>
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center [&_svg]:w-3.5 [&_svg]:h-3.5"
            style={{ color, background: tone === 'neutral' ? 'var(--bg-subtle)' : `var(--${tone}-light)` }}
          >
            {icon}
          </span>
        </div>

        <p className="mt-3 text-[26px] font-bold tracking-tight leading-none tabular-nums text-[var(--text-primary)]">
          {value}
        </p>

        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          {delta !== undefined && delta !== null && <DeltaBadge delta={delta} />}
          <span className="text-[var(--text-muted)] truncate">
            {delta !== undefined && delta !== null && deltaLabel ? deltaLabel : sub}
          </span>
        </div>
      </div>

      {/* Mini-gráfico a sangre en el borde inferior */}
      {spark && (
        <div className="h-12 -mt-2">
          {hasSpark ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spark.map((v, i) => ({ i, v }))} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.22} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.75} fill={`url(#${gradientId})`} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="mx-5 mt-6 border-t border-dashed border-[var(--border)]" />
          )}
        </div>
      )}
    </motion.div>
  )
}

function DeltaBadge({ delta }: { delta: number }) {
  const rounded = Math.round(delta)
  const up = rounded > 0
  const flat = rounded === 0
  const Icon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight
  return (
    <span
      className="inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded-md tabular-nums"
      style={{
        color: flat ? 'var(--text-muted)' : up ? 'var(--success)' : 'var(--danger)',
        background: flat ? 'var(--bg-subtle)' : up ? 'var(--success-light)' : 'var(--danger-light)',
      }}
    >
      <Icon className="w-3 h-3" />
      {Math.abs(rounded)}%
    </span>
  )
}
