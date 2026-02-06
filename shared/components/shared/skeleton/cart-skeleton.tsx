import { Skeleton } from "@/shared/components/ui/skeleton"
import { Container } from "@/shared/components/shared"

export const CartSkeleton = () => {
  return (
    <Container className="my-10">
      <div className="border rounded-2xl bg-white p-6 space-y-4">
        <Skeleton className="h-6 w-24" />

        {[1, 2].map(i => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}

        <div className="flex justify-between items-center border-t pt-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </Container>
  )
}
