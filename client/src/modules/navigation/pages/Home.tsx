import { getPosts } from "@/modules/posts/api/post";
import type { PostType } from "@/modules/shared/types/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const POSTS: PostType[] = [
  {
    id: "1",
    title: "Weekend Hiking Trip",
    description: "Looking for people to join a moderate 8-mile hike this Saturday.",
    groupSize: "5",
    createdAt: "2026-02-18T09:00:00Z",
    updatedAt: "2026-02-18T09:00:00Z",
  },
  {
    id: "2",
    title: "Study Group for Calculus",
    description: "Weekly study sessions to prepare for upcoming exams.",
    groupSize: "4",
    createdAt: "2026-02-17T14:30:00Z",
    updatedAt: "2026-02-17T14:30:00Z",
  },
  {
    id: "3",
    title: "Pickup Basketball",
    description: "Casual full-court games at the community gym. All skill levels welcome.",
    groupSize: "10",
    createdAt: "2026-02-16T18:15:00Z",
    updatedAt: "2026-02-16T18:15:00Z",
  },
  {
    id: "4",
    title: "Book Club Meetup",
    description: "Discussing this month's fiction pick over coffee.",
    groupSize: "6",
    createdAt: "2026-02-15T11:45:00Z",
    updatedAt: "2026-02-15T11:45:00Z",
  },
  {
    id: "5",
    title: "Beginner Yoga Session",
    description: "Guided yoga for beginners focusing on flexibility and relaxation.",
    groupSize: "8",
    createdAt: "2026-02-14T07:20:00Z",
    updatedAt: "2026-02-14T07:20:00Z",
  },
];

const Home = () => {
  const {
    data: posts,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    retry: 2,
  });

  //   if (isPending) return <div>Loading...</div>;
  //   if (isError) return <div>{error.message}</div>;

  return (
    <>
      {POSTS.map((post) => (
        <li key={post.id}>
          {post.title} - {post.description}
        </li>
      ))}
    </>
  );
};

export default Home;
