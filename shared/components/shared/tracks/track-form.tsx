"use client";

import React, { useState } from "react";
import { Prisma } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm, FormProvider } from "react-hook-form";

import { FormInput } from "../form/form-input";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  Button,
} from "@/shared/components/ui";

import { deleteTrack, updateTrack } from "@/app/actions/index";

type TrackWithRelations = Prisma.TrackGetPayload<{
  include: {
    artists: true;
    feats: true;
    audioFile: true;
  };
}>;

interface TrackFormProps {
  track: TrackWithRelations;
  onCompleted?: () => void;
}

export const TrackForm: React.FC<TrackFormProps> = ({ track, onCompleted }) => {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(false);

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      title: track.title,
      artistName: track.artists?.[0]?.name || "",
    },
  });

  const { handleSubmit, formState } = methods;

  const onSubmit = async (data: any) => {
    const toastId = toast.loading("Сохраняем...");

    try {
      await updateTrack(track.id, data);
      toast.success("Сохранено ✅", { id: toastId });

      setIsCompleted(true);
      onCompleted?.();
    } catch {
      toast.error("Ошибка ❌", { id: toastId });
    }
  };

  const onDelete = async () => {
    const toastId = toast.loading("Удаляем трек...");

    try {
      await deleteTrack(track.id);
      toast.success("Трек удалён ✅", { id: toastId });
      router.refresh();
    } catch {
      toast.error("Ошибка при удалении ❌", { id: toastId });
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white border rounded-2xl p-6 space-y-6"
      >
        <FormInput
          name="title"
          placeholder="Название трека"
          rules={{ required: "Введите название" }}
        />

        <FormInput
          name="artistName"
          placeholder="Исполнитель"
          rules={{ required: "Введите исполнителя" }}
        />

        {track.audioFile?.url && (
          <audio
            controls
            src={track.audioFile.url}
            className="w-full rounded-lg"
          />
        )}

        <Button
          type="submit"
          disabled={!formState.isValid}
          className="w-full h-12 rounded-xl text-lg"
        >
          Готово
        </Button>

        {isCompleted && (
          <div className="text-green-600 text-center font-medium">
            ✔ Заполнено
          </div>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full text-red-600 border-red-600"
            >
              <Trash2 className="w-4 h-4" />
              Удалить трек
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить трек?</AlertDialogTitle>
              <AlertDialogDescription>
                Этот трек будет удалён навсегда.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </FormProvider>
  );
};