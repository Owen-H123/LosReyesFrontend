import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@app/App'
import { ErrorBoundary } from '@components/shared/ErrorBoundary'
import { ErrorFallback } from '@components/shared/ErrorFallback'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Red de seguridad: si falla algo fuera de las pantallas (menú, login,  */}
    {/* proveedores), se muestra un error a pantalla completa, no en blanco. */}
    <ErrorBoundary fallback={error => <ErrorFallback error={error} variant="fullscreen" />}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)