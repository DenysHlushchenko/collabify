import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostSchema } from "@/modules/shared/lib/validators";
import type { FormSchemaType } from "../types/types";

const MAX_TAGS = 3;

export const usePostForm = () => {
  const [tags, setTags] = useState<string[]>([]);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: "",
      description: "",
      groupSize: "2",
      tags: "",
      chatTitle: "",
      chatId: "",
    },
  });

  const addTag = (value: string) => {
    if (!value.trim() || tags.length >= MAX_TAGS) return;
    setTags((prev) => [...prev, value.trim()]);
  };

  const removeTag = (label: string) => {
    setTags((prev) => prev.filter((tag) => tag !== label));
  };

  const reset = () => {
    form.reset();
    form.clearErrors();
    setTags([]);
  };

  return {
    form,
    tags,
    addTag,
    removeTag,
    reset,
    MAX_TAGS,
  };
};
