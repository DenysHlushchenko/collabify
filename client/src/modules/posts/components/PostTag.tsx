import { Badge } from "@/modules/shared/components/ui/Badge";
import close from "@/assets/close.svg";
import type { ControllerRenderProps } from "react-hook-form";
import type { PostSchema } from "@/modules/shared/lib/validators";
import type z from "zod";

interface TagProps {
  tag: string;
  field?: ControllerRenderProps<z.infer<typeof PostSchema>, "tags">;
  isDeletable: boolean;
  handleRemoveTag?: (tag: string, field: ControllerRenderProps<z.infer<typeof PostSchema>, "tags">) => void;
}

const PostTag = ({ tag, field, isDeletable, handleRemoveTag }: TagProps) => {
  return (
    <Badge
      key={tag}
      className="subtle-medium flex items-center justify-center gap-2 rounded-md border-none bg-[#ececec] px-3 py-1 capitalize"
      onClick={() => handleRemoveTag && handleRemoveTag(tag, field!)}
    >
      {tag}
      {isDeletable && (
        <img src={close} width={12} height={12} alt="Close icon" className="cursor-pointer object-contain invert-0" />
      )}
    </Badge>
  );
};

export default PostTag;
