'use client';

import { useState, useEffect } from 'react';
import { Role, rolesApi } from '@/lib/api';
import { RolesTable } from './roles-table';
import { TableSkeleton } from '@/components/table-skeleton';

interface RolesPageClientProps {
  initialRoles: Role[];
}

export function RolesPageClient({ initialRoles }: RolesPageClientProps) {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const updatedRoles = await rolesApi.getAll();
      setRoles(updatedRoles);
    } catch (error) {
      console.error('Error al actualizar roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <TableSkeleton columns={5} rows={5} />;
  }

  return (
    <RolesTable roles={roles} onRefresh={handleRefresh} />
  );
}

