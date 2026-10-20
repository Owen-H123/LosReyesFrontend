// features/settings/components/ProfileSection.tsx
// Sección "Perfil": tarjeta de identidad (foto, nombre, rol) y datos editables.
import { toast } from 'sonner'
import { useState, useRef } from 'react'
import { Save, Loader2, Camera, Mail, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '@store/auth.store'
import { Button } from '@components/ui/Button'
import { Panel, Field } from '@components/ui/Form'
import { useUpdateProfile, useUploadAvatar } from '@features/auth/hooks/useAuth'
import { getImageUrl } from '@lib/utils'

const ROLE_LABELS: Record<string, string> = { ADMIN: 'Administrador', WORKER: 'Trabajador' }

export function ProfileSection() {
  const { user } = useAuthStore()

  const [profile, setProfile] = useState({
    name:  user?.name  ?? '',
    email: user?.email ?? '',
  })

  const updateProfileMutation = useUpdateProfile()
  const uploadAvatarMutation  = useUploadAvatar()
  const avatarInputRef        = useRef<HTMLInputElement>(null)

  const dirty = profile.name.trim() !== (user?.name ?? '') || profile.email.trim() !== (user?.email ?? '')

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfileMutation.mutate({ name: profile.name.trim(), email: profile.email.trim() })
  }

  const handleAvatarChange = (file: File | undefined) => {
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Solo se permiten imágenes JPG, PNG o WEBP')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede pesar más de 5MB')
      return
    }
    uploadAvatarMutation.mutate(file)
  }

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'DR'

  return (
    <>
      {/* Identidad */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}
      >
        <div
          className="h-24"
          style={{ background: 'linear-gradient(120deg, var(--accent-light), transparent 70%), var(--bg-subtle)' }}
        />
        <div className="px-6 pb-5 flex flex-wrap items-end gap-x-5 gap-y-3 -mt-10">
          <div className="relative group">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold overflow-hidden ring-4 ring-[var(--bg-surface)] shadow-[var(--shadow-md)]"
              style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
            >
              {user?.avatarUrl
                ? <img src={getImageUrl(user.avatarUrl) ?? undefined} alt={user.name} className="w-full h-full object-cover" />
                : initials}
            </div>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadAvatarMutation.isPending}
              aria-label="Cambiar foto"
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] shadow-[var(--shadow-sm)] hover:text-[var(--accent)] transition-colors"
            >
              {uploadAvatarMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={e => handleAvatarChange(e.target.files?.[0])}
            />
          </div>

          <div className="flex-1 min-w-[200px] pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">{user?.name}</h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--accent-light)] text-[var(--accent-text)] border border-[var(--accent-border)]">
                <ShieldCheck className="w-3 h-3" />
                {ROLE_LABELS[user?.role ?? ''] ?? user?.role}
              </span>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
              <Mail className="w-3.5 h-3.5" /> {user?.email}
            </p>
          </div>
        </div>
      </section>

      {/* Datos */}
      <form onSubmit={handleSaveProfile}>
        <Panel
          title="Datos personales"
          description="Se muestran en las ventas que registras y en la auditoría."
          footerNote={dirty ? 'Tienes cambios sin guardar.' : 'Sin cambios.'}
          footer={
            <>
              {dirty && (
                <Button type="button" variant="ghost" onClick={() => setProfile({ name: user?.name ?? '', email: user?.email ?? '' })}>
                  Descartar
                </Button>
              )}
              <Button type="submit" disabled={!dirty} loading={updateProfileMutation.isPending} leftIcon={<Save className="w-4 h-4" />}>
                Guardar cambios
              </Button>
            </>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
            <Field label="Nombre completo" required>
              <input
                className="field-input"
                required
                value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
              />
            </Field>
            <Field label="Correo electrónico" required hint="Lo usas para iniciar sesión y recuperar tu contraseña.">
              <input
                type="email"
                className="field-input"
                required
                value={profile.email}
                onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
              />
            </Field>
          </div>
        </Panel>
      </form>
    </>
  )
}
