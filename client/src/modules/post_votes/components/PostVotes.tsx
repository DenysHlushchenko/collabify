import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getPostVote, sendPostVote } from "../api/postVotes";
import type { AxiosError } from "axios";
import likeIcon from "@/assets/like.svg";
import dislikeIcon from "@/assets/dislike.svg";
import { Skeleton } from "@/modules/shared/components/ui/Skeleton";

interface Props {
  postId: number;
  commentId?: number; // for a later feature
}

const PostVotes = ({ postId }: Props) => {
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const { data: postVote, isPending } = useQuery({
    queryKey: ["userVote", postId],
    queryFn: () => getPostVote(postId),
    staleTime: 1000 * 30,
    retry: 1,
  });

  const votesMutation = useMutation({
    mutationFn: sendPostVote,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userVote", postId] });
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
          <button onClick={handleVote} value="like" className="small-medium flex cursor-pointer items-center gap-x-1">
            <img src={likeIcon} alt="Like Icon" />
            <p>
              {postVote?.userVote === "like"
                ? postVote.votesCounts.upvotesCount
                : (postVote?.votesCounts.upvotesCount ?? 0)}
            </p>
          </button>
          <button
            onClick={handleVote}
            value="dislike"
            className="small-medium flex cursor-pointer items-center gap-x-1"
          >
            <img src={dislikeIcon} alt="Dislike Icon" />
            <p>
              {postVote?.userVote === "dislike"
                ? postVote.votesCounts.downvotesCount
                : (postVote?.votesCounts.downvotesCount ?? 0)}
            </p>
          </button>
        </>
      )}

      {error}
    </div>
  );
};

export default PostVotes;
