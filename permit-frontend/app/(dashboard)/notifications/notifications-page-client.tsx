'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCheck, Bell, BellOff } from 'lucide-react';
import { NotificationItem } from '@/components/notifications/notification-item';
import { notificationsApi, type Notification } from '@/lib/api';

interface NotificationsPageClientProps {
  initialNotifications: Notification[];
  userId: number;
}

export function NotificationsPageClient({ 
  initialNotifications, 
  userId 
}: NotificationsPageClientProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await notificationsApi.getAll(userId, { 
        unreadOnly: showUnreadOnly 
      });
      setNotifications(data);
    } catch (error) {
      console.error('Error al actualizar notificaciones:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead(userId);
      await handleRefresh();
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationsApi.markAsRead(id, userId);
      await handleRefresh();
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.readAt).length;
  const displayedNotifications = showUnreadOnly 
    ? notifications.filter(n => !n.readAt)
    : notifications;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notificaciones</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 
              ? `${unreadCount} no leída${unreadCount > 1 ? 's' : ''}`
              : 'Todas las notificaciones están leídas'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
          >
            {showUnreadOnly ? (
              <>
                <BellOff className="h-4 w-4 mr-2" />
                Mostrar todas
              </>
            ) : (
              <>
                <Bell className="h-4 w-4 mr-2" />
                Solo no leídas
              </>
            )}
          </Button>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Marcar todas como leídas
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        {displayedNotifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {showUnreadOnly 
              ? 'No hay notificaciones no leídas'
              : 'No hay notificaciones'}
          </div>
        ) : (
          <div className="divide-y">
            {displayedNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={() => handleMarkAsRead(notification.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

