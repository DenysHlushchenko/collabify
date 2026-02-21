import type { PostFormValues, PostType } from "@/modules/shared/types/types";
import Post from "@/modules/posts/components/posts/Post";
import PostDialog from "./PostDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../api/post";
import type { AxiosError } from "axios";
import { useState } from "react";
import { useAuthStore } from "@/modules/auth/store/userStore";

const UserPosts = ({ posts }: { posts: PostType[] }) => {
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
      console.error("Post creation failed:", error);
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
      chatId: values.chatId,
      chatTitle: values.chatTitle,
    });
  };

  return (
    <div>
      <PostDialog submitPost={submitPost} error={error} />
      {posts.length !== 0 ? (
        posts.map((post: PostType) => <Post key={post.id} post={post} />)
      ) : (
        <h1 className="text-center text-sm">No posts yet!</h1>
      )}
    </div>
  );
};

export default UserPosts;
