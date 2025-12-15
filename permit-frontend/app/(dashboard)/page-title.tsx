'use client';

import { usePathname } from 'next/navigation';

export function PageTitle() {
  const pathname = usePathname();
  
  const pageTitles: Record<string, string> = {
    '/': 'Dashboard',
    '/users': 'Usuarios',
    '/roles': 'Roles',
    '/resources': 'Recursos',
    '/permissions': 'Permisos',
    '/assignments': 'Asignaciones',
    '/settings': 'Configuración'
  };
  
  const title = pageTitles[pathname] || 'Dashboard';
  
  return (
    <h1 className="font-semibold text-lg md:text-xl hidden md:block">
      {title}
    </h1>
  );
}

