import { usePost } from "@/modules/posts/hooks/usePost";
import { Avatar, AvatarFallback } from "@/modules/shared/components/ui/Avatar";
import { convertNameToInitial, convertToDateString } from "@/modules/shared/utils/utils";
import { Link, useNavigate, useParams } from "react-router-dom";
import Error from "@/modules/shared/components/Error";
import { postFooterItems } from "@/modules/shared/components/constants/links";
import PostTag from "@/modules/posts/components/PostTag";
import type { PostFormValues, PostTagType } from "@/modules/shared/types/types";
import PostFooter from "@/modules/posts/components/PostFooter";
import PostForm from "@/modules/shared/components/forms/PostForm";
import { Button } from "@/modules/shared/components/ui/Button";

const PostDetails = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const { usePostQuery, useUpdatePostMutation, useDeletePostMutation } = usePost();
  const { data: postDetails, isPending, isError, error } = usePostQuery(Number(postId));
  const updateMutation = useUpdatePostMutation();
  const deleteMutation = useDeletePostMutation();

  if (!postDetails) return;
  if (isError) return <Error message={`${error.message}: Sorry, there was an error while fetching post details.`} />;
  if (isPending) return <div>Loading...</div>;

  const submitPost = (values: PostFormValues) => {
    updateMutation.mutate({
      postId: Number(postId),
      title: values.title,
      description: values.description,
      groupSize: values.groupSize,
      tags: values.tags,
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(postDetails.id);
    navigate("/posts");
  };

  return (
    <div className="relative rounded-lg border border-[#e6e6e6] p-5">
      <div className="flex-start gap-x-2">
        <Link to={`/profile/${postDetails?.user.id}`}>
          <Avatar className="flex-center h-8 w-8 bg-[#D9D9D9] text-gray-500">
            <AvatarFallback>{convertNameToInitial(postDetails.user.username)}</AvatarFallback>
          </Avatar>
        </Link>
        <p className="body-medium">c/{postDetails.user.username}</p>
        <span className="body-medium text-gray-400">{convertToDateString(postDetails.created_at)}</span>
        <div className="ml-auto flex gap-x-2">
          <PostForm type="edit" submitPost={submitPost} postDetails={postDetails} />
          {postDetails && (
            <Button
              onClick={handleDelete}
              variant="outline"
              className="small-medium flex h-7 w-15 cursor-pointer rounded-md border border-[#e8edf3] text-center text-black hover:bg-[#f2f6fa]"
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="absolute top-16 left-5 flex gap-x-2">
        {postDetails.postTags.map((postTag: PostTagType) => (
          <PostTag key={postTag.tagId} isDeletable={false} label={postTag.tag.name} removeTag={() => {}} />
        ))}
      </div>

      <p className="base-medium mt-10">{postDetails.title}</p>
      <p className="body-regular mt-5">{postDetails.description}</p>

      <div className="flex-start mt-10 gap-x-5">
        {postFooterItems.map((item) => (
          <PostFooter key={item.imgUrl} count={10} alt={item.alt} imgSrc={item.imgUrl} />
        ))}
      </div>
    </div>
  );
};

export default PostDetails;
