// features/webstore/components/settings/DeliveryPanel.tsx
import { Panel, Field } from '@components/ui/Form'
import type { SettingsPanelProps } from './types'

export function DeliveryPanel({ form, set, disabled }: SettingsPanelProps) {
  return (
    <Panel title="Entrega y recojo" description="Se muestran en el pie de la tienda y en el cierre del pedido.">
      <div className="grid gap-5">
        <Field label="Dirección de recojo">
          <input className="field-input" maxLength={255} disabled={disabled} value={form.pickupAddress ?? ''} onChange={e => set('pickupAddress', e.target.value)} />
        </Field>
        <Field label="Horario de atención">
          <input className="field-input" maxLength={150} disabled={disabled} value={form.businessHours ?? ''} onChange={e => set('businessHours', e.target.value)} placeholder="Lun a Sáb, 9:00 a 18:00" />
        </Field>
        <Field label="Nota sobre envíos" hint="Por ejemplo zonas de cobertura o tiempos de entrega.">
          <input className="field-input" maxLength={255} disabled={disabled} value={form.shippingNote ?? ''} onChange={e => set('shippingNote', e.target.value)} />
        </Field>
      </div>
    </Panel>
  )
}
