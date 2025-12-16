'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, RefreshCw, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IndicatorForm } from './indicator-form';
import { indicatorsApi, type PerformanceIndicator, type CreateIndicatorInput, type UpdateIndicatorInput } from '@/lib/api';

interface IndicatorsTableProps {
  indicators: PerformanceIndicator[];
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function IndicatorsTable({ indicators, onRefresh, isRefreshing }: IndicatorsTableProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<PerformanceIndicator | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {
    setEditingIndicator(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (indicator: PerformanceIndicator) => {
    setEditingIndicator(indicator);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este indicador?')) {
      return;
    }

    try {
      await indicatorsApi.delete(id);
      onRefresh();
    } catch (error) {
      console.error('Error al eliminar indicador:', error);
      alert('Error al eliminar indicador');
    }
  };

  const handleSubmit = async (data: CreateIndicatorInput | UpdateIndicatorInput) => {
    setIsSubmitting(true);
    try {
      if (editingIndicator) {
        await indicatorsApi.update(editingIndicator.id, data as UpdateIndicatorInput);
      } else {
        await indicatorsApi.create(data as CreateIndicatorInput);
      }
      setIsDialogOpen(false);
      setEditingIndicator(null);
      onRefresh();
    } catch (error) {
      console.error('Error al guardar indicador:', error);
      alert('Error al guardar indicador');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'numeric': return 'default';
      case 'percentage': return 'secondary';
      case 'boolean': return 'outline';
      case 'text': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1" />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Indicador
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingIndicator ? 'Editar Indicador' : 'Nuevo Indicador'}
                </DialogTitle>
                <DialogDescription>
                  {editingIndicator 
                    ? 'Modifica los datos del indicador de performance'
                    : 'Crea un nuevo indicador de performance para evaluaciones'}
                </DialogDescription>
              </DialogHeader>
              <IndicatorForm
                indicator={editingIndicator}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsDialogOpen(false);
                  setEditingIndicator(null);
                }}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Valor Objetivo</TableHead>
              <TableHead>Peso</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {indicators.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No hay indicadores registrados
                </TableCell>
              </TableRow>
            ) : (
              indicators.map((indicator) => (
                <TableRow key={indicator.id}>
                  <TableCell className="font-medium">{indicator.name}</TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadgeVariant(indicator.type)}>
                      {indicator.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{indicator.category || '-'}</TableCell>
                  <TableCell>
                    {indicator.targetValue 
                      ? `${indicator.targetValue}${indicator.unit || ''}`
                      : '-'}
                  </TableCell>
                  <TableCell>{indicator.weight || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={indicator.isActive ? 'default' : 'secondary'}>
                      {indicator.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(indicator)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(indicator.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

