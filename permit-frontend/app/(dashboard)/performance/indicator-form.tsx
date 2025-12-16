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
import { Switch } from '@/components/ui/switch';
import type { PerformanceIndicator, CreateIndicatorInput, UpdateIndicatorInput } from '@/lib/api';

interface IndicatorFormProps {
  indicator?: PerformanceIndicator | null;
  onSubmit: (data: CreateIndicatorInput | UpdateIndicatorInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function IndicatorForm({ indicator, onSubmit, onCancel, isSubmitting }: IndicatorFormProps) {
  const [formData, setFormData] = useState({
    name: indicator?.name || '',
    description: indicator?.description || '',
    type: indicator?.type || 'numeric' as 'numeric' | 'percentage' | 'boolean' | 'text',
    unit: indicator?.unit || '',
    targetValue: indicator?.targetValue?.toString() || '',
    weight: indicator?.weight?.toString() || '',
    category: indicator?.category || '',
    isActive: indicator?.isActive ?? true,
  });

  useEffect(() => {
    if (indicator) {
      setFormData({
        name: indicator.name,
        description: indicator.description || '',
        type: indicator.type,
        unit: indicator.unit || '',
        targetValue: indicator.targetValue?.toString() || '',
        weight: indicator.weight?.toString() || '',
        category: indicator.category || '',
        isActive: indicator.isActive,
      });
    }
  }, [indicator]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      description: formData.description || undefined,
      type: formData.type,
      unit: formData.unit || undefined,
      targetValue: formData.targetValue ? Number(formData.targetValue) : undefined,
      weight: formData.weight ? Number(formData.weight) : undefined,
      category: formData.category || undefined,
      isActive: formData.isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Ej: Ventas mensuales"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descripción del indicador"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="numeric">Numérico</SelectItem>
              <SelectItem value="percentage">Porcentaje</SelectItem>
              <SelectItem value="boolean">Booleano</SelectItem>
              <SelectItem value="text">Texto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Ej: Ventas, Calidad"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="targetValue">Valor Objetivo</Label>
          <Input
            id="targetValue"
            type="number"
            step="0.01"
            value={formData.targetValue}
            onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unidad</Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            placeholder="Ej: %, unidades"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="weight">Peso (para promedio ponderado)</Label>
        <Input
          id="weight"
          type="number"
          step="0.01"
          value={formData.weight}
          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
          placeholder="1.00"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label htmlFor="isActive">Indicador activo</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : indicator ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
}

