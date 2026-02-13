"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function PaymentSuccessToast() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.has("paid")) {
      toast.success("Оплата прошла успешно 🎉");

      router.refresh();

      router.replace("/account");
    }
  }, []);

  return null;
}
