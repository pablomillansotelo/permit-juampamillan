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
import { Plus, RefreshCw, Eye, Send, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { EvaluationForm } from './evaluation-form';
import { EvaluationDetailDialog } from './evaluation-detail-dialog';
import { evaluationsApi, type Evaluation } from '@/lib/api';
// Función helper para formatear fechas
const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

interface EvaluationsTableProps {
  evaluations: Evaluation[];
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function EvaluationsTable({ evaluations, onRefresh, isRefreshing }: EvaluationsTableProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {
    setSelectedEvaluation(null);
    setIsDialogOpen(true);
  };

  const handleView = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setIsDetailDialogOpen(true);
  };

  const handleSubmit = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres enviar esta evaluación para revisión?')) {
      return;
    }

    try {
      await evaluationsApi.submit(id);
      onRefresh();
    } catch (error) {
      console.error('Error al enviar evaluación:', error);
      alert('Error al enviar evaluación');
    }
  };

  const handleFinalize = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres finalizar esta evaluación? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await evaluationsApi.finalize(id);
      onRefresh();
    } catch (error) {
      console.error('Error al finalizar evaluación:', error);
      alert('Error al finalizar evaluación');
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'submitted': return 'default';
      case 'reviewed': return 'outline';
      case 'finalized': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Borrador';
      case 'submitted': return 'Enviada';
      case 'reviewed': return 'Revisada';
      case 'finalized': return 'Finalizada';
      default: return status;
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
                Nueva Evaluación
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nueva Evaluación</DialogTitle>
                <DialogDescription>
                  Crea una nueva evaluación de performance para un empleado
                </DialogDescription>
              </DialogHeader>
              <EvaluationForm
                onSubmit={async (data) => {
                  setIsSubmitting(true);
                  try {
                    await evaluationsApi.create(data);
                    setIsDialogOpen(false);
                    onRefresh();
                  } catch (error) {
                    console.error('Error al crear evaluación:', error);
                    alert('Error al crear evaluación');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                onCancel={() => setIsDialogOpen(false)}
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
              <TableHead>Período</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Empleado</TableHead>
              <TableHead>Evaluador</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {evaluations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No hay evaluaciones registradas
                </TableCell>
              </TableRow>
            ) : (
              evaluations.map((evaluation) => (
                <TableRow key={evaluation.id}>
                  <TableCell>
                    {formatDate(evaluation.periodStart)} - {formatDate(evaluation.periodEnd)}
                  </TableCell>
                  <TableCell>
                    {evaluation.periodType === 'monthly' ? 'Mensual' :
                     evaluation.periodType === 'quarterly' ? 'Trimestral' : 'Anual'}
                  </TableCell>
                  <TableCell>ID: {evaluation.userId}</TableCell>
                  <TableCell>ID: {evaluation.evaluatorId}</TableCell>
                  <TableCell>
                    {evaluation.overallScore !== null && evaluation.overallScore !== undefined
                      ? `${Number(evaluation.overallScore).toFixed(2)}%`
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(evaluation.status)}>
                      {getStatusLabel(evaluation.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(evaluation)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {evaluation.status === 'draft' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSubmit(evaluation.id)}
                          title="Enviar para revisión"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      {evaluation.status === 'reviewed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFinalize(evaluation.id)}
                          title="Finalizar evaluación"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedEvaluation && (
        <EvaluationDetailDialog
          evaluation={selectedEvaluation}
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
}

