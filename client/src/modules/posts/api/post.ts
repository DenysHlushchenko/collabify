import { request } from "@/modules/shared/api/request";
import type { FilterType, CreatePostPayload, PostType } from "@/modules/shared/types/types";

export const getPosts = async (filter?: FilterType, search?: string): Promise<PostType[]> => {
  const params = new URLSearchParams();
  if (filter) params.set("filter", filter);
  if (search) params.set("search", search);
  const url = `/posts?${params.toString()}`;
  const res = await request.get(url);
  return res.data;
};

export const createPost = async (data: CreatePostPayload): Promise<void> => {
  await request.post("/posts", data);
};
