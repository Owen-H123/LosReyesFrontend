// features/settings/services/connection.ts

/**
 * testBackendConnection — golpea /actuator/health del backend candidato
 * ANTES de guardar la IP, para avisarle al dueño/trabajador si esa IP
 * realmente responde, en vez de guardar a ciegas y descubrir el error
 * después navegando por el sistema.
 */
export async function testBackendConnection(host: string): Promise<{ ok: boolean; message: string }> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 4000)

  try {
    const res = await fetch(`http://${host}:8080/api/v1/actuator/health`, {
      method: 'GET',
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) {
      return { ok: false, message: `El servidor respondió con error (HTTP ${res.status})` }
    }

    const data = await res.json().catch(() => null)
    if (data?.status === 'UP') {
      return { ok: true, message: 'Conexión exitosa — el servidor está activo' }
    }
    return { ok: true, message: 'El servidor respondió, pero con un estado inesperado' }
  } catch (err) {
    clearTimeout(timeout)
    if ((err as Error).name === 'AbortError') {
      return { ok: false, message: 'Tiempo de espera agotado — revisa la IP, la red o el firewall' }
    }
    return { ok: false, message: 'No se pudo conectar — revisa que el backend esté encendido y la IP sea correcta' }
  }
}
