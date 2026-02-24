import { prisma } from "@/prisma/prisma-client";
import { ChartReleaseCard } from "@/shared/components/shared/charts/chart-release-card";
import { getTopReleases } from "@/shared/lib/get-top-releases";

export async function ChartsListServer() {
  const releases = await getTopReleases()

  if (!releases.length) {
    return (
      <div className="text-center text-gray-500">
        Пока нет опубликованных релизов
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {releases.map((release, index) => (
        <ChartReleaseCard
          key={release.id}
          index={index + 1}
          title={release.title}
          artist={release.artist.name}
          coverUrl={release.cover?.url ?? null}
          tracksCount={release.tracks.length}
          firstTrack={release.tracks[0]}
          releaseId={release.id}
        />
      ))}
    </div>
  );
}

