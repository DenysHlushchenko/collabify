import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/modules/auth/store/userStore";
import type { CreateCommentPayload, CommentFormValues } from "@/modules/shared/types/types";
import { createComment, deleteComment, getComments } from "../api/comment";

export const useComments = () => {
  const { postId } = useParams();
  const postIdNum = Number(postId);
  const user = useAuthStore().getUser();
  const queryClient = useQueryClient();

  const isValidPost = !!postId && !isNaN(postIdNum);

  const commentsQuery = useQuery({
    queryKey: ["comments", postIdNum],
    queryFn: () => getComments(postIdNum),
    enabled: isValidPost,
    staleTime: 1000 * 10,
    placeholderData: keepPreviousData,
  });

  const createMutation = useMutation({
    mutationFn: ({ postId, ...payload }: { postId: number } & CreateCommentPayload) => createComment(postId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postIdNum] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteComment,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postIdNum] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleSubmit = (values: CommentFormValues) => {
    if (!user || !isValidPost) return;
    createMutation.mutate({
      postId: postIdNum,
      content: values.content,
      senderId: user.id,
    });
  };

  const handleDelete = (commentId: number) => {
    deleteMutation.mutate(commentId);
  };

  return {
    comments: commentsQuery.data ?? [],
    isLoading: commentsQuery.isPending && !commentsQuery.isPlaceholderData,
    isError: commentsQuery.isError,
    errorMessage: commentsQuery.error?.message,

    isCreating: createMutation.isPending,

    handleSubmit,
    handleDelete,

    currentUserId: user?.id,
  };
};
