// features/webstore/pages/WebCatalogPage.tsx
// Módulo "Catálogo web": qué productos se ven en la tienda y cuáles van destacados.
import { useState } from 'react'
import { Eye, EyeOff, Search, Star, Package } from 'lucide-react'
import { PageHeader } from '@components/ui/Form'
import { Input } from '@components/ui/Input'
import { useDebounce } from '@hooks/useDebounce'
import { cn, formatCurrency, getImageUrl } from '@lib/utils'
import { useWebCatalog, useUpdateCatalogItem, useWebstoreSummary } from '@features/webstore/hooks/useWebstore'
import { Pager } from '@features/webstore/components/Pager'

type Filter = 'all' | 'published' | 'hidden' | 'featured'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'published', label: 'Publicados' },
  { value: 'hidden', label: 'Ocultos' },
  { value: 'featured', label: 'Destacados' },
]

export default function WebCatalogPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [page, setPage] = useState(0)
  const debounced = useDebounce(search, 350)
  const { data: summary } = useWebstoreSummary()

  const { data, isLoading } = useWebCatalog({
    search: debounced.trim() || undefined,
    published: filter === 'published' ? true : filter === 'hidden' ? false : undefined,
    featured: filter === 'featured' || undefined,
    page,
    size: 20,
  })
  const update = useUpdateCatalogItem()

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader
        title="Catálogo web"
        subtitle="Elige qué productos se ven en la tienda online. Ocultar un producto no lo desactiva en el ERP."
      />

      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[220px]">
          <Input
            placeholder="Buscar por nombre, código o marca"
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
          />
        </div>
        <div className="flex gap-1 p-1 rounded-lg bg-[var(--bg-subtle)]">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => { setFilter(f.value); setPage(0) }}
              className={`h-8 px-3 rounded-md text-[13px] font-medium transition-colors ${
                filter === f.value ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-[var(--shadow-sm)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="section-title">Productos activos {data && <span className="font-normal text-[var(--text-muted)]">({data.totalElements})</span>}</h2>
          {summary && <span className="text-sm text-[var(--text-muted)]">{summary.publishedProducts} publicados en la web</span>}
        </div>

        {isLoading ? (
          <div className="p-5 space-y-3">{[0, 1, 2, 3].map(i => <div key={i} className="skeleton h-14 w-full" />)}</div>
        ) : !data?.content.length ? (
          <div className="py-16 text-center">
            <Package className="w-8 h-8 mx-auto text-[var(--text-disabled)]" strokeWidth={1.5} />
            <p className="mt-3 text-sm font-medium text-[var(--text-secondary)]">No hay productos con esos filtros</p>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-[var(--border)]">
              {data.content.map(p => {
                const img = getImageUrl(p.imageUrl)
                return (
                  <li key={p.id} className={cn('px-5 py-3 flex items-center gap-4', !p.published && 'opacity-60')}>
                    <div className="w-11 h-11 rounded-md overflow-hidden shrink-0 flex items-center justify-center bg-[var(--bg-subtle)] border border-[var(--border)]">
                      {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-[var(--text-disabled)]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-[var(--text-primary)]">{p.name}</p>
                      <p className="text-xs text-[var(--text-muted)] truncate">
                        <span className="font-mono">{p.code}</span>{p.brand && ` · ${p.brand}`}{p.categoryName && ` · ${p.categoryName}`}
                      </p>
                    </div>
                    <div className="hidden sm:block text-right shrink-0 w-24">
                      <p className="text-sm font-semibold tabular-nums">{formatCurrency(Number(p.price))}</p>
                      <p className={cn('text-xs tabular-nums', p.stock === 0 ? 'text-[var(--danger)]' : 'text-[var(--text-muted)]')}>
                        {p.stock === 0 ? 'Sin stock' : `${p.stock} en stock`}
                      </p>
                    </div>
                    <button
                      onClick={() => update.mutate({ id: p.id, featured: !p.featured })}
                      disabled={!p.published || update.isPending}
                      title={p.featured ? 'Quitar de destacados' : 'Destacar en la tienda'}
                      aria-label={p.featured ? 'Quitar de destacados' : 'Destacar en la tienda'}
                      aria-pressed={p.featured}
                      className={cn('w-9 h-9 rounded-md flex items-center justify-center border transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
                        p.featured ? 'border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]' : 'border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]')}
                    >
                      <Star className="w-4 h-4" fill={p.featured ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => update.mutate({ id: p.id, published: !p.published })}
                      disabled={update.isPending}
                      className={cn('h-9 w-28 rounded-md inline-flex items-center justify-center gap-2 text-[13px] font-medium border transition-colors',
                        p.published ? 'border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]' : 'border-transparent bg-[var(--accent)] text-white')}
                    >
                      {p.published ? <><EyeOff className="w-4 h-4" /> Ocultar</> : <><Eye className="w-4 h-4" /> Publicar</>}
                    </button>
                  </li>
                )
              })}
            </ul>
            <Pager page={page} totalPages={data.totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
