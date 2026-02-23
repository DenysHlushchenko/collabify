import type { PostType } from "@/modules/shared/types/types";
import Post from "../Post";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../api/post";
import type { AxiosError } from "axios";
import { useState } from "react";
import { useAuthStore } from "@/modules/auth/store/userStore";
import Filters from "@/modules/shared/components/Filters";
import PostForm from "@/modules/shared/forms/PostForm";
import { PostSchema } from "@/modules/shared/lib/validators";

const UserPosts = ({ posts }: { posts: PostType[] }) => {
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore().getUser();

  const queryClient = useQueryClient();

  const createMutation = useMutation({
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

  const handleCreate = (values: z.infer<typeof PostSchema>) => {
    if (!user) return null;
    createMutation.mutate({
      ...values,
      userId: user.id,
    });
  };
  ("");

  return (
    <div>
      <div className="flex-between mb-4">
        <Filters />
        <PostForm type="create" submitPost={handleCreate} error={error} isSubmitting={createMutation.isPending} />
      </div>
      {posts.length !== 0 ? (
        posts.map((post: PostType) => <Post key={post.id} post={post} />)
      ) : (
        <h1 className="pt-10 text-center text-sm">No posts yet!</h1>
      )}
    </div>
  );
};

export default UserPosts;
