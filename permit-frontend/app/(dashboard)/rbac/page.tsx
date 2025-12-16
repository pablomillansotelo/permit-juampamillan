import { Role, rolesApi } from '@/lib/api-server';
import { Resource, resourcesApi } from '@/lib/api-server';
import { Permission, permissionsApi } from '@/lib/api-server';
import { RbacPageClient } from './rbac-page-client';

export const dynamic = 'force-dynamic';

export default async function RbacPage() {
  // Fetch initial data for all tabs
  let roles: Role[] = [];
  let resources: Resource[] = [];
  let permissions: Permission[] = [];

  try {
    [roles, resources, permissions] = await Promise.all([
      rolesApi.getAll(),
      resourcesApi.getAll(),
      permissionsApi.getAll()
    ]);
  } catch (error) {
    console.error('Error fetching RBAC data:', error);
  }

  return (
    <RbacPageClient
      initialRoles={roles}
      initialResources={resources}
      initialPermissions={permissions}
    />
  );
}

