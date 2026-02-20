import { PostSchema } from "@/modules/shared/lib/validators";
import * as z from "zod";

export type FormSchemaType = z.infer<typeof PostSchema>;
export type PropType = "title" | "description" | "groupSize" | "tags" | "chatTitle" | "chatId";
