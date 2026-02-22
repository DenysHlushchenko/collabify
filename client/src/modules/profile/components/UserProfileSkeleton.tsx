import { Separator } from "@/modules/shared/components/ui/Separator";
import { Skeleton } from "@/modules/shared/components/ui/Skeleton";

const UserProfileSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col-reverse items-center justify-between gap-6 sm:flex-row sm:items-start">
        <div className="flex w-full flex-col items-center gap-5 lg:flex-row lg:items-start lg:gap-6">
          <Skeleton className="h-24 w-24 shrink-0 rounded-full bg-gray-100 sm:h-28 sm:w-28 lg:h-32 lg:w-32" />

          <div className="flex w-full flex-col items-center gap-4 lg:items-start lg:gap-5">
            <Skeleton className="h-9 w-64 bg-gray-100" />
            <div className="flex flex-wrap justify-center gap-4 sm:gap-5 lg:justify-start">
              <Skeleton className="h-7 w-28 rounded bg-gray-100" />
              <Skeleton className="h-7 w-36 rounded bg-gray-100" />
              <Skeleton className="h-7 w-20 rounded bg-gray-100" />
              <Skeleton className="h-7 w-24 rounded bg-gray-100" />
            </div>
            <div className="w-full max-w-2xl space-y-2">
              <Skeleton className="h-5 w-full bg-gray-100" />
              <Skeleton className="h-5 w-5/6 bg-gray-100" />
              <Skeleton className="h-5 w-4/6 bg-gray-100" />
            </div>
          </div>
        </div>
        <Skeleton className="h-10 w-24 bg-gray-100" />
      </div>
      <Skeleton className="h-48 w-full rounded-xl bg-gray-100" />
      <div className="mt-10">
        <Separator className="my-5" />
        <Skeleton className="mx-auto h-10 w-56 bg-gray-100" />
      </div>
    </div>
  );
};

export default UserProfileSkeleton;
