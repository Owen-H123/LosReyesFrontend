// features/users/services/users.api.ts

import apiClient from '@api/client/axios.client'
import { API } from '@api/endpoints'
import type {
  ApiResponse,
  PagedResponse,
  User,
  CreateUserRequest,
  UpdateUserRequest,
  Role,
  UserStatus,
  UserPermissionItem,
  PermissionCode,
} from '@interfaces/api.types'

export const usersApi = {
  getAll: async (params?: { 
    search?: string
    page?: number
    size?: number
    role?: string
    status?: UserStatus 
  }) => {
    const { data } = await apiClient.get<ApiResponse<PagedResponse<User>>>(
      API.users.list,
      { params }
    )
    return data.data
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<User>>(
      API.users.byId(id)
    )
    return data.data
  },

  create: async (body: CreateUserRequest) => {
    const { data } = await apiClient.post<ApiResponse<User>>(
      API.users.list,
      body
    )
    return data.data
  },

  update: async (id: number, body: UpdateUserRequest) => {
    const { data } = await apiClient.put<ApiResponse<User>>(
      API.users.byId(id),
      body
    )
    return data.data
  },

  changeStatus: async (id: number, status: UserStatus) => {
    const { data } = await apiClient.patch<ApiResponse<User>>(
      API.users.changeStatus(id),
      { status }
    )
    return data.data
  },

  getRoles: async () => {
    const { data } = await apiClient.get<ApiResponse<Role[]>>(
      API.roles.list
    )
    return data.data
  },

  getPermissions: async (id: number) => {
    const { data } = await apiClient.get<ApiResponse<UserPermissionItem[]>>(
      API.users.permissions(id)
    )
    return data.data
  },

  updatePermissions: async (
    id: number,
    permissions: PermissionCode[]
  ) => {
    const { data } = await apiClient.put<ApiResponse<UserPermissionItem[]>>(
      API.users.permissions(id),
      { permissions }
    )
    return data.data
  },
}