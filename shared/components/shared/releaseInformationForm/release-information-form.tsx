"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";

import { ReleaseCoverUpload } from "./release-cover-upload";
import { ReleaseMainFields } from "./release-main-fields";
import { ReleaseCopyrightForm } from "./release-copyright-form";
import { ReleaseArtistsForm } from "./release-artists-form";


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
};

export const ReleaseInformationForm: React.FC<Props> = ({
  releaseId,
  defaultTitle,
  defaultArtist,
}) => {
  const methods = useForm<ReleaseInfoFormValues>({
    defaultValues: {
      title: defaultTitle,
      label: "",
      genre: "",
      version: "",
      artist: defaultArtist,
    },
    mode: "onChange",
  });

  const onSubmit = (data: ReleaseInfoFormValues) => {
    console.log("Release Info:", data);
  };

  return (
     <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-10"
      >
        {/* Основная информация */}
        <div className="rounded-3xl border bg-white shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10">
            <ReleaseCoverUpload />
            <ReleaseMainFields />
          </div>
        </div>

        {/* Авторское право */}
        <ReleaseCopyrightForm />

        {/* Исполнители */}
        <ReleaseArtistsForm />

        <Button type="submit" className="w-full h-14 text-lg rounded-xl">
          Сохранить информацию
        </Button>
      </form>
    </FormProvider>
  );
};
