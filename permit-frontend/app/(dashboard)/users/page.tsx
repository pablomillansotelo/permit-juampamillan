import { usersApi } from '@/lib/api-server';
import { UsersPageClient } from './users-page-client';

export default async function UsersPage() {
  let users = [];
  try {
    users = await usersApi.getAll();
  } catch (error) {
    console.error('Error fetching users:', error);
  }

  return (
    <UsersPageClient initialUsers={users} />
  );
}
