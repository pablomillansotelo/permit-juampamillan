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
import { Role } from '@/lib/api';
import { toast } from '@/lib/toast';
import { Pencil, Trash2, Shield } from 'lucide-react';
import { PermissionGuard } from '@/components/permission-guard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { RoleForm } from './role-form';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import { TableSearch } from '@/components/table-search';
import { useState, useMemo } from 'react';

interface RolesTableProps {
  roles: Role[];
  onRefresh: () => void;
}

export function RolesTable({ roles, onRefresh }: RolesTableProps) {
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar roles según el término de búsqueda
  const filteredRoles = useMemo(() => {
    if (!searchTerm) return roles;
    const term = searchTerm.toLowerCase();
    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(term) ||
        (role.description?.toLowerCase().includes(term) ?? false)
    );
  }, [roles, searchTerm]);

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingRole(null);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setEditingRole(null);
    onRefresh();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4 gap-4">
        <TableSearch
          placeholder="Buscar roles por nombre o descripción..."
          onSearch={setSearchTerm}
        />
        <div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (open) {
            handleCreate();
          } else {
            setEditingRole(null);
          }
        }}>
          <PermissionGuard
            resource="roles"
            action="create"
            fallback={<Button disabled>Crear Rol</Button>}
          >
            <DialogTrigger asChild>
              <Button>Crear Rol</Button>
            </DialogTrigger>
          </PermissionGuard>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingRole ? 'Editar Rol' : 'Crear Nuevo Rol'}
              </DialogTitle>
              <DialogDescription>
                {editingRole
                  ? 'Modifica los datos del rol.'
                  : 'Completa los datos para crear un nuevo rol.'}
              </DialogDescription>
            </DialogHeader>
            <RoleForm
              role={editingRole}
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
                <Shield className="h-4 w-4" />
              </TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="hidden md:table-cell">
                Descripción
              </TableHead>
              <TableHead className="hidden md:table-cell">Creado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  {searchTerm
                    ? 'No se encontraron roles que coincidan con la búsqueda'
                    : 'No hay roles disponibles'}
                </TableCell>
              </TableRow>
            ) : (
              filteredRoles.map((role) => (
                <RoleRow
                  key={role.id}
                  role={role}
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

function RoleRow({
  role,
  onEdit,
  onRefresh
}: {
  role: Role;
  onEdit: (role: Role) => void;
  onRefresh: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const deletePromise = (async () => {
        const { rolesApi } = await import('@/lib/api');
        return rolesApi.delete(role.id);
      })();
      
      toast.promise(deletePromise, {
        loading: 'Eliminando rol...',
        success: () => {
          onRefresh();
          return 'Rol eliminado correctamente';
        },
        error: (error: any) => {
          console.error('Error al eliminar rol:', error);
          return error.message || 'Error al eliminar el rol';
        }
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <TableRow>
      <TableCell>
        <Shield className="h-4 w-4 text-muted-foreground" />
      </TableCell>
      <TableCell className="font-medium">{role.name}</TableCell>
      <TableCell className="hidden md:table-cell">
        {role.description || (
          <span className="text-muted-foreground">Sin descripción</span>
        )}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {formatDate(role.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <PermissionGuard
            resource="roles"
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
              onClick={() => onEdit(role)}
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
          </PermissionGuard>
          <PermissionGuard
            resource="roles"
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
              title="¿Eliminar rol?"
              description={`¿Estás seguro de que deseas eliminar el rol "${role.name}"? Esta acción no se puede deshacer.`}
              onConfirm={handleDelete}
              itemName={role.name}
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

