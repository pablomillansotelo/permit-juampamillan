/**
 * Eventos para notificar cambios en permisos
 * Permite que los componentes se actualicen automáticamente cuando cambian las asignaciones
 */

'use client';

import { useEffect } from 'react';

const PERMISSIONS_UPDATED_EVENT = 'permissions-updated';

/**
 * Dispara un evento cuando se actualizan los permisos
 * Esto notifica a todos los componentes que escuchan para que refresquen sus permisos
 */
export function notifyPermissionsUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PERMISSIONS_UPDATED_EVENT));
  }
}

/**
 * Hook para escuchar cambios en permisos
 */
export function usePermissionsListener(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => {}; // No-op cleanup
  }

  useEffect(() => {
    const handleUpdate = () => {
      callback();
    };

    window.addEventListener(PERMISSIONS_UPDATED_EVENT, handleUpdate);
    
    return () => {
      window.removeEventListener(PERMISSIONS_UPDATED_EVENT, handleUpdate);
    };
  }, [callback]);
}

