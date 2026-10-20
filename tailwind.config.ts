import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  darkMode: 'class',

  theme: {
    extend: {
      // =========================
      //  BACKGROUNDS
      // =========================
      colors: {
        // Antes: valores hex fijos (solo se veían bien en oscuro).
        // Ahora: apuntan a las variables de theme.css, que SÍ cambian
        // entre [data-theme="light"] y [data-theme="dark"].
        base: 'var(--bg-base)',
        card: 'var(--bg-surface)',
        subtle: 'var(--bg-subtle)',
        hover: 'var(--bg-muted)',
        input: 'var(--bg-surface)',
        modal: 'var(--bg-elevated)',

        // =========================
        // BORDERS
        // =========================
        border: 'var(--border)',
        'border-hover': 'var(--border-hover)',
        'border-focus': 'var(--accent)',

        // =========================
        //  TEXT
        // =========================
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'text-disabled': 'var(--text-disabled)',

        // =========================
        //  BRAND / ACENTO
        // =========================
        brand: 'var(--accent)',
        'brand-hover': 'var(--accent-text)',
        'brand-muted': 'var(--accent-light)',
        'brand-border': 'var(--accent-border)',

        // =========================
        //  SUCCESS
        // =========================
        success: 'var(--success)',
        'success-muted': 'var(--success-light)',
        'success-border': 'var(--success-border)',

        // =========================
        //  WARNING
        // =========================
        warning: 'var(--warning)',
        'warning-muted': 'var(--warning-light)',
        'warning-border': 'var(--warning-border)',

        // =========================
        //  DANGER
        // =========================
        danger: 'var(--danger)',
        'danger-muted': 'var(--danger-light)',
        'danger-border': 'var(--danger-border)',

        // =========================
        //  INFO
        // =========================
        info: 'var(--info)',
        'info-muted': 'var(--info-light)',
        'info-border': 'var(--info-border)',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
      },

      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.5)',
        modal: '0 25px 60px rgba(0,0,0,0.8)',
        glow: '0 0 20px rgba(59,130,246,0.2)',
      },

      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        shimmer: 'shimmer 1.5s linear infinite',
      },

      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to: { backgroundPosition: '200% 0' },
        },
      },
    },
  },

  plugins: [],
} satisfies Config