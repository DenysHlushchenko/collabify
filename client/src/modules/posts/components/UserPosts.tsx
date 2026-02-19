import type { PostType } from "@/modules/shared/types/types";

import Post from "@/modules/posts/components/Post";

const UserPosts = ({ posts }: { posts: PostType[] }) => {
  return (
    <div>
      {posts?.map((post: PostType) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default UserPosts;
