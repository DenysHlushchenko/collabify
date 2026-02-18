import { useAuthStore } from "@/modules/auth/store/userStore";
import { convertNameToInitial } from "../utils/utils";
import { Avatar } from "./ui/Avatar";

const User = () => {
  const initial = useAuthStore((state) => {
    const user = state.getUser();
    return convertNameToInitial(user?.username);
  });
  return <Avatar className="flex-center h-9 w-9 bg-[#6395CD]">{initial}</Avatar>;
};

export default User;
