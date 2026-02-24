import { Skeleton } from "@/modules/shared/components/ui/Skeleton";

const PostSkeleton = () => {
  return (
    <div>
      <Skeleton className="mb-5 ml-auto flex h-8 w-30 rounded-md bg-gray-100" />
      <Skeleton className="mb-12 h-35 w-full rounded-md bg-gray-100" />
      <Skeleton className="mb-12 h-35 w-full rounded-md bg-gray-100" />
      <Skeleton className="mb-12 h-35 w-full rounded-md bg-gray-100" />
      <Skeleton className="mb-12 h-35 w-full rounded-md bg-gray-100" />
      <Skeleton className="mb-12 h-35 w-full rounded-md bg-gray-100" />
    </div>
  );
};

const PostDetailsSkeleton = () => {
  return (
    <div className="relative rounded-lg border border-[#e6e6e6] bg-white p-5">
      <div className="flex items-start gap-x-3">
        <Skeleton className="h-8 w-8 shrink-0 rounded-full" />

        <div className="flex flex-col gap-y-1">
          <Skeleton className="h-5 w-32 rounded-md" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>

        <div className="ml-auto flex gap-x-2">
          <Skeleton className="h-8 w-16 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      </div>

      <div className="absolute top-16 left-5 flex gap-x-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-18 rounded-full" />
      </div>

      <div className="mt-14">
        <Skeleton className="h-7 w-4/5 rounded-md" />
      </div>

      <div className="mt-6 space-y-2">
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-11/12 rounded-md" />
      </div>

      <div className="mt-10 flex items-center gap-x-6">
        <Skeleton className="h-8 w-10 rounded-md" />
        <Skeleton className="h-8 w-10 rounded-md" />
        <Skeleton className="h-8 w-10 rounded-md" />
      </div>
    </div>
  );
};

export { PostSkeleton, PostDetailsSkeleton };
