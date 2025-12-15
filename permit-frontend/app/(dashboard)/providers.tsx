'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { PermissionsWrapper } from './assignments/permissions-wrapper';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <PermissionsWrapper>
          {children}
        </PermissionsWrapper>
        <Toaster position="top-right" richColors />
      </TooltipProvider>
    </ThemeProvider>
  );
}
