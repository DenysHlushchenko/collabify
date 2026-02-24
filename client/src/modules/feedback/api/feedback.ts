import { request } from "@/modules/shared/api/request";
import type { CreateFeedbackPayload, FeedbackType } from "@/modules/shared/types/types";

export const getFeedbacks = async (userId: number): Promise<FeedbackType[]> => {
  const res = await request.get(`feedbacks/users/${userId}`);
  return res.data;
};

export const createFeedback = async (data: CreateFeedbackPayload): Promise<void> => {
  await request.post("/feedbacks", data);
};
