"use client";

import React, { useState } from 'react'
import { Button } from "@/shared/components/ui/button";
import { savePlatforms } from "@/app/actions/index";
import { usePlatformsStore } from "@/shared/store/platforms-store";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Spinner } from "@/shared/components/shared/spinner";   

export const PlatformsFooter = ({ releaseId }: { releaseId: string }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const { selectedIds } = usePlatformsStore();

  const onNext = async () => {
    if (!selectedIds.length) {
      toast.error("Выберите хотя бы одну платформу");
      return;
    }

    setLoading(true)
    const toastId = toast.loading("Сохраняем платформы...");

    try {
      await savePlatforms(releaseId, selectedIds);
      toast.success("Платформы успешно сохранены", { id: toastId });
      router.push(`/releases/${releaseId}/upload`)
    } catch (e) {
      toast.error("Ошибка при сохранении", { id: toastId });
    } finally {
      setLoading(false)
    }
  };

  return (
    <Button
      className="w-full h-14 text-lg rounded-xl bg-black text-white"
      onClick={onNext}
      disabled={loading}
    >
      {loading ? <Spinner /> : "Сохранить"}
    </Button>
  );
};
