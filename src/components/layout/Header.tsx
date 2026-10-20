// components/layout/Header.tsx
import { Search, Bell, Sun, Moon, Command, AlertTriangle, PackageX } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUIStore } from '@store/ui.store'
import { useDashboardSummary, useLowStockDashboard } from '@features/dashboard/hooks/useDashboard'
import { DropdownPortal } from '@components/ui/DropdownPortal'
import { HEADER_HEIGHT } from '@constants/layout'

export function Header() {
  const [searchFocus, setSearchFocus] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const notifBtnRef   = useRef<HTMLButtonElement>(null)

  const navigate    = useNavigate()
  const { openCommandPalette, theme, toggleTheme } = useUIStore()
  const { data: summary } = useDashboardSummary()
  const { data: lowStockProducts } = useLowStockDashboard()

  useEffect(() => {
    if (!notifOpen) return
    function onClick(e: MouseEvent) {
      const target = e.target as Node
      if (notifBtnRef.current?.contains(target))   return
      setNotifOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [notifOpen])

  const hasLowStock = (summary?.lowStockCount ?? 0) > 0

  return (
    <header
      className="flex-shrink-0 flex items-center gap-4 px-6"
      style={{
        background: 'var(--header-bg)',
        borderBottom: '1px solid var(--header-border)',
        height: HEADER_HEIGHT,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Search */}
      <div className="flex-1 max-w-lg">
        <button
          onClick={openCommandPalette}
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setSearchFocus(false)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-left"
          style={{
            background: 'var(--bg-subtle)',
            border: `1px solid ${searchFocus ? 'var(--accent)' : 'var(--border)'}`,
            boxShadow: searchFocus ? '0 0 0 3px var(--accent-light)' : 'none',
          }}
        >
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-disabled)' }} />
          <span className="text-sm flex-1" style={{ color: 'var(--text-disabled)' }}>
            Buscar productos, clientes, SKU...
          </span>
          <span
            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium flex-shrink-0"
            style={{
              background: 'var(--bg-muted)',
              border: '1px solid var(--border)',
              color: 'var(--text-disabled)',
            }}
          >
            <Command className="w-2.5 h-2.5" />K
          </span>
        </button>
      </div>

      {/* Right section */}
      <div className="ml-auto flex items-center gap-1">

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-subtle)'; e.currentTarget.style.color = 'var(--text-primary)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
          title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button
          ref={notifBtnRef}
          onClick={() => setNotifOpen(o => !o)}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all relative"
          style={{
            color: notifOpen ? 'var(--text-primary)' : 'var(--text-muted)',
            background: notifOpen ? 'var(--bg-subtle)' : 'transparent',
          }}
          onMouseEnter={e => { if (!notifOpen) { e.currentTarget.style.background = 'var(--bg-subtle)'; e.currentTarget.style.color = 'var(--text-primary)' } }}
          onMouseLeave={e => { if (!notifOpen) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' } }}
        >
          <Bell className="w-4 h-4" />
          {hasLowStock && (
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-pulse-dot"
              style={{ background: 'var(--danger)' }}
            />
          )}
        </button>

        <DropdownPortal anchorRef={notifBtnRef} open={notifOpen} width={340}>
          <div
            className="rounded-xl shadow-xl overflow-hidden"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Notificaciones</p>
                {hasLowStock && (
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: 'var(--danger)', color: 'var(--accent-contrast)' }}
                  >
                    {summary?.lowStockCount}
                  </span>
                )}
              </div>
            </div>

            <div className="p-2 max-h-80 overflow-y-auto no-scrollbar">
              {hasLowStock && lowStockProducts?.length ? (
                <>
                  <p className="px-3 py-1 text-[11px] font-medium uppercase tracking-wide" style={{ color: 'var(--text-disabled)' }}>
                    Stock crítico
                  </p>
                  {lowStockProducts.slice(0, 5).map(p => (
                    <button
                      key={p.id}
                      onClick={() => { navigate(`/inventory?action=entry&productId=${p.id}`); setNotifOpen(false) }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors"
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'var(--danger-light)', border: '1px solid var(--danger-border)' }}
                      >
                        <AlertTriangle className="w-4 h-4" style={{ color: 'var(--danger)' }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{p.code}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold" style={{ color: 'var(--danger)' }}>{p.stock}</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-disabled)' }}>mín {p.minimumStock}</p>
                      </div>
                    </button>
                  ))}
                  {lowStockProducts.length > 5 && (
                    <p className="px-3 py-1.5 text-xs text-center" style={{ color: 'var(--text-disabled)' }}>
                      +{lowStockProducts.length - 5} producto{lowStockProducts.length - 5 !== 1 ? 's' : ''} más
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center py-10">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ background: 'var(--bg-subtle)' }}
                  >
                    <PackageX className="w-5 h-5" style={{ color: 'var(--text-disabled)' }} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Todo tranquilo por ahora</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-disabled)' }}>Sin notificaciones nuevas</p>
                </div>
              )}
            </div>

            {hasLowStock && lowStockProducts?.length ? (
              <button
                onClick={() => { navigate('/inventory'); setNotifOpen(false) }}
                className="w-full py-2.5 text-xs font-medium text-center transition-colors"
                style={{ borderTop: '1px solid var(--border)', color: 'var(--accent)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Ver inventario completo
              </button>
            ) : null}
          </div>
        </DropdownPortal>

      </div>
    </header>
  )
}