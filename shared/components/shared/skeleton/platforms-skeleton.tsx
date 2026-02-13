import { Skeleton } from "@/shared/components/ui/skeleton";

export const PlatformsSkeleton = () => {
  return (
    <div className="space-y-10">

      <div className="bg-white border rounded-2xl p-6 space-y-4">
        <Skeleton className="h-6 w-60" />

        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between border rounded-xl p-3"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-md" />
                <Skeleton className="h-4 w-40" />
              </div>

              <Skeleton className="h-5 w-5 rounded-md" />
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28 rounded-xl" />
            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-2xl p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72" />

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between border rounded-xl p-3"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-md" />
                <Skeleton className="h-4 w-36" />
              </div>

              <Skeleton className="h-5 w-5 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
