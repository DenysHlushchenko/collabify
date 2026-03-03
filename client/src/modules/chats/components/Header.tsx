import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="mb-8 flex w-full items-center justify-between bg-white px-4 py-3 shadow-sm sm:px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Link to="/chats" className="block cursor-pointer text-sky-500 transition hover:text-sky-500 lg:hidden">
          <ChevronLeft size={32} />
        </Link>
        <div className="flex flex-col">
          <div>Group Title</div>
          <div className="text-sm font-light text-neutral-500">3 members</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
