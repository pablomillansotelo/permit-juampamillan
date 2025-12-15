'use client';

import { useEffect, useState } from 'react';
import { PermissionsProvider } from '@/lib/permissions';
import { User } from '@/lib/api';

interface PermissionsWrapperProps {
  children: React.ReactNode;
}

export function PermissionsWrapper({ children }: PermissionsWrapperProps) {
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const response = await fetch('/api/permit/user/me');
      if (response.ok) {
        const user: User = await response.json();
        setUserId(user.id);
      }
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <>{children}</>; // Render children mientras carga
  }

  return (
    <PermissionsProvider userId={userId}>
      {children}
    </PermissionsProvider>
  );
}

