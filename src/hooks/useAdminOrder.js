import { useQuery } from "@tanstack/react-query";

import { getAdminOrderById } from "../services/adminService";

export function useAdminOrder(orderId) {
  return useQuery({
    queryKey: ["admin", "orders", orderId],
    queryFn: () => getAdminOrderById(orderId),
    enabled: Boolean(orderId),
  });
}
