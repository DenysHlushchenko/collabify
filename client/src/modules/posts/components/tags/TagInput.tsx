import { Controller, useWatch, type Control } from "react-hook-form";
import DialogField from "../DialogField";
import PostTag from "../posts/PostTag";
import { Input } from "@/modules/shared/components/ui/Input";
import type { PostFormInput, PostFormOutput } from "@/modules/shared/lib/validators";
import Error from "@/modules/shared/components/Error";

interface TagInputProps {
  control: Control<PostFormInput, unknown, PostFormOutput>;
  addTag: (value: string) => void;
  removeTag: (value: string) => void;
  maxTags: number;
}

const TagInput = ({ control, addTag, removeTag, maxTags }: TagInputProps) => {
  const tags =
    useWatch({
      control,
      name: "tags",
    }) ?? [];

  return (
    <>
      <DialogField control={control} name="tagInput" formLabel="Tags">
        {(field) => (
          <Input
            {...field}
            disabled={tags.length >= maxTags}
            type="text"
            placeholder="Add tags..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && field.value) {
                e.preventDefault();
                addTag(field.value as string);
                field.onChange("");
              }
            }}
          />
        )}
      </DialogField>

      <div className="flex gap-1">
        {tags.map((tag) => (
          <PostTag key={tag} isDeletable label={tag} removeTag={removeTag} />
        ))}
      </div>

      <Controller
        control={control}
        name="tags"
        render={({ fieldState }) => <>{fieldState.error && <Error message={fieldState.error.message} />}</>}
      />
    </>
  );
};

export default TagInput;
