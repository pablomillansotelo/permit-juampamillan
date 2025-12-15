/**
 * Hook y helpers para validación de permisos RBAC en el frontend
 */

'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { UserPermission } from './api';
import { usePermissionsListener } from './permissions-events';

interface PermissionsContextType {
  permissions: UserPermission[];
  isLoading: boolean;
  hasPermission: (resource: string, action: string) => boolean;
  canAccess: (resource: string, action: string) => boolean;
  refresh: () => Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined
);

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (!context) {
    // Fallback: si no hay contexto, permitir todo (útil durante desarrollo o cuando el provider no está configurado)
    return {
      permissions: [],
      isLoading: false,
      hasPermission: () => true, // Permitir todo si no hay contexto
      canAccess: () => true,
      refresh: async () => {}
    };
  }
  return context;
}

/**
 * Hook para verificar si el usuario tiene un permiso específico
 */
export function useHasPermission(resource: string, action: string) {
  const { hasPermission } = usePermissions();
  return hasPermission(resource, action);
}

/**
 * Provider de permisos
 */
export function PermissionsProvider({
  children,
  userId
}: {
  children: React.ReactNode;
  userId?: number;
}) {
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPermissions = async () => {
    if (!userId) {
      setIsLoading(false);
      // Si no hay userId, permitir todo (modo desarrollo o usuario no autenticado)
      setPermissions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/permit/user-roles/user/${userId}/permissions`);
      if (response.ok) {
        const data = await response.json();
        setPermissions(data);
      } else {
        // Si falla la carga, permitir todo en desarrollo
        console.warn('No se pudieron cargar permisos, permitiendo todo en modo desarrollo');
        setPermissions([]);
      }
    } catch (error) {
      console.error('Error al cargar permisos:', error);
      // En caso de error, permitir todo en desarrollo
      setPermissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, [userId]);

  // Escuchar eventos de actualización de permisos
  usePermissionsListener(() => {
    loadPermissions();
  });

  const hasPermission = (resource: string, action: string): boolean => {
    // Si no hay permisos cargados, permitir todo (modo desarrollo)
    if (permissions.length === 0) {
      return true;
    }
    return permissions.some(
      (perm) =>
        perm.resourceName?.toLowerCase() === resource.toLowerCase() &&
        perm.permissionAction?.toLowerCase() === action.toLowerCase()
    );
  };

  const canAccess = (resource: string, action: string): boolean => {
    return hasPermission(resource, action);
  };

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        isLoading,
        hasPermission,
        canAccess,
        refresh: loadPermissions
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

