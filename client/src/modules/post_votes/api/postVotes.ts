import { request } from "@/modules/shared/api/request";
import type { VoteResponse } from "@/modules/shared/types/types";

export const getPostVote = async (postId: number): Promise<VoteResponse> => {
  const res = await request.get(`/posts/${postId}/votes`);
  return res.data;
};

export const sendPostVote = async ({ postId, type }: { postId: number; type: "like" | "dislike" | null }) => {
  await request.post(`/posts/${postId}/votes`, { type });
};
