"use client";

import { FormInput } from "@/shared/components/shared/form/form-input";

interface Props { 
  release: any;
}

export const ReleaseMainFields = ({ release }: Props) => {
  const firstTrack = release.tracks?.[0]
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="font-medium">Название релиза</h3>

        <p className="text-sm text-gray-500">
          Название автоматически берётся из первого трека
        </p>

        <FormInput name="title" defaultValue={firstTrack?.title || ""} placeholder="Название релиза" disabled />
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Лейбл</h3>

        <FormInput
          name="label"
          placeholder="Например ваш псевдоним"
          rules={{ required: "Введите лейбл" }}
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Жанр</h3>

        <FormInput
          name="genre"
          placeholder="Например: Dubstep"
          rules={{ required: "Введите жанр" }}
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Версия</h3>
        <p className="text-sm text-gray-500">
          Например: Remix by / Bonus track
        </p>

        <FormInput name="version" placeholder="Введите версию" />
      </div>
    </div>
  );
};
