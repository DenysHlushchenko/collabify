import type { PostSchema } from "@/modules/shared/lib/validators";
import type z from "zod";

export type FormSchemaType = z.infer<typeof PostSchema>;
export type PropType = "title" | "description" | "groupSize" | "tags" | "chatTitle" | "chatId";
