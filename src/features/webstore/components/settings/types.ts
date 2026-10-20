// features/webstore/components/settings/types.ts
import type { StoreSettings } from '@features/webstore/services/webstore.api'

/** Props comunes de los paneles de ajustes: el formulario, cómo cambiar un campo y si se puede editar. */
export interface SettingsPanelProps {
  form: StoreSettings
  set: <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) => void
  disabled: boolean
}
