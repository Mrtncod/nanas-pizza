import { useQuery } from "@tanstack/react-query";
import { getAdminRevenueAnalytics } from "../services/adminService";

export function useAdminRevenue(period) {
  return useQuery({
    queryKey: ["admin", "revenue", period],
    queryFn: () => getAdminRevenueAnalytics(period),
  });
}
