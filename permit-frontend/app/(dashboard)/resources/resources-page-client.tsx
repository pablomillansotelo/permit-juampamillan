'use client';

import { useState } from 'react';
import { Resource, resourcesApi } from '@/lib/api';
import { ResourcesTable } from './resources-table';
import { TableSkeleton } from '@/components/table-skeleton';

interface ResourcesPageClientProps {
  initialResources: Resource[];
}

export function ResourcesPageClient({
  initialResources
}: ResourcesPageClientProps) {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const updatedResources = await resourcesApi.getAll();
      setResources(updatedResources);
    } catch (error) {
      console.error('Error al actualizar recursos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <TableSkeleton columns={5} rows={5} />;
  }

  return <ResourcesTable resources={resources} onRefresh={handleRefresh} />;
}

