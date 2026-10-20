// features/dashboard/components/ChartTooltip.tsx
import { formatCurrency, formatDate, truncate } from '@lib/utils'

// Recibe opcionalmente el objeto de datos completo del punto (payload[0].payload)
// para poder mostrar la fecha exacta (AreaChart) o el nombre completo del
// producto (BarChart) sin depender de lo que se ve truncado en el eje X.
export function ChartTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { value: number; payload?: { date?: string; name?: string } }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload
  // Si el punto trae "date" (ISO), es el AreaChart de ingresos diarios:
  // mostramos el nombre corto del día + la fecha completa como referencia extra.
  const fullDate = point?.date ? formatDate(point.date, "dd 'de' MMMM") : null
  // Si el punto trae "name" (nombre completo del producto), es el BarChart de
  // Top 5 — puede diferir del "label" truncado que se ve en el eje.
  const fullName = point?.name

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '10px 14px',
      boxShadow: 'var(--shadow-lg)',
      maxWidth: 220,
    }}>
      <p style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 4 }}>
        {fullName ?? label}
      </p>
      {fullDate && (
        <p style={{ color: 'var(--text-disabled)', fontSize: 10, marginBottom: 4 }}>
          {fullDate}
        </p>
      )}
      <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 14 }}>
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  )
}

// Tick del eje X del BarChart "Top 5 productos": trunca el nombre visible
// (el nombre completo del producto vive en el dataKey y sí llega íntegro
// al tooltip vía ChartTooltip -> point.name) para que 5 nombres largos no se
// amontonen o corten literalmente a la mitad de una palabra.
export function ProductNameTick({ x, y, payload }: { x: number; y: number; payload: { value: string } }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={12} textAnchor="middle" fill="var(--text-disabled)" fontSize={10.5}>
        {truncate(payload.value, 13)}
      </text>
    </g>
  )
}
