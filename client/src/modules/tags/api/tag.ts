import type { PopularTagsResponse } from "@/modules/shared/types/types";
import { request } from "@/modules/shared/api/request.ts";


export const getPopularTags = async (): Promise<PopularTagsResponse[]> => {
  const res = await request.get("/tags");
  return res.data;
}