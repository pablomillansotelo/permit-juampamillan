import { Resource, resourcesApi } from '@/lib/api-server';
import { ResourcesPageClient } from './resources-page-client';

export default async function ResourcesPage() {
  let resources: Resource[] = [];
  try {
    resources = await resourcesApi.getAll();
  } catch (error) {
    console.error('Error fetching resources:', error);
  }

  return (
    <ResourcesPageClient initialResources={resources} />
  );
}

