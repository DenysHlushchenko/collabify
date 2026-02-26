import type { CommentType } from "@/modules/shared/types/types";
import { convertNameToInitial, convertToDateString } from "@/modules/shared/utils/utils";
import { Avatar, AvatarFallback } from "@/modules/shared/components/ui/Avatar";
import { Link } from "react-router-dom";
import RichTextViewer from "./editor/RichTextViewer";
import { Button } from "@/modules/shared/components/ui/Button";

interface CommentProps {
  comment: CommentType;
  onDelete: (commentId: number) => void;
  isOwnComment?: boolean;
}

const Comment = ({ comment, onDelete, isOwnComment }: CommentProps) => {
  return (
    <article className="border-b py-10">
      <div className="mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex flex-1 items-start gap-1 sm:items-center">
          <Link to={`/profile/${comment.sender.id}`}>
            <Avatar className="flex-center bg-[#D9D9D9] text-gray-500">
              <AvatarFallback>{convertNameToInitial(comment.sender.username)}</AvatarFallback>
            </Avatar>
          </Link>

          <div className="ml-1 flex flex-col sm:flex-row sm:items-center">
            <p className="body-semibold">{comment.sender.username}</p>

            <p className="small-regular mt-0.5 ml-0.5 line-clamp-1">
              <span className="max-sm:hidden"> • </span>
              commented {convertToDateString(comment.created_at)}
            </p>
          </div>
        </div>
        {isOwnComment && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              className="small-medium flex h-7 w-15 cursor-pointer rounded-md border border-[#e8edf3] text-center text-black hover:bg-[#f2f6fa]"
              onClick={() => onDelete(comment.id)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      <RichTextViewer content={comment.message} className="border-l-2 border-gray-200 px-1 py-2 pl-4" />
    </article>
  );
};

export default Comment;
