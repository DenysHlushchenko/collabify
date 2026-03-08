import { usePost } from "@/modules/posts/hooks/usePost";
import { useNavigate, useParams } from "react-router-dom";
import Error from "@/modules/shared/components/Error";
import PostTag from "@/modules/posts/components/PostTag";
import type { PostFormValues, PostTagType } from "@/modules/shared/types/types";
import PostForm from "@/modules/posts/components/dialogs/PostForm";
import { useAuthStore } from "@/modules/auth/store/userStore";
import DeleteDialog from "@/modules/shared/components/dialogs/DeleteDialog";
import { PostDetailsSkeleton } from "../components/PostSkeletons";
import Comments from "@/modules/comments/components/Comments";
import Votes from "@/modules/votes/components/Votes";
import useVote from "@/modules/votes/hooks/useVote";
import { convertToDateString } from "@/modules/shared/lib";
import User from "@/modules/shared/components/User";

const PostDetails = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const loggedInUser = useAuthStore().getUser();

  const { usePostQuery, useUpdatePostMutation, useDeletePostMutation } = usePost();
  const { data: postDetails, isPending, isError, error } = usePostQuery(Number(postId));
  const updateMutation = useUpdatePostMutation();
  const deleteMutation = useDeletePostMutation();

  const { usePostVoteQuery, useCreatePostVoteMutation } = useVote();
  const { data: voteData, isPending: isVotePending } = usePostVoteQuery(Number(postId));
  const voteMutation = useCreatePostVoteMutation(Number(postId));

  if (isPending) return <PostDetailsSkeleton />;
  if (isError) return <Error message={`${error.message}: Sorry, there was an error while fetching post details.`} />;
  if (!postDetails) return null;

  const submitPost = (values: PostFormValues) => {
    updateMutation.mutate({
      postId: Number(postId),
      title: values.title,
      description: values.description,
      groupSize: values.groupSize,
      tags: values.tags,
    });
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(postDetails.id);
    navigate("/posts");
  };

  return (
    <>
      <div className="relative rounded-lg border border-[#e6e6e6] p-5">
        <div className="flex-start gap-x-2">
          <User
            userId={postDetails.user.id}
            username={postDetails.user.username}
            className="flex-center h-8 w-8 bg-[#D9D9D9] text-gray-500"
          />
          <p className="body-medium">c/{postDetails.user.username}</p>
          <span className="body-medium text-gray-400">{convertToDateString(postDetails.created_at)}</span>
          <div className="absolute right-4 bottom-4 ml-auto flex gap-x-2 sm:static">
            <PostForm type="edit" submitPost={submitPost} postDetails={postDetails} />
            {postDetails && loggedInUser?.id === postDetails.user.id && <DeleteDialog handleDelete={handleDelete} />}
          </div>
        </div>

        <div className="absolute top-16 left-5 flex gap-x-2">
          {postDetails.postTags.map((postTag: PostTagType) => (
            <PostTag key={postTag.tagId} isDeletable={false} tag={postTag.tag.name} />
          ))}
        </div>

        <p className="base-medium mt-10">{postDetails.title}</p>
        <p className="body-regular mt-5">{postDetails.description}</p>

        <div className="mt-5">
          <Votes entityId={Number(postId)} voteData={voteData} voteMutation={voteMutation} isPending={isVotePending} />
        </div>
      </div>

      <Comments />
    </>
  );
};

export default PostDetails;
