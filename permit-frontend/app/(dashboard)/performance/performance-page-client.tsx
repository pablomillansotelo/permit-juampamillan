'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IndicatorsTable } from './indicators-table';
import { EvaluationsTable } from './evaluations-table';
import type { PerformanceIndicator, Evaluation } from '@/lib/api';

interface PerformancePageClientProps {
  initialIndicators: PerformanceIndicator[];
  initialEvaluations: Evaluation[];
}

export function PerformancePageClient({ 
  initialIndicators, 
  initialEvaluations 
}: PerformancePageClientProps) {
  const [indicators, setIndicators] = useState<PerformanceIndicator[]>(initialIndicators);
  const [evaluations, setEvaluations] = useState<Evaluation[]>(initialEvaluations);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Recargar datos desde el servidor
      const response = await fetch('/api/permit/v1/performance/indicators');
      const indicatorsData = await response.json();
      setIndicators(indicatorsData);

      const evaluationsResponse = await fetch('/api/permit/v1/performance/evaluations');
      const evaluationsData = await evaluationsResponse.json();
      setEvaluations(evaluationsData);
    } catch (error) {
      console.error('Error al actualizar datos:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue="indicators" className="w-full">
        <TabsList>
          <TabsTrigger value="indicators">Indicadores</TabsTrigger>
          <TabsTrigger value="evaluations">Evaluaciones</TabsTrigger>
        </TabsList>
        
        <TabsContent value="indicators" className="mt-4">
          <IndicatorsTable 
            indicators={indicators}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        </TabsContent>
        
        <TabsContent value="evaluations" className="mt-4">
          <EvaluationsTable 
            evaluations={evaluations}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

