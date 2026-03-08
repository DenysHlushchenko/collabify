import { useAuthStore } from "@/modules/auth/store/userStore";
import { sidebarLinks } from "@/modules/shared/components/constants/links";
import { SheetClose } from "@/modules/shared/components/ui/Sheet";
import { cn } from "@/modules/shared/lib/utils";
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavLinksProps {
  isMobileNav: boolean;
}

interface Item {
  imgUrl: string;
  link: string;
  name: string;
}

const NavLinks = ({ isMobileNav }: NavLinksProps) => {
  const location = useLocation();
  const pathname = location.pathname;
  const { getUser } = useAuthStore();
  return (
    <>
      {sidebarLinks.map((item: Item) => {
        let link = item.link;
        if (item.name === "Profile") {
          link = `/profile/${getUser()?.id}`;
        }
        const isActive = (pathname.includes(link) && link.length > 1) || pathname === link;
        const LinkComponent = (
          <Link
            to={link}
            key={item.name}
            className={cn(
              "flex items-center justify-start gap-4 p-4 hover:rounded-lg hover:bg-[#e8edf3]",
              isActive && "rounded-lg bg-[#e8edf3] font-semibold"
            )}
          >
            <img src={item.imgUrl} alt={item.name} width={20} height={20} className="invert" />
            <p className={cn(isActive ? "base-bold" : "base-medium", !isMobileNav && "max-lg:hidden")}>{item.name}</p>
          </Link>
        );

        return isMobileNav ? (
          <SheetClose asChild key={item.name}>
            {LinkComponent}
          </SheetClose>
        ) : (
          <React.Fragment key={item.name}>{LinkComponent}</React.Fragment>
        );
      })}
    </>
  );
};

export default NavLinks;
