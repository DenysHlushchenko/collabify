import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import GlobalSearch from "@/modules/shared/components/GlobalSearch";
import MobileNavigation from "./MobileNavigation";
import User from "@/modules/shared/components/User";
import { useCurrentUser } from "@/modules/profile/hooks/useCurrentUser";
import { useAuthStore } from "@/modules/auth/store/userStore";
import Notifications from "@/modules/notification/components/Notifications";

const Navbar = () => {
  const { getUser } = useAuthStore();
  const userId = getUser()?.id;
  const { data: currentUser } = useCurrentUser(userId!);
  return (
    <nav className="background-blue fixed top-0 right-0 left-0 z-50 flex justify-center gap-5 p-4 text-white shadow-sm sm:p-2">
      <div className="flex w-full max-w-7xl items-center justify-between gap-5">
        <Link to="/" className="flex items-center gap-1">
          <img src={logo} alt="Collabify Logo" width={23} height={23} />
          <p className="ml-1 text-[24px] leading-[31.2px] font-bold max-sm:hidden">collabify</p>
        </Link>

        <GlobalSearch />

        <div className="flex-between gap-5">
          <Notifications />
          <User username={currentUser?.user.username} className="h-8 w-8" />
          <MobileNavigation />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
