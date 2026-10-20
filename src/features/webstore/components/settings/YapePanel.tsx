// features/webstore/components/settings/YapePanel.tsx
// Datos que la tienda muestra al cliente en la pantalla de pago con Yape.
import { Panel, Field } from '@components/ui/Form'
import { isValidQrUrl, isValidYapeNumber } from '@features/webstore/utils/validators'
import type { SettingsPanelProps } from './types'


export function YapePanel({ form, set, disabled }: SettingsPanelProps) {
  return (
    <Panel title="Cobro con Yape" description="El cliente yapea a este número y luego escribe el código de operación. Tú lo verificas en Pedidos web.">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Número de Yape" hint="9 dígitos. Sin este número, la tienda no ofrece pagar con Yape."
          error={isValidYapeNumber(form.yapeNumber) ? undefined : 'Deben ser exactamente 9 dígitos'}>
          <input className="field-input" inputMode="numeric" maxLength={9} disabled={disabled} value={form.yapeNumber ?? ''}
            onChange={e => set('yapeNumber', e.target.value.replace(/\D/g, ''))} placeholder="987654321" />
        </Field>
        <Field label="Nombre del titular" hint="Se muestra para que el cliente confirme que yapea a la persona correcta.">
          <input className="field-input" maxLength={100} disabled={disabled} value={form.yapeHolder ?? ''} onChange={e => set('yapeHolder', e.target.value)} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Imagen del código QR (opcional)" hint="Dirección https de la imagen o una ruta /uploads/…. Si la dejas vacía, solo se muestra el número."
            error={isValidQrUrl(form.yapeQrUrl) ? undefined : 'Debe empezar con https:// o con /uploads/'}>
            <input className="field-input" maxLength={500} disabled={disabled} value={form.yapeQrUrl ?? ''} onChange={e => set('yapeQrUrl', e.target.value)} placeholder="https://…" />
          </Field>
        </div>
      </div>
    </Panel>
  )
}
