"use client";

import react, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { updateTrack, upsertTrackArtist } from "@/app/actions";
import { Prisma } from "@prisma/client";
import { FormInput } from "../form/form-input";
import { deleteTrack } from "@/app/actions";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
import { Spinner } from "../spinner";

type TrackWithRelations = Prisma.TrackGetPayload<{
  include: {
    artists: true;
    feats: true;
    audioFile: true;
  };
}>;

type TrackFormValues = {
  title: string;
  artist: string;
};

interface TrackFormProps {
  track: TrackWithRelations;
}

export const TrackForm: React.FC<TrackFormProps> = ({ track }) => {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(track.status === "READY");

  const methods = useForm<TrackFormValues>({
    mode: "onChange",
    defaultValues: {
      title: track.title ?? "",
      artist: track.artists?.[0]?.name ?? "",
    },
  });

  const { isValid } = methods.formState;

  useEffect(() => {
    if (done && !isValid) {
      setDone(false);
    }
  }, [done, isValid]);

  const onDelete = async () => {
    const toastId = toast.loading("Удаляем треклист...");

    try {
      await deleteTrack(track.id);
      toast.success("Треклист удалён", { id: toastId });
      router.refresh();
    } catch {
      toast.error("Ошибка при удалении", { id: toastId });
    }
  };

  const onMarkReady = methods.handleSubmit(async (values) => {
    const { title, artist } = values;

    try {
      setSaving(true);

      await updateTrack(track.id, {
        title,
        status: "READY",
      });

      await upsertTrackArtist(track.id, artist);

      setDone(true);
      toast.success("Трек заполнен");
      router.refresh();
    } finally {
      setSaving(false);
    }
  });


  const onAutosave = methods.handleSubmit(async (values) => {
    const { title, artist } = values;

    try {
      setSaving(true);
      await updateTrack(track.id, { title });
      await upsertTrackArtist(track.id, artist);
    } finally {
      setSaving(false);
    }
  });

   return (
    <FormProvider {...methods}>
      <form className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6 hover:shadow-md transition-shadow">
        {track.audioFile?.url && <audio controls src={track.audioFile.url} className="w-full rounded-lg" />}

        <div className="space-y-2">
          <FormInput
            name="title"
            placeholder="Название трека"
            rules={{ required: "Введите название трека" }}
            rightSlot={saving && <Spinner />}
            onBlur={() => {
              const value = methods.getValues("title");
              updateTrack(track.id, { title: value });
            }}
          />
        </div>


        <div className="space-y-2">
          <FormInput
            name="artist"
            placeholder="Введите название артиста"
            rules={{ required: "Введите артиста" }}
            rightSlot={saving && <Spinner />}
            onBlur={() => {
              const value = methods.getValues("artist");
              upsertTrackArtist(track.id, value);
            }}
          />
        </div>


        <div className="flex gap-2">
          {!done && (
            <Button
              type="button"
              disabled={saving || !isValid}
              onClick={onMarkReady}
              className="w-full"
            >
              Готово
            </Button>
          )}
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="justify-start gap-2 w-full text-red-600 border-red-600 hover:bg-red-50">
              <Trash2 className="w-4 h-4" />
              Удалить
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить треклист?</AlertDialogTitle>
              <AlertDialogDescription>
                Треклист будет удалён навсегда. Это действие нельзя отменить.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {done && (
          <div className="flex items-center gap-2 text-green-600 font-medium">
            ✔ Заполнено
          </div>
        )}
      </form>
    </FormProvider>
  );
};