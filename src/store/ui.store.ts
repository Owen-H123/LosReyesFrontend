// store/ui.store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'
export type AccentColor = 'blue' | 'indigo' | 'violet' | 'emerald' | 'amber' | 'rose'

export const ACCENT_COLORS: Record<AccentColor, { primary: string; light: string; border: string; text: string }> = {
  blue:    { primary: '#2563eb', light: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
  indigo:  { primary: '#4f46e5', light: '#eef2ff', border: '#c7d2fe', text: '#4338ca' },
  violet:  { primary: '#7c3aed', light: '#f5f3ff', border: '#ddd6fe', text: '#6d28d9' },
  emerald: { primary: '#059669', light: '#ecfdf5', border: '#a7f3d0', text: '#047857' },
  amber:   { primary: '#d97706', light: '#fffbeb', border: '#fde68a', text: '#b45309' },
  rose:    { primary: '#e11d48', light: '#fff1f2', border: '#fecdd3', text: '#be123c' },
}

interface UIState {
  sidebarCollapsed: boolean
  sidebarHovered: boolean
  commandPaletteOpen: boolean
  theme: Theme
  accentColor: AccentColor

  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setSidebarHovered: (hovered: boolean) => void
  openCommandPalette: () => void
  closeCommandPalette: () => void
  setTheme: (theme: Theme) => void
  setAccentColor: (color: AccentColor) => void
  toggleTheme: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      sidebarHovered: false,
      commandPaletteOpen: false,
      theme: 'light',
      accentColor: 'blue',

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setSidebarHovered: (hovered) => set({ sidebarHovered: hovered }),
      openCommandPalette: () => set({ commandPaletteOpen: true }),
      closeCommandPalette: () => set({ commandPaletteOpen: false }),
      setTheme: (theme) => set({ theme }),
      setAccentColor: (accentColor) => set({ accentColor }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'dlr-ui',
      partialize: (s) => ({
        sidebarCollapsed: s.sidebarCollapsed,
        theme: s.theme,
        accentColor: s.accentColor,
      }),
    }
  )
)
