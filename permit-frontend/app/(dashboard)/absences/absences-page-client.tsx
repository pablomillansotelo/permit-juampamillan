'use client';

import { useState } from 'react';
import { LeaveRequest, LeaveType, leaveRequestsApi, leaveTypesApi } from '@/lib/api';
import { LeaveRequestsTable } from './leave-requests-table';
import { LeaveRequestForm } from './leave-request-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeaveTypesTable } from './leave-types-table';
import { LeaveTypeForm } from './leave-type-form';

interface AbsencesPageClientProps {
  initialLeaveRequests: LeaveRequest[];
  initialLeaveTypes: LeaveType[];
}

export function AbsencesPageClient({ 
  initialLeaveRequests, 
  initialLeaveTypes 
}: AbsencesPageClientProps) {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>(initialLeaveTypes);
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const [updatedRequests, updatedTypes] = await Promise.all([
        leaveRequestsApi.getAll(),
        leaveTypesApi.getAll(),
      ]);
      setLeaveRequests(updatedRequests);
      setLeaveTypes(updatedTypes);
    } catch (error) {
      console.error('Error al actualizar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestCreated = async () => {
    setIsRequestDialogOpen(false);
    await handleRefresh();
  };

  const handleTypeCreated = async () => {
    setIsTypeDialogOpen(false);
    await handleRefresh();
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardDescription>
                Administra solicitudes de ausencia y tipos de ausencia
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleRefresh}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="requests" className="w-full">
            <TabsList>
              <TabsTrigger value="requests">Solicitudes</TabsTrigger>
              <TabsTrigger value="types">Tipos de Ausencia</TabsTrigger>
            </TabsList>
            
            <TabsContent value="requests" className="mt-4">
              <div className="flex justify-end mb-4">
                <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Solicitud
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Nueva Solicitud de Ausencia</DialogTitle>
                    </DialogHeader>
                    <LeaveRequestForm 
                      leaveTypes={leaveTypes}
                      onSuccess={handleRequestCreated}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <LeaveRequestsTable 
                leaveRequests={leaveRequests}
                leaveTypes={leaveTypes}
                onRefresh={handleRefresh}
              />
            </TabsContent>

            <TabsContent value="types" className="mt-4">
              <div className="flex justify-end mb-4">
                <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Tipo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nuevo Tipo de Ausencia</DialogTitle>
                    </DialogHeader>
                    <LeaveTypeForm onSuccess={handleTypeCreated} />
                  </DialogContent>
                </Dialog>
              </div>
              <LeaveTypesTable 
                leaveTypes={leaveTypes}
                onRefresh={handleRefresh}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

