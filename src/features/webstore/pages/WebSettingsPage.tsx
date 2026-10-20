// features/webstore/pages/WebSettingsPage.tsx
// Módulo "Ajustes de tienda": lo que la web muestra y usa. Cada bloque es un panel en components/settings.
import { useEffect, useState } from 'react'
import { PageHeader } from '@components/ui/Form'
import { Button } from '@components/ui/Button'
import { usePermission } from '@features/auth/hooks/usePermission'
import { useStoreSettings, useSaveStoreSettings } from '@features/webstore/hooks/useWebstore'
import { ContactPanel } from '@features/webstore/components/settings/ContactPanel'
import { PaymentMethodsPanel } from '@features/webstore/components/settings/PaymentMethodsPanel'
import { YapePanel } from '@features/webstore/components/settings/YapePanel'
import { DeliveryPanel } from '@features/webstore/components/settings/DeliveryPanel'
import { isValidQrUrl, isValidWhatsapp, isValidYapeNumber } from '@features/webstore/utils/validators'
import type { StoreSettings } from '@features/webstore/services/webstore.api'

const EMPTY: StoreSettings = {
  whatsapp: '', announcement: '', paymentMethods: [], pickupAddress: '', businessHours: '', shippingNote: '',
  yapeNumber: '', yapeHolder: '', yapeQrUrl: '',
}

export default function WebSettingsPage() {
  const { canManageUsers: isAdmin } = usePermission()
  const { data, isLoading } = useStoreSettings()
  const save = useSaveStoreSettings()
  const [form, setForm] = useState<StoreSettings>(EMPTY)

  useEffect(() => {
    if (data) setForm({ ...EMPTY, ...Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v ?? ''])), paymentMethods: data.paymentMethods })
  }, [data])

  const set: <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) => void = (key, value) =>
    setForm(f => ({ ...f, [key]: value }))

  const valid = isValidWhatsapp(form.whatsapp) && isValidYapeNumber(form.yapeNumber) && isValidQrUrl(form.yapeQrUrl) && form.paymentMethods.length > 0
  const panel = { form, set, disabled: !isAdmin }

  if (isLoading) return <div className="skeleton h-96 w-full" />

  return (
    <form onSubmit={e => { e.preventDefault(); save.mutate(form) }} className="space-y-6 animate-fadeIn max-w-3xl">
      <PageHeader
        title="Ajustes de tienda"
        subtitle={isAdmin ? 'Lo que guardes aquí se muestra en la tienda online al instante.' : 'Solo el administrador puede cambiar estos ajustes.'}
      />

      <ContactPanel {...panel} />
      <PaymentMethodsPanel {...panel} />
      <YapePanel {...panel} />
      <DeliveryPanel {...panel} />

      {isAdmin && (
        <div className="flex justify-end">
          <Button type="submit" loading={save.isPending} disabled={!valid}>Guardar ajustes</Button>
        </div>
      )}
    </form>
  )
}
