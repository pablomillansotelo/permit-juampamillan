/**
 * Cliente API server-side para comunicarse con permit-backend
 * La API key se mantiene solo en el servidor
 */

import 'server-only';
import { auth } from '@/lib/auth';
import { CreatePermissionInput, CreateResourceInput, CreateRoleInput, CreateRolePermissionInput, CreateUserInput, CreateUserRoleInput, Permission, Resource, Role, RolePermission, UpdatePermissionInput, UpdateResourceInput, UpdateRoleInput, UpdateUserInput, User, UserPermission, UserRole } from './api';

const API_BASE_URL = process.env.PERMIT_API_URL || 'http://localhost:8000';
const API_KEY = process.env.PERMIT_API_KEY || '';

if (!API_KEY) {
  console.warn('⚠️ PERMIT_API_KEY no está configurada. Las llamadas al backend pueden fallar.');
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Función helper para hacer requests al backend con API key
 */
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // Verificar que el usuario esté autenticado
  const session = await auth();
  if (!session?.user) {
    throw new ApiError('No autenticado', 401);
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY, // API key solo en el servidor
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `HTTP error! status: ${response.status}`,
      response.status,
      errorData
    );
  }

  return response.json();
}

// Re-exportar tipos del cliente público
export type {
  User,
  CreateUserInput,
  UpdateUserInput,
  Role,
  CreateRoleInput,
  UpdateRoleInput,
  Resource,
  CreateResourceInput,
  UpdateResourceInput,
  Permission,
  CreatePermissionInput,
  UpdatePermissionInput,
  RolePermission,
  CreateRolePermissionInput,
  UserRole,
  CreateUserRoleInput,
  UserPermission,
} from './api';

// Exportar funciones API server-side
export const usersApi = {
  getAll: async () => fetchApi<User[]>('/users/'),
  getById: async (id: number) => fetchApi<User>(`/users/${id}`),
  create: async (data: CreateUserInput) =>
    fetchApi<User>('/users/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: async (id: number, data: UpdateUserInput) =>
    fetchApi<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: async (id: number) =>
    fetchApi<{ message: string; user: User }>(`/users/${id}`, {
      method: 'DELETE',
    }),
};

export const rolesApi = {
  getAll: async () => fetchApi<Role[]>('/roles/'),
  getById: async (id: number) => fetchApi<Role>(`/roles/${id}`),
  create: async (data: CreateRoleInput) =>
    fetchApi<Role>('/roles/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: async (id: number, data: UpdateRoleInput) =>
    fetchApi<Role>(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: async (id: number) =>
    fetchApi<{ message: string; role: Role }>(`/roles/${id}`, {
      method: 'DELETE',
    }),
};

export const resourcesApi = {
  getAll: async () => fetchApi<Resource[]>('/resources/'),
  getById: async (id: number) => fetchApi<Resource>(`/resources/${id}`),
  create: async (data: CreateResourceInput) =>
    fetchApi<Resource>('/resources/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: async (id: number, data: UpdateResourceInput) =>
    fetchApi<Resource>(`/resources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: async (id: number) =>
    fetchApi<{ message: string; resource: Resource }>(`/resources/${id}`, {
      method: 'DELETE',
    }),
};

export const permissionsApi = {
  getAll: async () => fetchApi<Permission[]>('/permissions/'),
  getById: async (id: number) => fetchApi<Permission>(`/permissions/${id}`),
  getByResource: async (resourceId: number) =>
    fetchApi<Permission[]>(`/permissions/resource/${resourceId}`),
  create: async (data: CreatePermissionInput) =>
    fetchApi<Permission>('/permissions/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: async (id: number, data: UpdatePermissionInput) =>
    fetchApi<Permission>(`/permissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: async (id: number) =>
    fetchApi<{ message: string; permission: Permission }>(
      `/permissions/${id}`,
      {
        method: 'DELETE',
      }
    ),
};

export const rolePermissionsApi = {
  assign: async (data: CreateRolePermissionInput) =>
    fetchApi<{ message: string; assignment: RolePermission }>(
      '/role-permissions/',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    ),
  remove: async (roleId: number, permissionId: number) =>
    fetchApi<{ message: string; assignment: RolePermission }>(
      `/role-permissions/${roleId}/${permissionId}`,
      {
        method: 'DELETE',
      }
    ),
  getByRole: async (roleId: number) =>
    fetchApi<RolePermission[]>(`/role-permissions/role/${roleId}`),
  getByPermission: async (permissionId: number) =>
    fetchApi<RolePermission[]>(
      `/role-permissions/permission/${permissionId}`
    ),
};

export const userRolesApi = {
  assign: async (data: CreateUserRoleInput) =>
    fetchApi<{ message: string; assignment: UserRole }>('/user-roles/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  remove: async (userId: number, roleId: number) =>
    fetchApi<{ message: string; assignment: UserRole }>(
      `/user-roles/${userId}/${roleId}`,
      {
        method: 'DELETE',
      }
    ),
  getByUser: async (userId: number) =>
    fetchApi<UserRole[]>(`/user-roles/user/${userId}`),
  getUserPermissions: async (userId: number) =>
    fetchApi<UserPermission[]>(`/user-roles/user/${userId}/permissions`),
  getByRole: async (roleId: number) =>
    fetchApi<UserRole[]>(`/user-roles/role/${roleId}`),
};

