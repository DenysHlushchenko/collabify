import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Button } from "@/modules/shared/components/ui/Button";
import { BellIcon } from "lucide-react";
import GlobalSearch from "@/modules/shared/components/GlobalSearch";
import MobileNavigation from "./MobileNavigation";
import User from "@/modules/shared/components/User";

const Navbar = () => {
  return (
    <nav className="flex justify-center background-blue z-50 p-4 sm:p-6 shadow-sm gap-5 text-white fixed top-0 left-0 right-0">
      <div className="w-full max-w-7xl flex justify-between items-center gap-5">
        <Link to="/" className="flex items-center gap-1">
          <img src={logo} alt="Collabify Logo" width={23} height={23} />
          <p className="text-[24px] font-bold leading-[31.2px] max-sm:hidden">
            Collabify
          </p>
        </Link>

        <GlobalSearch />

        <div className="flex-between gap-5">
          <Button className="relative cursor-pointer" size="sm">
            <BellIcon />
            <span className="flex-center -top-1 -right-2 absolute z-10 h-5 w-5 rounded-full px-1 text-xs bg-[#F01C1C]">
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
