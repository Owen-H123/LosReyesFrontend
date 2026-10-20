// store/connection.store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT_SERVER_IP = 'localhost'
const API_PORT = '8080'
const API_PATH = '/api/v1'

interface ConnectionState {
  serverIp: string
  setServerIp: (ip: string) => void
  resetServerIp: () => void
  getApiBaseUrl: () => string
}

/**
 * sanitizeHost — limpia lo que el usuario pegue en el campo de IP.
 * Si alguien pega "http://192.168.1.100:8080/api/v1" por error (copiando
 * la URL completa desde el navegador), esto lo reduce a "192.168.1.100"
 * para que getApiBaseUrl() no termine armando una URL rota tipo
 * "http://http://192.168.1.100:8080:8080/api/v1".
 */
function sanitizeHost(raw: string): string {
  let value = raw.trim()
  if (!value) return ''
  value = value.replace(/^https?:\/\//i, '')   // quita protocolo
  value = value.split('/')[0]                   // quita cualquier /path
  value = value.split(':')[0]                   // quita :puerto si lo pegaron
  return value
}

/**
 * isValidHost — valida que sea "localhost", una IPv4, o un hostname válido.
 * No es una validación exhaustiva de RFC, es suficiente para evitar que se
 * guarde algo claramente inválido (vacío, espacios, símbolos raros, etc.)
 */
export function isValidHost(raw: string): boolean {
  const value = sanitizeHost(raw)
  if (!value) return false
  if (value.toLowerCase() === 'localhost') return true

  const ipv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
  const ipv4Match = value.match(ipv4)
  if (ipv4Match) {
    return ipv4Match.slice(1).every(octet => Number(octet) >= 0 && Number(octet) <= 255)
  }

  const hostname = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return hostname.test(value)
}

/**
 * connection.store — Guarda la IP (o host) del servidor backend.
 *
 * Se persiste en localStorage (clave "dlr-connection"), así que sobrevive
 * a cerrar y volver a abrir el navegador/app — el dueño lo configura UNA
 * vez desde Configuración → Conexión, y queda guardado.
 *
 * axios.client.ts lee este valor en CADA petición (vía interceptor), así
 * que un cambio de IP aplica de inmediato, sin recompilar ni recargar la app.
 */
export const useConnectionStore = create<ConnectionState>()(
  persist(
    (set, get) => ({
      serverIp: DEFAULT_SERVER_IP,

      setServerIp: (ip) => {
        const clean = sanitizeHost(ip)
        set({ serverIp: clean || DEFAULT_SERVER_IP })
      },

      resetServerIp: () => set({ serverIp: DEFAULT_SERVER_IP }),

      /**
       * getApiBaseUrl — arma la URL base de la API según la IP configurada.
       *
       * Caso "localhost" (valor por defecto, o cuando el backend corre en
       * la MISMA máquina que sirve el frontend): usamos ruta RELATIVA
       * ("/api/v1"), no absoluta. Así la petición sale hacia el mismo
       * origen desde el que se cargó la página, sea:
       *   - http://localhost:3000        (uso normal en tu PC)
       *   - http://192.168.1.x:3000      (otra PC en tu LAN)
       *   - https://xxxx.trycloudflare.com (túnel de Cloudflare)
       * y en cualquiera de esos casos, el proxy de Vite (server.proxy en
       * vite.config.ts), que corre junto al backend, la reenvía
       * internamente a http://localhost:8080. Si aquí pusiéramos
       * "http://localhost:8080" como URL absoluta, el NAVEGADOR DEL
       * CLIENTE intentaría conectarse a SU PROPIO localhost:8080, que no
       * existe en su máquina → net::ERR_CONNECTION_REFUSED.
       *
       * Caso IP explícita (ej. "192.168.1.100"): el usuario configuró a
       * propósito la IP de otra máquina en la red donde vive el backend.
       * Ahí sí necesitamos URL absoluta, porque el backend NO está en el
       * mismo origen que sirve el frontend.
       */
      getApiBaseUrl: () => {
        const ip = get().serverIp

        if (ip.toLowerCase() === 'localhost') {
          return API_PATH
        }

        return `http://${ip}:${API_PORT}${API_PATH}`
      },
    }),
    {
      name: 'dlr-connection',
    }
  )
)