import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, FileText, Key } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usersApi, rolesApi, resourcesApi, permissionsApi } from '@/lib/api-server';

export default async function DashboardPage() {
  // Fetch counts
  let counts = {
    users: 0,
    roles: 0,
    resources: 0,
    permissions: 0
  };

  try {
    const [users, roles, resources, permissions] = await Promise.all([
      usersApi.getAll().catch(() => []),
      rolesApi.getAll().catch(() => []),
      resourcesApi.getAll().catch(() => []),
      permissionsApi.getAll().catch(() => [])
    ]);

    counts = {
      users: users.length,
      roles: roles.length,
      resources: resources.length,
      permissions: permissions.length
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }

  const stats = [
    {
      title: 'Usuarios',
      value: counts.users,
      icon: Users,
      href: '/users',
      description: 'Usuarios del sistema'
    },
    {
      title: 'Roles',
      value: counts.roles,
      icon: Shield,
      href: '/roles',
      description: 'Roles disponibles'
    },
    {
      title: 'Recursos',
      value: counts.resources,
      icon: FileText,
      href: '/resources',
      description: 'Recursos gestionados'
    },
    {
      title: 'Permisos',
      value: counts.permissions,
      icon: Key,
      href: '/permissions',
      description: 'Permisos definidos'
    }
  ];

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Bienvenido a Permit</CardTitle>
            <CardDescription>
              Sistema de gestión de permisos basado en roles (RBAC)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Gestiona usuarios, roles, recursos y permisos de forma eficiente.
              Comienza navegando por las secciones del menú lateral.
            </p>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/users">Ver Usuarios</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/roles">Ver Roles</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
