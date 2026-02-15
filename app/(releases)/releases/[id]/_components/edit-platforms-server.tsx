import { prisma } from "@/prisma/prisma-client";
import { PlatformsDropdown } from "@/shared/components/shared/platforms/platforms-dropdown";
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



  return (
    <>
      <PlatformsAutosave releaseId={releaseId} />

      <InitPlatforms selectedIds={selectedIds} />

      {/* <PlatformsDropdown

        platforms={platforms} name={""} onChangeSave={function (): void {
          throw new Error("Function not implemented.");
        } }            /> */}

      <PlatformsFooter releaseId={releaseId} />
    </>
  );
}
