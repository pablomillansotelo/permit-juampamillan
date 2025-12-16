import { notificationsApi, type Notification } from '@/lib/api-server';
import { NotificationsPageClient } from './notifications-page-client';

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
  // TODO: Obtener userId del session cuando esté disponible
  const userId = 1; // Temporal
  
  let notifications: Notification[] = [];
  
  try {
    notifications = await notificationsApi.getAll(userId);
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }

  return (
    <NotificationsPageClient 
      initialNotifications={notifications}
      userId={userId}
    />
  );
}

