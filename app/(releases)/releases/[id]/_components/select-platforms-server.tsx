import { prisma } from "@/prisma/prisma-client";
import { PlatformGroup } from "@/shared/components/shared/platforms/PlatformGroup";
import { PlatformsFooter } from "@/shared/components/shared/platforms/PlatformsFooter";
import { PlatformsAutosave } from "../PlatformsAutosave/page";

interface Props {
  releaseId: string;
}

export async function SelectPlatformsServer({ releaseId }: Props) {
  const platforms = await prisma.platform.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  const streaming = platforms.filter((p) => p.type === "STREAMING");
  const ugc = platforms.filter((p) => p.type === "UGC");

  return (
    <>
      <PlatformsAutosave releaseId={releaseId} />

      <PlatformGroup title="Стриминговые платформы" platforms={streaming} />

      <PlatformGroup
        title="UGC платформы"
        description="Данные платформы допускают только на 100% авторский контент..."
        platforms={ugc}
      />

      <PlatformsFooter releaseId={releaseId} />
    </>
  );
}
