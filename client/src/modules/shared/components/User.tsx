import { Link } from "react-router-dom";
import { convertNameToInitial } from "../lib";
import { cn } from "../lib/utils";
import { Avatar, AvatarFallback } from "./ui/Avatar";

interface UserProps {
  userId: number;
  username?: string;
  className: string;
  fallbackClassName?: string;
}

const User = ({ userId, username, className, fallbackClassName }: UserProps) => {
  const initial = convertNameToInitial(username);
  return (
    <Link to={`/profile/${userId}`}>
      <Avatar className={className}>
        <AvatarFallback className={cn(fallbackClassName, "flex-center cursor-pointer")}>{initial}</AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default User;
