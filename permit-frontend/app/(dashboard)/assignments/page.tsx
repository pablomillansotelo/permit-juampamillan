import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RolePermissionsTab } from './role-permissions-tab';
import { UserRolesTab } from './user-roles-tab';
import { UserPermissionsTab } from './user-permissions-tab';

export default function AssignmentsPage() {
  return (
    <Tabs defaultValue="role-permissions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="role-permissions">
            Permisos por Rol
          </TabsTrigger>
          <TabsTrigger value="user-roles">Roles por Usuario</TabsTrigger>
          <TabsTrigger value="user-permissions">
            Ver Permisos de Usuario
          </TabsTrigger>
        </TabsList>

        <TabsContent value="role-permissions" className="mt-6">
          <RolePermissionsTab />
        </TabsContent>

        <TabsContent value="user-roles" className="mt-6">
          <UserRolesTab />
        </TabsContent>

        <TabsContent value="user-permissions" className="mt-6">
          <UserPermissionsTab />
        </TabsContent>
      </Tabs>
  );
}

