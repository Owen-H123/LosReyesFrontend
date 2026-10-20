// features/webstore/pages/WebCustomersPage.tsx
// Módulo "Clientes web": quienes compraron desde la tienda, agrupados por celular.
import { useMemo, useState } from 'react'
import { MessageCircle, Search, Users } from 'lucide-react'
import { PageHeader } from '@components/ui/Form'
import { Input } from '@components/ui/Input'
import { Button } from '@components/ui/Button'
import { formatCurrency, formatDate } from '@lib/utils'
import { useWebCustomers } from '@features/webstore/hooks/useWebstore'
import { whatsappLink } from '@features/webstore/utils/whatsapp'

export default function WebCustomersPage() {
  const { data, isLoading } = useWebCustomers()
  const [search, setSearch] = useState('')
  const [onlyRepeat, setOnlyRepeat] = useState(false)

  const customers = useMemo(() => {
    const q = search.trim().toLowerCase()
    return (data ?? []).filter(c =>
      (!onlyRepeat || c.orders > 1) &&
      (!q || c.name.toLowerCase().includes(q) || c.phone.includes(q)))
  }, [data, search, onlyRepeat])

  const totals = useMemo(() => ({
    all: data?.length ?? 0,
    repeat: data?.filter(c => c.orders > 1).length ?? 0,
    spent: data?.reduce((s, c) => s + Number(c.totalSpent), 0) ?? 0,
  }), [data])

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader
        title="Clientes web"
        subtitle="Personas que han pedido desde la tienda, agrupadas por celular. Los cancelados no suman a lo gastado."
      />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {[
          { label: 'Clientes', value: totals.all },
          { label: 'Recurrentes', value: totals.repeat, hint: 'Más de un pedido' },
          { label: 'Comprado en la web', value: formatCurrency(totals.spent) },
        ].map(t => (
          <div key={t.label} className="card p-5">
            <p className="text-[13px] font-medium text-[var(--text-muted)]">{t.label}</p>
            <p className="mt-2 text-[28px] font-bold tracking-tight leading-none tabular-nums text-[var(--text-primary)]">{isLoading ? '–' : t.value}</p>
            {t.hint && <p className="mt-2 text-xs text-[var(--text-muted)]">{t.hint}</p>}
          </div>
        ))}
      </div>

      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[220px]">
          <Input placeholder="Buscar por nombre o celular" leftIcon={<Search className="w-4 h-4" />} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
          <input type="checkbox" checked={onlyRepeat} onChange={e => setOnlyRepeat(e.target.checked)} />
          Solo recurrentes
        </label>
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-5 space-y-3">{[0, 1, 2, 3].map(i => <div key={i} className="skeleton h-12 w-full" />)}</div>
        ) : !customers.length ? (
          <div className="py-16 text-center">
            <Users className="w-8 h-8 mx-auto text-[var(--text-disabled)]" strokeWidth={1.5} />
            <p className="mt-3 text-sm font-medium text-[var(--text-secondary)]">
              {data?.length ? 'Ningún cliente coincide con la búsqueda' : 'Todavía no hay clientes web'}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-[var(--text-muted)] border-b border-[var(--border)]">
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-3 py-3 font-medium text-right">Pedidos</th>
                <th className="px-3 py-3 font-medium text-right">Gastado</th>
                <th className="px-3 py-3 font-medium hidden md:table-cell">Último pedido</th>
                <th className="px-5 py-3 w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {customers.map(c => (
                <tr key={c.phone}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-[var(--text-primary)]">{c.name}</p>
                    <p className="text-xs text-[var(--text-muted)] tabular-nums">{c.phone}</p>
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {c.orders}{c.orders > 1 && <span className="ml-2 badge badge-brand">Recurrente</span>}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums font-semibold">{formatCurrency(Number(c.totalSpent))}</td>
                  <td className="px-3 py-3 hidden md:table-cell text-[var(--text-muted)]">{formatDate(c.lastOrderAt)}</td>
                  <td className="px-5 py-3 text-right">
                    <a href={whatsappLink(c.phone, `Hola ${c.name}, te escribimos de De los Reyes.`)} target="_blank" rel="noreferrer" aria-label={`Escribir a ${c.name}`}>
                      <Button variant="ghost" size="sm" leftIcon={<MessageCircle className="w-4 h-4" />} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
