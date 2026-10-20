// features/settings/components/AppearanceSection.tsx
// Sección "Apariencia": tema claro u oscuro y color de acento (se guardan en este navegador).
import { Check } from 'lucide-react'
import { useUIStore, ACCENT_COLORS, type AccentColor } from '@store/ui.store'
import { Panel } from '@components/ui/Form'

const ACCENT_NAMES: Record<AccentColor, string> = {
  blue: 'Azul', indigo: 'Índigo', violet: 'Violeta', emerald: 'Esmeralda', amber: 'Ámbar', rose: 'Rosa',
}

// Mini maqueta de la app con la paleta de cada tema
const THEMES = [
  { value: 'light' as const, label: 'Claro',  bg: '#F6F5F2', surface: '#FFFFFF', line: '#E1DDD3', text: '#14171C' },
  { value: 'dark'  as const, label: 'Oscuro', bg: '#0B0D10', surface: '#14171C', line: '#262B33', text: '#EDEFF2' },
]

export function AppearanceSection() {
  const { theme, setTheme, accentColor, setAccentColor } = useUIStore()
  const accent = ACCENT_COLORS[accentColor].primary

  return (
    <>
      <Panel title="Tema" description="Cómo se ve el sistema en este equipo.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {THEMES.map(t => {
            const active = theme === t.value
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setTheme(t.value)}
                aria-pressed={active}
                className="text-left rounded-xl p-1.5 transition-all"
                style={{
                  border: `2px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                  boxShadow: active ? '0 0 0 3px var(--accent-light)' : 'none',
                }}
              >
                {/* maqueta */}
                <div className="rounded-lg overflow-hidden flex h-28" style={{ background: t.bg, border: `1px solid ${t.line}` }}>
                  <div className="w-1/4 p-2 space-y-1.5" style={{ background: t.surface, borderRight: `1px solid ${t.line}` }}>
                    <div className="h-2 w-3/4 rounded" style={{ background: accent }} />
                    <div className="h-1.5 w-full rounded" style={{ background: t.line }} />
                    <div className="h-1.5 w-2/3 rounded" style={{ background: t.line }} />
                    <div className="h-1.5 w-3/4 rounded" style={{ background: t.line }} />
                  </div>
                  <div className="flex-1 p-2.5 space-y-2">
                    <div className="h-2 w-1/3 rounded" style={{ background: t.text, opacity: 0.85 }} />
                    <div className="grid grid-cols-3 gap-1.5">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="h-9 rounded" style={{ background: t.surface, border: `1px solid ${t.line}` }} />
                      ))}
                    </div>
                    <div className="h-8 rounded" style={{ background: t.surface, border: `1px solid ${t.line}` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between px-1.5 pt-2.5 pb-1">
                  <span className="text-sm font-medium text-[var(--text-primary)]">{t.label}</span>
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: active ? 'var(--accent)' : 'transparent', border: active ? 'none' : '1.5px solid var(--border-hover)' }}
                  >
                    {active && <Check className="w-3 h-3" style={{ color: 'var(--accent-contrast)' }} />}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </Panel>

      <Panel title="Color de acento" description="Botones, enlaces y la opción activa del menú.">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(ACCENT_COLORS) as AccentColor[]).map(c => {
            const active = c === accentColor
            return (
              <button
                key={c}
                type="button"
                onClick={() => setAccentColor(c)}
                aria-pressed={active}
                className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full text-sm transition-colors"
                style={{
                  border: `1px solid ${active ? ACCENT_COLORS[c].primary : 'var(--border)'}`,
                  background: active ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: ACCENT_COLORS[c].primary }}>
                  {active && <Check className="w-3 h-3 text-white" />}
                </span>
                {ACCENT_NAMES[c]}
              </button>
            )
          })}
        </div>
      </Panel>
    </>
  )
}
