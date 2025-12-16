import { leaveRequestsApi, leaveTypesApi, type LeaveRequest, type LeaveType } from '@/lib/api-server';
import { AbsencesPageClient } from './absences-page-client';

export const dynamic = 'force-dynamic';

export default async function AbsencesPage() {
  let leaveRequests: LeaveRequest[] = [];
  let leaveTypes: LeaveType[] = [];
  
  try {
    [leaveRequests, leaveTypes] = await Promise.all([
      leaveRequestsApi.getAll(),
      leaveTypesApi.getAll(),
    ]);
  } catch (error) {
    console.error('Error fetching absences data:', error);
  }

  return (
    <AbsencesPageClient 
      initialLeaveRequests={leaveRequests}
      initialLeaveTypes={leaveTypes}
    />
  );
}

