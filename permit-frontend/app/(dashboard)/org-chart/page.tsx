import { orgChartApi, type OrgChartNode } from '@/lib/api-server';
import { OrgChartPageClient } from './org-chart-page-client';

export const dynamic = 'force-dynamic';

export default async function OrgChartPage() {
  let orgChart: OrgChartNode[] = [];
  try {
    orgChart = await orgChartApi.getFull();
  } catch (error) {
    console.error('Error fetching org chart:', error);
  }

  return (
    <OrgChartPageClient initialData={orgChart} />
  );
}

