// features/settings/components/PasswordSection.tsx
// Sección "Seguridad": cambiar la contraseña conociendo la actual.
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Lock, Eye, EyeOff, Check, Circle } from 'lucide-react'
import { toast } from 'sonner'
import apiClient from '@api/client/axios.client'
import { API } from '@api/endpoints'
import { Button } from '@components/ui/Button'
import { Panel, Field } from '@components/ui/Form'

function useChangePassword() {
  return useMutation({
    mutationFn: async (body: { currentPassword: string; newPassword: string }) => {
      await apiClient.post(API.auth.changePassword, body)
    },
  })
}

function PasswordInput({ value, onChange, autoComplete, minLength }: {
  value: string
  onChange: (v: string) => void
  autoComplete: string
  minLength?: number
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        className="field-input pr-10"
        required
        minLength={minLength}
        autoComplete={autoComplete}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <button
        type="button"
        aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        onClick={() => setShow(s => !s)}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  )
}

export function PasswordSection() {
  const [pwForm, setPwForm] = useState({ current: '', new: '', confirm: '' })
  const [pwError, setPwError] = useState('')
  const changePassword = useChangePassword()

  const rules = [
    { ok: pwForm.new.length >= 8, label: 'Al menos 8 caracteres' },
    { ok: /[A-Z]/.test(pwForm.new) && /[a-z]/.test(pwForm.new), label: 'Mayúsculas y minúsculas (recomendado)' },
    { ok: /\d/.test(pwForm.new), label: 'Al menos un número (recomendado)' },
    { ok: pwForm.new.length > 0 && pwForm.new === pwForm.confirm, label: 'Las dos contraseñas coinciden' },
  ]
  const strength = rules.slice(0, 3).filter(r => r.ok).length
  const STRENGTH = [
    { label: '',        color: 'var(--border)' },
    { label: 'Débil',   color: 'var(--danger)' },
    { label: 'Regular', color: 'var(--warning)' },
    { label: 'Fuerte',  color: 'var(--success)' },
  ][strength]

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError('')
    if (pwForm.new !== pwForm.confirm) {
      setPwError('Las contraseñas nuevas no coinciden')
      return
    }
    if (pwForm.new.length < 8) {
      setPwError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    try {
      await changePassword.mutateAsync({ currentPassword: pwForm.current, newPassword: pwForm.new })
      setPwForm({ current: '', new: '', confirm: '' })
      toast.success('Contraseña actualizada correctamente')
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setPwError(message ?? 'No se pudo actualizar la contraseña')
    }
  }

  return (
    <form onSubmit={handlePasswordSubmit}>
      <Panel
        title="Cambiar contraseña"
        description="Por seguridad, primero confirma tu contraseña actual."
        footerNote={pwError ? <span className="text-[var(--danger)] font-medium">{pwError}</span> : null}
        footer={
          <Button type="submit" loading={changePassword.isPending} disabled={!rules[0].ok || !rules[3].ok || !pwForm.current} leftIcon={<Lock className="w-4 h-4" />}>
            Actualizar contraseña
          </Button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_240px] gap-8">
          <div className="space-y-5">
            <Field label="Contraseña actual" required>
              <PasswordInput value={pwForm.current} onChange={v => setPwForm(f => ({ ...f, current: v }))} autoComplete="current-password" />
            </Field>
            <div className="h-px bg-[var(--border)]" />
            <Field label="Nueva contraseña" required>
              <PasswordInput value={pwForm.new} onChange={v => setPwForm(f => ({ ...f, new: v }))} autoComplete="new-password" minLength={8} />
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 grid grid-cols-3 gap-1">
                  {[1, 2, 3].map(i => (
                    <span key={i} className="h-1 rounded-full transition-colors" style={{ background: i <= strength ? STRENGTH.color : 'var(--bg-muted)' }} />
                  ))}
                </div>
                <span className="w-14 text-right text-xs font-medium" style={{ color: STRENGTH.color }}>{STRENGTH.label}</span>
              </div>
            </Field>
            <Field label="Confirmar nueva contraseña" required>
              <PasswordInput value={pwForm.confirm} onChange={v => setPwForm(f => ({ ...f, confirm: v }))} autoComplete="new-password" />
            </Field>
          </div>

          <div className="rounded-lg p-4 bg-[var(--bg-subtle)] border border-[var(--border)] h-fit">
            <p className="text-xs font-semibold text-[var(--text-secondary)] mb-3">Tu nueva contraseña</p>
            <ul className="space-y-2">
              {rules.map(r => (
                <li key={r.label} className={`flex items-center gap-2 text-xs ${r.ok ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`}>
                  {r.ok ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                  {r.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Panel>
    </form>
  )
}
