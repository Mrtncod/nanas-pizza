import { useQuery } from "@tanstack/react-query";
import { getStaffOrderDetails } from "../services/staffService";

export function useStaffOrderDetails(orderId) {
  return useQuery({
    queryKey: ["staff", "order", orderId],
    queryFn: () => getStaffOrderDetails(orderId),
    enabled: Boolean(orderId),
  });
}
