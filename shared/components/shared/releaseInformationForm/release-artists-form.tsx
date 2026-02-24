"use client";

import { FormInput } from "@/shared/components/shared/form/form-input";

interface Props {
  release: any;
}

export const ReleaseArtistsForm = ({ release }: Props) => {
  const firstTrack = release.tracks?.[0];
  const firstArtist = firstTrack?.artists?.[0]
  return (
    <div className="rounded-3xl border bg-white shadow-sm p-8 space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Исполнители</h2>
        <p className="text-sm text-gray-500">
          Артисты, которые будут указаны в оглавлении релиза и в треклисте.
        </p>
      </div>

      <FormInput
        name="artist"
        defaultValue={firstArtist?.name || ""}
        placeholder="Название артиста"
        disabled
      />
    </div>
  );
};
