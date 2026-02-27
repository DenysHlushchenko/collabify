import { Skeleton } from "@/modules/shared/components/ui/Skeleton";
import Error from "@/modules/shared/components/Error";
import { cn } from "@/modules/shared/lib/utils";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import type { VoteResponse } from "@/modules/shared/types/types";
import type { UseMutationResult } from "@tanstack/react-query";

interface Props {
  entityId: number;
  voteData?: VoteResponse;
  voteMutation: UseMutationResult<
    void,
    Error,
    {
      entityId: number;
      type: "like" | "dislike" | null;
    },
    unknown
  >;
  isPending?: boolean;
}

const Votes = ({ entityId, voteData, voteMutation, isPending }: Props) => {
  const userVote = voteData?.userVote;

  const handleVote = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    voteMutation.mutate({
      entityId,
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
            <p>{voteData?.votesCounts.upvotesCount ?? 0}</p>
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
            <p>{voteData?.votesCounts.downvotesCount ?? 0}</p>
          </button>
          {voteMutation.error && <Error message={voteMutation.error.message} />}
        </>
      )}
    </div>
  );
};

export default Votes;
