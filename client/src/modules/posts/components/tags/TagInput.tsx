import type { UseFormReturn } from "react-hook-form";
import type { FormSchemaType } from "../../types/types";
import DialogField from "../DialogField";
import PostTag from "../posts/PostTag";
import { Input } from "@/modules/shared/components/ui/Input";

interface TagInputProps {
  form: UseFormReturn<FormSchemaType>;
  tags: string[];
  addTag: (value: string) => void;
  removeTag: (value: string) => void;
  maxTags: number;
}

const TagInput = ({ form, tags, addTag, removeTag, maxTags }: TagInputProps) => {
  return (
    <>
      <DialogField form={form} name="tags" formLabel="Tags">
        {(field) => (
          <Input
            {...field}
            disabled={tags.length >= maxTags}
            type="text"
            placeholder="Add tags..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && field.value) {
                e.preventDefault();
                addTag(field.value);
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
    </>
  );
};

export default TagInput;
