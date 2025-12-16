'use client';

import { useState, useEffect } from 'react';
import * as React from 'react';
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
import { LeaveType, leaveRequestsApi, usersApi, type User } from '@/lib/api';
import { toast } from '@/lib/toast';

interface LeaveRequestFormProps {
  leaveTypes: LeaveType[];
  onSuccess: () => void;
}

export function LeaveRequestForm({ leaveTypes, onSuccess }: LeaveRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    userId: '',
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  // Cargar usuarios cuando se abre el formulario
  useEffect(() => {
    usersApi.getAll().then(setUsers).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await leaveRequestsApi.create({
        userId: Number(formData.userId),
        leaveTypeId: Number(formData.leaveTypeId),
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason || undefined,
      });

      toast.success('Solicitud de ausencia creada exitosamente');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Error al crear solicitud de ausencia');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="userId">Usuario</Label>
        <Select
          value={formData.userId}
          onValueChange={(value) => setFormData({ ...formData, userId: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un usuario" />
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
        <Label htmlFor="leaveTypeId">Tipo de Ausencia</Label>
        <Select
          value={formData.leaveTypeId}
          onValueChange={(value) => setFormData({ ...formData, leaveTypeId: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un tipo" />
          </SelectTrigger>
          <SelectContent>
            {leaveTypes.map((type) => (
              <SelectItem key={type.id} value={type.id.toString()}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Fecha de Inicio</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Fecha de Fin</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Motivo (opcional)</Label>
        <Textarea
          id="reason"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creando...' : 'Crear Solicitud'}
        </Button>
      </div>
    </form>
  );
}

