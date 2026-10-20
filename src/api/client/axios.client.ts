// api/client/axios.client.ts
import axios from 'axios'
import { useConnectionStore } from '@store/connection.store'

const apiClient = axios.create({
  timeout: 30000,
  // Envía la cookie del refresh token también cuando el backend está en otra
  // dirección (IP configurada en Configuración → Conexión)
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Aplica la IP configurada en Configuración → Conexión en cada petición.
// Así, si el dueño cambia la IP del servidor, el cambio aplica de inmediato
// sin recargar la app ni recompilar el frontend.
apiClient.interceptors.request.use((config) => {
  config.baseURL = useConnectionStore.getState().getApiBaseUrl()
  return config
})

export default apiClient