// features/users/pages/UsersPage.tsx
import { useState } from 'react'
import { Search, Plus, ShieldCheck, ShieldOff, UserCog, KeyRound, Pencil } from 'lucide-react'
import { formatDate } from '@lib/utils'
import { getImageUrl } from '@lib/utils'
import { useDebounce } from '@hooks/useDebounce'
import { Button } from '@components/ui/Button'
import { Modal, ModalBody, ModalFooter } from '@components/ui/Modal'
import { useUsers, useRoles, useCreateUser, useUpdateUser, useChangeUserStatus } from '@features/users/hooks/useUsers'
import PermissionsModal from '@features/users/components/PermissionsModal'
import type { UserStatus, User } from '@interfaces/api.types'

interface CreateFormState {
  name: string
  email: string
  password: string
  roleId: number
}

interface EditFormState {
  name: string
  email: string
  roleId: number
  status: UserStatus
}

const CREATE_INITIAL: CreateFormState = { name: '', email: '', password: '', roleId: 0 }

const STATUS_LABELS: Record<UserStatus, { label: string; color: string }> = {
  ACTIVE:    { label: 'Activo',    color: 'text-[var(--success)]' },
  SUSPENDED: { label: 'Suspendido', color: 'text-[var(--warning)]' },
  INACTIVE:  { label: 'Inactivo',  color: 'text-[var(--danger)]' },
}

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState<CreateFormState>(CREATE_INITIAL)

  const [editTarget, setEditTarget] = useState<User | null>(null)
  const [editForm, setEditForm] = useState<EditFormState>({ name: '', email: '', roleId: 0, status: 'ACTIVE' })

  const [permissionsTarget, setPermissionsTarget] = useState<User | null>(null)

  const debouncedSearch = useDebounce(search, 350)
  const { data, isLoading }    = useUsers({ search: debouncedSearch })
  const { data: roles = [] }   = useRoles()
  const createMutation         = useCreateUser()
  const updateMutation         = useUpdateUser(editTarget?.id ?? 0)
  const changeStatusMutation   = useChangeUserStatus()

  const users = data?.content ?? []

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createMutation.mutateAsync(createForm)
    setShowCreateModal(false)
    setCreateForm(CREATE_INITIAL)
  }

  const openEditModal = (u: User) => {
    setEditTarget(u)
    setEditForm({ name: u.name, email: u.email, roleId: u.roleId, status: u.status })
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editTarget) return
    await updateMutation.mutateAsync(editForm)
    setEditTarget(null)
  }

  const handleToggleStatus = (id: number, current: UserStatus) => {
    const next: UserStatus = current === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    changeStatusMutation.mutate({ id, status: next })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Usuarios</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">{data?.totalElements ?? 0} usuarios del sistema</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)}>
          Nuevo Usuario
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        <input
          className="field-input pl-9"
          placeholder="Buscar usuario..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Usuario', 'Email', 'Rol', 'Último acceso', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {isLoading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-[var(--text-muted)]">Cargando...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-[var(--text-muted)]">Sin usuarios</td></tr>
              ) : users.map(u => {
                const status = STATUS_LABELS[u.status]
                return (
                  <tr key={u.id} className="hover:bg-[var(--bg-subtle)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 overflow-hidden">
                          {u.avatarUrl ? (
                            <img src={getImageUrl(u.avatarUrl) ?? undefined} alt={u.name} className="w-full h-full object-cover" />
                          ) : (
                            u.name.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <span className="text-sm font-medium text-[var(--text-primary)]">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--text-muted)]">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`badge inline-flex items-center gap-1.5 ${
                        u.role === 'ADMIN' ? 'badge-brand' : 'badge-neutral'
                      }`}>
                        <UserCog className="w-3 h-3" />
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--text-muted)]">
                      {u.lastLogin ? formatDate(u.lastLogin) : 'Nunca'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-1.5 hover:bg-[var(--bg-subtle)] rounded text-[var(--text-muted)] hover:text-[var(--accent-text)] transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {u.role === 'WORKER' && (
                          <button
                            onClick={() => setPermissionsTarget(u)}
                            className="p-1.5 hover:bg-[var(--bg-subtle)] rounded text-[var(--text-muted)] hover:text-[var(--accent-text)] transition-colors"
                            title="Permisos"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleStatus(u.id, u.status)}
                          disabled={changeStatusMutation.isPending}
                          className="p-1.5 hover:bg-[var(--bg-subtle)] rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                          title={u.status === 'ACTIVE' ? 'Suspender' : 'Activar'}
                        >
                          {u.status === 'ACTIVE'
                            ? <ShieldOff className="w-4 h-4" />
                            : <ShieldCheck className="w-4 h-4" />
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <Modal
          title="Nuevo usuario"
          description="Crea una cuenta de acceso al sistema."
          icon={<UserCog />}
          onClose={() => setShowCreateModal(false)}
        >
            <form onSubmit={handleCreateSubmit}>
              <ModalBody>
              <div>
                <label className="field-label">Nombre completo *</label>
                <input
                  className="field-input"
                  required
                  value={createForm.name}
                  onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="field-label">Email *</label>
                <input
                  type="email"
                  className="field-input"
                  required
                  value={createForm.email}
                  onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="field-label">Contraseña *</label>
                <input
                  type="password"
                  className="field-input"
                  required
                  minLength={8}
                  value={createForm.password}
                  onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))}
                />
              </div>
              <div>
                <label className="field-label">Rol *</label>
                <select
                  className="field-input"
                  required
                  value={createForm.roleId || ''}
                  onChange={e => setCreateForm(f => ({ ...f, roleId: Number(e.target.value) }))}
                >
                  <option value="">Seleccionar rol...</option>
                  {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              </ModalBody>
              <ModalFooter>
                <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" loading={createMutation.isPending}>
                  Crear usuario
                </Button>
              </ModalFooter>
            </form>
        </Modal>
      )}

      {/* Edit Modal */}
      {editTarget && (
        <Modal
          title="Editar usuario"
          description={editTarget.email}
          icon={<Pencil />}
          onClose={() => setEditTarget(null)}
        >
            <form onSubmit={handleEditSubmit}>
              <ModalBody>
              <div>
                <label className="field-label">Nombre completo *</label>
                <input
                  className="field-input"
                  required
                  value={editForm.name}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="field-label">Email *</label>
                <input
                  type="email"
                  className="field-input"
                  required
                  value={editForm.email}
                  onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="field-label">Rol *</label>
                <select
                  className="field-input"
                  required
                  value={editForm.roleId || ''}
                  onChange={e => setEditForm(f => ({ ...f, roleId: Number(e.target.value) }))}
                >
                  <option value="">Seleccionar rol...</option>
                  {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Estado *</label>
                <select
                  className="field-input"
                  required
                  value={editForm.status}
                  onChange={e => setEditForm(f => ({ ...f, status: e.target.value as UserStatus }))}
                >
                  <option value="ACTIVE">Activo</option>
                  <option value="SUSPENDED">Suspendido</option>
                  <option value="INACTIVE">Inactivo</option>
                </select>
              </div>
              </ModalBody>
              <ModalFooter>
                <Button type="button" variant="secondary" onClick={() => setEditTarget(null)}>
                  Cancelar
                </Button>
                <Button type="submit" loading={updateMutation.isPending}>
                  Guardar cambios
                </Button>
              </ModalFooter>
            </form>
        </Modal>
      )}

      {/* Permissions Modal */}
      {permissionsTarget && (
        <PermissionsModal
          userId={permissionsTarget.id}
          userName={permissionsTarget.name}
          onClose={() => setPermissionsTarget(null)}
        />
      )}
    </div>
  )
}