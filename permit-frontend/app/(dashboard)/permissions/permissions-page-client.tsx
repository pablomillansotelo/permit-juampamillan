'use client';

import { useState } from 'react';
import { Permission, Resource, permissionsApi, resourcesApi } from '@/lib/api';
import { PermissionsTable } from './permissions-table';
import { TableSkeleton } from '@/components/table-skeleton';

interface PermissionsPageClientProps {
  initialPermissions: Permission[];
  initialResources: Resource[];
}

export function PermissionsPageClient({
  initialPermissions,
  initialResources
}: PermissionsPageClientProps) {
  const [permissions, setPermissions] =
    useState<Permission[]>(initialPermissions);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const [updatedPermissions, updatedResources] = await Promise.all([
        permissionsApi.getAll(),
        resourcesApi.getAll()
      ]);
      setPermissions(updatedPermissions);
      setResources(updatedResources);
    } catch (error) {
      console.error('Error al actualizar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <TableSkeleton columns={6} rows={5} />;
  }

  return (
    <PermissionsTable
      permissions={permissions}
      resources={resources}
      onRefresh={handleRefresh}
    />
  );
}

