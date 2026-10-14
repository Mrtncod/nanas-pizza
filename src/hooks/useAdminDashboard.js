import { useQuery } from "@tanstack/react-query";
import { getAdminDashboardOrders } from "../services/adminService";

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard", "orders"],
    queryFn: getAdminDashboardOrders,
  });
}
