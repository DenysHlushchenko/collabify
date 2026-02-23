import { usePost } from "@/modules/posts/hooks/usePost";
import { Avatar, AvatarFallback } from "@/modules/shared/components/ui/Avatar";
import { convertNameToInitial, convertToDateString } from "@/modules/shared/utils/utils";
import { Link, useParams } from "react-router-dom";
import Error from "@/modules/shared/components/Error";
import { postFooterItems } from "@/modules/shared/components/constants/links";
import PostTag from "@/modules/posts/components/PostTag";
import type { PostFormValues, PostTagType } from "@/modules/shared/types/types";
import PostFooter from "@/modules/posts/components/PostFooter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/shared/components/ui/DropdownMenu";
import threedots from "@/assets/threedots.svg";
import { useAuthStore } from "@/modules/auth/store/userStore";
import { useState } from "react";
import PostDialogContent from "@/modules/posts/components/PostDialogContent";

const PostDetails = () => {
  const { postId } = useParams();
  const user = useAuthStore().getUser();

  const { usePostQuery, useUpdatePostMutation } = usePost();
  const { data: post, isPending, isError, error } = usePostQuery(Number(postId));
  const updateMutation = useUpdatePostMutation();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleSubmit = (values: PostFormValues) => {
    updateMutation.mutate({
      title: values.title,
      description: values.description,
      groupSize: values.groupSize,
      tags: values.tags,
      postId: Number(postId),
    });
    setDialogOpen(false);
  };

  if (!post) return;
  if (isError) return <Error message={`${error.message}: Sorry, there was an error while fetching post details.`} />;
  if (isPending) return <div>Loading...</div>;

  return (
    <div className="relative rounded-lg border border-[#e6e6e6] p-5">
      <div className="flex-start gap-x-2">
        <Link to={`/profile/${post?.user.id}`}>
          <Avatar className="flex-center h-8 w-8 bg-[#D9D9D9] text-gray-500">
            <AvatarFallback>{convertNameToInitial(post.user.username)}</AvatarFallback>
          </Avatar>
        </Link>
        <p className="body-medium">c/{post.user.username}</p>

        <span className="body-medium text-gray-400">{convertToDateString(post.created_at)}</span>

        {user?.id === post.user.id ? (
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <img className="w-5 cursor-pointer" src={threedots} alt="Three dots" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-none bg-white">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setDialogOpen(true)} className="cursor-pointer hover:bg-gray-100">
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">Delete</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <></>
        )}
      </div>
      <p className="base-medium mt-10">{post.title}</p>
      <p className="body-regular mt-5">{post.description}</p>

      <div className="flex-start mt-10 gap-x-5">
        {postFooterItems.map((item) => (
          <PostFooter key={item.imgUrl} count={10} alt={item.alt} imgSrc={item.imgUrl} />
        ))}
        <div className="absolute right-6 bottom-4 flex gap-x-2">
          {post.postTags.map((postTag: PostTagType) => (
            <PostTag key={postTag.tagId} isDeletable={false} label={postTag.tag.name} removeTag={() => {}} />
          ))}
        </div>

        <PostDialogContent open={dialogOpen} dialog={setDialogOpen} post={post} onSubmit={handleSubmit} mode="edit" />
      </div>
    </div>
  );
};

export default PostDetails;
