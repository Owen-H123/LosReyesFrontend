// features/auth/schemas/login.schema.ts
//
// QUÉ HACE:
//   Define y exporta el schema de validación Zod para el formulario
//   de login, y el tipo TypeScript inferido de él.
//
// POR QUÉ EXISTE:
//   Separa la lógica de validación del componente y del hook.
//   Reutilizable si en el futuro hay múltiples puntos de entrada
//   (modal de re-autenticación, etc).
//
// RELACIONES:
//   ← Importado por LoginForm.tsx (para inferir tipos de `register`)
//   ← Importado por useAuth.ts (para tipar el parámetro `login`)
//   ← Importado por auth.types.ts (re-exporta LoginFormData)

import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es obligatorio')
    .email('Ingresa un correo electrónico válido'),

  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>