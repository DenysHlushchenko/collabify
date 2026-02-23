import { postFooterItems } from "@/modules/shared/components/constants/links";
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

const MAX_DESCRIPTION_LENGTH = 90;

interface PostFooterProps {
  count: number;
  imgSrc: string;
  alt: string;
}

interface PostProps {
  post: PostType;
  isUserPost: boolean;
}

const Post = ({ post, isUserPost }: PostProps) => {
  const desc = post.description;
  const adjustedDesc = desc.length >= MAX_DESCRIPTION_LENGTH ? `${desc.substring(0, MAX_DESCRIPTION_LENGTH)}...` : desc;

  const PostFooter = (props: PostFooterProps) => {
    return (
      <div className="small-medium flex cursor-pointer items-center gap-x-1">
        <img src={props.imgSrc} alt={props.alt} />
        <p>{props.count}</p>
      </div>
    );
  };

  return (
    <>
      <Card className="border-gray relative">
        <CardHeader className="">
          <CardTitle className="small-semibold post-author-color">
            <div className="flex-start gap-x-2">
              {!isUserPost && (
                <>
                  <Link to={`/profile/${post.user.id}`}>
                    <Avatar className="flex-center bg-[#D9D9D9] text-gray-500">
                      <AvatarFallback>{convertNameToInitial(post.user.username)}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <p>c/{post.user.username}</p>
                </>
              )}
              <span className="text-gray-400">{convertToDateString(post.created_at)}</span>
            </div>
          </CardTitle>

          <CardDescription className="body-medium">{post.title}</CardDescription>
          <CardDescription className="small-regular">{adjustedDesc}</CardDescription>
          <CardAction>
            <Button className="body-semibold h-6 w-16 cursor-pointer rounded-lg bg-[#99dfc4] text-[#2d634e] hover:bg-[#acf0d6]">
              Join
            </Button>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-start gap-x-5">
          {postFooterItems.map((item) => (
            <PostFooter key={item.imgUrl} count={10} alt={item.alt} imgSrc={item.imgUrl} />
          ))}
          <div className="absolute right-6 bottom-2 flex gap-x-2">
            {post.postTags.map((postTag: PostTagType) => (
              <PostTag key={postTag.tagId} isDeletable={false} label={postTag.tag.name} removeTag={() => {}} />
            ))}
          </div>
        </CardFooter>
      </Card>
      <Separator className="border-gray my-5" />
    </>
  );
};

export default Post;
