import UserPosts from "@/modules/posts/components/UserPosts";
import Error from "@/modules/shared/components/Error";
import { Skeleton } from "@/modules/shared/components/ui/Skeleton";
import { useAuthStore } from "@/modules/auth/store/userStore";
import { getPosts } from "@/modules/posts/api/post";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Filters from "@/modules/shared/components/Filters";
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
        <Skeleton className="mb-8 h-50 w-full rounded-xl bg-gray-100" />
        <Skeleton className="mb-8 h-50 w-full rounded-xl bg-gray-100" />
        <Skeleton className="mb-8 h-50 w-full rounded-xl bg-gray-100" />
      </div>
    );

  if (isError) return <Error message={`${error.message}: Sorry, there are currently no posts available.`} />;
  return (
    <>
      <Filters />
      <UserPosts posts={data} />;
    </>
  );
};

export default Home;
