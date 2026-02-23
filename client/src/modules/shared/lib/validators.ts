import * as z from "zod";

export const RegisterSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters long")
    .max(30, "Username must be at most 30 characters long"),
  country: z.string().nonempty("Country is required"),
  gender: z.enum(["male", "female", "other", ""]),
  role: z.enum(["learner", "organizer", ""]),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const LoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const CreatePostSchema = z.object({
  title: z.string().max(50, "Title must be at most 50 characters long").nonempty("Title is required"),
  description: z.string().trim().max(500, "Description is too long!").nonempty("Description is required"),
  groupSize: z
    .string()
    .transform((v) => Number(v))
    .pipe(z.number().int().min(2).max(10)),
  tagInput: z.string().optional(),
  tags: z.array(z.string().min(1)).min(1, "At least one tag is required").max(3, "Maximum 3 tags allowed"),
  chatTitle: z.string().trim().max(50, "Chat group title cannot be longer than 50 characters").optional(),
  chatId: z.string().optional(),
});

export const UpdatePostSchmea = z.object({
  title: z.string().max(50, "Title must be at most 50 characters long").nonempty("Title is required"),
  description: z.string().trim().max(500, "Description is too long!").nonempty("Description is required"),
  groupSize: z
    .string()
    .transform((v) => Number(v))
    .pipe(z.number().int().min(2).max(10)),
  tagInput: z.string().optional(),
  tags: z.array(z.string().min(1)).min(1, "At least one tag is required").max(3, "Maximum 3 tags allowed"),
});

export const ProfileSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters long")
    .max(30, "Username must be at most 30 characters long"),
  gender: z.enum(["male", "female", "other"]),
  role: z.enum(["learner", "organizer"]),
  country: z.string().nonempty("Country is required"),
  bio: z.string().max(160, "Bio must be at most 160 characters long").optional(),
});

export type CreatePostInput = z.input<typeof CreatePostSchema>; // groupSize/chatId are strings
export type CreatePostOutput = z.output<typeof CreatePostSchema>; // groupSize/chatId are number

export type UpdatePostInput = z.input<typeof UpdatePostSchmea>; // groupSize is string
export type UpdatePostOutput = z.output<typeof UpdatePostSchmea>; // groupSize is number
