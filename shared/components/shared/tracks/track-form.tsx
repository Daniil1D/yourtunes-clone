"use client";

import React from "react";
import { Prisma } from "@prisma/client";
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

import { deleteTrack } from "@/app/actions";

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

export const TrackForm: React.FC<TrackFormProps> = ({ track }) => {
  const router = useRouter();

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
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6 hover:shadow-md transition-shadow">
      
      {/* 🎧 Плеер */}
      {track.audioFile?.url && (
        <audio
          controls
          src={track.audioFile.url}
          className="w-full rounded-lg"
        />
      )}

      {/* 🗑 Удаление */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="justify-start gap-2 w-full text-red-600 border-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Удалить трек
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить трек?</AlertDialogTitle>
            <AlertDialogDescription>
              Этот трек будет удалён навсегда. Отменить действие нельзя.
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
    </div>
  );
};
