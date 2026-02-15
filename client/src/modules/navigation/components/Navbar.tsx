import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Button } from "@/modules/shared/components/ui/Button";
import { BellIcon } from "lucide-react";
import GlobalSearch from "@/modules/shared/components/GlobalSearch";
import MobileNavigation from "./MobileNavigation";
import User from "@/modules/shared/components/User";

const Navbar = () => {
  return (
    <nav className="background-blue fixed top-0 right-0 left-0 z-50 flex justify-center gap-5 p-4 text-white shadow-sm sm:p-6">
      <div className="flex w-full max-w-7xl items-center justify-between gap-5">
        <Link to="/" className="flex items-center gap-1">
          <img src={logo} alt="Collabify Logo" width={23} height={23} />
          <p className="text-[24px] leading-[31.2px] font-bold max-sm:hidden">Collabify</p>
        </Link>

        <GlobalSearch />

        <div className="flex-between gap-5">
          <Button className="relative cursor-pointer" size="sm">
            <BellIcon />
            <span className="flex-center absolute -top-1 -right-2 z-10 h-5 w-5 rounded-full bg-[#F01C1C] px-1 text-xs">
              4
            </span>
          </Button>

          <User />

          <MobileNavigation />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
