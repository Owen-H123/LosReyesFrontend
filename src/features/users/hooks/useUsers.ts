// features/users/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@features/users/services/users.api'
import type { CreateUserRequest, UpdateUserRequest, UserStatus, PermissionCode } from '@interfaces/api.types'

const KEYS = {
  all:         ['users'] as const,
  list:        (p: object) => ['users', 'list', p] as const,
  detail:      (id: number) => ['users', id] as const,
  roles:       ['roles'] as const,
  permissions: (id: number) => ['users', id, 'permissions'] as const,
}

export function useUsers(params: { search?: string; page?: number; size?: number; role?: string } = {}) {
  return useQuery({
    queryKey: KEYS.list(params),
    queryFn:  () => usersApi.getAll(params),
  })
}

export function useUserById(id: number) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn:  () => usersApi.getById(id),
    enabled:  !!id,
  })
}

export function useRoles() {
  return useQuery({
    queryKey: KEYS.roles,
    queryFn:  usersApi.getRoles,
    staleTime: 1000 * 60 * 10,
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateUserRequest) => usersApi.create(body),
    onSuccess:  () => qc.invalidateQueries({ queryKey: KEYS.all }),
  })
}

export function useUpdateUser(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateUserRequest) => usersApi.update(id, body),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: KEYS.all })
      qc.invalidateQueries({ queryKey: KEYS.detail(id) })
    },
  })
}

export function useChangeUserStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: UserStatus }) => usersApi.changeStatus(id, status),
    onSuccess:  () => qc.invalidateQueries({ queryKey: KEYS.all }),
  })
}

export function useUserPermissions(id: number) {
  return useQuery({
    queryKey: KEYS.permissions(id),
    queryFn:  () => usersApi.getPermissions(id),
    enabled:  !!id,
  })
}

export function useUpdateUserPermissions(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (permissions: PermissionCode[]) => usersApi.updatePermissions(id, permissions),
    onSuccess:  () => qc.invalidateQueries({ queryKey: KEYS.permissions(id) }),
  })
}