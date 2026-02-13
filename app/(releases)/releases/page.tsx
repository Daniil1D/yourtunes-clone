import { Suspense } from "react";
import { Container } from "@/shared/components/shared";
import { ReleasesHeader } from "@/shared/components/shared/myReleases/ReleasesHeader";
import { ReleasesSkeleton } from "@/shared/components/shared/skeleton/releases-skeleton";
import { ReleasesListServer } from "./_components/releases-list-server";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function ReleasesPage({ searchParams }: PageProps) {
  const { q } = await searchParams;

  return (
    <Container className="space-y-10 mt-10">

      <ReleasesHeader />

      <Suspense fallback={<ReleasesSkeleton />} key={q}>
        <ReleasesListServer query={q} />
      </Suspense>
    </Container>
  );
}
