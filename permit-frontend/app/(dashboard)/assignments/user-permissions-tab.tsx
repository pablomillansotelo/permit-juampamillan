'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  User,
  UserPermission,
  usersApi,
  userRolesApi
} from '@/lib/api';
import { toast } from '@/lib/toast';
import { Users, Key, Shield, FileText } from 'lucide-react';

export function UserPermissionsTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadUserPermissions(selectedUserId);
    } else {
      setPermissions([]);
    }
  }, [selectedUserId]);

  const loadUsers = async () => {
    try {
      const usersData = await usersApi.getAll();
      setUsers(usersData);
    } catch (error: any) {
      toast.error('Error al cargar usuarios', error.message);
    }
  };

  const loadUserPermissions = async (userId: number) => {
    setIsLoading(true);
    try {
      const data = await userRolesApi.getUserPermissions(userId);
      setPermissions(data);
    } catch (error: any) {
      toast.error('Error al cargar permisos', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Agrupar permisos por recurso y rol
  const permissionsByResource = permissions.reduce((acc, perm) => {
    const resourceName = perm.resourceName || 'Sin recurso';
    const roleName = perm.roleName || 'Sin rol';
    
    if (!acc[resourceName]) {
      acc[resourceName] = {};
    }
    if (!acc[resourceName][roleName]) {
      acc[resourceName][roleName] = [];
    }
    acc[resourceName][roleName].push(perm);
    return acc;
  }, {} as Record<string, Record<string, UserPermission[]>>);

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Ver Permisos de Usuario
          </CardTitle>
          <CardDescription>
            Selecciona un usuario para ver todos sus permisos agrupados por recurso y rol
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Búsqueda y Selector */}
          <div className="space-y-2">
            <Label htmlFor="user-search-perms">Buscar Usuario</Label>
            <Input
              id="user-search-perms"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-select-perms">Seleccionar Usuario</Label>
            <select
              id="user-select-perms"
              value={selectedUserId || ''}
              onChange={(e) => setSelectedUserId(Number(e.target.value) || null)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">-- Selecciona un usuario --</option>
              {filteredUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {isLoading && (
            <div className="text-center text-muted-foreground py-8">
              Cargando permisos...
            </div>
          )}

          {selectedUserId && !isLoading && (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {Object.keys(permissionsByResource).length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  Este usuario no tiene permisos asignados
                </div>
              ) : (
                Object.entries(permissionsByResource).map(([resourceName, roles]) => (
                  <Card key={resourceName}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {resourceName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {Object.entries(roles).map(([roleName, perms]) => (
                        <div key={roleName} className="mb-4 last:mb-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">
                              Desde rol: {roleName}
                            </span>
                          </div>
                          <div className="ml-5 space-y-1">
                            {perms.map((perm) => (
                              <div
                                key={perm.permissionId}
                                className="flex items-center gap-2 text-sm"
                              >
                                <Key className="h-3 w-3 text-muted-foreground" />
                                <span>{perm.permissionName}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {perm.permissionAction}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

