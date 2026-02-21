import { Search } from "lucide-react";
import { Input } from "./ui/Input";
import { useState } from "react";

const GlobalSearch = () => {
  const [search, setSearch] = useState("");
  return (
    <div className="relative w-full max-w-150 max-lg:hidden">
      <div className="relative flex min-h-9 grow items-center gap-1 rounded-xl bg-[#487EBD] px-4">
        <Search width={20} height={20} className="cursor-pointer" />
        <Input
          value={search}
          onChange={() => {}}
          type="text"
          placeholder="Search for topic..."
          className="paragraph-regular no-focus border-none bg-transparent shadow-none outline-none"
        />
      </div>
    </div>
  );
};

export default GlobalSearch;
