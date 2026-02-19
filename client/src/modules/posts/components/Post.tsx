import { postFooterItems } from "@/constants/links";
import { Avatar, AvatarFallback } from "@/modules/shared/components/ui/Avatar";
import { Button } from "@/modules/shared/components/ui/Button";
import { Separator } from "@/modules/shared/components/ui/Separator";
import type { PostType } from "@/modules/shared/types/types";
import { convertNameToInitial, convertToDateString } from "@/modules/shared/utils/utils";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/modules/shared/components/ui/Card";

const MAX_DESCRIPTION_LENGTH = 90;

interface PostFooterProps {
  count: number;
  imgSrc: string;
  alt: string;
}

const PostFooter = (props: PostFooterProps) => {
  return (
    <div className="small-medium flex cursor-pointer items-center gap-x-1">
      <img src={props.imgSrc} alt={props.alt} />
      <p>{props.count}</p>
    </div>
  );
};

const Post = ({ post }: { post: PostType }) => {
  const desc = post.description;
  const adjustedDesc = desc.length >= MAX_DESCRIPTION_LENGTH ? `${desc.substring(0, 90)}...` : desc;

  return (
    <>
      <Card className="border-gray">
        <CardHeader>
          <CardTitle className="small-semibold post-author-color">
            <div className="flex-start gap-x-2">
              <Avatar className="flex-center bg-[#D9D9D9] text-gray-500">
                <AvatarFallback>{convertNameToInitial(post.user.username)}</AvatarFallback>
              </Avatar>
              <p>c/{post.user.username}</p>
              <span className="text-gray-400">{convertToDateString(post.created_at)}</span>
            </div>
          </CardTitle>

          <CardDescription className="base-medium">{post.title}</CardDescription>
          <CardDescription className="base-small">{adjustedDesc}</CardDescription>
          <CardAction>
            <Button className="body-semibold h-7 w-16 cursor-pointer rounded-lg bg-[#99dfc4] text-[#2d634e]">
              Join
            </Button>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-start relative gap-x-5">
          {postFooterItems.map((item) => (
            <PostFooter key={item.imgUrl} count={10} alt={item.alt} imgSrc={item.imgUrl} />
          ))}
        </CardFooter>
      </Card>
      <Separator className="border-gray my-5" />
    </>
  );
};

export default Post;
