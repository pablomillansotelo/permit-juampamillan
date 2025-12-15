'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  User,
  Role,
  UserRole,
  usersApi,
  rolesApi,
  userRolesApi
} from '@/lib/api';
import { toast } from '@/lib/toast';
import { notifyPermissionsUpdated } from '@/lib/permissions-events';
import { Users, Shield } from 'lucide-react';

export function UserRolesTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadUserRoles(selectedUserId);
    } else {
      setUserRoles([]);
      setSelectedRoles(new Set());
    }
  }, [selectedUserId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersData, rolesData] = await Promise.all([
        usersApi.getAll(),
        rolesApi.getAll()
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (error: any) {
      toast.error('Error al cargar datos', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserRoles = async (userId: number) => {
    try {
      const data = await userRolesApi.getByUser(userId);
      setUserRoles(data);
      const assignedIds = new Set(data.map(ur => ur.roleId));
      setSelectedRoles(assignedIds);
    } catch (error: any) {
      toast.error('Error al cargar roles del usuario', error.message);
    }
  };

  const handleRoleToggle = (roleId: number) => {
    const newSelected = new Set(selectedRoles);
    if (newSelected.has(roleId)) {
      newSelected.delete(roleId);
    } else {
      newSelected.add(roleId);
    }
    setSelectedRoles(newSelected);
  };

  const handleSave = async () => {
    if (!selectedUserId) {
      toast.warning('Selecciona un usuario', 'Debes seleccionar un usuario primero');
      return;
    }

    const currentIds = new Set(userRoles.map(ur => ur.roleId));
    const newIds = selectedRoles;

    const toAdd = Array.from(newIds).filter(id => !currentIds.has(id));
    const toRemove = Array.from(currentIds).filter(id => !newIds.has(id));

    if (toAdd.length === 0 && toRemove.length === 0) {
      toast.info('Sin cambios', 'No hay cambios para guardar');
      return;
    }

    setIsLoading(true);
    try {
      const addPromises = toAdd.map(roleId =>
        userRolesApi.assign({
          userId: selectedUserId,
          roleId
        })
      );

      const removePromises = toRemove.map(roleId =>
        userRolesApi.remove(selectedUserId, roleId)
      );

      await Promise.all([...addPromises, ...removePromises]);
      
      toast.success(
        'Roles actualizados',
        `Se ${toAdd.length > 0 ? 'agregaron' : ''} ${toAdd.length} y se ${toRemove.length > 0 ? 'removieron' : ''} ${toRemove.length} roles`
      );
      
      await loadUserRoles(selectedUserId);
      
      // Notificar que los permisos se actualizaron (para refresh automático)
      notifyPermissionsUpdated();
    } catch (error: any) {
      toast.error('Error al guardar cambios', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar usuarios por búsqueda
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Asignar Roles a Usuarios
          </CardTitle>
          <CardDescription>
            Selecciona un usuario y marca los roles que deseas asignarle
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Búsqueda y Selector de Usuario */}
          <div className="space-y-2">
            <Label htmlFor="user-search">Buscar Usuario</Label>
            <Input
              id="user-search"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-select">Seleccionar Usuario</Label>
            <select
              id="user-select"
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

          {selectedUserId && (
            <>
              {/* Lista de Roles */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto border rounded-lg p-4">
                {roles.map((role) => (
                  <div key={role.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={selectedRoles.has(role.id)}
                      onCheckedChange={() => handleRoleToggle(role.id)}
                    />
                    <Label
                      htmlFor={`role-${role.id}`}
                      className="flex items-center gap-2 cursor-pointer flex-1"
                    >
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">{role.name}</span>
                      {role.description && (
                        <span className="text-sm text-muted-foreground">
                          - {role.description}
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Botón Guardar */}
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

