import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllChatsByUserId } from "@/modules/chats/api/chat";
import { createPost, deletePost, getPostById, getPosts, getUserPosts, updatePost } from "../api/post";
import type { AxiosError } from "axios";
import { useState } from "react";
import { useAuthStore } from "@/modules/auth/store/userStore";
import { useSearchParams } from "react-router-dom";
import type { FilterType } from "@/modules/shared/types/types";
import { toast } from "sonner";

export const usePost = () => {
  const queryClient = useQueryClient();

  /**
   * Retrieving token from the auth store to make sure that query will track the current token
   */
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore().getUser();

  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  const filter = searchParams.get("filter") as FilterType;
  const search = searchParams.get("search");

  const useChatsQuery = (userId?: number, edit?: boolean) => {
    return useQuery({
      queryKey: ["chats", userId],
      queryFn: () => (userId ? getAllChatsByUserId(userId) : null),
      enabled: !edit,
      staleTime: 1000 * 10,
      retry: 2,
    });
  };

  const usePostsQuery = () => {
    return useQuery({
      queryKey: ["posts", filter, search],
      queryFn: () => getPosts(filter, search!),
      placeholderData: keepPreviousData,
      staleTime: 1000 * 30,
    });
  };

  const usePostQuery = (postId: number) => {
    return useQuery({
      queryKey: ["post"],
      queryFn: () => getPostById(postId),
      retry: 2,
    });
  };

  const useUserPostsQuery = () => {
    return useQuery({
      queryKey: ["userPosts", token, filter, search],
      queryFn: () => (user ? getUserPosts(user.id, filter, search!) : []),
      placeholderData: keepPreviousData,
      staleTime: 1000 * 30,
    });
  };

  const useCreatePostMutation = () => {
    return useMutation({
      mutationFn: createPost,

      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["posts"] });
        await queryClient.invalidateQueries({ queryKey: ["post"], exact: false });
        await queryClient.invalidateQueries({ queryKey: ["userPosts"], exact: false });
        await queryClient.invalidateQueries({ queryKey: ["chats"] });

        toast.success("Post created successfully!", {
          position: "bottom-center",
          className: "toast-success font-inter",
        });
      },

      onError: (error) => {
        const axiosError = error as AxiosError<{ message: string }>;
        const backendError = axiosError.response?.data?.message || "Something went wrong. Please try again.";
        setError(backendError);
        toast.error(backendError, {
          position: "top-center",
          className: "toast-error font-inter",
        });
        console.error("Post creation failed: ", error);
      },
    });
  };

  const useUpdatePostMutation = () => {
    return useMutation({
      mutationFn: updatePost,

      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["userPosts"], exact: false });
        await queryClient.invalidateQueries({ queryKey: ["posts"] });
        await queryClient.invalidateQueries({ queryKey: ["post"], exact: false });

        toast.success("Post updated successfully!", {
          position: "bottom-center",
          className: "toast-success font-inter",
        });
      },

      onError: (error) => {
        const axiosError = error as AxiosError<{ message: string }>;
        const backendError = axiosError.response?.data?.message || "Something went wrong. Please try again.";
        setError(backendError);
        console.error("Post update failed: ", error);
      },
    });
  };

  const useDeletePostMutation = () => {
    return useMutation({
      mutationFn: deletePost,

      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["posts"] });
        await queryClient.invalidateQueries({ queryKey: ["userPosts"], exact: false });

        toast.success("Post deleted successfully!", {
          position: "bottom-center",
          className: "toast-success font-inter",
        });
      },

      onError: (error) => {
        const axiosError = error as AxiosError<{ message: string }>;
        const backendError = axiosError.response?.data?.message || "Something went wrong. Please try again.";
        setError(backendError);
        console.error("Post delete failed: ", error);
      },
    });
  };

  return {
    error,
    user,
    useChatsQuery,
    usePostQuery,
    usePostsQuery,
    useUserPostsQuery,
    useCreatePostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
  };
};
