// features/auth/interfaces/auth.types.ts
//
// QUÉ HACE:
//   Tipos TypeScript del módulo de autenticación.
//   Incluye UseAuthReturn que tipea el retorno de useAuth().
//
// RELACIONES:
//   → Usado por useAuth.ts (exporta UseAuthReturn)
//   → Usado por LoginForm.tsx, LoginPage.tsx

export type UserRole = 'ADMIN' | 'WORKER'

export interface AuthUser {
  id:    number
  name:  string
  email: string
  role:  UserRole
}

export interface LoginRequest {
  email:    string
  password: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword:     string
}

// Retorno del hook useAuth()
export interface UseAuthReturn {
  isSubmitting: boolean
  apiError:     string | null
  login:        (data: import('@features/auth/schemas/login.schema').LoginFormData) => Promise<void>
  logout:       () => Promise<void>
  clearError:   () => void
}