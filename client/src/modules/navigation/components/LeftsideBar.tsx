import { Button } from "@/modules/shared/components/ui/Button";
import { LogOut } from "lucide-react";
import NavLinks from "./NavLinks";

const LeftsideBar = () => {
  return (
    <section className="custom-scrollbar sticky top-0 left-0 flex h-screen flex-col justify-between overflow-y-auto border-r border-r-gray-300 p-6 pt-36 max-sm:hidden lg:w-66.5">
      <div className="flex flex-1 flex-col gap-6">
        <NavLinks isMobileNav={false} />
      </div>

      <div>
        <div>
          <Button className="small-medium min-h-10.25 w-full cursor-pointer rounded-lg bg-black px-4 py-3 text-white shadow-none">
            <LogOut size={20} />
            <span className="max-lg:hidden">Logout</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LeftsideBar;
