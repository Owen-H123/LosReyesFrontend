import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

//  Fix para __dirname en ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@app': resolve(__dirname, './src/app'),
      '@api': resolve(__dirname, './src/api'),
      '@components': resolve(__dirname, './src/components'),
      '@constants': resolve(__dirname, './src/constants'),
      '@features': resolve(__dirname, './src/features'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@interfaces': resolve(__dirname, './src/interfaces'),
      '@lib': resolve(__dirname, './src/lib'),
      '@store': resolve(__dirname, './src/store'),
    },
  },

  server: {
    port: 3000,
    // host: true → escucha en 0.0.0.0, no solo en localhost.
    // Sin esto, otras PCs de la red no pueden ni siquiera abrir el
    // frontend (aunque configuren bien la IP del backend en Configuración),
    // porque el servidor de Vite solo aceptaba conexiones desde la misma PC.
    host: true,
    // allowedHosts → necesario para exponer el dev server a través de
    // túneles como Cloudflare Tunnel (trycloudflare.com), ngrok, etc.
    // El comodín '.trycloudflare.com' cubre cualquier subdominio nuevo
    // que se genere cada vez que se reinicia el túnel.
    allowedHosts: [
      '.trycloudflare.com',
    ],
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET || 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },

  preview: {
    port: 4173,
    host: true,
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'chart-vendor': ['recharts'],
          'motion-vendor': ['framer-motion'],
          'form-vendor': [
            'react-hook-form',
            'zod',
            '@hookform/resolvers',
          ],
        },
      },
    },

    chunkSizeWarningLimit: 1000,
  },

  assetsInclude: [
    '**/*.svg',
    '**/*.csv',
  ],

  //  EXTRA (NO ROMPE NADA - SOLO MEJORA DEBUG)
  css: {
    devSourcemap: true,
  },
})