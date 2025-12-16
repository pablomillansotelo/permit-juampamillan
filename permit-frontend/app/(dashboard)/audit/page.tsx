import { auditLogsApi, type AuditLogsResponse } from '@/lib/api-server';
import { AuditPageClient } from './audit-page-client';

export const dynamic = 'force-dynamic';

export default async function AuditPage() {
  let auditLogs: AuditLogsResponse = {
    logs: [],
    pagination: {
      total: 0,
      limit: 100,
      offset: 0,
      hasMore: false,
    },
  };
  
  try {
    auditLogs = await auditLogsApi.getAll({ limit: 100 });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
  }

  return (
    <AuditPageClient 
      initialAuditLogs={auditLogs}
    />
  );
}

