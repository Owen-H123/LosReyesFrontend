import { useAuthStore } from '@store/auth.store'
import type { PermissionCode } from '@interfaces/api.types'

// ── Permission guard hook ─────────────────────────────────────
// Control de permisos basado en RBAC + permisos individuales.
// ADMIN tiene acceso completo.
// WORKER depende de los permisos asignados por un ADMIN.
// Los permisos llegan desde backend en AuthService.login()
export function usePermission() {
  const { user, isAdmin, isWorker } = useAuthStore()

  // ADMIN siempre pasa.
  // WORKER pasa únicamente si tiene el permiso asignado.
  const has = (code: PermissionCode) =>
    isAdmin() || !!user?.permissions?.includes(code)

  return {

    // Expuesto para consumidores genéricos (p. ej. ProtectedRoute)
    // que necesitan validar un código de permiso arbitrario.
    has,

    // ==========================================================
    // Permisos administrativos / delegables
    // ==========================================================

    // Gestión de usuarios nunca se delega
    canManageUsers: isAdmin(),

    // Permisos asignables individualmente a WORKER
    canViewAudit:         has('VIEW_AUDIT'),
    canViewReports:       has('VIEW_REPORTS'),
    canAdjustInventory:   has('ADJUST_INVENTORY'),
    canDeleteProducts:    has('DELETE_PRODUCTS'),
    canCancelSales:       has('CANCEL_SALES'),
    canManageCategories:  has('MANAGE_CATEGORIES'),
    canEditSales:         has('EDIT_SALES'),


    // ==========================================================
    // Permisos base del sistema
    // ADMIN + WORKER
    // ==========================================================

    canViewDashboard:
      isAdmin() || isWorker(),

    canCreateSales:
      isAdmin() || isWorker(),

    canViewProducts:
      isAdmin() || isWorker(),

    canViewCustomers:
      isAdmin() || isWorker(),

    canViewInventory:
      isAdmin() || isWorker(),

    canCreateProducts:
      isAdmin() || isWorker(),

    canEditProducts:
      isAdmin() || isWorker(),


    // ==========================================================
    // Información del usuario actual
    // ==========================================================

    role: user?.role,

    userId: user?.userId,

    userName: user?.name,
  }
}
