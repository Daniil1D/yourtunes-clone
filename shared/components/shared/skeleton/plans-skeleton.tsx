import { Skeleton } from "@/shared/components/ui/skeleton"
import { Container } from "@/shared/components/shared"

export const PlansSkeleton = () => {
  return (
    <Container className="my-10">
      <Skeleton className="h-6 w-40 mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map(i => (
          <div
            key={i}
            className="border rounded-xl p-6 space-y-4 bg-white"
          >
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </Container>
  )
}
