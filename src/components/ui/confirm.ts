// components/ui/confirm.ts
// Reemplazo de window.confirm() con el Modal del sistema. Lo dibuja <ConfirmDialogHost />.
//   if (!(await confirmDialog({ title: '¿Eliminar?', confirmLabel: 'Eliminar' }))) return
import type React from 'react'
import { create } from 'zustand'
import type { ModalTone } from '@components/ui/Modal'

export interface ConfirmOptions {
  title: string
  description?: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  tone?: Extract<ModalTone, 'danger' | 'warning' | 'accent'>
}

interface ConfirmState {
  options: ConfirmOptions | null
  resolve: ((ok: boolean) => void) | null
}

export const useConfirmStore = create<ConfirmState>(() => ({ options: null, resolve: null }))

export function confirmDialog(options: ConfirmOptions): Promise<boolean> {
  // Si ya había uno abierto, se da por cancelado
  useConfirmStore.getState().resolve?.(false)
  return new Promise(resolve => useConfirmStore.setState({ options, resolve }))
}
