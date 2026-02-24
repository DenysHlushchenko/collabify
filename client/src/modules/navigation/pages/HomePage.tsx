import Posts from "@/modules/posts/components/Posts";
import Error from "@/modules/shared/components/Error";
import { PostSkeleton } from "../../posts/components/PostSkeletons";
import { usePost } from "@/modules/posts/hooks/usePost";

const HomePage = () => {
  const { usePostsQuery } = usePost();
  const { data, isPending, isPlaceholderData, isError, error } = usePostsQuery();

  if (isPending && !isPlaceholderData) return <PostSkeleton />;
  if (isError) return <Error message={`${error.message}: Sorry, there are currently no posts available.`} />;

  return <Posts posts={data} />;
};

export default HomePage;
