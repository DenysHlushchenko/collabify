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
  return (
    <>
      {sidebarLinks.map((item: Item) => {
        const isActive = (pathname.includes(item.link) && item.link.length > 1) || pathname === item.link;
        const LinkComponent = (
          <Link
            to={item.link}
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
