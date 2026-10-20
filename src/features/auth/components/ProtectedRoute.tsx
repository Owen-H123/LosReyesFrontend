import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@store/auth.store'
import { usePermission } from '@features/auth/hooks/usePermission'
import type { UserRole, PermissionCode } from '@interfaces/api.types'

// PermissionCode (en @interfaces/api.types) debe coincidir 1:1 con
// PermissionCode.java (backend). MANAGE_USERS no existe ahí a propósito:
// la gestión de usuarios nunca se delega, solo se controla con requiredRole="ADMIN".

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
  // Permite delegar el acceso a una ruta a un WORKER con este permiso
  // asignado, sin exigir requiredRole="ADMIN". ADMIN siempre pasa.
  requiredPermission?: PermissionCode
}

export function ProtectedRoute({ children, requiredRole, requiredPermission }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()
  const { has } = usePermission()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/403" replace />
  }

  if (requiredPermission && !has(requiredPermission)) {
    return <Navigate to="/403" replace />
  }

  return <>{children}</>
}
