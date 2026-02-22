import { cn } from "../lib/utils";
import { convertNameToInitial } from "../utils/utils";
import { Avatar, AvatarFallback } from "./ui/Avatar";

interface UserProps {
  username?: string;
  className: string;
  fallbackClassName?: string;
}

const User = ({ username, className, fallbackClassName }: UserProps) => {
  const initial = convertNameToInitial(username);
  return (
    <Avatar className={className}>
      <AvatarFallback className={cn(fallbackClassName, "flex-center bg-[#6395CD] text-white")}>
        {initial}
      </AvatarFallback>
    </Avatar>
  );
};

export default User;
