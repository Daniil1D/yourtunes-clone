import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";
import { ReleaseCard } from "@/shared/components/shared/myReleases/ReleaseCard";

interface Props {
  query?: string;
}

export async function ReleasesListServer({ query }: Props) {
  const session = await getUserSession();
  if (!session) return null;

  const releases = await prisma.release.findMany({
    where: {
      userId: session.id,

      ...(query
        ? {
            title: {
              contains: query,
              mode: "insensitive",
            },
          }
        : {}),
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  if (releases.length === 0) {
    return (
      <div className="text-gray-500 text-center py-10">
        Ничего не найдено 😢
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {releases.map((release) => (
        <ReleaseCard
          key={release.id}
          id={release.id}
          title={release.title}
          status={release.status === "DRAFT" ? "Черновик" : "Опубликован"}
        />
      ))}
    </div>
  );
}
