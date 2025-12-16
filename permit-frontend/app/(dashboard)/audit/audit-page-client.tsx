'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RefreshCw, Eye, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { auditLogsApi, type AuditLog, type AuditLogsResponse } from '@/lib/api';

interface AuditPageClientProps {
  initialAuditLogs: AuditLogsResponse;
}

export function AuditPageClient({ initialAuditLogs }: AuditPageClientProps) {
  const [auditLogs, setAuditLogs] = useState<AuditLogsResponse>(initialAuditLogs);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    action: '',
    entityType: '',
    userId: '',
    startDate: '',
    endDate: '',
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const filterParams: any = { limit: 100 };
      if (filters.action) filterParams.action = filters.action;
      if (filters.entityType) filterParams.entityType = filters.entityType;
      if (filters.userId) filterParams.userId = Number(filters.userId);
      if (filters.startDate) filterParams.startDate = filters.startDate;
      if (filters.endDate) filterParams.endDate = filters.endDate;

      const data = await auditLogsApi.getAll(filterParams);
      setAuditLogs(data);
    } catch (error) {
      console.error('Error al actualizar logs:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDetailDialogOpen(true);
  };

  const handleExport = () => {
    const csv = [
      ['ID', 'Usuario', 'Acción', 'Tipo Entidad', 'ID Entidad', 'IP', 'Fecha'].join(','),
      ...auditLogs.logs.map(log => [
        log.id,
        log.userId || 'Sistema',
        log.action,
        log.entityType,
        log.entityId || '',
        log.ipAddress || '',
        new Date(log.createdAt).toISOString(),
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create': return 'default';
      case 'update': return 'secondary';
      case 'delete': return 'destructive';
      case 'approve': return 'default';
      case 'reject': return 'outline';
      default: return 'outline';
    }
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Registro de todas las acciones realizadas en el sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 p-4 border rounded-md bg-muted/50">
        <div className="space-y-2">
          <Label htmlFor="action">Acción</Label>
          <Select
            value={filters.action || undefined}
            onValueChange={(value) => setFilters({ ...filters, action: value === 'all' ? '' : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="create">Crear</SelectItem>
              <SelectItem value="update">Actualizar</SelectItem>
              <SelectItem value="delete">Eliminar</SelectItem>
              <SelectItem value="approve">Aprobar</SelectItem>
              <SelectItem value="reject">Rechazar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="entityType">Tipo de Entidad</Label>
          <Input
            id="entityType"
            value={filters.entityType}
            onChange={(e) => setFilters({ ...filters, entityType: e.target.value })}
            placeholder="Ej: users, roles"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="userId">Usuario ID</Label>
          <Input
            id="userId"
            type="number"
            value={filters.userId}
            onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
            placeholder="ID de usuario"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Fecha Inicio</Label>
          <Input
            id="startDate"
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Fecha Fin</Label>
          <Input
            id="endDate"
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Acción</TableHead>
              <TableHead>Tipo Entidad</TableHead>
              <TableHead>ID Entidad</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No hay logs de auditoría
                </TableCell>
              </TableRow>
            ) : (
              auditLogs.logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.id}</TableCell>
                  <TableCell>{log.userId || 'Sistema'}</TableCell>
                  <TableCell>
                    <Badge variant={getActionBadgeVariant(log.action)}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.entityType}</TableCell>
                  <TableCell>{log.entityId || '-'}</TableCell>
                  <TableCell className="text-xs">{log.ipAddress || '-'}</TableCell>
                  <TableCell className="text-xs">{formatDate(log.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(log)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {auditLogs.pagination.hasMore && (
        <div className="text-center text-sm text-muted-foreground">
          Mostrando {auditLogs.logs.length} de {auditLogs.pagination.total} logs
        </div>
      )}

      {selectedLog && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalle del Log de Auditoría</DialogTitle>
              <DialogDescription>
                Información completa del registro de auditoría
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">ID</Label>
                  <p className="text-sm">{selectedLog.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Usuario</Label>
                  <p className="text-sm">{selectedLog.userId || 'Sistema'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Acción</Label>
                  <p className="text-sm">
                    <Badge variant={getActionBadgeVariant(selectedLog.action)}>
                      {selectedLog.action}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tipo de Entidad</Label>
                  <p className="text-sm">{selectedLog.entityType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">ID de Entidad</Label>
                  <p className="text-sm">{selectedLog.entityId || '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Fecha</Label>
                  <p className="text-sm">{formatDate(selectedLog.createdAt)}</p>
                </div>
                {selectedLog.ipAddress && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">IP</Label>
                    <p className="text-sm">{selectedLog.ipAddress}</p>
                  </div>
                )}
                {selectedLog.userAgent && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">User Agent</Label>
                    <p className="text-sm text-xs">{selectedLog.userAgent}</p>
                  </div>
                )}
              </div>

              {selectedLog.changes && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground mb-2 block">Cambios</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedLog.changes.before && (
                      <div>
                        <Label className="text-xs font-semibold mb-1 block">Antes</Label>
                        <pre className="text-xs p-3 bg-muted rounded-md overflow-auto max-h-48">
                          {JSON.stringify(selectedLog.changes.before, null, 2)}
                        </pre>
                      </div>
                    )}
                    {selectedLog.changes.after && (
                      <div>
                        <Label className="text-xs font-semibold mb-1 block">Después</Label>
                        <pre className="text-xs p-3 bg-muted rounded-md overflow-auto max-h-48">
                          {JSON.stringify(selectedLog.changes.after, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedLog.metadata && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground mb-2 block">Metadata</Label>
                  <pre className="text-xs p-3 bg-muted rounded-md overflow-auto max-h-48">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

