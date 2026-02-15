"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import { saveReleaseInformation } from "@/app/actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { ReleaseCoverUpload } from "../platforms/release-cover-upload";
import { ReleaseMainFields } from "./release-main-fields";
import { ReleaseCopyrightForm } from "./release-copyright-form";
import { ReleaseArtistsForm } from "./release-artists-form";
import { ReleasePublishDateForm } from "./release-publish-date-form";

interface Props {
  releaseId: string;
  defaultTitle: string;
  defaultArtist: string;
}

type ReleaseInfoFormValues = {
  title: string;
  label: string;
  genre: string;
  version: string;
  artist: string;
  publishDate: Date | null;
};

export const ReleaseInformationForm: React.FC<Props> = ({
  releaseId,
  defaultTitle,
  defaultArtist,
}) => {
  const router = useRouter();

  const methods = useForm<ReleaseInfoFormValues>({
    defaultValues: {
      title: defaultTitle,
      label: "",
      genre: "",
      version: "",
      artist: defaultArtist,
      publishDate: null,
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = methods;

  const onSubmit = async (data: ReleaseInfoFormValues) => {
    try {
      await saveReleaseInformation(releaseId, data);
      toast.success("Информация о релизе сохранена");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("Ошибка при сохранении релиза");
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-10">
        <div className="rounded-3xl border bg-white shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10">
            <ReleaseMainFields />
          </div>
        </div>

        <ReleaseCopyrightForm />

        <ReleaseArtistsForm />

        <ReleasePublishDateForm />

        <Button
          type="submit"
          className="w-full h-14 text-lg rounded-xl"
          disabled={!isValid || isSubmitting}
        >
          Сохранить информацию
        </Button>
      </form>
    </FormProvider>
  );
};
