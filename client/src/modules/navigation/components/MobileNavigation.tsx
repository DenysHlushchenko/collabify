import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/modules/shared/components/ui/Sheet";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Menu } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/Button";
import NavLinks from "./NavLinks";
import { useAuthStore } from "@/modules/auth/store/userStore";

const MobileNavigation = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu size={32} className="cursor-pointer sm:hidden" />
      </SheetTrigger>
      <SheetContent side="left" className="border-none bg-white p-6">
        <SheetTitle className="hidden">Navigation</SheetTitle>
        <Link to="/" className="flex items-center gap-1">
          <img src={logo} height={23} width={23} alt="Logo" className="invert" />
          <p className="text-[24px] leading-[31.2px] font-bold">Collabify</p>
        </Link>

        <div className="no-scrollbar flex h-[calc(100vh-32px)] flex-col justify-between overflow-y-auto">
          <SheetClose asChild>
            <section className="flex h-full flex-col gap-6 pt-16">
              <NavLinks isMobileNav={true} />
            </section>
          </SheetClose>

          <div>
            <SheetClose asChild>
              <Button
                className="small-medium min-h-10.25 w-full cursor-pointer rounded-lg bg-black px-4 py-3 text-white shadow-none"
                onClick={handleLogout}
              >
                <span>Logout</span>
              </Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
