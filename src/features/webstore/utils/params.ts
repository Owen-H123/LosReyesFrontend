// features/webstore/utils/params.ts
/** Copia de los parámetros de la URL con `key` puesto, o quitado si `value` está vacío. */
export function withParam(params: URLSearchParams, key: string, value: string): URLSearchParams {
  const next = new URLSearchParams(params)
  if (value) next.set(key, value)
  else next.delete(key)
  return next
}
