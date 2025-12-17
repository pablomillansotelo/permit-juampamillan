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
import { LeaveType, leaveTypesApi } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useState } from 'react';
import { LeaveTypeForm } from './leave-type-form';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import { toast } from '@/lib/toast';

interface LeaveTypesTableProps {
  leaveTypes: LeaveType[];
  onRefresh: () => void;
}

export function LeaveTypesTable({ leaveTypes, onRefresh }: LeaveTypesTableProps) {
  const [editingType, setEditingType] = useState<LeaveType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = (type: LeaveType) => {
    setEditingType(type);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await leaveTypesApi.delete(id);
      toast.success('Tipo de ausencia eliminado exitosamente');
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar tipo de ausencia');
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setEditingType(null);
  };

  const handleSuccess = () => {
    handleClose();
    onRefresh();
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Días Máx/Año</TableHead>
              <TableHead>Requiere Aprobación</TableHead>
              <TableHead>Acumulable</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No hay tipos de ausencia
                </TableCell>
              </TableRow>
            ) : (
              leaveTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{type.code}</Badge>
                  </TableCell>
                  <TableCell>{type.maxDaysPerYear ?? 'Sin límite'}</TableCell>
                  <TableCell>
                    {type.requiresApproval ? (
                      <Badge variant="default">Sí</Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {type.carryOverAllowed ? (
                      <Badge variant="default">Sí</Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {type.color && (
                      <div
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: type.color }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(type)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DeleteConfirmDialog
                        title="Eliminar Tipo de Ausencia"
                        description={`¿Estás seguro de que deseas eliminar el tipo de ausencia "${type.name}"? Esta acción no se puede deshacer.`}
                        onConfirm={() => handleDelete(type.id)}
                        itemName={type.name}
                        trigger={
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingType ? 'Editar Tipo de Ausencia' : 'Nuevo Tipo de Ausencia'}
            </DialogTitle>
          </DialogHeader>
          <LeaveTypeForm
            leaveType={editingType || undefined}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

