// vitest.config.ts
// Configuración de los tests. Hereda todo vite.config.ts (alias como @lib,
// @features, plugins), así los tests resuelven los imports igual que la app.
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    environment: 'jsdom',            // simula el navegador (document, window)
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
}))
