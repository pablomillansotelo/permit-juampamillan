import { Role, rolesApi } from '@/lib/api-server';
import { RolesTable } from './roles-table';
import { RolesPageClient } from './roles-page-client';

export default async function RolesPage() {
  // Fetch initial data
  let roles: Role[] = [];
  try {
    roles = await rolesApi.getAll();
  } catch (error) {
    console.error('Error fetching roles:', error);
  }

  return (
    <RolesPageClient initialRoles={roles} />
  );
}

