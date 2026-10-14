import { useQuery } from "@tanstack/react-query";
import { getStaffProfile } from "../services/staffService";

export function useStaffProfile(userId) {
  return useQuery({
    queryKey: ["staff", "profile", userId],
    queryFn: () => getStaffProfile(userId),
    enabled: Boolean(userId),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}
