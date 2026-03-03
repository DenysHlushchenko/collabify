import homeIcon from "@/assets/home.svg";
import messagesIcon from "@/assets/messages.svg";
import postsIcon from "@/assets/posts.svg";
import likeIcon from "@/assets/like.svg";
import dislikeIcon from "@/assets/dislike.svg";
import commentIcon from "@/assets/comment.svg";
import profileIcon from "@/assets/user.svg";

export const sidebarLinks = [
  {
    imgUrl: homeIcon,
    link: "/",
    name: "Home",
  },
  {
    imgUrl: messagesIcon,
    link: "/chats",
    name: "Chats",
  },

  {
    imgUrl: postsIcon,
    link: "/posts",
    name: "My Posts",
  },
  {
    imgUrl: profileIcon,
    link: "/profile/:userId",
    name: "Profile",
  },
];

export const genders = ["male", "female", "other"];
export const roles = ["learner", "organizer"];

export const postFooterItems = [
  {
    imgUrl: likeIcon,
    alt: "Like",
  },
  {
    imgUrl: dislikeIcon,
    alt: "Dislike",
  },
  {
    imgUrl: commentIcon,
    alt: "Comments",
  },
];

export const postsFilters = [
  { name: "Newest", value: "DESC" },
  { name: "Oldest", value: "ASC" },
];
