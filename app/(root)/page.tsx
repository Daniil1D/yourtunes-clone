'use client'

import React from "react";
import { AuthModal } from "@/shared/components/shared/modals";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { ProfileButton } from "@/shared/components/shared/profile-button";



export default function Home() {
  const router = useRouter();
  const [openAuthModal, setOpenAuthModal] = React.useState(false);
  const searchParams = useSearchParams();
  
  React.useEffect(() => {
    let toastMessage = '';

    if (searchParams.has('paid')) {
        toastMessage = 'Заказ успешно оплачен!';
    }

    if (toastMessage) {
      setTimeout(() => {
        router.replace('/');
        toast.success(toastMessage, {
          duration: 3000,
        });
      }, 1000)
    }
  }, [])

  return (
    <div className="mt-8">
      <AuthModal open={openAuthModal} onClose={() => setOpenAuthModal(false)} />

      <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} />
    </div>
  );
}
