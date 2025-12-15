import { Permission, permissionsApi, Resource, resourcesApi } from '@/lib/api-server';
import { PermissionsPageClient } from './permissions-page-client';

export const dynamic = 'force-dynamic';

export default async function PermissionsPage() {
  let permissions: Permission[] = [];
  let resources: Resource[] = [];
  try {
    [permissions, resources] = await Promise.all([
      permissionsApi.getAll(),
      resourcesApi.getAll()
    ]);
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return (
    <PermissionsPageClient
      initialPermissions={permissions}
      initialResources={resources}
    />
  );
}

