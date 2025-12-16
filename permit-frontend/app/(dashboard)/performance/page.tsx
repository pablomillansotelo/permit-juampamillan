import { indicatorsApi, evaluationsApi, type PerformanceIndicator, type Evaluation } from '@/lib/api-server';
import { PerformancePageClient } from './performance-page-client';

export const dynamic = 'force-dynamic';

export default async function PerformancePage() {
  let indicators: PerformanceIndicator[] = [];
  let evaluations: Evaluation[] = [];
  
  try {
    [indicators, evaluations] = await Promise.all([
      indicatorsApi.getAll(),
      evaluationsApi.getAll(),
    ]);
  } catch (error) {
    console.error('Error fetching performance data:', error);
  }

  return (
    <PerformancePageClient 
      initialIndicators={indicators}
      initialEvaluations={evaluations}
    />
  );
}

