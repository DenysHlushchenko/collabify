import { request } from "@/modules/shared/api/request";
import type { VoteResponse } from "@/modules/shared/types/types";

export const getCommentVote = async ({ entityId: commentId }: { entityId: number }): Promise<VoteResponse> => {
  const res = await request.get(`/comments/${commentId}/votes`);
  return res.data;
};

export const sendCommentVote = async ({
  entityId: commentId,
  type,
}: {
  entityId: number;
  type: "like" | "dislike" | null;
}) => {
  await request.post(`/comments/${commentId}/votes`, { type });
};

export const getPostVote = async ({ entityId: postId }: { entityId: number }): Promise<VoteResponse> => {
  const res = await request.get(`/posts/${postId}/votes`);
  return res.data;
};

export const sendPostVote = async ({
  entityId: postId,
  type,
}: {
  entityId: number;
  type: "like" | "dislike" | null;
}) => {
  await request.post(`/posts/${postId}/votes`, { type });
};
