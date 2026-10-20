// components/layout/Sidebar.tsx
// Menú lateral. Se contrae con el botón del encabezado (la preferencia queda
// guardada en ui.store). Abajo: el usuario en sesión y el botón para salir.
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  Warehouse, FileText, Settings,
  Tag, Car, UserCog, ScrollText, LogOut, Globe,
  Inbox, Truck, Store, UsersRound, SlidersHorizontal,
  PanelLeftClose, PanelLeftOpen,
} from 'lucide-react'
import { useAuthStore } from '@store/auth.store'
import { usePermission } from '@features/auth/hooks/usePermission'
import { useLogout } from '@features/auth/hooks/useLogout'
import { useUIStore } from '@store/ui.store'
import { cn, getImageUrl } from '@lib/utils'
import { useDashboardSummary } from '@features/dashboard/hooks/useDashboard'
import { useWebstoreSummary } from '@features/webstore/hooks/useWebstore'
import { SIDEBAR_WIDTH, HEADER_HEIGHT } from '@constants/layout'
import { ROUTES } from '@app/router/routes'
import logo from '@/assets/logos/logo.png'

interface NavItem {
  icon: React.ElementType
  label: string
  path: string
  adminOnly?: boolean
  badgeKey?: 'lowStock' | 'webNew'
  // solo se marca activo en esa ruta exacta (para que "Resumen" no se encienda con sus hermanas)
  exact?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard',     path: '/dashboard' },
  { icon: ShoppingCart,    label: 'POS / Ventas',  path: '/sales' },
  { icon: Package,         label: 'Productos',     path: '/products' },
  { icon: Tag,             label: 'Categorías',    path: '/categories' },
  { icon: Warehouse,       label: 'Inventario',    path: '/inventory', badgeKey: 'lowStock' },
  { icon: Globe,           label: 'Resumen',       path: ROUTES.webstore.root, exact: true },
  { icon: Inbox,           label: 'Pedidos web',   path: ROUTES.webstore.orders, badgeKey: 'webNew' },
  { icon: Truck,           label: 'Entregas',      path: ROUTES.webstore.deliveries },
  { icon: Store,           label: 'Catálogo web',  path: ROUTES.webstore.catalog },
  { icon: UsersRound,      label: 'Clientes web',  path: ROUTES.webstore.customers },
  { icon: SlidersHorizontal, label: 'Ajustes tienda', path: ROUTES.webstore.settings },
  { icon: Users,          label: 'Clientes',      path: '/customers' },
  { icon: Car,             label: 'Vehículos',     path: '/vehicles' },
  { icon: UserCog,         label: 'Usuarios',      path: '/users',    adminOnly: true },
  { icon: FileText,        label: 'Reportes',      path: '/reports',  adminOnly: true },
  { icon: ScrollText,      label: 'Auditoría',     path: '/audit',    adminOnly: true },
  { icon: Settings,        label: 'Configuración', path: '/settings' },
]

const NAV_GROUPS = [
  { label: 'Principal',      paths: ['/dashboard', '/sales', '/products', '/categories', '/inventory'] },
  { label: 'Tienda online',  paths: Object.values(ROUTES.webstore) },
  { label: 'Gestión',        paths: ['/customers', '/vehicles'] },
  { label: 'Administración', paths: ['/users', '/reports', '/audit'] },
  { label: 'Sistema',        paths: ['/settings'] },
]

const ROLE_LABELS: Record<string, string> = { ADMIN: 'Administrador', WORKER: 'Trabajador' }

