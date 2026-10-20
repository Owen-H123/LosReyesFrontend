// features/dashboard/components/TeamActivity.tsx
// Ventas de cada trabajador en el día.
import { Users, Clock } from 'lucide-react'
import { formatCurrencyCompact, getImageUrl, getInitials } from '@lib/utils'
import type { WorkerActivity } from '@interfaces/api.types'
import { SectionCard } from '@features/dashboard/components/SectionCard'
import { Skeleton } from '@features/dashboard/components/Skeleton'
import { CHART_COLORS } from '@features/dashboard/components/dashboardUi'

export function TeamActivity({ workers, loading }: { workers?: WorkerActivity[]; loading: boolean }) {
  return (
    <SectionCard
      title="Equipo hoy"
      sub="Actividad del día"
      delay={0.46}
      right={<Users size={14} style={{ color: 'var(--text-disabled)' }} />}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Skeleton h={36} w={36} r={10} />
                <div style={{ flex: 1 }}><Skeleton h={12} w="60%" /><div style={{ marginTop: 5 }}><Skeleton h={10} w="40%" /></div></div>
                <Skeleton h={12} w={48} r={6} />
              </div>
            ))
          : !workers?.length
          ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <Clock className="w-7 h-7 mx-auto mb-2" style={{ color: 'var(--text-disabled)', opacity: 0.5 }} />
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sin actividad hoy</p>
            </div>
          )
          : workers.map((w, i) => {
              const clr = CHART_COLORS[i % CHART_COLORS.length]
              const avatar = getImageUrl(w.userAvatarUrl)
              return (
                <div key={w.userId} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: clr + '18',
                    border: `1px solid ${clr}28`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: clr,
                    overflow: 'hidden',
                  }}>
                    {avatar ? (
                      <img src={avatar} alt={w.userName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      getInitials(w.userName)
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{w.userName}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-disabled)', marginTop: 1 }}>{w.salesCount} ventas</p>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--success)', flexShrink: 0 }}>
                    {formatCurrencyCompact(w.totalRevenue)}
                  </span>
                </div>
              )
            })
        }
      </div>
    </SectionCard>
  )
}
