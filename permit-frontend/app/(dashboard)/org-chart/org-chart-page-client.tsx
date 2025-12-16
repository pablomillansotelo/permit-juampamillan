'use client';

import { useState } from 'react';
import { OrgChartNode, orgChartApi } from '@/lib/api';
import { OrgChartTree } from './org-chart-tree';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface OrgChartPageClientProps {
  initialData: OrgChartNode[];
}

export function OrgChartPageClient({ initialData }: OrgChartPageClientProps) {
  const [orgChart, setOrgChart] = useState<OrgChartNode[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const updatedData = await orgChartApi.getFull();
      setOrgChart(updatedData);
    } catch (error) {
      console.error('Error al actualizar organigrama:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardDescription>
                Visualización jerárquica de la estructura organizacional
              </CardDescription>
            </div>
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
        </CardHeader>
        <CardContent>
          {orgChart.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay datos de organigrama disponibles. Asegúrate de que los usuarios tengan asignados sus managers.
            </div>
          ) : (
            <div className="overflow-auto">
              <OrgChartTree nodes={orgChart} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

