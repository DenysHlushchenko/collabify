import { Skeleton } from "@/modules/shared/components/ui/Skeleton";

const PostSkeleton = () => {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <Skeleton className="h-8 w-30 rounded-md bg-gray-100" />
        <Skeleton className="h-8 w-30 rounded-md bg-gray-100" />
      </div>
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
      <div className="flex items-center gap-x-2">
        <Skeleton className="h-8 w-8 shrink-0 rounded-full bg-gray-100" />

        <Skeleton className="h-5 w-28 rounded-md bg-gray-100" />
        <Skeleton className="h-5 w-24 rounded-md bg-gray-100" />

        <div className="ml-auto flex gap-x-2">
          <Skeleton className="h-8 w-16 rounded-md bg-gray-100" />
          <Skeleton className="h-8 w-16 rounded-md bg-gray-100" />
        </div>
      </div>

      <div className="absolute top-16 left-5 flex gap-x-2">
        <Skeleton className="h-6 w-16 rounded-full bg-gray-100" />
        <Skeleton className="h-6 w-20 rounded-full bg-gray-100" />
        <Skeleton className="h-6 w-14 rounded-full bg-gray-100" />
      </div>

      <div className="mt-10">
        <Skeleton className="h-6 w-4/5 rounded-md bg-gray-100" />
      </div>

      <div className="mt-5 space-y-3">
        <Skeleton className="h-4 w-full rounded-md bg-gray-100" />
        <Skeleton className="h-4 w-full rounded-md bg-gray-100" />
        <Skeleton className="h-4 w-5/6 rounded-md bg-gray-100" />
      </div>

      <div className="mt-5">
        <Skeleton className="h-8 w-24 rounded-md bg-gray-100" />
      </div>
    </div>
  );
};

export { PostSkeleton, PostDetailsSkeleton };
