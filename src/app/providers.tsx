'use client';

import { ReactNode } from 'react';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { DataProvider } from '@/contexts/DataContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AdminAuthProvider>
      <DataProvider>
        {children}
      </DataProvider>
    </AdminAuthProvider>
  );
}
