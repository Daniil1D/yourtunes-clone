"use client";

import { usePlayer } from "@/shared/store/global-player"

interface Props {
  index: number;
  title: string;
  artist: string;
  coverUrl?: string | null;
  tracksCount: number;
  firstTrack?: {
    audioUrl?: string | null
  }
  releaseId: string
}

export const ChartReleaseCard: React.FC<Props> = ({
  index,
  title,
  artist,
  coverUrl,
  tracksCount,
  firstTrack,
  releaseId,
}) => {
  const { play } = usePlayer()

  return (
    <div className="flex items-center gap-5 border rounded-2xl p-4 bg-white hover:shadow transition">

      <div className="text-2xl font-bold w-10 text-gray-400">
        {index}
      </div>

      <div
        onClick={() =>
          play({
            audioUrl: firstTrack?.audioUrl ?? undefined,
            title,
            artist,
            cover: coverUrl ?? undefined,
            releaseId,
          })
        }
        className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden cursor-pointer hover:scale-105 transition"
      >
        {coverUrl ? (
          <img src={coverUrl} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">🎵</div>
        )}
      </div>

      <div className="flex-1">
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-500">{artist}</div>
      </div>

      <div className="text-sm text-gray-400">
        {tracksCount} треков
      </div>
    </div>
  );
};
