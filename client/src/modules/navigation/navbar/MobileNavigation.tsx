import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/modules/shared/components/ui/Sheet";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Menu } from "lucide-react";
import { Button } from "@/modules/shared/components/ui/Button";
import NavLinks from "./NavLinks";

const MobileNavigation = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu size={32} className="cursor-pointer sm:hidden" />
      </SheetTrigger>
      <SheetContent side="left" className="p-6 bg-white border-none">
        <SheetTitle className="hidden">Navigation</SheetTitle>
        <Link to="/" className="flex items-center gap-1">
          <img
            src={logo}
            height={23}
            width={23}
            alt="Logo"
            className="invert"
          />
          <p className="text-[24px] font-bold leading-[31.2px]">Collabify</p>
        </Link>

        <div className="no-scrollbar flex h-[calc(100vh-32px)] flex-col justify-between overflow-y-auto">
          <SheetClose asChild>
            <section className="flex h-full flex-col gap-6 pt-16">
              <NavLinks isMobileNav={true} />
            </section>
          </SheetClose>

          <div>
            <SheetClose asChild>
              <Button className="small-medium min-h-10.25 w-full rounded-lg px-4 py-3 shadow-none cursor-pointer bg-black text-white">
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
