import { request } from "@/modules/shared/api/request";
import type { PostType } from "@/modules/shared/types/types";

export const getPosts = async (): Promise<PostType[]> => {
  const res = await request.get("/posts");
  return res.data;
};
