import homeIcon from "@/assets/home.svg";
import messagesIcon from "@/assets/messages.svg";
import tagIcon from "@/assets/tag.svg";
import postsIcon from "@/assets/posts.svg";
import likeIcon from "@/assets/like.svg";
import dislikeIcon from "@/assets/dislike.svg";
import commentIcon from "@/assets/comment.svg";

export const sidebarLinks = [
  {
    imgUrl: homeIcon,
    link: "/",
    name: "Home",
  },
  {
    imgUrl: messagesIcon,
    link: "/messages",
    name: "Messages",
  },
  {
    imgUrl: tagIcon,
    link: "/tags",
    name: "Tags",
  },
  {
    imgUrl: postsIcon,
    link: "/posts",
    name: "Posts",
  },
];

export const genders = ["male", "female", "other"];

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
