import { Skeleton } from "@/modules/shared/components/ui/Skeleton";

const CommentsSkeleton = () => {
  return (
    <div className="space-y-10">
      <div>
        <Skeleton className="mt-10 mb-4 h-6 w-48 bg-gray-100" />
        <div className="mt-6 flex w-full flex-col gap-4">
          <div className="rounded-md border bg-white p-4">
            <div className="mb-2 flex gap-2">
              <Skeleton className="h-8 w-8 rounded bg-gray-100" />
              <Skeleton className="h-8 w-8 rounded bg-gray-100" />
              <Skeleton className="h-8 w-8 rounded bg-gray-100" />
              <Skeleton className="h-8 w-8 rounded bg-gray-100" />
            </div>

            <div className="min-h-37.5 space-y-3">
              <Skeleton className="h-5 w-3/4 rounded bg-gray-100" />
              <Skeleton className="h-5 w-full rounded bg-gray-100" />
              <Skeleton className="h-5 w-5/6 rounded bg-gray-100" />
              <Skeleton className="h-5 w-2/3 rounded bg-gray-100" />
            </div>
          </div>

          <div className="flex justify-end">
            <Skeleton className="h-10 w-32 rounded-md bg-gray-100" />
          </div>
        </div>
      </div>
      <Skeleton className="h-7 w-40 bg-gray-100" />
      <div className="space-y-10">
        {Array.from({ length: 4 }).map((_, index) => (
          <article key={index} className="border-b py-10">
            <div className="mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
              <div className="flex flex-1 items-start gap-3 sm:items-center">
                <Skeleton className="h-10 w-10 rounded-full bg-gray-100" />

                <div className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-32 bg-gray-100" />
                  <Skeleton className="h-4 w-48 bg-gray-100" />
                </div>
              </div>

              <Skeleton className="h-8 w-16 bg-gray-100" />
            </div>

            <div className="space-y-3 pl-1">
              <Skeleton className="h-5 w-full rounded bg-gray-100" />
              <Skeleton className="h-5 w-5/6 rounded bg-gray-100" />
              <Skeleton className="h-5 w-3/4 rounded bg-gray-100" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default CommentsSkeleton;
