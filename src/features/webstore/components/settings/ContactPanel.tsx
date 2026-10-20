// features/webstore/components/settings/ContactPanel.tsx
import { Panel, Field } from '@components/ui/Form'
import { isValidWhatsapp } from '@features/webstore/utils/validators'
import type { SettingsPanelProps } from './types'


export function ContactPanel({ form, set, disabled }: SettingsPanelProps) {
  return (
    <Panel title="Contacto y avisos" description="Se usan en el encabezado de la tienda y en el botón de ayuda por WhatsApp.">
      <div className="grid gap-5">
        <Field label="WhatsApp de la tienda" hint="Solo dígitos con código de país, por ejemplo 51987654321."
          error={isValidWhatsapp(form.whatsapp) ? undefined : 'Debe tener entre 9 y 15 dígitos, sin espacios ni signos'}>
          <input className="field-input" inputMode="numeric" disabled={disabled} value={form.whatsapp ?? ''} onChange={e => set('whatsapp', e.target.value)} placeholder="51987654321" />
        </Field>
        <Field label="Aviso en la tienda" hint="Un texto corto sobre el encabezado (ej. “Envíos gratis este fin de semana”). Déjalo vacío para no mostrar nada.">
          <input className="field-input" maxLength={200} disabled={disabled} value={form.announcement ?? ''} onChange={e => set('announcement', e.target.value)} />
        </Field>
      </div>
    </Panel>
  )
}
