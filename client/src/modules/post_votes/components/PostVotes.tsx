import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getPostVote, sendPostVote } from "../api/postVotes";
import type { AxiosError } from "axios";
import { Skeleton } from "@/modules/shared/components/ui/Skeleton";
import Error from "@/modules/shared/components/Error";
import { cn } from "@/modules/shared/lib/utils";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";

interface Props {
  postId: number;
  commentId?: number; // for a later feature
}

const PostVotes = ({ postId }: Props) => {
  const [error, setError] = useState<string>("");
  const queryClient = useQueryClient();

  const { data: postVote, isPending } = useQuery({
    queryKey: ["userVote", postId],
    queryFn: () => getPostVote(postId),
    staleTime: 1000 * 30,
    retry: 1,
  });

  const userVote = postVote?.userVote;

  const votesMutation = useMutation({
    mutationFn: sendPostVote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userVote", postId] });
      setError("");
    },

    onError: (error) => {
      const axiosError = error as AxiosError<{ message: string }>;
      const backendError = axiosError.response?.data?.message || "Something went wrong. Please try again.";
      console.error("Post vote creation failed: ", error);
      setError(backendError);
    },
  });

  const handleVote = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    votesMutation.mutate({
      postId,
      type: e.currentTarget.value as "like" | "dislike" | null,
    });
  };

  return (
    <div className="flex gap-x-2">
      {isPending ? (
        <Skeleton className="h-5 w-10" />
      ) : (
        <>
          <button
            onClick={handleVote}
            aria-label="Upvote post"
            value="like"
            className="small-medium flex cursor-pointer items-center gap-x-1"
          >
            <ArrowBigUp
              className={cn("h-4 w-4 transition-colors", userVote === "like" ? "fill-black stroke-black" : "fill-none")}
            />
            <p>{postVote?.votesCounts.upvotesCount ?? 0}</p>
          </button>
          <button
            onClick={handleVote}
            value="dislike"
            aria-label="Downvote post"
            className="small-medium flex cursor-pointer items-center gap-x-1"
          >
            <ArrowBigDown
              className={cn(
                "h-4 w-4 transition-colors",
                userVote === "dislike" ? "fill-black stroke-black" : "fill-none"
              )}
            />
            <p>{postVote?.votesCounts.downvotesCount ?? 0}</p>
          </button>
          {error && <Error message={error} />}
        </>
      )}
    </div>
  );
};

export default PostVotes;
