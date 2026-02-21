import UserPosts from "@/modules/posts/components/posts/UserPosts";
import Error from "@/modules/shared/components/Error";
import { Skeleton } from "@/modules/shared/components/ui/Skeleton";
import { useAuthStore } from "@/modules/auth/store/userStore";
import { getPosts } from "@/modules/posts/api/post";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import type { FilterType } from "@/modules/shared/types/types";

const Home = () => {
  /**
   * Retrieving token from the auth store to make sure that query will track the current token
   */
  const token = useAuthStore((state) => state.token);
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") as FilterType;
  const search = searchParams.get("search");

  const { data, isPending, isPlaceholderData, isError, error } = useQuery({
    queryKey: ["posts", token, filter, search],
    queryFn: () => getPosts(filter, search!),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  });

  if (isPending && !isPlaceholderData)
    return (
      <div>
        <Skeleton className="mx-auto mb-5 flex h-8 w-30 rounded-md bg-gray-100" />
        <Skeleton className="mb-12 h-35 w-full rounded-md bg-gray-100" />
        <Skeleton className="mb-12 h-35 w-full rounded-md bg-gray-100" />
        <Skeleton className="mb-12 h-35 w-full rounded-md bg-gray-100" />
        <Skeleton className="mb-12 h-35 w-full rounded-md bg-gray-100" />
        <Skeleton className="mb-12 h-35 w-full rounded-md bg-gray-100" />
      </div>
    );

  if (isError) return <Error message={`${error.message}: Sorry, there are currently no posts available.`} />;
  return (
    <>
      <UserPosts posts={data} />
    </>
  );
};

export default Home;
