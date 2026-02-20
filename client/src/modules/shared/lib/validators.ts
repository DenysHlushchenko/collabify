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
});

export const PostSchema = z.object({
  title: z.string().max(50, "Title must be at most 50 characters long").nonempty("Title is required"),
  description: z.string().max(500, "Description is too long!").nonempty("Description is required"),
  groupSize: z.number(),
  tags: z.string(),
  chatTitle: z
    .string()
    .max(20, "Chat group title cannot be longer than 20 characters")
    .nonempty("Chat group title is required"),
});
