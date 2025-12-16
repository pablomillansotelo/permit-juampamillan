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
import { LeaveRequest, LeaveType, leaveRequestsApi } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useState } from 'react';
import { ApproveRejectDialog } from './approve-reject-dialog';
// Formatear fecha sin date-fns
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

interface LeaveRequestsTableProps {
  leaveRequests: LeaveRequest[];
  leaveTypes: LeaveType[];
  onRefresh: () => void;
}

export function LeaveRequestsTable({ 
  leaveRequests, 
  leaveTypes,
  onRefresh 
}: LeaveRequestsTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const getLeaveTypeName = (leaveTypeId: number) => {
    const type = leaveTypes.find(t => t.id === leaveTypeId);
    return type?.name || 'N/A';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Aprobada</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rechazada</Badge>;
      case 'pending':
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
    }
  };

  const handleApprove = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setIsApproveDialogOpen(true);
  };

  const handleReject = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setIsRejectDialogOpen(true);
  };

  const handleActionComplete = () => {
    setIsApproveDialogOpen(false);
    setIsRejectDialogOpen(false);
    setSelectedRequest(null);
    onRefresh();
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Fecha Inicio</TableHead>
              <TableHead>Fecha Fin</TableHead>
              <TableHead>Días</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No hay solicitudes de ausencia
                </TableCell>
              </TableRow>
            ) : (
              leaveRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">Usuario #{request.userId}</TableCell>
                  <TableCell>{getLeaveTypeName(request.leaveTypeId)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {formatDate(request.startDate)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {formatDate(request.endDate)}
                    </div>
                  </TableCell>
                  <TableCell>{request.daysCount} días</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {request.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(request)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(request)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rechazar
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedRequest && (
        <>
          <ApproveRejectDialog
            request={selectedRequest}
            isOpen={isApproveDialogOpen}
            onClose={() => setIsApproveDialogOpen(false)}
            onSuccess={handleActionComplete}
            action="approve"
          />
          <ApproveRejectDialog
            request={selectedRequest}
            isOpen={isRejectDialogOpen}
            onClose={() => setIsRejectDialogOpen(false)}
            onSuccess={handleActionComplete}
            action="reject"
          />
        </>
      )}
    </>
  );
}

