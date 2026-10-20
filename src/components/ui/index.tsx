// components/ui/index.tsx
//
// QUÉ HACE:
//   Barrel export de todos los componentes del design system.
//   Permite importar desde '@components/ui' en lugar de rutas individuales.
//
// POR QUÉ SE COMPLETÓ:
//   La versión anterior solo exportaba Button, Input y Badge.
//   Faltaban Skeleton, Card, Spinner usados en múltiples módulos.

export { Button }                         from '@components/ui/Button'
export type { ButtonProps }               from '@components/ui/Button'

export { Input }                          from '@components/ui/Input'
export type { InputProps }                from '@components/ui/Input'

export { Badge, Card, Skeleton, Spinner } from '@components/ui/Badge'
export type { BadgeVariant }              from '@components/ui/Badge'
export { Modal, ModalBody, ModalFooter }  from '@components/ui/Modal'
export type { ModalProps, ModalTone }     from '@components/ui/Modal'

export { PageHeader, FormSection, Field, FormActions } from '@components/ui/Form'
