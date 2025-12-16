'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Role, rolesApi } from '@/lib/api';
import { Resource, resourcesApi } from '@/lib/api';
import { Permission, permissionsApi } from '@/lib/api';
import { RolesTable } from '../roles/roles-table';
import { ResourcesTable } from '../resources/resources-table';
import { PermissionsTable } from '../permissions/permissions-table';
import { TableSkeleton } from '@/components/table-skeleton';

interface RbacPageClientProps {
  initialRoles: Role[];
  initialResources: Resource[];
  initialPermissions: Permission[];
}

export function RbacPageClient({
  initialRoles,
  initialResources,
  initialPermissions
}: RbacPageClientProps) {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefreshRoles = async () => {
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

  const handleRefreshResources = async () => {
    setIsLoading(true);
    try {
      const updatedResources = await resourcesApi.getAll();
      setResources(updatedResources);
    } catch (error) {
      console.error('Error al actualizar recursos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshPermissions = async () => {
    setIsLoading(true);
    try {
      const [updatedPermissions, updatedResources] = await Promise.all([
        permissionsApi.getAll(),
        resourcesApi.getAll()
      ]);
      setPermissions(updatedPermissions);
      setResources(updatedResources);
    } catch (error) {
      console.error('Error al actualizar permisos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <TableSkeleton columns={5} rows={5} />;
  }

  return (
    <Tabs defaultValue="roles" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="roles">Roles</TabsTrigger>
        <TabsTrigger value="resources">Recursos</TabsTrigger>
        <TabsTrigger value="permissions">Permisos</TabsTrigger>
      </TabsList>

      <TabsContent value="roles" className="mt-6">
        <RolesTable roles={roles} onRefresh={handleRefreshRoles} />
      </TabsContent>

      <TabsContent value="resources" className="mt-6">
        <ResourcesTable resources={resources} onRefresh={handleRefreshResources} />
      </TabsContent>

      <TabsContent value="permissions" className="mt-6">
        <PermissionsTable
          permissions={permissions}
          resources={resources}
          onRefresh={handleRefreshPermissions}
        />
      </TabsContent>
    </Tabs>
  );
}

