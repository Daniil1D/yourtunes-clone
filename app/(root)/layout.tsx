import { SideMenu } from '@/shared/components/shared';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'yourtunes-clone',
};

export default function HomeLayout({
  children,
  modal,
}: Readonly<{ 
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen flex">
      <Suspense>
        <SideMenu />
      </Suspense>
      {children}
      {modal}
    </main>
  );
}
