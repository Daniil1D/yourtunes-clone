import { Skeleton } from "@/shared/components/ui/skeleton";
import { Title } from "@/shared/components/shared";

export const ReleaseDetailsSkeleton = () => {
  return (
    <div className="space-y-8">

      <div className="flex items-center gap-6">
        <Skeleton className="w-24 h-24 rounded-xl" />

        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-7 w-60" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      <div className="space-y-4">
        <Title text="Треки" size="xl" />

        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex justify-between items-center p-2 border rounded-xl"
          >
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <Title text="Площадки" size="xl" />

        <div className="flex gap-3 flex-wrap">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-28 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
};
