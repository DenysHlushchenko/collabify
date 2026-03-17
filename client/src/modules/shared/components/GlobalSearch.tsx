import { Search } from "lucide-react";
import { Input } from "./ui/Input";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formUrlQuery, removeUrlQuery } from "../lib";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { Button } from "./ui/Button";

const GlobalSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search");
  const [search, setSearch] = useState(query || "");
  const [popupOpen, setPopupOpen] = useState(false);

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
      {/* Desktop view */}
      <div className="relative hidden min-h-8 grow items-center gap-1 rounded-lg bg-[#487EBD] px-2 sm:flex sm:min-h-9 sm:gap-1.5 sm:rounded-xl sm:px-4">
        <Search className="size-4 shrink-0 cursor-pointer sm:size-5" />
        <Input
          value={search}
          onChange={handleChangeInput}
          type="text"
          aria-label="Search for topic"
          placeholder="Search by post title or tag..."
          className="no-focus border-none bg-transparent text-base shadow-none outline-none sm:text-sm"
        />
      </div>

      {/* Mobile view */}
      <div className="sm:hidden">
        <Popover open={popupOpen} onOpenChange={setPopupOpen}>
          <PopoverTrigger asChild>
            <Button className="relative cursor-pointer" size="sm" aria-label="Search">
              <Search className="size-4 shrink-0 cursor-pointer" />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-screen max-w-none border-none sm:hidden"
            side="bottom"
            align="start"
            sideOffset={4}
          >
            <div className="flex items-center gap-2 rounded-lg bg-[#487EBD] px-3 py-2 text-white">
              <Input
                value={search}
                onChange={handleChangeInput}
                type="text"
                autoFocus
                aria-label="Search for topic"
                placeholder="Search by post title or tag..."
                className="no-focus w-full border-none bg-transparent text-base shadow-none outline-none placeholder:text-white/70"
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default GlobalSearch;
