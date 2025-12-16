'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Send, CheckCircle } from 'lucide-react';
import { evaluationsApi, type Evaluation } from '@/lib/api';
// Función helper para formatear fechas
const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

interface EvaluationDetailDialogProps {
  evaluation: Evaluation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh: () => void;
}

export function EvaluationDetailDialog({
  evaluation,
  open,
  onOpenChange,
  onRefresh,
}: EvaluationDetailDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!confirm('¿Estás seguro de que quieres enviar esta evaluación para revisión?')) {
      return;
    }

    setIsSubmitting(true);
    try {
      await evaluationsApi.submit(evaluation.id);
      onRefresh();
      onOpenChange(false);
    } catch (error) {
      console.error('Error al enviar evaluación:', error);
      alert('Error al enviar evaluación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalize = async () => {
    if (!confirm('¿Estás seguro de que quieres finalizar esta evaluación? Esta acción no se puede deshacer.')) {
      return;
    }

    setIsSubmitting(true);
    try {
      await evaluationsApi.finalize(evaluation.id);
      onRefresh();
      onOpenChange(false);
    } catch (error) {
      console.error('Error al finalizar evaluación:', error);
      alert('Error al finalizar evaluación');
    } finally {
      setIsSubmitting(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalle de Evaluación</DialogTitle>
          <DialogDescription>
            Información completa de la evaluación de performance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Período</label>
              <p className="text-sm">
                {formatDate(evaluation.periodStart)} - {formatDate(evaluation.periodEnd)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tipo</label>
              <p className="text-sm">
                {evaluation.periodType === 'monthly' ? 'Mensual' :
                 evaluation.periodType === 'quarterly' ? 'Trimestral' : 'Anual'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Empleado ID</label>
              <p className="text-sm">{evaluation.userId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Evaluador ID</label>
              <p className="text-sm">{evaluation.evaluatorId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Estado</label>
              <div className="mt-1">
                <Badge variant={getStatusBadgeVariant(evaluation.status)}>
                  {getStatusLabel(evaluation.status)}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Score General</label>
              <p className="text-sm font-semibold">
                {evaluation.overallScore !== null && evaluation.overallScore !== undefined
                  ? `${Number(evaluation.overallScore).toFixed(2)}%`
                  : 'No calculado'}
              </p>
            </div>
          </div>

          {evaluation.comments && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Comentarios</label>
              <p className="text-sm mt-1 p-3 bg-muted rounded-md">{evaluation.comments}</p>
            </div>
          )}

          {evaluation.scores && evaluation.scores.length > 0 && (
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Scores por Indicador</label>
              <div className="space-y-2">
                {evaluation.scores.map((score) => (
                  <div key={score.id} className="p-3 border rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Indicador ID: {score.indicatorId}</p>
                        {score.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{score.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          Valor: <span className="font-semibold">{score.value}</span>
                        </p>
                        {score.targetValue && (
                          <p className="text-sm">
                            Objetivo: <span className="font-semibold">{score.targetValue}</span>
                          </p>
                        )}
                        {score.achievementPercentage && (
                          <p className="text-sm">
                            Logro: <span className="font-semibold">{Number(score.achievementPercentage).toFixed(2)}%</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            {evaluation.status === 'draft' && (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                variant="default"
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar para Revisión
              </Button>
            )}
            {evaluation.status === 'reviewed' && (
              <Button
                onClick={handleFinalize}
                disabled={isSubmitting}
                variant="default"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Finalizar Evaluación
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

