// components/shared/CommandPalette.tsx
import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, LayoutDashboard, Package, ShoppingCart,
  Users, Warehouse, FileText, Settings, Tag, Car,
  UserCog, ScrollText, X
} from 'lucide-react'
import { useUIStore } from '@store/ui.store'
import { usePermission } from '@features/auth/hooks/usePermission'
import { cn } from '@lib/utils'

interface CommandItem {
  id: string
  label: string
  description?: string
  icon: React.ElementType
  path: string
  keywords: string[]
  // Igual que NAV_ITEMS en Sidebar.tsx: si está presente, solo se
  // muestra cuando el permiso correspondiente (usePermission) es true.
  // Así el Ctrl+K nunca ofrece una ruta que el propio menú lateral oculta.
  visible?: (perms: ReturnType<typeof usePermission>) => boolean
}

const COMMANDS: CommandItem[] = [
  { id: 'dashboard',  label: 'Dashboard',       icon: LayoutDashboard, path: '/dashboard',  keywords: ['inicio', 'home', 'resumen'] },
  { id: 'pos',        label: 'Nueva Venta',      icon: ShoppingCart,    path: '/sales/new',  keywords: ['venta', 'pos', 'cobrar', 'sale'] },
  { id: 'sales',      label: 'Historial Ventas', icon: ShoppingCart,    path: '/sales',      keywords: ['ventas', 'historial', 'comprobante'] },
  { id: 'products',   label: 'Productos',        icon: Package,         path: '/products',   keywords: ['productos', 'catalogo', 'articulos'] },
  { id: 'categories', label: 'Categorías',       icon: Tag,             path: '/categories', keywords: ['categorias', 'grupos'] },
  { id: 'inventory',  label: 'Inventario',       icon: Warehouse,       path: '/inventory',  keywords: ['inventario', 'stock', 'almacen'] },
  { id: 'customers',  label: 'Clientes',         icon: Users,           path: '/customers',  keywords: ['clientes', 'compradores'] },
  { id: 'vehicles',   label: 'Vehículos',        icon: Car,             path: '/vehicles',   keywords: ['vehiculos', 'autos', 'marcas'] },
  { id: 'users',      label: 'Usuarios',         icon: UserCog,         path: '/users',      keywords: ['usuarios', 'empleados', 'staff'], visible: p => p.canManageUsers },
  { id: 'reports',    label: 'Reportes',         icon: FileText,        path: '/reports',    keywords: ['reportes', 'informes', 'excel'],  visible: p => p.canViewReports },
  { id: 'audit',      label: 'Auditoría',        icon: ScrollText,      path: '/audit',      keywords: ['auditoria', 'logs', 'historial'], visible: p => p.canViewAudit },
  { id: 'settings',   label: 'Configuración',    icon: Settings,        path: '/settings',   keywords: ['configuracion', 'perfil', 'password'] },
]

export function CommandPalette() {
  const { commandPaletteOpen, closeCommandPalette } = useUIStore()
  const navigate = useNavigate()
  const perms = usePermission()
  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)

  const allowed = COMMANDS.filter(c => !c.visible || c.visible(perms))

  const filtered = query.trim()
    ? allowed.filter(c => {
        const q = query.toLowerCase()
        return (
          c.label.toLowerCase().includes(q) ||
          c.keywords.some(k => k.includes(q))
        )
      })
    : allowed

  const handleSelect = useCallback((item: CommandItem) => {
    navigate(item.path)
    closeCommandPalette()
    setQuery('')
    setSelectedIdx(0)
  }, [navigate, closeCommandPalette])

  // Keyboard shortcut to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (commandPaletteOpen) closeCommandPalette()
        else useUIStore.getState().openCommandPalette()
      }
      if (e.key === 'Escape' && commandPaletteOpen) closeCommandPalette()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [commandPaletteOpen, closeCommandPalette])

  // Arrow key navigation + Enter
  useEffect(() => {
    if (!commandPaletteOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIdx(i => Math.min(i + 1, filtered.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIdx(i => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filtered[selectedIdx]) handleSelect(filtered[selectedIdx])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [commandPaletteOpen, filtered, selectedIdx, handleSelect])

  // Reset selection when query changes
  useEffect(() => { setSelectedIdx(0) }, [query])

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 backdrop-blur-[2px]"
            style={{ background: 'var(--overlay)' }}
            onClick={closeCommandPalette}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 z-50 w-full max-w-xl"
          >
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
                <Search className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                <input
                  autoFocus
                  className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm outline-none"
                  placeholder="Buscar módulo, acción..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
                <button onClick={closeCommandPalette} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-[var(--text-muted)]">
                    Sin resultados para "{query}"
                  </div>
                ) : (
                  <ul className="space-y-0.5">
                    {filtered.map((item, idx) => {
                      const Icon = item.icon
                      return (
                        <li key={item.id}>
                          <button
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                              idx === selectedIdx
                                ? 'bg-[var(--accent)] text-[var(--text-primary)]'
                                : 'text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
                            )}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setSelectedIdx(idx)}
                          >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm font-medium">{item.label}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>

              {/* Footer hints */}
              <div className="px-4 py-2 border-t border-[var(--border)] flex items-center gap-4">
                {[
                  { keys: ['↑', '↓'], label: 'navegar' },
                  { keys: ['↵'], label: 'seleccionar' },
                  { keys: ['Esc'], label: 'cerrar' },
                ].map(({ keys, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    {keys.map(k => (
                      <kbd key={k} className="px-1.5 py-0.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded text-xs text-[var(--text-muted)]">
                        {k}
                      </kbd>
                    ))}
                    <span className="text-xs text-[var(--text-muted)]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}