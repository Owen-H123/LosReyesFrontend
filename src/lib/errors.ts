// lib/errors.ts

// Al publicar una versión nueva, los archivos JS de cada pantalla cambian de
// nombre. Si alguien tiene abierta la versión anterior y navega a una pantalla
// que todavía no cargó, el navegador no encuentra el archivo viejo. La solución
// es recargar la página, no un mensaje de "algo salió mal".
const CHUNK_LOAD_PATTERNS = [
  'Failed to fetch dynamically imported module', // Chrome, Edge
  'Importing a module script failed',            // Safari
  'error loading dynamically imported module',   // Firefox
]

export function isChunkLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  return CHUNK_LOAD_PATTERNS.some(pattern => message.includes(pattern))
}
