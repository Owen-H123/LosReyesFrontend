// features/dashboard/components/StockAlerts.tsx
// Productos bajo su stock mínimo. Al hacer clic se abre Inventario con el
// formulario de entrada ya cargado para ese producto.
import { useNavigate } from 'react-router-dom'
import { Activity } from 'lucide-react'
import type { Product } from '@interfaces/api.types'
import { SectionCard } from '@features/dashboard/components/SectionCard'
import { Skeleton } from '@features/dashboard/components/Skeleton'

export function StockAlerts({ lowStock, loading }: { lowStock?: Product[]; loading: boolean }) {
  const navigate = useNavigate()

  return (
    <SectionCard
      title="Alertas de stock"
      sub="Productos bajo mínimo"
      delay={0.40}
      right={
        !loading && !!lowStock?.length && (
          <span className="badge badge-danger">{lowStock.length}</span>
        )
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 230, overflowY: 'auto' }} className="no-scrollbar">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 11px', borderRadius: 8, background: 'var(--bg-subtle)' }}>
                <div><Skeleton h={11} w={100} /><div style={{ marginTop: 5 }}><Skeleton h={10} w={60} /></div></div>
                <Skeleton h={20} w={28} r={6} />
              </div>
            ))
          : !lowStock?.length
          ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <Activity className="w-7 h-7 mx-auto mb-2" style={{ color: 'var(--success)', opacity: 0.6 }} />
              <p style={{ fontSize: 12, color: 'var(--success)', fontWeight: 500 }}>Todo en orden</p>
              <p style={{ fontSize: 11, color: 'var(--text-disabled)', marginTop: 2 }}>Stock dentro del rango normal</p>
            </div>
          )
          : lowStock.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => navigate(`/inventory?action=entry&productId=${p.id}`)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  width: '100%', textAlign: 'left', cursor: 'pointer',
                  padding: '9px 12px', borderRadius: 8,
                  background: 'var(--danger-light)',
                  border: '1px solid var(--danger-border)',
                }}
                title="Ir a Inventario para registrar entrada"
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.name}
                  </p>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{p.code}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 10 }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--danger)', lineHeight: 1 }}>{p.stock}</p>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>mín {p.minimumStock}</p>
                </div>
              </button>
            ))
        }
      </div>
    </SectionCard>
  )
}
