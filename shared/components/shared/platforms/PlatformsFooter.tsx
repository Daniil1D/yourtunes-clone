"use client";

import { Button } from "@/shared/components/ui/button";
import { savePlatforms } from "@/app/actions";
import { usePlatformsStore } from "@/shared/store/platforms-store";
import toast from "react-hot-toast";

export const PlatformsFooter = ({ releaseId }: { releaseId: string }) => {
  const { selectedIds } = usePlatformsStore();

  const onNext = async () => {
    if (!selectedIds.length) {
      toast.error("Выберите хотя бы одну платформу");
      return;
    }

    const toastId = toast.loading("Сохраняем платформы...");

    try {
      await savePlatforms(releaseId, selectedIds);
      toast.success("Платформы успешно сохранены", { id: toastId });
      // тут можешь сделать router.push(...) если нужно
    } catch (e) {
      toast.error("Ошибка при сохранении", { id: toastId });
    }
  };

  return (
    <Button
      className="w-full h-14 text-lg rounded-xl bg-black text-white"
      onClick={onNext}
    >
      Загрузить музыку
    </Button>
  );
};
