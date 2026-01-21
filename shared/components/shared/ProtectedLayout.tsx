"use client";

import React, { useEffect, useState } from "react";
import { getUserSession } from "@/shared/lib/get-user-session";
import { SideMenu } from "./side-menu";
import { AuthModal } from "./modals";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

export const ProtectedLayout: React.FC<Props> = ({ children }) => {
  const { data: session, status } = useSession();

  const [openAuthModal, setOpenAuthModal] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      const timer = setTimeout(() => setOpenAuthModal(true), 0);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <>
      <AuthModal open={openAuthModal} onClose={() => setOpenAuthModal(false)} />
      {session && (
        <main className="flex min-h-screen">
          <SideMenu />
          <div className="flex-1">{children}</div>
        </main>
      )}
    </>
  );
};
