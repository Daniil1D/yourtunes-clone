"use client";

import { useForm, FormProvider } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { Prisma } from "@prisma/client";


import { PlatformsDropdown } from "./platforms-dropdown";
import { Button } from "@/shared/components/ui/button";
import { useRouter } from "next/navigation";
import { ReleaseCoverUpload } from "../releaseInformationForm/release-cover-upload";

type ReleaseFull = Prisma.ReleaseGetPayload<{
  include: {
    artist: true;
    platforms: {
      include: {
        platform: true;
      };
    };
  };
}>;

interface Props {
  id: string;
  release: ReleaseFull;
  platforms: {
    id: string;
    name: string;
    logo?: string | null;
  }[];
}

type FormValues = {
  title: string;
  artistName: string;
  platformIds: string[];
};

export const ReleaseMainForm = ({ id, release, platforms }: Props) => {
  const router = useRouter();

  const selectedPlatformIds = release.platforms.map((p) => p.platformId);

  const methods = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      title:"",
      artistName: "",
      platformIds: selectedPlatformIds,
    },
  });

  const {
    formState: { isValid },
  } = methods;

  const onNext = async () => {
    const values = methods.getValues();

    try {
      await axios.patch("/api/release/update", {
        releaseId: release.id,
        title: values.title,
        artistName: values.artistName,
        platformIds: values.platformIds,
      });

      toast.success("Сохранено ✅");
    } catch {
      toast.error("Ошибка ❌");
    }
    router.push(`/releases/${id}/upload`);
  };

  return (
    <FormProvider {...methods}>
      <form className="bg-white border rounded-2xl shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-bold">Основная информация</h2>

        <PlatformsDropdown platforms={platforms} name="platformIds" />

        <Button
          type="button"
          className="w-full text-lg py-6 rounded-xl"
          disabled={!isValid}
          onClick={onNext}
        >
          Далее → Загрузка аудио
        </Button>
      </form>
    </FormProvider>
  );
};
