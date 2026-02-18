import { getPosts } from "@/modules/posts/api/post";
import { useQuery } from "@tanstack/react-query";
import type { PostType } from "@/modules/shared/types/types";
import { useAuthStore } from "@/modules/auth/store/userStore";
import Post from "@/modules/posts/components/Post";
import Error from "@/modules/shared/components/Error";
import { Skeleton } from "@/modules/shared/components/ui/skeleton";

const Home = () => {
  /**
   * Retrieving token from the auth store to make sure that query will track the current token
   */
  const token = useAuthStore((state) => state.token);

  const {
    data: posts,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts", token],
    queryFn: getPosts,
    retry: 2,
  });

  if (isPending)
    return (
      <div>
        <Skeleton className="mb-8 h-50 w-full rounded-xl bg-gray-100" />
        <Skeleton className="mb-8 h-50 w-full rounded-xl bg-gray-100" />
        <Skeleton className="mb-8 h-50 w-full rounded-xl bg-gray-100" />
      </div>
    );

  if (isError) return <Error message={error.message} />;

  return (
    <div>
      {posts?.map((post: PostType) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Home;
