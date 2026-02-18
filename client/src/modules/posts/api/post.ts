import type { PostType } from "@/modules/shared/types/types";
import axios from "axios";

export const getPosts = async (): Promise<PostType[]> => {
  const res = await axios.post(`${import.meta.env.VITE_API_URL}/posts`);
  return res.data;
};
