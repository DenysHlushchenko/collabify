import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostSchema, type PostFormInput, type PostFormOutput } from "@/modules/shared/lib/validators";

const MAX_TAGS = 3;

export const usePostForm = () => {
  const form = useForm<PostFormInput, unknown, PostFormOutput>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: "",
      description: "",
      groupSize: "2",
      tags: [],
      tagInput: "",
      chatTitle: "",
      chatId: "",
    },
  });

  const tags = form.watch("tags");

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const currentTags = form.getValues("tags");

    if (currentTags.length >= MAX_TAGS) return;

    form.setValue("tags", [...currentTags, trimmed], {
      shouldValidate: true,
    });
  };

  const removeTag = (label: string) => {
    form.setValue(
      "tags",
      tags.filter((tag) => tag !== label),
      { shouldValidate: true }
    );
  };

  const reset = () => {
    form.reset();
    form.clearErrors();
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
