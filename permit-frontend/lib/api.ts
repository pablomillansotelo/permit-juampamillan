/**
 * Cliente API para comunicarse con las rutas API de Next.js
 * Las rutas API actúan como proxy y manejan la autenticación y API key server-side
 */

const API_BASE_URL = '/api/permit';

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

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
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

// ==================== USUARIOS ====================

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string | Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
}

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    return fetchApi<User[]>('/users/');
  },

  getById: async (id: number): Promise<User> => {
    return fetchApi<User>(`/users/${id}`);
  },

  create: async (data: CreateUserInput): Promise<User> => {
    return fetchApi<User>('/users/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: UpdateUserInput): Promise<User> => {
    return fetchApi<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<{ message: string; user: User }> => {
    return fetchApi<{ message: string; user: User }>(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  signIn: async (email: string, password: string): Promise<{
    token: string;
    user: Omit<User, 'createdAt'>;
  }> => {
    return fetchApi<{ token: string; user: Omit<User, 'createdAt'> }>(
      '/users/sign-in',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
  },
};

// ==================== ROLES ====================

export interface Role {
  id: number;
  name: string;
  description: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateRoleInput {
  name: string;
  description?: string;
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
}

export const rolesApi = {
  getAll: async (): Promise<Role[]> => {
    return fetchApi<Role[]>('/roles/');
  },

  getById: async (id: number): Promise<Role> => {
    return fetchApi<Role>(`/roles/${id}`);
  },

  create: async (data: CreateRoleInput): Promise<Role> => {
    return fetchApi<Role>('/roles/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: UpdateRoleInput): Promise<Role> => {
    return fetchApi<Role>(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<{ message: string; role: Role }> => {
    return fetchApi<{ message: string; role: Role }>(`/roles/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== RECURSOS ====================

export interface Resource {
  id: number;
  name: string;
  description: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateResourceInput {
  name: string;
  description?: string;
}

export interface UpdateResourceInput {
  name?: string;
  description?: string;
}

export const resourcesApi = {
  getAll: async (): Promise<Resource[]> => {
    return fetchApi<Resource[]>('/resources/');
  },

  getById: async (id: number): Promise<Resource> => {
    return fetchApi<Resource>(`/resources/${id}`);
  },

  create: async (data: CreateResourceInput): Promise<Resource> => {
    return fetchApi<Resource>('/resources/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: UpdateResourceInput): Promise<Resource> => {
    return fetchApi<Resource>(`/resources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (
    id: number
  ): Promise<{ message: string; resource: Resource }> => {
    return fetchApi<{ message: string; resource: Resource }>(
      `/resources/${id}`,
      {
        method: 'DELETE',
      }
    );
  },
};

// ==================== PERMISOS ====================

export interface Permission {
  id: number;
  name: string;
  action: string;
  resourceId: number;
  resourceName: string | null;
  description: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreatePermissionInput {
  name: string;
  action: string;
  resourceId: number;
  description?: string;
}

export interface UpdatePermissionInput {
  name?: string;
  action?: string;
  resourceId?: number;
  description?: string;
}

export const permissionsApi = {
  getAll: async (): Promise<Permission[]> => {
    return fetchApi<Permission[]>('/permissions/');
  },

  getById: async (id: number): Promise<Permission> => {
    return fetchApi<Permission>(`/permissions/${id}`);
  },

  getByResource: async (resourceId: number): Promise<Permission[]> => {
    return fetchApi<Permission[]>(`/permissions/resource/${resourceId}`);
  },

  create: async (data: CreatePermissionInput): Promise<Permission> => {
    return fetchApi<Permission>('/permissions/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: number,
    data: UpdatePermissionInput
  ): Promise<Permission> => {
    return fetchApi<Permission>(`/permissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (
    id: number
  ): Promise<{ message: string; permission: Permission }> => {
    return fetchApi<{ message: string; permission: Permission }>(
      `/permissions/${id}`,
      {
        method: 'DELETE',
      }
    );
  },
};

// ==================== ROLE-PERMISSIONS ====================

export interface RolePermission {
  id: number;
  roleId: number;
  permissionId: number;
  permissionName?: string | null;
  permissionAction?: string | null;
  resourceId?: number | null;
  resourceName?: string | null;
  createdAt: string | Date;
}

export interface CreateRolePermissionInput {
  roleId: number;
  permissionId: number;
}

export const rolePermissionsApi = {
  assign: async (
    data: CreateRolePermissionInput
  ): Promise<{ message: string; assignment: RolePermission }> => {
    return fetchApi<{ message: string; assignment: RolePermission }>(
      '/role-permissions/',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  remove: async (
    roleId: number,
    permissionId: number
  ): Promise<{ message: string; assignment: RolePermission }> => {
    return fetchApi<{ message: string; assignment: RolePermission }>(
      `/role-permissions/${roleId}/${permissionId}`,
      {
        method: 'DELETE',
      }
    );
  },

  getByRole: async (roleId: number): Promise<RolePermission[]> => {
    return fetchApi<RolePermission[]>(`/role-permissions/role/${roleId}`);
  },

  getByPermission: async (permissionId: number): Promise<RolePermission[]> => {
    return fetchApi<RolePermission[]>(
      `/role-permissions/permission/${permissionId}`
    );
  },
};

// ==================== USER-ROLES ====================

export interface UserRole {
  id: number;
  userId: number;
  roleId: number;
  roleName?: string | null;
  roleDescription?: string | null;
  userName?: string | null;
  userEmail?: string | null;
  createdAt: string | Date;
}

export interface UserPermission {
  permissionId: number;
  permissionName: string | null;
  permissionAction: string | null;
  resourceId: number | null;
  resourceName: string | null;
  roleId: number;
  roleName: string | null;
}

export interface CreateUserRoleInput {
  userId: number;
  roleId: number;
}

// ==================== AVAILABLE ====================

export interface AvailableResources {
  resources: Array<{
    id: number;
    name: string;
    description: string | null;
  }>;
  actions: string[];
}

export const availableApi = {
  getAvailable: async (): Promise<AvailableResources> => {
    return fetchApi<AvailableResources>('/available');
  },
};

// ==================== USER ROLES ====================

export const userRolesApi = {
  assign: async (
    data: CreateUserRoleInput
  ): Promise<{ message: string; assignment: UserRole }> => {
    return fetchApi<{ message: string; assignment: UserRole }>(
      '/user-roles/',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  remove: async (
    userId: number,
    roleId: number
  ): Promise<{ message: string; assignment: UserRole }> => {
    return fetchApi<{ message: string; assignment: UserRole }>(
      `/user-roles/${userId}/${roleId}`,
      {
        method: 'DELETE',
      }
    );
  },

  getByUser: async (userId: number): Promise<UserRole[]> => {
    return fetchApi<UserRole[]>(`/user-roles/user/${userId}`);
  },

  getUserPermissions: async (userId: number): Promise<UserPermission[]> => {
    return fetchApi<UserPermission[]>(
      `/user-roles/user/${userId}/permissions`
    );
  },

  getByRole: async (roleId: number): Promise<UserRole[]> => {
    return fetchApi<UserRole[]>(`/user-roles/role/${roleId}`);
  },
};

