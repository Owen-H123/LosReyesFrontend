// components/shared/ErrorFallback.tsx
// Lo que ve el usuario cuando una pantalla falla.
//   variant="page"       → dentro del contenido; el menú y la cabecera siguen visibles
//   variant="fullscreen" → pantalla completa, cuando falla algo fuera de las pantallas
// No usa el router (puede mostrarse fuera de él): navega con window.location.
import { AlertTriangle, Home, RefreshCw, RotateCcw } from 'lucide-react'
import { Button } from '@components/ui/Button'
import { isChunkLoadError } from '@lib/errors'

interface Props {
  error: Error
  reset?: () => void
  variant?: 'page' | 'fullscreen'
}

export function ErrorFallback({ error, reset, variant = 'page' }: Props) {
  const newVersion = isChunkLoadError(error)

  const title = newVersion ? 'Hay una versión nueva del sistema' : 'Algo salió mal en esta pantalla'
  const message = newVersion
    ? 'Recarga la página para usar la versión más reciente.'
    : 'Puedes volver a intentarlo o ir al inicio. Si el problema continúa, avisa al administrador.'

  const content = (
    <div role="alert" className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--danger-light)]">
        <AlertTriangle className="h-7 w-7 text-[var(--danger)]" />
      </div>
      <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary, #fff)' }}>{title}</h2>
      <p className="text-sm" style={{ color: 'var(--text-muted, #94a3b8)' }}>{message}</p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {newVersion || !reset ? (
          <Button leftIcon={<RefreshCw className="h-4 w-4" />} onClick={() => window.location.reload()}>
            Recargar página
          </Button>
        ) : (
          <Button leftIcon={<RotateCcw className="h-4 w-4" />} onClick={reset}>
            Volver a intentar
          </Button>
        )}
        <Button variant="secondary" leftIcon={<Home className="h-4 w-4" />}
          onClick={() => { window.location.href = '/dashboard' }}>
          Ir al inicio
        </Button>
      </div>

      {/* El detalle técnico solo se muestra en desarrollo */}
      {import.meta.env.DEV && (
        <details className="w-full text-left text-xs" style={{ color: 'var(--text-muted, #94a3b8)' }}>
          <summary className="cursor-pointer">Detalle técnico</summary>
          <pre className="mt-2 overflow-auto whitespace-pre-wrap rounded bg-black/30 p-3">{error.message}</pre>
        </details>
      )}
    </div>
  )

  if (variant === 'fullscreen') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-surface)] p-4">{content}</div>
    )
  }
  return <div className="flex h-full items-center justify-center py-16">{content}</div>
}
