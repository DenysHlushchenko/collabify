import { request } from "@/modules/shared/api/request";
import type { FilterType, CreatePostPayload, PostType, UpdatePostPayload } from "@/modules/shared/types/types";

export const getPosts = async (filter?: FilterType, search?: string): Promise<PostType[]> => {
  const params = new URLSearchParams();
  if (filter) params.set("filter", filter);
  if (search) params.set("search", search);
  const url = `/posts?${params.toString()}`;
  const res = await request.get(url);
  return res.data;
};

export const getPostById = async (id: number): Promise<PostType> => {
  const res = await request.get(`/posts/${id}`);
  return res.data;
};

export const getUserPosts = async (userId: number): Promise<PostType[]> => {
  const res = await request.get(`/posts/users/${userId}`);
  return res.data;
};

export const createPost = async (data: CreatePostPayload): Promise<void> => {
  await request.post("/posts", data);
};

export const updatePost = async (data: UpdatePostPayload): Promise<void> => {
  await request.put(`/posts/${data.postId}`, data);
};
