'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { LeaveType, leaveTypesApi } from '@/lib/api';
import { toast } from '@/lib/toast';

interface LeaveTypeFormProps {
  leaveType?: LeaveType;
  onSuccess: () => void;
}

export function LeaveTypeForm({ leaveType, onSuccess }: LeaveTypeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: leaveType?.name || '',
    code: leaveType?.code || '',
    maxDaysPerYear: leaveType?.maxDaysPerYear?.toString() || '',
    carryOverAllowed: leaveType?.carryOverAllowed ?? false,
    requiresApproval: leaveType?.requiresApproval ?? true,
    color: leaveType?.color || '#3b82f6',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        name: formData.name,
        code: formData.code,
        maxDaysPerYear: formData.maxDaysPerYear ? Number(formData.maxDaysPerYear) : undefined,
        carryOverAllowed: formData.carryOverAllowed,
        requiresApproval: formData.requiresApproval,
        color: formData.color,
      };

      if (leaveType) {
        await leaveTypesApi.update(leaveType.id, data);
        toast.success('Tipo de ausencia actualizado exitosamente');
      } else {
        await leaveTypesApi.create(data);
        toast.success('Tipo de ausencia creado exitosamente');
      }

      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar tipo de ausencia');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: Vacaciones"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="code">Código</Label>
        <Input
          id="code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
          placeholder="Ej: VAC"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxDaysPerYear">Días Máximos por Año (opcional)</Label>
        <Input
          id="maxDaysPerYear"
          type="number"
          min="0"
          value={formData.maxDaysPerYear}
          onChange={(e) => setFormData({ ...formData, maxDaysPerYear: e.target.value })}
          placeholder="Ej: 20"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="carryOverAllowed">Acumulable</Label>
          <p className="text-sm text-muted-foreground">
            Permite acumular días no usados al año siguiente
          </p>
        </div>
        <Switch
          id="carryOverAllowed"
          checked={formData.carryOverAllowed}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, carryOverAllowed: checked })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="requiresApproval">Requiere Aprobación</Label>
          <p className="text-sm text-muted-foreground">
            Las solicitudes de este tipo requieren aprobación
          </p>
        </div>
        <Switch
          id="requiresApproval"
          checked={formData.requiresApproval}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, requiresApproval: checked })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
        <div className="flex gap-2">
          <Input
            id="color"
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-20 h-10"
          />
          <Input
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            placeholder="#3b82f6"
            className="flex-1"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? leaveType
              ? 'Actualizando...'
              : 'Creando...'
            : leaveType
            ? 'Actualizar'
            : 'Crear'}
        </Button>
      </div>
    </form>
  );
}

