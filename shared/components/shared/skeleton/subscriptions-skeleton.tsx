import { Skeleton } from "@/shared/components/ui/skeleton"
import { Container } from "@/shared/components/shared"

export const SubscriptionsSkeleton = () => {
  return (
    <Container>
      <div className="bg-white border rounded-2xl p-6 space-y-4">
        <Skeleton className="h-6 w-32" />

        {[1, 2].map(i => (
          <div
            key={i}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
