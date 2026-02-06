"use client";

import react, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { updateTrack } from "@/app/actions";
import { Prisma } from "@prisma/client";
import { FormInput } from "../form/form-input";
import { deleteTrack } from '@/app/actions'
import { Trash2 } from "lucide-react";
import { useRouter } from 'next/navigation'
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
} from '@/shared/components/ui'

type TrackWithRelations = Prisma.TrackGetPayload<{
  include: {
    artists: true;
    feats: true;
    audioFile: true;
  };
}>;

interface TrackFormProps {
  track: TrackWithRelations;
}

export const TrackForm:React.FC<TrackFormProps> = ({ track }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const methods = useForm<{ title: string }>({
    defaultValues: {
      title: track.title,
    },
  });

  const onDelete = async () => {
    const toastId = toast.loading('Удаляем треклист...')

    try {
      await deleteTrack(track.id)
      toast.success('Треклист удалён', { id: toastId })
      router.refresh()
    } catch {
      toast.error('Ошибка при удалении', { id: toastId })
    }
  }

   const onSave = async (values: { title: string }) => {
    try {
      setLoading(true);
      await updateTrack(track.id, { title: values.title });
      toast.success("Трек обновлён");
      router.refresh(); // обновим данные
    } catch {
      toast.error("Ошибка при сохранении");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form className="border rounded-2xl p-6 space-y-4" onSubmit={methods.handleSubmit(onSave)}>

        {track.audioFile?.url && <audio controls src={track.audioFile.url} />}
        <FormInput name="title" placeholder="Название трека" />

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Сохраняем..." : "Сохранить"}
          </Button>
          {/* ...AlertDialog для удаления трека */}
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="secondary" className="justify-start gap-2">
              <Trash2 className="w-4 h-4" />
              Удалить
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Удалить треклист?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Треклист будет удалён навсегда.
                Это действие нельзя отменить.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>
                Отмена
              </AlertDialogCancel>
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
}
