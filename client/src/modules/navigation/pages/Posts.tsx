import PostSkeleton from "../components/PostSkeleton";
import Error from "@/modules/shared/components/Error";
import PostsContainer from "@/modules/posts/components/PostsContainer";
import { usePost } from "@/modules/posts/hooks/usePost";
import { Separator } from "@/modules/shared/components/ui/Separator";

const Posts = () => {
  const { useUserPostsQuery } = usePost();
  const { data, isPending, isError, error } = useUserPostsQuery();

  if (isPending) return <PostSkeleton />;
  if (isError) return <Error message={`${error.message}: Sorry, there are currently no posts available.`} />;

  return (
    <>
      <h1 className="h2-bold text-center">My Posts</h1>
      <Separator className="border-gray my-5" />
      <PostsContainer posts={data} />
    </>
  );
};

export default Posts;
