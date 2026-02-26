import { request } from "@/modules/shared/api/request";
import type { CommentType, CreateCommentPayload } from "@/modules/shared/types/types";

export const getComments = async (postId: number): Promise<CommentType[]> => {
  const res = await request.get(`/comments/posts/${postId}`);
  return res.data;
};

export const createComment = async (postId: number, data: CreateCommentPayload) => {
  await request.post(`/comments/posts/${postId}`, data);
};

export const deleteComment = async (commentId: number) => {
  await request.delete(`/comments/${commentId}`);
};
