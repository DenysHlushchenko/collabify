import createPostGif from "@/assets/create-post.gif";
import viewProfileGif from "@/assets/view-profile.gif";
import sendJoinRequestGif from "@/assets/join.gif";
import enterChatRoomGif from "@/assets/chat.gif";
import addCommentGif from "@/assets/comment.gif";

export const guideSteps = [
  {
    id: 1,
    title: "Create a Post",
    description: "Learn how to share your ideas and collaborate with others",
    gif: createPostGif,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">How to Create a Post</h3>
      </div>
    ),
  },
  {
    id: 2,
    title: "Visit Your Profile",
    description: "Explore your user profile and manage your information",
    gif: viewProfileGif,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">How to Go to Your Profile</h3>
      </div>
    ),
  },
  {
    id: 3,
    title: "Send a Join Request",
    description: "Join collaboration groups and send requests to join posts",
    gif: sendJoinRequestGif,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">How to Send a Join Request</h3>
      </div>
    ),
  },
  {
    id: 4,
    title: "Enter a Chat Room",
    description: "Start messaging and collaborating with your team",
    gif: enterChatRoomGif,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">How to Enter a Chat Room</h3>
      </div>
    ),
  },
  {
    id: 5,
    title: "Add a Comment",
    description: "Share your thoughts and engage with posts and discussions",
    gif: addCommentGif,
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">How to Add a Comment</h3>
      </div>
    ),
  },
];
