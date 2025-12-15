'use client';

import { usePermissions } from '@/lib/permissions';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface PermissionGuardProps {
  resource: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showTooltip?: boolean;
}

/**
 * Componente que solo renderiza children si el usuario tiene el permiso especificado
 */
export function PermissionGuard({
  resource,
  action,
  children,
  fallback = null,
  showTooltip = true
}: PermissionGuardProps) {
  const { hasPermission, isLoading } = usePermissions();

  // Durante la carga, mostrar children (permitir acceso temporalmente)
  // Esto evita que los botones se deshabiliten mientras se cargan los permisos
  if (isLoading) {
    return <>{children}</>;
  }

  if (!hasPermission(resource, action)) {
    if (showTooltip && fallback) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-block">{fallback}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>No tienes permiso para realizar esta acción</p>
          </TooltipContent>
        </Tooltip>
      );
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

