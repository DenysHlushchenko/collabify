import { useNavigate, useSearchParams } from "react-router-dom";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";
import { formUrlQuery, removeUrlQuery } from "../lib";
import { postsFilters } from "./constants/links";

const Filters = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter");

  const handleChange = (value: string) => {
    const newValue = value || undefined;
    let newUrl: string;

    if (newValue) {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: newValue,
      });
    } else {
      newUrl = removeUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ["filter"],
      });
    }
    navigate(newUrl, { replace: true });
  };

  return (
    <div>
      <Select onValueChange={handleChange} value={filter || ""}>
        <SelectTrigger aria-label="Filter options" className="w-35 border-none bg-[#e8edf3] hover:bg-[#f2f6fa]">
          <SelectValue placeholder="Select a filter" />
        </SelectTrigger>

        <SelectContent className="bg-white">
          <SelectGroup>
            {postsFilters.map((filter) => (
              <SelectItem key={filter.value} value={filter.value} className="hover:bg-[#f2f6fa]">
                {filter.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filters;
