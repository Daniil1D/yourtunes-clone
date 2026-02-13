import { SideMenu } from "@/shared/components/shared";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "yourtunes-clone",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex">
      <Suspense>
        <SideMenu />
      </Suspense>

      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-5xl px-6">{children}</div>
      </div>
    </main>
  );
}
