import PostsContainer from "@/modules/posts/components/PostsContainer";
import Error from "@/modules/shared/components/Error";
import PostSkeleton from "../components/PostSkeleton";
import { usePost } from "@/modules/posts/hooks/usePost";

const Posts = () => {
  const { useUserPostsQuery } = usePost();
  const { data, isPending, isPlaceholderData, isError, error } = useUserPostsQuery();

  if (isPending && !isPlaceholderData) return <PostSkeleton />;
  if (isError) return <Error message={`${error.message}: Sorry, there are currently no posts available.`} />;

  return <PostsContainer posts={data} />;
};

export default Posts;
