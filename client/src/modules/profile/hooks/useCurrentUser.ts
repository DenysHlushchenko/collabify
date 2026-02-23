import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/user";

export function useCurrentUser(id: number) {
  const query = useQuery({
    queryKey: ["current-user", id],
    queryFn: () => getCurrentUser(id!),
    enabled: !!id,
  });

  return query;
}
