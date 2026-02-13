import { prisma } from "@/prisma/prisma-client";
import { PlatformGroup } from "@/shared/components/shared/platforms/PlatformGroup";
import { PlatformsFooter } from "@/shared/components/shared/platforms/PlatformsFooter";
import { InitPlatforms } from "@/shared/components/shared/platforms/InitPlatforms";
import { PlatformsAutosave } from "../PlatformsAutosave/page";

interface Props {
  releaseId: string;
}

export async function EditPlatformsServer({ releaseId }: Props) {
  const platforms = await prisma.platform.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  const selected = await prisma.releasePlatform.findMany({
    where: { releaseId },
    select: { platformId: true },
  });

  const selectedIds = selected.map((p) => p.platformId);

  const streaming = platforms.filter((p) => p.type === "STREAMING");
  const ugc = platforms.filter((p) => p.type === "UGC");

  return (
    <>
      <PlatformsAutosave releaseId={releaseId} />

      <InitPlatforms selectedIds={selectedIds} />

      <PlatformGroup title="Стриминговые платформы" platforms={streaming} />

      <PlatformGroup
        title="UGC платформы"
        description="Допускается только 100% авторский контент"
        platforms={ugc}
      />

      <PlatformsFooter releaseId={releaseId} />
    </>
  );
}
