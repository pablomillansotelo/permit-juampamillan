'use client';

import { useState, useEffect } from 'react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LeaveRequest, leaveRequestsApi, usersApi, type User } from '@/lib/api';
import { toast } from '@/lib/toast';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ApproveRejectDialogProps {
  request: LeaveRequest;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  action: 'approve' | 'reject';
}

export function ApproveRejectDialog({
  request,
  isOpen,
  onClose,
  action,
  onSuccess,
}: ApproveRejectDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [approvedBy, setApprovedBy] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // Cargar usuarios al montar
  useEffect(() => {
    usersApi.getAll().then(setUsers).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (action === 'approve') {
        await leaveRequestsApi.approve(request.id, {
          approvedBy: Number(approvedBy),
        });
        toast.success('Solicitud aprobada exitosamente');
      } else {
        if (!rejectionReason.trim()) {
          toast.error('Debes proporcionar un motivo de rechazo');
          setIsSubmitting(false);
          return;
        }
        await leaveRequestsApi.reject(request.id, {
          approvedBy: Number(approvedBy),
          rejectionReason: rejectionReason,
        });
        toast.success('Solicitud rechazada');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || `Error al ${action === 'approve' ? 'aprobar' : 'rechazar'} solicitud`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === 'approve' ? 'Aprobar Solicitud' : 'Rechazar Solicitud'}
          </DialogTitle>
          <DialogDescription>
            {action === 'approve'
              ? 'Confirma la aprobación de esta solicitud de ausencia'
              : 'Proporciona el motivo del rechazo de esta solicitud'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="approvedBy">Aprobado por</Label>
            <Select
              value={approvedBy}
              onValueChange={setApprovedBy}
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

          {action === 'reject' && (
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">Motivo del Rechazo</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explica el motivo del rechazo..."
                required
                rows={4}
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant={action === 'approve' ? 'default' : 'destructive'}
            >
              {action === 'approve' ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Aprobando...' : 'Aprobar'}
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Rechazando...' : 'Rechazar'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

