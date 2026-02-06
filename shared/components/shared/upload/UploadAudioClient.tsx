"use client";

import { useRef, useState } from "react";
import axios from "axios";
import { Button } from "@/shared/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const MAX_SIZE_MB = 20;
const REQUIRED_SAMPLE_RATE = 48000;

export const UploadAudioClient = ({ releaseId }: { releaseId: string }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const validateFileBasic = (file: File) => {
    if (!file.name.endsWith(".wav") && !file.name.endsWith(".mp3")) {
      throw new Error("Допустимы только WAV или MP3 файлы");
    }
    const sizeMb = file.size / 1024 / 1024;
    if (sizeMb > MAX_SIZE_MB) {
      throw new Error(`Максимальный размер файла ${MAX_SIZE_MB}MB`);
    }
  };

  const validateSampleRate = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    if (audioBuffer.sampleRate !== REQUIRED_SAMPLE_RATE) {
      throw new Error(
        `Частота дискретизации должна быть ${REQUIRED_SAMPLE_RATE}Hz (текущая: ${audioBuffer.sampleRate})`,
      );
    }
  };

  const onFilesSelect = async (newFiles: FileList | null) => {
    if (!newFiles) return;

    for (const file of Array.from(newFiles)) {
      try {
        validateFileBasic(file);
        await validateSampleRate(file);
        setFiles((prev) => [...prev, file]);
      } catch (err: unknown) {

        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("Неизвестная ошибка при загрузке файла");
        }
      }
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onFilesSelect(e.dataTransfer.files);
  };

  const uploadFiles = async () => {
    if (!files.length) {
      toast.error("Выберите файлы");
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("releaseId", releaseId);

        await axios.post("/api/upload/audio", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (event) => {
            if (!event.total) return;
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          },
        });
      }

      toast.success("Файлы загружены");
      router.push(`/releases/${releaseId}/tracklist`);
      setFiles([]);
      setProgress(0);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Ошибка загрузки");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const uploadLater = () => {
    router.push(`/releases/${releaseId}/tracklist`);
  };

  return (
    <div className="space-y-6">
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed rounded-2xl p-10 text-center bg-gray-50"
      >
        <div className="w-24 h-24 mx-auto rounded-xl bg-gray-100 flex items-center justify-center text-3xl">
          🎵
        </div>
        <p className="mt-4 font-medium">Перетащите файлы сюда</p>
        <p className="text-sm text-gray-500">.wav / .mp3</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".wav,.mp3"
        hidden
        onChange={(e) => onFilesSelect(e.target.files)}
      />

      <div className="flex gap-4">
        <Button variant="secondary" onClick={() => inputRef.current?.click()}>
          Выбрать файлы
        </Button>

        <Button onClick={uploadFiles} disabled={loading}>
          {loading ? "Загружаем..." : "Загрузить"}
        </Button>

        <Button variant="outline" onClick={uploadLater}>
          Загрузить позже
        </Button>
      </div>

      {loading && (
        <div className="mt-2">
          <progress className="w-full" value={progress} max={100} />
          <span>{progress}%</span>
        </div>
      )}

      {files.length > 0 && (
        <ul className="text-sm text-gray-600 list-disc pl-5">
          {files.map((file) => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
