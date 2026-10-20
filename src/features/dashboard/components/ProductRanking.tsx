// features/dashboard/components/ProductRanking.tsx
// Lista de los productos más vendidos del mes, con su foto e ingresos.
import { Package } from 'lucide-react'
import { formatCurrencyCompact, getImageUrl } from '@lib/utils'
import type { TopProduct } from '@interfaces/api.types'
import { SectionCard } from '@features/dashboard/components/SectionCard'
import { Skeleton } from '@features/dashboard/components/Skeleton'
import { CHART_COLORS } from '@features/dashboard/components/dashboardUi'

export function ProductRanking({ topProducts, loading }: { topProducts?: TopProduct[]; loading: boolean }) {
  return (
    <SectionCard title="Ranking de productos" sub="Más vendidos del mes" delay={0.34}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Skeleton h={26} w={26} r={8} />
                <div style={{ flex: 1 }}><Skeleton h={12} /><div style={{ marginTop: 5 }}><Skeleton h={10} w="50%" /></div></div>
                <Skeleton h={12} w={48} r={6} />
              </div>
            ))
          : (topProducts ?? []).length === 0
          ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: 13 }}>
              <Package className="w-8 h-8 mx-auto mb-2" style={{ opacity: 0.3 }} />
              Sin datos aún
            </div>
          )
          : (topProducts ?? []).map((p, i) => {
              const thumb = getImageUrl(p.imageUrl)
              return (
                <div key={p.productId} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                    background: CHART_COLORS[i] + '18',
                    border: `1px solid ${CHART_COLORS[i]}28`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 700, color: CHART_COLORS[i],
                  }}>
                    {i + 1}
                  </div>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    background: 'var(--bg-subtle)', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden',
                  }}>
                    {thumb ? (
                      <img src={thumb} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Package className="w-3.5 h-3.5" style={{ color: 'var(--text-disabled)' }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.name}
                    </p>
                    <p style={{ fontSize: 10, color: 'var(--text-disabled)', marginTop: 1 }}>{p.totalQuantity} unidades</p>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--success)', flexShrink: 0 }}>
                    {formatCurrencyCompact(p.totalRevenue)}
                  </span>
                </div>
              )
            })
        }
      </div>
    </SectionCard>
  )
}
