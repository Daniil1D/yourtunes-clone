import { SideMenu } from '@/shared/components/shared';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'yourtunes-clone',
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex">
       <Suspense>
          <SideMenu />
        </Suspense>
        {children}
    </main>
  );
}
