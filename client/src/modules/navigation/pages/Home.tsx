import UserPosts from "@/modules/posts/components/UserPosts";
import Error from "@/modules/shared/components/Error";
import { Skeleton } from "@/modules/shared/components/ui/Skeleton";
import { useAuthStore } from "@/modules/auth/store/userStore";
import { getPosts } from "@/modules/posts/api/post";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  /**
   * Retrieving token from the auth store to make sure that query will track the current token
   */
  const token = useAuthStore((state) => state.token);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["posts", token],
    queryFn: getPosts,
    retry: 2,
  });

  if (isPending)
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
  return <UserPosts posts={data} />;
};

export default Home;
