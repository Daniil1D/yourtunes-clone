"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SideMenu } from "./side-menu";

interface Props {
  children: React.ReactNode;
}

export const ProtectedLayout: React.FC<Props> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") return null;
  if (!session?.user?.id) return null;

  return (
    <main className="flex min-h-screen">
      <SideMenu />
      <div className="flex-1">{children}</div>
    </main>
  );
};
