import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { convertNameToInitial } from "../utils/utils";
import { Avatar, AvatarFallback } from "./ui/Avatar";
import { useAuthStore } from "@/modules/auth/store/userStore";

interface UserProps {
  username?: string;
  className: string;
  fallbackClassName?: string;
}

const User = ({ username, className, fallbackClassName }: UserProps) => {
  const navigate = useNavigate();
  const currentUser = useAuthStore().getUser();
  const initial = convertNameToInitial(username);
  return (
    <Avatar className={className} onClick={() => navigate(`/profile/${currentUser?.id}`)}>
      <AvatarFallback className={cn(fallbackClassName, "flex-center cursor-pointer bg-[#6395CD] text-white")}>
        {initial}
      </AvatarFallback>
    </Avatar>
  );
};

export default User;
