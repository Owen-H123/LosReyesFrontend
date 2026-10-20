// features/audit/pages/AuditPage.tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, ScrollText, ChevronDown, ChevronRight } from 'lucide-react'
import { auditApi } from '@features/audit/services/audit.api'
import {  formatDateTime } from '@lib/utils'
import { useDebounce } from '@hooks/useDebounce'

const MODULES = ['AUTH', 'PRODUCTS', 'SALES', 'INVENTORY', 'CUSTOMERS', 'USERS', 'CATEGORIES', 'VEHICLES']

const ACTION_COLORS: Record<string, string> = {
  CREATE: 'bg-[var(--success-light)] text-[var(--success)]',
  UPDATE: 'bg-[var(--accent-light)] text-[var(--accent-text)]',
  DELETE: 'bg-[var(--danger-light)] text-[var(--danger)]',
  LOGIN:  'bg-[var(--info-light)] text-[var(--info)]',
  LOGOUT: 'bg-[var(--bg-subtle)] text-[var(--text-muted)]',
  VIEW:   'bg-[var(--bg-subtle)] text-[var(--text-secondary)]',
}

// IPv6 de loopback (::1) = la misma PC donde corre el servidor
const formatIp = (ip?: string | null) =>
  !ip ? '—' : ip === '0:0:0:0:0:0:0:1' || ip === '::1' || ip === '127.0.0.1' ? 'Local (esta PC)' : ip

export default function AuditPage() {
  const [search, setSearch]       = useState('')
  const [moduleFilter, setModule] = useState('')
  const [expanded, setExpanded]   = useState<number | null>(null)
  const [page, setPage]           = useState(0)

  const debouncedSearch = useDebounce(search, 350)

  const { data, isLoading } = useQuery({
    queryKey: ['audit', { search: debouncedSearch, module: moduleFilter, page }],
    queryFn:  () => auditApi.getAll({ search: debouncedSearch, module: moduleFilter || undefined, page, size: 50 }),
  })

  const logs = data?.content ?? []

  const getActionColor = (action: string) => {
    const key = Object.keys(ACTION_COLORS).find(k => action.startsWith(k))
    return key ? ACTION_COLORS[key] : 'bg-[var(--bg-subtle)] text-[var(--text-muted)]'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">Auditoría</h1>
        <p className="page-subtitle">
          Registro de todas las acciones del sistema
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            className="field-input pl-9"
            placeholder="Buscar por usuario, descripción..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
          />
        </div>
        <select
          className="field-input w-auto min-w-[160px]"
          value={moduleFilter}
          onChange={e => { setModule(e.target.value); setPage(0) }}
        >
          <option value="">Todos los módulos</option>
          {MODULES.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>

      {/* Log list */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-[var(--accent-text)]" />
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            {data?.totalElements ?? 0} registros
          </span>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {isLoading ? (
            <div className="px-4 py-12 text-center text-[var(--text-muted)]">Cargando registros...</div>
          ) : logs.length === 0 ? (
            <div className="px-4 py-12 text-center text-[var(--text-muted)]">Sin registros de auditoría</div>
          ) : logs.map(log => (
            <div key={log.id}>
              <button
                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-[var(--bg-surface)] transition-colors text-left"
                onClick={() => setExpanded(expanded === log.id ? null : log.id)}
              >
                <div className="flex-shrink-0 text-[var(--text-muted)]">
                  {expanded === log.id
                    ? <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
                    : <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                  }
                </div>

                <span className={`text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0 ${getActionColor(log.action)}`}>
                  {log.action}
                </span>

                <span className="text-xs px-2 py-0.5 bg-[var(--bg-subtle)] text-[var(--text-muted)] rounded border border-[var(--border)] flex-shrink-0">
                  {log.module}
                </span>

                <span className="text-sm text-[var(--text-muted)] flex-1 truncate">{log.description}</span>

                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-medium text-[var(--text-primary)]">{log.userEmail}</p>
                  <p className="text-xs text-[var(--text-muted)]">{formatDateTime(log.createdAt)}</p>
                </div>
              </button>

              {expanded === log.id && (
                <div className="px-12 py-4 bg-[var(--bg-subtle)] border-t border-[var(--border)]">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <p className="text-[var(--text-muted)] mb-1">ID de entidad</p>
                      <p className="text-[var(--text-primary)] font-mono">{log.entityId ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-muted)] mb-1">IP</p>
                      <p className="text-[var(--text-primary)] font-mono">{formatIp(log.ipAddress)}</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-muted)] mb-1">ID de usuario</p>
                      <p className="text-[var(--text-primary)]">{log.userId ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-[var(--text-muted)] mb-1">Fecha y hora</p>
                      <p className="text-[var(--text-primary)]">{formatDateTime(log.createdAt)}</p>
                    </div>
                  </div>
                  {log.metadata && (
                    <div className="mt-3">
                      <p className="text-[var(--text-muted)] text-xs mb-1">Metadata</p>
                      <pre className="text-xs text-[var(--text-secondary)] bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-3 overflow-auto max-h-40">
                        {(() => {
                          try { return JSON.stringify(JSON.parse(log.metadata!), null, 2) }
                          catch { return log.metadata }
                        })()}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-[var(--border)] flex items-center justify-between">
            <p className="text-xs text-[var(--text-muted)]">Página {page + 1} de {data.totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={data.first}
                className="px-3 py-1 text-xs bg-[var(--bg-subtle)] text-[var(--text-muted)] rounded disabled:opacity-40 hover:bg-[var(--bg-muted)] transition-colors"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={data.last}
                className="px-3 py-1 text-xs bg-[var(--bg-subtle)] text-[var(--text-muted)] rounded disabled:opacity-40 hover:bg-[var(--bg-muted)] transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}