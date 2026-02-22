import { useAuthStore } from "@/modules/auth/store/userStore";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/user";

export function useCurrentUser() {
  const { getUser } = useAuthStore();
  const id = getUser()?.id;

  const query = useQuery({
    queryKey: ["current-user", id],
    queryFn: () => getCurrentUser(id!),
    enabled: !!id,
  });

  return query;
}
