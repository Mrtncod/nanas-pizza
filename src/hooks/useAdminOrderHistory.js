import { useQuery } from "@tanstack/react-query";

import { getAdminOrderHistory } from "../services/adminService";

export function useAdminOrderHistory(orderId) {
  return useQuery({
    queryKey: ["admin", "orders", orderId, "history"],
    queryFn: () => getAdminOrderHistory(orderId),
    enabled: Boolean(orderId),
  });
}
