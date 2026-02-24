import PostsContainer from "@/modules/posts/components/PostsContainer";
import Error from "@/modules/shared/components/Error";
import { PostSkeleton } from "../../posts/components/PostSkeletons";
import { usePost } from "@/modules/posts/hooks/usePost";

const Home = () => {
  const { usePostsQuery } = usePost();
  const { data, isPending, isPlaceholderData, isError, error } = usePostsQuery();

  if (isPending && !isPlaceholderData) return <PostSkeleton />;
  if (isError) return <Error message={`${error.message}: Sorry, there are currently no posts available.`} />;

  return <PostsContainer posts={data} />;
};

export default Home;
