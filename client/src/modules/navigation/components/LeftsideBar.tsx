import { Button } from "@/modules/shared/components/ui/Button";
import { LogOut } from "lucide-react";
import NavLinks from "./NavLinks";
import { useAuthStore } from "@/modules/auth/store/userStore";
import { useNavigate } from "react-router-dom";

const LeftsideBar = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <section className="custom-scrollbar sticky top-0 left-0 flex h-screen flex-col justify-between overflow-y-auto border-r border-r-gray-300 p-6 pt-36 max-sm:hidden lg:w-60">
      <div className="flex flex-1 flex-col gap-6">
        <NavLinks isMobileNav={false} />
      </div>

      <div>
        <Button
          className="small-medium background-blue min-h-10.25 w-full cursor-pointer rounded-lg px-4 py-3 text-white shadow-none"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span className="cursor-pointer max-lg:hidden">Logout</span>
        </Button>
      </div>
    </section>
  );
};

export default LeftsideBar;
