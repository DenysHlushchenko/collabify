import { Avatar, AvatarFallback } from "@/modules/shared/components/ui/Avatar";
import { Button } from "@/modules/shared/components/ui/Button";
import { Separator } from "@/modules/shared/components/ui/Separator";
import type { PostTagType, PostType } from "@/modules/shared/types/types";
import { convertNameToInitial, convertToDateString } from "@/modules/shared/utils/utils";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/modules/shared/components/ui/Card";
import PostTag from "./PostTag";
import { Link } from "react-router-dom";

import Votes from "@/modules/votes/components/Votes";
import useVote from "@/modules/votes/hooks/useVote";
import { useSocket } from "@/modules/socket/context/SocketContext";
import { useAuthStore } from "@/modules/auth/store/userStore";

const MAX_DESCRIPTION_LENGTH = 90;

interface PostProps {
  post: PostType;
}

const Post = ({ post }: PostProps) => {
  const desc = post.description;
  const adjustedDesc = desc.length >= MAX_DESCRIPTION_LENGTH ? `${desc.substring(0, MAX_DESCRIPTION_LENGTH)}...` : desc;

  const { socket } = useSocket();
  const user = useAuthStore().getUser();

  const { usePostVoteQuery, useCreatePostVoteMutation } = useVote();
  const { data, isPending } = usePostVoteQuery(post.id);
  const mutation = useCreatePostVoteMutation(post.id);

  const handleJoinRequest = () => {
    socket.emit("joinRequest", {
      requestUserId: user?.id,
      postCreatorId: post.user.id,
      postId: post.id,
    });
  };

  return (
    <>
      <Card className="border-gray relative">
        <CardHeader>
          <CardTitle className="small-semibold post-author-color">
            <div className="flex-start gap-x-2">
              <Link to={`/profile/${post.user.id}`}>
                <Avatar className="flex-center bg-[#D9D9D9] text-gray-500">
                  <AvatarFallback>{convertNameToInitial(post.user.username)}</AvatarFallback>
                </Avatar>
              </Link>
              <p>c/{post.user.username}</p>

              <span className="hidden text-gray-400 sm:block">{convertToDateString(post.created_at)}</span>
            </div>
          </CardTitle>

          <Link to={`/posts/${post.id}`} className="flex cursor-pointer flex-col gap-2">
            <CardDescription className="body-medium">{post.title}</CardDescription>
            <CardDescription className="small-regular">{adjustedDesc}</CardDescription>
          </Link>
          <CardAction>
            <Button
              onClick={handleJoinRequest}
              className="body-semibold h-6 w-16 cursor-pointer rounded-lg bg-[#99dfc4] text-[#2d634e] hover:bg-[#acf0d6]"
            >
              Join
            </Button>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-start gap-x-5">
          <Votes entityId={post.id} voteData={data} voteMutation={mutation} isPending={isPending} />

          <div className="absolute right-6 bottom-2 flex gap-x-2">
            {post.postTags.map((postTag: PostTagType) => (
              <PostTag key={postTag.tagId} isDeletable={false} tag={postTag.tag.name} />
            ))}
          </div>
        </CardFooter>
      </Card>
      <Separator className="border-gray my-5" />
    </>
  );
};

export default Post;
