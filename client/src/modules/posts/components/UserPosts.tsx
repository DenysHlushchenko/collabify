import type { PostType } from "@/modules/shared/types/types";

import Post from "@/modules/posts/components/Post";

const UserPosts = ({ posts }: { posts: PostType[] }) => {
  return (
    <div>
      {posts.length !== 0 ? (
        posts.map((post: PostType) => <Post key={post.id} post={post} />)
      ) : (
        <h1 className="text-center text-sm">No posts yet!</h1>
      )}
    </div>
  );
};

export default UserPosts;
