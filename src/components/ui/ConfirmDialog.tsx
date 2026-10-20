// components/ui/ConfirmDialog.tsx
// Dibuja el diálogo que pide confirmDialog() (ver confirm.ts). Se monta una vez en AppProviders.
import { AlertTriangle, Trash2 } from 'lucide-react'
import { Button } from '@components/ui/Button'
import { Modal, ModalFooter } from '@components/ui/Modal'
import { useConfirmStore } from '@components/ui/confirm'

export function ConfirmDialogHost() {
  const { options, resolve } = useConfirmStore()
  if (!options) return null

  const close = (ok: boolean) => {
    resolve?.(ok)
    useConfirmStore.setState({ options: null, resolve: null })
  }
  const tone = options.tone ?? 'danger'

  return (
    <Modal
      size="sm"
      tone={tone}
      icon={tone === 'danger' ? <Trash2 /> : <AlertTriangle />}
      title={options.title}
      description={options.description}
      onClose={() => close(false)}
    >
      <ModalFooter>
        <Button variant="secondary" onClick={() => close(false)}>
          {options.cancelLabel ?? 'Cancelar'}
        </Button>
        <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={() => close(true)} autoFocus>
          {options.confirmLabel ?? 'Confirmar'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
