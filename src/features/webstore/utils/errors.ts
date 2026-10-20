// features/webstore/utils/errors.ts
/** Mensaje que mandó el backend en una respuesta de error, o `fallback` si no hay. */
export function apiErrorMessage(error: unknown, fallback: string): string {
  const message = (error as { response?: { data?: { message?: unknown } } })?.response?.data?.message
  return typeof message === 'string' && message ? message : fallback
}
