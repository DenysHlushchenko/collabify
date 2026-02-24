import { Skeleton } from "@/modules/shared/components/ui/Skeleton";

const FeedbacksSkeleton = () => {
  return (
    <div className="h2-bold mb-5 text-center">
      <Skeleton className="mx-auto mb-5 h-10 w-56 bg-gray-100" />
      <div className="mb-7 flex justify-end">
        <Skeleton className="h-8 w-30 bg-gray-100" />
      </div>
      <div className="flex flex-col gap-5">
        <Skeleton className="mb-12 h-35 w-full rounded-md bg-gray-100" />
        <Skeleton className="mb-12 h-35 w-full rounded-md bg-gray-100" />
        <Skeleton className="mb-12 h-35 w-full rounded-md bg-gray-100" />
        <Skeleton className="mb-12 h-35 w-full rounded-md bg-gray-100" />
        <Skeleton className="mb-12 h-35 w-full rounded-md bg-gray-100" />
      </div>
    </div>
  );
};

export default FeedbacksSkeleton;
