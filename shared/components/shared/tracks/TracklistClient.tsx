"use client";

import { useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Prisma } from "@prisma/client";
import { TrackForm } from "./TrackForm";
import { TracklistActions } from "./TracklistActions";

type TrackWithRelations = Prisma.TrackGetPayload<{
  include: {
    artists: true;
    feats: true;
    audioFile: true;
  };
}>;

interface TracklistClientProps {
  tracks: TrackWithRelations[];
}

export const TracklistClient = ({ tracks }: TracklistClientProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onAddTrack = () => {
    inputRef.current?.click();
  };

  const onFileSelect = async (fileList: FileList | null) => {
    if (!fileList?.length) return;

    const file = fileList[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("releaseId", tracks[0]?.releaseId ?? "");

    try {
      setLoading(true);

      await axios.post("/api/upload/audio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Трек добавлен");
      router.refresh(); // 🔥 обновляем серверный page
    } catch (err) {
      toast.error("Ошибка загрузки трека");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {tracks.map((track) => (
          <TrackForm key={track.id} track={track} />
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".wav,.mp3"
        hidden
        onChange={(e) => onFileSelect(e.target.files)}
      />

      <TracklistActions onAddTrack={onAddTrack} />
    </>
  );
};
