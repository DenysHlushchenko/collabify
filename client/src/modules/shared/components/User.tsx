import { useAuthStore } from "@/modules/auth/store/userStore";
import { convertNameToInitial } from "../utils/utils";
import { Avatar, AvatarFallback } from "./ui/Avatar";

const User = () => {
  const initial = useAuthStore((state) => {
    const user = state.getUser();
    return convertNameToInitial(user?.username);
  });
  return (
    <Avatar className="h-9 w-9">
      <AvatarFallback className="flex-center bg-[#6395CD]">{initial}</AvatarFallback>
    </Avatar>
  );
};

export default User;
