import type { CommentType } from "@/modules/shared/types/types";
import CommentForm from "../forms/CommentForm";
import CommentsSkeleton from "./CommentsSkeleton";
import Error from "@/modules/shared/components/Error";
import Comment from "./Comment";
import { useComments } from "../hooks/useComments";

const Comments = () => {
  const { comments, isLoading, isError, errorMessage, isCreating, handleSubmit, handleDelete, currentUserId } =
    useComments();

  if (isLoading) return <CommentsSkeleton />;

  if (isError) {
    return <Error message={errorMessage || "Failed to load comments. Please try again."} />;
  }

  const totalComments = comments.length;

  return (
    <div>
      <h3 className="base-medium mt-10">Post your comment here</h3>
      <CommentForm submitComment={handleSubmit} isSubmitting={isCreating} error={errorMessage} />
      <h3 className="base-medium">
        {totalComments} {totalComments === 1 ? "Comment" : "Comments"}
      </h3>
      {comments.length > 0 ? (
        <div>
          {comments?.map((comment: CommentType) => (
            <Comment
              key={comment.id}
              comment={comment}
              onDelete={handleDelete}
              isOwnComment={comment.sender.id === currentUserId}
            />
          ))}
        </div>
      ) : (
        <h1 className="pt-10 text-center text-sm">No comments yet!</h1>
      )}
    </div>
  );
};

export default Comments;
