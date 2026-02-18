import { useAuthStore } from "@/modules/auth/store/userStore";

const User = () => {
  const initial = useAuthStore((state) => {
    const user = state.getUser();
    return user?.username?.charAt(0)?.toUpperCase() ?? "";
  });
  return <span className="flex-center h-10 w-10 rounded-full bg-[#6395CD] p-1 text-sm">{initial}</span>;
};

export default User;
