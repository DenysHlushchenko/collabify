import * as z from "zod";

export const RegisterSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters long")
    .max(30, "Username must be at most 30 characters long"),
  country: z.string().nonempty("Country is required"),
  gender: z.enum(["male", "female", "other", ""]),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const LoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
export const PostSchema = z.object({
  title: z.string().max(50, "Title must be at most 50 characters long").nonempty("Title is required"),
  description: z.string().max(500, "Description is too long!").nonempty("Description is required"),
  groupSize: z.coerce
    .number()
    .int()
    .min(2, "Group size must be at least 2")
    .max(10, "Group size must be at most 10"),
  tags: z
    .array(z.string().min(1, "Tag cannot be empty"))
    .min(1, "At least one tag is required")
    .max(3, "No more than 3 tags"),
  chatTitle: z
    .string()
    .max(50, "Chat group title cannot be longer than 50 characters")
    .nonempty("Chat group title is required"),
});
