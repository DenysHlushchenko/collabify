import { Search } from "lucide-react";
import { Input } from "./ui/Input";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formUrlQuery, removeUrlQuery } from "../lib";

const GlobalSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search");
  const [search, setSearch] = useState(query || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "search",
          value: search,
        });
        navigate(newUrl, { replace: true });
      } else {
        if (query) {
          const newUrl = removeUrlQuery({
            params: searchParams.toString(),
            keysToRemove: ["search"],
          });
          navigate(newUrl, { replace: true });
        }
      }
      return () => clearTimeout(delayDebounceFn);
    }, 300);
  }, [search, navigate, searchParams, query]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  return (
    <div className="relative w-full max-w-150 max-lg:hidden">
      <div className="relative flex min-h-9 grow items-center gap-1 rounded-xl bg-[#487EBD] px-4">
        <Search width={20} height={20} className="cursor-pointer" />
        <Input
          value={search}
          onChange={handleChangeInput}
          type="text"
          placeholder="Search for topic..."
          className="paragraph-regular no-focus placeholder border-none bg-transparent shadow-none outline-none"
        />
      </div>
    </div>
  );
};

export default GlobalSearch;
