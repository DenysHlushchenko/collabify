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

export default PostSkeleton;