export function Sidebar() {
  const { user } = useAuthStore()
  const { canManageUsers, canViewAudit, canViewReports } = usePermission()
  const location = useLocation()
  const logout = useLogout()
  const { data: summary } = useDashboardSummary()
  const { data: webSummary } = useWebstoreSummary()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const expanded = !sidebarCollapsed

  const visibleItems = NAV_ITEMS.filter(item => {
    if (!item.adminOnly) return true
    if (item.path === '/users'   && canManageUsers) return true
    if (item.path === '/audit'   && canViewAudit)   return true
    if (item.path === '/reports' && canViewReports) return true
    return false
  })

  const getBadge = (key?: string) => {
    if (key === 'lowStock' && summary?.lowStockCount) return summary.lowStockCount
    if (key === 'webNew' && webSummary?.newCount) return webSummary.newCount
    return null
  }

  const initials = user?.name
    ? user.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'DR'

  return (
    <aside
      className="fixed left-0 top-0 h-full z-30 flex flex-col overflow-hidden transition-[width] duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
      style={{
        width: expanded ? SIDEBAR_WIDTH.expanded : SIDEBAR_WIDTH.collapsed,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Marca: misma altura exacta que el header para que los bordes coincidan */}
      <div
        className={cn('flex items-center flex-shrink-0 px-3.5', expanded ? 'justify-between' : 'justify-center')}
        style={{ height: HEADER_HEIGHT, borderBottom: '1px solid var(--border)' }}
      >
        {expanded ? (
          <>
            <div className="flex items-center gap-2.5 min-w-0">
              <img src={logo} alt="" className="w-8 h-8 object-contain flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight truncate text-[var(--text-primary)]">De Los Reyes</p>
                <p className="text-[11px] leading-tight truncate text-[var(--text-muted)]">Auto Parts ERP</p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              title="Contraer menú"
              aria-label="Contraer menú"
              className="p-1.5 rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition-colors"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={toggleSidebar}
            title="Expandir menú"
            aria-label="Expandir menú"
            className="group relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[var(--bg-subtle)] transition-colors"
          >
            <img src={logo} alt="" className="w-8 h-8 object-contain group-hover:opacity-0 transition-opacity" />
            <PanelLeftOpen className="absolute w-4 h-4 text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-2.5 py-3">
        {NAV_GROUPS.map(group => {
          const items = visibleItems.filter(i => group.paths.includes(i.path))
          if (!items.length) return null

          return (
            <div key={group.label} className="mb-4">
              {expanded
                ? <p className="px-2.5 mb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-disabled)]">{group.label}</p>
                : <div className="mx-2.5 mb-2 h-px bg-[var(--border)]" />}

              <ul className="space-y-0.5">
                {items.map(item => {
                  const Icon = item.icon
                  const isActive =
                    location.pathname === item.path ||
                    (!item.exact && item.path !== '/dashboard' && location.pathname.startsWith(item.path))
                  const badge = getBadge(item.badgeKey)

                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        title={!expanded ? item.label : undefined}
                        className={cn(
                          'relative flex items-center gap-3 h-9 rounded-lg transition-colors',
                          expanded ? 'px-2.5' : 'justify-center',
                          isActive
                            ? 'bg-[var(--accent-light)] text-[var(--accent-text)]'
                            : 'text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]',
                        )}
                      >
                        <span className="relative flex-shrink-0">
                          <Icon className="w-[18px] h-[18px]" style={isActive ? { color: 'var(--accent)' } : undefined} />
                          {badge && !expanded && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--danger)] ring-2 ring-[var(--bg-surface)]" />
                          )}
                        </span>
                        {expanded && <span className="flex-1 text-[13px] font-medium truncate">{item.label}</span>}
                        {badge && expanded && (
                          <span className="text-[10px] font-semibold min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center bg-[var(--danger-light)] text-[var(--danger)]">
                            {badge}
                          </span>
                        )}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </nav>

      {/* Usuario en sesión + salir */}
      <div className="flex-shrink-0 p-2.5" style={{ borderTop: '1px solid var(--border)' }}>
        <div className={cn('flex items-center gap-2.5 rounded-lg', expanded ? 'p-1.5' : 'flex-col')}>
          <NavLink
            to="/settings"
            title={!expanded ? `${user?.name ?? ''} · Mi perfil` : 'Mi perfil'}
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 overflow-hidden"
            style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
          >
            {user?.avatarUrl
              ? <img src={getImageUrl(user.avatarUrl) ?? undefined} alt="" className="w-full h-full object-cover" />
              : initials}
          </NavLink>

          {expanded && (
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium truncate leading-tight text-[var(--text-primary)]">{user?.name}</p>
              <p className="text-[11px] truncate leading-tight text-[var(--text-muted)]">
                {ROLE_LABELS[user?.role ?? ''] ?? user?.role}
              </p>
            </div>
          )}

          <button
            onClick={logout}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
            className="w-8 h-8 flex items-center justify-center rounded-md flex-shrink-0 text-[var(--text-muted)] hover:bg-[var(--danger-light)] hover:text-[var(--danger)] transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
