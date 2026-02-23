import type { PostFormValues, PostType } from "@/modules/shared/types/types";
import Post from "@/modules/posts/components/Post";
import CreatePostDialog from "./CreatePostDialog";
import Filters from "@/modules/shared/components/Filters";
import { usePost } from "../hooks/usePost";

const PostsContainer = ({ posts }: { posts: PostType[] }) => {
  const { useCreatePostMutation, user } = usePost();
  const createMutation = useCreatePostMutation();

  const submitPost = (values: PostFormValues) => {
    if (!user) return;

    createMutation.mutate({
      title: values.title.trim(),
      description: values.description.trim(),
      groupSize: values.groupSize,
      tags: values.tags,
      userId: user.id,
      chatId: Number(values.chatId),
      chatTitle: values.chatTitle,
    });
  };

  return (
    <div>
      <div className="flex-between mb-4">
        <Filters />
        <CreatePostDialog submitPost={submitPost} />
      </div>
      {posts.length !== 0 ? (
        posts.map((post: PostType) => <Post key={post.id} post={post} />)
      ) : (
        <h1 className="pt-10 text-center text-sm">No posts yet!</h1>
      )}
    </div>
  );
};

export default PostsContainer;
