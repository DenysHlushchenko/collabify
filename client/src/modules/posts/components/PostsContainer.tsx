import type { PostFormValues, PostType } from "@/modules/shared/types/types";
import Post from "@/modules/posts/components/Post";
import CreatePostDialog from "./CreatePostDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../api/post";
import type { AxiosError } from "axios";
import { useState } from "react";
import { useAuthStore } from "@/modules/auth/store/userStore";
import Filters from "@/modules/shared/components/Filters";

const PostsContainer = ({ posts }: { posts: PostType[] }) => {
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore().getUser();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPost,

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["chats"] });
    },

    onError: (error) => {
      const axiosError = error as AxiosError<{ message: string }>;
      const backendError = axiosError.response?.data?.message || "Something went wrong. Please try again.";
      setError(backendError);
      console.error("Post creation failed: ", error);
    },
  });

  const submitPost = (values: PostFormValues) => {
    if (!user) return;

    mutation.mutate({
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
        posts.map((post: PostType) => <Post isUserPost={false} key={post.id} post={post} />)
      ) : (
        <h1 className="pt-10 text-center text-sm">No posts yet!</h1>
      )}
      {error}
    </div>
  );
};

export default PostsContainer;
