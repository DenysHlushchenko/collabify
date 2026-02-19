import { request } from "@/modules/shared/api/request";
import type { PostFormType, PostType } from "@/modules/shared/types/types";

export const getPosts = async (): Promise<PostType[]> => {
  const res = await request.get("/posts");
  return res.data;
};

export const createPost = async (data: PostFormType): Promise<void> => {
  await request.post("/posts", data);
};
