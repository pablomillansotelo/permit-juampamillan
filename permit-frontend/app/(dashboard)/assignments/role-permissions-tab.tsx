'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Role,
  Permission,
  RolePermission,
  rolesApi,
  permissionsApi,
  rolePermissionsApi
} from '@/lib/api';
import { toast } from '@/lib/toast';
import { notifyPermissionsUpdated } from '@/lib/permissions-events';
import { Shield, Key, FileText } from 'lucide-react';

export function RolePermissionsTab() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

  // Cargar permisos del rol cuando se selecciona un rol
  useEffect(() => {
    if (selectedRoleId) {
      loadRolePermissions(selectedRoleId);
    } else {
      setRolePermissions([]);
      setSelectedPermissions(new Set());
    }
  }, [selectedRoleId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [rolesData, permissionsData] = await Promise.all([
        rolesApi.getAll(),
        permissionsApi.getAll()
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (error: any) {
      toast.error('Error al cargar datos', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRolePermissions = async (roleId: number) => {
    try {
      const data = await rolePermissionsApi.getByRole(roleId);
      setRolePermissions(data);
      // Marcar permisos asignados
      const assignedIds = new Set(data.map(rp => rp.permissionId));
      setSelectedPermissions(assignedIds);
    } catch (error: any) {
      toast.error('Error al cargar permisos del rol', error.message);
    }
  };

  const handlePermissionToggle = (permissionId: number) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permissionId)) {
      newSelected.delete(permissionId);
    } else {
      newSelected.add(permissionId);
    }
    setSelectedPermissions(newSelected);
  };

  const handleSave = async () => {
    if (!selectedRoleId) {
      toast.warning('Selecciona un rol', 'Debes seleccionar un rol primero');
      return;
    }

    const currentIds = new Set(rolePermissions.map(rp => rp.permissionId));
    const newIds = selectedPermissions;

    // Encontrar permisos a agregar y remover
    const toAdd = Array.from(newIds).filter(id => !currentIds.has(id));
    const toRemove = Array.from(currentIds).filter(id => !newIds.has(id));

    if (toAdd.length === 0 && toRemove.length === 0) {
      toast.info('Sin cambios', 'No hay cambios para guardar');
      return;
    }

    setIsLoading(true);
    try {
      // Agregar nuevos permisos
      const addPromises = toAdd.map(permissionId =>
        rolePermissionsApi.assign({
          roleId: selectedRoleId,
          permissionId
        })
      );

      // Remover permisos
      const removePromises = toRemove.map(permissionId =>
        rolePermissionsApi.remove(selectedRoleId, permissionId)
      );

      await Promise.all([...addPromises, ...removePromises]);
      
      toast.success(
        'Permisos actualizados',
        `Se ${toAdd.length > 0 ? 'agregaron' : ''} ${toAdd.length} y se ${toRemove.length > 0 ? 'removieron' : ''} ${toRemove.length} permisos`
      );
      
      // Recargar permisos del rol
      await loadRolePermissions(selectedRoleId);
      
      // Notificar que los permisos se actualizaron (para refresh automático)
      notifyPermissionsUpdated();
    } catch (error: any) {
      toast.error('Error al guardar cambios', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Agrupar permisos por recurso
  const permissionsByResource = permissions.reduce((acc, perm) => {
    const resourceName = perm.resourceName || 'Sin recurso';
    if (!acc[resourceName]) {
      acc[resourceName] = [];
    }
    acc[resourceName].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Asignar Permisos a Roles
          </CardTitle>
          <CardDescription>
            Selecciona un rol y marca los permisos que deseas asignarle
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selector de Rol */}
          <div className="space-y-2">
            <Label htmlFor="role-select">Seleccionar Rol</Label>
            <select
              id="role-select"
              value={selectedRoleId || ''}
              onChange={(e) => setSelectedRoleId(Number(e.target.value) || null)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">-- Selecciona un rol --</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {selectedRoleId && (
            <>
              {/* Lista de Permisos */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto border rounded-lg p-4">
                {Object.entries(permissionsByResource).map(([resourceName, perms]) => (
                  <div key={resourceName} className="space-y-2">
                    <div className="flex items-center gap-2 font-medium text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {resourceName}
                    </div>
                    <div className="ml-6 space-y-2">
                      {perms.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`perm-${permission.id}`}
                            checked={selectedPermissions.has(permission.id)}
                            onCheckedChange={() =>
                              handlePermissionToggle(permission.id)
                            }
                          />
                          <Label
                            htmlFor={`perm-${permission.id}`}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Key className="h-3 w-3" />
                            <span className="font-medium">{permission.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {permission.action}
                            </Badge>
                            {permission.description && (
                              <span className="text-xs text-muted-foreground">
                                - {permission.description}
                              </span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </div>
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

