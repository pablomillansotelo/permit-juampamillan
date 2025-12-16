'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usersApi, indicatorsApi, type User, type PerformanceIndicator, type CreateEvaluationInput } from '@/lib/api';

interface EvaluationFormProps {
  onSubmit: (data: CreateEvaluationInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function EvaluationForm({ onSubmit, onCancel, isSubmitting }: EvaluationFormProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [indicators, setIndicators] = useState<PerformanceIndicator[]>([]);
  const [formData, setFormData] = useState({
    userId: '',
    evaluatorId: '',
    periodType: 'monthly' as 'monthly' | 'quarterly' | 'annual',
    periodStart: '',
    periodEnd: '',
    comments: '',
  });
  const [scores, setScores] = useState<Array<{
    indicatorId: number;
    value: number;
    targetValue?: number;
    notes?: string;
  }>>([]);

  useEffect(() => {
    Promise.all([
      usersApi.getAll(),
      indicatorsApi.getAll(true), // Solo activos
    ]).then(([usersData, indicatorsData]) => {
      setUsers(usersData);
      setIndicators(indicatorsData);
      // Inicializar scores con todos los indicadores activos
      setScores(indicatorsData.map(ind => ({
        indicatorId: ind.id,
        value: 0,
        targetValue: ind.targetValue ? Number(ind.targetValue) : undefined,
        notes: '',
      })));
    }).catch(console.error);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      userId: Number(formData.userId),
      evaluatorId: Number(formData.evaluatorId),
      periodType: formData.periodType,
      periodStart: formData.periodStart,
      periodEnd: formData.periodEnd,
      comments: formData.comments || undefined,
      scores: scores.filter(s => s.value > 0), // Solo enviar scores con valor
    });
  };

  const updateScore = (indicatorId: number, field: 'value' | 'targetValue' | 'notes', value: string | number) => {
    setScores(prev => prev.map(score => 
      score.indicatorId === indicatorId
        ? { ...score, [field]: value }
        : score
    ));
  };

  const getIndicator = (indicatorId: number) => {
    return indicators.find(ind => ind.id === indicatorId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="userId">Empleado *</Label>
          <Select
            value={formData.userId}
            onValueChange={(value) => setFormData({ ...formData, userId: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar empleado" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.name} ({user.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="evaluatorId">Evaluador *</Label>
          <Select
            value={formData.evaluatorId}
            onValueChange={(value) => setFormData({ ...formData, evaluatorId: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar evaluador" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.name} ({user.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="periodType">Tipo de Período *</Label>
          <Select
            value={formData.periodType}
            onValueChange={(value) => setFormData({ ...formData, periodType: value as any })}
            required
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Mensual</SelectItem>
              <SelectItem value="quarterly">Trimestral</SelectItem>
              <SelectItem value="annual">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="periodStart">Fecha Inicio *</Label>
          <Input
            id="periodStart"
            type="date"
            value={formData.periodStart}
            onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="periodEnd">Fecha Fin *</Label>
          <Input
            id="periodEnd"
            type="date"
            value={formData.periodEnd}
            onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments">Comentarios</Label>
        <Textarea
          id="comments"
          value={formData.comments}
          onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
          placeholder="Comentarios generales sobre la evaluación"
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <Label>Scores por Indicador</Label>
        <div className="space-y-3 max-h-96 overflow-y-auto border rounded-md p-4">
          {scores.map((score) => {
            const indicator = getIndicator(score.indicatorId);
            if (!indicator) return null;

            return (
              <div key={indicator.id} className="space-y-2 p-3 border rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-semibold">{indicator.name}</Label>
                    {indicator.description && (
                      <p className="text-sm text-muted-foreground">{indicator.description}</p>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {indicator.unit || ''} {indicator.targetValue && `(Objetivo: ${indicator.targetValue})`}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Valor</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={score.value}
                      onChange={(e) => updateScore(indicator.id, 'value', Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  {indicator.targetValue && (
                    <div className="space-y-1">
                      <Label className="text-xs">Valor Objetivo</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={score.targetValue || indicator.targetValue}
                        onChange={(e) => updateScore(indicator.id, 'targetValue', Number(e.target.value))}
                        placeholder={indicator.targetValue.toString()}
                      />
                    </div>
                  )}
                  <div className="space-y-1">
                    <Label className="text-xs">Notas</Label>
                    <Input
                      value={score.notes || ''}
                      onChange={(e) => updateScore(indicator.id, 'notes', e.target.value)}
                      placeholder="Notas opcionales"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creando...' : 'Crear Evaluación'}
        </Button>
      </div>
    </form>
  );
}

