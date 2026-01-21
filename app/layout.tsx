'use client'

import React from "react";
import { Nunito } from "next/font/google";

import "./globals.css";
import { Providers } from "@/shared/components/shared/";
import { ProtectedLayout } from "@/shared/components/shared/ProtectedLayout";

const nunito = Nunito({ 
  subsets: ['cyrillic'],
  variable: '--font-nunito',
  weight: ['400','500','600','700','800','900']
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <Providers>
          <ProtectedLayout>{children}</ProtectedLayout>
        </Providers>
      </body>
    </html>
  );
}
