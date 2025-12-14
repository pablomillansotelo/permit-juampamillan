import { getUsers } from '@/lib/db';
import { UsersTable } from './users-table';
import { Search } from './search';
import { useSearchParams } from 'next/navigation';

// If you want to use a separate type

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    offset?: string;
  }>;
}) {
  // Asegúrate de que searchParams sea tratado correctamente
  const searchParams = await props.searchParams;
  const search = searchParams?.query || '';
  const offset =
    typeof searchParams?.offset === 'string' ? Number(searchParams?.query) : 0;

  console.log('offset', offset);

  try {
    const { users, newOffset } = await getUsers(search, offset);

    return (
      <main className="flex flex-1 flex-col p-4 md:p-6">
        <div className="flex items-center mb-8">
          <h1 className="font-semibold text-lg md:text-2xl">Users</h1>
        </div>
        <div className="w-full mb-4">
          <Search value={search} />
        </div>
        <UsersTable users={users} offset={newOffset} />
      </main>
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return (
      <main className="flex flex-1 flex-col p-4 md:p-6">
        <div className="flex items-center mb-8">
          <h1 className="font-semibold text-lg md:text-2xl">Users</h1>
        </div>
        <p className="text-red-500">
          Error loading users. Please try again later.
        </p>
      </main>
    );
  }
}
