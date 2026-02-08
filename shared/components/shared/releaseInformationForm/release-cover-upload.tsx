"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui";

export const ReleaseCoverUpload = () => {
  const [coverPreview, setCoverPreview] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.src = objectUrl;
    img.onload = () => {
      if (img.width !== 3000 || img.height !== 3000) {
        setIsModalOpen(true);
        URL.revokeObjectURL(objectUrl);
        return;
      }
      setCoverPreview(objectUrl);
    };
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Обложка релиза</h2>

      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        id="cover-upload"
        className="hidden"
        onChange={handleCoverUpload}
      />

      <label
        htmlFor="cover-upload"
        className="cursor-pointer w-full aspect-square rounded-2xl border bg-gray-50 flex flex-col items-center justify-center text-center px-6 hover:bg-gray-100 transition"
      >
        {coverPreview ? (
          <img
            src={coverPreview}
            alt="Cover Preview"
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          <>
            <h2 className="text-lg text-gray-500 leading-relaxed">
              Загрузите обложку
            </h2>

            <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center text-3xl mt-4">
              🎵
            </div>

            <p className="text-sm text-gray-500 leading-relaxed mt-3">
              Формат: .jpg / .png / .jpeg <br />
              Размер: <b>3000×3000</b> <br />
              Соотношение: <b>1:1</b>
            </p>
          </>
        )}
      </label>

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Упс 😅</AlertDialogTitle>
            <AlertDialogDescription>
              Обложка должна быть квадратной!
              <br />
              Размер изображения: <b>3000×3000</b> пикселей
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsModalOpen(false)}>
              Ок, загружу другой файл
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
