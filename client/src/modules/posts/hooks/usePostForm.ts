import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostSchema, type PostFormInput, type PostFormOutput } from "@/modules/shared/lib/validators";

const MAX_TAGS = 3;

type Mode = "create" | "edit";

interface UsePostFormOptions {
  mode?: Mode;
  defaultValues?: Partial<PostFormInput>;
}

export const usePostForm = ({ mode = "create", defaultValues }: UsePostFormOptions) => {
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
      ...defaultValues,
    },
  });

  const tags =
    useWatch({
      control: form.control,
      name: "tags",
    }) ?? [];

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
    const currentTags = form.getValues("tags");
    form.setValue(
      "tags",
      currentTags.filter((t) => t !== label),
      { shouldValidate: true }
    );
  };

  return {
    form,
    tags,
    addTag,
    removeTag,
    MAX_TAGS,
    isCreateMode: mode === "create",
  };
};
