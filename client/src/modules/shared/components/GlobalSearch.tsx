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
    <div className="relative w-full lg:max-w-150">
      <div className="relative flex min-h-8 grow items-center gap-1 rounded-lg bg-[#487EBD] px-2 sm:min-h-9 sm:gap-1.5 sm:rounded-xl sm:px-4">
        <Search className="size-4 shrink-0 cursor-pointer sm:size-5" />
        <Input
          value={search}
          onChange={handleChangeInput}
          type="text"
          aria-label="Search for topic"
          placeholder="Topic..."
          className="no-focus border-none bg-transparent text-xs shadow-none outline-none sm:text-sm"
        />
      </div>
    </div>
  );
};

export default GlobalSearch;
