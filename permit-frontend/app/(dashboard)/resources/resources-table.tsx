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
import { Resource } from '@/lib/api';
import { toast } from '@/lib/toast';
import { Pencil, Trash2, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { ResourceForm } from './resource-form';
import { PermissionGuard } from '@/components/permission-guard';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import { TableSearch } from '@/components/table-search';
import { useState, useMemo } from 'react';

interface ResourcesTableProps {
  resources: Resource[];
  onRefresh: () => void;
}

export function ResourcesTable({ resources, onRefresh }: ResourcesTableProps) {
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar recursos según el término de búsqueda
  const filteredResources = useMemo(() => {
    if (!searchTerm) return resources;
    const term = searchTerm.toLowerCase();
    return resources.filter(
      (resource) =>
        resource.name.toLowerCase().includes(term) ||
        (resource.description?.toLowerCase().includes(term) ?? false)
    );
  }, [resources, searchTerm]);

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingResource(null);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setEditingResource(null);
    onRefresh();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4 gap-4">
        <TableSearch
          placeholder="Buscar recursos por nombre o descripción..."
          onSearch={setSearchTerm}
        />
        <div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (open) {
            handleCreate();
          } else {
            setEditingResource(null);
          }
        }}>
          <PermissionGuard
            resource="resources"
            action="create"
            fallback={<Button disabled>Crear Recurso</Button>}
          >
            <DialogTrigger asChild>
              <Button>Crear Recurso</Button>
            </DialogTrigger>
          </PermissionGuard>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingResource ? 'Editar Recurso' : 'Crear Nuevo Recurso'}
              </DialogTitle>
              <DialogDescription>
                {editingResource
                  ? 'Modifica los datos del recurso.'
                  : 'Completa los datos para crear un nuevo recurso.'}
              </DialogDescription>
            </DialogHeader>
            <ResourceForm
              resource={editingResource}
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
                <FileText className="h-4 w-4" />
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
            {filteredResources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  {searchTerm
                    ? 'No se encontraron recursos que coincidan con la búsqueda'
                    : 'No hay recursos disponibles'}
                </TableCell>
              </TableRow>
            ) : (
              filteredResources.map((resource) => (
                <ResourceRow
                  key={resource.id}
                  resource={resource}
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

function ResourceRow({
  resource,
  onEdit,
  onRefresh
}: {
  resource: Resource;
  onEdit: (resource: Resource) => void;
  onRefresh: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const deletePromise = (async () => {
        const { resourcesApi } = await import('@/lib/api');
        return resourcesApi.delete(resource.id);
      })();
      
      toast.promise(deletePromise, {
        loading: 'Eliminando recurso...',
        success: () => {
          onRefresh();
          return 'Recurso eliminado correctamente';
        },
        error: (error: any) => {
          console.error('Error al eliminar recurso:', error);
          return error.message || 'Error al eliminar el recurso';
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
        <FileText className="h-4 w-4 text-muted-foreground" />
      </TableCell>
      <TableCell className="font-medium">{resource.name}</TableCell>
      <TableCell className="hidden md:table-cell">
        {resource.description || (
          <span className="text-muted-foreground">Sin descripción</span>
        )}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {formatDate(resource.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <PermissionGuard
            resource="resources"
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
              onClick={() => onEdit(resource)}
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
          </PermissionGuard>
          <PermissionGuard
            resource="resources"
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
              title="¿Eliminar recurso?"
              description={`¿Estás seguro de que deseas eliminar el recurso "${resource.name}"? Esta acción no se puede deshacer.`}
              onConfirm={handleDelete}
              itemName={resource.name}
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

