import { prisma } from "@/prisma/prisma-client";
import { Container, Title } from "@/shared/components/shared";

interface Props {
  releaseId: string;
}

export async function ReleaseDetailsServer({ releaseId }: Props) {
  const release = await prisma.release.findUnique({
    where: { id: releaseId },
    include: {
      artist: true,
      label: true,
      tracks: {
        orderBy: { createdAt: "asc" },
        include: {
          artists: true,
        },
      },
      platforms: {
        include: { platform: true },
      },
      cover: true,
    },
  });

  if (!release) {
    return <Container>Релиз не найден</Container>;
  }

  const statusMap: Record<string, string> = {
    DRAFT: "Черновик",
    SUBMITTED: "Отправлен",
    IN_REVIEW: "На проверке",
    APPROVED: "Одобрен",
    DISTRIBUTED: "Доставлен",
    REJECTED: "Отклонён",
  };

  const coverUrl = release.cover?.url ?? null;

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={release.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              🎵
            </div>
          )}
        </div>

        <div>
          <span className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 mb-1">
            {statusMap[release.status]}
          </span>

          <h1 className="text-2xl font-bold">{release.title}</h1>

          <p className="text-sm text-gray-500">
            {release.artist.name}
            {release.label ? ` • ${release.label.name}` : ""}
          </p>
        </div>
      </div>

      <div>
        <Title text="Треки" size="xl" />
        <ul className="space-y-2">
          {release.tracks.map((track) => (
            <li
              key={track.id}
              className="flex justify-between items-center p-3 border rounded-xl"
            >
              <span>
                {track.artists.map((a) => a.name).join(", ")} — {track.title}
              </span>
              <span className="text-gray-400">{track.duration}s</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <Title text="Площадки" size="xl" />
        <div className="flex flex-wrap gap-3">
          {release.platforms.map((rp) => (
            <span
              key={rp.platformId}
              className="flex items-center gap-2 border rounded-xl px-3 py-1 bg-white"
            >
              {rp.platform.logo && (
                <img
                  src={rp.platform.logo}
                  alt={rp.platform.name}
                  className="w-6 h-6"
                />
              )}
              {rp.platform.name}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

