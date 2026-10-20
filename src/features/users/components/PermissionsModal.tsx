// features/users/components/PermissionsModal.tsx
import { useEffect, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { Button } from '@components/ui/Button'
import { Modal, ModalBody, ModalFooter } from '@components/ui/Modal'
import { useUserPermissions, useUpdateUserPermissions } from '@features/users/hooks/useUsers'
import type { PermissionCode } from '@interfaces/api.types'

interface Props {
  userId: number
  userName: string
  onClose: () => void
}

/**
 * PermissionsModal — el ADMIN activa/desactiva acciones específicas para
 * UN trabajador en particular (no afecta a los demás WORKER). La lista de
 * checkboxes viene del backend (UserPermissionService.LABELS), así que si
 * mañana se agrega un permiso nuevo al enum, aparece aquí solo.
 */
export default function PermissionsModal({ userId, userName, onClose }: Props) {
  const { data: permissions, isLoading } = useUserPermissions(userId)
  const updateMutation = useUpdateUserPermissions(userId)

  const [selected, setSelected] = useState<Set<PermissionCode>>(new Set())

  useEffect(() => {
    if (permissions) {
      setSelected(new Set(permissions.filter(p => p.granted).map(p => p.code)))
    }
  }, [permissions])

  const toggle = (code: PermissionCode) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      return next
    })
  }

  const handleSave = () => {
    updateMutation.mutate(Array.from(selected), { onSuccess: onClose })
  }

  return (
    <Modal
      title="Permisos"
      description={<>Acciones extra para <span className="font-medium text-[var(--text-primary)]">{userName}</span>, además de lo básico de un trabajador.</>}
      icon={<ShieldCheck />}
      onClose={onClose}
    >
      <ModalBody className="!space-y-0">

        {isLoading ? (
          <div className="py-8 text-center text-sm text-[var(--text-muted)]">Cargando...</div>
        ) : (
          <div className="space-y-1 -mx-3">
            {permissions?.map(p => (
              <label
                key={p.code}
                className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--bg-subtle)] cursor-pointer transition-colors"
              >
                <span className="text-sm text-[var(--text-primary)]">{p.label}</span>
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-[var(--accent)]"
                  checked={selected.has(p.code)}
                  onChange={() => toggle(p.code)}
                />
              </label>
            ))}
          </div>
        )}

      </ModalBody>
      <ModalFooter>
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="button" loading={updateMutation.isPending} onClick={handleSave}>
          Guardar permisos
        </Button>
      </ModalFooter>
    </Modal>
  )
}