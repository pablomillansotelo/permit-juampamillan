'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Permission, Resource, permissionsApi } from '@/lib/api';
import { toast } from '@/lib/toast';
import { Pencil, Trash2, Key } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { PermissionForm } from './permission-form';
import { PermissionGuard } from '@/components/permission-guard';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import { TableSearch } from '@/components/table-search';
import { useState, useMemo } from 'react';

interface PermissionsTableProps {
  permissions: Permission[];
  resources: Resource[];
  onRefresh: () => void;
}

export function PermissionsTable({
  permissions,
  resources,
  onRefresh
}: PermissionsTableProps) {
  const [editingPermission, setEditingPermission] =
    useState<Permission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar permisos según el término de búsqueda
  const filteredPermissions = useMemo(() => {
    if (!searchTerm) return permissions;
    const term = searchTerm.toLowerCase();
    return permissions.filter(
      (permission) =>
        permission.name.toLowerCase().includes(term) ||
        permission.action.toLowerCase().includes(term) ||
        (permission.resourceName?.toLowerCase().includes(term) ?? false) ||
        (permission.description?.toLowerCase().includes(term) ?? false)
    );
  }, [permissions, searchTerm]);

  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingPermission(null);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setEditingPermission(null);
    onRefresh();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4 gap-4">
        <TableSearch
          placeholder="Buscar permisos por nombre, acción, recurso..."
          onSearch={setSearchTerm}
        />
        <div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (open) {
            handleCreate();
          } else {
            setEditingPermission(null);
          }
        }}>
          <PermissionGuard
            resource="permissions"
            action="create"
            fallback={<Button disabled>Crear Permiso</Button>}
          >
            <DialogTrigger asChild>
              <Button>Crear Permiso</Button>
            </DialogTrigger>
          </PermissionGuard>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPermission
                  ? 'Editar Permiso'
                  : 'Crear Nuevo Permiso'}
              </DialogTitle>
              <DialogDescription>
                {editingPermission
                  ? 'Modifica los datos del permiso.'
                  : 'Completa los datos para crear un nuevo permiso.'}
              </DialogDescription>
            </DialogHeader>
            <PermissionForm
              permission={editingPermission}
              resources={resources}
              onSuccess={handleClose}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <div className="border shadow-sm rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Key className="h-4 w-4" />
              </TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Acción</TableHead>
              <TableHead className="hidden md:table-cell">Recurso</TableHead>
              <TableHead className="hidden md:table-cell">
                Descripción
              </TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPermissions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  {searchTerm
                    ? 'No se encontraron permisos que coincidan con la búsqueda'
                    : 'No hay permisos disponibles'}
                </TableCell>
              </TableRow>
            ) : (
              filteredPermissions.map((permission) => (
                <PermissionRow
                  key={permission.id}
                  permission={permission}
                  onEdit={handleEdit}
                  onRefresh={onRefresh}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function PermissionRow({
  permission,
  onEdit,
  onRefresh
}: {
  permission: Permission;
  onEdit: (permission: Permission) => void;
  onRefresh: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const deletePromise = permissionsApi.delete(permission.id);
      
      toast.promise(deletePromise, {
        loading: 'Eliminando permiso...',
        success: () => {
          onRefresh();
          return 'Permiso eliminado correctamente';
        },
        error: (error: any) => {
          console.error('Error al eliminar permiso:', error);
          return error.message || 'Error al eliminar el permiso';
        }
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <TableRow>
      <TableCell>
        <Key className="h-4 w-4 text-muted-foreground" />
      </TableCell>
      <TableCell className="font-medium">{permission.name}</TableCell>
      <TableCell>
        <Badge variant="secondary">{permission.action}</Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {permission.resourceName || (
          <span className="text-muted-foreground">N/A</span>
        )}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {permission.description || (
          <span className="text-muted-foreground">Sin descripción</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <PermissionGuard
            resource="permissions"
            action="update"
            fallback={
              <Button variant="ghost" size="sm" disabled className="h-8 w-8 p-0">
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Button>
            }
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(permission)}
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
          </PermissionGuard>
          <PermissionGuard
            resource="permissions"
            action="delete"
            fallback={
              <Button
                variant="ghost"
                size="sm"
                disabled
                className="h-8 w-8 p-0 text-muted-foreground"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Eliminar</span>
              </Button>
            }
          >
            <DeleteConfirmDialog
              title="¿Eliminar permiso?"
              description={`¿Estás seguro de que deseas eliminar el permiso "${permission.name}"? Esta acción no se puede deshacer.`}
              onConfirm={handleDelete}
              itemName={permission.name}
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isDeleting}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Eliminar</span>
                </Button>
              }
            />
          </PermissionGuard>
        </div>
      </TableCell>
    </TableRow>
  );
}

