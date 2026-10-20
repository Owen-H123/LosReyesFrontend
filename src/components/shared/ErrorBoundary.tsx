// components/shared/ErrorBoundary.tsx
// Si un componente hijo lanza un error al renderizarse, en vez de dejar toda la
// app en blanco se muestra `fallback`. React solo permite hacer esto con un
// componente de clase (getDerivedStateFromError / componentDidCatch).
import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback: (error: Error, reset: () => void) => ReactNode
  // Cuando cambia (ej. la ruta), se limpia el error y se vuelve a intentar.
  // Así, al navegar a otra pantalla, el error de la anterior desaparece solo.
  resetKey?: unknown
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Queda en la consola del navegador (F12) para poder diagnosticarlo
    console.error('Error en la interfaz:', error, info.componentStack)
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.reset()
    }
  }

  reset = () => this.setState({ error: null })

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error, this.reset)
    }
    return this.props.children
  }
}
