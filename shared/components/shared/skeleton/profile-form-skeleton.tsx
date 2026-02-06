import { Skeleton } from "@/shared/components/ui/skeleton"
import { Container } from "@/shared/components/shared"

export const ProfileFormSkeleton = () => {
  return (
    <Container className="my-10">
      <Skeleton className="h-6 w-40 mb-6" />

      <div className="p-10 bg-white rounded-xl shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>

        <div className="flex justify-center gap-4 mt-10">
          <Skeleton className="h-12 w-[180px]" />
          <Skeleton className="h-12 w-[180px]" />
        </div>
      </div>
    </Container>
  )
}
