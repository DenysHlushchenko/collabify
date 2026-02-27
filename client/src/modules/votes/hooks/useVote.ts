import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCommentVote, getPostVote, sendCommentVote, sendPostVote } from "../api/votes";
import { useState } from "react";
import type { AxiosError } from "axios";
import { useAuthStore } from "@/modules/auth/store/userStore";

const useVote = () => {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore().getUser();
  const [error, setError] = useState<string>("");

  const usePostVoteQuery = (postId: number) => {
    return useQuery({
      queryKey: ["userVote", postId, currentUser?.id],
      queryFn: () => getPostVote({ entityId: postId }),
      staleTime: 1000 * 30,
      retry: 1,
    });
  };

  const useCommentVoteQuery = (commentId: number) => {
    return useQuery({
      queryKey: ["userCommentVote", commentId, currentUser?.id],
      queryFn: () => getCommentVote({ entityId: commentId }),
      staleTime: 1000 * 30,
      retry: 1,
    });
  };

  const useCreatePostVoteMutation = (postId: number) => {
    return useMutation({
      mutationFn: sendPostVote,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["userVote", postId, currentUser?.id] });
        setError("");
      },

      onError: (error) => {
        const axiosError = error as AxiosError<{ message: string }>;
        const backendError = axiosError.response?.data?.message || "Something went wrong. Please try again.";
        console.error("Post vote creation failed: ", error);
        setError(backendError);
      },
    });
  };

  const useCreateCommentVoteMutation = (commentId: number) => {
    return useMutation({
      mutationFn: sendCommentVote,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["userCommentVote", commentId, currentUser?.id] });
        setError("");
      },

      onError: (error) => {
        const axiosError = error as AxiosError<{ message: string }>;
        const backendError = axiosError.response?.data?.message || "Something went wrong. Please try again.";
        console.error("Post vote creation failed: ", error);
        setError(backendError);
      },
    });
  };

  return {
    error,
    usePostVoteQuery,
    useCommentVoteQuery,
    useCreatePostVoteMutation,
    useCreateCommentVoteMutation,
  };
};

export default useVote;
