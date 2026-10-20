// features/settings/pages/SettingsPage.tsx
// Menú de secciones de Configuración. Cada sección vive en
// features/settings/components/ y maneja su propio formulario.
import { useState } from 'react'
import { User, Lock, Palette, Server } from 'lucide-react'
import { PageHeader } from '@components/ui/Form'
import { ProfileSection } from '@features/settings/components/ProfileSection'
import { PasswordSection } from '@features/settings/components/PasswordSection'
import { AppearanceSection } from '@features/settings/components/AppearanceSection'
import { ConnectionSection } from '@features/settings/components/ConnectionSection'

type Tab = 'profile' | 'password' | 'appearance' | 'connection'

const TABS = [
  { id: 'profile',    label: 'Perfil',     hint: 'Nombre, correo y foto',     icon: User },
  { id: 'password',   label: 'Seguridad',  hint: 'Contraseña de acceso',      icon: Lock },
  { id: 'appearance', label: 'Apariencia', hint: 'Tema y color',              icon: Palette },
  { id: 'connection', label: 'Conexión',   hint: 'Servidor del sistema',      icon: Server },
] as const

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('profile')

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeader title="Configuración" subtitle="Tu cuenta y las preferencias de este equipo." />

      <div className="grid grid-cols-1 lg:grid-cols-[232px_minmax(0,1fr)] gap-6 items-start">
        <nav className="lg:sticky lg:top-0 flex lg:flex-col gap-1 overflow-x-auto" aria-label="Secciones">
          {TABS.map(t => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                aria-current={active ? 'page' : undefined}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors shrink-0 ${
                  active ? 'bg-[var(--bg-surface)] shadow-[var(--shadow-sm)] border border-[var(--border)]' : 'border border-transparent hover:bg-[var(--bg-subtle)]'
                }`}
              >
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    background: active ? 'var(--accent-light)' : 'var(--bg-subtle)',
                    color: active ? 'var(--accent)' : 'var(--text-muted)',
                  }}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <span className="min-w-0">
                  <span className={`block text-sm font-medium ${active ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                    {t.label}
                  </span>
                  <span className="hidden lg:block text-xs text-[var(--text-muted)] truncate">{t.hint}</span>
                </span>
              </button>
            )
          })}
        </nav>

        <div className="min-w-0 space-y-5">
          {tab === 'profile'    && <ProfileSection />}
          {tab === 'password'   && <PasswordSection />}
          {tab === 'appearance' && <AppearanceSection />}
          {tab === 'connection' && <ConnectionSection />}
        </div>
      </div>
    </div>
  )
}
