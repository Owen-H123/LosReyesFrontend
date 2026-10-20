// features/settings/components/ConnectionSection.tsx
// Sección "Conexión": IP de la PC donde corre el backend.
import { useState } from 'react'
import { Save, CheckCircle2, XCircle, Server } from 'lucide-react'
import { Panel, Field } from '@components/ui/Form'
import { useConnectionStore, isValidHost } from '@store/connection.store'
import { Button } from '@components/ui/Button'
import { testBackendConnection } from '@features/settings/services/connection'

type TestStatus = 'idle' | 'testing' | 'success' | 'error'

export function ConnectionSection() {
  const { serverIp, setServerIp, resetServerIp } = useConnectionStore()
  const [ipInput, setIpInput]         = useState(serverIp)
  const [ipSavedMsg, setIpSavedMsg]   = useState(false)
  const [ipFormatError, setIpFormatError] = useState('')
  const [testStatus, setTestStatus]   = useState<TestStatus>('idle')
  const [testMessage, setTestMessage] = useState('')

  const handleTestConnection = async () => {
    if (!isValidHost(ipInput)) {
      setIpFormatError('Escribe una IP válida (ej. 192.168.1.100) o "localhost"')
      setTestStatus('idle')
      return
    }
    setIpFormatError('')
    setTestStatus('testing')
    setTestMessage('')
    const result = await testBackendConnection(ipInput.trim())
    setTestStatus(result.ok ? 'success' : 'error')
    setTestMessage(result.message)
  }

  const handleSaveIp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidHost(ipInput)) {
      setIpFormatError('Escribe una IP válida (ej. 192.168.1.100) o "localhost"')
      return
    }
    setIpFormatError('')
    setServerIp(ipInput)
    setIpSavedMsg(true)
    setTimeout(() => setIpSavedMsg(false), 3000)
  }

  const handleResetIp = () => {
    resetServerIp()
    setIpInput('localhost')
    setIpFormatError('')
    setTestStatus('idle')
    setTestMessage('')
    setIpSavedMsg(true)
    setTimeout(() => setIpSavedMsg(false), 3000)
  }

  const isLocal = serverIp.toLowerCase() === 'localhost'

  return (
    <form onSubmit={handleSaveIp}>
      <Panel
        title="Servidor del sistema"
        description="Dirección de la PC donde corre el backend. Cámbiala solo si usas el sistema desde otra computadora de la red."
        footerNote={
          ipSavedMsg
            ? <span className="flex items-center gap-1.5 text-[var(--success)] font-medium"><CheckCircle2 className="w-3.5 h-3.5" /> Guardado. Se aplica de inmediato.</span>
            : 'Se guarda solo en este navegador.'
        }
        footer={
          <>
            {!isLocal && (
              <Button type="button" variant="ghost" onClick={handleResetIp}>Usar esta PC</Button>
            )}
            <Button type="button" variant="secondary" onClick={handleTestConnection} loading={testStatus === 'testing'}>
              Probar conexión
            </Button>
            <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>Guardar</Button>
          </>
        }
      >
        <div className="space-y-5">
          {/* Estado actual */}
          <div className="flex items-center gap-3 rounded-lg px-4 py-3 bg-[var(--bg-subtle)] border border-[var(--border)]">
            <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-muted)]">
              <Server className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-[var(--text-muted)]">Conectado actualmente a</p>
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                {isLocal ? 'Esta PC (localhost)' : <span className="font-mono">{serverIp}</span>}
              </p>
            </div>
          </div>

          <Field
            label="Dirección IP del servidor"
            error={ipFormatError || undefined}
            hint="Ejemplo: 192.168.1.100. Usa la misma IP con la que abres el sistema desde esa PC."
          >
            <input
              className="field-input font-mono max-w-sm"
              placeholder="192.168.1.100 o localhost"
              value={ipInput}
              onChange={e => {
                setIpInput(e.target.value)
                setIpFormatError('')
                setTestStatus('idle')
                setTestMessage('')
              }}
            />
          </Field>

          {(testStatus === 'success' || testStatus === 'error') && (
            <p
              role="status"
              className="flex items-center gap-2 text-sm rounded-lg px-3 py-2"
              style={{
                color: testStatus === 'success' ? 'var(--success)' : 'var(--danger)',
                background: testStatus === 'success' ? 'var(--success-light)' : 'var(--danger-light)',
              }}
            >
              {testStatus === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {testMessage}
            </p>
          )}
        </div>
      </Panel>
    </form>
  )
}
